import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authservices/authService";
import {
  Eye, EyeOff, ArrowRight, CheckCircle, Users, Store,
  Mail, KeyRound, Phone, UserRound, Shield, Zap, TrendingUp,
} from "lucide-react";

const MERCHANT_CATEGORIES = [
  "Airline", "Supermarket", "Restaurants",
  "Service Stations", "Resorts", "Specialty Retail Stores",
];
const CATEGORY_META = {
  "Airline":               { icon: "✈️", from: "#3b82f6", to: "#06b6d4" },
  "Supermarket":           { icon: "🛒", from: "#10b981", to: "#06b6d4" },
  "Restaurants":           { icon: "🍽️", from: "#f97316", to: "#ef4444" },
  "Service Stations":      { icon: "⛽", from: "#f59e0b", to: "#f97316" },
  "Resorts":               { icon: "🏨", from: "#8b5cf6", to: "#6366f1" },
  "Specialty Retail Stores":{ icon: "🛍️", from: "#ec4899", to: "#f43f5e" },
};

const PERKS = [
  "Free instant P2P transfers",
  "Virtual & physical card support",
  "Real-time transaction alerts",
  "Merchant payment gateway",
  "Multi-currency wallet",
];

const FEED = [
  { emoji: "🎉", text: "Sneha just joined PaySphere",  time: "just now", color: "#a5b4fc" },
  { emoji: "💸", text: "Rahul sent ₹2,500 to Priya",  time: "12s ago",  color: "#10b981" },
  { emoji: "🏪", text: "Zara Boutique went live",      time: "1m ago",   color: "#06b6d4" },
  { emoji: "📈", text: "₹50B processed today",         time: "live",     color: "#f59e0b" },
];

const initial = { name: "", email: "", password: "", phone: "", role: "", category: "" };

function PasswordStrength({ password }) {
  const checks = [
    { label: "6+ chars",  pass: password.length >= 6 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number",    pass: /\d/.test(password) },
    { label: "Symbol",    pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const palette = ["#ef4444", "#f97316", "#f59e0b", "#10b981"];
  const labels  = ["Weak", "Fair", "Good", "Strong"];
  if (!password) return null;
  return (
    <div className="mt-2.5 space-y-2">
      <div className="flex gap-1.5">
        {[0,1,2,3].map(i => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-500"
            style={{ background: i < score ? palette[score - 1] : "rgba(255,255,255,0.07)" }} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          {checks.map(c => (
            <span key={c.label} className="flex items-center gap-1 text-[10px] font-bold transition-colors duration-300"
              style={{ color: c.pass ? "#10b981" : "rgba(255,255,255,0.18)" }}>
              <CheckCircle size={9} />{c.label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span className="text-[10px] font-black uppercase tracking-widest transition-colors duration-300"
            style={{ color: palette[score - 1] }}>{labels[score - 1]}</span>
        )}
      </div>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initial);
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const e = {};
    if (!formData.name) e.name = "Full name is required.";
    if (!formData.email) e.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) e.email = "Invalid email.";
    if (!formData.password) e.password = "Password is required.";
    else if (formData.password.length < 6) e.password = "Minimum 6 characters.";
    if (!formData.phone) e.phone = "Phone is required.";
    else if (!/^\d{7,15}$/.test(formData.phone)) e.phone = "Phone must be 7–15 digits.";
    if (!formData.role) e.role = "Select an account type.";
    if (formData.role === "Merchant" && !formData.category) e.category = "Select a category.";
    return e;
  };

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    if (name === "role") {
      setFormData(p => ({ ...p, role: value, category: value === "Merchant" ? p.category : "" }));
      setErrors(p => ({ ...p, role: "", category: "" }));
      return;
    }
    setFormData(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: "" }));
    setApiError("");
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    try {
      setSubmitting(true);
      setApiError("");
      await registerUser(formData);
      navigate("/login");
    } catch (error) {
      setApiError(error?.response?.data?.message || error?.response?.data?.title || "Registration failed. Please check your inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase = "w-full pl-11 pr-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all duration-200 placeholder-white/20";
  const inputBorder = (f) => ({
    background: "rgba(255,255,255,0.05)",
    border: `1px solid ${errors[f] ? "#f87171" : "rgba(255,255,255,0.09)"}`,
  });
  const onFocus = e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; };
  const onBlur  = (e, f) => { e.target.style.borderColor = errors[f] ? "#f87171" : "rgba(255,255,255,0.09)"; e.target.style.boxShadow = "none"; };

  // progress: role selected = 1, all base fields = 2, category (if merchant) = 3
  const filledBase = formData.name && formData.email && formData.password && formData.phone;
  const progress = !formData.role ? 0 : !filledBase ? 1 : (formData.role === "Merchant" && !formData.category) ? 2 : 3;
  const steps = ["Account Type", "Your Details", formData.role === "Merchant" ? "Business Info" : "All Set!"];

  return (
    <div className="min-h-screen w-full flex bg-[#050816] text-white overflow-x-hidden">

      {/* ── Ambient orbs ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.14]"
          style={{ background: "radial-gradient(circle,#6366f1,transparent)", filter: "blur(90px)" }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.12]"
          style={{ background: "radial-gradient(circle,#10b981,transparent)", filter: "blur(90px)" }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* ══════════════ LEFT PANEL ══════════════ */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] relative px-14 py-12 overflow-hidden border-r border-white/[0.06]">
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(145deg,rgba(99,102,241,0.08) 0%,rgba(16,185,129,0.04) 100%)" }} />
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(99,102,241,0.2),transparent 70%)", filter: "blur(40px)" }} />

        {/* Logo */}
        <Link to="/" className="relative flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg"
            style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", boxShadow: "0 0 24px #6366f166" }}>P</div>
          <span className="text-xl font-black tracking-tight">Pay<span style={{ color: "#06b6d4" }}>Sphere</span></span>
        </Link>

        {/* Center */}
        <div className="relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 mb-5 text-[11px] font-bold uppercase tracking-widest"
              style={{ background: "rgba(16,185,129,0.1)", color: "#6ee7b7" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Free · No Credit Card
            </div>
            <h2 className="text-[2.6rem] font-black leading-[1.1] mb-4">
              Join 2 million+<br />
              <span style={{ background: "linear-gradient(135deg,#a5b4fc,#10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                smart spenders.
              </span>
            </h2>
            <p className="text-white/35 text-[15px] leading-relaxed">
              Create your account in 60 seconds. Instant wallet, smart cards, and real-time analytics — all free.
            </p>
          </div>

          {/* Perks */}
          <div className="space-y-2.5">
            {PERKS.map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(16,185,129,0.15)" }}>
                  <CheckCircle size={12} style={{ color: "#10b981" }} />
                </div>
                <span className="text-white/45 text-sm">{f}</span>
              </div>
            ))}
          </div>

          {/* Live join feed */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/25 mb-3">Live Activity</p>
            <div className="space-y-2">
              {FEED.map((f, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/[0.06]"
                  style={{ background: "rgba(255,255,255,0.025)" }}>
                  <span className="text-base shrink-0">{f.emoji}</span>
                  <span className="text-white/45 text-xs flex-1">{f.text}</span>
                  <span className="text-[10px] font-bold shrink-0" style={{ color: f.color + "99" }}>{f.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom trust */}
        <div className="relative z-10 flex items-center gap-5 text-[10px] font-bold uppercase tracking-widest text-white/20">
          {["PCI DSS", "ISO 27001", "RBI Compliant"].map(b => (
            <span key={b} className="flex items-center gap-1.5">
              <Shield size={9} className="text-emerald-400/40" />{b}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════ RIGHT PANEL ══════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">

        {/* Mobile logo */}
        <Link to="/" className="flex items-center gap-3 mb-8 lg:hidden">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white"
            style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)" }}>P</div>
          <span className="text-xl font-black">Pay<span style={{ color: "#06b6d4" }}>Sphere</span></span>
        </Link>

        <div className="w-full max-w-[440px]">

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-[2rem] font-black mb-1.5 tracking-tight">Create Account</h1>
            <p className="text-white/35 text-sm">
              Already have one?{" "}
              <Link to="/login" className="font-bold transition-colors hover:text-white" style={{ color: "#06b6d4" }}>
                Sign in →
              </Link>
            </p>
          </div>

          {/* Progress steps */}
          <div className="flex items-center gap-2 mb-7">
            {steps.map((s, i) => {
              const done = i < progress;
              const active = i === progress;
              return (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black transition-all duration-300"
                      style={{
                        background: done ? "#10b981" : active ? "linear-gradient(135deg,#6366f1,#06b6d4)" : "rgba(255,255,255,0.07)",
                        color: (done || active) ? "white" : "rgba(255,255,255,0.25)",
                        boxShadow: active ? "0 0 12px #6366f155" : "none",
                      }}>
                      {done ? <CheckCircle size={11} /> : i + 1}
                    </div>
                    <span className="text-[10px] font-bold hidden sm:block transition-colors duration-300"
                      style={{ color: done ? "#10b981" : active ? "white" : "rgba(255,255,255,0.2)" }}>{s}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 h-px transition-all duration-500"
                      style={{ background: done ? "#10b981" : "rgba(255,255,255,0.07)" }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* API error */}
          {apiError && (
            <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl border border-red-500/25 text-red-400 text-sm"
              style={{ background: "rgba(239,68,68,0.07)" }}>
              <span className="text-base shrink-0">⚠️</span>
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Account type */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest mb-3 text-white/35">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "User",     label: "Personal",  icon: Users,  from: "#6366f1", to: "#8b5cf6", sub: "For individuals" },
                  { value: "Merchant", label: "Business",  icon: Store,  from: "#06b6d4", to: "#10b981", sub: "For merchants"   },
                ].map(r => {
                  const sel = formData.role === r.value;
                  return (
                    <button key={r.value} type="button"
                      onClick={() => handleChange({ target: { name: "role", value: r.value } })}
                      className="flex items-center gap-3 px-4 py-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-left"
                      style={{
                        background: sel ? `linear-gradient(135deg,${r.from}22,${r.to}12)` : "rgba(255,255,255,0.03)",
                        borderColor: sel ? r.from + "65" : "rgba(255,255,255,0.07)",
                        boxShadow: sel ? `0 0 24px ${r.from}22, inset 0 1px 0 rgba(255,255,255,0.07)` : "none",
                      }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
                        style={{ background: sel ? `linear-gradient(135deg,${r.from},${r.to})` : "rgba(255,255,255,0.06)", boxShadow: sel ? `0 4px 12px ${r.from}44` : "none" }}>
                        <r.icon size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="font-black text-sm transition-colors duration-200" style={{ color: sel ? "white" : "rgba(255,255,255,0.4)" }}>{r.label}</p>
                        <p className="text-[10px] transition-colors duration-200" style={{ color: sel ? r.from : "rgba(255,255,255,0.18)" }}>{r.sub}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.role && <p className="text-red-400 text-xs mt-1.5 font-medium flex items-center gap-1"><span>⚠</span>{errors.role}</p>}
            </div>

            {/* Name */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest mb-2 text-white/35">Full Name</label>
              <div className="relative">
                <UserRound size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                <input type="text" name="name" placeholder="John Doe"
                  value={formData.name} onChange={handleChange}
                  className={inputBase} style={inputBorder("name")}
                  onFocus={onFocus} onBlur={e => onBlur(e, "name")} />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1.5 font-medium flex items-center gap-1"><span>⚠</span>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest mb-2 text-white/35">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                <input type="email" name="email" placeholder="you@example.com"
                  value={formData.email} onChange={handleChange}
                  className={inputBase} style={inputBorder("email")}
                  onFocus={onFocus} onBlur={e => onBlur(e, "email")} />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5 font-medium flex items-center gap-1"><span>⚠</span>{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest mb-2 text-white/35">Phone Number</label>
              <div className="relative">
                <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                <input type="text" name="phone" placeholder="9876543210"
                  value={formData.phone} onChange={handleChange}
                  className={inputBase} style={inputBorder("phone")}
                  onFocus={onFocus} onBlur={e => onBlur(e, "phone")} />
              </div>
              {errors.phone && <p className="text-red-400 text-xs mt-1.5 font-medium flex items-center gap-1"><span>⚠</span>{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest mb-2 text-white/35">Password</label>
              <div className="relative">
                <KeyRound size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                <input type={showPw ? "text" : "password"} name="password" placeholder="Create a strong password"
                  value={formData.password} onChange={handleChange}
                  className={`${inputBase} pr-12`} style={inputBorder("password")}
                  onFocus={onFocus} onBlur={e => onBlur(e, "password")} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <PasswordStrength password={formData.password} />
              {errors.password && <p className="text-red-400 text-xs mt-1.5 font-medium flex items-center gap-1"><span>⚠</span>{errors.password}</p>}
            </div>

            {/* Merchant category */}
            {formData.role === "Merchant" && (
              <div className="animate-in fade-in slide-in-from-top-3 duration-300">
                <label className="block text-[11px] font-black uppercase tracking-widest mb-3 text-white/35">Business Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {MERCHANT_CATEGORIES.map(c => {
                    const meta = CATEGORY_META[c];
                    const sel  = formData.category === c;
                    return (
                      <button key={c} type="button"
                        onClick={() => { setFormData(p => ({ ...p, category: c })); setErrors(p => ({ ...p, category: "" })); }}
                        className="flex items-center gap-2.5 px-3 py-3 rounded-xl border transition-all duration-200 text-left hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                          background: sel ? `linear-gradient(135deg,${meta.from}20,${meta.to}12)` : "rgba(255,255,255,0.03)",
                          borderColor: sel ? meta.from + "60" : "rgba(255,255,255,0.07)",
                          boxShadow: sel ? `0 0 16px ${meta.from}25` : "none",
                        }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                          style={{ background: sel ? `linear-gradient(135deg,${meta.from},${meta.to})` : "rgba(255,255,255,0.06)" }}>
                          {meta.icon}
                        </div>
                        <span className="text-xs font-bold transition-colors duration-200"
                          style={{ color: sel ? "white" : "rgba(255,255,255,0.35)" }}>{c}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.category && <p className="text-red-400 text-xs mt-1.5 font-medium flex items-center gap-1"><span>⚠</span>{errors.category}</p>}
              </div>
            )}

            {/* Submit */}
            <div className="relative mt-2">
              <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite]"
                  style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)", animationDelay: "1.2s" }} />
              </div>
              <button type="submit" disabled={submitting}
                className="group relative w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-white text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_#6366f155] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)" }}>
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Creating Account…
                  </>
                ) : (
                  <>
                    Create Free Account
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-[10px] text-white/18 pt-1">
              By signing up you agree to our{" "}
              <a href="#" className="underline hover:text-white/40 transition-colors">Terms</a>
              {" & "}
              <a href="#" className="underline hover:text-white/40 transition-colors">Privacy Policy</a>.
            </p>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            <span className="text-[11px] text-white/20 font-bold uppercase tracking-widest">secured by</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>

          <div className="flex items-center justify-center gap-4">
            {["PCI DSS L1", "256-bit SSL", "RBI Compliant"].map(b => (
              <div key={b} className="flex items-center gap-1.5">
                <Shield size={10} className="text-emerald-400/50" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{b}</span>
              </div>
            ))}
          </div>

          <p className="text-center mt-6 text-xs text-white/15">
            <Link to="/" className="hover:text-white/40 transition-colors">← Back to PaySphere</Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shimmer { to { transform: translateX(200%); } }
      `}</style>
    </div>
  );
}
