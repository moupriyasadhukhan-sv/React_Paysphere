import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createP2P } from "../../../services/transactions/transactionsApi";
import { Send, Lock, Wallet, Phone, DollarSign } from "lucide-react";
// import { addNotification, initializeNotifications } from "../../../stores/notificationsSlice";
import { useRateLimit } from "../../../hooks/useRateLimit";
import { useFailureTracking } from "../../../hooks/useFailureTracking";
import { LoadingSpinner, TransactionResult, RateLimitWarning } from "../TransactionResult";
import { RiskFlagAlert } from "../RiskFlagAlert";
import { logRiskEvent } from "../../../services/risk/riskApi";
import { walletService } from "../../../services/walletService";
// import { notifyP2PReceivedByWallet } from "../../../services/notifications/paymentReceivedNotificationsApi";
// import { pollReceiverNotifications } from "../../../services/notifications/notificationsApi";

const digitsOnly = (v) => (v || "").replace(/\D+/g, "");

export default function P2PForm({ onCompleted }) {
  const dispatch = useDispatch();
  const resolvedWallet = useSelector((s) => s.auth?.walletId);
  const rateLimit = useRateLimit(5, 60000); // 5 transactions per minute
  const failureTracker = useFailureTracking();

  const [toWalletID, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);

  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [result, setResult] = useState(null); // { type: 'success'|'error', title, message, details }

  // Fetch wallet balance on component mount and check for retry data
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const walletData = await walletService.getWalletBalance();
        const balance = walletData?.balance ?? walletData?.walletBalance ?? walletData?.Balance ?? 0;
        setWalletBalance(Number(balance));
      } catch (error) {
        console.error("[P2PForm] Failed to fetch wallet balance:", error);
        setWalletBalance(0);
      } finally {
        setBalanceLoading(false);
      }
    };
    
    const loadRetryData = () => {
      const retryData = sessionStorage.getItem("retryTransaction");
      if (retryData) {
        try {
          const data = JSON.parse(retryData);
          setTo(String(data.toWallet ?? ""));
          setAmount(String(data.amount ?? ""));
          setPhone(String(data.phone ?? ""));
          // Clear the retry data after loading
          sessionStorage.removeItem("retryTransaction");
        } catch (error) {
          console.error("[P2PForm] Failed to load retry data:", error);
        }
      }
    };
    
    fetchBalance();
    loadRetryData();
  }, []);

  const toWalletNum = Number(toWalletID);
  const amountNum = Number(amount);
  const phoneDigits = digitsOnly(phone);
  
  const canSubmit =
    toWalletNum > 0 &&
    amountNum > 0 &&
    phoneDigits.length >= 10 &&
    rateLimit.canRequest;

  const getValidationError = () => {
    if (!toWalletID) return "Recipient Wallet ID is required";
    if (toWalletNum <= 0) return "Wallet ID must be greater than 0";
    if (!amount) return "Amount is required";
    if (amountNum <= 0) return "Amount must be greater than 0";
    if (!phone) return "Phone number is required";
    if (phoneDigits.length < 10) return `Phone number must be at least 10 digits (${phoneDigits.length}/10)`;
    return null;
  };

  const getSimulatedDelay = () => {
    // Simulate 3-5 second processing time
    return Math.random() * 2000 + 3000; // 3000-5000ms
  };

  async function submit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setMsg("");
    setErr("");
    setLoading(true);

    try {
      // Show loading for 3-5 seconds
      await new Promise(resolve => setTimeout(resolve, getSimulatedDelay()));

      const res = await createP2P({
        toWalletID: toWalletNum,
        amount: amountNum,
        currency: "INR",
        phoneNumber: phoneDigits,
      });

      setLoading(false);

      // Show success result
      setResult({
        type: "success",
        title: "Transfer Successful! 🎉",
        message: `Successfully sent ₹${amountNum} to wallet ${toWalletNum}`,
        details: [
          `Status: Completed`,
          "Transaction secured with 256-bit encryption",
        ],
      });

      // Add notification for sender
      // dispatch(addNotification({
      //   title: "P2P Transfer Successful ✓",
      //   message: `Sent ₹${amountNum} to wallet ${toWalletNum}`,
      //   icon: "💸",
      //   timestamp: new Date().toISOString()
      // }));
      
      // Send notification to receiver that they received money
      try {
        console.log("[P2PForm] Sending P2P received notification. Sender Wallet:", resolvedWallet, "Receiver Wallet:", toWalletNum);
        
        await notifyP2PReceivedByWallet({
          senderWalletId: resolvedWallet,
          receiverWalletId: toWalletNum,
          amount: amountNum,
          transactionId: res?.transactionId || res?.id,
        });
        
        console.log("[P2PForm] P2P received notification sent successfully");
        
        // Refresh receiver's P2P notifications after sending
        try {
          setTimeout(async () => {
            const freshNotifs = await pollReceiverNotifications(10, "P2P");
            if (freshNotifs?.data) {
              console.log("[P2PForm] Refreshed receiver P2P notifications:", freshNotifs.data);
            }
          }, 500); // Small delay to ensure backend has processed
        } catch (pollErr) {
          console.warn("[P2PForm] Failed to refresh receiver notifications:", pollErr);
        }
      } catch (receivedErr) {
        console.warn("[P2PForm] Failed to send P2P received notification:", receivedErr);
      }

      // Reset failure tracking on success
      failureTracker.recordSuccess();

      // Reset form after success
      setMsg(res?.message || "P2P transfer completed successfully!");
      setTo("");
      setAmount("");
      setPhone("");
    } catch (e2) {
      setLoading(false);

      const d = e2?.response?.data;
      const status = e2?.response?.status;
      
      console.log("\n========== [P2PForm] ERROR RESPONSE ==========");
      console.log("[P2PForm] HTTP Status:", status);
      console.log("[P2PForm] Full error response:", JSON.stringify(d, null, 2));
      
      // Extract the actual TransactionID from error response (from backend SuspendedResult)
      console.log("[P2PForm] Checking for transactionId in response...");
      console.log("[P2PForm]   d?.Transaction?.TransactionID:", d?.Transaction?.TransactionID);
      console.log("[P2PForm]   d?.transaction?.transactionID:", d?.transaction?.transactionID);
      console.log("[P2PForm]   d?.TransactionID:", d?.TransactionID);
      console.log("[P2PForm]   d?.transactionID:", d?.transactionID);
      console.log("[P2PForm]   d?.id:", d?.id);
      
      let transactionId = 
        d?.Transaction?.TransactionID ||   // From SuspendedResult.Transaction object
        d?.transaction?.transactionID ||
        d?.TransactionID || 
        d?.transactionID || 
        d?.id || 
        null;
      
      console.log("[P2PForm] ✅ FINAL Extracted transactionId:", transactionId, "(type:", typeof transactionId, ")");
      console.log("========== [P2PForm] ERROR RESPONSE END ==========\n");
      
      // // If backend didn't return TransactionID, we can't track it properly
      // if (!transactionId) {
      //   console.warn("[P2PForm] ⚠️ Backend did not return TransactionID. Failed transaction won't appear in history!");
      // }

      // Only record failure if we got the REAL transaction ID from backend
      if (transactionId) {
        failureTracker.recordFailure(transactionId);
      }
      
      // Build error message based on status
      let title = "Transfer Failed";
      let message = "Unable to complete your transfer";
      let details = [];

      if (status === 401) {
        title = "Session Expired";
        message = "Your session has expired. Please login again.";
      } else if (status === 403) {
        title = "Permission Denied";
        message = "You don't have permission to perform this transaction.";
      } else if (status === 400) {
        title = "Invalid Transaction";
        message = d?.message || "Invalid transaction details";
        details = [
          d?.detail || "Please check your inputs and try again",
          `Wallet ID: ${toWalletNum}`,
          `Amount: ₹${amountNum}`,
        ];
      } else if (status === 402) {
        title = "Insufficient Balance";
        message = "You don't have enough balance to complete this transfer";
        details = [
          `Required: ₹${amountNum}`,
          "Please top up your wallet and try again",
        ];
      } else {
        message = d?.detail || d?.title || d?.message || e2?.message || "Transfer failed";
        details = [`Error: ${status || "Unknown"}`];
      }

      setResult({
        type: "error",
        title,
        message,
        details,
      });
      
      // Check if threshold just reached (failureCount + 1 === 3)
      // Use the FIRST transaction ID that was locked in the hook
      if (failureTracker.failureCount + 1 === 3) {
        console.log("\n========== [P2PForm] RISK FLAG CREATION ==========");
        console.log("[P2PForm] ⚠️ THRESHOLD REACHED! failureCount will be 3");
        console.log("[P2PForm] Current attempt transactionId:", transactionId);
        console.log("[P2PForm] failureTracker.transactionId (FIRST attempt - locked):", failureTracker.transactionId);
        
        // Use the FIRST transaction ID for risk reporting
        const idToLog = failureTracker.transactionId || transactionId;
        
        if (!idToLog) {
          console.error("[P2PForm] ❌ No valid transaction ID for risk flag!");
        } else {
          console.log("[P2PForm] ✅ Creating risk flag with FIRST transaction ID:", idToLog);
          logRiskEvent({
            transactionId: idToLog,  // USE FIRST ID (locked)
            transactionType: "Insufficient Funds",
            severity: "HIGH",  // 3 failures = HIGH
            status: "Open"
          }).then(() => {
            console.log("[P2PForm] ✅ Risk flag created successfully with ID:", idToLog);
            console.log("========== [P2PForm] RISK FLAG CREATION END ==========\n");
          }).catch(err => {
            console.error("[P2PForm] ❌ Failed to create risk flag:", err.message);
            console.log("========== [P2PForm] RISK FLAG CREATION END (ERROR) ==========\n");
          });
        }
      }

      setErr(message);
    } finally {
      setLoading(false);
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      {/* Risk Flag Alert */}
      {failureTracker.showRiskAlert && (
        <RiskFlagAlert
          failureCount={failureTracker.failureCount}
          onClose={failureTracker.closeRiskAlert}
        />
      )}

      {/* Loading Spinner */}
      {loading && <LoadingSpinner message="Processing your P2P transfer..." />}

      {/* Transaction Result Modal */}
      {result && (
        <TransactionResult
          type={result.type}
          title={result.title}
          message={result.message}
          details={result.details}
          onClose={() => {
            setResult(null);
            if (result.type === "success") {
              onCompleted?.();
            }
          }}
          autoClose={result.type === "success"}
          autoCloseDelay={3000}
        />
      )}

      <div className="max-w-md mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-full">
              <Send size={28} className="text-blue-200" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Send Money</h1>
              <p className="text-blue-100 text-sm">Peer-to-Peer Transfer</p>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <form onSubmit={submit} className="bg-slate-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-slate-700/50">
          
          {/* Rate Limit Warning */}
          <RateLimitWarning remaining={rateLimit.remaining} timeLeft={rateLimit.timeLeft} />

          {/* From Wallet Info */}
          {resolvedWallet && (
            <div className="bg-gradient-to-r from-slate-700/40 to-slate-600/40 rounded-2xl p-4 mb-6 border border-slate-600/30">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Wallet size={16} className="text-blue-400" />
                <span>From wallet</span>
              </div>
              <p className="text-white font-mono font-semibold mt-1 text-lg">{resolvedWallet}</p>
            </div>
          )}

          {/* To Wallet Field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Wallet size={18} className="text-blue-400" />
              Recipient Wallet ID
            </label>
            <input
              type="text"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter wallet ID"
              value={toWalletID}
              onChange={(e) => setTo(e.target.value)}
              inputMode="numeric"
              disabled={loading}
            />
          </div>

          {/* Amount Field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <DollarSign size={18} className="text-green-400" />
              Amount (INR)
            </label>
            <input
              type="text"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              disabled={loading}
            />
          </div>

          {/* Phone Field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Phone size={18} className="text-purple-400" />
              Registered Phone Number
            </label>
            <input
              type="tel"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              disabled={loading}
            />
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <Lock size={12} /> Secured verification
            </p>
          </div>

          {/* Validation Error Message */}
          {!canSubmit && getValidationError() && (
            <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-400 rounded-full mt-1 flex-shrink-0" />
              <p className="text-amber-300 text-sm">{getValidationError()}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            disabled={!canSubmit || loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
            {loading ? "Processing..." : "Send Money"}
          </button>

          {/* Success Message */}
          {msg && !result && (
            <div className="mt-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mt-1 flex-shrink-0" />
              <p className="text-emerald-300 text-sm">{msg}</p>
            </div>
          )}

          {/* Error Message */}
          {err && !result && (
            <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-1 flex-shrink-0" />
              <p className="text-red-300 text-sm">{err}</p>
            </div>
          )}
        </form>

        {/* Footer Info */}
        <div className="mt-8 text-center text-slate-400 text-xs">
          <p>💳 Fast, Secure, and Reliable Money Transfer</p>
          <p className="mt-1">Your transaction is encrypted and protected</p>
        </div>
      </div>
    </div>
  );
}
