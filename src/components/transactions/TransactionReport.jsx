import { useMemo, useEffect, useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import { useSelector } from "react-redux";
import { getUserWallets } from "../../services/wallets/walletsApi";
import usePrimaryWalletId from "../../hooks/usePrimaryWalletId";

export default function TransactionReport({ data }) {
  const userId = useSelector((s) => s.auth?.userId);
  const role = useSelector((s) => s.auth?.role);
  const merchantId = useSelector((s) => s.auth?.merchantId);
  
  // Get the primary wallet ID for the current user/merchant
  const { walletId: currentWalletId, loading: walletLoading } = usePrimaryWalletId({
    role,
    userId,
    merchantId,
  });

  const [walletBalance, setWalletBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  // Fetch actual wallet balance from API
  useEffect(() => {
    if (!userId) return;

    setBalanceLoading(true);
    getUserWallets(userId)
      .then((wallets) => {
        console.log("[TransactionReport] Wallets:", wallets);
        if (wallets && wallets.length > 0) {
          // Get balance from first wallet (primary wallet)
          const primaryWallet = wallets[0];
          const balance = primaryWallet.balance ?? primaryWallet.Balance ?? 0;
          setWalletBalance(Number(balance).toFixed(2));
          console.log("[TransactionReport] Wallet Balance:", balance);
        } else {
          setWalletBalance("0.00");
        }
      })
      .catch((err) => {
        console.log("[TransactionReport] Failed to fetch wallet balance:", err.message);
        setWalletBalance("0.00");
      })
      .finally(() => setBalanceLoading(false));
  }, [userId]);

  const stats = useMemo(() => {
    if (!data || !data.items || data.items.length === 0) {
      return { sent: 0, received: 0, total: 0, count: 0, sentCount: 0, receivedCount: 0 };
    }

    let sentAmount = 0;
    let receivedAmount = 0;
    let sentCount = 0;
    let receivedCount = 0;
    
    // Detect user's wallet from the most frequent sender in transactions (fallback method)
    const walletFrequency = {};
    data.items.forEach((t) => {
      const fromWallet = String(t.FromWalletID ?? t.fromWalletID ?? t.fromWalletId ?? "").trim();
      if (fromWallet) {
        walletFrequency[fromWallet] = (walletFrequency[fromWallet] || 0) + 1;
      }
    });
    
    // Find the wallet that appears most frequently as sender
    let detectedWallet = currentWalletId;
    if (!detectedWallet && Object.keys(walletFrequency).length > 0) {
      detectedWallet = Object.keys(walletFrequency).reduce((a, b) => 
        walletFrequency[a] > walletFrequency[b] ? a : b
      );
    }
    
    console.log("[TransactionReport] Current Wallet ID:", currentWalletId);
    console.log("[TransactionReport] Detected Wallet ID:", detectedWallet);
    console.log("[TransactionReport] Wallet Frequency:", walletFrequency);
    console.log("[TransactionReport] Data Items:", data.items);
    
    data.items.forEach((t) => {
      const amount = parseFloat(t.Amount ?? t.amount ?? 0);
      const fromWallet = String(t.FromWalletID ?? t.fromWalletID ?? t.fromWalletId ?? "").trim();
      const toWallet = String(t.ToWalletID ?? t.toWalletID ?? t.toWalletId ?? "").trim();
      
      console.log(`[TransactionReport] Tx: from=${fromWallet}, to=${toWallet}, detected=${detectedWallet}, amount=${amount}`);
      
      // If detected wallet is the sender, it's a sent transaction
      if (detectedWallet && fromWallet === detectedWallet) {
        sentAmount += amount;
        sentCount++;
        console.log("[TransactionReport] -> SENT");
      } 
      // If detected wallet is the receiver, it's a received transaction
      else if (detectedWallet && toWallet === detectedWallet) {
        receivedAmount += amount;
        receivedCount++;
        console.log("[TransactionReport] -> RECEIVED");
      }
      // Fallback: if we don't have wallet info
      else if (!detectedWallet) {
        sentAmount += amount;
        sentCount++;
        console.log("[TransactionReport] -> SENT (fallback, no detectedWallet)");
      } else {
        console.log("[TransactionReport] -> NOT MATCHED");
      }
    });

    const totalAmount = sentAmount + receivedAmount;
    
    console.log("[TransactionReport] Final Stats:", { sentAmount, receivedAmount, sentCount, receivedCount });
    
    return {
      sent: sentAmount.toFixed(2),
      received: receivedAmount.toFixed(2),
      total: totalAmount.toFixed(2),
      count: data.items.length,
      sentCount: sentCount,
      receivedCount: receivedCount,
    };
  }, [data, currentWalletId]);

  const sentPercent = stats.total > 0 ? (stats.sent / stats.total) * 100 : 0;
  const receivedPercent = stats.total > 0 ? (stats.received / stats.total) * 100 : 0;

  return (
    <div className="mb-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Sent */}
        <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-600/30 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <TrendingUp size={24} className="text-red-400" />
            </div>
            <span className="text-xs font-semibold text-red-300 bg-red-500/10 px-3 py-1 rounded-full">
              {stats.sentCount} txns
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Total Sent</p>
          <p className="text-3xl font-bold text-red-300">₹{stats.sent}</p>
        </div>

        {/* Total Received */}
        <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border border-emerald-600/30 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <TrendingDown size={24} className="text-emerald-400" />
            </div>
            <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full">
              {stats.receivedCount} txns
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Total Received</p>
          <p className="text-3xl font-bold text-emerald-300">₹{stats.received}</p>
        </div>

        {/* Net Balance */}
        <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-600/30 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <DollarSign size={24} className="text-blue-400" />
            </div>
            <span className="text-xs font-semibold text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full">
              Balance
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Wallet Balance</p>
          <p className="text-3xl font-bold text-blue-300">
            {balanceLoading ? "Loading..." : walletBalance ? `₹${walletBalance}` : "₹0.00"}
          </p>
          <p className="text-xs text-slate-500 mt-2">Current wallet balance</p>
        </div>

        {/* Total Transactions */}
        <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-600/30 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <PieChart size={24} className="text-purple-400" />
            </div>
            <span className="text-xs font-semibold text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full">
              Total
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-1">All Transactions</p>
          <p className="text-3xl font-bold text-purple-300">{stats.count}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <PieChart size={20} className="text-teal-400" />
            Transaction Distribution
          </h3>

          <div className="flex items-center justify-center mb-6">
            <svg className="w-48 h-48" viewBox="0 0 120 120">
              {/* Sent Arc */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="#ef4444"
                strokeWidth="12"
                strokeDasharray={`${(sentPercent / 100) * 283} 283`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
              {/* Received Arc */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="#10b981"
                strokeWidth="12"
                strokeDasharray={`${(receivedPercent / 100) * 283} 283`}
                strokeLinecap="round"
                transform={`rotate(${sentPercent - 90} 60 60)`}
              />
              {/* Center Text */}
              <text
                x="60"
                y="55"
                textAnchor="middle"
                fontSize="16"
                fontWeight="bold"
                fill="#f8f8f8"
              >
                {sentPercent.toFixed(0)}%
              </text>
              <text x="60" y="70" textAnchor="middle" fontSize="10" fill="#9ca3af">
                Sent
              </text>
            </svg>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg border border-slate-600/20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <span className="text-slate-300">Sent</span>
              </div>
              <span className="font-semibold text-red-300">{sentPercent.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg border border-slate-600/20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span className="text-slate-300">Received</span>
              </div>
              <span className="font-semibold text-emerald-300">{receivedPercent.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-teal-400" />
            Amount Comparison
          </h3>

          <div className="space-y-6">
            {/* Sent Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 font-medium">Money Sent</span>
                <span className="text-red-300 font-bold">₹{stats.sent}</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-slate-600/30">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.sent / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Received Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 font-medium">Money Received</span>
                <span className="text-emerald-300 font-bold">₹{stats.received}</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-slate-600/30">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.received / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Total Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 font-medium">Total Flow</span>
                <span className="text-purple-300 font-bold">₹{stats.total}</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-slate-600/30">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-400 h-full rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-8 pt-6 border-t border-slate-600/30">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-slate-900/30 rounded-lg">
                <p className="text-slate-400 text-xs mb-1">Avg. Sent</p>
                <p className="font-bold text-red-300">
                  ₹{stats.sentCount > 0 ? (stats.sent / stats.sentCount).toFixed(0) : "0"}
                </p>
              </div>
              <div className="p-3 bg-slate-900/30 rounded-lg">
                <p className="text-slate-400 text-xs mb-1">Avg. Received</p>
                <p className="font-bold text-emerald-300">
                  ₹{stats.receivedCount > 0 ? (stats.received / stats.receivedCount).toFixed(0) : "0"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
