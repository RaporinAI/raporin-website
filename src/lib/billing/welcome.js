/**
 * Hoş geldin kredisi durumu. Backend her yeni eczaneye bir kez, kart istemeden, admin panelde belirlenen
 * miktarda ve sürede kredi verir (varsayılan 150 kredi, 30 gün); kredi eczanenin ilk girişinde yüklenir.
 * Kalan kredi `credits.available` içinde de sayılır; paket alınınca silinmez.
 *
 * @param billing GET /api/billing/me yanıtı (welcome: { active, granted, remaining, grantedAt, expiresAt } | null)
 * @returns {{ active: boolean, ended: boolean, granted: number, remaining: number, expiresAt: string, daysLeft: number } | null}
 *          hoş geldin kredisi hiç verilmediyse null
 */
export function welcomeState(billing, now = Date.now()) {
  const welcome = billing?.welcome;
  if (!welcome) return null;
  const end = new Date(welcome.expiresAt).getTime();
  const active = Boolean(welcome.active) && welcome.remaining > 0 && end > now;
  const day = 24 * 60 * 60 * 1000;
  return {
    active,
    ended: !active,
    granted: welcome.granted,
    remaining: active ? welcome.remaining : 0,
    expiresAt: welcome.expiresAt,
    daysLeft: active ? Math.max(1, Math.ceil((end - now) / day)) : 0,
  };
}

/** "5 gün kaldı" / "Son gün". */
export function daysLeftLabel(daysLeft) {
  return daysLeft <= 1 ? "Son gün" : `${daysLeft} gün kaldı`;
}

