import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_COOKIE, REFRESH_COOKIE, backendFetch, callAsUser, setSessionCookies } from "../../../lib/auth/session";

// Fiyatlandırma kataloğu sitenin kendi alan adından servis edilir: tarayıcı backend'e doğrudan
// (başka origin'e) istek atmaz; reklam/takip engelleyiciler ve CORS araya giremez. Önbellek yok:
// admin panelde yapılan fiyat değişikliği hemen görünür.
//
// Oturum açıksa katalog eczaneye göre alınır: beta üyesi eczane indirim süresince beta fiyatlarını görür.
// Kararı backend verir (eczanenin kayıt tarihi ve indirimin son anı); ziyaretçi, arama motorları ve
// beta üyesi olmayanlar herkese açık fiyatları görür. Kişisel katalog alınamazsa herkese açık olana düşülür;
// fiyat sayfası oturumu hiçbir zaman kapatmaz.
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

async function personalCatalog() {
  const store = await cookies();
  if (!store.get(ACCESS_COOKIE)?.value && !store.get(REFRESH_COOKIE)?.value) return null;
  try {
    const call = await callAsUser((accessToken) => backendFetch("/api/billing/catalog", { accessToken }));
    if (!call || !call.result.ok) return null;
    return { body: await call.result.json(), refreshedAccessToken: call.refreshedAccessToken };
  } catch {
    return null;
  }
}

export async function GET() {
  const personal = await personalCatalog();
  if (personal) {
    const response = NextResponse.json(personal.body, { headers: NO_STORE });
    if (personal.refreshedAccessToken) setSessionCookies(response, { accessToken: personal.refreshedAccessToken });
    return response;
  }
  try {
    const response = await backendFetch("/api/public/billing/catalog");
    if (!response.ok) {
      return NextResponse.json({ message: "Fiyatlar alınamadı" }, { status: 502, headers: NO_STORE });
    }
    return NextResponse.json(await response.json(), { headers: NO_STORE });
  } catch {
    return NextResponse.json({ message: "Fiyatlar alınamadı" }, { status: 502, headers: NO_STORE });
  }
}
