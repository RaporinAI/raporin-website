// Yalnızca route handler'lardan (sunucu) kullanılır. Backend'in verdiği JWT'ler tarayıcıya
// httpOnly çerez olarak yazılır; sayfa JavaScript'i token'lara hiçbir zaman erişemez.
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_FLAG_COOKIE } from "./sessionFlag";

// Sunucu tarafı: önce iç ağ adresi (API_INTERNAL_URL, runtime), yoksa public API adresi
// (NEXT_PUBLIC_API_URL, build-time). İkisi de yoksa hata — kodda varsayılan adres yok.
const configuredBackendUrl = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;
if (!configuredBackendUrl) {
  throw new Error("API_INTERNAL_URL veya NEXT_PUBLIC_API_URL tanımlı değil");
}
export const BACKEND_URL = configuredBackendUrl.replace(/\/+$/, "");

export const ACCESS_COOKIE = "rp_at";
export const REFRESH_COOKIE = "rp_rt";

const baseCookie = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

/** JWT'nin exp alanından kalan ömrü (saniye) okur. İmza doğrulanmaz; bu yalnızca çerez süresi içindir. */
function secondsUntilExpiry(token, fallbackSeconds) {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
    const remaining = Math.floor(payload.exp - Date.now() / 1000);
    return remaining > 0 ? remaining : 0;
  } catch {
    return fallbackSeconds;
  }
}

export function isExpired(token) {
  // Saat farkı ve istek süresi için 30 sn pay bırakılır.
  return secondsUntilExpiry(token, 0) <= 30;
}

export function setSessionCookies(response, { accessToken, refreshToken }) {
  response.cookies.set(ACCESS_COOKIE, accessToken, {
    ...baseCookie,
    httpOnly: true,
    maxAge: secondsUntilExpiry(accessToken, 60 * 60),
  });
  if (refreshToken) {
    const refreshMaxAge = secondsUntilExpiry(refreshToken, 30 * 24 * 60 * 60);
    response.cookies.set(REFRESH_COOKIE, refreshToken, { ...baseCookie, httpOnly: true, maxAge: refreshMaxAge });
    response.cookies.set(SESSION_FLAG_COOKIE, "1", { ...baseCookie, httpOnly: false, maxAge: refreshMaxAge });
  }
}

export function clearSessionCookies(response) {
  for (const name of [ACCESS_COOKIE, REFRESH_COOKIE, SESSION_FLAG_COOKIE]) {
    response.cookies.set(name, "", { ...baseCookie, maxAge: 0 });
  }
}

export function backendFetch(path, { accessToken, ...init } = {}) {
  return fetch(`${BACKEND_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      // Profil endpoint'leri bu başlığı gönderen istemcilere tüm alanları (GLN, mahalle) döner.
      "X-Client-Version": "web",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...init.headers,
    },
  });
}

/**
 * Refresh token ile yeni access token alır.
 *
 * - Refresh token yok ya da backend reddetti (401/403): null → çağıran oturumu kapatır.
 * - Backend'e ulaşılamadı ya da 5xx: hata fırlatır → çağıran 502 döner, oturum KORUNUR.
 *   Geçici bir kesinti kullanıcıyı sistemden atmamalı.
 */
export async function refreshAccessToken(refreshToken) {
  if (!refreshToken) return null;
  const response = await backendFetch("/api/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
  if (response.status === 401 || response.status === 403) return null;
  if (!response.ok) throw new Error(`Token yenilenemedi (${response.status})`);
  const data = await response.json().catch(() => null);
  if (!data?.accessToken) throw new Error("Token yenileme yanıtı okunamadı");
  return data.accessToken;
}

export function unauthorized() {
  const response = NextResponse.json({ message: "Oturum bulunamadı" }, { status: 401 });
  clearSessionCookies(response);
  return response;
}

/**
 * Oturumdaki kullanıcı adına backend'i çağırır. Access token yoksa ya da süresi dolmuşsa,
 * veya backend 401 dönerse refresh token ile bir kez yenileyip tekrar dener.
 *
 * @param requests (accessToken) => Promise<Response | Response[]>
 * @returns null (oturum yok) ya da { result, refreshedAccessToken }
 */
export async function callAsUser(requests) {
  const store = await cookies();
  const refreshToken = store.get(REFRESH_COOKIE)?.value;
  let accessToken = store.get(ACCESS_COOKIE)?.value;
  let refreshed = false;

  if (!accessToken || isExpired(accessToken)) {
    accessToken = await refreshAccessToken(refreshToken);
    if (!accessToken) return null;
    refreshed = true;
  }

  let result = await requests(accessToken);
  const first = Array.isArray(result) ? result[0] : result;
  // Token süresi dolmamış görünse de backend reddedebilir (ör. JWT secret değişti).
  if (first.status === 401 && !refreshed) {
    accessToken = await refreshAccessToken(refreshToken);
    if (!accessToken) return null;
    refreshed = true;
    result = await requests(accessToken);
  }

  return { result, refreshedAccessToken: refreshed ? accessToken : null };
}

/** Oturum çerezleriyle yapılan değişiklik isteklerinin sitenin kendisinden geldiğini doğrular (CSRF). */
export function isSameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    // Reverse proxy (Coolify/Traefik) arkasında asıl alan adı x-forwarded-host'ta gelir.
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * Oturumdaki kullanıcı adına bir JSON değişiklik isteğini backend'e iletir ve backend'in
 * yanıtını (hata gövdesi dahil) olduğu gibi döndürür.
 */
export async function forwardAsUser(request, path, method = "PUT") {
  // Okuma istekleri değişiklik yapmaz; tarayıcı aynı kökenli GET'te Origin başlığı da göndermez.
  const isRead = method === "GET";
  if (!isRead && !isSameOrigin(request)) {
    return NextResponse.json({ message: "Geçersiz istek" }, { status: 403 });
  }
  const body = isRead || method === "DELETE" ? undefined : await request.text();

  let call;
  try {
    call = await callAsUser((accessToken) => backendFetch(path, { method, body, accessToken }));
  } catch {
    return NextResponse.json({ message: "Sunucuya ulaşılamadı. Lütfen tekrar deneyin." }, { status: 502 });
  }
  if (!call) return unauthorized();

  const text = await call.result.text();
  const response = new NextResponse(text || null, {
    status: call.result.status,
    headers: { "Content-Type": call.result.headers.get("content-type") || "application/json" },
  });
  if (call.refreshedAccessToken) setSessionCookies(response, { accessToken: call.refreshedAccessToken });
  return response;
}
