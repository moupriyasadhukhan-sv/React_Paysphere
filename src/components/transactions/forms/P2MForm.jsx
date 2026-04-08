import { useState, useEffect } from "react";
import { createP2M } from "../../../services/transactions/transactionsApi";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart, Lock, Wallet, Phone, DollarSign } from "lucide-react";
import { addNotification } from "../../../stores/notificationsSlice";
import { useRateLimit } from "../../../hooks/useRateLimit";
import { useFailureTracking } from "../../../hooks/useFailureTracking";
import { LoadingSpinner, TransactionResult, RateLimitWarning } from "../TransactionResult";
import { RiskFlagAlert } from "../RiskFlagAlert";
import { logRiskEvent } from "../../../services/risk/riskApi";
import { walletService } from "../../../services/walletService";

const digitsOnly = (v) => (v || "").replace(/\D+/g, "");

export default function P2MForm({ onCompleted }) {
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
        console.error("[P2MForm] Failed to fetch wallet balance:", error);
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
          console.error("[P2MForm] Failed to load retry data:", error);
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
    if (!toWalletID) return "Merchant Wallet ID is required";
    if (toWalletNum <= 0) return "Wallet ID must be greater than 0";
    if (!amount) return "Amount is required";
    if (amountNum <= 0) return "Amount must be greater than 0";
    if (!phone) return "Phone number is required";
    if (phoneDigits.length < 10) return `Phone number must be at least 10 digits (${phoneDigits.length}/10)`;
    return null;
  };

  const getSimulatedDelay = () => {
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

      const res = await createP2M({
        toWalletID: toWalletNum,
        amount: amountNum,
        currency: "INR",
        phoneNumber: phoneDigits,
      });

      setLoading(false);

      // ✅ Success - Reset failure tracking
      failureTracker.recordSuccess();
      localStorage.removeItem("ps_validation_errors"); // Clear validation errors on success

      // Show success result
      setResult({
        type: "success",
        title: "Payment Successful! 🎉",
        message: `Successfully paid ₹${amountNum} to merchant ${toWalletNum}`,
        details: [
          `Status: Completed`,
          "Transaction secured with 256-bit encryption",
        ],
      });

      // Add notification
      dispatch(addNotification({
        title: "Merchant Payment Successful ✓",
        message: `Paid ₹${amountNum} to merchant ${toWalletNum}`,
        icon: "🛒",
        timestamp: new Date().toISOString()
      }));

      // Reset form after success
      setMsg(res?.message || "Merchant payment completed successfully!");
      setTo("");
      setAmount("");
      setPhone("");
    } catch (e2) {
      setLoading(false);

      const d = e2?.response?.data;
      const status = e2?.response?.status;
      
      console.log("[P2MForm] Error Response - Status:", status, "Data:", d);
      
      // 1️⃣ Extract Transaction ID from response
      let transactionId = 
        d?.Transaction?.TransactionID || 
        d?.transaction?.transactionID || 
        d?.TransactionID || 
        d?.id || 
        null;
      
      console.log("[P2MForm] Extracted transactionId:", transactionId);
      
      // 2️⃣ Identify error type
      const isValidationError = status === 400;
      const isBalanceError = status === 402;

      console.log("[P2MForm] isValidationError:", isValidationError, "| isBalanceError:", isBalanceError);

      // 3️⃣ Record failure ONLY for real transaction attempts (not validation errors)
      if (transactionId && !isValidationError) {
        console.log("[P2MForm] Recording failure with transactionId:", transactionId);
        failureTracker.recordFailure(transactionId);
      }

      let title = "Payment Failed";
      let message = d?.message || "Unable to complete payment";
      let details = [];

      // 4️⃣ Handle different error types
      if (isValidationError) {
        // 🔴 Validation Error - Track attempts, logout after 5
        console.log("[P2MForm] VALIDATION ERROR - Tracking attempts");
        let vCount = parseInt(localStorage.getItem("ps_validation_errors") || "0", 10) + 1;
        localStorage.setItem("ps_validation_errors", vCount.toString());
        
        console.log("[P2MForm] Validation error count:", vCount);

        if (vCount >= 5) {
          console.log("[P2MForm] ⚠️ 5 validation errors reached - LOGGING OUT");
          localStorage.removeItem("ps_validation_errors");
          setResult({ 
            type: "error", 
            title: "Security Block", 
            message: "Too many invalid attempts. Logging out...",
            details: []
          });
          setTimeout(() => { 
            globalThis.location.href = "/login"; 
          }, 2000);
          return;
        }

        title = "Invalid Details";
        details = [d?.detail || "Check your phone number or wallet ID"];
      } 
      else if (isBalanceError) {
        // 💰 Insufficient Balance Error
        console.log("[P2MForm] BALANCE ERROR - failureCount:", failureTracker.failureCount);
        title = "Insufficient Balance";
        message = "You don't have enough balance to complete this payment";
        details = [`Required: ₹${amountNum}`, "Please top up your wallet"];
        localStorage.removeItem("ps_validation_errors"); // Clear validation counter

        // ✅ TRIGGER RISK FLAG ON 3RD ATTEMPT
        // Check failureCount + 1 because state hasn't updated yet
        if (failureTracker.failureCount + 1 === 3) {
          console.log("\n========== [P2MForm] RISK FLAG CREATION ==========");
          console.log("[P2MForm] ⚠️ THRESHOLD REACHED! failureCount will be 3");
          console.log("[P2MForm] Current transactionId:", transactionId);
          console.log("[P2MForm] failureTracker.transactionId (FIRST - locked):", failureTracker.transactionId);
          
          // Use the FIRST locked transaction ID
          const idToLog = failureTracker.transactionId || transactionId;
          
          if (!idToLog) {
            console.error("[P2MForm] ❌ No valid transaction ID for risk flag!");
          } else {
            console.log("[P2MForm] ✅ Creating risk flag with FIRST transaction ID:", idToLog);
            logRiskEvent({
              transactionId: idToLog,
              transactionType: "P2M_INSUFFICIENT_FUNDS",
              severity: "HIGH",
              status: "Open"
            }).then(() => {
              console.log("[P2MForm] ✅ Risk flag created successfully with ID:", idToLog);
              console.log("========== [P2MForm] RISK FLAG CREATION END ==========\n");
            }).catch(err => {
              console.error("[P2MForm] ❌ Failed to create risk flag:", err.message);
              console.log("========== [P2MForm] RISK FLAG CREATION END (ERROR) ==========\n");
            });
          }
        }
      }

      setResult({
        type: "error",
        title,
        message,
        details,
      });
      setErr(message);
    } finally {
      setLoading(false);
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
      {loading && <LoadingSpinner message="Processing your merchant payment..." />}

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
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-500/20 rounded-full">
              <ShoppingCart size={28} className="text-amber-200" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Pay Merchant</h1>
              <p className="text-amber-100 text-sm">Merchant Payment</p>
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
                <Wallet size={16} className="text-amber-400" />
                <span>From wallet</span>
              </div>
              <p className="text-white font-mono font-semibold mt-1 text-lg">{resolvedWallet}</p>
            </div>
          )}

          {/* Merchant Wallet Field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Wallet size={18} className="text-amber-400" />
              Merchant Wallet ID
            </label>
            <input
              type="text"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              placeholder="Enter merchant wallet ID"
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
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={20} />
            {loading ? "Processing..." : "Pay Merchant"}
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
          <p>🛒 Fast, Secure, and Reliable Merchant Payments</p>
          <p className="mt-1">Your transaction is encrypted and protected</p>
        </div>
      </div>
    </div>
  );
}
