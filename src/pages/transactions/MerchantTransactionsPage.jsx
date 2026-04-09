import React, { useState, useEffect, useContext, useRef } from "react";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { Search, IndianRupeeIcon } from "lucide-react";
import { MotionCard, MotionStatCard } from "../../components/merchant/MotionComponents";
import { showMerchantSuccess, showMerchantError, showMerchantLoading, dismissMerchantToast } from "../../utils/merchantToast.jsx";
import { getMerchantTransactions } from "../../services/merchantApi";
import { jwtDecode } from "jwt-decode";
import {useAuth} from "../../context/AuthContext.jsx"
/**
 * MERCHANT TRANSACTION HISTORY PAGE
 * Shows all transactions received by the merchant fetched from backend
 */
export default function MerchantTransactionsPage({ merchantId: propMerchantId } = {}) {
  const authContext = useContext(useAuth);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isInitialMount = useRef(true);

  // Get merchant ID from props, context, or JWT token
  const getMerchantId = () => {
    if (propMerchantId) return propMerchantId;
    
    try {
      const token = authContext?.auth?.token || localStorage.getItem("ps_token");
      if (token) {
        const decoded = jwtDecode(token);
        return decoded.merchantId || decoded.sub || 1;
      }
    } catch (err) {
      console.error("Error decoding token:", err);
    }
    
    return 1; // Default merchant ID
  };

  // Calculate statistics
  const stats = {
    total: transactions.length,
    totalAmount: transactions
      .filter((t) => {
        const s = t.status?.toLowerCase().trim();
        return s === "success" || s === "completed" || s === "approved";
      })
      .reduce((sum, t) => sum + (t.amount || 0), 0),
  };

  // Fetch transactions on mount
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      
      // Only show toast if NOT initial mount (prevents duplicate toasts in StrictMode)
      const shouldShowToast = !isInitialMount.current;
      let loadingToastId = null;
      
      if (shouldShowToast) {
        loadingToastId = showMerchantLoading("Loading transactions...");
      }
      
      try {
        const mId = getMerchantId();
        console.log("Fetching transactions for merchant ID:", mId);
        const response = await getMerchantTransactions(mId);
        
        // Handle different response formats
        let transformedData = [];
        
        if (Array.isArray(response)) {
          transformedData = response;
        } else if (response?.data && Array.isArray(response.data)) {
          transformedData = response.data;
        } else if (response?.items && Array.isArray(response.items)) {
          transformedData = response.items;
        } else if (response?.transactions && Array.isArray(response.transactions)) {
          transformedData = response.transactions;
        } else {
          // Single object or unexpected format
          transformedData = response ? [response] : [];
        }
        
        // Map backend transaction fields to component expectations
        transformedData = transformedData.map((txn) => {
          // 1. Capture the real ID regardless of backend casing
          const realId = txn.transactionID || txn.transactionId || txn.TransactionId || txn.Id || txn.id || "ID_MISSING";
          
          return {
            id: realId,
            transactionId: realId,
            customerName: txn.senderName || txn.customerName || txn.SenderName || txn.CustomerName || "Unknown",
            customerId: txn.senderId || txn.customerId || txn.SenderId || "N/A",
            amount: parseFloat(txn.amount || txn.Amount || 0),
            method: txn.paymentMethod || txn.method || txn.PaymentMethod || "N/A",
            date: txn.transactionDate ? new Date(txn.transactionDate).toLocaleDateString() : (txn.date || "N/A"),
            time: txn.transactionDate ? new Date(txn.transactionDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : (txn.time || "N/A"),
            status: txn.status || txn.Status || "pending",
          };
        });
        
        console.log("Transformed transactions:", transformedData);
        setTransactions(transformedData);
        setFilteredTransactions(transformedData);
        
        // Dismiss loading toast and show success only if we showed loading
        if (shouldShowToast) {
          dismissMerchantToast(loadingToastId);
          if (transformedData.length > 0) {
            showMerchantSuccess(`Loaded ${transformedData.length} transactions ✓`, 2500);
          } else {
            showMerchantSuccess("No transactions found", 2500);
          }
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError(err.message || "Failed to load transactions");
        if (shouldShowToast) {
          dismissMerchantToast(loadingToastId);
          showMerchantError("Failed to load transactions. Please try again.", 3000);
        }
      } finally {
        setLoading(false);
        isInitialMount.current = false;
      }
    };

    fetchTransactions();
  }, [propMerchantId]);

  // Update filtering whenever transactions, searchTerm, or statusFilter change
  useEffect(() => {
    filterTransactions();
  }, [searchTerm, statusFilter, transactions]);

  const filterTransactions = () => {
    let filtered = transactions;

    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status?.toLowerCase().trim() === statusFilter.toLowerCase().trim());
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          (t.id?.toLowerCase().includes(term)) ||
          (t.customerName?.toLowerCase().includes(term)) ||
          (t.customerId?.toLowerCase().includes(term)) ||
          (t.transactionId?.toLowerCase().includes(term))
      );
    }

    setFilteredTransactions(filtered);
  };

  const getStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase().trim() || "";
    
    // Check for success or completed
    if (normalizedStatus === "success" || normalizedStatus === "completed" || normalizedStatus === "approved") {
      return "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20";
    }
    // Check for pending or processing
    if (normalizedStatus === "pending" || normalizedStatus === "processing") {
      return "text-amber-400 bg-amber-500/10 border border-amber-500/20";
    }
    // Check for failed, declined, or cancelled
    if (normalizedStatus === "failed" || normalizedStatus === "declined" || normalizedStatus === "cancelled") {
      return "text-red-400 bg-red-500/10 border border-red-500/20";
    }
    
    // Default fallback
    return "text-slate-400 bg-slate-500/10 border border-slate-500/20";
  };

  const getStatusIcon = (status) => {
    const normalizedStatus = status?.toLowerCase().trim() || "";
    
    if (normalizedStatus === "success" || normalizedStatus === "completed" || normalizedStatus === "approved") {
      return "✓";
    }
    if (normalizedStatus === "pending" || normalizedStatus === "processing") {
      return "⏳";
    }
    if (normalizedStatus === "failed" || normalizedStatus === "declined" || normalizedStatus === "cancelled") {
      return "✕";
    }
    
    return "•";
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen p-6 md:p-8">
      {/* <Toaster position="top-right" toastOptions={{ style: { background: "transparent", boxShadow: "none", padding: 0 } }} /> */}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-8">
        {/* Loading State */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-slate-600 border-t-emerald-500 animate-spin" />
              <p className="text-slate-400 font-medium">Loading transactions...</p>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 font-semibold">Error: {error}</p>
            <p className="text-red-300/70 text-sm mt-2">Failed to load merchant transactions. Please try again later.</p>
          </motion.div>
        )}

        {/* Content */}
        {!loading && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white">Transactions</h1>
              <p className="text-slate-400 mt-2">View and manage all your transactions</p>
            </div>
          </div>
        </motion.div>
        )}

        {/* Statistics Cards */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <MotionStatCard
            icon={IndianRupeeIcon}
            label="Total Transactions"
            value={stats.total}
            trend="up"
            trendValue={12}
            color="emerald"
          />
        </motion.div>

        {/* Filters & Search */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-4">
          <div className="flex gap-4 items-center flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-64 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by ID, Name, or Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {["all"].map((status) => (
                <motion.button
                  key={status}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    statusFilter === status
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                      : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Transactions Table */}
        <MotionCard title={`Transactions (${filteredTransactions.length})`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-slate-300">Transaction ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-300">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-300">Date & Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((txn, idx) => (
                  <motion.tr
                    key={txn.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono text-emerald-400">{txn.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-cyan-400">₹{txn.amount.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-slate-300">{txn.date}</p>
                        <p className="text-xs text-slate-500">{txn.time}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(txn.status)}`}>
                        <span>{getStatusIcon(txn.status)}</span>
                        {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {filteredTransactions.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <p className="text-slate-400">No transactions found</p>
              </motion.div>
            )}
          </div>
        </MotionCard>
      </motion.div>
    </div>
  );
}