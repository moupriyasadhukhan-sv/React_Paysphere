import React, { useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { CheckCircle, AlertCircle, Info, AlertTriangle, Loader } from "lucide-react";

/**
 * MERCHANT MODULE ANIMATED TOAST SYSTEM
 * Specifically designed for settlement, analytics, and reports modules
 * Features smooth Framer Motion animations and merchant-themed styling
 */

// Toast icons mapping
const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader,
};

const toastColors = {
  success: {
    bg: "bg-emerald-600",
    border: "border-emerald-500",
    icon: "text-emerald-400",
    progress: "bg-emerald-400",
  },
  error: {
    bg: "bg-red-600",
    border: "border-red-500",
    icon: "text-red-400",
    progress: "bg-red-400",
  },
  warning: {
    bg: "bg-amber-600",
    border: "border-amber-500",
    icon: "text-amber-400",
    progress: "bg-amber-400",
  },
  info: {
    bg: "bg-blue-600",
    border: "border-blue-500",
    icon: "text-blue-400",
    progress: "bg-blue-400",
  },
  loading: {
    bg: "bg-cyan-600",
    border: "border-cyan-500",
    icon: "text-cyan-400",
    progress: "bg-cyan-400",
  },
};

/**
 * Animated Toast Component (Internal)
 * Used with react-hot-toast
 */
export const AnimatedToast = ({ message, type = "info", duration = 4000 }) => {
  const Icon = toastIcons[type] || Info;
  const colors = toastColors[type] || toastColors.info;
  const [progress, setProgress] = React.useState(100);

  useEffect(() => {
    if (duration === Infinity) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 100 / (duration / 100);
        return newProgress < 0 ? 0 : newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`${colors.bg} ${colors.border} border backdrop-blur-md rounded-lg p-4 shadow-2xl max-w-sm`}
    >
      <div className="flex items-start gap-3">
        {/* Icon with animation */}
        <motion.div
          animate={type === "loading" ? { rotate: 360 } : {}}
          transition={
            type === "loading"
              ? { rotate: { repeat: Infinity, duration: 1, ease: "linear" } }
              : {}
          }
        >
          <Icon className={`${colors.icon} w-6 h-6 flex-shrink-0 mt-0.5`} />
        </motion.div>

        {/* Message */}
        <div className="flex-1">
          <p className="text-white text-sm font-medium leading-relaxed">{message}</p>
        </div>

        {/* Progress bar */}
        <motion.div
          className={`absolute bottom-0 left-0 h-1 ${colors.progress}`}
          initial={{ width: "100%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </motion.div>
  );
};

/**
 * MERCHANT MODULE TOAST UTILITIES
 * Optimized for settlement, analytics, and reports operations
 */

/**
 * Success Toast - For completed operations
 * Usage: showMerchantSuccess("Settlement processed successfully!")
 * Auto-dismisses after 3 seconds like real applications
 */
export const showMerchantSuccess = (message, duration = 3000) => {
  return toast.custom(
    (t) => (
      <AnimatedToast
        message={message || "✅ Operation successful!"}
        type="success"
        duration={duration}
      />
    ),
    { duration }
  );
};

/**
 * Error Toast - For failed operations
 * Usage: showMerchantError("Failed to process settlement")
 * Auto-dismisses after 4 seconds
 */
export const showMerchantError = (message, duration = 4000) => {
  return toast.custom(
    (t) => (
      <AnimatedToast
        message={message || "❌ An error occurred"}
        type="error"
        duration={duration}
      />
    ),
    { duration }
  );
};

/**
 * Warning Toast - For important alerts
 * Usage: showMerchantWarning("Settlement verification pending")
 * Auto-dismisses after 3.5 seconds
 */
export const showMerchantWarning = (message, duration = 3500) => {
  return toast.custom(
    (t) => (
      <AnimatedToast
        message={message || "⚠️ Warning"}
        type="warning"
        duration={duration}
      />
    ),
    { duration }
  );
};

/**
 * Info Toast - For informational messages
 * Usage: showMerchantInfo("3 pending settlements")
 * Auto-dismisses after 3 seconds
 */
export const showMerchantInfo = (message, duration = 3000) => {
  return toast.custom(
    (t) => (
      <AnimatedToast
        message={message || "ℹ️ Information"}
        type="info"
        duration={duration}
      />
    ),
    { duration }
  );
};

/**
 * Loading Toast - For ongoing operations
 * Usage: const id = showMerchantLoading("Processing settlement...")
 */
export const showMerchantLoading = (message) => {
  return toast.custom((t) => <AnimatedToast message={message || "⏳ Processing..."} type="loading" duration={Infinity} />, {
    duration: Infinity,
  });
};

/**
 * Promise Toast - Best for async operations
 * Handles loading → success/error states automatically
 * 
 * Usage:
 * await merchantPromiseToast(
 *   api.post('/settlements/process', data),
 *   {
 *     loading: 'Processing settlement...',
 *     success: 'Settlement completed!',
 *     error: 'Failed to process settlement'
 *   }
 * )
 */
export const merchantPromiseToast = async (
  promise,
  { loading = "Processing...", success = "Done!", error = "Error occurred" }
) => {
  return new Promise((resolve, reject) => {
    const toastId = toast.custom((t) => <AnimatedToast message={loading} type="loading" duration={Infinity} />);

    promise
      .then((res) => {
        toast.dismiss(toastId);
        toast.custom((t) => <AnimatedToast message={success} type="success" />);
        resolve(res);
      })
      .catch((err) => {
        toast.dismiss(toastId);
        const errorMsg = err?.response?.data?.message || error;
        toast.custom((t) => <AnimatedToast message={errorMsg} type="error" />);
        reject(err);
      });
  });
};

/**
 * Dismiss a specific toast
 */
export const dismissMerchantToast = (toastId) => {
  toast.dismiss(toastId);
};

/**
 * Dismiss all toasts
 */
export const dismissAllMerchantToasts = () => {
  toast.removeAll();
};

export default {
  success: showMerchantSuccess,
  error: showMerchantError,
  warning: showMerchantWarning,
  info: showMerchantInfo,
  loading: showMerchantLoading,
  promise: merchantPromiseToast,
  dismiss: dismissMerchantToast,
  dismissAll: dismissAllMerchantToasts,
};
