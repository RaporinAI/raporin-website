import { NextResponse } from "next/server";
import { backendFetch } from "../../../lib/auth/session";

// Fiyatlandırma kataloğu sitenin kendi alan adından servis edilir: tarayıcı backend'e doğrudan
// (başka origin'e) istek atmaz; reklam/takip engelleyiciler ve CORS araya giremez. Önbellek yok:
// admin panelde yapılan fiyat değişikliği hemen görünür.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await backendFetch("/api/public/billing/catalog");
    if (!response.ok) {
      return NextResponse.json({ message: "Fiyatlar alınamadı" }, { status: 502, headers: { "Cache-Control": "no-store" } });
    }
    return NextResponse.json(await response.json(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ message: "Fiyatlar alınamadı" }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
