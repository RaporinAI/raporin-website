"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, MailCheck } from "lucide-react";
import AuthShell, { AuthLink } from "../../components/auth/AuthShell";
import { Alert, Field, PasswordInput, SelectInput, SubmitButton, TextInput } from "../../components/auth/FormControls";
import ResendVerification from "../../components/auth/ResendVerification";
import { postJson, readApiError } from "../../lib/auth/api";
import { useLocationOptions } from "../../lib/auth/useLocationOptions";
import {
  validateEmail,
  validateGln,
  normalizePhone,
  validatePharmacyPhone,
  validateMobilePhone,
  validatePassword,
} from "../../lib/auth/validation";
import { trackSignUp } from "../../lib/analytics";

const TERMS_URL = "/kvkk/kullanim-kosullari-ve-uyelik-sozlesmesi";
const PRIVACY_URL = "/kvkk/eczaneler-icin-aydinlatma-metni";

const STEP_FIELDS = {
  1: ["displayName", "email", "phone", "password"],
  2: ["pharmacyName", "gln", "pharmacyPhone", "cityId", "districtId", "neighborhoodId", "address", "terms", "privacy"],
};

// Backend hata kodlarının hangi alana ait olduğu; eşleşmeyenler formun üstünde gösterilir.
const ERROR_FIELDS = {
  REG_002: "email",
  REG_003: "password",
  REG_008: "gln",
  REG_009: "gln",
  LOC_001: "cityId",
  LOC_002: "districtId",
  LOC_003: "neighborhoodId",
  LOC_004: "neighborhoodId",
};

const PHONE_FIELDS = ["phone", "pharmacyPhone"];
const PHONE_LENGTH = 11;

const initialForm = {
  displayName: "",
  email: "",
  phone: "",
  password: "",
  pharmacyName: "",
  gln: "",
  pharmacyPhone: "",
  cityId: "",
  districtId: "",
  neighborhoodId: "",
  address: "",
  terms: false,
  privacy: false,
};

function validateField(name, form) {
  const value = form[name];
  switch (name) {
    case "displayName": return value.trim() ? null : "Ad soyad zorunludur";
    case "email": return validateEmail(value.trim());
    case "phone": return validateMobilePhone(value);
    case "password": return validatePassword(value);
    case "pharmacyName": return value.trim() ? null : "Eczane adı zorunludur";
    case "gln": return validateGln(value);
    case "pharmacyPhone": return validatePharmacyPhone(value);
    case "cityId": return value ? null : "İl seçimi zorunludur";
    case "districtId": return value ? null : "İlçe seçimi zorunludur";
    case "neighborhoodId": return value ? null : "Mahalle seçimi zorunludur";
    case "address": return value.trim() ? null : "Açık adres zorunludur";
    case "terms": return value ? null : "Kullanım Koşulları ve Üyelik Sözleşmesi'ni kabul etmelisiniz";
    case "privacy": return value ? null : "Aydınlatma metnini okuduğunuzu onaylamalısınız";
    default: return null;
  }
}

function StepIndicator({ step }) {
  const steps = ["Hesap bilgileri", "Eczane bilgileri"];
  return (
    <ol className="mb-8 flex items-center gap-3 text-xs font-semibold sm:text-sm">
      {steps.map((label, index) => {
        const number = index + 1;
        const active = number === step;
        const done = number < step;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${
                active || done ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              {done ? "✓" : number}
            </span>
            <span className={active ? "text-slate-900" : "text-slate-400"}>{label}</span>
            {number < steps.length && <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState(null);
  const formRef = useRef(null);

  const { cities, districts, neighborhoods, loadError } = useLocationOptions(form.cityId, form.districtId);

  const update = (name, value) => {
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "cityId") Object.assign(next, { districtId: "", neighborhoodId: "" });
      if (name === "districtId") next.neighborhoodId = "";
      return next;
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (PHONE_FIELDS.includes(name)) {
      // Yalnızca rakam: harf/boşluk yazılamaz, yapıştırılan "0532 123 45 67" de rakamlara iner.
      update(name, normalizePhone(value).slice(0, PHONE_LENGTH));
      return;
    }
    update(name, type === "checkbox" ? checked : value);
  };

  const onBlur = (e) => {
    const { name } = e.target;
    const value = form[name];
    if (typeof value === "string" && value === "") return; // Boş alan için gönderimde uyar
    setErrors((prev) => ({ ...prev, [name]: validateField(name, form) }));
  };

  const validateStep = (stepNumber) => {
    const stepErrors = {};
    for (const name of STEP_FIELDS[stepNumber]) {
      const error = validateField(name, form);
      if (error) stepErrors[name] = error;
    }
    setErrors((prev) => ({ ...prev, ...stepErrors }));
    const firstInvalid = STEP_FIELDS[stepNumber].find((name) => stepErrors[name]);
    if (firstInvalid) formRef.current?.querySelector(`[name="${firstInvalid}"]`)?.focus();
    return !firstInvalid;
  };

  const goToStep = (target) => {
    setStep(target);
    setFormError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const register = async () => {
    setSubmitting(true);
    setFormError("");
    try {
      const response = await postJson("/api/auth/register-pharmacy", {
        email: form.email.trim(),
        password: form.password,
        displayName: form.displayName.trim(),
        phone: normalizePhone(form.phone),
        pharmacyName: form.pharmacyName.trim(),
        gln: form.gln.replace(/\s/g, ""),
        pharmacyAddress: form.address.trim(),
        pharmacyPhone: normalizePhone(form.pharmacyPhone) || undefined,
        cityId: Number(form.cityId),
        districtId: Number(form.districtId),
        neighborhoodId: Number(form.neighborhoodId),
        termsAndConditionsAccepted: form.terms,
        privacyPolicyAccepted: form.privacy,
      });

      if (response.ok) {
        // useSearchParams yerine: sayfanın sunucuda tam HTML olarak render edilmesi (SEO) için.
        trackSignUp(new URLSearchParams(window.location.search).get("kaynak"), {
          email: form.email,
          phone: form.phone,
          fullName: form.displayName,
        });
        setRegisteredEmail(form.email.trim());
        window.scrollTo({ top: 0 });
        return;
      }

      const { code, message } = await readApiError(response, "Kayıt tamamlanamadı. Lütfen tekrar deneyin.");
      const field = ERROR_FIELDS[code];
      if (field) {
        setErrors((prev) => ({ ...prev, [field]: message }));
        if (STEP_FIELDS[1].includes(field)) goToStep(1);
      } else {
        setFormError(message);
      }
    } catch {
      setFormError("Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(step)) return;
    if (step === 1) goToStep(2);
    else register();
  };

  if (registeredEmail) {
    return (
      <AuthShell betaBanner title="E-postanızı doğrulayın" footer={<>Doğruladıktan sonra e-posta adresiniz ve şifrenizle <AuthLink href="/giris">giriş yapın</AuthLink>, ardından uygulamayı indirin.</>}>
        <div className="flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
            <MailCheck size={32} aria-hidden="true" />
          </span>
          <p className="mt-6 text-slate-600">
            Hesabınız oluşturuldu. <strong className="text-slate-900">{registeredEmail}</strong> adresine
            bir aktivasyon linki gönderdik.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Link 30 dakika geçerlidir. Gelen kutunuzda göremezseniz gereksiz ve spam klasörlerini de kontrol edin.
          </p>
          <div className="mt-6">
            <ResendVerification email={registeredEmail} />
          </div>
        </div>
      </AuthShell>
    );
  }

  const fieldProps = (name) => ({ id: name, value: form[name], onChange, onBlur, error: errors[name] });

  return (
    <AuthShell
      betaBanner
      title="Ücretsiz hesap oluşturun"
      subtitle="Kredi kartı gerekmez. Kayıt sonrası masaüstü uygulamasını indirebilirsiniz."
      footer={<>Zaten hesabınız var mı? <AuthLink href="/giris">Giriş yapın</AuthLink></>}
    >
      <StepIndicator step={step} />
      <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5">
        {formError && <Alert>{formError}</Alert>}

        {step === 1 && (
          <>
            <Field id="displayName" label="Ad soyad" error={errors.displayName}>
              <TextInput {...fieldProps("displayName")} autoComplete="name" autoFocus />
            </Field>
            <Field id="email" label="E-posta" error={errors.email} hint="Aktivasyon linki bu adrese gönderilecek; giriş de bu adresle yapılır">
              <TextInput {...fieldProps("email")} type="email" autoComplete="email" inputMode="email" />
            </Field>
            <Field id="phone" label="Cep telefonu" error={errors.phone}>
              <TextInput {...fieldProps("phone")} type="tel" autoComplete="tel" inputMode="numeric" placeholder="05XXXXXXXXX" />
            </Field>
            <Field id="password" label="Şifre" error={errors.password} hint="En az 8 karakter, en az bir harf ve bir rakam">
              <PasswordInput {...fieldProps("password")} autoComplete="new-password" />
            </Field>
            <SubmitButton>
              Devam et <ArrowRight size={18} aria-hidden="true" />
            </SubmitButton>
          </>
        )}

        {step === 2 && (
          <>
            <Field id="pharmacyName" label="Eczane adı" error={errors.pharmacyName}>
              <TextInput {...fieldProps("pharmacyName")} autoComplete="organization" autoFocus />
            </Field>
            <Field id="gln" label="Eczane GLN numarası" error={errors.gln} hint="ITS tarafından verilen, 868 veya 869 ile başlayan 13 haneli numara">
              <TextInput {...fieldProps("gln")} inputMode="numeric" maxLength={16} />
            </Field>
            <Field id="pharmacyPhone" label="Eczane telefonu" error={errors.pharmacyPhone} hint="İsteğe bağlı">
              <TextInput {...fieldProps("pharmacyPhone")} type="tel" inputMode="numeric" placeholder="0XXXXXXXXXX" />
            </Field>
            {loadError && <Alert>İl, ilçe veya mahalle listesi yüklenemedi. Sayfayı yenileyip tekrar deneyin.</Alert>}
            <div className="grid gap-5 sm:grid-cols-3">
              <Field id="cityId" label="İl" error={errors.cityId}>
                <SelectInput {...fieldProps("cityId")}>
                  <option value="">Seçin</option>
                  {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </SelectInput>
              </Field>
              <Field id="districtId" label="İlçe" error={errors.districtId}>
                <SelectInput {...fieldProps("districtId")} disabled={!form.cityId}>
                  <option value="">Seçin</option>
                  {districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </SelectInput>
              </Field>
              <Field id="neighborhoodId" label="Mahalle" error={errors.neighborhoodId}>
                <SelectInput {...fieldProps("neighborhoodId")} disabled={!form.districtId}>
                  <option value="">Seçin</option>
                  {neighborhoods.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
                </SelectInput>
              </Field>
            </div>
            <Field id="address" label="Açık adres" error={errors.address}>
              <TextInput {...fieldProps("address")} autoComplete="street-address" placeholder="Cadde, sokak, bina no" />
            </Field>

            <div className="space-y-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <label className="flex items-start gap-3">
                <input type="checkbox" name="terms" checked={form.terms} onChange={onChange} className="mt-0.5 h-4 w-4 shrink-0 accent-teal-600" />
                <span>
                  <a href={TERMS_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-teal-700 underline">Kullanım Koşulları ve Üyelik Sözleşmesi</a>&apos;ni okudum, kabul ediyorum.
                </span>
              </label>
              {errors.terms && <p className="pl-7 text-xs text-red-600">{errors.terms}</p>}
              <label className="flex items-start gap-3">
                <input type="checkbox" name="privacy" checked={form.privacy} onChange={onChange} className="mt-0.5 h-4 w-4 shrink-0 accent-teal-600" />
                <span>
                  Kişisel verilerimin işlenmesine ilişkin <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-teal-700 underline">Aydınlatma Metni</a>&apos;ni okudum.
                </span>
              </label>
              {errors.privacy && <p className="pl-7 text-xs text-red-600">{errors.privacy}</p>}
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-600 hover:bg-slate-50 sm:w-auto"
              >
                <ArrowLeft size={18} aria-hidden="true" /> Geri
              </button>
              <SubmitButton loading={submitting}>Hesabımı oluştur</SubmitButton>
            </div>
          </>
        )}
      </form>
    </AuthShell>
  );
}
