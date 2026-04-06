import React, { useState } from "react";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";
import { useSettings } from "../../context/SettingsContext";

export default function DashboardShell({
  brand = "PaySphere",
  navItems = [],
  defaultKey = "home",
  variant = "user",
  onLogout = () => {},
  onTabChange,
  userName = "",
  activeTab,
  children,
}) {
  const [active, setActive] = useState(defaultKey);
  const { darkMode, t } = useSettings?.() || { darkMode: true, t: { dashboard: 'Dashboard' } };

  const currentTab = activeTab ?? active;

  const dark = {
    shell:   '#080d1a',
    header:  'rgba(10,17,40,0.95)',
    section: 'linear-gradient(145deg,#080d1a 0%,#0d1424 60%,#080d1a 100%)',
    homeCard: 'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(6,78,59,0.04))',
    homeBorder: 'rgba(16,185,129,0.15)',
    text:    'text-slate-100',
    subText: 'text-white/40',
    breadcrumb: 'text-white/40',
  };
  const light = {
    shell:   '#f1f5f9',
    header:  'rgba(255,255,255,0.95)',
    section: 'linear-gradient(145deg,#f1f5f9 0%,#e2e8f0 60%,#f1f5f9 100%)',
    homeCard: 'linear-gradient(135deg,rgba(16,185,129,0.1),rgba(6,78,59,0.05))',
    homeBorder: 'rgba(16,185,129,0.25)',
    text:    'text-slate-800',
    subText: 'text-slate-500',
    breadcrumb: 'text-slate-400',
  };
  const theme = darkMode ? dark : light;

  const handleChange = (key) => {
    if (key === "logout") { onLogout?.(); return; }
    setActive(key);
    if (onTabChange) onTabChange(key);
  };

  return (
    <div className={`min-h-screen flex ${theme.text} transition-colors duration-300`} style={{ background: theme.shell }}>
      <Sidebar brand={brand} items={navItems} active={currentTab} onChange={handleChange} darkMode={darkMode} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 shrink-0 transition-colors duration-300"
          style={{ background: theme.header, borderBottom: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-semibold uppercase tracking-widest ${theme.breadcrumb}`}>
              {variant === 'merchant' ? 'Merchant' : (t?.dashboard || 'Dashboard')}
            </span>
            <span className={darkMode ? 'text-white/20' : 'text-slate-300'}>/</span>
            <span className="text-sm font-bold text-emerald-500 uppercase tracking-wider">{currentTab}</span>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell darkMode={darkMode} />
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-black"
              style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 0 16px rgba(16,185,129,0.4)' }}>
              {userName ? userName.slice(0, 2).toUpperCase() : '--'}
            </div>
            {userName && <span className={`text-sm font-semibold ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>{userName}</span>}
          </div>
        </header>

        {/* Content */}
        <section className="flex-1 overflow-y-auto p-8 transition-colors duration-300" style={{ background: theme.section }}>
          {currentTab === 'home' ? (
            <div className="rounded-2xl p-8 border transition-colors duration-300"
              style={{ background: theme.homeCard, borderColor: theme.homeBorder, boxShadow: '0 8px 32px -8px rgba(16,185,129,0.15)' }}>
              <h2 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                {t?.welcomeBack || 'Welcome back'}, <span className="text-emerald-500">{userName || '...'}</span>
              </h2>
              <p className={`mt-2 ${theme.subText}`}>{t?.managePayments || 'Manage your payments and wallet effortlessly.'}</p>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              {children ?? <div className={`${theme.subText} italic`}>Section "{currentTab}" coming soon...</div>}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}