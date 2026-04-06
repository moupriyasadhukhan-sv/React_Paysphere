import { useNavigate } from "react-router-dom";
import { Shield, Zap, Globe, CreditCard, ArrowRight, CheckCircle, TrendingUp, BarChart3, Bell, ChevronRight } from "lucide-react";

// function go(navigate, path) {
//   const token = localStorage.getItem("ps_token");
//   const role  = (localStorage.getItem("ps_role") || "").toLowerCase();
//   if (token && role) {
//     const map = { admin: "/dashboard/admin", user: "/dashboard/user", merchant: "/dashboard/merchant", ops: "/dashboard/ops", risk: "/dashboard/risk" };
//     navigate(map[role] || "/dashboard/user");
//   } else {
//     navigate(path);
//   }
// }




const FEATURES = [
  { icon: Zap,        title: "Instant Transfers",   desc: "Send money in under 2 seconds.",          from: "#f59e0b", to: "#ef4444" },
  { icon: Shield,     title: "Bank-Grade Security", desc: "PCI DSS L1 · 256-bit SSL.",               from: "#6366f1", to: "#8b5cf6" },
  { icon: Globe,      title: "Multi-Currency",      desc: "50+ currencies, real-time FX.",           from: "#10b981", to: "#06b6d4" },
  { icon: CreditCard, title: "Smart Cards",         desc: "Virtual & physical, full controls.",      from: "#ec4899", to: "#f43f5e" },
  { icon: BarChart3,  title: "Live Analytics",      desc: "Insights the moment they happen.",        from: "#3b82f6", to: "#6366f1" },
  { icon: Bell,       title: "Instant Alerts",      desc: "Push & SMS on every transaction.",        from: "#f97316", to: "#eab308" },
];

const STATS = [
  { value: "2M+",   label: "Users"          },
  { value: "₹50B",  label: "Daily Volume"   },
  { value: "99.9%", label: "Uptime"         },
  { value: "<2s",   label: "Transfer Speed" },
];

export default function Landing() {
const navigate = useNavigate();

const roleRoutes = {
  admin: "/dashboard/admin",
  user: "/dashboard/user",
  merchant: "/dashboard/merchant",
  ops: "/dashboard/ops",
  risk: "/dashboard/risk",
};

const redirectToDashboard = () => {
  const role = localStorage.getItem("ps_role");
  if (role && roleRoutes[role]) {
    navigate(roleRoutes[role]);
  }
};

const isLoggedIn = () => localStorage.getItem("ps_loggedIn") === "true";

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-x-hidden">

      {/* Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.18]"
          style={{ background: "radial-gradient(circle,#6366f1,transparent)", filter: "blur(90px)" }} />
        <div className="absolute top-[40%] -right-40 w-[500px] h-[500px] rounded-full opacity-[0.13]"
          style={{ background: "radial-gradient(circle,#06b6d4,transparent)", filter: "blur(90px)" }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* ── NAVBAR ── */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-16 py-4 border-b border-white/[0.06]"
        style={{ background: "rgba(5,8,22,0.85)", backdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white"
            style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", boxShadow: "0 0 18px #6366f155" }}>P</div>
          <span className="text-lg font-black tracking-tight">Pay<span style={{ color: "#06b6d4" }}>Sphere</span></span>
        </div>
        <div className="flex items-center gap-3">

          <button onClick={() => {
            if (isLoggedIn()) redirectToDashboard();
            else navigate("/login");
          }}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white/60 hover:text-white border border-white/10 hover:border-white/25 transition-all duration-200">
            Sign In
          </button>
          <button onClick={() => {
              if (isLoggedIn()) redirectToDashboard();
              else navigate("/login");
            }}

            className="px-5 py-2 rounded-lg text-sm font-bold text-white hover:scale-105 hover:shadow-[0_0_20px_#6366f155] transition-all duration-200"
            style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)" }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-16">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 mb-7 text-xs font-bold uppercase tracking-widest"
          style={{ background: "rgba(99,102,241,0.1)", color: "#a5b4fc" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Trusted by 2 Million+ Users Across India
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-[4.5rem] font-black leading-[1.07] tracking-tight max-w-3xl">
          The Smarter Way
          <span className="block mt-2" style={{
            background: "linear-gradient(135deg,#6366f1 0%,#06b6d4 55%,#10b981 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>to Move Money.</span>
        </h1>

        <p className="mt-5 text-base md:text-lg text-white/45 max-w-xl leading-relaxed">
          Instant transfers, smart wallets, merchant tools, and enterprise-grade security — all in one place.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-9">
          <button 
            onClick={() => {
              if (isLoggedIn()) redirectToDashboard();
              else navigate("/register");
            }}
            className="group flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white text-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_#6366f155]"
            style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)" }}>
            Start for Free
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          <button onClick={() => {
              if (isLoggedIn()) redirectToDashboard();
              else navigate("/login")
}}
            className="flex items-center gap-1.5 px-7 py-3.5 rounded-xl font-bold text-white/50 hover:text-white text-sm border border-white/10 hover:border-white/25 transition-all duration-200">
            Sign In <ChevronRight size={14} />
          </button>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap items-center justify-center gap-5 mt-8 text-[11px] font-bold uppercase tracking-widest text-white/25">
          {["PCI DSS Level 1", "RBI Compliant", "ISO 27001", "256-bit SSL"].map(b => (
            <div key={b} className="flex items-center gap-1.5">
              <CheckCircle size={11} className="text-emerald-400/60" />{b}
            </div>
          ))}
        </div>

        {/* Dashboard mockup */}
        <div className="relative mt-14 w-full max-w-2xl mx-auto">
          <div className="absolute inset-0 rounded-3xl opacity-25 blur-3xl pointer-events-none"
            style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)" }} />
          <div className="relative rounded-2xl border border-white/10 overflow-hidden"
            style={{ background: "linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))", backdropFilter: "blur(20px)" }}>
            {/* Browser bar */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.06]">
              {["#ef4444","#f59e0b","#10b981"].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
              <div className="flex-1 mx-3 h-4 rounded-md" style={{ background: "rgba(255,255,255,0.05)" }} />
            </div>
            {/* Content */}
            <div className="p-5 grid grid-cols-3 gap-3">
              <div className="col-span-2 rounded-xl p-4"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 16px 32px -8px #6366f155" }}>
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Total Balance</p>
                <p className="text-white font-black text-2xl mt-0.5">₹1,24,580</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp size={11} className="text-emerald-300" />
                  <span className="text-emerald-300 text-[11px] font-bold">+12.4% this month</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {[{ l: "Sent", v: "₹8,200", c: "#f43f5e" }, { l: "Received", v: "₹14,500", c: "#10b981" }].map(s => (
                  <div key={s.l} className="flex-1 rounded-xl p-3 flex flex-col justify-center"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest">{s.l}</p>
                    <p className="font-black text-sm mt-0.5" style={{ color: s.c }}>{s.v}</p>
                  </div>
                ))}
              </div>
              {[{ name: "Swiggy", amt: "-₹340", icon: "🍔", c: "#f97316" }, { name: "Salary", amt: "+₹45,000", icon: "💼", c: "#10b981" }, { name: "Netflix", amt: "-₹649", icon: "🎬", c: "#ef4444" }].map(t => (
                <div key={t.name} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
                    style={{ background: "rgba(255,255,255,0.06)" }}>{t.icon}</div>
                  <p className="text-white text-xs font-bold flex-1 truncate">{t.name}</p>
                  <p className="text-xs font-black shrink-0" style={{ color: t.c }}>{t.amt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative z-10 px-6 md:px-16 py-10">
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(s => (
            <div key={s.label} className="text-center rounded-2xl py-6 px-3 border border-white/[0.06]"
              style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="font-black text-3xl" style={{
                background: "linear-gradient(135deg,#6366f1,#06b6d4)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>{s.value}</p>
              <p className="text-white/35 text-xs font-bold mt-1.5 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-10 px-6 md:px-16 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#6366f1" }}>Why PaySphere</p>
          <h2 className="text-center text-3xl md:text-4xl font-black mb-10">
            Everything you need,{" "}
            <span style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              nothing you don't.
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc, from, to }) => (
              <div key={title}
                className="group relative rounded-2xl p-5 border border-white/[0.06] hover:border-white/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 30% 30%,${from}14,transparent 65%)` }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `linear-gradient(135deg,${from}22,${to}14)`, border: `1px solid ${from}30` }}>
                  <Icon size={18} style={{ color: from }} />
                </div>
                <h3 className="font-black text-white text-sm mb-1">{title}</h3>
                <p className="text-white/35 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative z-10 px-6 md:px-16 py-16">
        <div className="max-w-3xl mx-auto relative">
          <div className="absolute inset-0 rounded-3xl opacity-20 blur-3xl pointer-events-none"
            style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)" }} />
          <div className="relative rounded-2xl border border-white/10 px-8 py-12 text-center overflow-hidden"
            style={{ background: "linear-gradient(145deg,rgba(99,102,241,0.1),rgba(6,182,212,0.06))" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage: "radial-gradient(circle at 20% 30%,rgba(99,102,241,0.18) 0%,transparent 55%),radial-gradient(circle at 80% 70%,rgba(6,182,212,0.12) 0%,transparent 55%)" }} />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-black mb-3">
                Ready to get started?
              </h2>
              <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">
                Create your free account in 60 seconds. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button onClick={() => go(navigate, "/register")}
                  className="group flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white text-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_#6366f166]"
                  style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)" }}>
                  Create Free Account
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                <button onClick={() => go(navigate, "/login")}
                  className="px-8 py-3.5 rounded-xl font-bold text-white/45 hover:text-white text-sm border border-white/10 hover:border-white/25 transition-all duration-200">
                  Sign In Instead
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 md:px-16 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-white text-xs"
              style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)" }}>P</div>
            <span className="font-black text-white/60 text-sm">Pay<span style={{ color: "#06b6d4" }}>Sphere</span></span>
          </div>
          <p className="text-white/20 text-xs">© {new Date().getFullYear()} PaySphere. All rights reserved.</p>
          <div className="flex items-center gap-5 text-xs font-semibold text-white/25">
            {["Privacy", "Terms", "Security"].map(l => (
              <a key={l} href="#" className="hover:text-white/50 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
