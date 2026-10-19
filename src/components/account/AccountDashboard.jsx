"use client";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { AlertTriangle, Building2, LayoutDashboard, Package, ShieldCheck, UserRound, Users } from "lucide-react";
import AccountSidebar from "./AccountSidebar";
import OverviewSection from "./OverviewSection";
import ProfileForm from "./ProfileForm";
import PasswordForm from "./PasswordForm";
import PharmacyForm from "./PharmacyForm";
import TeamSection from "./TeamSection";
import SubscriptionSection from "./SubscriptionSection";
import { validateMobilePhone } from "../../lib/auth/validation";
import { billingApi } from "../../lib/billing/billingApi";

const ADMIN_ROLES = ["PHARMACY_ADMIN", "SYSTEM_ADMIN"];

const SECTIONS = [
  { id: "genel", label: "Genel bakış", description: "Uygulama ve yapılacaklar", icon: LayoutDashboard },
  { id: "paket", label: "Paketim", description: "Paket ve kredi bilgileri", icon: Package },
  { id: "kisisel", label: "Kişisel bilgiler", description: "Ad, telefon, e-posta", icon: UserRound },
  { id: "guvenlik", label: "Güvenlik", description: "Şifre değiştirme", icon: ShieldCheck },
  { id: "eczane", label: "Eczane bilgileri", description: "Ad, GLN, konum, telefon", icon: Building2 },
  { id: "ekip", label: "Ekip", description: "Üyeler ve ünvanlar", icon: Users },
];

/**
 * Paketim'in alt sayfaları. Görünürlük kullanıcının durumuna göre değişir: paketi olmayan kullanıcı
 * paketleri zaten Genel durum'da görür; fatura bilgisini yalnızca eczane yöneticisi düzenler; ödeme
 * geçmişi ücretli paketi olanda ya da ek kredi alabilen (panelden paket atanmış) eczane yöneticisinde vardır.
 */
const PACKAGE_VIEWS = [
  { id: "paket", label: "Genel durum" },
  { id: "kredi", label: "Kredi kullanımı" },
  { id: "paketler", label: "Paketler ve fiyatlar", visible: ({ hasLiveSubscription }) => hasLiveSubscription },
  { id: "fatura", label: "Fatura bilgileri", visible: ({ isPharmacyAdmin }) => isPharmacyAdmin },
  { id: "odemeler", label: "Ödeme geçmişi", visible: ({ paid }) => paid },
];
const PACKAGE_VIEW_IDS = PACKAGE_VIEWS.map((view) => view.id);

// Açık bölüm adreste (#kisisel gibi) tutulur: geri tuşu ve paylaşılan link aynı bölümü açar.
const subscribeHash = (callback) => {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
};
const readHash = () => window.location.hash.slice(1);

function useActiveSection() {
  const hash = useSyncExternalStore(subscribeHash, readHash, () => "");
  const active = SECTIONS.some((s) => s.id === hash) || PACKAGE_VIEW_IDS.includes(hash) ? hash : "genel";
  const select = (id) => {
    if (id !== readHash()) window.location.hash = id;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return [active, select];
}

/** Eksik bilgiler ve ödeme sorunları: genel bakıştaki yapılacaklar listesi ve menüdeki sayaçlar. */
function buildTodos(profile, pharmacy, isAdmin, billing) {
  const todos = [];
  const status = billing?.subscription?.status;
  if (status === "PAST_DUE" || status === "SUSPENDED") {
    todos.push({
      section: "paket",
      text: isAdmin
        ? "Abonelik ödemeniz alınamadı; ödeme kartınızı güncelleyin"
        : "Abonelik ödemesi alınamadı; eczane yöneticinize bildirin",
    });
  }
  if (!billing?.subscription && billing?.welcome && !billing.welcome.active && (billing.credits?.available ?? 0) === 0) {
    todos.push({ section: "paket", text: "Hoş geldin krediniz bitti; analizlere devam etmek için paket seçin" });
  }
  if (validateMobilePhone(profile.phone || "")) {
    todos.push({ section: "kisisel", text: "Cep telefonu numaranızı ekleyin" });
  }
  if (isAdmin && pharmacy) {
    if (!pharmacy.gln) todos.push({ section: "eczane", text: "Eczane GLN numarasını ekleyin" });
    if (!pharmacy.neighborhood) todos.push({ section: "eczane", text: "Eczanenin mahalle bilgisini seçin" });
  }
  return todos;
}

/** Paket ve kredi bilgisi; genel bakış ve Paketim bölümü ortak kullanır. */
function useBilling() {
  const [billing, setBilling] = useState(null);
  const [error, setError] = useState(null);
  const reload = useCallback(() => {
    billingApi.me().then((result) => {
      if (result.ok) {
        setBilling(result.data);
        setError(null);
      } else {
        setError("Paket bilgileri şu anda alınamadı. Lütfen sayfayı yenileyin.");
      }
    });
  }, []);
  useEffect(reload, [reload]);
  return { billing, billingError: error, reloadBilling: reload };
}

/** Hesabım panosu: solda gezinme, sağda seçili bölüm. Veri çekme sayfadadır. */
export default function AccountDashboard({ account, setAccount, onLogout, loggingOut }) {
  const [active, select] = useActiveSection();
  const { billing, billingError, reloadBilling } = useBilling();

  const { profile, pharmacy } = account;
  const isAdmin = profile.roles?.some((role) => ADMIN_ROLES.includes(role.code));
  const isPharmacyAdmin = profile.roles?.some((role) => role.code === "PHARMACY_ADMIN");
  const todos = buildTodos(profile, pharmacy, isAdmin, billing);

  const subscription = billing?.subscription;
  const packageState = {
    hasLiveSubscription: Boolean(subscription && ["ACTIVE", "PAST_DUE", "SUSPENDED"].includes(subscription.status)),
    isPharmacyAdmin,
    paid: subscription?.source === "IYZICO" || Boolean(isPharmacyAdmin && billing?.actions?.canBuyCredits),
  };
  const packageViews = PACKAGE_VIEWS.filter((view) => !view.visible || view.visible(packageState));
  // Gizli bir alt sayfa istenirse (ör. paketi olmayan kullanıcıda #paketler) Genel durum açılır
  const packageView = PACKAGE_VIEW_IDS.includes(active)
    ? packageViews.some((view) => view.id === active) ? active : "paket"
    : null;
  const activeSection = packageView ? "paket" : active;

  const sections = SECTIONS.map((section) => ({
    ...section,
    badge: todos.filter((todo) => todo.section === section.id).length,
    children: section.id === "paket" ? packageViews : undefined,
  }));

  const setProfile = (next) => setAccount((prev) => ({ ...prev, profile: next }));
  const setPharmacy = (next) => setAccount((prev) => ({ ...prev, pharmacy: next }));

  // Bölümler gizlenerek değiştirilir, kaldırılmaz: yarım kalan düzenlemeler bölüm değişince kaybolmaz.
  const panel = (id, children) => (
    <div hidden={activeSection !== id}>
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
          active={activeSection}
          activeChild={packageView}
          onSelect={select}
          onLogout={onLogout}
          loggingOut={loggingOut}
        />

        <div className="min-w-0">
          {panel(
            "genel",
            <OverviewSection
              profile={profile}
              pharmacy={pharmacy}
              todos={todos}
              billing={billing}
              isAdmin={profile.roles?.some((role) => role.code === "PHARMACY_ADMIN")}
              onNavigate={select}
            />
          )}
          {panel(
            "paket",
            <SubscriptionSection
              view={packageView ?? "paket"}
              onNavigate={select}
              profile={profile}
              pharmacy={pharmacy}
              isAdmin={isPharmacyAdmin}
              billing={billing}
              billingError={billingError}
              reloadBilling={reloadBilling}
            />
          )}
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
