import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LogoutButton from "../../common/LogoutButton";
import { getAllRiskFlags, updateRiskFlag, deleteRiskFlag } from "../../services/risk/riskApi";
import { AlertCircle, RefreshCw, Trash2, Edit2, X } from "lucide-react";


/**
 * Risk Dashboard - Displays and manages risk flags created from transaction failures
 */
export default function RiskDashboard() {
  const role = useSelector((s) => s.auth?.role);
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingFlag, setEditingFlag] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  /**
   * Load all risk flags from the backend
   */
  async function loadFlags() {
    setLoading(true);
    setError("");
    try {
      const response = await getAllRiskFlags();
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

  useEffect(() => {
    loadFlags();
    
    // Auto-refresh flags every 30 seconds for real-time updates
    const interval = setInterval(loadFlags, 30000);
    
    return () => clearInterval(interval);
  }, []);

  /**
   * Filter flags based on status
   */
  const filteredFlags = flags.filter((flag) => {
    if (statusFilter === "all") return true;
    const flagStatus = (flag.Status || flag.status || "").toLowerCase();
    return flagStatus === statusFilter.toLowerCase();
  });

  /**
   * Handle status update
   */
  async function handleSaveStatus() {
    if (!editingFlag || !newStatus) return;

    setUpdating(true);
    setError("");
    try {
      const flagId = editingFlag.FlagID || editingFlag.flagID;
      const response = await updateRiskFlag(flagId, { status: newStatus });
      console.log("[RiskDashboard] Flag updated:", response);
      
      setEditingFlag(null);
      setNewStatus("");
      await loadFlags();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to update status";
      setError(msg);
      console.error("[RiskDashboard] Update error:", err);
    } finally {
      setUpdating(false);
    }
  }

  /**
   * Handle flag deletion
   */
  async function handleDelete(flagId) {
    if (!window.confirm("Are you sure you want to delete this risk flag?")) return;

    setError("");
    try {
      await deleteRiskFlag(flagId);
      console.log("[RiskDashboard] Flag deleted:", flagId);
      await loadFlags();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to delete flag";
      setError(msg);
      console.error("[RiskDashboard] Delete error:", err);
    }
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Risk Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Monitor and manage risk flags</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm font-medium">Total Flags</p>
            <p className="text-3xl font-bold text-white mt-2">{flags.length}</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-300 text-sm font-medium">Open</p>
            <p className="text-3xl font-bold text-red-300 mt-2">
              {flags.filter(f => (f.Status || f.status || "").toLowerCase() === "open").length}
            </p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
            <p className="text-emerald-300 text-sm font-medium">Resolved</p>
            <p className="text-3xl font-bold text-emerald-300 mt-2">
              {flags.filter(f => (f.Status || f.status || "").toLowerCase() === "resolved").length}
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <button
              onClick={loadFlags}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>
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
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Description</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Created</th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFlags.map((flag) => (
                    <tr key={flag.FlagID || flag.flagID} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition">
                      <td className="px-6 py-4 font-mono text-xs text-blue-300">{flag.FlagID || flag.flagID}</td>
                      <td className="px-6 py-4">{flag.RiskType || flag.riskType || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(flag.Severity || flag.severity)}`}>
                          {flag.Severity || flag.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(flag.Status || flag.status)}`}>
                          {flag.Status || flag.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-300 max-w-xs truncate" title={flag.Description || flag.description}>
                        {flag.Description || flag.description || "—"}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {flag.CreatedAt || flag.createdAt ? new Date(flag.CreatedAt || flag.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingFlag(flag);
                              setNewStatus(flag.Status || flag.status || "");
                            }}
                            className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 transition"
                            title="Edit Status"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(flag.FlagID || flag.flagID)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 transition"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Edit Status Modal */}
      {editingFlag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
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
                <p className="text-slate-200 font-mono">{editingFlag.FlagID || editingFlag.flagID}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Risk Type</label>
                <p className="text-slate-200">{editingFlag.RiskType || editingFlag.riskType}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Current Status</label>
                <p className="text-slate-200">{editingFlag.Status || editingFlag.status}</p>
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