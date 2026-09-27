"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "../../lib/auth/api";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState("checking"); // checking | success | error

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    fetch(`${API_URL}/api/email/verify-email?token=${token}`)
      .then(async (res) => {
        if (res.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50 px-4">
      {status === "checking" && <p className="text-gray-600">Doğrulama işlemi yapılıyor...</p>}
      {status === "success" && (
        <div>
          <h1 className="text-2xl font-bold text-teal-600 mb-3">✅ Hesabınız başarıyla aktifleştirildi!</h1>
          <p className="text-gray-700 mb-5">Giriş yaparak masaüstü uygulamasını indirebilirsiniz.</p>
          <Link href="/giris?next=/hesabim" className="inline-block rounded-full bg-gradient-to-r from-[#17C6A3] to-[#0F918B] px-8 py-3 font-semibold text-white hover:shadow-lg">
            Giriş yap
          </Link>
        </div>
      )}
      {status === "error" && (
        <div>
          <h1 className="text-2xl font-bold text-red-600 mb-3">❌ Doğrulama başarısız</h1>
          <p className="text-gray-700 mb-5">Link geçersiz veya süresi dolmuş olabilir (30 dakika geçerlidir).</p>
          <p className="text-sm text-gray-500">
            Yeni link almak için <Link href="/giris" className="font-semibold text-teal-700 hover:underline">giriş sayfasında</Link> e-posta adresinizle giriş yapmayı deneyin.
          </p>
        </div>
      )}
    </div>
  );
}
