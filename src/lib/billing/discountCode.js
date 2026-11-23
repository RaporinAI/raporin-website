// İndirim kodu (eczacı odası, kurum, mümessil). İş ortağının paylaştığı bağlantıdaki ?kod= parametresi
// kayıt → e-posta doğrulama → giriş zinciri boyunca kaybolmasın diye tarayıcıda saklanır; ödeme sayfası
// kodu kendiliğinden doldurur ve dener.
const KEY = "raporin.discountCode";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

const normalize = (code) => (code || "").replace(/\s+/g, "").toLocaleUpperCase("tr-TR").slice(0, 40);

export function rememberDiscountCode(code) {
  const value = normalize(code);
  if (!value) return;
  try {
    localStorage.setItem(KEY, JSON.stringify({ code: value, savedAt: Date.now() }));
  } catch {
    // Depolama kapalıysa kod yalnızca hatırlanmaz; eczacı ödeme sayfasında elle girebilir.
  }
}

/** @returns saklanan kod veya null (yoksa ya da 7 günden eskiyse) */
export function readDiscountCode() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!value?.code || Date.now() - value.savedAt > TTL_MS) return null;
    return value.code;
  } catch {
    return null;
  }
}

export function forgetDiscountCode() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // yok say
  }
}

/** Adres çubuğundaki ?kod= değerini saklar (herhangi bir sayfada). */
export function captureDiscountCodeFromUrl() {
  if (typeof window === "undefined") return null;
  const code = new URLSearchParams(window.location.search).get("kod");
  if (code) rememberDiscountCode(code);
  return code ? normalize(code) : null;
}

export { normalize as normalizeDiscountCode };
