// src/pages/Dashboards/merchant/MerchantWalletPage.jsx
// Merchant wallet view – fetches from /api/wallets endpoint using auth context
import React, { useEffect, useState, useCallback } from "react";
import api from "../../../utils/api";

const fmt = (n) =>
  typeof n === "number" ? `₹${n.toLocaleString("en-IN")}` : "—";

function StatusPill({ status }) {
  const s = (status || "").toLowerCase();
  const cfg =
    s === "active"
      ? { bg: "rgba(20,184,166,0.15)", text: "#14b8a6", border: "rgba(20,184,166,0.3)" }
      : s === "frozen"
      ? { bg: "rgba(99,102,241,0.15)", text: "#818cf8", border: "rgba(99,102,241,0.3)" }
      : { bg: "rgba(239,68,68,0.12)", text: "#f87171", border: "rgba(239,68,68,0.25)" };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
      style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.text }} />
      {status ?? "Unknown"}
    </span>
  );
}

export default function MerchantWalletPage({ merchantId = 1 }) {
  const [wallet, setWallet]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Try merchant-specific wallet endpoint; fallback to /api/wallets/primary
      const res = await api.get(`/wallets/merchant/${merchantId}`).catch(() =>
        api.get(`/wallets/primary`)
      );
      const d = res?.data?.data ?? res?.data ?? null;
      setWallet(d);
    } catch (e) {
      setError("Could not load wallet information.");
    } finally {
      setLoading(false);
    }
  }, [merchantId]);

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white">Wallet</h1>
          <p className="text-sm text-slate-400 mt-0.5">Your merchant wallet balance and details</p>
        </div>
        <button
          onClick={fetch}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-teal-400 hover:border-teal-500/30 text-sm font-medium transition-all"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="rounded-2xl border border-white/10 p-10 animate-pulse text-center text-slate-500" style={{ background: "rgba(255,255,255,0.02)" }}>
          Loading wallet…
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/20 px-4 py-3 text-sm text-red-400" style={{ background: "rgba(239,68,68,0.08)" }}>
          {error}
        </div>
      )}

      {!loading && wallet && (
        <div className="space-y-5">
          {/* Main card */}
          <div
            className="rounded-2xl p-8 border relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg,rgba(20,184,166,0.18) 0%,rgba(6,78,59,0.08) 50%,rgba(8,13,26,0.6) 100%)",
              borderColor: "rgba(20,184,166,0.25)",
              boxShadow: "0 16px 48px -12px rgba(20,184,166,0.2)",
            }}
          >
            {/* Decorative circle */}
            <div
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #14b8a6, transparent)" }}
            />
            <p className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-3">Available Balance</p>
            <p className="text-5xl font-black text-white">{fmt(wallet.balance)}</p>
            <p className="text-sm text-slate-400 mt-2">{wallet.currency ?? "INR"}</p>

            <div className="mt-6 flex flex-wrap gap-6">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Wallet ID</p>
                <p className="text-sm font-mono text-slate-300 mt-0.5">{wallet.walletId ?? wallet.id ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Status</p>
                <div className="mt-1"><StatusPill status={wallet.status} /></div>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InfoCard label="Currency" value={wallet.currency ?? "INR"} />
            <InfoCard label="Wallet Status" value={wallet.status ?? "Active"} />
            <InfoCard label="User ID" value={wallet.userId ?? "—"} />
          </div>
        </div>
      )}

      {!loading && !wallet && !error && (
        <div className="rounded-2xl border border-white/10 p-16 text-center text-slate-500" style={{ background: "rgba(255,255,255,0.02)" }}>
          <p className="text-lg font-semibold mb-1">No wallet found</p>
          <p className="text-sm">Please contact your administrator to set up a merchant wallet.</p>
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 p-5" style={{ background: "rgba(255,255,255,0.03)" }}>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">{label}</p>
      <p className="text-base font-bold text-white">{value}</p>
    </div>
  );
}
