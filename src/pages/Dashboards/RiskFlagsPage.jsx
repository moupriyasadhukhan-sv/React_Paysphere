import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AlertCircle, RefreshCw, Trash2, Edit2, X, Shield } from "lucide-react";
import { getAllRiskFlags, updateRiskFlag, deleteRiskFlag } from "../../services/risk/riskApi";
import LogoutButton from "../../common/LogoutButton";

/**
 * Risk Flags Management Dashboard
 * Only accessible to users with role = "risk"
 */
export default function RiskFlagsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((s) => s.auth?.role);
  const userId = useSelector((s) => s.auth?.userId);

  // State
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingFlag, setEditingFlag] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Check access
  useEffect(() => {
    if (role !== "risk" && role !== "admin") {
      navigate("/dashboard/user");
    }
  }, [role, navigate]);

  /**
   * Load all risk flags from API
   */
  const loadFlags = async () => {
    console.log("[RiskFlagsPage] Loading risk flags...");
    setLoading(true);
    setError("");
    try {
      const response = await getAllRiskFlags();
      console.log("[RiskFlagsPage] API Response:", response);

      // Handle ApiResponse<T> wrapper from backend
      let data = [];
      if (response?.data) {
        // Response is wrapped in { success, data, message }
        data = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        // Response is direct array
        data = response;
      }

      console.log("[RiskFlagsPage] Processed flags:", data);
      setFlags(data || []);
      setLastRefresh(new Date());
    } catch (err) {
      const errorMsg = 
        err.response?.data?.message || 
        err?.message || 
        "Failed to load risk flags";
      setError(errorMsg);
      console.error("[RiskFlagsPage] Error loading flags:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initial load + Auto-refresh every 30 seconds
   */
  useEffect(() => {
    loadFlags();
    const interval = setInterval(loadFlags, 30000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Filter flags by status - handle case variations
   */
  const filteredFlags = flags.filter((flag) => {
    if (statusFilter === "all") return true;
    const flagStatus = (flag.Status || flag.status || flag.STATUS || "").toLowerCase();
    return flagStatus === statusFilter.toLowerCase();
  });

  /**
   * Get status color
   */
  const getStatusColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "open") return "bg-red-500/20 text-red-300 border-red-500/30";
    if (s === "resolved" || s === "closed") return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    if (s === "pending") return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    return "bg-slate-500/20 text-slate-300 border-slate-500/30";
  };

  /**
   * Get severity color
   */
  const getSeverityColor = (severity) => {
    const s = (severity || "").toUpperCase();
    if (s === "critical") return "bg-red-500/20 text-red-300 border-red-500/30";
    if (s === "high") return "bg-orange-500/20 text-orange-300 border-orange-500/30";
    if (s === "medium") return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    if (s === "low") return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    return "bg-slate-500/20 text-slate-300 border-slate-500/30";
  };

  /**
   * Handle status update
   */
  const handleSaveStatus = async () => {
    if (!editingFlag || !newStatus) return;

    setUpdating(true);
    setError("");
    try {
      const flagId = editingFlag.FlagID || editingFlag.flagID;
      await updateRiskFlag(flagId, { status: newStatus });
      console.log("[RiskFlagsPage] Flag status updated:", flagId);
      setEditingFlag(null);
      setNewStatus("");
      await loadFlags();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update status";
      setError(msg);
      console.error("[RiskFlagsPage] Update error:", err);
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Handle flag deletion
   */
  const handleDelete = async (flagId) => {
    if (!window.confirm("Are you sure you want to delete this risk flag?")) return;

    setError("");
    try {
      await deleteRiskFlag(flagId);
      console.log("[RiskFlagsPage] Flag deleted:", flagId);
      await loadFlags();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to delete flag";
      setError(msg);
      console.error("[RiskFlagsPage] Delete error:", err);
    }
  };

  // Access denied
  if (role && role !== "risk" && role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 max-w-md text-center">
          <Shield size={48} className="mx-auto mb-4 text-red-400" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400 mb-6">Only Risk users can access this dashboard.</p>
          <button
            onClick={() => navigate("/dashboard/user")}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={32} className="text-orange-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Risk Flags</h1>
              <p className="text-slate-400 text-sm mt-1">Monitor and manage flagged accounts</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-slate-300 text-sm">
                <span className="font-semibold text-blue-400">{role}</span> User
              </p>
              <p className="text-slate-500 text-xs">
                Last update: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <p className="text-slate-400 text-sm font-medium">Total Flags</p>
            <p className="text-4xl font-bold text-white mt-3">{flags.length}</p>
            <p className="text-slate-500 text-xs mt-2">All risk flags</p>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
            <p className="text-red-300 text-sm font-medium">Open</p>
            <p className="text-4xl font-bold text-red-300 mt-3">
              {flags.filter(f => (f.Status || f.status || f.STATUS || "").toLowerCase() === "open").length}
            </p>
            <p className="text-red-400/60 text-xs mt-2">Requires action</p>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-6">
            <p className="text-emerald-300 text-sm font-medium">Resolved</p>
            <p className="text-4xl font-bold text-emerald-300 mt-3">
              {flags.filter(f => (f.Status || f.status || "").toLowerCase() === "resolved").length}
            </p>
            <p className="text-emerald-400/60 text-xs mt-2">Handled</p>
          </div>

          <button
            onClick={loadFlags}
            disabled={loading}
            className="bg-blue-600/20 border border-blue-500/30 hover:bg-blue-500/30 rounded-lg p-6 transition flex items-center justify-center gap-2 group"
          >
            <RefreshCw 
              size={24} 
              className={`text-blue-400 group-hover:text-blue-300 ${loading ? "animate-spin" : ""}`}
            />
            <div className="text-left">
              <p className="text-blue-300 text-sm font-medium">Refresh</p>
              <p className="text-blue-400/60 text-xs">Manual update</p>
            </div>
          </button>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>
          <div className="text-sm text-slate-400">
            Showing <span className="font-semibold text-white">{filteredFlags.length}</span> of <span className="font-semibold text-white">{flags.length}</span> flags
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm flex items-start gap-3">
            <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Flags Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin mb-4">
                <RefreshCw size={32} className="text-slate-400" />
              </div>
              <p className="text-slate-400">Loading risk flags...</p>
            </div>
          ) : filteredFlags.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle size={48} className="mx-auto text-slate-400 mb-4" />
              <p className="text-slate-400 text-lg font-medium">No risk flags found</p>
              <p className="text-slate-500 text-sm mt-2">Flags will appear here when suspicious activity is detected</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-900/50">
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Flag ID</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Transaction ID</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Risk Type</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Severity</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {filteredFlags.map((flag, idx) => {
                    const flagID = flag.FlagID || flag.flagID || flag.FlagId;
                    const txID = flag.TransactionID || flag.transactionID || flag.TransactionId;
                    const riskType = flag.RiskType || flag.riskType;
                    const severity = flag.Severity || flag.severity || flag.SEVERITY;
                    const status = flag.Status || flag.status || flag.STATUS;
                    return (
                    <tr key={flagID} className={`border-b border-slate-700/30 transition ${idx % 2 === 0 ? "hover:bg-slate-700/20 bg-slate-800/10" : "hover:bg-slate-700/20 bg-slate-900/20"}`}>
                      <td className="px-6 py-4 font-mono text-xs text-blue-300 font-semibold">
                        #{flagID}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        <span className="bg-slate-900/50 px-3 py-1 rounded text-xs font-mono font-semibold">
                          {txID ? `#${txID}` : "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300 font-medium capitalize">
                          {riskType || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold border ${getSeverityColor(severity)}`}>
                          {severity || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
                          {status || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingFlag(flag);
                              setNewStatus(status || "");
                            }}
                            className="p-2 rounded bg-blue-600/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 hover:text-blue-300 transition"
                            title="Edit status"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(flagID)}
                            className="p-2 rounded bg-red-600/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 hover:text-red-300 transition"
                            title="Delete flag"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Edit Status Modal */}
      {editingFlag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Edit Risk Flag Status</h3>
              <button
                onClick={() => {
                  setEditingFlag(null);
                  setNewStatus("");
                }}
                className="text-slate-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Flag ID</label>
                <p className="text-slate-200 font-mono bg-slate-900/50 px-3 py-2 rounded">
                  {editingFlag.FlagID || editingFlag.flagID}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Risk Type</label>
                <p className="text-slate-200 bg-slate-900/50 px-3 py-2 rounded">
                  {editingFlag.RiskType || editingFlag.riskType}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Current Status</label>
                <p className="text-slate-200 bg-slate-900/50 px-3 py-2 rounded">
                  {editingFlag.Status || editingFlag.status}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Change Status To</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select status...</option>
                  <option value="Open">Open</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Pending">Pending</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setEditingFlag(null);
                    setNewStatus("");
                  }}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium"
                  disabled={updating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveStatus}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!newStatus || updating}
                >
                  {updating ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
