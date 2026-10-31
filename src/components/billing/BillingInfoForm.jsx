"use client";
import { useState } from "react";
import { Building, User } from "lucide-react";
import { Alert, Field, SubmitButton, TextInput } from "../auth/FormControls";
import { billingApi } from "../../lib/billing/billingApi";
import { normalizePhone, validateEmail, validateMobilePhone } from "../../lib/auth/validation";

export const BILLING_FIELDS = [
  "invoiceType",
  "firstName",
  "lastName",
  "identityNumber",
  "companyTitle",
  "taxNumber",
  "taxOffice",
  "email",
  "phone",
  "address",
  "city",
  "district",
];

/** Kayıtlı fatura bilgisi yoksa kullanıcı ve eczane kaydından doldurulur. */
export function initialBillingForm(info, profile, pharmacy) {
  if (info) {
    const form = Object.fromEntries(BILLING_FIELDS.map((key) => [key, info[key] ?? ""]));
    form.invoiceType = info.invoiceType || "INDIVIDUAL";
    form.phone = normalizePhone(form.phone).replace(/^90/, "0");
    if (!form.companyTitle) form.companyTitle = pharmacy?.name || "";
    return form;
  }
  const [firstName, ...rest] = (profile?.displayName || "").trim().split(/\s+/);
  return {
    invoiceType: "INDIVIDUAL",
    firstName: firstName || "",
    lastName: rest.join(" "),
    identityNumber: "",
    companyTitle: pharmacy?.name || "",
    taxNumber: "",
    taxOffice: "",
    email: profile?.email || "",
    phone: normalizePhone(profile?.phone || ""),
    address: pharmacy?.address || "",
    city: pharmacy?.addressInfo?.cityName || pharmacy?.city?.name || "",
    district: pharmacy?.addressInfo?.districtName || pharmacy?.district?.name || "",
  };
}

export function validateBilling(form) {
  const corporate = form.invoiceType === "CORPORATE";
  const required = (value, message) => (String(value ?? "").trim() ? null : message);
  return {
    firstName: required(form.firstName, corporate ? "Yetkili kişinin adı zorunludur" : "Ad zorunludur"),
    lastName: required(form.lastName, corporate ? "Yetkili kişinin soyadı zorunludur" : "Soyad zorunludur"),
    identityNumber: corporate || /^[1-9]\d{10}$/.test(form.identityNumber) ? null : "TC kimlik numarası 11 haneli olmalıdır",
    companyTitle: corporate ? required(form.companyTitle, "Firma unvanı zorunludur") : null,
    taxNumber: !corporate || /^\d{10}$/.test(form.taxNumber) ? null : "Vergi numarası 10 haneli olmalıdır",
    taxOffice: corporate ? required(form.taxOffice, "Vergi dairesi zorunludur") : null,
    email: validateEmail(form.email.trim()),
    phone: validateMobilePhone(form.phone),
    address: required(form.address, "Fatura adresi zorunludur"),
    city: required(form.city, "İl zorunludur"),
  };
}

export const hasErrors = (errors) => Object.values(errors).some(Boolean);

export function toBillingPayload(form) {
  const corporate = form.invoiceType === "CORPORATE";
  const value = (key) => (String(form[key] ?? "").trim() || null);
  return {
    invoiceType: form.invoiceType,
    firstName: value("firstName"),
    lastName: value("lastName"),
    identityNumber: corporate ? null : value("identityNumber"),
    companyTitle: corporate ? value("companyTitle") : null,
    taxNumber: corporate ? value("taxNumber") : null,
    taxOffice: value("taxOffice"),
    email: value("email"),
    phone: value("phone"),
    address: value("address"),
    city: value("city"),
    district: value("district"),
  };
}

function TypeOption({ icon: Icon, title, hint, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex flex-1 items-start gap-3 rounded-xl border-2 p-3.5 text-left transition-colors ${
        selected ? "border-[#17C6A3] bg-[#E6FFF9]" : "border-slate-200 bg-white hover:border-[#17C6A3]/50"
      }`}
    >
      <span
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? "border-[#00A58E]" : "border-slate-300"
        }`}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-[#00A58E]" />}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
          <Icon size={15} className="text-slate-500" aria-hidden="true" /> {title}
        </span>
        <span className="mt-0.5 block text-xs text-slate-500">{hint}</span>
      </span>
    </button>
  );
}

function Section({ title, children }) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</legend>
      {children}
    </fieldset>
  );
}

/** Fatura formunun tüm alanları: fatura tipi, fatura sahibi, iletişim ve adres. */
export function BillingFields({ form, errors, onChange, idPrefix = "bi" }) {
  const corporate = form.invoiceType === "CORPORATE";
  const handle = (e) => {
    const { name, value } = e.target;
    let next = value;
    if (name === "phone") next = normalizePhone(value).slice(0, 11);
    else if (name === "identityNumber") next = value.replace(/\D/g, "").slice(0, 11);
    else if (name === "taxNumber") next = value.replace(/\D/g, "").slice(0, 10);
    onChange(name, next);
  };
  const id = (name) => `${idPrefix}-${name}`;
  const props = (name) => ({ id: id(name), name, value: form[name] ?? "", onChange: handle, error: errors[name] });

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-3 sm:flex-row">
        <TypeOption
          icon={User}
          title="Bireysel"
          hint="TC kimlik numarasıyla fatura"
          selected={!corporate}
          onSelect={() => onChange("invoiceType", "INDIVIDUAL")}
        />
        <TypeOption
          icon={Building}
          title="Kurumsal"
          hint="Vergi numarasıyla firma faturası"
          selected={corporate}
          onSelect={() => onChange("invoiceType", "CORPORATE")}
        />
      </div>

      {corporate ? (
        <Section title="Firma bilgileri">
          <Field id={id("companyTitle")} label="Firma unvanı" error={errors.companyTitle}>
            <TextInput {...props("companyTitle")} autoComplete="organization" placeholder="ör. Şifa Eczanesi" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id={id("taxNumber")} label="Vergi numarası" error={errors.taxNumber}>
              <TextInput {...props("taxNumber")} inputMode="numeric" maxLength={10} placeholder="10 haneli" />
            </Field>
            <Field id={id("taxOffice")} label="Vergi dairesi" error={errors.taxOffice}>
              <TextInput {...props("taxOffice")} placeholder="ör. Kadıköy" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id={id("firstName")} label="Yetkili adı" error={errors.firstName}>
              <TextInput {...props("firstName")} autoComplete="given-name" />
            </Field>
            <Field id={id("lastName")} label="Yetkili soyadı" error={errors.lastName}>
              <TextInput {...props("lastName")} autoComplete="family-name" />
            </Field>
          </div>
        </Section>
      ) : (
        <Section title="Fatura sahibi">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id={id("firstName")} label="Ad" error={errors.firstName}>
              <TextInput {...props("firstName")} autoComplete="given-name" />
            </Field>
            <Field id={id("lastName")} label="Soyad" error={errors.lastName}>
              <TextInput {...props("lastName")} autoComplete="family-name" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id={id("identityNumber")} label="TC kimlik numarası" error={errors.identityNumber}>
              <TextInput {...props("identityNumber")} inputMode="numeric" maxLength={11} placeholder="11 haneli" />
            </Field>
            <Field id={id("taxOffice")} label="Vergi dairesi" error={errors.taxOffice} hint="İsteğe bağlı">
              <TextInput {...props("taxOffice")} placeholder="ör. Kadıköy" />
            </Field>
          </div>
        </Section>
      )}

      <Section title="İletişim">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id={id("email")} label="E-posta" error={errors.email} hint="Fatura bu adrese gönderilir">
            <TextInput {...props("email")} type="email" autoComplete="email" />
          </Field>
          <Field id={id("phone")} label="Cep telefonu" error={errors.phone}>
            <TextInput {...props("phone")} type="tel" inputMode="numeric" placeholder="05XXXXXXXXX" autoComplete="tel" />
          </Field>
        </div>
      </Section>

      <Section title="Fatura adresi">
        <Field id={id("address")} label="Adres" error={errors.address}>
          <TextInput {...props("address")} autoComplete="street-address" placeholder="Mahalle, cadde, sokak, no" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id={id("city")} label="İl" error={errors.city}>
            <TextInput {...props("city")} autoComplete="address-level1" />
          </Field>
          <Field id={id("district")} label="İlçe" error={errors.district} hint="İsteğe bağlı">
            <TextInput {...props("district")} autoComplete="address-level2" />
          </Field>
        </div>
      </Section>
    </div>
  );
}

/** Kısa fatura özeti (kimlik numaraları maskeli). */
export function BillingSummary({ form }) {
  const corporate = form.invoiceType === "CORPORATE";
  const mask = (value) => (value ? `•••••${value.slice(-4)}` : null);
  return (
    <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
      <div>
        <dt className="text-xs text-slate-400">{corporate ? "Kurumsal fatura" : "Bireysel fatura"}</dt>
        <dd className="font-semibold text-slate-900">
          {corporate ? form.companyTitle : `${form.firstName} ${form.lastName}`.trim()}
        </dd>
        <dd className="text-slate-500">
          {corporate
            ? `VKN ${mask(form.taxNumber)} · ${form.taxOffice} VD`
            : [`TCKN ${mask(form.identityNumber)}`, form.taxOffice && `${form.taxOffice} VD`].filter(Boolean).join(" · ")}
        </dd>
      </div>
      <div>
        <dt className="text-xs text-slate-400">İletişim ve adres</dt>
        <dd className="text-slate-700">{form.email}</dd>
        <dd className="text-slate-500">{form.phone}</dd>
        <dd className="text-slate-500">{[form.address, form.district, form.city].filter(Boolean).join(", ")}</dd>
      </div>
    </dl>
  );
}

/** Hesabım > Paketim'deki "Fatura bilgileri" kartının düzenleme formu. */
export default function BillingInfoForm({ initial, submitLabel = "Kaydet", onSaved, onCancel }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const onChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validateBilling(form);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    setSaving(true);
    setStatus(null);
    const result = await billingApi.saveBillingInfo(toBillingPayload(form));
    setSaving(false);
    if (result.ok) {
      onSaved(result.data);
      return;
    }
    if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) setErrors(result.fieldErrors);
    setStatus(result.message);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {status && <Alert>{status}</Alert>}
      <BillingFields form={form} errors={errors} onChange={onChange} />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="min-h-12 rounded-xl border border-slate-200 px-6 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Vazgeç
          </button>
        )}
        <div className="sm:w-auto">
          <SubmitButton loading={saving}>{submitLabel}</SubmitButton>
        </div>
      </div>
    </form>
  );
}
