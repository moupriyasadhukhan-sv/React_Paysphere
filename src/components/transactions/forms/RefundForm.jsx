import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createRefundRequest } from "../../../services/refunds/refundRequestsApi";
import { RotateCcw, Lock, Phone, Receipt } from "lucide-react";
import { useRateLimit } from "../../../hooks/useRateLimit";
import { useFailureTracking } from "../../../hooks/useFailureTracking";
import { LoadingSpinner, TransactionResult, RateLimitWarning } from "../TransactionResult";
import { RiskFlagAlert } from "../RiskFlagAlert";
import { logRiskEvent, checkRefundStatus } from "../../../services/risk/riskApi";
import { addNotification } from "../../../stores/notificationsSlice";

const digitsOnly = (v) => (v || "").replaceAll(/\D+/g, "");

/**
 * RefundForm (User) — creates a refund request
 * Calls: POST /api/RefundRequests
 */
export default function RefundForm({ onCompleted }) {
  const dispatch = useDispatch();
  const rateLimit = useRateLimit(5, 60000); // 5 transactions per minute
  const failureTracker = useFailureTracking();

  const [originalTransactionID, setOrig] = useState("");
  const [phone, setPhone] = useState("");

  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [result, setResult] = useState(null);

  // Load retry data from sessionStorage if available
  useEffect(() => {
    const retryData = sessionStorage.getItem("retryTransaction");
    if (retryData) {
      try {
        const data = JSON.parse(retryData);
        // For refund, the original transaction ID is stored in originalTransactionId
        if (data.originalTransactionId) {
          setOrig(String(data.originalTransactionId));
        }
        if (data.phone) {
          setPhone(String(data.phone));
        }
        // Clear the retry data after loading
        sessionStorage.removeItem("retryTransaction");
      } catch (error) {
        console.error("[RefundForm] Failed to load retry data:", error);
      }
    }
  }, []);

  const txnIdNum = Number(originalTransactionID);
  const phoneDigits = digitsOnly(phone);
  
  const canSubmit =
    txnIdNum > 0 && phoneDigits.length >= 10 && rateLimit.canRequest;

  const getValidationError = () => {
    if (!originalTransactionID) return "Transaction ID is required";
    if (txnIdNum <= 0) return "Transaction ID must be greater than 0";
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

    // Check rate limit
    const rateLimitCheck = rateLimit.tryRequest();
    if (!rateLimitCheck.success) {
      setResult({
        type: "error",
        title: "Rate Limit Exceeded",
        message: rateLimitCheck.message,
        details: `You can perform ${rateLimit.maxRequests} transactions per minute.`,
      });
      return;
    }

    setMsg("");
    setErr("");
    setLoading(true);

    try {
      // Check if refund already exists for this transaction
      const refundStatus = await checkRefundStatus(txnIdNum);
      if (refundStatus.exists && refundStatus.completed) {
        setLoading(false);
        setResult({
          type: "error",
          title: "Refund Already Processed",
          message: "This transaction has already been refunded",
          details: [
            `Transaction ID: TXN${txnIdNum}`,
            "You cannot submit another refund request for this transaction",
            "Please contact support if you need assistance",
          ],
        });
        setErr("This transaction has already been refunded");
        return;
      }

      // Show loading for 3-5 seconds
      await new Promise(resolve => setTimeout(resolve, getSimulatedDelay()));

      // USER flow: create a refund request
      const out = await createRefundRequest({
        originalTransactionID: txnIdNum,
        phoneNumber: phoneDigits,
      });

      setLoading(false);

      // Record success and reset failure counter
      failureTracker.recordSuccess();

      // Send notification to user
      dispatch(addNotification({
        title: "Refund Request Submitted ✓",
        message: `Your refund request for transaction #${txnIdNum} has been submitted successfully`,
        icon: "🔄",
        timestamp: new Date().toISOString()
      }));

      // Show success result
      setResult({
        type: "success",
        title: "Refund Request Submitted! 🎉",
        message: `Your refund request has been submitted successfully`,
        details: [
          `Transaction ID: TXN${txnIdNum}`,
          `Status: Under Review`,
          "You'll receive an update within 24 hours",
        ],
      });

      // Reset form after success
      setMsg(out?.message || "Refund request submitted successfully!");
      setOrig("");
      setPhone("");
    } catch (error_) {
      setLoading(false);

      // Record failure
      failureTracker.recordFailure();
      if (failureTracker.isRiskThresholdReached) {
        console.log("[RefundForm] Threshold reached, creating risk flag...");
        logRiskEvent({
          failureCount: failureTracker.failureCount,
          transactionType: "REFUND",
          transactionId,
          severity: "HIGH",
          status: "Open",
          transactionDetails: { originalTransactionId: txnIdNum },
          description: `${failureTracker.failureCount} consecutive refund request failures from user`
        }).then(() => {
          console.log("[RefundForm] Risk flag created successfully");
        }).catch(err => {
          console.error("[RefundForm] Failed to log risk event:", {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data
          });
        });
      }

      const d = error_?.response?.data;
      const status = error_?.response?.status;

      let title = "Refund Request Failed";
      let message = "Unable to submit your refund request";
      let details = [];

      // Handle different error types
      if (status === 401) {
        title = "Session Expired";
        message = "Your session has expired. Please login again.";
      } else if (status === 403) {
        title = "Permission Denied";
        message = "You don't have permission to request refunds.";
      } else if (status === 400) {
        title = "Invalid Request";
        message = d?.message || "Invalid refund request details";
        details = [
          d?.detail || "Please check your inputs and try again",
          `Transaction ID: ${txnIdNum}`,
        ];
      } else if (status === 404) {
        title = "Transaction Not Found";
        message = "The transaction you specified could not be found";
        details = [
          `Transaction ID: ${txnIdNum}`,
          "Please verify the transaction ID and try again",
        ];
      } else {
        message = d?.detail || d?.title || d?.message || error_?.message || "Failed to submit refund request";
        details = [`Error: ${status || "Unknown"}`];
      }

      const transactionId = `TXN${Math.floor(Math.random() * 100000)}`;

      setResult({
        type: "error",
        title,
        message,
        details: [
          `Transaction ID: ${transactionId}`,
          ...details
        ],
      });

      setErr(message);
      console.error("[RefundForm] Refund error:", { status, data: d, error: error_?.message });
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
      {loading && <LoadingSpinner message="Processing your refund request..." />}

      {/* Result Modal */}
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
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-rose-500/20 rounded-full">
              <RotateCcw size={28} className="text-rose-200" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Request Refund</h1>
              <p className="text-rose-100 text-sm">Get your money back</p>
            </div>
          </div>
        </div>

        {/* Rate Limit Warning */}
        {!rateLimit.canRequest && (
          <RateLimitWarning 
            message={`Too many refund requests. Wait ${rateLimit.timeLeft}s before trying again.`}
            timeLeft={rateLimit.timeLeft}
          />
        )}

        {/* Main Form Card */}
        <form onSubmit={submit} className="bg-slate-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-slate-700/50">
          
          {/* Description */}
          <div className="mb-8 bg-gradient-to-r from-slate-700/40 to-slate-600/40 rounded-2xl p-4 border border-slate-600/30">
            <p className="text-slate-300 text-sm leading-relaxed">
              📋 Enter the original transaction ID and your registered phone number to request a refund. Our team will review your request within 24 hours.
            </p>
          </div>

          {/* Transaction ID Field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Receipt size={18} className="text-rose-400" />
              Original Transaction ID
            </label>
            <input
              type="text"
              disabled={loading}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter transaction ID"
              value={originalTransactionID}
              onChange={(e) => setOrig(e.target.value)}
              inputMode="numeric"
            />
            <p className="text-xs text-slate-400 mt-2">Found in your transaction history</p>
          </div>

          {/* Phone Field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Phone size={18} className="text-purple-400" />
              Registered Phone Number
            </label>
            <input
              type="tel"
              disabled={loading}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
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
            disabled={!canSubmit || busy || loading}
            className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw size={20} />
            {busy || loading ? "Processing..." : "Submit Refund Request"}
          </button>

          {/* Success Message */}
          {msg && !result && (
            <div className="mt-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mt-1 flex-shrink-0" />
              <div>
                <p className="text-emerald-300 text-sm font-semibold mb-1">Request Submitted</p>
                <p className="text-emerald-200 text-xs">{msg}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {err && !result && (
            <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-1 flex-shrink-0" />
              <div>
                <p className="text-red-300 text-sm font-semibold mb-1">Error</p>
                <p className="text-red-200 text-xs">{err}</p>
              </div>
            </div>
          )}
        </form>

        {/* Footer Info */}
        <div className="mt-8 space-y-3 text-center">
          <div className="bg-slate-700/30 rounded-2xl p-4 border border-slate-600/30">
            <p className="text-slate-300 text-sm">
              ✓ Refunds processed within 24-48 hours<br/>
              ✓ Money returned to your wallet<br/>
              ✓ You can track refund status anytime
            </p>
          </div>
          <p className="text-slate-400 text-xs">
            Questions? Contact support@paysphere.com
          </p>
        </div>
      </div>
    </div>
  );
}