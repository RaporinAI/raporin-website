"use client";
import { useSyncExternalStore } from "react";
import { Building2, LayoutDashboard, Package, ShieldCheck, UserRound, Users } from "lucide-react";
import AccountSidebar from "./AccountSidebar";
import OverviewSection from "./OverviewSection";
import ProfileForm from "./ProfileForm";
import PasswordForm from "./PasswordForm";
import PharmacyForm from "./PharmacyForm";
import TeamSection from "./TeamSection";
import SubscriptionSection from "./SubscriptionSection";
import { validateMobilePhone } from "../../lib/auth/validation";

const ADMIN_ROLES = ["PHARMACY_ADMIN", "SYSTEM_ADMIN"];

const SECTIONS = [
  { id: "genel", label: "Genel bakış", description: "Uygulama ve yapılacaklar", icon: LayoutDashboard },
  { id: "paket", label: "Paketim", description: "Paket ve kredi bilgileri", icon: Package },
  { id: "kisisel", label: "Kişisel bilgiler", description: "Ad, telefon, e-posta", icon: UserRound },
  { id: "guvenlik", label: "Güvenlik", description: "Şifre değiştirme", icon: ShieldCheck },
  { id: "eczane", label: "Eczane bilgileri", description: "Ad, GLN, konum, telefon", icon: Building2 },
  { id: "ekip", label: "Ekip", description: "Üyeler ve ünvanlar", icon: Users },
];

// Açık bölüm adreste (#kisisel gibi) tutulur: geri tuşu ve paylaşılan link aynı bölümü açar.
const subscribeHash = (callback) => {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
};
const readHash = () => window.location.hash.slice(1);

function useActiveSection() {
  const hash = useSyncExternalStore(subscribeHash, readHash, () => "");
  const active = SECTIONS.some((s) => s.id === hash) ? hash : "genel";
  const select = (id) => {
    if (id !== readHash()) window.location.hash = id;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return [active, select];
}

/** Eksik bilgiler: genel bakıştaki yapılacaklar listesi ve menüdeki sayaçlar. */
function buildTodos(profile, pharmacy, isAdmin) {
  const todos = [];
  if (validateMobilePhone(profile.phone || "")) {
    todos.push({ section: "kisisel", text: "Cep telefonu numaranızı ekleyin" });
  }
  if (isAdmin && pharmacy) {
    if (!pharmacy.gln) todos.push({ section: "eczane", text: "Eczane GLN numarasını ekleyin" });
    if (!pharmacy.neighborhood) todos.push({ section: "eczane", text: "Eczanenin mahalle bilgisini seçin" });
  }
  return todos;
}

/** Hesabım panosu: solda gezinme, sağda seçili bölüm. Veri çekme sayfadadır. */
export default function AccountDashboard({ account, setAccount, onLogout, loggingOut }) {
  const [active, select] = useActiveSection();

  const { profile, pharmacy } = account;
  const isAdmin = profile.roles?.some((role) => ADMIN_ROLES.includes(role.code));
  const todos = buildTodos(profile, pharmacy, isAdmin);
  const sections = SECTIONS.map((section) => ({
    ...section,
    badge: todos.filter((todo) => todo.section === section.id).length,
  }));

  const setProfile = (next) => setAccount((prev) => ({ ...prev, profile: next }));
  const setPharmacy = (next) => setAccount((prev) => ({ ...prev, pharmacy: next }));

  // Bölümler gizlenerek değiştirilir, kaldırılmaz: yarım kalan düzenlemeler bölüm değişince kaybolmaz.
  const panel = (id, children) => (
    <div hidden={active !== id}>
      {children}
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f2fbf8] via-white to-[#f4fbfd] px-4 pb-16 pt-28 sm:pt-32">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
        <AccountSidebar
          profile={profile}
          pharmacy={pharmacy}
          sections={sections}
          active={active}
          onSelect={select}
          onLogout={onLogout}
          loggingOut={loggingOut}
        />

        <div className="min-w-0">
          {panel("genel", <OverviewSection profile={profile} pharmacy={pharmacy} todos={todos} onNavigate={select} />)}
          {panel("paket", <SubscriptionSection />)}
          {panel("kisisel", <ProfileForm profile={profile} onSaved={setProfile} />)}
          {panel("guvenlik", <PasswordForm />)}
          {panel(
            "eczane",
            pharmacy ? (
              <PharmacyForm pharmacy={pharmacy} canEdit={isAdmin} onSaved={setPharmacy} />
            ) : (
              <p className="text-sm text-slate-500">Eczane bilgileri şu anda alınamadı.</p>
            )
          )}
          {/* Ekip ekleme/silme backend'de yalnızca PHARMACY_ADMIN rolüne açık (masaüstüyle aynı endpoint). */}
          {panel("ekip", <TeamSection profile={profile} canManage={profile.roles?.some((role) => role.code === "PHARMACY_ADMIN")} />)}
        </div>
      </div>
    </main>
  );
}
