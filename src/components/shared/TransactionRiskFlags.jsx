import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { RiskScoreBadge } from './RiskScoreBadge';

/**
 * Risk Flags Display Component
 * Shows associated risk flags for a transaction
 */
export function TransactionRiskFlags({ riskFlags }) {
  if (!riskFlags || riskFlags.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800/50 border-t border-slate-600/30 px-6 py-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={16} className="text-orange-400" />
        <h4 className="font-semibold text-slate-200">Associated Risk Flags ({riskFlags.length})</h4>
      </div>

      <div className="space-y-3">
        {riskFlags.map((flag) => (
          <div key={flag.FlagID || flag.flagID} className="bg-slate-700/30 border border-slate-600/20 rounded-lg p-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-blue-300">#{flag.FlagID || flag.flagID}</span>
                <span className="text-xs text-slate-400">
                  {flag.RiskType || flag.riskType}
                </span>
              </div>
              <RiskScoreBadge
                riskScore={flag.RiskScore || flag.riskScore}
                triggerFeatures={flag.TriggerFeatures || flag.triggerFeatures}
                showDetails={false}
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${
                (flag.Status || flag.status || "").toLowerCase() === "open"
                  ? "bg-red-500/20 text-red-300 border-red-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
              }`}>
                {flag.Status || flag.status}
              </span>
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${
                (flag.Severity || flag.severity || "").toUpperCase() === "CRITICAL"
                  ? "bg-red-500/20 text-red-300 border-red-500/30"
                  : (flag.Severity || flag.severity || "").toUpperCase() === "HIGH"
                  ? "bg-orange-500/20 text-orange-300 border-orange-500/30"
                  : (flag.Severity || flag.severity || "").toUpperCase() === "MEDIUM"
                  ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                  : "bg-blue-500/20 text-blue-300 border-blue-500/30"
              }`}>
                {flag.Severity || flag.severity}
              </span>
            </div>

            {flag.Description && (
              <p className="text-xs text-slate-400 mt-2">{flag.Description || flag.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}