import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstruments } from '../stores/paymentInstrumentsSlice';
import { paymentService } from '../services/paymentService';
import toast from 'react-hot-toast';
import { selectUserId } from '../stores/authSlice';
import { X, CreditCard, Landmark, Smartphone, ShieldCheck, Eye, EyeOff, Wifi } from 'lucide-react';

// ── Helpers ──────────────────────────────────────────────────────
const detectBrand = (num = '') => {
  if (num.startsWith('4')) return { logo: 'VISA',       grad: 'from-[#1a1f71] to-[#00b4d8]', glow: '#00b4d8' };
  if (num.startsWith('5')) return { logo: 'MASTERCARD', grad: 'from-[#eb001b] to-[#f79e1b]', glow: '#f79e1b' };
  if (num.startsWith('3')) return { logo: 'AMEX',       grad: 'from-[#007b5e] to-[#00d4aa]', glow: '#00d4aa' };
  if (num.startsWith('6')) return { logo: 'RuPay',      grad: 'from-[#f97316] to-[#fbbf24]', glow: '#fbbf24' };
  return { logo: null, grad: 'from-[#0f172a] to-[#1e293b]', glow: '#6366f1' };
};

const fmtCard = (n = '') =>
  (n.replace(/\D/g, '').padEnd(16, '•').match(/.{1,4}/g) || []).join('  ');

// ── Neon Input ───────────────────────────────────────────────────
const NeonInput = ({ label, name, value, onChange, type = 'text', maxLength, inputMode, className = '', accent = '#6366f1', children }) => (
  <div className="relative">
    <input name={name} type={type} value={value} onChange={onChange}
      maxLength={maxLength} inputMode={inputMode} placeholder=" " required
      className={`peer w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-5 pb-2
        text-white font-medium outline-none text-sm
        focus:border-[var(--a)] focus:bg-white/8
        transition-all duration-200 placeholder-transparent ${className}`}
      style={{ '--a': accent }}
    />
    <label className="absolute left-4 top-1.5 text-[9px] font-bold uppercase tracking-widest text-white/30
      peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-medium
      peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-white/40
      peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:font-bold peer-focus:uppercase
      peer-focus:tracking-widest peer-focus:text-[var(--a)]
      transition-all duration-200 pointer-events-none"
      style={{ '--a': accent }}>
      {label}
    </label>
    {children}
  </div>
);

// ── 3D Card Preview ──────────────────────────────────────────────
const CardPreview = ({ data }) => {
  const brand = detectBrand(data.accountNumber);
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="w-full h-48 cursor-pointer select-none mb-2" onClick={() => setFlipped(f => !f)}
      style={{ perspective: '1000px' }}>
      <div className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d', transition: 'transform 0.65s cubic-bezier(.4,0,.2,1)', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>

        {/* ── FRONT ── */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${brand.grad} p-5 flex flex-col justify-between overflow-hidden`}
          style={{ backfaceVisibility: 'hidden', boxShadow: `0 20px 60px -10px ${brand.glow}55` }}>

          {/* noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

          {/* glare */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />

          {/* row 1 */}
          <div className="relative flex justify-between items-start">
            <div>
              <p className="text-white/40 text-[8px] uppercase tracking-[0.2em] font-bold">PaySphere</p>
              <p className="text-white/70 text-[10px] font-medium mt-0.5">{data.cardType || 'Debit'} Card</p>
            </div>
            <div className="flex items-center gap-2">
              {/* contactless */}
              <Wifi size={14} className="text-white/50 rotate-90" />
              {brand.logo
                ? <span className="text-white font-black text-sm italic tracking-tight drop-shadow">{brand.logo}</span>
                : <CreditCard size={18} className="text-white/30" />}
            </div>
          </div>

          {/* chip + number */}
          <div>
            <div className="w-8 h-6 rounded bg-gradient-to-br from-yellow-200 to-yellow-500 mb-3 flex items-center justify-center shadow-inner">
              <div className="w-5 h-3.5 rounded-sm border border-yellow-700/30 grid grid-cols-3 gap-px p-px">
                {[...Array(6)].map((_, i) => <div key={i} className="bg-yellow-700/20 rounded-[1px]" />)}
              </div>
            </div>
            <p className="text-white font-mono text-[15px] tracking-[0.22em] font-bold drop-shadow">
              {fmtCard(data.accountNumber)}
            </p>
          </div>

          {/* row 3 */}
          <div className="flex justify-between items-end">
            <div className="min-w-0">
              <p className="text-white/30 text-[8px] uppercase tracking-widest">Card Holder</p>
              <p className="text-white font-semibold text-xs tracking-wide uppercase truncate max-w-[150px]">
                {data.providerName || '— — — —'}
              </p>
            </div>
            <div className="text-right shrink-0 ml-3">
              <p className="text-white/30 text-[8px] uppercase tracking-widest">Expires</p>
              <p className="text-white font-mono text-xs">{data.expiry || 'MM / YY'}</p>
            </div>
          </div>

          {/* flip hint */}
          <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/20 text-[8px] uppercase tracking-widest">tap to flip</p>
        </div>

        {/* ── BACK ── */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${brand.grad} flex flex-col justify-center overflow-hidden`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', boxShadow: `0 20px 60px -10px ${brand.glow}55` }}>
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />
          <div className="w-full h-9 bg-black/50 mb-5" />
          <div className="px-5 flex items-center gap-3">
            <div className="flex-1 h-7 bg-white/10 rounded" />
            <div className="w-14 h-7 bg-white/90 rounded flex items-center justify-center">
              <span className="text-slate-800 font-mono font-bold text-sm">
                {data.cvv ? '•'.repeat(data.cvv.length) : 'CVV'}
              </span>
            </div>
          </div>
          <p className="text-white/20 text-[8px] text-center mt-5 uppercase tracking-widest">tap to flip</p>
        </div>
      </div>
    </div>
  );
};

// ── Tab config ───────────────────────────────────────────────────
const TABS = [
  { key: 'Card', label: 'Card',    icon: CreditCard, accent: '#a78bfa', grad: 'from-violet-600 to-purple-700' },
  { key: 'Bank', label: 'Bank', icon: Landmark, accent: '#38bdf8', grad: 'from-cyan-600 to-sky-700', glow: '#0ea5e9' },
  { key: 'UPI',  label: 'UPI',     icon: Smartphone, accent: '#818cf8', grad: 'from-indigo-600 to-violet-700', glow: '#6366f1' },
];

const UPI_APPS = [
  { name: 'GPay',    suffix: '@okicici', from: '#4285f4', to: '#34a853', initials: 'G'  },
  { name: 'PhonePe', suffix: '@ybl',     from: '#5f259f', to: '#8b5cf6', initials: 'P'  },
  { name: 'Paytm',   suffix: '@paytm',   from: '#00baf2', to: '#0284c7', initials: 'PT' },
  { name: 'BHIM',    suffix: '@upi',     from: '#00a651', to: '#16a34a', initials: 'B'  },
];

const BANKS = [
  { name: 'HDFC',  from: '#004c97', to: '#0072bc', initials: 'H',  ifscPrefix: 'HDFC0' },
  { name: 'SBI',   from: '#2d6a4f', to: '#40916c', initials: 'S',  ifscPrefix: 'SBIN0' },
  { name: 'ICICI', from: '#b5451b', to: '#e07b39', initials: 'IC', ifscPrefix: 'ICIC0' },
  { name: 'Axis',  from: '#97144d', to: '#c0395e', initials: 'A',  ifscPrefix: 'UTIB0' },
  { name: 'Kotak', from: '#ed1c24', to: '#f87171', initials: 'K',  ifscPrefix: 'KKBK0' },
  { name: 'PNB',   from: '#1d4ed8', to: '#60a5fa', initials: 'P',  ifscPrefix: 'PUNB0' },
];

// ── Main ─────────────────────────────────────────────────────────
const AddInstrumentModal = ({ isOpen, onClose }) => {
  const reduxUserId = useSelector(selectUserId);
  const dispatch = useDispatch();
  const [type, setType]       = useState('Card');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCvv, setShowCvv]     = useState(false);
  const [expiryError, setExpiryError] = useState('');
  const [ifscError, setIfscError]     = useState('');

  if (!isOpen) return null;

  const validateExpiry = (val) => {
    if (val.length < 5) { setExpiryError(''); return; }
    const [mm, yy] = val.split('/');
    const month = parseInt(mm, 10);
    const year  = 2000 + parseInt(yy, 10);
    const now   = new Date();
    const curYear  = now.getFullYear();
    const curMonth = now.getMonth() + 1;

    if (month < 1 || month > 12) {
      setExpiryError('Month must be between 01 – 12');
    } else if (year < curYear || (year === curYear && month < curMonth)) {
      setExpiryError('Card has expired — enter a future date');
    } else {
      setExpiryError('');
    }
  };

  const tab = TABS.find(t => t.key === type);

  const update = (e) => {
    let { name, value } = e.target;
    if (name === 'accountNumber') value = value.replace(/\D/g, '');
    if (name === 'expiry') {
      value = value.replace(/\D/g, '');
      if (value.length >= 3) value = value.slice(0, 2) + '/' + value.slice(2, 4);
      validateExpiry(value);
    }
    if (name === 'cvv')  value = value.replace(/\D/g, '');
    if (name === 'ifsc') {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
      if (value.length === 11) {
        const valid = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value);
        setIfscError(valid ? '' : 'Invalid IFSC — format: ABCD0123456');
      } else {
        setIfscError('');
      }
    }
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === 'Card' && expiryError) { toast.error(expiryError); return; }
    if (type === 'Bank') {
      const acc = (formData.accountNumber || '');
      if (acc.length < 9) { toast.error('Account number must be at least 9 digits'); return; }
      if (ifscError || (formData.ifsc || '').length !== 11) { toast.error('Enter a valid 11-character IFSC code'); return; }
    }
    setLoading(true);
    try {
      const userId = reduxUserId || localStorage.getItem('ps_userId') || 0;
      const raw = formData.accountNumber || '';
      const masked = type === 'UPI'
        ? (formData.upiId || '')
        : raw.length >= 4 ? `**** ${raw.slice(-4)}` : raw;

      await paymentService.addInstrument({
        UserID: parseInt(userId),
        Type: type === 'Bank' ? 'BankAccount' : type,
        ProviderName: formData.providerName || 'Default',
        MaskedIdentifier: masked,
        CardType: formData.cardType || 'Debit',
        Expiry: formData.expiry || '',
        IFSC: formData.ifsc || '',
        UpiId: formData.upiId || '',
        Status: 'Active',
      });

      toast.success(`${type} linked successfully!`);
      dispatch(fetchInstruments());
      onClose(); setFormData({});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to link. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/70 backdrop-blur-xl">
      <div className="w-full sm:max-w-md rounded-t-[2rem] sm:rounded-[2rem] flex flex-col max-h-[92vh] overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)', boxShadow: `0 40px 100px -20px ${tab.glow ?? '#6366f1'}44, 0 0 0 1px rgba(255,255,255,0.06)` }}>

        {/* ── HEADER ── */}
        <div className={`relative bg-gradient-to-r ${tab.grad} px-5 pt-5 pb-4 shrink-0 overflow-hidden`}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />
          {/* drag handle on mobile */}
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-3 sm:hidden" />
          <div className="relative flex justify-between items-center">
            <div>
              <p className="text-white/50 text-[9px] uppercase tracking-[0.25em] font-bold">PaySphere Vault</p>
              <h2 className="text-white text-lg font-black mt-0.5">Add Payment Method</h2>
              <div className="flex items-center gap-1 mt-1">
                <ShieldCheck size={10} className="text-white/50" />
                <p className="text-white/40 text-[9px] uppercase tracking-widest">256-bit SSL · PCI DSS Level 1</p>
              </div>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:rotate-90 duration-300">
              <X size={15} className="text-white" />
            </button>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="px-5 pt-4 shrink-0">
          <div className="flex bg-white/5 p-1 rounded-2xl gap-1 border border-white/5">
            {TABS.map(({ key, label, icon: Icon, accent }) => (
              <button key={key} type="button"
                onClick={() => { setType(key); setFormData({}); setExpiryError(''); setIfscError(''); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                  type === key ? 'bg-white/10 text-white shadow-inner' : 'text-white/30 hover:text-white/60'
                }`}
                style={type === key ? { color: accent, boxShadow: `0 0 12px ${accent}30` } : {}}>
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── SCROLLABLE BODY ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          <form onSubmit={handleSubmit} className="space-y-3">

            {/* ══ CARD ══ */}
            {type === 'Card' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CardPreview data={formData} />

                {/* Debit / Credit toggle */}
                <div className="flex gap-2">
                  {['Debit', 'Credit'].map(ct => (
                    <button key={ct} type="button"
                      onClick={() => setFormData(p => ({ ...p, cardType: ct }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                        formData.cardType === ct
                          ? 'border-violet-400/60 bg-violet-500/15 text-violet-300'
                          : 'border-white/10 text-white/30 hover:border-white/20 hover:text-white/50'
                      }`}>
                      {ct}
                    </button>
                  ))}
                </div>

                <NeonInput label="Bank / Issuer Name" name="providerName" value={formData.providerName || ''} onChange={update} accent="#a78bfa" />

                <NeonInput label="Card Number" name="accountNumber" value={formData.accountNumber || ''} onChange={update}
                  maxLength={16} inputMode="numeric" accent="#a78bfa" className="font-mono tracking-[0.2em] pr-20">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {detectBrand(formData.accountNumber).logo
                      ? <span className={`px-2 py-0.5 rounded text-[9px] font-black italic text-white bg-gradient-to-r ${detectBrand(formData.accountNumber).grad}`}>
                          {detectBrand(formData.accountNumber).logo}
                        </span>
                      : <CreditCard size={16} className="text-white/20" />}
                  </div>
                </NeonInput>

                <div className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <NeonInput label="MM / YY" name="expiry" value={formData.expiry || ''} onChange={update} maxLength={5} inputMode="numeric" accent={expiryError ? '#f87171' : '#a78bfa'} />
                    {expiryError && (
                      <p className="text-[10px] font-bold px-1 flex items-center gap-1" style={{ color: '#f87171' }}>
                        <span>⚠</span> {expiryError}
                      </p>
                    )}
                  </div>
                  <NeonInput label="CVV" name="cvv" value={formData.cvv || ''} onChange={update}
                    type={showCvv ? 'text' : 'password'} maxLength={4} inputMode="numeric" accent="#a78bfa" className="pr-10">
                    <button type="button" onClick={() => setShowCvv(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                      {showCvv ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </NeonInput>
                </div>
              </div>
            )}

            {/* ══ BANK ══ */}
            {type === 'Bank' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">

                {/* ── Bank hero passbook card ── */}
                <div className="relative rounded-2xl overflow-hidden h-32"
                  style={{ background: 'linear-gradient(135deg, #0c1a2e 0%, #0f3460 50%, #0c1a2e 100%)' }}>
                  <div className="absolute inset-0"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #38bdf820 0%, transparent 55%), radial-gradient(circle at 85% 20%, #0ea5e920 0%, transparent 50%)' }} />
                  {/* circuit line decoration */}
                  <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 400 128">
                    <path d="M0 64 H80 V30 H160 V90 H260 V40 H400" stroke="#38bdf8" strokeWidth="1" fill="none" />
                    <path d="M0 90 H60 V50 H140 V100 H300 V60 H400" stroke="#0ea5e9" strokeWidth="0.5" fill="none" />
                    <circle cx="80" cy="30" r="3" fill="#38bdf8" />
                    <circle cx="160" cy="90" r="3" fill="#38bdf8" />
                    <circle cx="260" cy="40" r="3" fill="#38bdf8" />
                  </svg>
                  <div className="relative flex items-center gap-4 px-5 h-full">
                    {/* bank logo circle */}
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                        style={{ background: '#38bdf8', animationDuration: '2.5s' }} />
                      <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-xl"
                        style={{
                          background: formData.providerName
                            ? `linear-gradient(135deg, ${BANKS.find(b => b.name === formData.providerName)?.from ?? '#0369a1'}, ${BANKS.find(b => b.name === formData.providerName)?.to ?? '#38bdf8'})`
                            : 'linear-gradient(135deg, #0369a1, #38bdf8)',
                          boxShadow: '0 0 20px #38bdf840'
                        }}>
                        {formData.providerName
                          ? BANKS.find(b => b.name === formData.providerName)?.initials ?? <Landmark size={20} />
                          : <Landmark size={20} />}
                      </div>
                    </div>
                    {/* account details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-cyan-300/50 text-[8px] uppercase tracking-widest font-bold">Bank Account</p>
                      <p className="text-white font-black text-sm mt-0.5">
                        {formData.providerName || 'Select a Bank'}
                      </p>
                      <p className="text-cyan-200/60 font-mono text-xs mt-1 tracking-widest">
                        {formData.accountNumber
                          ? ('•'.repeat(Math.max(0, formData.accountNumber.length - 4)) + formData.accountNumber.slice(-4)).replace(/.{4}/g, '$& ').trim()
                          : '•••• •••• ••••'}
                      </p>
                    </div>
                    {/* IFSC badge */}
                    {formData.ifsc && (
                      <div className="shrink-0 text-right">
                        <p className="text-cyan-300/40 text-[8px] uppercase tracking-widest">IFSC</p>
                        <p className="text-cyan-200 font-mono text-[10px] font-bold mt-0.5">{formData.ifsc}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Bank tiles ── */}
                <div>
                  <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold mb-2">Select Your Bank</p>
                  <div className="grid grid-cols-3 gap-2">
                    {BANKS.map(b => {
                      const selected = formData.providerName === b.name;
                      return (
                        <button key={b.name} type="button"
                          onClick={() => setFormData(p => ({ ...p, providerName: b.name }))}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-200 ${
                            selected ? 'scale-[1.03]' : 'border-white/8 bg-white/3 hover:border-white/15'
                          }`}
                          style={selected ? {
                            borderColor: b.from + '80',
                            background: b.from + '18',
                            boxShadow: `0 0 14px ${b.from}30`
                          } : {}}>
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[9px] font-black shrink-0"
                            style={{ background: `linear-gradient(135deg, ${b.from}, ${b.to})` }}>
                            {b.initials}
                          </div>
                          <span className="text-[10px] font-bold truncate"
                            style={{ color: selected ? b.to : 'rgba(255,255,255,0.4)' }}>
                            {b.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── Inputs ── */}
                <div>
                  <NeonInput label="Bank Name" name="providerName" value={formData.providerName || ''} onChange={update} accent="#38bdf8" />
                  {formData.providerName && BANKS.find(b => b.name === formData.providerName) && (() => {
                    const b = BANKS.find(b => b.name === formData.providerName);
                    return (
                      <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed"
                        style={{ borderColor: b.from + '40', background: b.from + '0d' }}>
                        <div className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[8px] font-black shrink-0"
                          style={{ background: `linear-gradient(135deg,${b.from},${b.to})` }}>
                          {b.initials}
                        </div>
                        <span className="text-[10px] font-bold flex-1" style={{ color: b.to + 'cc' }}>
                          {b.name} Bank selected
                        </span>
                        <button type="button"
                          onClick={() => setFormData(p => ({ ...p, providerName: '' }))}
                          className="text-[9px] font-bold uppercase tracking-widest transition-colors"
                          style={{ color: b.from + '80' }}
                          onMouseEnter={e => e.target.style.color = b.to}
                          onMouseLeave={e => e.target.style.color = b.from + '80'}>
                          Change
                        </button>
                      </div>
                    );
                  })()}
                </div>
                <NeonInput label="Account Number (9–18 digits)" name="accountNumber" value={formData.accountNumber || ''} onChange={update} inputMode="numeric" maxLength={18} accent="#38bdf8" />

                {/* IFSC with live bank name hint */}
                <div>
                  <NeonInput label="IFSC Code" name="ifsc" value={formData.ifsc || ''} onChange={update} maxLength={11} accent={ifscError ? '#f87171' : '#38bdf8'} className="uppercase tracking-widest font-mono" />
                  {ifscError
                    ? <p className="mt-1 text-[10px] font-bold px-1 flex items-center gap-1" style={{ color: '#f87171' }}>⚠ {ifscError}</p>
                    : (formData.ifsc || '').length >= 4 && (
                        <p className="mt-1.5 text-[10px] text-cyan-400/60 font-mono px-1">
                          Branch: <span className="text-cyan-300/80">{formData.ifsc.slice(0, 4)} — {formData.ifsc.slice(4) || '...'}</span>
                        </p>
                      )
                  }
                  {(() => {
                    const b = BANKS.find(b => b.name === formData.providerName);
                    if (!b || (formData.ifsc || '').length > 0) return null;
                    return (
                      <button type="button"
                        onClick={() => {
                          setFormData(p => ({ ...p, ifsc: b.ifscPrefix }));
                          setIfscError('');
                        }}
                        className="mt-2 w-full py-2 rounded-xl border border-dashed text-[10px] font-bold transition-all"
                        style={{ borderColor: b.from + '40', color: b.to + 'aa', background: b.from + '0d' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = b.from + '80'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = b.from + '40'}>
                        Tap to fill prefix&nbsp;<span className="font-mono">{b.ifscPrefix}</span>
                      </button>
                    );
                  })()}
                </div>

                {/* ── Security strip ── */}
                <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 border border-cyan-400/15"
                  style={{ background: 'linear-gradient(90deg, rgba(14,165,233,0.07) 0%, rgba(56,189,248,0.07) 100%)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0369a1, #38bdf8)', boxShadow: '0 0 10px #38bdf840' }}>
                    <ShieldCheck size={13} className="text-white" />
                  </div>
                  <div>
                    <p className="text-cyan-200/80 text-[10px] font-bold">Read-Only Verification</p>
                    <p className="text-cyan-300/40 text-[9px] mt-0.5">Encrypted at rest · Never shared · RBI compliant</p>
                  </div>
                </div>

              </div>
            )}

            {/* ══ UPI ══ */}
            {type === 'UPI' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">

                {/* ── UPI hero banner ── */}
                <div className="relative rounded-2xl overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)' }}>
                  <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #818cf8 0%, transparent 60%), radial-gradient(circle at 80% 20%, #a78bfa 0%, transparent 50%)' }} />
                  {/* scanner ring */}
                  <div className="relative flex flex-col items-center py-5">
                    <div className="relative w-16 h-16 mb-3">
                      {/* outer pulse ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-indigo-400/30 animate-ping" style={{ animationDuration: '2s' }} />
                      <div className="absolute inset-1 rounded-full border border-indigo-400/20" />
                      {/* inner icon */}
                      <div className="absolute inset-2 rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 0 20px #6366f155' }}>
                        <Smartphone size={20} className="text-white" />
                      </div>
                    </div>
                    <p className="text-white font-black text-sm tracking-wide">Unified Payments Interface</p>
                    <p className="text-indigo-300/60 text-[10px] mt-0.5 tracking-widest uppercase">Instant · Secure · Free</p>
                  </div>
                </div>

                {/* ── App selector ── */}
                <div>
                  <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold mb-2">Choose Your UPI App</p>
                  <div className="grid grid-cols-4 gap-2">
                    {UPI_APPS.map(app => {
                      const selected = formData.upiSuffix === app.suffix;
                      return (
                        <button key={app.name} type="button"
                          onClick={() => setFormData(p => ({ ...p, upiSuffix: app.suffix }))}
                          className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border transition-all duration-200 ${
                            selected ? 'scale-105' : 'border-white/8 bg-white/3 hover:border-white/15'
                          }`}
                          style={selected ? {
                            borderColor: app.from + '80',
                            background: app.from + '18',
                            boxShadow: `0 0 16px ${app.from}30`
                          } : {}}>
                          {/* app icon circle */}
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-lg"
                            style={{ background: `linear-gradient(135deg, ${app.from}, ${app.to})`, boxShadow: `0 4px 12px ${app.from}50` }}>
                            {app.initials}
                          </div>
                          <span className="text-[9px] font-bold" style={{ color: selected ? app.from : 'rgba(255,255,255,0.35)' }}>
                            {app.name}
                          </span>
                          {selected && (
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: app.from }} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── VPA input with live split ── */}
                <div>
                  <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold mb-2">Your VPA / UPI ID</p>
                  <div className="relative rounded-xl overflow-hidden border border-white/10 focus-within:border-indigo-400/60 transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <input
                      name="upiId" value={formData.upiId || ''} onChange={update}
                      placeholder="username@bankname" required
                      className="w-full bg-transparent px-4 py-3.5 text-white font-mono text-sm outline-none placeholder-white/20 text-center tracking-wide"
                    />
                    {/* live split display */}
                    {(formData.upiId || '').includes('@') && (
                      <div className="flex items-center justify-center gap-0 pb-2.5 -mt-1">
                        <span className="text-indigo-300 font-mono text-xs font-bold">
                          {formData.upiId.split('@')[0]}
                        </span>
                        <span className="text-white/30 font-mono text-xs mx-0.5">@</span>
                        <span className="text-violet-300 font-mono text-xs font-bold">
                          {formData.upiId.split('@')[1]}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* suffix append hint */}
                  {formData.upiSuffix && !(formData.upiId || '').includes('@') && (
                    <button type="button"
                      onClick={() => setFormData(p => ({ ...p, upiId: (p.upiId || '') + p.upiSuffix }))}
                      className="mt-2 w-full py-2 rounded-xl border border-dashed border-indigo-400/25 text-[10px] font-bold text-indigo-400/60 hover:text-indigo-400 hover:border-indigo-400/50 transition-all">
                      Tap to append <span className="font-mono">{formData.upiSuffix}</span>
                    </button>
                  )}
                </div>

                {/* ── ₹0 verify strip ── */}
                <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 border border-indigo-400/15"
                  style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.08) 100%)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 0 10px #6366f140' }}>
                    <ShieldCheck size={13} className="text-white" />
                  </div>
                  <div>
                    <p className="text-indigo-200/80 text-[10px] font-bold">₹0 Verification Request</p>
                    <p className="text-indigo-300/40 text-[9px] mt-0.5">Sent to your UPI app to confirm ownership</p>
                  </div>
                </div>

              </div>
            )}

            {/* ── SUBMIT ── */}
            <button type="submit" disabled={loading}
              className={`w-full py-3.5 rounded-2xl font-black text-white text-sm tracking-wide
                flex items-center justify-center gap-2 transition-all duration-200
                active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                bg-gradient-to-r ${tab.grad} mt-2`}
              style={{ boxShadow: `0 8px 32px -4px ${tab.glow ?? '#6366f1'}60` }}>
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Securing...
                </>
              ) : (
                <>
                  <ShieldCheck size={15} />
                  {type === 'Card' ? 'Add Card Securely' : type === 'Bank' ? 'Link Bank Account' : 'Verify & Link UPI'}
                </>
              )}
            </button>

          </form>
        </div>

        {/* ── FOOTER TRUST BAR ── */}
        <div className="px-5 py-3 border-t border-white/5 flex items-center justify-center gap-4 shrink-0">
          {['PCI DSS', 'ISO 27001', '256-bit SSL'].map(t => (
            <div key={t} className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-emerald-400/60" />
              <span className="text-white/20 text-[9px] uppercase tracking-widest font-bold">{t}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AddInstrumentModal;
