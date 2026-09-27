"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import ContactNoticeModal from "./ContactNoticeModal";
import { API_URL } from "../lib/auth/api";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: ""
  });
  const [noticeAccepted, setNoticeAccepted] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [statusMessage, setStatusMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noticeAccepted) return;
    setIsSubmitting(true);
    setSubmitStatus(null);
    setStatusMessage("");

    try {
      const response = await fetch(`${API_URL}/api/contact/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseText = await response.text();

      if (response.ok) {
        setSubmitStatus("success");
        setStatusMessage(responseText);
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          message: ""
        });
        setNoticeAccepted(false);
      } else {
        setSubmitStatus("error");
        setStatusMessage(responseText || "Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error("Form gönderme hatası:", error);
      setSubmitStatus("error");
      setStatusMessage("❌ Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="iletisim"
      className="py-24 bg-gradient-to-b from-[#F9FFFD] via-[#EDFFFB] to-[#E3FFFA]"
    >
      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* Başlık */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#17C6A3] to-[#0F918B]"
        >
          İletişim
        </motion.h2>
        <p className="text-gray-600 mb-12 text-lg">
          Bizimle iletişime geçin. Geri bildiriminiz veya sorularınız varsa ekibimiz kısa sürede size dönüş yapacaktır.
        </p>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto bg-white/70 backdrop-blur-md border border-[#D9F5F0] rounded-2xl p-8 shadow-lg"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input
              type="text"
              name="fullName"
              placeholder="Ad Soyad"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#17C6A3] focus:ring-1 focus:ring-[#17C6A3] outline-none transition"
              required
              disabled={isSubmitting}
            />
            <input
              type="email"
              name="email"
              placeholder="E-posta"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#17C6A3] focus:ring-1 focus:ring-[#17C6A3] outline-none transition"
              required
              disabled={isSubmitting}
            />
          </div>

          <textarea
            rows="5"
            name="message"
            placeholder="Mesajınız..."
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#17C6A3] focus:ring-1 focus:ring-[#17C6A3] outline-none transition mb-6"
            required
            disabled={isSubmitting}
          ></textarea>

          {/* İletişim Formu Aydınlatma Metni Onayı */}
          <label className="flex items-start gap-3 mb-6 text-left cursor-pointer">
            <input
              type="checkbox"
              name="noticeAccepted"
              checked={noticeAccepted}
              onChange={(e) => setNoticeAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 shrink-0 rounded border-gray-300 text-[#17C6A3] accent-[#17C6A3] focus:ring-1 focus:ring-[#17C6A3] cursor-pointer"
              required
              disabled={isSubmitting}
            />
            <span className="text-sm text-gray-600 leading-relaxed">
              İletişim formu ile paylaşacağım kişisel veriler hakkında hazırlanan{" "}
              <button
                type="button"
                onClick={() => setIsNoticeModalOpen(true)}
                className="text-[#0F918B] font-medium hover:underline"
              >
                aydınlatma metnini
              </button>{" "}
              okudum.
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting || !noticeAccepted}
            className="px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-[#17C6A3] to-[#0F918B] hover:shadow-lg hover:shadow-[#0F918B]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Gönderiliyor..." : "Gönder"}
          </button>

          {/* Status Message */}
          {submitStatus && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-lg ${submitStatus === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
                }`}
            >
              {statusMessage}
            </motion.div>
          )}
        </motion.form>

        {/* Alt Bilgi */}
        <p className="mt-8 text-gray-500 text-sm">
          veya bize e-posta gönderin:{" "}
          <a
            href="mailto:info@raporin.com"
            className="text-[#0F918B] font-medium hover:underline"
          >
            info@raporin.com
          </a>
        </p>
      </div>

      <ContactNoticeModal
        open={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
      />
    </section>
  );
}
