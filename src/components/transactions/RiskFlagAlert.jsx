import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { RiskScoreBadge } from "../shared/RiskScoreBadge";

/**
 * Risk Flag Alert Component
 * Displays when transaction failures detected with ML-based risk scoring
 * Updated for 0-100 percentage scale (>= 80 is critical)
 */
export function RiskFlagAlert({ onClose, failureCount = 3, riskScore, triggerFeatures }) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    onClose?.();
  };

  const hasRiskData = riskScore !== undefined && riskScore !== null;

  // Normalize risk score to 0-100 percentage
  let normalizedScore = Number.parseFloat(riskScore);
  if (Number.isNaN(normalizedScore)) {
    normalizedScore = 0;
  }
  // Convert from 0-1 scale if needed
  if (normalizedScore >= 0 && normalizedScore <= 1) {
    normalizedScore = normalizedScore * 100;
  }
  const isCriticalRisk = normalizedScore >= 80;

  return (
    <div className="fixed top-4 right-4 z-[10000] animate-in slide-in-from-right duration-300 max-w-md">
      <div className="bg-gradient-to-r from-red-900 to-rose-900 border-2 border-red-500/50 rounded-lg p-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <AlertTriangle size={24} className="text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1">
            <h3 className="text-red-100 font-bold text-lg">⚠️ Risk Flag Alert</h3>
            <p className="text-red-200/80 text-sm mt-1">
              Multiple transaction failures detected on your account
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-red-300 hover:text-red-100 transition p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Details */}
        <div className="bg-black/20 rounded p-3 mb-4 border border-red-500/20">
          <p className="text-red-100 text-sm mb-2 font-semibold">
            🔴 {failureCount} consecutive failed attempts detected
          </p>
          {hasRiskData && (
            <div className="mb-3 p-2 bg-slate-800/50 rounded border border-slate-600/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-slate-300">Risk Assessment:</span>
                <RiskScoreBadge
                  riskScore={riskScore}
                  triggerFeatures={triggerFeatures}
                  showDetails={false}
                />
              </div>
              {isCriticalRisk && (
                <p className="text-xs text-red-300 font-medium">
                  ⚠️ High-risk transaction detected - additional verification required
                </p>
              )}
            </div>
          )}
          <ul className="text-red-200/70 text-xs space-y-1 ml-4">
            <li>• Your account has been flagged for suspicious activity</li>
            <li>• This has been recorded for review by our security team</li>
            <li>• Please verify your transaction details carefully</li>
            {hasRiskData && isCriticalRisk && (
              <li>• High-risk transactions may require additional approval</li>
            )}
          </ul>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="w-full px-4 bg-red-500/20 hover:bg-red-500/30 text-red-200 font-semibold py-2 rounded transition"
        >
          Dismiss
        </button>

        {/* Footer */}
        <p className="text-red-300/60 text-xs mt-3">
          ℹ️ This alert will reset after 24 hours of successful transactions
        </p>
      </div>
    </div>
  );
}
