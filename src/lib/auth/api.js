// Tarayıcıdan doğrudan backend'e giden çağrılar için ortak yardımcılar.
// Kayıt isteği bilerek tarayıcıdan gider: backend IP kontrolünü CF-Connecting-IP ile
// yapar, istek Next sunucusundan geçseydi her kayıt sunucunun IP'si ile görünürdü.
//
// Backend (gateway) adresi yalnızca ortam değişkeninden gelir: NEXT_PUBLIC_API_URL.
// NEXT_PUBLIC_* build sırasında bundle'a gömülür -> lokal: .env.local, CI: GitHub
// Environment var'ı (docker --build-arg). Tanımlı değilse build/uygulama hata verir.
const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!configuredApiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL tanımlı değil (.env.local veya build-arg ile verin)");
}
export const API_URL = configuredApiUrl.replace(/\/+$/, "");

const GENERIC_ERROR = "Bir hata oluştu. Lütfen tekrar deneyin.";

/** Backend'in ErrorResponse gövdesinden kullanıcıya gösterilecek hatayı çıkarır. */
export async function readApiError(response, fallback = GENERIC_ERROR) {
  const body = await response.json().catch(() => null);
  return {
    status: response.status,
    code: body?.errorCode ?? null,
    message: body?.message || fallback,
  };
}

export async function postJson(path, payload) {
  return fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getJson(path) {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) throw new Error(`GET ${path} ${response.status}`);
  return response.json();
}
