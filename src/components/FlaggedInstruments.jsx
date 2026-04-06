import React, { useState, useEffect } from "react";
import { paymentService } from "../services/paymentService";
import { toast } from "react-hot-toast";
import { Lock, LockOpen, AlertTriangle, CreditCard, Landmark, Smartphone, Zap } from "lucide-react";

// ── Brand maps ───────────────────────────────────────────────────
const BRAND_META = {
  HDFC: { from: "#004c97", to: "#0072bc", short: "H" },
  SBI: { from: "#2d6a4f", to: "#40916c", short: "S" },
  ICICI: { from: "#b5451b", to: "#e07b39", short: "IC" },
  Axis: { from: "#003a88", to: "#0052a3", short: "AX" },
  Default: { from: "#6366f1", to: "#8b5cf6", short: "?" }
};

const TYPE_ICON = {
  Card: CreditCard,
  Bank: Landmark,
  UPI: Smartphone
};

const STATUS_COLORS = {
  Lost: { badge: "rgba(239,68,68,0.15)", border: "#ef4444", text: "#fca5a5" },
  Blocked: { badge: "rgba(234,88,12,0.15)", border: "#ea580c", text: "#fdba74" },
  Inactive: { badge: "rgba(107,114,128,0.15)", border: "#6b7280", text: "#d1d5db" }
};

// ── Individual Flagged Instrument Card ────────────────────────────
function FlaggedInstrumentCard({ instrument, onUnlock, isUnlocking, setUnlockingId }) {
  const brandMeta = BRAND_META[instrument.providerName] || BRAND_META.Default;
  const statusColor = STATUS_COLORS[instrument.status] || STATUS_COLORS.Lost;
  const Icon = TYPE_ICON[instrument.type] || CreditCard;

  const handleUnlock = async () => {
    try {
      setUnlockingId(instrument.instrumentID);
      await paymentService.unlockInstrument(instrument.instrumentID);
      toast.success(`✓ ${instrument.maskedIdentifier} unlocked successfully!`);
      onUnlock(instrument.instrumentID);
    } catch (error) {
      toast.error(`Failed to unlock: ${error.response?.data?.message || error.message}`);
    } finally {
      setUnlockingId(null);
    }
  };

  return (
    <div className="relative group">
      {/* Card wrapper with desaturated effect for locked instruments */}
      <div
        className="relative p-4 rounded-2xl border transition-all duration-300 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${brandMeta.from}11, ${brandMeta.to}08)`,
          borderColor: statusColor.border,
          filter: "saturate(0.6)",
          opacity: 0.85
        }}
      >
        {/* Locked overlay */}
        <div className="absolute inset-0 bg-black/20 rounded-2xl" />

        {/* Status badge */}
        <div className="absolute top-3 right-3 z-10">
          <div
            className="px-3 py-1 rounded-lg flex items-center gap-1.5"
            style={{ background: statusColor.badge, border: `1px solid ${statusColor.border}` }}
          >
            <AlertTriangle size={12} style={{ color: statusColor.text }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: statusColor.text }}>
              {instrument.status}
            </span>
          </div>
        </div>

        {/* Card content */}
        <div className="relative z-5 space-y-3">
          {/* Header: Brand + Type */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs"
                style={{ background: `linear-gradient(135deg, ${brandMeta.from}, ${brandMeta.to})` }}
              >
                {brandMeta.short}
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
                  {instrument.type}
                </p>
                <p className="text-white font-bold text-xs">{instrument.providerName}</p>
              </div>
            </div>
            <Icon size={16} className="text-white/50" />
          </div>

          {/* Masked identifier */}
          <div className="pt-1">
            <p className="text-white/60 text-[10px] uppercase tracking-widest mb-1">Identifier</p>
            <p className="text-white/90 font-mono text-sm font-bold tracking-wide">
              {instrument.maskedIdentifier}
            </p>
          </div>

          {/* User info (for admin view) */}
          {instrument.userEmail && (
            <div className="pt-1 border-t border-white/10">
              <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Account Owner</p>
              <p className="text-white/70 text-xs">{instrument.userEmail}</p>
            </div>
          )}

          {/* Unlock button - prominent and admin-only */}
          <div className="pt-3 flex gap-2">
            <button
              onClick={handleUnlock}
              disabled={isUnlocking}
              className="flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #10b981, #34d399)",
                color: "white",
                border: "1px solid rgba(16,185,129,0.3)",
                opacity: isUnlocking ? 0.6 : 1,
                transform: isUnlocking ? "scale(0.98)" : "scale(1)",
                boxShadow: "0 4px 12px -2px rgba(16,185,129,0.25)"
              }}
            >
              {isUnlocking ? (
                <>
                  <Zap size={12} className="animate-spin" />
                  Unlocking...
                </>
              ) : (
                <>
                  <LockOpen size={12} />
                  Unlock
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Flagged Instruments Panel ──────────────────────────────
export default function FlaggedInstruments() {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [unlockingId, setUnlockingId] = useState(null);

  // Fetch flagged instruments on mount
  useEffect(() => {
    fetchFlaggedInstruments();
  }, []);

  const fetchFlaggedInstruments = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getFlaggedInstruments();
      setInstruments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching flagged instruments:", error);
      toast.error("Failed to load flagged instruments");
      setInstruments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (instrumentId) => {
    // Remove from list after successful unlock
    setInstruments(instruments.filter(i => i.instrumentID !== instrumentId));
    await fetchFlaggedInstruments(); // Refresh to be safe
  };

  // Filter instruments by status
  const filteredInstruments = statusFilter === "All"
    ? instruments
    : instruments.filter(i => i.status === statusFilter);

  const statuses = ["All", "Lost", "Blocked", "Inactive"];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <Lock size={16} />
            Flagged Payment Instruments
          </h2>
          <p className="text-xs text-white/40 mt-1">
            {filteredInstruments.length} instrument{filteredInstruments.length !== 1 ? "s" : ""} flagged
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200"
              style={{
                background: statusFilter === status
                  ? "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))"
                  : "rgba(255,255,255,0.04)",
                border: statusFilter === status
                  ? "1px solid rgba(99,102,241,0.4)"
                  : "1px solid rgba(255,255,255,0.08)",
                color: statusFilter === status ? "#a5b4fc" : "#64748b"
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="p-8 text-center">
          <Zap size={24} className="text-white/40 mx-auto mb-2 animate-spin" />
          <p className="text-sm text-white/40">Loading flagged instruments...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredInstruments.length === 0 && (
        <div className="p-12 text-center rounded-2xl border" style={{ borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.05)" }}>
          <LockOpen size={32} className="text-green-400/50 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-green-400 mb-1">All Clear! ✓</h3>
          <p className="text-xs text-white/40">
            No flagged instruments {statusFilter !== "All" ? `with status "${statusFilter}"` : ""}
          </p>
        </div>
      )}

      {/* Cards grid */}
      {!loading && filteredInstruments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredInstruments.map(instrument => (
            <FlaggedInstrumentCard
              key={instrument.instrumentID}
              instrument={instrument}
              onUnlock={handleUnlock}
              isUnlocking={unlockingId === instrument.instrumentID}
              setUnlockingId={setUnlockingId}
            />
          ))}
        </div>
      )}

      {/* Refresh button */}
      {!loading && (
        <div className="pt-4 flex justify-center">
          <button
            onClick={fetchFlaggedInstruments}
            className="px-4 py-2 rounded-lg text-xs font-bold text-white/70 hover:text-white transition-all"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            ↻ Refresh
          </button>
        </div>
      )}
    </div>
  );
}
