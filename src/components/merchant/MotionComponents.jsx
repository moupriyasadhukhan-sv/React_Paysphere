import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Clock } from "lucide-react";

/**
 * Motion UI Components for Merchant Module
 * Beautiful, animated components for settlements, analytics, and reports
 */

/**
 * Animated Stat Card - For displaying key metrics
 * Usage: <MotionStatCard icon={DollarSign} label="Total Volume" value="₹25.5M" trend="up" />
 */
export const MotionStatCard = ({
  icon: Icon,
  label,
  value,
  trend = null,
  trendValue = null,
  color = "blue",
}) => {
  const colorClasses = {
    blue: "from-blue-600 to-blue-800",
    emerald: "from-emerald-600 to-emerald-800",
    amber: "from-amber-600 to-amber-800",
    purple: "from-purple-600 to-purple-800",
    pink: "from-pink-600 to-pink-800",
  };

  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  const trendColor = trend === "up" ? "text-emerald-400" : "text-red-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)" }}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 text-white shadow-lg border border-white/10 overflow-hidden relative group`}
    >
      {/* Background decoration */}
      <div className="absolute -right-8 -bottom-8 w-20 h-20 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-300" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="p-2 bg-white/20 rounded-lg"
          >
            <Icon size={24} />
          </motion.div>
          {trend && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`flex items-center gap-1 ${trendColor}`}
            >
              <TrendIcon size={18} />
              <span className="text-sm font-semibold">{trendValue}%</span>
            </motion.div>
          )}
        </div>

        {/* Label */}
        <p className="text-white/70 text-sm font-medium mb-2">{label}</p>

        {/* Value */}
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold"
        >
          {value}
        </motion.h3>
      </div>
    </motion.div>
  );
};

/**
 * Animated Progress Bar - For showing settlement progress
 * Usage: <MotionProgressBar label="Settlement Processing" value={75} />
 */
export const MotionProgressBar = ({ label, value, color = "cyan" }) => {
  const colorClasses = {
    cyan: "from-cyan-400 to-blue-500",
    emerald: "from-emerald-400 to-teal-500",
    amber: "from-amber-400 to-orange-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-300">{label}</label>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-bold text-cyan-400"
        >
          {value}%
        </motion.span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${colorClasses[color]} shadow-lg`}
        />
      </div>
    </motion.div>
  );
};

/**
 * Animated List Item - For settlement/transaction lists
 * Usage: <MotionListItem title="Settlement #12345" value="₹50,000" status="completed" />
 */
export const MotionListItem = ({ title, value, status = "pending", icon: Icon }) => {
  const statusColors = {
    completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    failed: "bg-red-500/20 text-red-400 border-red-500/30",
    processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  const statusLabels = {
    completed: "✓ Completed",
    pending: "◯ Pending",
    failed: "✕ Failed",
    processing: "⟳ Processing",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 8, backgroundColor: "rgba(30, 58, 138, 0.4)" }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-4 p-4 bg-slate-800/40 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors cursor-pointer group"
    >
      {/* Icon */}
      {Icon && (
        <motion.div
          whileHover={{ scale: 1.1, rotate: 10 }}
          className="p-2 bg-slate-700/60 rounded-lg"
        >
          <Icon className="w-5 h-5 text-cyan-400" />
        </motion.div>
      )}

      {/* Content */}
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <p className="text-xs text-slate-400 mt-1">{value}</p>
      </div>

      {/* Status Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${statusColors[status]}`}
      >
        {statusLabels[status]}
      </motion.div>
    </motion.div>
  );
};

/**
 * Animated Empty State - For empty data
 * Usage: <MotionEmptyState title="No settlements" description="Create your first settlement" />
 */
export const MotionEmptyState = ({ title, description, icon: Icon = Clock }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="p-4 bg-slate-800/60 rounded-full mb-4"
      >
        <Icon className="w-8 h-8 text-slate-500" />
      </motion.div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </motion.div>
  );
};

/**
 * Animated Button - For merchant actions
 * Usage: <MotionButton onClick={handleClick}>Process Settlement</MotionButton>
 */
export const MotionButton = ({
  children,
  onClick,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white",
    secondary:
      "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600",
    danger:
      "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white",
    success:
      "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        px-6 py-3 rounded-lg font-semibold transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center gap-2
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
        />
      )}
      {children}
    </motion.button>
  );
};

/**
 * Animated Card - Container component
 * Usage: <MotionCard title="Settlement Details">Content here</MotionCard>
 */
export const MotionCard = ({ title, children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl p-6 border border-slate-700/50 shadow-xl backdrop-blur-sm ${className}`}
    >
      {title && (
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xl font-bold text-white mb-4"
        >
          {title}
        </motion.h3>
      )}
      {children}
    </motion.div>
  );
};

/**
 * Animated Badge - For status indicators
 * Usage: <MotionBadge status="success">Verified</MotionBadge>
 */
export const MotionBadge = ({ children, status = "info" }) => {
  const statusClasses = {
    success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    error: "bg-red-500/20 text-red-400 border-red-500/30",
    info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border inline-block ${statusClasses[status]}`}
    >
      {children}
    </motion.span>
  );
};

export default {
  StatCard: MotionStatCard,
  ProgressBar: MotionProgressBar,
  ListItem: MotionListItem,
  EmptyState: MotionEmptyState,
  Button: MotionButton,
  Card: MotionCard,
  Badge: MotionBadge,
};
