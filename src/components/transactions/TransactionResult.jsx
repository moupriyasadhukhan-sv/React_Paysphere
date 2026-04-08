import { useState, useEffect } from "react";
import { Check, X, AlertCircle } from "lucide-react";

/**
 * Transaction Result Modal with Animation
 * Shows success, failure, or warning state with custom message
 */
export function TransactionResult({
  type, // 'success', 'error', 'warning'
  title,
  message,
  details,
  onClose,
  autoClose = true,
  autoCloseDelay = 4000,
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!autoClose || type === "warning") return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation
    }, autoCloseDelay);

    return () => clearTimeout(timer);
  }, [autoClose, autoCloseDelay, onClose, type]);

  if (!isVisible) return null;

  const configs = {
    success: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      icon: Check,
      iconColor: "text-emerald-400",
      titleColor: "text-emerald-300",
      messageColor: "text-emerald-200",
    },
    error: {
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      icon: X,
      iconColor: "text-red-400",
      titleColor: "text-red-300",
      messageColor: "text-red-200",
    },
    warning: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      icon: AlertCircle,
      iconColor: "text-amber-400",
      titleColor: "text-amber-300",
      messageColor: "text-amber-200",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[9999] bg-black/50 backdrop-blur-sm`}
      onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }}
    >
      <div
        className={`relative max-w-md w-full mx-4 animate-in fade-in zoom-in-75 duration-300 ${config.bg} ${config.border} border rounded-2xl p-6 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg transition"
        >
          <X size={20} className="text-white/50" />
        </button>

        {/* Icon with Animation */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full ${config.bg} flex items-center justify-center animate-bounce`}
            style={{
              animation:
                type === "success"
                  ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                  : "none",
            }}
          >
            <Icon size={32} className={config.iconColor} />
          </div>
        </div>

        {/* Title */}
        <h3 className={`text-xl font-bold text-center mb-2 ${config.titleColor}`}>
          {title}
        </h3>

        {/* Message */}
        <p className={`text-sm text-center mb-4 ${config.messageColor}`}>
          {message}
        </p>

        {/* Details */}
        {details && (
          <div className="bg-white/5 rounded-lg p-3 mb-4 border border-white/10">
            <p className="text-xs text-slate-400 space-y-1">
              {Array.isArray(details) ? (
                details.map((detail, idx) => (
                  <div key={`${detail}-${idx}`} className="flex items-start gap-2">
                    <span className="text-white/50">•</span>
                    <span>{detail}</span>
                  </div>
                ))
              ) : (
                <div>{details}</div>
              )}
            </p>
          </div>
        )}

        {/* Action Button */}
        {type !== "success" && (
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className={`w-full py-2 rounded-lg font-medium transition ${
              type === "error"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-amber-600 hover:bg-amber-700 text-white"
            }`}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Loading Spinner Component
 */
export function LoadingSpinner({ message = "Processing transaction..." }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9998] bg-black/50 backdrop-blur-sm pointer-events-auto">
      <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-white/10 flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-600"></div>
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin"
            style={{ animationDuration: "1s" }}
          ></div>
        </div>

        {/* Message */}
        <p className="text-white text-center font-medium">{message}</p>

        {/* Progress */}
        <div className="text-xs text-slate-400 text-center">
          Processing... (3-5 seconds)
        </div>
      </div>
    </div>
  );
}

/**
 * Rate Limit Warning Component
 */
export function RateLimitWarning({ remaining, timeLeft }) {
  if (remaining > 0) return null;

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 mb-4">
      <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-amber-300 font-semibold text-sm">
          Transaction Limit Reached
        </p>
        <p className="text-amber-200/70 text-xs mt-1">
          You've reached your limit of 5 transactions per minute.
          <br />
          Please try again in <span className="font-bold">{timeLeft}s</span>
        </p>
      </div>
    </div>
  );
}
