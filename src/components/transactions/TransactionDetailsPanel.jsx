// src/components/transactions/TransactionDetailsPanel.jsx
import { useEffect, useState } from "react";
import { getTransactionById } from "../../services/transactions/transactionsApi";
import { X, Loader2, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";

const getStatusIcon = (status) => {
  if (!status) return <Clock size={16} className="text-slate-400" />;
  const statusStr = String(status).toLowerCase();
  if (statusStr.includes("completed")) return <CheckCircle size={16} className="text-emerald-400" />;
  if (statusStr.includes("pending")) return <Clock size={16} className="text-yellow-400" />;
  if (statusStr.includes("failed")) return <XCircle size={16} className="text-red-400" />;
  return <AlertCircle size={16} className="text-slate-400" />;
};

export default function TransactionDetailsPanel({ id, onClose }) {
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      if (!id) return;
      setBusy(true);
      setErr("");
      setData(null);
      try {
        const res = await getTransactionById(id);
        setData(res);
      } catch (e) {
        const msg =
          e?.response?.data?.detail ||
          e?.message ||
          "Failed to load transaction";
        setErr(msg);
        console.error("[TxnDetails] Error:", e?.response?.data || e);
      } finally {
        setBusy(false);
      }
    }
    load();
  }, [id]);

  return (
    <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-600/50 rounded-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-600/30 bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
            <span className="text-teal-400 font-semibold">#{id}</span>
          </div>
          <div>
            <h3 className="font-bold text-white">Transaction Details</h3>
            <p className="text-xs text-slate-400">ID: {id}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
          aria-label="Close details"
          title="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {busy && (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="text-teal-400 animate-spin" />
          </div>
        )}

        {err && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertCircle size={16} className="text-red-400" />
            <p className="text-red-400 text-sm">{err}</p>
          </div>
        )}

        {data && (
          <div className="space-y-4">
            {/* Status & Type Row */}
            <div className="grid grid-cols-2 gap-4">
              <KVPair
                label="Status"
                value={data.Status ?? data.status}
                icon={getStatusIcon(data.Status ?? data.status)}
                color="emerald"
              />
              <KVPair
                label="Type"
                value={data.TransactionType ?? data.transactionType}
                color="blue"
              />
            </div>

            {/* Amount & Currency Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-600/30">
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Amount</p>
                <p className="text-lg font-bold text-emerald-300">
                  {data.Amount ?? data.amount}
                </p>
              </div>
              <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-600/30">
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Currency</p>
                <p className="text-lg font-bold text-amber-300">
                  {data.Currency ?? data.currency}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-slate-600/0 via-slate-600/50 to-slate-600/0"></div>

            {/* Wallet IDs */}
            <div className="grid grid-cols-2 gap-4">
              <KVPair
                label="From Wallet"
                value={data.FromWalletID ?? data.fromWalletID ?? data.fromWalletId ?? "-"}
                mono
                color="purple"
              />
              <KVPair
                label="To Wallet"
                value={data.ToWalletID ?? data.toWalletID ?? data.toWalletId ?? "-"}
                mono
                color="rose"
              />
            </div>

            {/* Date */}
            <KVPair
              label="Date & Time"
              value={
                data.TransactionDate ?? data.transactionDate
                  ? new Date(
                      data.TransactionDate ?? data.transactionDate
                    ).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })
                  : "-"
              }
              color="blue"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function KVPair({ label, value, mono = false, icon, color = "slate" }) {
  const colorMap = {
    slate: "bg-slate-900/40 border-slate-600/30",
    emerald: "bg-emerald-900/20 border-emerald-600/30",
    blue: "bg-blue-900/20 border-blue-600/30",
    purple: "bg-purple-900/20 border-purple-600/30",
    amber: "bg-amber-900/20 border-amber-600/30",
    rose: "bg-rose-900/20 border-rose-600/30",
  };

  const textColorMap = {
    slate: "text-slate-100",
    emerald: "text-emerald-200",
    blue: "text-blue-200",
    purple: "text-purple-200",
    amber: "text-amber-200",
    rose: "text-rose-200",
  };

  return (
    <div className={`rounded-lg p-3 border ${colorMap[color]}`}>
      <div className="flex items-center gap-2 mb-1">
        {icon && icon}
        <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
      </div>
      <p
        className={`text-sm font-semibold ${textColorMap[color]} ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}