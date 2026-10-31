import { NextResponse } from "next/server";
import { forwardAsUser } from "../../../../../lib/auth/session";

// Hesabım > Paketim'in kullandığı billing uçları. Yalnızca bu listedeki yollar backend'e iletilir.
// Yazma uçları backend'de yalnızca PHARMACY_ADMIN'e açıktır; diğer roller 403 alır.
const ROUTES = {
  GET: [/^me$/, /^payments$/, /^credits\/usage$/, /^billing-info$/, /^checkout\/\d+$/, /^upgrade\/options$/, /^credit-packs$/],
  PUT: [/^billing-info$/],
  POST: [
    /^checkout$/,
    /^subscription\/cancel$/,
    /^subscription\/card-update$/,
    /^upgrade\/checkout$/,
    /^credit-packs\/checkout$/,
  ],
};

/** Sözleşme onayının gerçek kullanıcı IP'siyle kaydedilmesi için istemci IP'si backend'e iletilir. */
function clientIp(request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    undefined
  );
}

async function handle(request, params, method) {
  const { path } = await params;
  const joined = (path ?? []).join("/");
  const query = method === "GET" ? new URL(request.url).search : "";
  if (!ROUTES[method].some((pattern) => pattern.test(joined))) {
    return NextResponse.json({ message: "Bulunamadı" }, { status: 404 });
  }
  const ip = clientIp(request);
  return forwardAsUser(request, `/api/billing/${joined}${query}`, method, ip ? { "X-Forwarded-For": ip } : undefined);
}

export async function GET(request, { params }) {
  return handle(request, params, "GET");
}

export async function PUT(request, { params }) {
  return handle(request, params, "PUT");
}

export async function POST(request, { params }) {
  return handle(request, params, "POST");
}
