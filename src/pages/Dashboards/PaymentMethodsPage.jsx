import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddInstrumentModal from "../../components/AddInstrumentModal";
import { toast } from "react-hot-toast";
import {
  fetchInstruments,
  deleteInstrument,
  setDefaultInstrument,
  updateInstrumentStatus,
} from "../../stores/paymentInstrumentsSlice";
import { Plus, Trash2, Star, CreditCard, Landmark, Smartphone, Wifi, ShieldCheck, Settings2, X, Eye, EyeOff, AlertTriangle, LockOpen } from "lucide-react";

function getCardholderName() {
  const name = localStorage.getItem("ps_name");
  const email = localStorage.getItem("ps_email");
  if (name) return name.toUpperCase();
  if (email) return email.split("@")[0].replace(/[._]/g, " ").toUpperCase();
  return "CARD HOLDER";
}

// ── Brand maps ───────────────────────────────────────────────────
const BANK_META = {
  HDFC:  { from: "#004c97", to: "#0072bc", short: "H"  },
  SBI:   { from: "#2d6a4f", to: "#40916c", short: "S"  },
  ICICI: { from: "#b5451b", to: "#e07b39", short: "IC" },
  Axis:  { from: "#97144d", to: "#c0395e", short: "A"  },
  Kotak: { from: "#ed1c24", to: "#f87171", short: "K"  },
  PNB:   { from: "#1d4ed8", to: "#60a5fa", short: "P"  },
};

const CARD_GRAD = {
  HDFC:  ["#004c97","#0072bc"], SBI:   ["#2d6a4f","#40916c"],
  ICICI: ["#b5451b","#e07b39"], Axis:  ["#97144d","#c0395e"],
  Kotak: ["#ed1c24","#f87171"], PNB:   ["#1d4ed8","#60a5fa"],
  default: ["#312e81","#6366f1"],
};
const cardGrad = (name = "") => CARD_GRAD[name] || CARD_GRAD.default;

// ── Manage Card Drawer ───────────────────────────────────────────
function ManageDrawer({ m, onClose, onDelete, onSetDefault, onStatusUpdate }) {
  const [from, to] = cardGrad(m.providerName);
  const [revealed, setRevealed] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const cardholderName = getCardholderName();

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      await onStatusUpdate(m.instrumentID, newStatus);
      toast.success(`✓ Card marked as ${newStatus}`);
      onClose();
    } catch (error) {
      toast.error(`Failed to update status: ${error.response?.data?.message || error.message}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusDisplay = (status) => {
    if (!status || status === "Active") return null;
    const statusConfig = {
      Lost: { bg: "rgba(239,68,68,0.15)", border: "#ef4444", text: "#fca5a5", label: "🔴 LOST" },
      Blocked: { bg: "rgba(234,88,12,0.15)", border: "#ea580c", text: "#fdba74", label: "🟠 BLOCKED" },
      Inactive: { bg: "rgba(107,114,128,0.15)", border: "#6b7280", text: "#d1d5db", label: "⚫ INACTIVE" }
    };
    return statusConfig[status];
  };

  const currentStatusConfig = getStatusDisplay(m.status);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-t-[2rem] overflow-hidden"
        style={{ background: "linear-gradient(145deg,#0f172a,#1e1b4b)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: `0 -24px 64px -12px ${from}44` }}
        onClick={e => e.stopPropagation()}>

        {/* drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Current Status Indicator */}
        {currentStatusConfig && (
          <div className="mx-5 mt-2 p-3 rounded-xl flex items-center gap-2" style={{ background: currentStatusConfig.bg, border: `1px solid ${currentStatusConfig.border}` }}>
            <AlertTriangle size={14} style={{ color: currentStatusConfig.text }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: currentStatusConfig.text }}>
              {currentStatusConfig.label}
            </span>
          </div>
        )}

        {/* mini card preview inside drawer */}
        <div className="mx-5 mt-3 rounded-2xl p-5 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg,${from},${to})`, boxShadow: `0 12px 40px -8px ${from}66`, opacity: currentStatusConfig ? 0.7 : 1 }}>
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(255,255,255,0.15) 0%,transparent 65%)" }} />
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/40 text-[8px] uppercase tracking-widest font-bold">PaySphere</p>
              <p className="text-white font-black text-base">{m.providerName || "Card"}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Wifi size={16} className="text-white/40 rotate-90" />
              <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md"
                style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>{m.cardType || "Debit"}</span>
            </div>
          </div>
          {/* masked number with reveal */}
          <div className="flex items-center gap-2 mb-4">
            <p className="text-white font-mono text-sm tracking-[0.22em] font-bold flex-1">
              {revealed ? (m.maskedIdentifier || "•••• •••• •••• ••••") : "•••• •••• •••• " + (m.maskedIdentifier || "••••").slice(-4)}
            </p>
            <button onClick={() => setRevealed(r => !r)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{ background: "rgba(255,255,255,0.15)" }}>
              {revealed ? <EyeOff size={13} className="text-white/70" /> : <Eye size={13} className="text-white/70" />}
            </button>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-white/30 text-[7px] uppercase tracking-widest">Card Holder</p>
              <p className="text-white font-bold text-xs tracking-wide">{cardholderName}</p>
            </div>
            {m.expiry && (
              <div className="text-right">
                <p className="text-white/30 text-[7px] uppercase tracking-widest">Valid Thru</p>
                <p className="text-white font-mono text-xs font-bold">{m.expiry}</p>
              </div>
            )}
          </div>
        </div>

        {/* actions */}
        <div className="p-5 space-y-2">
          {!m.isDefault && (
            <button onClick={() => { onSetDefault(m.instrumentID); onClose(); }}
              className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              style={{ background: `linear-gradient(135deg,${from}22,${to}14)`, border: `1px solid ${from}35`, color: to }}>
              <Star size={14} /> Set as Primary Card
            </button>
          )}
          
          {/* Status Update Section */}
          <div className="border-t border-white/10 pt-2 mt-2">
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Card Status</p>
            <div className="space-y-2">
              {m.status !== "Lost" && (
                <button onClick={() => handleStatusUpdate("Lost")}
                  disabled={updatingStatus}
                  className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", opacity: updatingStatus ? 0.6 : 1 }}>
                  <AlertTriangle size={13} /> Mark as Lost
                </button>
              )}
              {m.status !== "Blocked" && (
                <button onClick={() => handleStatusUpdate("Blocked")}
                  disabled={updatingStatus}
                  className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  style={{ background: "rgba(234,88,12,0.1)", border: "1px solid rgba(234,88,12,0.2)", color: "#fdba74", opacity: updatingStatus ? 0.6 : 1 }}>
                  <AlertTriangle size={13} /> Mark as Blocked
                </button>
              )}
              {(m.status === "Lost" || m.status === "Blocked") && (
                <button onClick={() => handleStatusUpdate("Active")}
                  disabled={updatingStatus}
                  className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#86efac" }}>
                  <LockOpen size={13} /> Mark as Active
                </button>
              )}
            </div>
          </div>
          
          <button onClick={() => { onDelete(m.instrumentID); onClose(); }}
            className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
            <Trash2 size={14} /> Remove Card
          </button>
          <button onClick={onClose}
            className="w-full py-3 rounded-2xl font-bold text-sm text-white/30 hover:text-white/60 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Card Tile ────────────────────────────────────────────────────
function CardTile({ m, onDelete, onSetDefault, onStatusUpdate }) {
  const [from, to] = cardGrad(m.providerName);
  const [managing, setManaging] = useState(false);
  const cardholderName = getCardholderName();

  const getStatusDisplay = (status) => {
    if (!status || status === "Active") return null;
    const statusConfig = {
      Lost: { bg: "rgba(239,68,68,0.9)", label: "🔴 LOST", pos: "top-3 right-3" },
      Blocked: { bg: "rgba(234,88,12,0.9)", label: "🟠 BLOCKED", pos: "top-3 right-3" },
      Inactive: { bg: "rgba(107,114,128,0.9)", label: "⚫ INACTIVE", pos: "top-3 right-3" }
    };
    return statusConfig[status];
  };

  const statusDisplay = getStatusDisplay(m.status);

  return (
    <>
    <div className="relative group rounded-[1.75rem] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:scale-[1.01]"
      style={{
        minHeight: 210,
        background: `linear-gradient(135deg, ${from} 0%, ${to} 60%, ${from}cc 100%)`,
        boxShadow: `0 32px 64px -16px ${from}88, 0 8px 32px -8px ${from}55`,
        opacity: statusDisplay ? 0.7 : 1
      }}>

      {/* gloss orbs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 65%)` }} />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 65%)` }} />
      {/* grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(255,255,255,1) 28px,rgba(255,255,255,1) 29px),repeating-linear-gradient(90deg,transparent,transparent 28px,rgba(255,255,255,1) 28px,rgba(255,255,255,1) 29px)" }} />

      {/* Status Badge */}
      {statusDisplay && (
        <div className={`absolute ${statusDisplay.pos} z-10 px-2.5 py-1.5 rounded-lg font-black text-xs uppercase tracking-widest text-white`}
          style={{ background: statusDisplay.bg, backdropFilter: "blur(8px)" }}>
          {statusDisplay.label}
        </div>
      )}

      <div className="relative p-6 flex flex-col justify-between h-full" style={{ minHeight: 210 }}>
        {/* top row */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/40 text-[8px] uppercase tracking-[0.3em] font-bold mb-0.5">PaySphere</p>
            <p className="text-white font-black text-lg leading-tight drop-shadow">{m.providerName || "Card"}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Wifi size={18} className="text-white/50 rotate-90" />
            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
              style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)", backdropFilter: "blur(4px)" }}>
              {m.cardType || "Debit"}
            </span>
          </div>
        </div>

        {/* chip + number */}
        <div className="my-3">
          <div className="w-10 h-7 rounded-md mb-3 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg,#fde68a,#d97706)", boxShadow: "0 2px 10px #d9770655" }}>
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-px p-1">
              {[...Array(6)].map((_, i) => <div key={i} className="rounded-[1px]" style={{ background: "rgba(120,60,0,0.25)" }} />)}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-px h-full bg-yellow-700/30" />
            </div>
          </div>
          <p className="text-white font-mono text-sm tracking-[0.28em] font-bold drop-shadow-md">
            •••• •••• •••• {(m.maskedIdentifier || "••••").slice(-4)}
          </p>
        </div>

        {/* bottom row — name + expiry + primary */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-white/30 text-[7px] uppercase tracking-widest mb-0.5">Card Holder</p>
            <p className="text-white font-bold text-xs tracking-wide">{cardholderName}</p>
            <div className="mt-1.5">
              {m.isDefault
                ? <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.18)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
                    <Star size={7} fill="currentColor" /> Primary
                  </span>
                : null
              }
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {m.expiry && (
              <div className="text-right">
                <p className="text-white/30 text-[7px] uppercase tracking-widest">Valid Thru</p>
                <p className="text-white/90 font-mono text-xs font-bold">{m.expiry}</p>
              </div>
            )}
            <div className="flex -space-x-2 opacity-60">
              <div className="w-6 h-6 rounded-full" style={{ background: "#eb001b" }} />
              <div className="w-6 h-6 rounded-full" style={{ background: "#f79e1b" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Manage button — appears on hover */}
      <button onClick={() => setManaging(true)}
        className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-200"
        style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", color: "white" }}>
        <Settings2 size={11} /> Manage
      </button>
    </div>

    {managing && (
      <ManageDrawer m={m} onClose={() => setManaging(false)} onDelete={onDelete} onSetDefault={onSetDefault} onStatusUpdate={onStatusUpdate} />
    )}
    </>
  );
}

// ── Add ghost tile ───────────────────────────────────────────────
function AddTile({ onClick }) {
  return (
    <button onClick={onClick}
      className="group relative rounded-[1.5rem] border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02]"
      style={{ minHeight: 180, borderColor: "rgba(167,139,250,0.25)", background: "rgba(167,139,250,0.04)" }}>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
        style={{ background: "rgba(167,139,250,0.12)" }}>
        <Plus size={22} style={{ color: "rgba(167,139,250,0.6)" }} />
      </div>
      <p className="text-xs font-bold" style={{ color: "rgba(167,139,250,0.5)" }}>Add a Card</p>
    </button>
  );
}

// ── UPI Row ──────────────────────────────────────────────────────
function UpiRow({ m, onDelete, onSetDefault }) {
  const vpa = m.upiId || m.maskedIdentifier || "";
  const [user, bank] = vpa.includes("@") ? vpa.split("@") : [vpa, ""];

  return (
    <div className="group relative rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: "linear-gradient(135deg,rgba(79,70,229,0.14),rgba(124,58,237,0.08))", border: "1px solid rgba(99,102,241,0.2)", boxShadow: "0 8px 32px -8px rgba(99,102,241,0.2)" }}>

      {/* top accent bar */}
      <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg,#6366f1,#8b5cf6,transparent)" }} />

      <div className="flex items-center gap-4 px-5 py-4">
        {/* icon */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", boxShadow: "0 8px 24px -4px #6366f166" }}>
            <Smartphone size={20} className="text-white" />
          </div>
          {m.isDefault && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", boxShadow: "0 0 8px #f59e0b88" }}>
              <Star size={8} fill="white" className="text-white" />
            </div>
          )}
        </div>

        {/* info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
              style={{ background: "rgba(99,102,241,0.25)", color: "#a5b4fc" }}>UPI</span>
            {m.isDefault && (
              <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: "#f59e0b" }}>Primary</span>
            )}
          </div>
          {bank
            ? <p className="font-mono text-sm font-bold">
                <span style={{ color: "#a5b4fc" }}>{user}</span>
                <span className="text-white/20">@</span>
                <span style={{ color: "#c4b5fd" }}>{bank}</span>
              </p>
            : <p className="text-white/60 font-mono text-sm">{vpa}</p>
          }
        </div>

        {/* actions */}
        <div className="flex items-center gap-2 shrink-0">
          {!m.isDefault && (
            <button onClick={() => onSetDefault(m.instrumentID)}
              className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}>
              Set Primary
            </button>
          )}
          <button onClick={() => onDelete(m.instrumentID)}
            className="w-8 h-8 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <Trash2 size={13} className="text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Bank Row ─────────────────────────────────────────────────────
function BankRow({ m, onDelete, onSetDefault }) {
  const meta = BANK_META[m.providerName];
  const from = meta?.from ?? "#0369a1";
  const to   = meta?.to   ?? "#38bdf8";
  const initials = meta?.short ?? (m.providerName || "BA").slice(0, 2).toUpperCase();

  return (
    <div className="group relative rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: `linear-gradient(135deg,${from}12,${to}08)`, border: `1px solid ${from}28`, boxShadow: `0 8px 32px -8px ${from}28` }}>

      {/* top accent bar */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg,${from},${to},transparent)` }} />

      <div className="flex items-center gap-4 px-5 py-4">
        {/* bank logo circle */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-sm"
            style={{ background: `linear-gradient(135deg,${from},${to})`, boxShadow: `0 8px 24px -4px ${from}66` }}>
            {initials}
          </div>
          {m.isDefault && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", boxShadow: "0 0 8px #f59e0b88" }}>
              <Star size={8} fill="white" className="text-white" />
            </div>
          )}
        </div>

        {/* info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-black text-white text-sm truncate">{m.providerName || "Bank Account"}</span>
            {m.isDefault && (
              <span className="text-[8px] font-black uppercase tracking-widest shrink-0" style={{ color: "#f59e0b" }}>Primary</span>
            )}
          </div>
          <p className="font-mono text-xs tracking-widest" style={{ color: to + "99" }}>{m.maskedIdentifier}</p>
          {m.ifsc && (
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded"
                style={{ background: `${from}20`, color: to + "aa" }}>IFSC</span>
              <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>{m.ifsc}</span>
            </div>
          )}
        </div>

        {/* actions */}
        <div className="flex items-center gap-2 shrink-0">
          {!m.isDefault && (
            <button onClick={() => onSetDefault(m.instrumentID)}
              className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{ background: `${from}20`, color: to, border: `1px solid ${from}30` }}>
              Set Primary
            </button>
          )}
          <button onClick={() => onDelete(m.instrumentID)}
            className="w-8 h-8 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <Trash2 size={13} className="text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────────
function EmptyState({ icon: Icon, label, color, onClick }) {
  return (
    <button onClick={onClick}
      className="group w-full rounded-2xl border-2 border-dashed p-8 flex flex-col items-center gap-3 transition-all duration-200 hover:scale-[1.01]"
      style={{ borderColor: color + "25", background: color + "05" }}>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
        style={{ background: color + "15" }}>
        <Icon size={22} style={{ color: color + "70" }} />
      </div>
      <div className="text-center">
        <p className="font-bold text-sm" style={{ color: color + "60" }}>No {label} linked yet</p>
        <p className="text-xs mt-0.5" style={{ color: color + "35" }}>Click to add one</p>
      </div>
    </button>
  );
}

// ── Section header ───────────────────────────────────────────────
function SectionHead({ icon: Icon, label, count, from, to }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-7 h-7 rounded-xl flex items-center justify-center shadow-lg"
        style={{ background: `linear-gradient(135deg,${from},${to})`, boxShadow: `0 4px 12px -2px ${from}55` }}>
        <Icon size={14} className="text-white" />
      </div>
      <span className="font-black text-white/70 text-xs uppercase tracking-widest">{label}</span>
      {count > 0 && (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-black text-white/60"
          style={{ background: from + "25", border: `1px solid ${from}30` }}>
          {count}
        </span>
      )}
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg,${from}30,transparent)` }} />
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────
const Skeleton = ({ h = "h-16", n = 2 }) => (
  <div className="space-y-3">
    {Array.from({ length: n }).map((_, i) => (
      <div key={i} className={`${h} rounded-2xl animate-pulse`} style={{ background: "rgba(255,255,255,0.05)" }} />
    ))}
  </div>
);

// ── Page ─────────────────────────────────────────────────────────
export default function PaymentMethodsPage() {
  const dispatch = useDispatch();
  const { instruments: methods, loading } = useSelector(s => s.paymentInstruments);
  const [isModalOpen, setModal] = useState(false);

  useEffect(() => { dispatch(fetchInstruments()); }, [dispatch]);

  const handleDelete = async (id) => {
    try { await dispatch(deleteInstrument(id)).unwrap(); toast.success("Removed"); }
    catch { toast.error("Failed"); }
  };
  const handleSetDefault = async (id) => {
    try { await dispatch(setDefaultInstrument(id)).unwrap(); toast.success("Set as primary"); }
    catch { toast.error("Failed"); }
  };
  const handleStatusUpdate = async (id, status) => {
    await dispatch(updateInstrumentStatus({ id, status })).unwrap();
  };

  const cards = methods.filter(m => m.type === "Card");
  const upi   = methods.filter(m => m.type === "UPI");
  const banks = methods.filter(m => m.type === "BankAccount");

  return (
    // -m-8 breaks out of DashboardShell's p-8, min-h-screen fills the rest
    <div className="-m-8 min-h-screen p-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
      style={{ background: "linear-gradient(145deg,#080d1a 0%,#0d1424 50%,#080d1a 100%)" }}>

      <div className="max-w-4xl mx-auto space-y-8">

        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-1.5 h-6 rounded-full" style={{ background: "linear-gradient(180deg,#a78bfa,#6366f1)" }} />
              <h2 className="text-white text-2xl font-black tracking-tight">Payment Methods</h2>
            </div>
            <p className="text-white/30 text-sm ml-4">
              {methods.length > 0
                ? `${methods.length} method${methods.length > 1 ? "s" : ""} · Secured by PaySphere Vault`
                : "Add your cards, UPI IDs and bank accounts"}
            </p>
          </div>
          <button onClick={() => setModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all active:scale-95 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 8px 24px -4px #6366f166" }}>
            <Plus size={16} />
            Add New Method
          </button>
        </div>

        {/* ── STATS ── */}
        {methods.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Cards",    count: cards.length, icon: CreditCard, from: "#7c3aed", to: "#a78bfa" },
              { label: "UPI IDs",  count: upi.length,   icon: Smartphone, from: "#4f46e5", to: "#818cf8" },
              { label: "Accounts", count: banks.length,  icon: Landmark,   from: "#0369a1", to: "#38bdf8" },
            ].map(s => (
              <div key={s.label} className="rounded-2xl border px-4 py-3.5 flex items-center gap-3"
                style={{ background: `linear-gradient(135deg,${s.from}18,${s.to}0d)`, borderColor: s.from + "25", boxShadow: `0 4px 20px -8px ${s.from}33` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg,${s.from},${s.to})`, boxShadow: `0 4px 12px -2px ${s.from}55` }}>
                  <s.icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-black text-2xl leading-none">{s.count}</p>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── CARDS ── */}
        <section>
          <SectionHead icon={CreditCard} label="Debit / Credit Cards" count={cards.length} from="#7c3aed" to="#a78bfa" />
          {loading
            ? <Skeleton h="h-44" n={1} />
            : <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cards.map(m => <CardTile key={m.instrumentID} m={m} onDelete={handleDelete} onSetDefault={handleSetDefault} onStatusUpdate={handleStatusUpdate} />)}
                <AddTile onClick={() => setModal(true)} />
              </div>
          }
        </section>

        {/* ── UPI ── */}
        <section>
          <SectionHead icon={Smartphone} label="UPI / VPA" count={upi.length} from="#4f46e5" to="#818cf8" />
          {loading ? <Skeleton />
            : upi.length === 0
              ? <EmptyState icon={Smartphone} label="UPI IDs" color="#6366f1" onClick={() => setModal(true)} />
              : <div className="space-y-2">{upi.map(m => <UpiRow key={m.instrumentID} m={m} onDelete={handleDelete} onSetDefault={handleSetDefault} />)}</div>
          }
        </section>

        {/* ── BANK ── */}
        <section>
          <SectionHead icon={Landmark} label="Bank Accounts" count={banks.length} from="#0369a1" to="#38bdf8" />
          {loading ? <Skeleton />
            : banks.length === 0
              ? <EmptyState icon={Landmark} label="bank accounts" color="#0ea5e9" onClick={() => setModal(true)} />
              : <div className="space-y-2">{banks.map(m => <BankRow key={m.instrumentID} m={m} onDelete={handleDelete} onSetDefault={handleSetDefault} />)}</div>
          }
        </section>

        {/* ── TRUST FOOTER ── */}
        <div className="flex items-center justify-center gap-8 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {[
            { text: "PCI DSS Level 1", color: "#10b981" },
            { text: "256-bit SSL",     color: "#6366f1" },
            { text: "RBI Compliant",   color: "#0ea5e9" },
          ].map(t => (
            <div key={t.text} className="flex items-center gap-1.5">
              <ShieldCheck size={11} style={{ color: t.color + "99" }} />
              <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: t.color + "55" }}>{t.text}</span>
            </div>
          ))}
        </div>

      </div>

      <AddInstrumentModal isOpen={isModalOpen} onClose={() => setModal(false)} />
    </div>
  );
}
