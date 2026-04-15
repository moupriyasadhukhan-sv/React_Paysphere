import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LogoutButton from "../../common/LogoutButton";
import { getAllRiskFlags } from "../../services/risk/riskApi";
import { getTransactionLimits } from "../../services/limits/limitsApi";
import { AlertCircle, RefreshCw, AlertTriangle } from "lucide-react";
import { RiskScoreBadge } from "../../components/shared/RiskScoreBadge";
import { formatDateShort } from "../../utils/riskScoreFormatter";


/**
 * Risk Dashboard - READ-ONLY Monitoring Dashboard
 * Displays risk flags, transaction limits, and active alerts
 */
export default function RiskDashboard() {
  const role = useSelector((s) => s.auth?.role);
  const [flags, setFlags] = useState([]);
  const [limits, setLimits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limitsLoading, setLimitsLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitsError, setLimitsError] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [riskScoreFilter, setRiskScoreFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created"); // "created", "riskScore"
  const [sortOrder, setSortOrder] = useState("desc"); // "asc", "desc"
  const [currentPage, setCurrentPage] = useState(1);
  const [limitsCurrentPage, setLimitsCurrentPage] = useState(1);
  const [failedFlagsCurrentPage, setFailedFlagsCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [limitsPerPage] = useState(10);
  const [failedFlagsPerPage] = useState(10);

  /**
   * Load all risk flags from the backend
   */
  async function loadFlags() {
    setLoading(true);
    setError("");
    try {
      // Build filters object
      const filters = {};
      if (severityFilter !== "all") filters.severity = severityFilter;
      if (riskScoreFilter !== "all") {
        const parts = riskScoreFilter.split("-");
        const min = parseFloat(parts[0]);
        const max = parseFloat(parts[1]);
        if (!isNaN(min)) filters.riskScore_min = min;
        if (!isNaN(max)) filters.riskScore_max = max;
      }

      const response = await getAllRiskFlags(filters);
      console.log("[RiskDashboard] Flags loaded:", response);
      
      // Handle both array and wrapped response
      const data = Array.isArray(response) ? response : response?.data || [];
      setFlags(data);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load risk flags";
      setError(msg);
      console.error("[RiskDashboard] Error loading flags:", err);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Load transaction limits from the backend
   */
  async function loadLimits() {
    setLimitsLoading(true);
    setLimitsError("");
    try {
      const response = await getTransactionLimits();
      console.log("[RiskDashboard] Limits loaded:", response);
      
      // Handle both array and wrapped response
      let data = Array.isArray(response) ? response : response?.data || [];
      
      // If response has a success wrapper, extract the actual data
      if (!Array.isArray(data) && data?.data) {
        data = Array.isArray(data.data) ? data.data : [data.data];
      }
      
      // Map limits to ensure proper field names
      data = data.map(limit => {
        const userId = limit.userId || limit.userID || limit.UserID;
        const userName = limit.userName || limit.name || limit.Name || `User ${userId}`;
        
        return {
          ...limit,
          limitId: limit.limitId || limit.LimitID || limit.id,
          userId: userId,
          userName: userName,
          dailyLimit: limit.dailyLimit || limit.DailyLimit || limit.daily_limit || 0,
          monthlyLimit: limit.monthlyLimit || limit.MonthlyLimit || limit.monthly_limit || 0,
          used: limit.used || limit.Used || 0,
          limit: limit.limit || limit.Limit || limit.dailyLimit || limit.DailyLimit || 0,
        };
      });
      
      console.log("[RiskDashboard] Processed limits:", data);
      setLimits(data);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load transaction limits";
      setLimitsError(msg);
      console.error("[RiskDashboard] Error loading limits:", err);
    } finally {
      setLimitsLoading(false);
    }
  }

  useEffect(() => {
    loadFlags();
    loadLimits();
    
    // Auto-refresh flags every 30 seconds for real-time updates
    const interval = setInterval(loadFlags, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [severityFilter, riskScoreFilter, sortBy, sortOrder]);

  /**
   * Filter and sort flags based on current filters
   * Updated to handle 0-100 percentage scale
   */
  const filteredFlags = flags
    .filter((flag) => {
      // Severity filter
      if (severityFilter !== "all") {
        const flagSeverity = (flag.Severity || flag.severity || "").toUpperCase();
        if (flagSeverity !== severityFilter.toUpperCase()) return false;
      }

      // Risk score filter - handles both 0-100 scale and legacy 0-1 scale
      if (riskScoreFilter !== "all") {
        let score = Number.parseFloat(flag.RiskScore || flag.riskScore);
        if (Number.isNaN(score)) return false;

        // Normalize legacy 0-1 scale to 0-100
        if (score >= 0 && score <= 1) {
          score = score * 100;
        }

        const [min, max] = riskScoreFilter.split("-").map(v => Number.parseFloat(v));
        if (!Number.isNaN(min) && score < min) return false;
        if (!Number.isNaN(max) && score > max) return false;
      }

      return true;
    })
    .sort((a, b) => {
      let aVal, bVal;

      if (sortBy === "riskScore") {
        let scoreA = Number.parseFloat(a.RiskScore || a.riskScore) || 0;
        let scoreB = Number.parseFloat(b.RiskScore || b.riskScore) || 0;
        
        // Normalize legacy 0-1 scale to 0-100
        if (scoreA >= 0 && scoreA <= 1) scoreA = scoreA * 100;
        if (scoreB >= 0 && scoreB <= 1) scoreB = scoreB * 100;
        
        aVal = scoreA;
        bVal = scoreB;
      } else {
        // Sort by created date
        aVal = new Date(a.CreatedAt || a.createdAt || 0).getTime();
        bVal = new Date(b.CreatedAt || b.createdAt || 0).getTime();
      }

      if (sortOrder === "asc") {
        return aVal - bVal;
      } else {
        return bVal - aVal;
      }
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredFlags.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFlags = filteredFlags.slice(startIndex, endIndex);

  /**
   * Get color classes based on status
   */
  function getStatusColor(status) {
    const s = (status || "").toLowerCase();
    if (s === "open" || s === "active") return "bg-red-500/20 text-red-300 border-red-500/30";
    if (s === "resolved" || s === "closed") return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    if (s === "pending") return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    return "bg-slate-500/20 text-slate-300 border-slate-500/30";
  }

  /**
   * Get color classes based on severity
   */
  function getSeverityColor(severity) {
    const s = (severity || "").toUpperCase();
    if (s === "CRITICAL") return "bg-red-500/20 text-red-300 border-red-500/30";
    if (s === "HIGH") return "bg-orange-500/20 text-orange-300 border-orange-500/30";
    if (s === "MEDIUM") return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    if (s === "LOW") return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    return "bg-slate-500/20 text-slate-300 border-slate-500/30";
  }

  /**
   * Generate active alerts from risk flags
   * Alert is active if: riskScore >= 60% AND status = "Open"
   */
  function generateAlerts() {
    return flags
      .filter((flag) => {
        const status = (flag.Status || flag.status || "").toLowerCase();
        let score = Number.parseFloat(flag.RiskScore || flag.riskScore);
        
        if (Number.isNaN(score)) return false;
        // Normalize legacy 0-1 scale to 0-100
        if (score >= 0 && score <= 1) score = score * 100;
        
        return status === "open" && score >= 60;
      })
      .map((flag, index) => ({
        id: index,
        flagId: flag.FlagID || flag.flagID,
        type: flag.RiskType || flag.riskType,
        severity: flag.Severity || flag.severity,
        riskScore: flag.RiskScore || flag.riskScore,
        message: `High-risk transaction detected: ${flag.RiskType || flag.riskType}`,
        createdAt: flag.Created || flag.created,
      }));
  }

  /**
   * Calculate limit usage percentage and status
   */
  function getLimitStatus(percentageUsed) {
    if (percentageUsed < 75) {
      return {
        color: "emerald",
        status: "OK",
        badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      };
    } else if (percentageUsed < 90) {
      return {
        color: "yellow",
        status: "Warning",
        badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      };
    } else {
      return {
        color: "red",
        status: "Critical - Action Required",
        badge: "bg-red-500/20 text-red-300 border-red-500/30",
      };
    }
  }

  /**
   * Filter risk flags generated from consecutive failed transactions
   * These flags have riskType containing "Multiple", "Consecutive", or "Failed" patterns
   */
  function getFailedTransactionFlags() {
    return flags.filter((flag) => {
      const riskType = (flag.RiskType || flag.riskType || "").toLowerCase();
      const severity = (flag.Severity || flag.severity || "").toUpperCase();
      
      // Check if this flag is related to failed transactions
      // Filters:
      // 1. Risk type contains failure/consecutive/multiple/attempt keywords
      // 2. Transaction-related risk types (Insufficient Funds, Transfer Failed, etc.)
      // 3. HIGH or CRITICAL severity (typically from 3+ consecutive failures)
      return (
        riskType.includes("failed") ||
        riskType.includes("consecutive") ||
        riskType.includes("multiple") ||
        riskType.includes("attempt") ||
        riskType.includes("transaction failure") ||
        riskType.includes("insufficient") ||
        riskType.includes("transfer") ||
        riskType.includes("payment") ||
        (severity === "HIGH" && (flag.Status || flag.status || "").toLowerCase() === "open")
      );
    });
  }

  /**
   * Get progress bar color based on percentage
   */
  function getProgressBarColor(percentage) {
    if (percentage < 75) return "bg-emerald-500";
    if (percentage < 90) return "bg-yellow-500";
    return "bg-red-500";
  }

  // Pagination calculations for Limits
  const limitsStartIndex = (limitsCurrentPage - 1) * limitsPerPage;
  const limitsEndIndex = limitsStartIndex + limitsPerPage;
  const paginatedLimits = limits.slice(limitsStartIndex, limitsEndIndex);
  const totalLimitsPages = Math.ceil(limits.length / limitsPerPage);

  // Pagination calculations for Failed Transaction Flags
  const failedFlags = getFailedTransactionFlags();
  const failedFlagsStartIndex = (failedFlagsCurrentPage - 1) * failedFlagsPerPage;
  const failedFlagsEndIndex = failedFlagsStartIndex + failedFlagsPerPage;
  const paginatedFailedFlags = failedFlags.slice(failedFlagsStartIndex, failedFlagsEndIndex);
  const totalFailedFlagsPages = Math.ceil(failedFlags.length / failedFlagsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Risk Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Monitor risk flags, transaction limits, and alerts</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-300 text-sm">Role: <span className="font-semibold text-blue-400">{role}</span></span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm font-medium">Total Flags</p>
            <p className="text-3xl font-bold text-white mt-2">{flags.length}</p>
          </div>
        </div>

        {/* Risk Flags Section Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Risk Flags</h2>
          
          {/* Filters */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Severity</option>
              <option value="INFO">Info</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>

            <select
              value={riskScoreFilter}
              onChange={(e) => setRiskScoreFilter(e.target.value)}
              className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Risk Scores</option>
              <option value="0-20">Low Risk (0-20%)</option>
              <option value="21-40">Low-Med Risk (21-40%)</option>
              <option value="41-60">Medium Risk (41-60%)</option>
              <option value="61-79">High Risk (61-79%)</option>
              <option value="80-100">Critical Risk (80-100%)</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split("-");
                setSortBy(by);
                setSortOrder(order);
              }}
              className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="created-desc">Newest First</option>
              <option value="created-asc">Oldest First</option>
              <option value="riskScore-desc">Highest Risk First</option>
              <option value="riskScore-asc">Lowest Risk First</option>
            </select>

            <button
              onClick={loadFlags}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Risk Flags Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin">
                <RefreshCw size={32} className="text-slate-400" />
              </div>
              <p className="text-slate-400 mt-4">Loading risk flags...</p>
            </div>
          ) : filteredFlags.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle size={40} className="mx-auto text-slate-400 mb-4" />
              <p className="text-slate-400 text-lg">No risk flags found</p>
              <p className="text-slate-500 text-sm mt-2">Risk flags will appear here when suspicious activity is detected</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-200">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-900/50">
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">ID</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Risk Type</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Severity</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Risk Score</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFlags.map((flag) => (
                    <tr key={flag.FlagID || flag.flagID} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition">
                      <td className="px-6 py-4 font-mono text-xs text-blue-300">{flag.FlagID || flag.flagID}</td>
                      <td className="px-6 py-4">{flag.RiskType || flag.riskType || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(flag.Severity || flag.severity)}`}>
                          {flag.Severity || flag.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <RiskScoreBadge
                          riskScore={flag.RiskScore || flag.riskScore}
                          triggerFeatures={flag.TriggerFeatures || flag.triggerFeatures}
                          showDetails={true}
                        />
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {formatDateShort(flag.Created || flag.created)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredFlags.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Showing <span className="font-semibold text-white">{startIndex + 1}</span> to <span className="font-semibold text-white">{Math.min(endIndex, filteredFlags.length)}</span> of <span className="font-semibold text-white">{filteredFlags.length}</span> flags
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-slate-700/50 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition text-sm font-medium"
              >
                ← Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-slate-700/50 hover:bg-slate-700 text-white"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-slate-700/50 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition text-sm font-medium"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Transaction Limits Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-4">Transaction Limits</h2>
          
          {limitsError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
              {limitsError}
            </div>
          )}

          {limitsLoading ? (
            <div className="p-12 text-center bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl">
              <div className="inline-block animate-spin">
                <RefreshCw size={32} className="text-slate-400" />
              </div>
              <p className="text-slate-400 mt-4">Loading transaction limits...</p>
            </div>
          ) : limits.length === 0 ? (
            <div className="p-12 text-center bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl">
              <AlertCircle size={40} className="mx-auto text-slate-400 mb-4" />
              <p className="text-slate-400 text-lg">No transaction limits found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-xl">
                <table className="w-full text-sm text-slate-200">
                  <thead>
                    <tr className="border-b border-slate-700/50 bg-slate-900/50">
                      <th className="px-6 py-4 text-left font-semibold text-slate-300">User ID</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-300">User Name</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-300">Daily Limit</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-300">Monthly Limit</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLimits.map((limit) => {
                      const percentageUsed = limit.used && limit.limit 
                        ? Math.round((limit.used / limit.limit) * 100) 
                        : 0;
                      const limitStatus = getLimitStatus(percentageUsed);
                      
                      return (
                        <tr key={limit.limitId || limit.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition">
                          <td className="px-6 py-4 font-mono text-xs text-blue-300">{limit.userId || limit.userID || "—"}</td>
                          <td className="px-6 py-4 font-semibold text-white">{limit.userName || limit.user || "—"}</td>
                          <td className="px-6 py-4">₹{(limit.dailyLimit || limit.limit || 0).toLocaleString()}</td>
                          <td className="px-6 py-4">₹{(limit.monthlyLimit || 0).toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${limitStatus.badge}`}>
                              {limitStatus.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls for Limits */}
              {limits.length > 0 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-slate-400">
                    Showing <span className="font-semibold text-white">{limitsStartIndex + 1}</span> to <span className="font-semibold text-white">{Math.min(limitsEndIndex, limits.length)}</span> of <span className="font-semibold text-white">{limits.length}</span> limits
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLimitsCurrentPage(p => Math.max(1, p - 1))}
                      disabled={limitsCurrentPage === 1}
                      className="px-3 py-2 bg-slate-700/50 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition text-sm font-medium"
                    >
                      ← Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalLimitsPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setLimitsCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                            limitsCurrentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-slate-700/50 hover:bg-slate-700 text-white"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setLimitsCurrentPage(p => Math.min(totalLimitsPages, p + 1))}
                      disabled={limitsCurrentPage === totalLimitsPages}
                      className="px-3 py-2 bg-slate-700/50 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition text-sm font-medium"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Failed Transaction Flags Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-4">Risk Flags from Failed Transactions</h2>
          
          {failedFlags.length === 0 ? (
            <div className="p-8 bg-slate-800/50 border border-slate-700/50 rounded-lg text-center">
              <p className="text-slate-400">No risk flags from failed transactions detected</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedFailedFlags.map((flag) => (
                  <div 
                    key={flag.FlagID || flag.flagID}
                    className="bg-slate-800/50 border border-red-500/30 rounded-lg p-6 hover:border-red-500/50 transition flex items-start gap-4"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <AlertTriangle size={24} className="text-red-400" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold">{flag.RiskType || flag.riskType}</p>
                      <p className="text-slate-400 text-sm mt-1">Transaction ID: {flag.TransactionID || flag.transactionID}</p>
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <span className="text-slate-400 text-sm">
                          Flag ID: <span className="font-mono text-blue-300">{flag.FlagID || flag.flagID}</span>
                        </span>
                        <span className="text-slate-400 text-sm">
                          {formatDateShort(flag.Created || flag.created)}
                        </span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex-shrink-0 flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(flag.Severity || flag.severity)}`}>
                        {flag.Severity || flag.severity}
                      </span>
                      <RiskScoreBadge
                        riskScore={flag.RiskScore || flag.riskScore}
                        triggerFeatures={flag.TriggerFeatures || flag.triggerFeatures}
                        showDetails={false}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls for Failed Flags */}
              {failedFlags.length > 0 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-slate-400">
                    Showing <span className="font-semibold text-white">{failedFlagsStartIndex + 1}</span> to <span className="font-semibold text-white">{Math.min(failedFlagsEndIndex, failedFlags.length)}</span> of <span className="font-semibold text-white">{failedFlags.length}</span> flags
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFailedFlagsCurrentPage(p => Math.max(1, p - 1))}
                      disabled={failedFlagsCurrentPage === 1}
                      className="px-3 py-2 bg-slate-700/50 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition text-sm font-medium"
                    >
                      ← Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalFailedFlagsPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setFailedFlagsCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                            failedFlagsCurrentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-slate-700/50 hover:bg-slate-700 text-white"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setFailedFlagsCurrentPage(p => Math.min(totalFailedFlagsPages, p + 1))}
                      disabled={failedFlagsCurrentPage === totalFailedFlagsPages}
                      className="px-3 py-2 bg-slate-700/50 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition text-sm font-medium"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

