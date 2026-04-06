// // src/pages/dashboards/OpsDashboard.jsx
// import LogoutButton from "../../common/LogoutButton";
// import { useAuth } from "../../context/AuthContext";

// export default function OpsDashboard() {
//   const { auth } = useAuth();
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="w-full px-6 py-3 bg-white border-b flex items-center justify-between">
//         <h1 className="text-lg font-semibold">Ops Dashboard</h1>
//         <div className="flex items-center gap-4">
//           <span className="text-sm text-gray-600">Role: {auth.role}</span>
//           <LogoutButton />
//         </div>
//       </header>
//       <main className="p-6">Ops content…</main>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LogoutButton from "../../common/LogoutButton";
import { getAllTransactions } from "../../services/transactions/transactionsApi";
import { BarChart3, TrendingDown, AlertTriangle, CheckCircle, RefreshCw, Edit2, X } from "lucide-react";

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  const config =
    s === "completed" ? { bg: "bg-emerald-500/20", text: "text-emerald-300", border: "border-emerald-500/30" } :
    s === "failed" ? { bg: "bg-red-500/20", text: "text-red-300", border: "border-red-500/30" } :
    s === "pending" ? { bg: "bg-yellow-500/20", text: "text-yellow-300", border: "border-yellow-500/30" } :
    s === "initiated" ? { bg: "bg-blue-500/20", text: "text-blue-300", border: "border-blue-500/30" } :
    { bg: "bg-slate-500/20", text: "text-slate-300", border: "border-slate-500/30" };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
      {status}
    </span>
  );
}

function TypeBadge({ type }) {
  const t = (type || "").toUpperCase();
  const config =
    t === "P2P" ? { bg: "bg-purple-500/20", text: "text-purple-300" } :
    t === "P2M" ? { bg: "bg-cyan-500/20", text: "text-cyan-300" } :
    t === "REFUND" ? { bg: "bg-orange-500/20", text: "text-orange-300" } :
    { bg: "bg-slate-500/20", text: "text-slate-300" };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
      {type}
    </span>
  );
}

export default function OpsDashboard() {
  const role = useSelector((s) => s.auth?.role);
  const userId = useSelector((s) => s.auth?.userId);
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingTxn, setEditingTxn] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const pageSize = 25;

  async function loadTransactions() {
    setLoading(true);
    setError("");
    try {
      const res = await getAllTransactions({
        page,
        pageSize,
        status: statusFilter === "all" ? null : statusFilter,
        sortBy: "date",
      });
      
      console.log("[OpsDashboard] Loaded transactions:", res);
      setTransactions(Array.isArray(res?.items) ? res.items : []);
      setTotal(res?.total || 0);
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to load transactions";
      setError(msg);
      console.error("[OpsDashboard] Error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveStatus() {
    if (!editingTxn || !newStatus) return;
    
    setUpdating(true);
    setError("");
    try {
      // Note: This would require an endpoint to update transaction status
      // For now, we'll just show a success message
      console.log("[OpsDashboard] Updating transaction", editingTxn.TransactionID || editingTxn.transactionID, "to status", newStatus);
      
      // Call API endpoint when available
      // await updateTransactionStatus(editingTxn.TransactionID || editingTxn.transactionID, newStatus);
      
      setEditingTxn(null);
      setNewStatus("");
      // await loadTransactions();
      alert("Status update functionality requires backend API endpoint");
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  }

  useEffect(() => {
    setPage(1); // Reset to page 1 when filter changes
    loadTransactions();
  }, [statusFilter]);

  useEffect(() => {
    loadTransactions();
  }, [page]);

  // Calculate stats from all loaded transactions
  const stats = {
    total: total,
    completed: transactions.filter(t => (t.Status || t.status || "").toLowerCase() === "completed").length,
    failed: transactions.filter(t => (t.Status || t.status || "").toLowerCase() === "failed").length,
    pending: transactions.filter(t => (t.Status || t.status || "").toLowerCase() === "pending").length,
    successRate: transactions.length > 0 
      ? ((transactions.filter(t => (t.Status || t.status || "").toLowerCase() === "completed").length / transactions.length) * 100).toFixed(1)
      : 0,
  };

  const totalPages = Math.ceil((total || 0) / pageSize);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="w-full px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/50 flex items-center justify-between sticky top-0 z-40">
        <div>
          <h1 className="text-2xl font-bold text-white">Operations Dashboard</h1>
          <p className="text-slate-400 text-sm">Monitor transactions, failures, and reconciliation</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">Role: <span className="text-blue-300 font-semibold">{role}</span></span>
          <LogoutButton />
        </div>
      </header>

      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <p className="text-slate-400 text-sm mb-2">Total Transactions</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-emerald-900/20 backdrop-blur-sm border border-emerald-700/30 rounded-xl p-6">
            <p className="text-emerald-300 text-sm mb-2">Completed</p>
            <p className="text-3xl font-bold text-emerald-300">{stats.completed}</p>
          </div>
          <div className="bg-red-900/20 backdrop-blur-sm border border-red-700/30 rounded-xl p-6">
            <p className="text-red-300 text-sm mb-2">Failed</p>
            <p className="text-3xl font-bold text-red-300">{stats.failed}</p>
          </div>
          <div className="bg-yellow-900/20 backdrop-blur-sm border border-yellow-700/30 rounded-xl p-6">
            <p className="text-yellow-300 text-sm mb-2">Pending</p>
            <p className="text-3xl font-bold text-yellow-300">{stats.pending}</p>
          </div>
          <div className="bg-blue-900/20 backdrop-blur-sm border border-blue-700/30 rounded-xl p-6">
            <p className="text-blue-300 text-sm mb-2">Success Rate</p>
            <p className="text-3xl font-bold text-blue-300">{stats.successRate}%</p>
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
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
            <option value="Pending">Pending</option>
            <option value="Initiated">Initiated</option>
          </select>
          <button
            onClick={loadTransactions}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2 transition"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Transactions Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden shadow-xl mb-6">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-slate-400">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center">
              <BarChart3 size={32} className="mx-auto text-slate-400 mb-3" />
              <p className="text-slate-400">No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-200">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-900/50">
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Transaction ID</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Type</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Status</th>
                    <th className="px-6 py-4 text-right font-semibold text-slate-300">Amount</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">From</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">To</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Date</th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn.TransactionID || txn.transactionID} className="border-b border-slate-700/30 hover:bg-slate-700/30 transition">
                      <td className="px-6 py-4 font-mono text-xs text-blue-300">{txn.TransactionID || txn.transactionID || "—"}</td>
                      <td className="px-6 py-4">
                        <TypeBadge type={txn.TransactionType || txn.transactionType} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={txn.Status || txn.status} />
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-100">
                        ₹{parseFloat(txn.Amount || txn.amount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-400">{txn.FromWalletID || txn.fromWalletID || "—"}</td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-400">{txn.ToWalletID || txn.toWalletID || "—"}</td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {txn.CreatedAt || txn.createdAt ? new Date(txn.CreatedAt || txn.createdAt).toLocaleString() : "—"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setEditingTxn(txn);
                            setNewStatus(txn.Status || txn.status || "");
                          }}
                          className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 transition"
                          title="Edit Status"
                        >
                          <Edit2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white disabled:opacity-30 hover:bg-white/10 transition"
            >
              Previous
            </button>
            <span className="text-slate-400 text-sm">
              Page <span className="text-white font-medium">{page}</span> / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white disabled:opacity-30 hover:bg-white/10 transition"
            >
              Next
            </button>
          </div>
        )}

        {/* Edit Status Modal */}
        {editingTxn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-6 w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Edit Transaction Status</h3>
                <button
                  onClick={() => {
                    setEditingTxn(null);
                    setNewStatus("");
                  }}
                  className="p-1 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Transaction Info */}
              <div className="mb-4 space-y-2">
                <p className="text-sm text-slate-400">
                  <span className="font-semibold text-slate-300">Transaction ID:</span> {editingTxn.TransactionID || editingTxn.transactionID}
                </p>
                <p className="text-sm text-slate-400">
                  <span className="font-semibold text-slate-300">Type:</span> {editingTxn.TransactionType || editingTxn.transactionType}
                </p>
                <p className="text-sm text-slate-400">
                  <span className="font-semibold text-slate-300">Amount:</span> ₹{parseFloat(editingTxn.Amount || editingTxn.amount || 0).toFixed(2)}
                </p>
              </div>

              {/* Current Status */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Current Status</label>
                <div className="px-4 py-2 bg-slate-700/30 rounded-lg text-slate-200 text-sm border border-slate-600/30">
                  {editingTxn.Status || editingTxn.status}
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
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                  <option value="Pending">Pending</option>
                  <option value="Initiated">Initiated</option>
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
                    setEditingTxn(null);
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