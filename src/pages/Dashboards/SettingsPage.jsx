import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSettings } from '../../context/SettingsContext';
import { selectUserName, selectUserEmail, selectUserId, selectUserRole } from '../../stores/authSlice';
import {
  User, Mail, Key, Moon, Sun, Globe, LogOut,
  CreditCard, Wallet, ShieldCheck, ChevronRight,
  Smartphone, Bell, Lock, Info, Fingerprint
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage({ onNavigate }) {
  const navigate = useNavigate();
  const { darkMode, toggleDark, language, setLang } = useSettings();

  const reduxName  = useSelector(selectUserName);
  const reduxEmail = useSelector(selectUserEmail);
  const reduxId    = useSelector(selectUserId);
  const reduxRole  = useSelector(selectUserRole);

  const rawName  = reduxName  || localStorage.getItem('ps_name')  || '';
  const rawEmail = reduxEmail || localStorage.getItem('ps_email') || '';
  const userId   = reduxId    || localStorage.getItem('ps_userId') || '';
  const role     = reduxRole  || localStorage.getItem('ps_role')   || 'User';

  const displayName = rawName
    || (rawEmail ? rawEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'User');

  const userInfo = {
    name:   displayName,
    email:  rawEmail,
    userId,
    role:   role.charAt(0).toUpperCase() + role.slice(1),
  };

  const hi = language === 'hi';
  const te = language === 'te';

  // theme tokens
  const bg        = darkMode ? 'linear-gradient(145deg,#080d1a 0%,#0d1424 50%,#080d1a 100%)' : 'linear-gradient(145deg,#f1f5f9 0%,#e2e8f0 50%,#f1f5f9 100%)';
  const rowBg     = (c) => darkMode ? `${c}12` : `${c}18`;
  const rowBorder = (c) => darkMode ? `${c}22` : `${c}38`;
  const textMain  = darkMode ? '#ffffff' : '#0f172a';
  const textSub   = darkMode ? 'rgba(255,255,255,0.3)' : '#94a3b8';
  const divider   = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
  const panelBg   = darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)';

  const handleLogout = () => { localStorage.clear(); window.location.href = '/login'; };

  // ── Sub-components ────────────────────────────────────────────

  const SectionHead = ({ icon: Icon, label, from, to }) => (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-7 h-7 rounded-xl flex items-center justify-center"
        style={{ background: `linear-gradient(135deg,${from},${to})`, boxShadow: `0 4px 12px -2px ${from}55` }}>
        <Icon size={14} className="text-white" />
      </div>
      <span className="font-black text-xs uppercase tracking-widest" style={{ color: textSub }}>{label}</span>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg,${from}30,transparent)` }} />
    </div>
  );

  const ProfileField = ({ icon: Icon, label, value, accent = '#a78bfa' }) => (
    <div className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all hover:-translate-y-0.5"
      style={{ background: rowBg(accent), border: `1px solid ${rowBorder(accent)}` }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `linear-gradient(135deg,${accent}30,${accent}18)`, boxShadow: `0 4px 12px -2px ${accent}44` }}>
        <Icon size={16} style={{ color: accent }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent + '70' }}>{label}</p>
        <p className="font-bold text-sm truncate" style={{ color: textMain }}>{value || '—'}</p>
      </div>
    </div>
  );

  const Toggle = ({ enabled, onChange, label, sub }) => (
    <div className="flex items-center justify-between px-5 py-4 rounded-2xl transition-all"
      style={{ background: panelBg, border: `1px solid ${divider}` }}>
      <div>
        <p className="font-bold text-sm" style={{ color: textMain }}>{label}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: textSub }}>{sub}</p>}
      </div>
      <button onClick={onChange}
        className="relative w-12 h-6 rounded-full transition-all duration-300 shrink-0"
        style={{
          background: enabled ? 'linear-gradient(135deg,#10b981,#059669)' : 'rgba(148,163,184,0.3)',
          boxShadow: enabled ? '0 0 12px rgba(16,185,129,0.4)' : 'none'
        }}>
        <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg transition-all duration-300"
          style={{ left: enabled ? '28px' : '4px' }} />
      </button>
    </div>
  );

  const ActionRow = ({ icon: Icon, label, sub, onClick, color = '#6366f1', disabled }) => (
    <button onClick={disabled ? () => toast(hi ? 'जल्द आ रहा है 🚧' : te ? 'త్వరలో వస్తుంది 🚧' : 'Coming soon 🚧') : onClick}
      className="group w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: rowBg(color), border: `1px solid ${rowBorder(color)}` }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
        style={{ background: `linear-gradient(135deg,${color}30,${color}18)`, boxShadow: `0 4px 12px -2px ${color}44` }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className="font-bold text-sm" style={{ color: textMain }}>{label}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: textSub }}>{sub}</p>}
      </div>
      {disabled
        ? <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg"
            style={{ background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', color: textSub }}>
            {hi ? 'जल्द' : 'Soon'}
          </span>
        : <ChevronRight size={15} className="group-hover:text-emerald-400 transition-colors" style={{ color: textSub }} />
      }
    </button>
  );

  const roleColor = { Admin: '#f59e0b', User: '#10b981', Merchant: '#6366f1', Ops: '#0ea5e9', Risk: '#ef4444' };
  const rColor = roleColor[userInfo.role] || '#a78bfa';

  return (
    <div className="-m-8 min-h-screen p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-all"
      style={{ background: bg }}>
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ── HEADER ── */}
        <div className="flex items-start justify-between pt-2">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-1.5 h-6 rounded-full" style={{ background: 'linear-gradient(180deg,#a78bfa,#6366f1)' }} />
              <h2 className="text-2xl font-black tracking-tight" style={{ color: textMain }}>
                {hi ? 'सेटिंग्स' : te ? 'సెట్టింగులు' : 'Settings'}
              </h2>
            </div>
            <p className="text-sm ml-4" style={{ color: textSub }}>
              {hi ? 'अपना खाता और प्राथमिकताएं प्रबंधित करें' : te ? 'మీ ఖాతా మరియు ప్రాధాన్యతలను నిర్వహించండి' : 'Manage your account & preferences'}
            </p>
          </div>
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-lg"
              style={{ background: `linear-gradient(135deg,${rColor},${rColor}99)`, boxShadow: `0 8px 24px -4px ${rColor}66` }}>
              {userInfo.name.slice(0, 2).toUpperCase() || 'PS'}
            </div>
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest"
              style={{ background: rColor, color: 'white' }}>
              {userInfo.role}
            </div>
          </div>
        </div>

        {/* ── PROFILE ── */}
        <section>
          <SectionHead icon={User} label={hi ? 'प्रोफ़ाइल' : te ? 'ప్రొఫైల్' : 'Profile'} from="#7c3aed" to="#a78bfa" />
          <div className="space-y-2">
            <ProfileField icon={User} label={hi ? 'पूरा नाम' : te ? 'పూర్తి పేరు' : 'Full Name'}     value={userInfo.name}           accent="#a78bfa" />
            <ProfileField icon={Mail} label={hi ? 'ईमेल'    : te ? 'ఇమెయిల్' : 'Email'}          value={userInfo.email}          accent="#6366f1" />
            <ProfileField icon={Key}  label={hi ? 'यूज़र ID' : te ? 'యూజర్ ID' : 'User ID'}        value={`#${userInfo.userId}`}   accent="#8b5cf6" />
          </div>
          <div className="mt-3 flex items-center gap-2 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <Fingerprint size={13} className="text-indigo-400 shrink-0" />
            <p className="text-indigo-300/70 text-xs">
              {hi ? 'प्रोफ़ाइल विवरण संगठन द्वारा प्रबंधित है। अपडेट के लिए सहायता से संपर्क करें।'
                  : te ? 'ప్రొఫైల్ వివరాలు మీ సంస్థ నిర్వహిస్తుంది. అప్‌డేట్ కోసం సహాయాన్ని సంప్రదించండి.'
                  : 'Profile details are managed by your organisation. Contact support to update.'}
            </p>
          </div>
        </section>

        {/* ── APPEARANCE ── */}
        <section>
          <SectionHead icon={darkMode ? Moon : Sun} label={hi ? 'दिखावट' : te ? 'రూపం' : 'Appearance'} from="#4f46e5" to="#818cf8" />
          <div className="space-y-2">
            <Toggle
              enabled={darkMode}
              onChange={() => { toggleDark(); toast.success(!darkMode ? '🌙 Dark mode on' : '☀️ Light mode on'); }}
              label={darkMode ? (hi ? '🌙 डार्क मोड' : te ? '🌙 డార్క్ మోడ్' : '🌙 Dark Mode') : (hi ? '☀️ लाइट मोड' : te ? '☀️ లైట్ మోడ్' : '☀️ Light Mode')}
              sub={hi ? 'इंटरफ़ेस थीम बदलें' : te ? 'ఇంటర్‌ఫేస్ థీమ్ మార్చండి' : 'Toggle interface theme'}
            />
            {/* Language */}
            <div className="px-5 py-4 rounded-2xl" style={{ background: panelBg, border: `1px solid ${divider}` }}>
              <p className="text-[9px] font-black uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: textSub }}>
                <Globe size={10} /> {hi ? 'भाषा' : te ? 'భాష' : 'Language'}
              </p>
              <div className="flex gap-2">
                {[{ code: 'en', label: 'English', flag: '🇬🇧' }, { code: 'hi', label: 'हिंदी', flag: '🇮🇳' }, { code: 'te', label: 'తెలుగు', flag: '🇮🇳' }].map(l => (
                  <button key={l.code}
                    onClick={() => { setLang(l.code); toast.success(`Language: ${{ en: 'English', hi: 'हिंदी', te: 'తెలుగు' }[l.code]}`); }}
                    className="flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                    style={{
                      background: language === l.code ? 'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.2))' : (darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'),
                      border: language === l.code ? '1px solid rgba(139,92,246,0.5)' : `1px solid ${divider}`,
                      color: language === l.code ? '#c4b5fd' : textSub,
                      boxShadow: language === l.code ? '0 4px 16px -4px rgba(99,102,241,0.4)' : 'none'
                    }}>
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── QUICK ACTIONS ── */}
        <section>
          <SectionHead icon={Smartphone} label={hi ? 'त्वरित क्रियाएं' : te ? 'త్వరిత చర్యలు' : 'Quick Actions'} from="#0369a1" to="#38bdf8" />
          <div className="space-y-2">
            <ActionRow icon={CreditCard} color="#6366f1"
              label={hi ? 'भुगतान विधियां' : te ? 'చెల్లింపు పద్ధతులు' : 'Payment Methods'}
              sub={hi ? 'कार्ड, UPI और बैंक खाते प्रबंधित करें' : te ? 'కార్డులు, UPI మరియు బ్యాంక్ ఖాతాలు నిర్వహించండి' : 'Manage cards, UPI & bank accounts'}
              onClick={() => onNavigate ? onNavigate('cards') : navigate('/payment-methods')} />
            <ActionRow icon={Wallet} color="#8b5cf6"
              label={hi ? 'वॉलेट टॉप अप' : te ? 'వాలెట్ టాప్ అప్' : 'Top Up Wallet'}
              sub={hi ? 'तुरंत फंड जोड़ें' : te ? 'వెంటనే నిధులు జోడించండి' : 'Add funds instantly'}
              onClick={() => onNavigate ? onNavigate('wallet') : navigate('/dashboard/wallet')} />
            <ActionRow icon={Lock}  color="#f59e0b"
              label={hi ? 'पासवर्ड बदलें' : te ? 'పాస్‌వర్డ్ మార్చండి' : 'Change Password'}
              sub={hi ? 'लॉगिन क्रेडेंशियल अपडेट करें' : te ? 'లాగిన్ ఆధారాలు అప్‌డేట్ చేయండి' : 'Update your login credentials'}
              disabled />
            <ActionRow icon={Bell}  color="#10b981"
              label={hi ? 'सूचनाएं' : te ? 'నోటిఫికేషన్లు' : 'Notifications'}
              sub={hi ? 'अलर्ट प्रबंधित करें' : te ? 'అలర్ట్‌లు నిర్వహించండి' : 'Manage alerts & push notifications'}
              disabled />
          </div>
        </section>

        {/* ── SECURITY ── */}
        <section>
          <SectionHead icon={ShieldCheck} label={hi ? 'सुरक्षा' : te ? 'భద్రత' : 'Security'} from="#059669" to="#34d399" />
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(16,185,129,0.15)' }}>
            <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg,#10b981,#34d399,transparent)' }} />
            <div className="px-5 py-5 space-y-4" style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.06),rgba(5,150,105,0.03))' }}>
              {[
                { label: 'PCI DSS Level 1',      color: '#10b981' },
                { label: '256-bit SSL Encryption', color: '#34d399' },
                { label: 'RBI Compliant',          color: '#6ee7b7' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                  <span className="text-sm font-semibold" style={{ color: item.color + 'cc' }}>{item.label}</span>
                </div>
              ))}
              <p className="text-xs pt-1 border-t border-white/5" style={{ color: 'rgba(110,231,183,0.3)' }}>
                {hi ? 'सभी लेनदेन एन्क्रिप्टेड हैं। आपका डेटा PaySphere Vault द्वारा सुरक्षित है।'
                    : te ? 'అన్ని లావాదేవీలు ఎండ్-టు-ఎండ్ ఎన్‌క్రిప్ట్ చేయబడ్డాయి. మీ డేటా PaySphere Vault ద్వారా రక్షించబడింది.'
                    : 'All transactions are end-to-end encrypted. Your data is protected by PaySphere Vault.'}
              </p>
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section>
          <SectionHead icon={Info} label={hi ? 'के बारे में' : te ? 'గురించి' : 'About'} from="#475569" to="#94a3b8" />
          <div className="rounded-2xl px-5 py-4 space-y-3" style={{ background: panelBg, border: `1px solid ${divider}` }}>
            {[
              { label: hi ? 'ऐप संस्करण' : te ? 'యాప్ వెర్షన్' : 'App Version', value: 'v1.0.0' },
              { label: hi ? 'बिल्ड'       : te ? 'బిల్డ్'        : 'Build',       value: '2024.03.24' },
              { label: hi ? 'प्लेटफ़ॉर्म' : te ? 'ప్లాట్‌ఫారమ్'  : 'Platform',    value: 'Web' },
            ].map(r => (
              <div key={r.label} className="flex justify-between items-center py-1 border-b last:border-0"
                style={{ borderColor: divider }}>
                <span className="text-sm" style={{ color: textSub }}>{r.label}</span>
                <span className="font-mono text-sm font-bold" style={{ color: darkMode ? 'rgba(255,255,255,0.7)' : '#475569' }}>{r.value}</span>
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              {[hi ? 'नियम' : te ? 'నిబంధనలు' : 'Terms', hi ? 'गोपनीयता' : te ? 'గోప్యత' : 'Privacy', hi ? 'सहायता' : te ? 'సహాయం' : 'Help'].map(label => (
                <button key={label} onClick={() => toast(`Opening ${label}...`)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
                  style={{ background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', border: `1px solid ${divider}`, color: textSub }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOGOUT ── */}
        <button onClick={handleLogout}
          className="group w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all hover:-translate-y-0.5 active:scale-[0.99]"
          style={{
            background: 'linear-gradient(135deg,rgba(239,68,68,0.15),rgba(220,38,38,0.08))',
            border: '1px solid rgba(239,68,68,0.25)',
            color: '#f87171',
            boxShadow: '0 8px 24px -8px rgba(239,68,68,0.2)'
          }}>
          <LogOut size={16} className="group-hover:rotate-12 transition-transform" />
          {hi ? 'साइन आउट' : te ? 'సైన్ అవుట్' : 'Sign Out'}
        </button>

        {/* ── TRUST FOOTER ── */}
        <div className="flex items-center justify-center gap-8 py-4 border-t" style={{ borderColor: divider }}>
          {[
            { text: 'PCI DSS Level 1', color: '#10b981' },
            { text: '256-bit SSL',     color: '#6366f1' },
            { text: 'RBI Compliant',   color: '#0ea5e9' },
          ].map(t => (
            <div key={t.text} className="flex items-center gap-1.5">
              <ShieldCheck size={11} style={{ color: t.color + '99' }} />
              <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: t.color + '55' }}>{t.text}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
