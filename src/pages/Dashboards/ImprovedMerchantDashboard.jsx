import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar
} from "recharts";
import { 
  Clock, CheckCircle, RotateCcw, TrendingUp, DollarSign
} from "lucide-react";

import MerchantSlideshow from "../../components/merchant/MerchantSlideshow";
import {
  MotionStatCard,
  MotionCard,
} from "../../components/merchant/MotionComponents";
import {
  showMerchantSuccess,
  showMerchantError,
} from "../../utils/merchantToast.jsx";

import { 
  getMerchantAnalytics, 
  getMerchantTransactions,
  getMerchantSettlements 
} from "../../services/merchantAnalyticsApi"; 
import { listMerchantRefundRequests } from "../../services/refunds/refundRequestsApi";

/* ────────────────────────────────────────────────────────────────
   ANIMATED SETTLEMENT CHART - Custom Wave Chart
──────────────────────────────────────────────────────────────── */
function AnimatedSettlementChart({ settled, pending }) {
  const total = settled + pending;
  const settledPercent = total > 0 ? (settled / total) * 100 : 50;
  const pendingPercent = total > 0 ? (pending / total) * 100 : 50;

  const dataPoints = Array.from({ length: 20 }, (_, i) => {
    const x = (i / 20) * Math.PI * 2;
    const settledY = Math.sin(x) * 20 + 30;
    const pendingY = Math.sin(x + Math.PI / 4) * 15 + 20;
    return { x: (i / 20) * 100, settledY, pendingY };
  });

  return (
    <div className="w-full h-56 relative bg-slate-800/30 rounded-lg border border-slate-700/30 p-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-700/10 via-transparent to-transparent" />
      
      {/* SVG Chart */}
      <svg viewBox="0 0 400 200" className="w-full h-full absolute inset-0" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradientGreen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10901b" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="gradientYellow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Settled Amount Area (Green) */}
        <motion.path
          d={`M 0 150 ${dataPoints.map((p) => `L ${(p.x / 100) * 400} ${150 - (p.settledY / 50) * 80}`).join(' ')} L 400 150 Z`}
          fill="url(#gradientGreen)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 2.8 }}
        />

        {/* Settled Line (Green with glow) */}
        <motion.path
          d={`M 0 150 ${dataPoints.map((p) => `L ${(p.x / 100) * 400} ${150 - (p.settledY / 50) * 80}`).join(' ')}`}
          stroke="#22c55e"
          strokeWidth="2.5"
          fill="none"
          filter="url(#glow)"
          style={{ filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.8))' }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 2.2, duration: 3.2 }}
        />

        {/* Pending Amount Area (Yellow) */}
        <motion.path
          d={`M 0 150 ${dataPoints.map((p) => `L ${(p.x / 100) * 400} ${150 - (p.pendingY / 50) * 80}`).join(' ')} L 400 150 Z`}
          fill="url(#gradientYellow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.3, duration: 1.8 }}
        />

        {/* Pending Line (Yellow with glow) */}
        <motion.path
          d={`M 0 150 ${dataPoints.map((p) => `L ${(p.x / 100) * 400} ${150 - (p.pendingY / 50) * 80}`).join(' ')}`}
          stroke="#fbbf24"
          strokeWidth="2.5"
          fill="none"
          style={{ filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))' }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.3, duration: 1.2 }}
        />

        {/* Animated Glow Points on Settled Line */}
        {dataPoints.map((p, idx) => (
          <motion.circle
            key={`settled-${idx}`}
            cx={(p.x / 100) * 400}
            cy={150 - (p.settledY / 50) * 80}
            r="3"
            fill="#78d299"
            opacity="0.6"
            initial={{ r: 0, opacity: 0 }}
            animate={{ r: 3, opacity: 0.8 }}
            transition={{ delay: 0.2 + (idx * 0.03), duration: 0.5 }}
            style={{ filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.9))' }}
          />
        ))}

        {/* Animated Glow Points on Pending Line */}
        {dataPoints.map((p, idx) => (
          <motion.circle
            key={`pending-${idx}`}
            cx={(p.x / 100) * 400}
            cy={150 - (p.pendingY / 50) * 80}
            r="3"
            fill="#e8c05c"
            opacity="0.6"
            initial={{ r: 0, opacity: 0 }}
            animate={{ r: 3, opacity: 0.8 }}
            transition={{ delay: 0.3 + (idx * 0.03), duration: 0.5 }}
            style={{ filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.9))' }}
          />
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 right-4 flex gap-6 z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" style={{ boxShadow: '0 0 8px rgba(34, 197, 94, 0.8)' }} />
          <span className="text-xs text-green-400 font-semibold">Settled: ₹{settled.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400" style={{ boxShadow: '0 0 8px rgba(251, 191, 36, 0.8)' }} />
          <span className="text-xs text-yellow-400 font-semibold">Pending: ₹{pending.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}


function ImprovedMerchantDashboard({ merchantId, userName }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalRefunds, setTotalRefunds] = useState(0);
  const [totalSettled, setTotalSettled] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);
  const isInitialMount = useRef(true);

  // FIXED: Added the arrow `=>` that was missing here
  useEffect(() => {
    const fetchDashboardData = async () => {
      setDataLoading(true);
      const shouldShowToast = !isInitialMount.current;

      try {
        // Fetch transactions
        const txnsRes = await getMerchantTransactions(merchantId, { page: 1, pageSize: 10 });
        const txnsData = txnsRes?.items || txnsRes?.data || [];
        setTransactions(txnsData);
        setTotalTransactions(txnsRes?.totalCount || txnsData.length || 0);

        // Fetch settlements - this is the main source for settled/pending amounts
        const settlementsRes = await getMerchantSettlements(merchantId);
        const settlementsData = Array.isArray(settlementsRes) ? settlementsRes : (settlementsRes?.data || []);
        setSettlements(settlementsData);

        // Calculate total settled and pending from settlements
        let settled = 0;
        let pending = 0;
        
        settlementsData.forEach(settlement => {
          const amount = parseFloat(settlement.amount || 0);
          const status = (settlement.status || '').toLowerCase();
          
          if (status === 'settled' || status === 'completed') {
            settled += amount;
          } else if (status === 'pending' || status === 'processing') {
            pending += amount;
          }
        });

        setTotalSettled(settled);
        setTotalPending(pending);

        // Fetch analytics for additional metrics
        try {
          const analyticsRes = await getMerchantAnalytics(merchantId);
          setAnalyticsData(analyticsRes?.data || analyticsRes);
        } catch (e) {
          console.warn("Analytics fetch failed, using fallback:", e.message);
        }

        // Fetch refund requests
        try {
          const refundsRes = await listMerchantRefundRequests();
          const refundCount = Array.isArray(refundsRes) ? refundsRes.length : (refundsRes?.data?.length || 0);
          setTotalRefunds(refundCount);
        } catch (e) {
          console.warn("Refunds fetch failed:", e.message);
        }

        if (shouldShowToast) {
          showMerchantSuccess(`Dashboard updated with latest data`, 2000);
        }
      } catch (e) {
        console.error("Error fetching dashboard data:", e);
        if (shouldShowToast) {
          showMerchantError("Failed to sync latest data", 3000);
        }
      } finally {
        setDataLoading(false);
      }
    };

    if (merchantId) {
      fetchDashboardData();
    }
  }, [merchantId]);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen p-3 md:p-4 lg:p-6">
      {/* <Toaster position="top-right" toastOptions={{ style: { background: "transparent", boxShadow: "none", padding: 0 } }} /> */}

      <div className="max-w-7xl mx-auto space-y-4">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="space-y-1 pb-2">
          <h1 
            className="text-100xl md:text-10oxl lg:text-100xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-300"  
            style={{
              fontFamily: '"Times New Roman", serif',
              fontSize: '40px',
              
              backgroundImage: 'linear-gradient(90deg, #4ee991, #4c83da, #06b6d4)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 1s ease infinite',
            }}
          >
            Welcome, {userName || "Merchant"}
          </h1>
          <p className="text-slate-400 text-xs md:text-sm lg:text-base">Monitor your business performance in real-time🎢</p>
        </motion.div>

        {/* Slideshow - Doubled Height */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="max-h-64 lg:max-h-80 overflow-hidden rounded-lg">
            <MerchantSlideshow autoPlay interval={5000} />
          </div>
        </motion.div>

        {/* Main Grid: Settlement Chart & Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Main Graph Card - Takes 2 cols on large screens */}
          <div className="lg:col-span-2">
            <MotionCard title="Amount Settlement Summary" className="h-full">
              <div className="space-y-4">
                {/* Amount Display */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-lg border border-green-500/30"
                  >
                    <p className="text-green-400 text-sm font-medium flex items-center gap-2">
                      <CheckCircle size={16}/>
                      Settled
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-green-300 mt-2">
                      ₹{totalSettled.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-lg border border-yellow-500/30"
                  >
                    <p className="text-yellow-400 text-sm font-medium flex items-center gap-2">
                      <Clock size={16}/>
                      Pending
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-yellow-300 mt-2">
                      ₹{totalPending.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </motion.div>
                </div>

                {/* Animated Settlement Chart - Custom Style without axis marks */}
                <AnimatedSettlementChart settled={totalSettled} pending={totalPending} />
              </div>
            </MotionCard>
          </div>

          {/* Stat Cards Column - Stacked on right */}
          <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <MotionStatCard
                icon={TrendingUp}
                label="Total Transactions"
                value={dataLoading ? "..." : totalTransactions}
                trend="up"
                trendValue={12}
                color="blue"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MotionStatCard
                icon={RotateCcw}
                label="Total Refunds"
                value={dataLoading ? "..." : totalRefunds}
                trend={totalRefunds > 10 ? "down" : "up"}
                trendValue={totalRefunds > 10 ? 4 : 2}
                color="rose"
              />
            </motion.div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default ImprovedMerchantDashboard;