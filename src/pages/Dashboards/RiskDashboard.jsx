// // src/pages/dashboards/RiskDashboard.jsx
// import LogoutButton from "../../common/LogoutButton";
// import { useAuth } from "../../context/AuthContext";

// export default function RiskDashboard() {
//   const { auth } = useAuth();
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="w-full px-6 py-3 bg-white border-b flex items-center justify-between">
//         <h1 className="text-lg font-semibold">Risk Dashboard</h1>
//         <div className="flex items-center gap-4">
//           <span className="text-sm text-gray-600">Role: {auth.role}</span>
//           <LogoutButton />
//         </div>
//       </header>
//       <main className="p-6">Risk content…</main>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LogoutButton from "../../common/LogoutButton";
import { getAllRiskFlags, updateRiskFlag, deleteRiskFlag } from "../../services/risk/riskApi";
import { AlertCircle, TrendingUp, CheckCircle, XCircle, Trash2, Edit2, X } from "lucide-react";

function SeverityBadge({ severity }) {
  const s = (severity || "").toUpperCase();
  const config =
    s === "CRITICAL" ? { bg: "bg-red-500/20", text: "text-red-300", border: "border-red-500/30" } :
    s === "HIGH" ? { bg: "bg-orange-500/20", text: "text-orange-300", border: "border-orange-500/30" } :
    s === "MEDIUM" ? { bg: "bg-yellow-500/20", text: "text-yellow-300", border: "border-yellow-500/30" } :
    s === "LOW" ? { bg: "bg-blue-500/20", text: "text-blue-300", border: "border-blue-500/30" } :
    { bg: "bg-slate-500/20", text: "text-slate-300", border: "border-slate-500/30" };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
      {severity}
    </span>
  );
}

function StatusBadge({ status }) {
  const st = (status || "").toLowerCase();
  const config =
    st === "active" || st === "open" ? { bg: "bg-red-500/20", text: "text-red-300", icon: AlertCircle } :
    st === "resolved" || st === "closed" ? { bg: "bg-emerald-500/20", text: "text-emerald-300", icon: CheckCircle } :
    { bg: "bg-slate-500/20", text: "text-slate-300", icon: TrendingUp };

  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <Icon size={14} />
      {status}
    </span>
  );
}

export default function RiskDashboard() {
  const role = useSelector((s) => s.auth?.role);
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingFlag, setEditingFlag] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  async function loadFlags() {
    setLoading(true);
    setError("");
    try {
      const data = await getAllRiskFlags();
      setFlags(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to load risk flags";
      setError(msg);
      console.error("[RiskDashboard] Error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFlags();
  }, []);

  async function handleUpdateStatus(flagId, newStatus) {
    try {
      await updateRiskFlag(flagId, { status: newStatus });
      await loadFlags();
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Failed to update flag");
    }
  }

  async function handleSaveStatus() {
    if (!editingFlag || !newStatus) return;
    
    setUpdating(true);
    setError("");
    try {
      await updateRiskFlag(editingFlag.FlagID || editingFlag.flagID, { status: newStatus });
      setEditingFlag(null);
      setNewStatus("");
      await loadFlags();
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete(flagId) {
    if (!window.confirm("Are you sure you want to delete this flag?")) return;
    try {
      await deleteRiskFlag(flagId);
      await loadFlags();
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Failed to delete flag");
    }
  }

  const filteredFlags = statusFilter === "all" 
    ? flags 
    : flags.filter(f => (f.Status || f.status || "").toLowerCase() === statusFilter.toLowerCase());

  const stats = {
    total: flags.length,
    critical: flags.filter(f => (f.Severity || f.severity || "").toUpperCase() === "CRITICAL").length,
    active: flags.filter(f => (f.Status || f.status || "").toLowerCase() === "active").length,
    resolved: flags.filter(f => (f.Status || f.status || "").toLowerCase() === "resolved").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="w-full px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/50 flex items-center justify-between sticky top-0 z-40">
        <div>
          <h1 className="text-2xl font-bold text-white">Risk Dashboard</h1>
          <p className="text-slate-400 text-sm">Monitor and manage risk flags</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">Role: <span className="text-blue-300 font-semibold">{role}</span></span>
          <LogoutButton />
        </div>
      </header>

      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <p className="text-slate-400 text-sm mb-2">Total Flags</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-red-900/20 backdrop-blur-sm border border-red-700/30 rounded-xl p-6">
            <p className="text-red-300 text-sm mb-2">Critical</p>
            <p className="text-3xl font-bold text-red-300">{stats.critical}</p>
          </div>
          <div className="bg-yellow-900/20 backdrop-blur-sm border border-yellow-700/30 rounded-xl p-6">
            <p className="text-yellow-300 text-sm mb-2">Active</p>
            <p className="text-3xl font-bold text-yellow-300">{stats.active}</p>
          </div>
          <div className="bg-emerald-900/20 backdrop-blur-sm border border-emerald-700/30 rounded-xl p-6">
            <p className="text-emerald-300 text-sm mb-2">Resolved</p>
            <p className="text-3xl font-bold text-emerald-300">{stats.resolved}</p>
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
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
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
            <div className="p-8 text-center">
              <p className="text-slate-400">Loading risk flags...</p>
            </div>
          ) : filteredFlags.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle size={32} className="mx-auto text-slate-400 mb-3" />
              <p className="text-slate-400">No risk flags found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-200">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-900/50">
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">ID</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Transaction</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Risk Type</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Severity</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Created At</th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFlags.map((flag) => (
                    <tr key={flag.FlagID || flag.flagID} className="border-b border-slate-700/30 hover:bg-slate-700/30 transition">
                      <td className="px-6 py-4">{flag.FlagID || flag.flagID || "—"}</td>
                      <td className="px-6 py-4 font-mono text-xs text-blue-300">{flag.TransactionID || flag.transactionID || "—"}</td>
                      <td className="px-6 py-4">{flag.RiskType || flag.riskType || "—"}</td>
                      <td className="px-6 py-4">
                        <SeverityBadge severity={flag.Severity || flag.severity} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={flag.Status || flag.status} />
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {flag.CreatedAt || flag.createdAt ? new Date(flag.CreatedAt || flag.createdAt).toLocaleString() : "—"}
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

        {/* Edit Status Modal */}
        {editingFlag && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-6 w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Edit Risk Flag Status</h3>
                <button
                  onClick={() => {
                    setEditingFlag(null);
                    setNewStatus("");
                  }}
                  className="p-1 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Flag Info */}
              <div className="mb-4 space-y-2">
                <p className="text-sm text-slate-400">
                  <span className="font-semibold text-slate-300">Flag ID:</span> {editingFlag.FlagID || editingFlag.flagID}
                </p>
                <p className="text-sm text-slate-400">
                  <span className="font-semibold text-slate-300">Risk Type:</span> {editingFlag.RiskType || editingFlag.riskType}
                </p>
                <p className="text-sm text-slate-400">
                  <span className="font-semibold text-slate-300">Severity:</span> {editingFlag.Severity || editingFlag.severity}
                </p>
              </div>

              {/* Current Status */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Current Status</label>
                <div className="px-4 py-2 bg-slate-700/30 rounded-lg text-slate-200 text-sm border border-slate-600/30">
                  {editingFlag.Status || editingFlag.status}
                </div>
              </div>

              {/* New Status Dropdown */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Change To</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="">Select Status...</option>
                  <option value="Active">Active</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Pending">Pending</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditingFlag(null);
                    setNewStatus("");
                  }}
                  disabled={updating}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-600 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-medium transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveStatus}
                  disabled={updating || !newStatus}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}