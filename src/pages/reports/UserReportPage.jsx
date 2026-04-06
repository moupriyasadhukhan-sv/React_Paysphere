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
// } from "recharts";

// export default function UserReportPage() {
//   const [users, setUsers] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [sortType, setSortType] = useState("txnCount");
//   const [dateRange, setDateRange] = useState({
//     from: "",
//     to: "",
//   });

//   const COLORS = ["#b26bff", "#d57dff", "#9f4dff", "#c996ff"];

//   useEffect(() => {
//     fetchUserReport();
//   }, []);

//   // Fetch report
//   const fetchUserReport = async () => {
//     try {
//       const response = await api.get("/api/Report/users");
//       setUsers(response.data.data);
//       setFiltered(response.data.data);
//     } catch (err) {
//       console.error("Error fetching user report:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Sorting logic
//   useEffect(() => {
//     let sorted = [...users];

//     if (sortType === "txnCount") {
//       sorted.sort(
//         (a, b) => b.metrics.totalTxnCount - a.metrics.totalTxnCount
//       );
//     } else if (sortType === "txnValue") {
//       sorted.sort((a, b) => b.metrics.totalTxnValue - a.metrics.totalTxnValue);
//     }

//     setFiltered(sorted);
//   }, [sortType, users]);

//   // If loading
//   if (loading)
//     return <div className="p-10 text-center text-white">Loading...</div>;

//   return (
//     <div className="p-6 text-white min-h-screen bg-gradient-to-br from-black via-[#12021f] to-[#3d0057]">
//       <h1 className="text-2xl font-bold mb-4">User Performance Report</h1>

//       {/* FILTERS */}
//       <div className="flex flex-wrap justify-between items-center mb-6 bg-white/10 p-4 rounded-lg backdrop-blur border border-white/10">
//         <div>
//           <label className="text-sm">Sort By:</label>
//           <select
//             className="ml-2 p-2 rounded bg-purple-900/40 border border-purple-400"
//             value={sortType}
//             onChange={(e) => setSortType(e.target.value)}
//           >
//             <option value="txnCount">Highest Transaction Count</option>
//             <option value="txnValue">Highest Transaction Value</option>
//           </select>
//         </div>

//         <div className="flex gap-3">
//           <div>
//             <label className="text-sm">From:</label>
//             <input
//               type="date"
//               className="ml-2 p-2 rounded bg-purple-900/40 border border-purple-400"
//               onChange={(e) =>
//                 setDateRange({ ...dateRange, from: e.target.value })
//               }
//             />
//           </div>

//           <div>
//             <label className="text-sm">To:</label>
//             <input
//               type="date"
//               className="ml-2 p-2 rounded bg-purple-900/40 border border-purple-400"
//               onChange={(e) =>
//                 setDateRange({ ...dateRange, to: e.target.value })
//               }
//             />
//           </div>
//         </div>
//       </div>

//       {/* KPI CHARTS */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//         {/* LEFT: Bar Chart */}
//         <div className="bg-white/10 p-4 rounded-xl backdrop-blur border border-white/10">
//           <h2 className="text-lg mb-3 font-semibold">Top Users - Transaction Count</h2>
//           <ResponsiveContainer width="100%" height={250}>
//             <BarChart data={filtered.slice(0, 5)}>
//               <XAxis dataKey="name" stroke="#ddd" />
//               <YAxis stroke="#ddd" />
//               <Tooltip />
//               <Bar dataKey="metrics.totalTxnCount" fill="#b26bff" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* RIGHT: Pie Chart */}
//         <div className="bg-white/10 p-4 rounded-xl backdrop-blur border border-white/10">
//           <h2 className="text-lg mb-3 font-semibold">Top Users - Success Rate</h2>
//           <ResponsiveContainer width="100%" height={250}>
//             <PieChart>
//               <Pie
//                 data={filtered.slice(0, 4)}
//                 dataKey="metrics.successRate"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={80}
//                 label
//               >
//                 {filtered.slice(0, 4).map((_, idx) => (
//                   <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* USER CARDS */}
//       <h2 className="text-xl font-bold mt-8 mb-4">User Details</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {filtered.map((u) => (
//           <div
//             key={u.userId}
//             className="bg-white/10 backdrop-blur-lg p-5 rounded-xl border border-white/10 hover:border-purple-500 transition-all"
//           >
//             <h2 className="text-lg font-semibold">{u.name}</h2>
//             <p className="text-sm text-gray-300">{u.email}</p>

//             <div className="mt-3 space-y-1 text-sm">
//               <p>📦 Total Txn: {u.metrics.totalTxnCount}</p>
//               <p>💰 Total Value: ₹{u.metrics.totalTxnValue}</p>
//               <p>✔ Completed: {u.metrics.completedCount}</p>
//               <p>❌ Failed: {u.metrics.failedCount}</p>
//               <p>🕒 Initiated: {u.metrics.initiatedCount}</p>

//               <p className="mt-2 font-bold text-purple-300">
//                 🎯 Success Rate: {u.metrics.successRate.toFixed(2)}%
//               </p>
//             </div>
//           </div>
//         ))}
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

export default function UserReportCharts() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const COLORS = ["#a55bff", "#d67bff", "#9c4dff", "#c997ff", "#f88aff"];

  // ----------------------------------------------------------
  // AUTO-LOAD: last 7 days on mount
  // ----------------------------------------------------------
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const lastWeekDate = lastWeek.toISOString().split("T")[0];

    setDateRange({
      from: lastWeekDate,
      to: today,
    });
  }, []);

  // ----------------------------------------------------------
  // LOAD DATA whenever date changes
  // ----------------------------------------------------------
  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      fetchUserReport();
    }
  }, [dateRange]);

  // ----------------------------------------------------------
  // FETCH API
  // ----------------------------------------------------------
  const fetchUserReport = async () => {
    try {
      setLoading(true);

      const url = `/api/Report/users?fromUtc=${dateRange.from}T00:00:00.000Z&toUtc=${dateRange.to}T23:59:59.000Z`;

      const response = await api.get(url);

      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching user report:", error);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------
  // LOADING SCREEN
  // ----------------------------------------------------------
  if (loading)
    return (
      <div className="p-10 text-center text-white text-xl">
        Loading data...
      </div>
    );

  // ----------------------------------------------------------
  // RENDER UI
  // ----------------------------------------------------------
  return (
    <div className="p-6 text-white min-h-screen bg-gradient-to-br from-black via-[#150022] to-[#3d0066]">

      <h1 className="text-3xl font-bold mb-4 text-purple-300">
        User Transaction Analytics Dashboard
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

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

        {/* ----------------------------------------------------------
            CHART 1 — BAR (Transaction Count)
        ---------------------------------------------------------- */}
        <div className="bg-white/10 p-4 rounded-lg border border-white/10 backdrop-blur">
          <h2 className="text-lg font-semibold mb-3">
            Transaction Count (Top Users)
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={users.slice(0, 8)}>
              <XAxis dataKey="name" stroke="#ddd" />
              <YAxis stroke="#ddd" />
              <Tooltip />
              <Bar dataKey="metrics.totalTxnCount" fill="#a55bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ----------------------------------------------------------
            CHART 2 — LINE (Transaction Value Trend)
        ---------------------------------------------------------- */}
        <div className="bg-white/10 p-4 rounded-lg border border-white/10 backdrop-blur">
          <h2 className="text-lg font-semibold mb-3">
            Transaction Value (Line Chart)
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={users}>
              <XAxis dataKey="name" stroke="#ddd" />
              <YAxis stroke="#ddd" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="metrics.totalTxnValue"
                stroke="#d67bff"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ----------------------------------------------------------
            CHART 3 — PIE (Success Rate %)
        ---------------------------------------------------------- */}
        <div className="bg-white/10 p-4 rounded-lg border border-white/10 backdrop-blur">
          <h2 className="text-lg font-semibold mb-3">
            Success Rate (Pie Chart)
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={users.slice(0, 5)}
                dataKey="metrics.successRate"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {users.slice(0, 5).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ----------------------------------------------------------
            CHART 4 — SCATTER (Count vs Value)
        ---------------------------------------------------------- */}
        <div className="bg-white/10 p-4 rounded-lg border border-white/10 backdrop-blur">
          <h2 className="text-lg font-semibold mb-3">
            Scatter Plot — Count vs Value
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart>
              <CartesianGrid stroke="#555" />
              <XAxis
                dataKey="metrics.totalTxnCount"
                name="Transaction Count"
                stroke="#ddd"
              />
              <YAxis
                dataKey="metrics.totalTxnValue"
                name="Transaction Value"
                stroke="#ddd"
              />
              <Tooltip cursor={{ strokeDasharray: "4 4" }} />
              <Scatter data={users} fill="#9c4dff" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}