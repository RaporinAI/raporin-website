"use client";
import { LogOut } from "lucide-react";

/**
 * Hesabım gezinmesi. Geniş ekranda solda yapışkan panel; mobilde üstte kullanıcı özeti
 * ve yatay kaydırılabilir bölüm menüsü.
 */
export default function AccountSidebar({ profile, pharmacy, sections, active, activeChild, onSelect, onLogout, loggingOut }) {
  const roleLabel = profile.titleDisplay || profile.roles?.[0]?.name;
  const activeChildren = sections.find((section) => section.id === active)?.children;

  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <div className="rounded-[20px] border border-[#e6edf1] bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.05)] lg:p-5">
        <div className="flex items-center gap-3 lg:border-b lg:border-slate-100 lg:px-1 lg:pb-4">
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">{profile.displayName || profile.username}</p>
            <p className="truncate text-sm text-slate-500">
              {[pharmacy?.name || profile.email, roleLabel].filter(Boolean).join(" · ")}
            </p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            disabled={loggingOut}
            aria-label="Çıkış yap"
            className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 lg:hidden"
          >
            <LogOut size={18} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Hesap bölümleri" className="-mx-1 mt-4 overflow-x-auto px-1 lg:mx-0 lg:mt-4 lg:overflow-visible lg:px-0">
          <ul className="flex gap-1.5 lg:flex-col lg:gap-1">
            {sections.map(({ id, label, description, icon: Icon, badge, children }) => {
              const isActive = id === active;
              return (
                <li key={id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelect(id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${
                      isActive ? "bg-teal-50 text-teal-900" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {isActive && <span className="absolute inset-y-2 left-0 hidden w-1 rounded-full bg-teal-500 lg:block" aria-hidden="true" />}
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        isActive ? "bg-white text-teal-600 shadow-sm" : "bg-slate-50 text-slate-500 group-hover:bg-white"
                      }`}
                    >
                      <Icon size={17} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 whitespace-nowrap lg:whitespace-normal">
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        {label}
                        {badge ? (
                          <span className="rounded-full bg-amber-100 px-1.5 text-[11px] font-bold text-amber-700" aria-label={`${badge} eksik bilgi`}>
                            {badge}
                          </span>
                        ) : null}
                      </span>
                      <span className="hidden text-xs text-slate-400 lg:block">{description}</span>
                    </span>
                  </button>
                  {/* Geniş ekranda alt sayfalar bölümün altında girintili; açık bölümde görünür */}
                  {isActive && children?.length > 1 && (
                    <ul className="ml-[30px] mt-1 hidden space-y-0.5 border-l border-slate-200 pl-3 lg:block">
                      {children.map((child) => (
                        <li key={child.id}>
                          <SubItem child={child} active={child.id === activeChild} onSelect={onSelect} />
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobilde alt sayfalar ana menünün altında ikinci, kaydırılabilir bir satır */}
        {activeChildren?.length > 1 && (
          <nav aria-label="Paketim bölümleri" className="-mx-1 mt-2 overflow-x-auto px-1 lg:hidden">
            <ul className="flex gap-1.5">
              {activeChildren.map((child) => (
                <li key={child.id} className="shrink-0">
                  <SubItem child={child} active={child.id === activeChild} onSelect={onSelect} chip />
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="mt-5 hidden border-t border-slate-100 pt-4 lg:block">
          <button
            type="button"
            onClick={onLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50">
              <LogOut size={17} aria-hidden="true" />
            </span>
            Çıkış yap
          </button>
        </div>
      </div>
    </aside>
  );
}

function SubItem({ child, active, onSelect, chip = false }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(child.id)}
      aria-current={active ? "page" : undefined}
      className={
        chip
          ? `whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              active ? "border-teal-200 bg-teal-50 text-teal-800" : "border-slate-200 text-slate-500 hover:bg-slate-50"
            }`
          : `block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-teal-600 ${
              active ? "bg-teal-50/70 font-semibold text-teal-800" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`
      }
    >
      {child.label}
    </button>
  );
}
