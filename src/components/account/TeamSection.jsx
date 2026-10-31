"use client";
import { useEffect, useState } from "react";
import { ChevronRight, Download, KeyRound, Loader2, Monitor, Trash2, UserPlus, Users, Wallet, X } from "lucide-react";
import AccountCard from "./AccountCard";
import { Alert, Field, PasswordInput, SelectInput, SubmitButton, TextInput } from "../auth/FormControls";
import { accountRequest } from "../../lib/auth/accountApi";
import { normalizePhone, validateEmail, validateMobilePhone } from "../../lib/auth/validation";
import { DOWNLOAD_URL } from "../../lib/download";
import { trackDownload } from "../../lib/analytics";

// Backend PharmacyTitle ile aynı. Baş Eczacı yönetici yetkisi alır (ekip ve eczane bilgilerini yönetir).
const TITLES = [
  { code: "ECZACI", label: "Eczacı" },
  { code: "TEKNISYEN", label: "Teknisyen" },
  { code: "STAJYER", label: "Stajyer" },
  { code: "BAS_ECZACI", label: "Baş Eczacı (yönetici)" },
];
const MAX_MEMBERS = 10;

const dateFormatter = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", year: "numeric" });

/** Ekip üyesi şifresi için backend kuralı: en az 8 karakter, küçük harf, büyük harf ve rakam. */
function validateMemberPassword(value) {
  if (!value) return "Şifre zorunludur";
  if (value.length < 8) return "Şifre en az 8 karakter olmalıdır";
  if (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/\d/.test(value)) {
    return "Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir";
  }
  return null;
}

/** Kurala uyan, okunması kolay (karışan karakterler çıkarılmış) 10 karakterlik şifre. */
function generatePassword() {
  const sets = ["abcdefghjkmnpqrstuvwxyz", "ABCDEFGHJKMNPQRSTUVWXYZ", "23456789"];
  const all = sets.join("");
  const random = (max) => crypto.getRandomValues(new Uint32Array(1))[0] % max;
  const chars = sets.map((set) => set[random(set.length)]);
  while (chars.length < 10) chars.push(all[random(all.length)]);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = random(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

function initials(name) {
  return (name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toLocaleUpperCase("tr-TR"))
    .join("");
}

const emptyMember = { displayName: "", email: "", phone: "", title: "ECZACI", password: "" };

/**
 * Ekip kartının başındaki kısa açıklama: üye eklemek ücretsiz, uygulama eczanedeki her bilgisayara kurulabilir,
 * herkes kendi hesabıyla girer ve eczanenin kredisini ortak kullanır. Eczacının okuyacağı dilde, teknik değil.
 */
function TeamIntro({ canManage }) {
  const items = [
    {
      icon: Users,
      title: "Ekip üyesi eklemek ücretsiz",
      text: `Eczanenize ${MAX_MEMBERS} kişiye kadar üye ekleyebilirsiniz; her üye için ayrıca ödeme yapmazsınız.`,
    },
    {
      icon: Monitor,
      title: "Her bilgisayarda kullanın",
      text: "Uygulamayı eczanedeki istediğiniz kadar bilgisayara kurun. Her çalışan kendi bilgisayarında, kendi e-postası ve şifresiyle giriş yapar.",
    },
    {
      icon: Wallet,
      title: "Kredi ortak",
      text: "Tüm ekip eczanenizin paketini ve kredisini birlikte kullanır; çalışanlarınız için ayrı paket almanız gerekmez.",
    },
  ];
  return (
    <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/70 to-white p-4 sm:p-5">
      <ul className="grid gap-4 sm:grid-cols-3">
        {items.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-teal-600 shadow-sm">
              <Icon size={17} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{text}</p>
            </div>
          </li>
        ))}
      </ul>
      {canManage && (
        <p className="mt-4 flex flex-col gap-2 border-t border-teal-100 pt-3 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>
            <span className="font-semibold text-slate-800">Nasıl eklerim?</span> &quot;Üye ekle&quot;ye basın, çalışanınızın
            bilgilerini ve bir şifre girin, şifreyi kendisine iletin. Çalışanınız uygulamayı kendi bilgisayarına kurup bu
            bilgilerle giriş yapar. &quot;Baş Eczacı&quot; ünvanı verdiğiniz kişi ekibi ve paketi de yönetebilir.
          </span>
          <a
            href={DOWNLOAD_URL}
            onClick={() => trackDownload(DOWNLOAD_URL)}
            className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-teal-700 hover:underline"
          >
            <Download size={14} aria-hidden="true" /> Uygulamayı indir
          </a>
        </p>
      )}
    </div>
  );
}

function AddMemberForm({ onCancel, onCreated }) {
  const [form, setForm] = useState(emptyMember);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  // Oluşturulan şifre yöneticinin üyeye iletebilmesi için açık gösterilir (alan yeniden kurularak).
  const [generatedCount, setGeneratedCount] = useState(0);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "phone" ? normalizePhone(value).slice(0, 11) : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {
      displayName: form.displayName.trim().length >= 2 ? null : "Ad soyad en az 2 karakter olmalıdır",
      email: validateEmail(form.email.trim()),
      phone: form.phone ? validateMobilePhone(form.phone) : null,
      password: validateMemberPassword(form.password),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSaving(true);
    setFormError("");
    const result = await accountRequest(
      "team",
      {
        displayName: form.displayName.trim(),
        email: form.email.trim(),
        phone: form.phone || undefined,
        title: form.title,
        password: form.password,
      },
      "POST"
    );
    setSaving(false);

    if (result.ok) {
      onCreated(result.data);
      return;
    }
    if (result.code === "REG_002") {
      setErrors({ email: result.message });
    } else if (Object.keys(result.fieldErrors ?? {}).length) {
      setErrors(result.fieldErrors);
    } else {
      setFormError(result.message);
    }
  };

  const props = (name) => ({ id: `member-${name}`, name, value: form[name], onChange, error: errors[name] });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-2xl border border-teal-100 bg-teal-50/40 p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Yeni ekip üyesi</h3>
        <button type="button" onClick={onCancel} aria-label="Vazgeç" className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-600">
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      {formError && <Alert>{formError}</Alert>}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="member-displayName" label="Ad soyad" error={errors.displayName}>
          <TextInput {...props("displayName")} autoComplete="off" autoFocus />
        </Field>
        <Field id="member-email" label="E-posta" error={errors.email} hint="Üye bu adresle giriş yapar">
          <TextInput {...props("email")} type="email" autoComplete="off" />
        </Field>
        <Field id="member-phone" label="Cep telefonu" error={errors.phone} hint="İsteğe bağlı">
          <TextInput {...props("phone")} type="tel" inputMode="numeric" placeholder="05XXXXXXXXX" autoComplete="off" />
        </Field>
        <Field id="member-title" label="Ünvan" error={errors.title}>
          <SelectInput {...props("title")}>
            {TITLES.map((t) => <option key={t.code} value={t.code}>{t.label}</option>)}
          </SelectInput>
        </Field>
      </div>
      <Field id="member-password" label="Başlangıç şifresi" error={errors.password} hint="En az 8 karakter; küçük harf, büyük harf ve rakam içermeli">
        <div className="flex gap-2">
          <div className="flex-1">
            <PasswordInput
              key={generatedCount}
              {...props("password")}
              initiallyVisible={generatedCount > 0}
              autoComplete="new-password"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setForm((prev) => ({ ...prev, password: generatePassword() }));
              setGeneratedCount((n) => n + 1);
              setErrors((prev) => ({ ...prev, password: null }));
            }}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <KeyRound size={15} aria-hidden="true" /> Oluştur
          </button>
        </div>
      </Field>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="min-h-12 rounded-xl border border-slate-200 bg-white px-6 font-semibold text-slate-600 hover:bg-slate-50">
          Vazgeç
        </button>
        <div className="sm:w-auto">
          <SubmitButton loading={saving}>Üyeyi ekle</SubmitButton>
        </div>
      </div>
    </form>
  );
}

function toMemberForm(member) {
  return {
    displayName: member.displayName || "",
    email: member.email || "",
    phone: normalizePhone(member.phone || ""),
    title: member.title || "ECZACI",
  };
}

/** Üyeye tıklanınca satırın altında açılan düzenleme paneli; üyeyi çıkarma da buradadır. */
function EditMemberForm({ member, onCancel, onSaved, onDeleted }) {
  const [form, setForm] = useState(() => toMemberForm(member));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const saved = toMemberForm(member);
  const dirty = Object.keys(saved).some((key) => saved[key] !== form[key]);
  const name = member.displayName || member.username;

  const onChange = (e) => {
    const { name: field, value } = e.target;
    setForm((prev) => ({ ...prev, [field]: field === "phone" ? normalizePhone(value).slice(0, 11) : value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {
      displayName: form.displayName.trim().length >= 2 ? null : "Ad soyad en az 2 karakter olmalıdır",
      email: validateEmail(form.email.trim()),
      phone: form.phone ? validateMobilePhone(form.phone) : null,
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSaving(true);
    setFormError("");
    const result = await accountRequest(
      `team/${member.id}`,
      { displayName: form.displayName.trim(), email: form.email.trim(), phone: form.phone, title: form.title },
      "PUT"
    );
    setSaving(false);

    if (result.ok) {
      onSaved(result.data);
    } else if (result.code === "REG_002") {
      setErrors({ email: result.message });
    } else if (Object.keys(result.fieldErrors ?? {}).length) {
      setErrors(result.fieldErrors);
    } else {
      setFormError(result.message);
    }
  };

  const remove = async () => {
    setDeleting(true);
    setFormError("");
    const result = await accountRequest(`team/${member.id}`, undefined, "DELETE");
    setDeleting(false);
    if (result.ok) onDeleted(member.id);
    else setFormError(result.message);
  };

  const props = (field) => ({ id: `edit-${field}`, name: field, value: form[field], onChange, error: errors[field] });

  return (
    <form onSubmit={onSubmit} noValidate className="mt-3 space-y-5 rounded-2xl border border-teal-100 bg-teal-50/40 p-5">
      {formError && <Alert>{formError}</Alert>}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="edit-displayName" label="Ad soyad" error={errors.displayName}>
          <TextInput {...props("displayName")} autoComplete="off" autoFocus />
        </Field>
        <Field id="edit-email" label="E-posta" error={errors.email} hint="Üye bu adresle giriş yapar">
          <TextInput {...props("email")} type="email" autoComplete="off" />
        </Field>
        <Field id="edit-phone" label="Cep telefonu" error={errors.phone} hint="İsteğe bağlı">
          <TextInput {...props("phone")} type="tel" inputMode="numeric" placeholder="05XXXXXXXXX" autoComplete="off" />
        </Field>
        <Field id="edit-title" label="Ünvan" error={errors.title}>
          <SelectInput {...props("title")}>
            {TITLES.map((t) => <option key={t.code} value={t.code}>{t.label}</option>)}
          </SelectInput>
        </Field>
      </div>

      {confirmingDelete ? (
        <div className="flex flex-col gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-red-700">
            <strong>{name}</strong> ekipten çıkarılacak ve hesabı silinecek. Emin misiniz?
          </p>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={() => setConfirmingDelete(false)} className="rounded-lg bg-white px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-50">
              Vazgeç
            </button>
            <button
              type="button"
              onClick={remove}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {deleting && <Loader2 size={14} className="animate-spin" aria-hidden="true" />} Evet, çıkar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col-reverse gap-3 border-t border-teal-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} aria-hidden="true" /> Ekipten çıkar
          </button>
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button type="button" onClick={onCancel} className="min-h-12 rounded-xl border border-slate-200 bg-white px-6 font-semibold text-slate-600 hover:bg-slate-50">
              Vazgeç
            </button>
            <div className="sm:w-auto">
              <SubmitButton loading={saving} disabled={!dirty}>Kaydet</SubmitButton>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

function MemberRow({ member, isSelf, canManage, editing, onEdit, onCloseEdit, onSaved, onDeleted }) {
  const clickable = canManage || isSelf;
  const name = member.displayName || member.username;

  const content = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600">
        {initials(name) || "?"}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-900">
          <span className="truncate">{name}</span>
          {isSelf && <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700">Siz</span>}
          {member.titleDisplay && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">{member.titleDisplay}</span>
          )}
        </span>
        <span className="block truncate text-xs text-slate-500">
          {member.email}
          <span className="text-slate-300"> · </span>
          {member.lastLoginAt ? `Son giriş ${dateFormatter.format(new Date(member.lastLoginAt))}` : "Henüz giriş yapmadı"}
        </span>
      </span>
      {clickable && (
        <ChevronRight
          size={18}
          aria-hidden="true"
          className={`shrink-0 text-slate-300 transition-transform group-hover:text-teal-600 ${editing ? "rotate-90 text-teal-600" : ""}`}
        />
      )}
    </>
  );

  // Kendi bilgileriniz "Kişisel bilgiler" bölümünden düzenlenir (orada e-posta değiştirilemez).
  const onClick = () => {
    if (isSelf) window.location.hash = "kisisel";
    else if (editing) onCloseEdit();
    else onEdit();
  };

  return (
    <li className="py-2">
      {clickable ? (
        <button
          type="button"
          onClick={onClick}
          aria-expanded={isSelf ? undefined : editing}
          aria-label={isSelf ? "Kendi bilgilerinizi düzenleyin" : `${name} bilgilerini düzenle`}
          className={`group -mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-slate-50 ${editing ? "bg-slate-50" : ""}`}
        >
          {content}
        </button>
      ) : (
        <div className="flex items-center gap-3 py-2">{content}</div>
      )}
      {editing && <EditMemberForm member={member} onCancel={onCloseEdit} onSaved={onSaved} onDeleted={onDeleted} />}
    </li>
  );
}

/** Ekip üyeleri: herkes listeyi görür; yalnızca yönetici üye ekler ve siler. */
export default function TeamSection({ profile, canManage }) {
  const [members, setMembers] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    accountRequest("team", undefined, "GET").then((result) => {
      if (cancelled) return;
      if (result.ok) setMembers(result.data ?? []);
      else setLoadError(result.message);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const count = members?.length ?? 0;
  const full = count >= MAX_MEMBERS;

  const onCreated = (member) => {
    setMembers((prev) => [...(prev ?? []), member]);
    setAdding(false);
    setNotice(
      `${member.displayName} ekibe eklendi. ${member.email} adresi ve belirlediğiniz şifreyle masaüstü uygulamasına giriş yapabilir; şifreyi kendisine iletmeyi unutmayın.`
    );
  };

  return (
    <AccountCard
      icon={Users}
      title="Ekip"
      subtitle={members ? `Eczanenizde RaporinAI kullanan kişiler · ${count}/${MAX_MEMBERS} üye` : "Eczanenizde RaporinAI kullanan kişiler"}
    >
      <div className="space-y-5">
        <TeamIntro canManage={canManage} />
        {notice && <Alert tone="success">{notice}</Alert>}

        {canManage && !adding && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              {full
                ? "Üye sınırına ulaşıldı. Yeni üye eklemek için önce bir üyeyi çıkarın."
                : "Düzenlemek için bir üyeye tıklayın. Her çalışan kendi hesabıyla giriş yapar."}
            </p>
            <button
              type="button"
              onClick={() => {
                setAdding(true);
                setEditingId(null);
                setNotice("");
              }}
              disabled={full || !members}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#008C87] to-[#00A58E] px-5 text-sm font-semibold text-white shadow-sm hover:from-teal-800 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <UserPlus size={17} aria-hidden="true" /> Üye ekle
            </button>
          </div>
        )}
        {!canManage && <p className="text-sm text-slate-500">Ekip üyelerini yalnızca eczane yöneticisi ekleyip çıkarabilir.</p>}

        {adding && <AddMemberForm onCancel={() => setAdding(false)} onCreated={onCreated} />}

        {loadError && <Alert>{loadError}</Alert>}
        {!members && !loadError && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-teal-600" aria-label="Ekip yükleniyor" />
          </div>
        )}
        {members && (
          <ul className="divide-y divide-slate-100 border-t border-slate-100">
            {members.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                isSelf={member.username === profile.username}
                canManage={canManage}
                editing={editingId === member.id}
                onEdit={() => {
                  setEditingId(member.id);
                  setNotice("");
                }}
                onCloseEdit={() => setEditingId(null)}
                onSaved={(updated) => {
                  setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
                  setEditingId(null);
                  setNotice(`${updated.displayName} bilgileri güncellendi.`);
                }}
                onDeleted={(id) => {
                  setMembers((prev) => prev.filter((m) => m.id !== id));
                  setEditingId(null);
                  setNotice("Üye ekipten çıkarıldı.");
                }}
              />
            ))}
          </ul>
        )}
      </div>
    </AccountCard>
  );
}
