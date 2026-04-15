/**
 * Risk Score Formatting Utilities
 * Handles conversion between decimal (0-1) and percentage (0-100) scales
 */

/**
 * Normalize risk score to 0-100 percentage scale
 * Accepts both old format (0-1) and new format (0-100)
 * @param {number} score - Risk score to normalize
 * @returns {number} Normalized score (0-100)
 */
export function normalizeRiskScore(score) {
  if (score === null || score === undefined) return 0;
  
  let normalized = Number.parseFloat(score);
  if (Number.isNaN(normalized)) return 0;
  
  // If score is in old format (0-1), convert to percentage
  if (normalized >= 0 && normalized <= 1) {
    normalized = normalized * 100;
  }
  
  // Clamp to 0-100 range
  return Math.min(Math.max(normalized, 0), 100);
}

/**
 * Format risk score as percentage string
 * @param {number} score - Risk score to format
 * @returns {string} Formatted score (e.g., "40%")
 */
export function formatRiskScorePercent(score) {
  const normalized = normalizeRiskScore(score);
  return `${Math.round(normalized)}%`;
}

/**
 * Get severity level based on risk score
 * Matches backend logic from RiskService.SetSeverityBasedOnRiskScore
 * @param {number} score - Risk score (0-100)
 * @returns {string} Severity level (LOW, MEDIUM, HIGH, CRITICAL)
 */
export function getRiskSeverity(score) {
  const normalized = normalizeRiskScore(score);
  
  if (normalized <= 40) return "LOW";
  if (normalized <= 60) return "MEDIUM";
  if (normalized < 80) return "HIGH";
  return "CRITICAL";
}

/**
 * Get risk severity badge color classes
 * @param {string} severity - Severity level
 * @returns {string} Tailwind CSS classes
 */
export function getSeverityColorClasses(severity) {
  const s = (severity || "").toUpperCase();
  if (s === "CRITICAL") return "bg-red-500/20 text-red-300 border-red-500/30";
  if (s === "HIGH") return "bg-orange-500/20 text-orange-300 border-orange-500/30";
  if (s === "MEDIUM") return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
  if (s === "LOW" || s === "INFO") return "bg-blue-500/20 text-blue-300 border-blue-500/30";
  return "bg-slate-500/20 text-slate-300 border-slate-500/30";
}

/**
 * Get risk score badge color classes
 * @param {number} score - Risk score (0-100)
 * @returns {string} Tailwind CSS classes
 */
export function getRiskScoreColorClasses(score) {
  const normalized = normalizeRiskScore(score);
  
  if (normalized <= 20) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
  if (normalized <= 40) return "bg-blue-500/20 text-blue-300 border-blue-500/30";
  if (normalized <= 60) return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
  if (normalized <= 79) return "bg-orange-500/20 text-orange-300 border-orange-500/30";
  return "bg-red-500/20 text-red-300 border-red-500/30";
}

/**
 * Check if risk score is critical (>= 80%)
 * @param {number} score - Risk score
 * @returns {boolean}
 */
export function isCriticalRisk(score) {
  return normalizeRiskScore(score) >= 80;
}

/**
 * Format date for display
 * @param {string|Date} dateString - Date to format
 * @returns {string} Formatted date
 */
export function formatDate(dateString) {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "—";
  }
}

/**
 * Format date short (just date, no time)
 * @param {string|Date} dateString - Date to format
 * @returns {string} Formatted date (e.g., "11 Apr 2026")
 */
export function formatDateShort(dateString) {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "—";
  }
}
