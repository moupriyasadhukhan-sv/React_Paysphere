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
    
    // Detect user's wallet from the most frequent sender in COMPLETED transactions (fallback method)
    const walletFrequency = {};
    data.items.forEach((t) => {
      const status = String(t.Status ?? t.status ?? "").toLowerCase();
      const fromWallet = String(t.FromWalletID ?? t.fromWalletID ?? t.fromWalletId ?? "").trim();
      // Only count completed transactions for frequency detection
      if (fromWallet && status.includes("completed")) {
        walletFrequency[fromWallet] = (walletFrequency[fromWallet] || 0) + 1;
      }
    });
    
    // Find the wallet that appears most frequently as sender in completed transactions
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
    
    // Only process COMPLETED transactions for sent/received calculations
    data.items.forEach((t) => {
      const status = String(t.Status ?? t.status ?? "").toLowerCase();
      
      // Skip if not completed
      if (!status.includes("completed")) {
        console.log(`[TransactionReport] Skipping non-completed transaction: status=${status}`);
        return;
      }
      
      const amount = parseFloat(t.Amount ?? t.amount ?? 0);
      const fromWallet = String(t.FromWalletID ?? t.fromWalletID ?? t.fromWalletId ?? "").trim();
      const toWallet = String(t.ToWalletID ?? t.toWalletID ?? t.toWalletId ?? "").trim();
      
      console.log(`[TransactionReport] Tx: from=${fromWallet}, to=${toWallet}, status=${status}, detected=${detectedWallet}, amount=${amount}`);
      
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
}
