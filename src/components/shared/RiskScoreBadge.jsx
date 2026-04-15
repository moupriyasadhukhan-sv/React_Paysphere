import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

/**
 * Risk Score Badge Component
 * Displays ML-based fraud detection risk score with color coding
 * NOTE: Backend now sends risk scores as 0-100 percentage (e.g., 40 instead of 0.4)
 */
export function RiskScoreBadge({ riskScore, triggerFeatures, showDetails = true }) {
  const [showTriggerDetails, setShowTriggerDetails] = useState(false);

  // Handle missing risk score
  if (riskScore === null || riskScore === undefined) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-500/20 text-slate-300 border border-slate-500/30">
        N/A
      </span>
    );
  }

  // Validate and normalize risk score
  // Accept both old format (0-1) and new format (0-100)
  let percentage = parseFloat(riskScore);
  if (isNaN(percentage)) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-500/20 text-slate-300 border border-slate-500/30">
        Invalid
      </span>
    );
  }

  // If score is in old format (0-1), convert to percentage
  if (percentage >= 0 && percentage <= 1) {
    percentage = Math.round(percentage * 100);
  }

  // Validate final percentage range
  if (percentage < 0 || percentage > 100) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-500/20 text-slate-300 border border-slate-500/30">
        Invalid
      </span>
    );
  }

  // Determine color and severity based on percentage (0-100 scale)
  // Matches backend: LOW (≤40), MEDIUM (≤60), HIGH (<80), CRITICAL (≥80)
  let colorClass, severityText, severityColor;
  if (percentage <= 40) {
    colorClass = "bg-blue-500/20 text-blue-300 border-blue-500/30";
    severityText = "LOW";
    severityColor = "text-blue-400";
  } else if (percentage <= 60) {
    colorClass = "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    severityText = "MED";
    severityColor = "text-yellow-400";
  } else if (percentage < 80) {
    colorClass = "bg-orange-500/20 text-orange-300 border-orange-500/30";
    severityText = "HI";
    severityColor = "text-orange-400";
  } else {
    colorClass = "bg-red-500/20 text-red-300 border-red-500/30";
    severityText = "CRIT";
    severityColor = "text-red-400";
  }

  // Parse trigger features
  let parsedFeatures = null;
  if (triggerFeatures) {
    try {
      parsedFeatures = typeof triggerFeatures === 'string'
        ? JSON.parse(triggerFeatures)
        : triggerFeatures;
    } catch (error) {
      console.warn('[RiskScoreBadge] Failed to parse triggerFeatures:', error);
      parsedFeatures = null;
    }
  }

  return (
    <div className="inline-block">
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
          {percentage}%
        </span>
        <span className={`text-xs font-medium ${severityColor}`}>
          {severityText}
        </span>
        {showDetails && parsedFeatures && (
          <button
            onClick={() => setShowTriggerDetails(!showTriggerDetails)}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
            title="Toggle trigger details"
          >
            {showTriggerDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>

      {/* Trigger Features Details */}
      {showDetails && showTriggerDetails && parsedFeatures && (
        <div className="mt-2 p-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-xs">
          <div className="font-medium text-slate-300 mb-2 flex items-center gap-2">
            <AlertTriangle size={12} />
            Trigger Details
          </div>
          <div className="space-y-1 text-slate-400">
            {parsedFeatures.TransactionCount_24H !== undefined && (
              <div>24h Transactions: {parsedFeatures.TransactionCount_24H}</div>
            )}
            {parsedFeatures.FailureRatio_30D !== undefined && (
              <div>30d Failure Rate: {(parsedFeatures.FailureRatio_30D * 100).toFixed(1)}%</div>
            )}
            {parsedFeatures.AmountDeviationRatio !== undefined && (
              <div>Amount Deviation: {parsedFeatures.AmountDeviationRatio.toFixed(2)}x average</div>
            )}
            {parsedFeatures.CurrentAmount !== undefined && (
              <div>Amount: ₹{parsedFeatures.CurrentAmount.toLocaleString()}</div>
            )}
            {parsedFeatures.AnalyzedAt && (
              <div>Analyzed: {new Date(parsedFeatures.AnalyzedAt).toLocaleString()}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Risk Score Progress Bar Component
 * Updated to work with 0-100 percentage scale
 */
export function RiskScoreProgress({ riskScore, className = "" }) {
  if (riskScore === null || riskScore === undefined) {
    return (
      <div className={`w-full bg-slate-700/30 rounded-full h-2 ${className}`}>
        <div className="bg-slate-500/50 h-2 rounded-full" style={{ width: "0%" }}></div>
      </div>
    );
  }

  // Normalize risk score to percentage (0-100)
  let percentage = Number.parseFloat(riskScore);
  if (Number.isNaN(percentage)) {
    percentage = 0;
  }

  // Convert from 0-1 scale to 0-100 if needed
  if (percentage >= 0 && percentage <= 1) {
    percentage = percentage * 100;
  }

  // Clamp to 0-100
  percentage = Math.min(Math.max(percentage, 0), 100);

  // Determine color based on percentage (0-100 scale)
  let progressColor;
  if (percentage <= 20) progressColor = "bg-emerald-500";
  else if (percentage <= 40) progressColor = "bg-blue-500";
  else if (percentage <= 60) progressColor = "bg-yellow-500";
  else if (percentage <= 79) progressColor = "bg-orange-500";
  else progressColor = "bg-red-500";

  return (
    <div className={`w-full bg-slate-700/30 rounded-full h-2 ${className}`}>
      <div
        className={`${progressColor} h-2 rounded-full transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}