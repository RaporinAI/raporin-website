"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { API_URL } from "../../lib/auth/api";

function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState("loading"); // loading | form | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Geçersiz veya eksik token. Lütfen e-postanızdaki linki kontrol edin.");
      return;
    }

    // Token'ı doğrula (opsiyonel - backend'de de doğrulanacak)
    setStatus("form");
  }, [token]);

  const validatePassword = (password) => {
    const validation = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordValidation(validation);
    return Object.values(validation).every(Boolean);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "newPassword") {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword(formData.newPassword)) {
      setErrorMessage("Lütfen güçlü bir şifre seçin.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("Şifreler eşleşmiyor.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Şifre sıfırlama işlemi başarısız oldu.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch = formData.newPassword === formData.confirmPassword && formData.confirmPassword !== "";

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#0F918B] mx-auto mb-4" />
          <p className="text-gray-600">Token doğrulanıyor...</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">✅ Şifre Başarıyla Sıfırlandı!</h1>
          <p className="text-gray-600 mb-6">
            Yeni şifreniz başarıyla kaydedildi. Artık yeni şifrenizle giriş yapabilirsiniz.
          </p>
          <button
            onClick={() => router.push("/giris")}
            className="w-full px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-[#17C6A3] to-[#0F918B] hover:shadow-lg transition-all"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">❌ Hata Oluştu</h1>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <button
            onClick={() => router.push("/")}
            className="w-full px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-[#17C6A3] to-[#0F918B] hover:shadow-lg transition-all"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-[#17C6A3] to-[#0F918B] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔐</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Yeni Şifre Belirle</h1>
          <p className="text-gray-600">Güvenliğiniz için güçlü bir şifre seçin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Yeni Şifre */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Yeni Şifre
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F918B] focus:border-transparent transition-all"
                placeholder="Yeni şifrenizi girin"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* Şifre Gereksinimleri */}
            {formData.newPassword && (
              <div className="mt-3 space-y-1">
                <div className={`flex items-center text-sm ${passwordValidation.length ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.length ? 'bg-green-500' : 'bg-gray-300'}`} />
                  En az 8 karakter
                </div>
                <div className={`flex items-center text-sm ${passwordValidation.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.uppercase ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Büyük harf (A-Z)
                </div>
                <div className={`flex items-center text-sm ${passwordValidation.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.lowercase ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Küçük harf (a-z)
                </div>
                <div className={`flex items-center text-sm ${passwordValidation.number ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.number ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Rakam (0-9)
                </div>
                <div className={`flex items-center text-sm ${passwordValidation.special ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.special ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Özel karakter (!@#$%^&*)
                </div>
              </div>
            )}
          </div>

          {/* Şifre Tekrarı */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Şifre Tekrarı
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#0F918B] focus:border-transparent transition-all ${
                  formData.confirmPassword && !passwordsMatch 
                    ? 'border-red-300 bg-red-50' 
                    : formData.confirmPassword && passwordsMatch 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-300'
                }`}
                placeholder="Şifrenizi tekrar girin"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formData.confirmPassword && !passwordsMatch && (
              <p className="mt-1 text-sm text-red-600">Şifreler eşleşmiyor</p>
            )}
            {formData.confirmPassword && passwordsMatch && (
              <p className="mt-1 text-sm text-green-600">✓ Şifreler eşleşiyor</p>
            )}
          </div>

          {/* Hata Mesajı */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}

          {/* Gönder Butonu */}
          <button
            type="submit"
            disabled={!isPasswordValid || !passwordsMatch || isSubmitting}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
              !isPasswordValid || !passwordsMatch || isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#17C6A3] to-[#0F918B] hover:shadow-lg hover:scale-[1.02]'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Şifre Sıfırlanıyor...
              </div>
            ) : (
              'Şifreyi Sıfırla'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Şifre sıfırlama linkinin süresi dolmuş mu?{" "}
            <button
              onClick={() => router.push("/sifremi-unuttum")}
              className="text-[#0F918B] hover:underline font-medium"
            >
              Yeni link talep edin
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#0F918B] mx-auto mb-4" />
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
