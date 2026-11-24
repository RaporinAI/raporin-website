// Loglara yazılmadan önce kişisel veriyi maskeler (KVKK): TC kimlik no, telefon, e-posta, kart numarası.
export function redact(text) {
  return String(text ?? "")
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[e-posta]")
    .replace(/\b(?:\d[ -]?){13,19}\b/g, "[numara]")
    .replace(/\b[1-9]\d{10}\b/g, "[tc]")
    .replace(/(?:\+?90[ -]?)?\(?0?5\d{2}\)?[ -]?\d{3}[ -]?\d{2}[ -]?\d{2}\b/g, "[telefon]")
    .replace(/\s+/g, " ")
    .trim();
}
