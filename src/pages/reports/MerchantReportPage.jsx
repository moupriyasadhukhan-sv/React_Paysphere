// // import { useEffect, useState } from "react";
// // import api from "../../services/http";
// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   ResponsiveContainer,
// //   PieChart,
// //   Pie,
// //   Cell,
// // } from "recharts";

// // export default function MerchantReportPage() {
// //   const [merchants, setMerchants] = useState([]);
// //   const [filtered, setFiltered] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [sortType, setSortType] = useState("txnCount");
// //   const [dateRange, setDateRange] = useState({
// //     from: "",
// //     to: "",
// //   });

// //   const COLORS = ["#b26bff", "#d57dff", "#9f4dff", "#c996ff"];

// //   useEffect(() => {
// //     fetchMerchantReport();
// //   }, []);

// //   // Fetch report
// //   const fetchMerchantReport = async () => {
// //     try {
// //       const response = await api.get("/api/Report/merchants");
// //       setMerchants(response.data.data);
// //       setFiltered(response.data.data);
// //     } catch (err) {
// //       console.error("Error fetching merchant report:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Sorting logic
// //   useEffect(() => {
// //     let sorted = [...merchants];

// //     if (sortType === "txnCount") {
// //       sorted.sort(
// //         (a, b) =>
// //           b.paymentMetrics.totalTxnCount - a.paymentMetrics.totalTxnCount
// //       );
// //     } else if (sortType === "txnValue") {
// //       sorted.sort(
// //         (a, b) =>
// //           b.paymentMetrics.totalTxnValue - a.paymentMetrics.totalTxnValue
// //       );
// //     }

// //     setFiltered(sorted);
// //   }, [sortType, merchants]);

// //   // Loading
// //   if (loading)
// //     return <div className="p-10 text-center text-white">Loading...</div>;

// //   return (
// //     <div className="p-6 text-white min-h-screen bg-gradient-to-br from-black via-[#12021f] to-[#3d0057]">
// //       <h1 className="text-2xl font-bold mb-4">Merchant Performance Report</h1>

// //       {/* FILTERS */}
// //       <div className="flex flex-wrap justify-between items-center mb-6 bg-white/10 p-4 rounded-lg backdrop-blur border border-white/10">
// //         <div>
// //           <label className="text-sm">Sort By:</label>
// //           <select
// //             className="ml-2 p-2 rounded bg-purple-900/40 border border-purple-400"
// //             value={sortType}
// //             onChange={(e) => setSortType(e.target.value)}
// //           >
// //             <option value="txnCount">Highest Transaction Count</option>
// //             <option value="txnValue">Highest Transaction Value</option>
// //           </select>
// //         </div>

// //         <div className="flex gap-3">
// //           <div>
// //             <label className="text-sm">From:</label>
// //             <input
// //               type="date"
// //               className="ml-2 p-2 rounded bg-purple-900/40 border border-purple-400"
// //               onChange={(e) =>
// //                 setDateRange({ ...dateRange, from: e.target.value })
// //               }
// //             />
// //           </div>

// //           <div>
// //             <label className="text-sm">To:</label>
// //             <input
// //               type="date"
// //               className="ml-2 p-2 rounded bg-purple-900/40 border border-purple-400"
// //               onChange={(e) =>
// //                 setDateRange({ ...dateRange, to: e.target.value })
// //               }
// //             />
// //           </div>
// //         </div>
// //       </div>

// //       {/* KPI CHARTS */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //         {/* LEFT: Bar Chart */}
// //         <div className="bg-white/10 p-4 rounded-xl backdrop-blur border border-white/10">
// //           <h2 className="text-lg mb-3 font-semibold">
// //             Top Merchants - Transaction Count
// //           </h2>
// //           <ResponsiveContainer width="100%" height={250}>
// //             <BarChart data={filtered.slice(0, 5)}>
// //               <XAxis dataKey="name" stroke="#ddd" />
// //               <YAxis stroke="#ddd" />
// //               <Tooltip />
// //               <Bar
// //                 dataKey="paymentMetrics.totalTxnCount"
// //                 fill="#b26bff"
// //               />
// //             </BarChart>
// //           </ResponsiveContainer>
// //         </div>

// //         {/* RIGHT: Pie Chart */}
// //         <div className="bg-white/10 p-4 rounded-xl backdrop-blur border border-white/10">
// //           <h2 className="text-lg mb-3 font-semibold">
// //             Top Merchants - Success Rate
// //           </h2>
// //           <ResponsiveContainer width="100%" height={250}>
// //             <PieChart>
// //               <Pie
// //                 data={filtered.slice(0, 4)}
// //                 dataKey="paymentMetrics.successRate"
// //                 nameKey="name"
// //                 cx="50%"
// //                 cy="50%"
// //                 outerRadius={80}
// //                 label
// //               >
// //                 {filtered.slice(0, 4).map((_, idx) => (
// //                   <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
// //                 ))}
// //               </Pie>
// //               <Tooltip />
// //             </PieChart>
// //           </ResponsiveContainer>
// //         </div>
// //       </div>

// //       {/* MERCHANT CARDS */}
// //       <h2 className="text-xl font-bold mt-8 mb-4">Merchant Details</h2>

// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //         {filtered.map((m) => (
// //           <div
// //             key={m.merchantId}
// //             className="bg-white/10 backdrop-blur-lg p-5 rounded-xl border border-white/10 hover:border-purple-500 transition-all"
// //           >
// //             <h2 className="text-lg font-semibold">{m.name}</h2>
// //             <p className="text-sm text-gray-300">Category: {m.category}</p>

// //             <div className="mt-3 space-y-1 text-sm">
// //               <p>📦 Total Txn: {m.paymentMetrics.totalTxnCount}</p>
// //               <p>💰 Total Value: ₹{m.paymentMetrics.totalTxnValue}</p>
// //               <p>✔ Completed: {m.paymentMetrics.completedCount}</p>
// //               <p>❌ Failed: {m.paymentMetrics.failedCount}</p>
// //               <p>🕒 Initiated: {m.paymentMetrics.initiatedCount}</p>

// //               <p className="mt-2 font-bold text-purple-300">
// //                 🎯 Success Rate: {m.paymentMetrics.successRate}%
// //               </p>

// //               <hr className="my-2 border-white/20" />

// //               <p>↩ Refund Count: {m.refundCount}</p>
// //               <p>↩ Refund Value: ₹{m.refundValue}</p>
// //               <p>🟡 Pending Settlement Amount: ₹{m.pendingSettlementAmount}</p>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// import { useEffect, useState } from "react";
// import api from "../../services/http";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
//   LineChart,
//   Line,
// } from "recharts";

// export default function MerchantDashboard() {
//   const [merchants, setMerchants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [dateRange, setDateRange] = useState({ from: "", to: "" });

//   const COLORS = ["#b26bff", "#d57dff", "#9f4dff", "#c996ff"];

//   // Fetch merchants
//   const fetchMerchantReport = async () => {
//     try {
//       let url = "/api/Report/merchants";

//       // only add dates if chosen
//       if (dateRange.from && dateRange.to) {
//         url += `?from=${dateRange.from}&to=${dateRange.to}`;
//       }

//       const response = await api.get(url);

//       const formatted = response.data.data.map((m) => {
//         const pm = m.paymentMetrics ?? {}; // safe access

//         return {
//           name: m.name,
//           category: m.category,
//           txnCount: pm.totalTxnCount ?? 0,
//           txnValue: pm.totalTxnValue ?? 0,
//           completed: pm.completedCount ?? 0,
//           failed: pm.failedCount ?? 0,
//           initiated: pm.initiatedCount ?? 0,
//           successRate: pm.successRate ?? 0,
//         };
//       });

//       setMerchants(formatted);
//     } catch (err) {
//       console.error("Error fetching merchant report:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Call API on start
//   useEffect(() => {
//     fetchMerchantReport();
//   }, []);

//   // Call again on date change
//   useEffect(() => {
//     if (dateRange.from && dateRange.to) {
//       fetchMerchantReport();
//     }
//   }, [dateRange]);

//   if (loading)
//     return <div className="p-10 text-center text-white">Loading...</div>;

//   return (
//     <div className="p-6 text-white min-h-screen bg-gradient-to-br from-black via-[#12021f] to-[#3d0057]">
//       <h1 className="text-2xl font-bold mb-4">Merchant Performance Dashboard</h1>

//       {/* DATE FILTERS */}
//       <div className="flex gap-6 mb-6 bg-white/10 p-4 rounded-lg border border-white/10">
//         <div>
//           <label className="text-sm">From:</label>
//           <input
//             type="date"
//             className="ml-2 p-2 rounded bg-purple-900/40 border border-purple-400"
//             onChange={(e) =>
//               setDateRange({ ...dateRange, from: e.target.value })
//             }
//           />
//         </div>

//         <div>
//           <label className="text-sm">To:</label>
//           <input
//             type="date"
//             className="ml-2 p-2 rounded bg-purple-900/40 border border-purple-400"
//             onChange={(e) =>
//               setDateRange({ ...dateRange, to: e.target.value })
//             }
//           />
//         </div>
//       </div>

//       {/* 4 Chart Grid */}
//       <div className="grid grid-cols-2 gap-6">

//         {/* 1️⃣ Transaction Count */}
//         <div className="bg-white/10 p-4 rounded-xl border border-white/10">
//           <h2 className="text-lg font-semibold mb-2">Transaction Count</h2>

//           <ResponsiveContainer width="100%" height={250}>
//             <BarChart data={merchants}>
//               <XAxis dataKey="name" stroke="#ccc" />
//               <YAxis stroke="#ccc" />
//               <Tooltip />
//               <Bar dataKey="txnCount" fill="#b26bff" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* 2️⃣ Transaction Value */}
//         <div className="bg-white/10 p-4 rounded-xl border border-white/10">
//           <h2 className="text-lg font-semibold mb-2">Transaction Value (₹)</h2>

//           <ResponsiveContainer width="100%" height={250}>
//             <BarChart data={merchants}>
//               <XAxis dataKey="name" stroke="#ccc" />
//               <YAxis stroke="#ccc" />
//               <Tooltip />
//               <Bar dataKey="txnValue" fill="#9f4dff" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* 3️⃣ Status Pie Chart */}
//         <div className="bg-white/10 p-4 rounded-xl border border-white/10">
//           <h2 className="text-lg font-semibold mb-2">Status Breakdown</h2>

//           <ResponsiveContainer width="100%" height={250}>
//             <PieChart>
//               <Pie
//                 data={[
//                   {
//                     name: "Completed",
//                     value: merchants.reduce((a, b) => a + b.completed, 0),
//                   },
//                   {
//                     name: "Failed",
//                     value: merchants.reduce((a, b) => a + b.failed, 0),
//                   },
//                   {
//                     name: "Initiated",
//                     value: merchants.reduce((a, b) => a + b.initiated, 0),
//                   },
//                 ]}
//                 dataKey="value"
//                 nameKey="name"
//                 outerRadius={90}
//                 label
//               >
//                 {COLORS.map((c, i) => (
//                   <Cell key={i} fill={c} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* 4️⃣ Success Rate Line Chart */}
//         <div className="bg-white/10 p-4 rounded-xl border border-white/10">
//           <h2 className="text-lg font-semibold mb-2">Success Rate Trend</h2>

//           <ResponsiveContainer width="100%" height={250}>
//             <LineChart data={merchants}>
//               <XAxis dataKey="name" stroke="#ccc" />
//               <YAxis stroke="#ccc" />
//               <Tooltip />
//               <Line
//                 type="monotone"
//                 dataKey="successRate"
//                 stroke="#d57dff"
//                 strokeWidth={2}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import api from "../../services/http";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ScatterChart,
  Scatter,
  CartesianGrid,
} from "recharts";

export default function MerchantRefundDashboard() {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const COLORS = ["#a55bff", "#d67bff", "#9c4dff", "#c997ff", "#ff91fa"];

  // Auto-set last 7 days on initial load
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    setDateRange({
      from: lastWeek.toISOString().split("T")[0],
      to: today,
    });
  }, []);

  // Fetch data whenever date changes
  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      fetchMerchantReport();
    }
  }, [dateRange]);

  const fetchMerchantReport = async () => {
    try {
      setLoading(true);

      const url = `/api/Report/merchants?fromUtc=${dateRange.from}T00:00:00.000Z&toUtc=${dateRange.to}T23:59:59.000Z`;

      const response = await api.get(url);

      setMerchants(response.data.data || []);
    } catch (error) {
      console.error("Merchant fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-white text-xl">
        Loading Merchant Refund Dashboard...
      </div>
    );

  return (
    <div className="p-6 text-white min-h-screen bg-gradient-to-br from-black via-[#140022] to-[#470071]">

      <h1 className="text-3xl font-bold mb-4 text-purple-300">
        Merchant Refund & Settlement Dashboard
      </h1>

      {/* DATE FILTERS */}
      <div className="flex flex-wrap gap-6 bg-white/10 p-4 rounded-lg border border-white/20 backdrop-blur">
        <div>
          <label>From:</label>
          <input
            type="date"
            value={dateRange.from}
            className="ml-2 p-2 bg-purple-900/40 border border-purple-400 rounded"
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          />
        </div>

        <div>
          <label>To:</label>
          <input
            type="date"
            value={dateRange.to}
            className="ml-2 p-2 bg-purple-900/40 border border-purple-400 rounded"
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          />
        </div>
      </div>

      {/* CHART GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

        {/* ----------------------------------------------------------------
           1. BAR CHART – Refund Count per Merchant
        ---------------------------------------------------------------- */}
        <div className="bg-white/10 p-4 rounded-lg border border-white/10 backdrop-blur">
          <h2 className="text-lg font-semibold mb-3">
            Refund Count by Merchant
          </h2>

          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={merchants}>
              <XAxis dataKey="name" stroke="#ddd" />
              <YAxis stroke="#ddd" />
              <Tooltip />
              <Bar dataKey="refundCount" fill="#a55bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ----------------------------------------------------------------
           2. LINE CHART – Refund Value Trend
        ---------------------------------------------------------------- */}
        <div className="bg-white/10 p-4 rounded-lg border border-white/10 backdrop-blur">
          <h2 className="text-lg font-semibold mb-3">
            Refund Value Trend (₹)
          </h2>

          <ResponsiveContainer width="100%" height={270}>
            <LineChart data={merchants}>
              <XAxis dataKey="name" stroke="#ddd" />
              <YAxis stroke="#ddd" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="refundValue"
                stroke="#d67bff"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ----------------------------------------------------------------
           3. PIE CHART – Completed vs Failed Txns
        ---------------------------------------------------------------- */}
        <div className="bg-white/10 p-4 rounded-lg border border-white/10 backdrop-blur">
          <h2 className="text-lg font-semibold mb-3">
            Status Breakdown (Completed vs Failed)
          </h2>

          <ResponsiveContainer width="100%" height={270}>
            <PieChart>
              <Pie
                data={[
                  {
                    name: "Completed",
                    value: merchants.reduce(
                      (a, m) => a + m.paymentMetrics.completedCount,
                      0
                    ),
                  },
                  {
                    name: "Failed",
                    value: merchants.reduce(
                      (a, m) => a + m.paymentMetrics.failedCount,
                      0
                    ),
                  },
                ]}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                <Cell fill="#9c4dff" />
                <Cell fill="#ff91fa" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ----------------------------------------------------------------
           4. SCATTER CHART – Refund Count vs Pending Settlement
        ---------------------------------------------------------------- */}
        <div className="bg-white/10 p-4 rounded-lg border border-white/10 backdrop-blur">
          <h2 className="text-lg font-semibold mb-3">
            Refund Count vs Pending Settlement Amount
          </h2>

          <ResponsiveContainer width="100%" height={270}>
            <ScatterChart>
              <CartesianGrid stroke="#555" />
              <XAxis
                dataKey="refundCount"
                name="Refund Count"
                stroke="#ddd"
              />
              <YAxis
                dataKey="pendingSettlementAmount"
                name="Pending Settlement (₹)"
                stroke="#ddd"
              />
              <Tooltip cursor={{ strokeDasharray: "4 4" }} />
              <Scatter data={merchants} fill="#a55bff" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}