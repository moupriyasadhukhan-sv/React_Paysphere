// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { loginUser } from "../../services/authservices/authService";
// import { useAuth } from "../../context/AuthContext";
// import {
//   Eye, EyeOff, ArrowRight, Shield, Zap, Lock,
//   Mail, KeyRound, TrendingUp, Users, Activity,
// } from "lucide-react";

// function normalizeRole(roleRaw) {
//   const r = String(roleRaw || "").trim().toLowerCase().replaceAll("_", "-");
//   if (r === "opsadmin") return "ops-admin";
//   return r;
// }

// const ROLE_TO_PATH = {
//   user: "/dashboard/user", merchant: "/dashboard/merchant",
//   admin: "/dashboard/admin", risk: "/dashboard/risk",
//   ops: "/dashboard/ops", "ops-admin": "/dashboard/ops-admin",
// };

// const ROLES = [
//   { value: "User",     label: "User",     icon: "👤", from: "#6366f1", to: "#8b5cf6" },
//   { value: "Merchant", label: "Merchant", icon: "🏪", from: "#06b6d4", to: "#0ea5e9" },
//   { value: "Admin",    label: "Admin",    icon: "🛡️", from: "#f59e0b", to: "#ef4444" },
//   { value: "Risk",     label: "Risk",     icon: "⚠️", from: "#f97316", to: "#ef4444" },
//   { value: "Ops",      label: "Ops",      icon: "⚙️", from: "#10b981", to: "#06b6d4" },
// ];

// const STATS = [
//   { icon: Users,    value: "2M+",   label: "Active Users"    },
//   { icon: Activity, value: "99.9%", label: "Uptime"          },
//   { icon: Zap,      value: "<2s",   label: "Transfer Speed"  },
//   { icon: Shield,   value: "PCI L1",label: "Security Grade"  },
// ];

// const FEED = [
//   { emoji: "💸", text: "Rahul sent ₹2,500",      time: "2s ago",  color: "#10b981" },
//   { emoji: "🛒", text: "Priya paid at Swiggy",   time: "14s ago", color: "#f97316" },
//   { emoji: "💼", text: "Salary credited ₹45,000", time: "1m ago",  color: "#6366f1" },
//   { emoji: "✈️", text: "Arjun booked a flight",  time: "3m ago",  color: "#06b6d4" },
// ];

// const initial = { email: "", password: "", role: "" };

// export default function Login() {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [data, setData]             = useState(initial);
//   const [errors, setErrors]         = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [showPw, setShowPw]         = useState(false);
//   const [apiError, setApiError]     = useState("");

//   const validate = () => {
//     const e = {};
//     if (!data.email) e.email = "Email is required.";
//     else if (!/^\S+@\S+\.\S+$/.test(data.email)) e.email = "Invalid email address.";
//     if (!data.password) e.password = "Password is required.";
//     else if (data.password.length < 6) e.password = "Minimum 6 characters.";
//     if (!data.role) e.role = "Please select a role.";
//     return e;
//   };

//   const handleChange = (ev) => {
//     const { name, value } = ev.target;
//     setData(p => ({ ...p, [name]: value }));
//     setErrors(p => ({ ...p, [name]: "" }));
//     setApiError("");
//   };
//   const handleSubmit = async (ev) => {
//     ev.preventDefault();
//     const e = validate();
//     setErrors(e);
//     if (Object.keys(e).length) return;

//     try {
//       setSubmitting(true);
//       setApiError("");

//       // 1. Call API
//       const res = await loginUser({ 
//         email: data.email, 
//         password: data.password, 
//         role: data.role 
//       });

//       // 2. Extract identifiers (Assuming Token is now in a Cookie)
//       const rawRole = res?.data?.role || data.role;
//       const backendRole = normalizeRole(rawRole);
//       const selectedRole = normalizeRole(data.role);
//       const userId = res.data.userID || res.data.merchantID || res.data.id;

//       // 3. Role Validation
//       if (backendRole !== selectedRole) {
//         setApiError(`Role mismatch! You cannot login as ${data.role}.`);
//         return;
//       }

//       // 4. Save to Redux (No accessToken here)
//       dispatch(
//         setCredentials({
//           role: backendRole,
//           userId: userId,
//           loggedIn: true
//         })
//       );

//       // 5. Save to LocalStorage for persistence 
//       // (Visible to users, but contains no secret tokens)
//       localStorage.setItem("loggedIn", "true");
//       localStorage.setItem("role", backendRole);
//       localStorage.setItem("userId", userId);

//       // 6. Navigate to Role-Based Dashboard
//       const path = ROLE_TO_PATH[backendRole] || "/dashboard/user";
//       navigate(path, { replace: true });

//     } catch (err) {
//       setApiError(err?.response?.data?.message || "Invalid credentials. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // const handleSubmit = async (ev) => {
//   //   ev.preventDefault();
//   //   const e = validate();
//   //   setErrors(e);
//   //   if (Object.keys(e).length) return;
//   //   try {
//   //     setSubmitting(true);
//   //     setApiError("");
//   //     const res = await loginUser({ email: data.email, password: data.password, role: data.role });
//   //     const token = res?.data?.token || res?.data?.accessToken;
//   //     const rawRole = res?.data?.role || data.role;
//   //     if (!token) { setApiError("Login succeeded but token missing."); return; }
//   //     let name = res?.data?.name || res?.data?.userName || res?.data?.fullName || "";
//   //     if (!name) {
//   //       try {
//   //         const { jwtDecode } = await import("jwt-decode");
//   //         const decoded = jwtDecode(token);
//   //         name = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decoded.name || decoded.given_name || "";
//   //       } catch {}
//   //     }
//   //     login(token, rawRole, name);
//   //     navigate(ROLE_TO_PATH[normalizeRole(rawRole)] || "/dashboard/user", { replace: true });
//   //   } catch (err) {
//   //     setApiError(err?.response?.data?.message || "Invalid credentials. Please try again.");
//   //   } finally {
//   //     setSubmitting(false);
//   //   }
//   // };

//   return (
//     <div className="min-h-screen w-full flex bg-[#050816] text-white overflow-hidden">

//       {/* ── Ambient orbs ── */}
//       <div className="fixed inset-0 pointer-events-none">
//         <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.15]"
//           style={{ background: "radial-gradient(circle, #6366f1, transparent)", filter: "blur(90px)" }} />
//         <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.12]"
//           style={{ background: "radial-gradient(circle, #06b6d4, transparent)", filter: "blur(90px)" }} />
//         {/* animated grid */}
//         <div className="absolute inset-0 opacity-[0.03]"
//           style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
//       </div>

//       {/* ══════════════ LEFT PANEL ══════════════ */}
//       <div className="hidden lg:flex flex-col justify-between w-[46%] relative px-14 py-12 overflow-hidden border-r border-white/[0.06]">
//         {/* panel bg */}
//         <div className="absolute inset-0"
//           style={{ background: "linear-gradient(145deg,rgba(99,102,241,0.09) 0%,rgba(6,182,212,0.04) 100%)" }} />
//         {/* top-right glow */}
//         <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
//           style={{ background: "radial-gradient(circle,rgba(99,102,241,0.25),transparent 70%)", filter: "blur(40px)" }} />

//         {/* Logo */}
//         <Link to="/" className="relative flex items-center gap-3 z-10">
//           <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg"
//             style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", boxShadow: "0 0 24px #6366f166" }}>P</div>
//           <span className="text-xl font-black tracking-tight">Pay<span style={{ color: "#06b6d4" }}>Sphere</span></span>
//         </Link>

//         {/* Center */}
//         <div className="relative z-10 space-y-8">
//           <div>
//             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 mb-5 text-[11px] font-bold uppercase tracking-widest"
//               style={{ background: "rgba(99,102,241,0.1)", color: "#a5b4fc" }}>
//               <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
//               Secure Login Portal
//             </div>
//             <h2 className="text-[2.6rem] font-black leading-[1.1] mb-4">
//               Welcome back<br />
//               <span style={{ background: "linear-gradient(135deg,#a5b4fc,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
//                 to your finances.
//               </span>
//             </h2>
//             <p className="text-white/35 text-[15px] leading-relaxed">
//               Access your wallet, transactions, and payment tools — secured with enterprise-grade encryption.
//             </p>
//           </div>

//           {/* Floating card mockup */}
//           <div className="relative">
//             <div className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl pointer-events-none"
//               style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)" }} />
//             <div className="relative rounded-2xl p-5 border border-white/10 overflow-hidden"
//               style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.18),rgba(6,182,212,0.1))", backdropFilter: "blur(12px)" }}>
//               {/* card shine */}
//               <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
//                 style={{ background: "radial-gradient(circle,rgba(255,255,255,0.08),transparent 70%)" }} />
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <p className="text-white/30 text-[9px] uppercase tracking-[0.25em] font-bold">PaySphere Wallet</p>
//                   <p className="text-white font-black text-2xl mt-0.5">₹1,24,580</p>
//                 </div>
//                 <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white"
//                   style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)" }}>P</div>
//               </div>
//               <div className="flex items-center gap-1.5 mb-4">
//                 <TrendingUp size={12} className="text-emerald-400" />
//                 <span className="text-emerald-400 text-xs font-bold">+12.4% this month</span>
//               </div>
//               <div className="grid grid-cols-2 gap-2">
//                 {[{ l: "Sent", v: "₹8,200", c: "#f43f5e" }, { l: "Received", v: "₹14,500", c: "#10b981" }].map(s => (
//                   <div key={s.l} className="rounded-xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.06)" }}>
//                     <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold">{s.l}</p>
//                     <p className="font-black text-sm mt-0.5" style={{ color: s.c }}>{s.v}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Live activity feed */}
//           <div className="space-y-2">
//             <p className="text-[10px] font-black uppercase tracking-widest text-white/25 mb-3">Live Activity</p>
//             {FEED.map((f, i) => (
//               <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/[0.06]"
//                 style={{ background: "rgba(255,255,255,0.025)" }}>
//                 <span className="text-base shrink-0">{f.emoji}</span>
//                 <span className="text-white/50 text-xs flex-1">{f.text}</span>
//                 <span className="text-[10px] font-bold shrink-0" style={{ color: f.color + "99" }}>{f.time}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Stats ticker */}
//         <div className="relative z-10 grid grid-cols-4 gap-2">
//           {STATS.map(({ icon: Icon, value, label }) => (
//             <div key={label} className="flex flex-col items-center gap-1 py-3 rounded-xl border border-white/[0.06]"
//               style={{ background: "rgba(255,255,255,0.025)" }}>
//               <Icon size={13} className="text-white/25" />
//               <p className="font-black text-sm text-white">{value}</p>
//               <p className="text-[9px] text-white/25 font-bold uppercase tracking-wider text-center leading-tight">{label}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ══════════════ RIGHT PANEL ══════════════ */}
//       <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">

//         {/* Mobile logo */}
//         <Link to="/" className="flex items-center gap-3 mb-10 lg:hidden">
//           <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white"
//             style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)" }}>P</div>
//           <span className="text-xl font-black">Pay<span style={{ color: "#06b6d4" }}>Sphere</span></span>
//         </Link>

//         <div className="w-full max-w-[420px]">

//           {/* Heading */}
//           <div className="mb-8">
//             <h1 className="text-[2rem] font-black mb-1.5 tracking-tight">Sign In</h1>
//             <p className="text-white/35 text-sm">
//               No account?{" "}
//               <Link to="/register" className="font-bold transition-colors hover:text-white" style={{ color: "#06b6d4" }}>
//                 Create one free →
//               </Link>
//             </p>
//           </div>

//           {/* API error */}
//           {apiError && (
//             <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl border border-red-500/25 text-red-400 text-sm"
//               style={{ background: "rgba(239,68,68,0.07)" }}>
//               <span className="text-base shrink-0">⚠️</span>
//               <span>{apiError}</span>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">

//             {/* Email */}
//             <div>
//               <label className="block text-[11px] font-black uppercase tracking-widest mb-2 text-white/35">Email Address</label>
//               <div className="relative">
//                 <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
//                 <input type="email" name="email" placeholder="you@example.com"
//                   value={data.email} onChange={handleChange}
//                   className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all duration-200 placeholder-white/20"
//                   style={{
//                     background: "rgba(255,255,255,0.05)",
//                     border: `1px solid ${errors.email ? "#f87171" : "rgba(255,255,255,0.09)"}`,
//                   }}
//                   onFocus={e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
//                   onBlur={e => { e.target.style.borderColor = errors.email ? "#f87171" : "rgba(255,255,255,0.09)"; e.target.style.boxShadow = "none"; }}
//                 />
//               </div>
//               {errors.email && <p className="text-red-400 text-xs mt-1.5 font-medium flex items-center gap-1"><span>⚠</span>{errors.email}</p>}
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-[11px] font-black uppercase tracking-widest mb-2 text-white/35">Password</label>
//               <div className="relative">
//                 <KeyRound size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
//                 <input type={showPw ? "text" : "password"} name="password" placeholder="••••••••"
//                   value={data.password} onChange={handleChange}
//                   className="w-full pl-11 pr-12 py-3.5 rounded-xl text-white text-sm outline-none transition-all duration-200 placeholder-white/20"
//                   style={{
//                     background: "rgba(255,255,255,0.05)",
//                     border: `1px solid ${errors.password ? "#f87171" : "rgba(255,255,255,0.09)"}`,
//                   }}
//                   onFocus={e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
//                   onBlur={e => { e.target.style.borderColor = errors.password ? "#f87171" : "rgba(255,255,255,0.09)"; e.target.style.boxShadow = "none"; }}
//                 />
//                 <button type="button" onClick={() => setShowPw(v => !v)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
//                   {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
//                 </button>
//               </div>
//               {errors.password && <p className="text-red-400 text-xs mt-1.5 font-medium flex items-center gap-1"><span>⚠</span>{errors.password}</p>}
//             </div>

//             {/* Role pills */}
//             <div>
//               <label className="block text-[11px] font-black uppercase tracking-widest mb-3 text-white/35">Sign in as</label>
//               <div className="grid grid-cols-5 gap-2">
//                 {ROLES.map(r => {
//                   const sel = data.role === r.value;
//                   return (
//                     <button key={r.value} type="button"
//                       onClick={() => { setData(p => ({ ...p, role: r.value })); setErrors(p => ({ ...p, role: "" })); setApiError(""); }}
//                       className="flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all duration-200 hover:scale-[1.04] active:scale-95"
//                       style={{
//                         background: sel ? `linear-gradient(135deg,${r.from}25,${r.to}15)` : "rgba(255,255,255,0.03)",
//                         borderColor: sel ? r.from + "70" : "rgba(255,255,255,0.07)",
//                         boxShadow: sel ? `0 0 20px ${r.from}30, inset 0 1px 0 rgba(255,255,255,0.08)` : "none",
//                       }}>
//                       <span className="text-lg leading-none">{r.icon}</span>
//                       <span className="text-[10px] font-black tracking-wide" style={{ color: sel ? r.from : "rgba(255,255,255,0.3)" }}>
//                         {r.label}
//                       </span>
//                       {sel && <span className="w-1 h-1 rounded-full" style={{ background: r.from }} />}
//                     </button>
//                   );
//                 })}
//               </div>
//               {errors.role && <p className="text-red-400 text-xs mt-1.5 font-medium flex items-center gap-1"><span>⚠</span>{errors.role}</p>}
//             </div>

//             {/* Submit */}
//             <div className="relative mt-2">
//               {/* shimmer layer */}
//               <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
//                 <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite]"
//                   style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)", animationDelay: "1s" }} />
//               </div>
//               <button type="submit" disabled={submitting}
//                 className="group relative w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-white text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_#6366f155] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
//                 style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)" }}>
//                 {submitting ? (
//                   <>
//                     <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//                     </svg>
//                     Signing in…
//                   </>
//                 ) : (
//                   <>
//                     Sign In to PaySphere
//                     <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>

//           {/* Divider */}
//           <div className="flex items-center gap-3 my-6">
//             <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
//             <span className="text-[11px] text-white/20 font-bold uppercase tracking-widest">secured by</span>
//             <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
//           </div>

//           {/* Trust row */}
//           <div className="flex items-center justify-center gap-4">
//             {["PCI DSS L1", "256-bit SSL", "RBI Compliant"].map(b => (
//               <div key={b} className="flex items-center gap-1.5">
//                 <Shield size={10} className="text-emerald-400/50" />
//                 <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{b}</span>
//               </div>
//             ))}
//           </div>

//           <p className="text-center mt-8 text-xs text-white/15">
//             <Link to="/" className="hover:text-white/40 transition-colors">← Back to PaySphere</Link>
//           </p>
//         </div>
//       </div>

//       <style>{`
//         @keyframes shimmer { to { transform: translateX(200%); } }
//       `}</style>
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authservices/authService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  Eye, EyeOff, ArrowRight, Shield, Zap, 
  Mail, KeyRound, TrendingUp, Users, Activity,
} from "lucide-react";

function normalizeRole(roleRaw) {
  const r = String(roleRaw || "").trim().toLowerCase().replaceAll("_", "-");
  if (r === "opsadmin") return "ops-admin";
  return r;
}

const ROLE_TO_PATH = {
  user: "/dashboard/user", 
  merchant: "/dashboard/merchant",
  admin: "/dashboard/admin", 
  risk: "/dashboard/risk",
  ops: "/dashboard/ops", 
  "ops-admin": "/dashboard/ops-admin",
};

const ROLES = [
  { value: "User",     label: "User",     icon: "👤", from: "#6366f1", to: "#8b5cf6" },
  { value: "Merchant", label: "Merchant", icon: "🏪", from: "#06b6d4", to: "#0ea5e9" },
  { value: "Admin",    label: "Admin",    icon: "🛡️", from: "#f59e0b", to: "#ef4444" },
  { value: "Risk",     label: "Risk",     icon: "⚠️", from: "#f97316", to: "#ef4444" },
  { value: "Ops",      label: "Ops",      icon: "⚙️", from: "#10b981", to: "#06b6d4" },
];

const STATS = [
  { icon: Users,    value: "2M+",   label: "Active Users"    },
  { icon: Activity, value: "99.9%", label: "Uptime"          },
  { icon: Zap,      value: "<2s",   label: "Transfer Speed"  },
  { icon: Shield,   value: "PCI L1",label: "Security Grade"  },
];

const FEED = [
  { emoji: "💸", text: "Rahul sent ₹2,500",      time: "2s ago",  color: "#10b981" },
  { emoji: "🛒", text: "Priya paid at Swiggy",   time: "14s ago", color: "#f97316" },
  { emoji: "💼", text: "Salary credited ₹45,000", time: "1m ago",  color: "#6366f1" },
  { emoji: "✈️", text: "Arjun booked a flight",  time: "3m ago",  color: "#06b6d4" },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [data, setData] = useState({ email: "", password: "", role: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const e = {};
    if (!data.email) e.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(data.email)) e.email = "Invalid email address.";
    if (!data.password) e.password = "Password is required.";
    else if (data.password.length < 6) e.password = "Minimum 6 characters.";
    if (!data.role) e.role = "Please select a role.";
    return e;
  };

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setData(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: "" }));
    setApiError("");
  };

  const handleForgotPassword = async () => {
  if (!data.email) {
    toast.error("Please enter your email to continue.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5245/api/AuthMail/send-reset-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email }),
    });

    const json = await res.json();

    if (res.ok) {
      toast.success(json.message || "Reset link sent to your email.");
    } else {
      toast.error(json.message || "Something went wrong.");
    }
  } catch (error) {
    toast.error("Server error. Please try again later.");
  }
};

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    try {
      setSubmitting(true);
      setApiError("");

      // ⭐ IMPORTANT: Normalize role BEFORE sending to backend
      // Convert "User" → "user", "Admin" → "admin", etc.
      const normalizedRole = normalizeRole(data.role);

      // 1. Call API (Backend handles Token in HttpOnly Cookie)
      const res = await loginUser({ 
        email: data.email, 
        password: data.password, 
        role: normalizedRole
      });

      // 2. Extract identifiers
      const rawRole = res?.data?.role || data.role;
      const backendRole = normalizeRole(rawRole);
      const selectedRole = normalizeRole(data.role);
      
      // 4. Store access token in memory + decode JWT
      const accessToken = res.data.token || res.data.accessToken;
      let jwtData = {};
      let jwtName = null;
      let jwtEmail = null;
      let jwtUserId = null;
      
      if (accessToken) {
        const { setAuthToken } = await import('../../services/http');
        setAuthToken(accessToken);
        try {
          const { jwtDecode } = await import('jwt-decode');
          jwtData = jwtDecode(accessToken);
          
          // Extract userId from JWT (try multiple possible field names)
          jwtUserId = jwtData.uid || jwtData.sub || jwtData.userId || jwtData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || null;
          
          // .NET JWT common claim keys for name
          jwtName = jwtData.name
            || jwtData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
            || jwtData.given_name
            || null;
            
          // Extract email from JWT
          jwtEmail = jwtData.email || null;
        } catch (e) {
          console.warn("JWT decode error:", e);
        }

        
      }
      
      // Extract userId from response (try multiple field names), fallback to JWT
      const userId = res.data.userID || res.data.userId || res.data.merchantID || res.data.id || jwtUserId;
      
      // Log for debugging
      console.log("Login Response Data:", { 
        responseFields: Object.keys(res.data),
        userId, 
        jwtData: jwtData ? Object.keys(jwtData) : 'none' 
      });

      // 3. Role Validation Security Check
      if (backendRole !== selectedRole) {
        setApiError(`Role mismatch! You cannot login as ${data.role}.`);
        return;
      }

      // 5. Global State Update (Updates Redux + LocalStorage)
     // 5. Global State Update (Updates Redux + LocalStorage)
      login({
        accessToken: accessToken,  // 🔥 REQUIRED
        role: backendRole,         // 🔥 Do NOT lowercase here (AuthContext will)
        userId: res.data.userId || null,  // 🔥 Backend returns this
        merchantId: res.data.merchantId || null,
        name: res.data.name || "",
        email: res.data.email || data.email,
      });

     // Inside your login handleSubmit
      toast.success(`Welcome back, ${res.data.name || 'User'}!`, {
      id: 'login-success-toast', // ⭐ This ID prevents duplicates
      duration: 4000,
      icon: '🚀',
      style: {
        background: '#0f172a',
        color: '#fff',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        padding: '16px',
        borderRadius: '12px',
      },
    });

      // 6. Navigate
      const path = ROLE_TO_PATH[backendRole] || "/dashboard/user";
      navigate(path, { replace: true });

    // } catch (err) {
    //   setApiError(err?.response?.data?.message || "Invalid credentials. Please try again.");
    // } finally {
    //   setSubmitting(false);
    // }
    } catch (err) {
      // A more professional, secure message that doesn't reveal if the email or password specifically was wrong
      const professionalMsg = "The email or password you entered is incorrect. Please try again.";
      
      setApiError(err?.response?.data?.message || professionalMsg);
      
      // Optional: Also show a toast for better visibility
      toast.error(professionalMsg, {
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#050816] text-white overflow-hidden">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.15]"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)", filter: "blur(90px)" }} />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.12]"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent)", filter: "blur(90px)" }} />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] relative px-14 py-12 overflow-hidden border-r border-white/[0.06]">
        <div className="absolute inset-0" style={{ background: "linear-gradient(145deg,rgba(99,102,241,0.09) 0%,rgba(6,182,212,0.04) 100%)" }} />
        
        <Link to="/" className="relative flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg"
            style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", boxShadow: "0 0 24px #6366f166" }}>P</div>
          <span className="text-xl font-black tracking-tight">Pay<span style={{ color: "#06b6d4" }}>Sphere</span></span>
        </Link>

        <div className="relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 mb-5 text-[11px] font-bold uppercase tracking-widest"
              style={{ background: "rgba(99,102,241,0.1)", color: "#a5b4fc" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Secure Login Portal
            </div>
            <h2 className="text-[2.6rem] font-black leading-[1.1] mb-4">
              Welcome back<br />
              <span style={{ background: "linear-gradient(135deg,#a5b4fc,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                to your finances.
              </span>
            </h2>
            <p className="text-white/35 text-[15px] leading-relaxed">
              Access your wallet, transactions, and payment tools — secured with enterprise-grade encryption.
            </p>
          </div>

          {/* Card Mockup */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl pointer-events-none" style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)" }} />
            <div className="relative rounded-2xl p-5 border border-white/10 overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.18),rgba(6,182,212,0.1))", backdropFilter: "blur(12px)" }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-white/30 text-[9px] uppercase tracking-[0.25em] font-bold">PaySphere Wallet</p>
                  <p className="text-white font-black text-2xl mt-0.5">₹1,24,580</p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white" style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)" }}>P</div>
              </div>
              <div className="flex items-center gap-1.5 mb-4">
                <TrendingUp size={12} className="text-emerald-400" />
                <span className="text-emerald-400 text-xs font-bold">+12.4% this month</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[{ l: "Sent", v: "₹8,200", c: "#f43f5e" }, { l: "Received", v: "₹14,500", c: "#10b981" }].map(s => (
                  <div key={s.l} className="rounded-xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold">{s.l}</p>
                    <p className="font-black text-sm mt-0.5" style={{ color: s.c }}>{s.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/25 mb-3">Live Activity</p>
            {FEED.map((f, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.025)" }}>
                <span className="text-base shrink-0">{f.emoji}</span>
                <span className="text-white/50 text-xs flex-1">{f.text}</span>
                <span className="text-[10px] font-bold shrink-0" style={{ color: f.color + "99" }}>{f.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Ticker */}
        <div className="relative z-10 grid grid-cols-4 gap-2">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 py-3 rounded-xl border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.025)" }}>
              <Icon size={13} className="text-white/25" />
              <p className="font-black text-sm text-white">{value}</p>
              <p className="text-[9px] text-white/25 font-bold uppercase tracking-wider text-center leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL (Form) */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        <Link to="/" className="flex items-center gap-3 mb-10 lg:hidden">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white" style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)" }}>P</div>
          <span className="text-xl font-black">Pay<span style={{ color: "#06b6d4" }}>Sphere</span></span>
        </Link>

        <div className="w-full max-w-[420px]">
          <div className="mb-8">
            <h1 className="text-[2rem] font-black mb-1.5 tracking-tight">Sign In</h1>
            <p className="text-white/35 text-sm">
              No account? <Link to="/register" className="font-bold transition-colors hover:text-white" style={{ color: "#06b6d4" }}>Create one free →</Link>
            </p>
          </div>

          {apiError && (
            <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl border border-red-500/25 text-red-400 text-sm" style={{ background: "rgba(239,68,68,0.07)" }}>
              <span className="text-base shrink-0">⚠️</span>
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest mb-2 text-white/35">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                <input type="email" name="email" placeholder="you@example.com" value={data.email} onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all duration-200 placeholder-white/20"
                  style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${errors.email ? "#f87171" : "rgba(255,255,255,0.09)"}` }}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5 font-medium">⚠ {errors.email}</p>}
            </div>
            {/* Forgot Password Link */}
            <div className="flex justify-end mt-1">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[11px] font-medium text-white/40 hover:text-white/70 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            {/* Password */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest mb-2 text-white/35">Password</label>
              <div className="relative">
                <KeyRound size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                <input type={showPw ? "text" : "password"} name="password" placeholder="••••••••" value={data.password} onChange={handleChange}
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl text-white text-sm outline-none transition-all duration-200 placeholder-white/20"
                  style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${errors.password ? "#f87171" : "rgba(255,255,255,0.09)"}` }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5 font-medium">⚠ {errors.password}</p>}
            </div>

            {/* Roles */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest mb-3 text-white/35">Sign in as</label>
              <div className="grid grid-cols-5 gap-2">
                {ROLES.map(r => {
                  const sel = data.role === r.value;
                  return (
                    <button key={r.value} type="button" onClick={() => setData(p => ({ ...p, role: r.value }))}
                      className="flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all duration-200 hover:scale-[1.04]"
                      style={{
                        background: sel ? `linear-gradient(135deg,${r.from}25,${r.to}15)` : "rgba(255,255,255,0.03)",
                        borderColor: sel ? r.from + "70" : "rgba(255,255,255,0.07)",
                      }}>
                      <span className="text-lg">{r.icon}</span>
                      <span className="text-[10px] font-black" style={{ color: sel ? r.from : "rgba(255,255,255,0.3)" }}>{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" disabled={submitting}
              className="group relative w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-white text-sm tracking-wide transition-all duration-300 hover:shadow-[0_0_35px_#6366f155]"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)" }}>
              {submitting ? "Signing in..." : <>Sign In to PaySphere <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[11px] text-white/20 font-bold uppercase">secured by</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="flex items-center justify-center gap-4">
            {["PCI DSS L1", "256-bit SSL"].map(b => (
              <div key={b} className="flex items-center gap-1.5">
                <Shield size={10} className="text-emerald-400/50" />
                <span className="text-[10px] font-bold uppercase text-white/20">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}