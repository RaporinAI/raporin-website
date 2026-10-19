// Hesabım sayfasının Next oturum route'larına (/api/session/*) gönderdiği istekler.

const INVALID_CURRENT_PASSWORD = "PROF_011";

/**
 * @returns {Promise<{ ok: true, data: any } | { ok: false, code: string|null, message: string }>}
 * Oturum düşmüşse kullanıcıyı giriş sayfasına yönlendirir.
 */
export async function accountRequest(resource, payload, method = "PUT") {
  let response;
  try {
    response = await fetch(`/api/session/${resource}`, {
      method,
      headers: payload === undefined ? undefined : { "Content-Type": "application/json" },
      body: payload === undefined ? undefined : JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    return { ok: false, code: null, message: "Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edin." };
  }

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  // Backend "mevcut şifre hatalı" için de 401 döner; o durum oturumla ilgili değildir.
  if (response.status === 401 && body?.errorCode !== INVALID_CURRENT_PASSWORD) {
    // Giriş sonrası kullanıcı kaldığı yere (ör. Hesabım > Paketim) döner.
    const back = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.location.assign(`/giris?next=${encodeURIComponent(back)}`);
    return { ok: false, code: null, message: "Oturumunuzun süresi doldu, lütfen tekrar giriş yapın." };
  }
  if (!response.ok) {
    return {
      ok: false,
      code: body?.errorCode ?? null,
      message: body?.message || "İşlem tamamlanamadı. Lütfen tekrar deneyin.",
      fieldErrors: Object.fromEntries((body?.validationErrors ?? []).map((e) => [e.field, e.message])),
    };
  }
  return { ok: true, data: body };
}
