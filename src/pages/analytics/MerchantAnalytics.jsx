import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, Filter, Download, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import MerchantSlideshow from "../../components/merchant/MerchantSlideshow";
import {
  MotionStatCard,
  MotionProgressBar,
  MotionButton,
  MotionCard,
  MotionBadge,
} from "../../components/merchant/MotionComponents";
import {
  showMerchantSuccess,
  showMerchantError,
  showMerchantInfo,
  merchantPromiseToast,
} from "../../utils/merchantToast.jsx";

/**
 * MERCHANT ANALYTICS DASHBOARD
 * Real-time analytics with beautiful motion animations
 */

// Dummy analytics data
const REVENUE_DATA = [
  { month: "Jan", revenue: 45000, target: 50000 },
  { month: "Feb", revenue: 52000, target: 50000 },
  { month: "Mar", revenue: 48000, target: 50000 },
  { month: "Apr", revenue: 61000, target: 55000 },
  { month: "May", revenue: 55000, target: 55000 },
  { month: "Jun", revenue: 67000, target: 60000 },
];

const TRANSACTION_DATA = [
  { name: "Successful", value: 78, color: "#10b981" },
  { name: "Pending", value: 15, color: "#f59e0b" },
  { name: "Failed", value: 7, color: "#ef4444" },
];

const PAYMENT_METHODS = [
  { name: "Credit Card", value: 45, percentage: 45 },
  { name: "Debit Card", value: 25, percentage: 25 },
  { name: "UPI", value: 20, percentage: 20 },
  { name: "Wallet", value: 10, percentage: 10 },
];

const DAILY_METRICS = [
  { date: "Mon", transactions: 120, amount: 45000 },
  { date: "Tue", transactions: 145, amount: 52000 },
  { date: "Wed", transactions: 130, amount: 48000 },
  { date: "Thu", transactions: 160, amount: 61000 },
  { date: "Fri", transactions: 175, amount: 65000 },
  { date: "Sat", transactions: 135, amount: 51000 },
  { date: "Sun", transactions: 98, amount: 37000 },
];

export default function MerchantAnalytics() {
  const [timeRange, setTimeRange] = useState("month");
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExportReport = async () => {
    try {
      setLoading(true);
      await merchantPromiseToast(
        new Promise((resolve) => setTimeout(resolve, 1500)),
        {
          loading: "📊 Generating report...",
          success: "✅ Report exported successfully!",
          error: "❌ Failed to export report",
        }
      );
    } catch (error) {
      showMerchantError("Export failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8">
      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "transparent",
            boxShadow: "none",
            padding: 0,
          },
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Analytics & Reports
              </h1>
              <p className="text-slate-400 mt-2">
                Monitor your merchant performance metrics
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportReport}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-semibold disabled:opacity-50 transition-all"
            >
              <Download size={20} />
              Export Report
            </motion.button>
          </div>
        </motion.div>

        {/* Merchant Slideshow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MerchantSlideshow autoPlay interval={6000} />
        </motion.div>

        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <span className="text-sm font-semibold text-slate-300">View:</span>
          {["week", "month", "quarter", "year"].map((range) => (
            <motion.button
              key={range}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setTimeRange(range);
                showMerchantInfo(`Showing ${range} view`);
              }}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                timeRange === range
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
                  : "bg-slate-800/60 text-slate-300 hover:bg-slate-700/60"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <MotionStatCard
            icon={TrendingUp}
            label="Total Revenue"
            value="₹3.28L"
            trend="up"
            trendValue="18"
            color="emerald"
          />
          <MotionStatCard
            icon={TrendingUp}
            label="Avg Transaction"
            value="₹4,250"
            trend="up"
            trendValue="8"
            color="blue"
          />
          <MotionStatCard
            icon={TrendingUp}
            label="Success Rate"
            value="98.5%"
            trend="up"
            trendValue="2"
            color="purple"
          />
          <MotionStatCard
            icon={TrendingUp}
            label="Active Customers"
            value="1,234"
            trend="up"
            trendValue="15"
            color="amber"
          />
        </motion.div>

        {/* Revenue & Transactions Charts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Revenue Trend */}
          <MotionCard title="Revenue Trend">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#f1f5f9" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#f59e0b"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  fillOpacity={1}
                  fill="url(#colorTarget)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </MotionCard>

          {/* Transaction Status */}
          <MotionCard title="Transaction Status">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={TRANSACTION_DATA}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {TRANSACTION_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#f1f5f9" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </MotionCard>
        </motion.div>

        {/* Daily Metrics & Payment Methods */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Daily Transactions */}
          <MotionCard title="Daily Transactions (7 Days)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={DAILY_METRICS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#f1f5f9" }}
                />
                <Bar dataKey="transactions" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </MotionCard>

          {/* Payment Methods Breakdown */}
          <MotionCard title="Payment Methods">
            <div className="space-y-4">
              {PAYMENT_METHODS.map((method, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">
                      {method.name}
                    </span>
                    <MotionBadge status="success">{method.percentage}%</MotionBadge>
                  </div>
                  <MotionProgressBar
                    label=""
                    value={method.percentage}
                    color="cyan"
                  />
                </motion.div>
              ))}
            </div>
          </MotionCard>
        </motion.div>

        {/* Performance Metrics */}
        <MotionCard title="Performance Summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-slate-800/50 rounded-lg border border-emerald-500/30"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 rounded-lg">
                  <ArrowUpRight className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Best Day</p>
                  <p className="text-xl font-bold text-white">Friday - ₹65,000</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 bg-slate-800/50 rounded-lg border border-red-500/30"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <ArrowDownLeft className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Lowest Day</p>
                  <p className="text-xl font-bold text-white">Sunday - ₹37,000</p>
                </div>
              </div>
            </motion.div>
          </div>
        </MotionCard>
      </motion.div>
    </div>
  );
}
