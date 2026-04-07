// src/pages/Dashboards/merchant/MerchantSettlementsPage.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { showMerchantSuccess, showMerchantError, showMerchantLoading, dismissMerchantToast } from "../../../utils/merchantToast";
import {
  getMerchantSettlements,
  updateSettlementStatus,
  deleteSettlement,
} from "../../../services/merchantAnalyticsApi";

/* ────────────── HELPERS ────────────── */
const fmt = (n) =>
  typeof n === "number" ? `₹${n.toLocaleString("en-IN")}` : n ?? "—";

const fmtDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
};

/* ────────────── STATUS BADGE ────────────── */
function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  const cfg =
    s === "settled"
      ? { bg: "rgba(20,184,166,0.15)", text: "#14b8a6", border: "rgba(20,184,166,0.3)" }
      : s === "pending"
      ? { bg: "rgba(245,158,11,0.15)", text: "#f59e0b", border: "rgba(245,158,11,0.3)" }
      : { bg: "rgba(255,255,255,0.06)", text: "#94a3b8", border: "rgba(255,255,255,0.1)" };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
      style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: cfg.text, boxShadow: `0 0 6px ${cfg.text}` }}
      />
      {status || "—"}
    </span>
  );
}

/* ────────────── CONFIRM MODAL ────────────── */
function ConfirmModal({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div
        className="rounded-2xl border border-white/10 p-6 w-full max-w-sm"
        style={{ background: "#0d1424", boxShadow: "0 32px 64px -12px rgba(0,0,0,0.8)" }}
      >
        <h3 className="text-base font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-xl font-semibold text-white transition-all"
            style={{ background: loading ? "rgba(239,68,68,0.5)" : "#ef4444", boxShadow: "0 4px 16px rgba(239,68,68,0.3)" }}
          >
            {loading ? "Processing…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ────────────── SKELETON ROW ────────────── */
function SkeletonRow() {
  return (
    <tr>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.06)", width: i === 1 ? 80 : i === 3 ? 70 : 100 }} />
        </td>
      ))}
    </tr>
  );
}

/* ────────────── MAIN COMPONENT ────────────── */
export default function MerchantSettlementsPage({ merchantId = 1 }) {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const isInitialMount = useRef(true);

  // Filter / sort
  const [filter, setFilter]   = useState("All");
  const [sortBy, setSortBy]   = useState("date_desc");
  const [page, setPage]       = useState(1);
  const PER_PAGE = 8;

  // Confirm dialog
  const [confirmOpen, setConfirmOpen]   = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmConfig, setConfirmConfig]  = useState({});

  const fetch = useCallback(async () => {
    setLoading(true);
    setError("");
    
    const shouldShowToast = !isInitialMount.current;
    let loadingToastId = null;
    
    if (shouldShowToast) {
      loadingToastId = showMerchantLoading("Loading settlements...");
    }
    
    try {
      const data = await getMerchantSettlements(merchantId);
      setSettlements(data);
      
      if (shouldShowToast) {
        dismissMerchantToast(loadingToastId);
        showMerchantSuccess("Settlements loaded ✓", 2500);
      }
    } catch (e) {
      setError("Failed to load settlements. Please try again.");
      if (shouldShowToast) {
        dismissMerchantToast(loadingToastId);
        showMerchantError("Failed to load settlements", 3000);
      }
    } finally {
      setLoading(false);
      isInitialMount.current = false;
    }
  }, [merchantId]);

  useEffect(() => { fetch(); }, [fetch]);

  /* ── Derived list ── */
  const filtered = settlements
    .filter((s) => filter === "All" || s.status === filter)
    .sort((a, b) => {
      if (sortBy === "date_desc") return new Date(b.settledDate ?? 0) - new Date(a.settledDate ?? 0);
      if (sortBy === "date_asc")  return new Date(a.settledDate ?? 0) - new Date(b.settledDate ?? 0);
      if (sortBy === "amount_desc") return (b.amount ?? 0) - (a.amount ?? 0);
      if (sortBy === "amount_asc")  return (a.amount ?? 0) - (b.amount ?? 0);
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const current    = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  /* ── Summary numbers ── */
  const totalSettled  = settlements.filter((s) => s.status === "Settled").reduce((acc, s) => acc + (s.amount ?? 0), 0);
  const totalPending  = settlements.filter((s) => s.status === "Pending").reduce((acc, s) => acc + (s.amount ?? 0), 0);

  /* ── Actions ── */
  const openConfirm = (cfg) => { setConfirmConfig(cfg); setConfirmOpen(true); };

  const handleStatusChange = (s, newStatus) => {
    const sid = s.settlementId ?? s.id;
    openConfirm({
      title: "Update Settlement Status",
      message: `Change Settlement #${sid} status to "${newStatus}"?`,
      onConfirm: async () => {
        setConfirmLoading(true);
        try {
          await updateSettlementStatus(sid, newStatus);
          setSettlements((prev) => prev.map((x) => (x.settlementId ?? x.id) === sid ? { ...x, status: newStatus } : x));
          toast.success("Status updated successfully");
          setConfirmOpen(false);
        } catch {
          toast.error("Failed to update status");
        } finally {
          setConfirmLoading(false);
        }
      },
    });
  };

  const handleDelete = (s) => {
    const sid = s.settlementId ?? s.id;
    openConfirm({
      title: "Delete Settlement",
      message: `Permanently delete Settlement #${sid}? This cannot be undone.`,
      onConfirm: async () => {
        setConfirmLoading(true);
        try {
          await deleteSettlement(sid);
          setSettlements((prev) => prev.filter((x) => (x.settlementId ?? x.id) !== sid));
          toast.success("Settlement deleted");
          setConfirmOpen(false);
        } catch {
          toast.error("Failed to delete settlement");
        } finally {
          setConfirmLoading(false);
        }
      },
    });
  };

  /* ── Render ── */
  return (
    <div className="p-6 space-y-6">
      <ConfirmModal
        open={confirmOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        loading={confirmLoading}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => !confirmLoading && setConfirmOpen(false)}
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Settlements</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage your settlement cycles and history</p>
        </div>
        <button
          onClick={fetch}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-teal-400 hover:border-teal-500/30 text-sm font-medium transition-all"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor">
            <path d="M4 12a8 8 0 0 1 8-8v2a6 6 0 0 0-6 6H4zm16 0a8 8 0 0 1-8 8v-2a6 6 0 0 0 6-6h2z" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard label="Total Settlements" value={settlements.length} prefix="" />
        <SummaryCard label="Total Settled" value={fmt(totalSettled)} prefix="" color="text-teal-400" />
        <SummaryCard label="Pending Amount" value={fmt(totalPending)} prefix="" color="text-amber-400" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {["All", "Settled", "Pending"].map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(1); }}
            className="px-4 py-1.5 rounded-full text-xs font-semibold border transition-all"
            style={{
              background: filter === f ? "rgba(20,184,166,0.2)" : "rgba(255,255,255,0.04)",
              borderColor: filter === f ? "rgba(20,184,166,0.4)" : "rgba(255,255,255,0.08)",
              color: filter === f ? "#14b8a6" : "#94a3b8",
            }}
          >
            {f}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-500">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs rounded-lg px-3 py-1.5 border border-white/10 text-slate-300 outline-none focus:border-teal-500/40"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <option value="date_desc">Date (Newest)</option>
            <option value="date_asc">Date (Oldest)</option>
            <option value="amount_desc">Amount (High)</option>
            <option value="amount_asc">Amount (Low)</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/20 px-4 py-3 text-sm text-red-400" style={{ background: "rgba(239,68,68,0.08)" }}>
          {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)" }}>
                {["Settlement ID", "Period", "Amount", "Settled Date", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && [1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)}

              {!loading && current.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-slate-500">
                    <svg viewBox="0 0 24 24" width={40} height={40} fill="currentColor" className="mx-auto mb-3 text-slate-700">
                      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
                    </svg>
                    No settlements found
                  </td>
                </tr>
              )}

              {!loading && current.map((s) => {
                const sid = s.settlementId ?? s.id;
                return (
                  <tr
                    key={sid}
                    className="group transition-colors duration-150 hover:bg-white/[0.02]"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <td className="px-5 py-4 font-mono text-teal-400 text-xs font-semibold">
                      #{sid}
                    </td>
                    <td className="px-5 py-4 text-slate-300">{s.period ?? "—"}</td>
                    <td className="px-5 py-4 text-white font-bold">{fmt(s.amount)}</td>
                    <td className="px-5 py-4 text-slate-400">{fmtDate(s.settledDate)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={s.status} />
                    </td>
                    {/* <td className="px-5 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        
                        {s.status === "Pending" && (
                          <button
                            onClick={() => handleStatusChange(s, "Settled")}
                            className="px-3 py-1 text-xs rounded-lg font-semibold border border-teal-500/30 text-teal-400 hover:bg-teal-500/10 transition-all"
                          >
                            Mark Settled
                          </button>
                        )}
                        {s.status === "Settled" && (
                          <button
                            onClick={() => handleStatusChange(s, "Pending")}
                            className="px-3 py-1 text-xs rounded-lg font-semibold border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-all"
                          >
                            Revert
                          </button>
                        )}
                        {/*Delet
                        <button
                          onClick={() => handleDelete(s)}
                          className="px-3 py-1 text-xs rounded-lg font-semibold border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/06" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <span className="text-xs text-slate-500">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <PagBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} label="←" />
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => Math.abs(p - page) <= 2)
                .map((p) => (
                  <PagBtn key={p} onClick={() => setPage(p)} active={p === page} label={p} />
                ))}
              <PagBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} label="→" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, prefix = "₹", color = "text-white" }) {
  return (
    <div
      className="rounded-2xl border border-white/10 p-5"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{prefix}{value}</p>
    </div>
  );
}

function PagBtn({ onClick, disabled, active, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 rounded-lg text-xs font-bold transition-all"
      style={{
        background: active ? "rgba(20,184,166,0.25)" : "rgba(255,255,255,0.04)",
        color: active ? "#14b8a6" : disabled ? "rgba(148,163,184,0.3)" : "#94a3b8",
        border: active ? "1px solid rgba(20,184,166,0.4)" : "1px solid rgba(255,255,255,0.08)",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {label}
    </button>
  );
}
