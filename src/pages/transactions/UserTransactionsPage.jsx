
// // src/pages/transactions/UserTransactionsPage.jsx
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import { jsPDF } from "jspdf";
// import autoTable from "jspdf-autotable";
// import { getUserHistory } from "../../services/transactions/transactionsApi";
// import HistoryTable from "../../components/transactions/HistoryTable.jsx";
// import TransactionDetailsPanel from "../../components/transactions/TransactionDetailsPanel.jsx";
// import TransactionReport from "../../components/transactions/TransactionReport.jsx";
// import { Search, Filter, ChevronDown, Download } from "lucide-react";

// export default function UserTransactionsPage() {
//   const userId = useSelector((s) => s.auth?.userId);
//   const [selectedId, setSelectedId] = useState(null);

//   // Filters
//   const [direction, setDirection] = useState("all");
//   const [sortBy, setSortBy] = useState("date");
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(20);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all"); // NEW: Status filter to show/hide failed

//   // Data
//   const [data, setData] = useState(null);
//   const [busy, setBusy] = useState(false);
//   const [err, setErr] = useState("");
//   const [filteredData, setFilteredData] = useState(null);
//   const [downloading, setDownloading] = useState(false);

//   // Filter data by search term AND status
//   useEffect(() => {
//     if (!data) {
//       setFilteredData(null);
//       return;
//     }

//     let filtered = {
//       ...data,
//       items: data.items.filter((t) => {
//         const id = String(t.TransactionID ?? t.transactionID ?? t.transactionId ?? "");
//         const type = String(t.TransactionType ?? t.transactionType ?? "");
//         const status = String(t.Status ?? t.status ?? "");
//         const amount = String(t.Amount ?? t.amount ?? "");
//         const searchLower = searchTerm.toLowerCase();

//         // Search filter
//         const matchesSearch = !searchTerm.trim() || (
//           id.toLowerCase().includes(searchLower) ||
//           type.toLowerCase().includes(searchLower) ||
//           status.toLowerCase().includes(searchLower) ||
//           amount.toLowerCase().includes(searchLower)
//         );

//         // Status filter
//         let matchesStatus = true;
//         if (statusFilter !== "all") {
//           matchesStatus = status.toLowerCase() === statusFilter.toLowerCase();
//         }

//         return matchesSearch && matchesStatus;
//       }),
//     };

//     setFilteredData(filtered);
//   }, [data, searchTerm, statusFilter]);

//   async function load() {
//     if (!userId) return;
//     setBusy(true);
//     setErr("");

//     try {
//       console.log("[UserTransactionsPage] Loading history with params:", {
//         userId,
//         direction,
//         sortBy,
//         page,
//         pageSize,
//         status: "all"
//       });
      
//       const res = await getUserHistory(userId, {
//         direction,
//         sortBy,
//         page,
//         pageSize,
//         status: "all" // Include both Completed and Failed transactions
//       });
      
//       console.log("[UserTransactionsPage] History loaded. Total items:", res?.items?.length, "Items:", res?.items);
//       console.log("[UserTransactionsPage] Failed transactions:", res?.items?.filter(t => String(t.Status || t.status || "").toLowerCase() === "failed"));
      
//       setData(res);
//     } catch (e) {
//       const msg =
//         e?.response?.data?.detail ||
//         e?.message ||
//         "Failed to load transaction history";
//       setErr(msg);
//       console.error("[Transactions] Error:", e?.response?.data || e);
//     } finally {
//       setBusy(false);
//     }
//   }

//   useEffect(() => {
//     load();
//     // eslint-disable-next-line
//   }, [userId, direction, sortBy, page, pageSize]);

//   const handleDownloadPDF = async () => {
//     if (!data || !data.items || data.items.length === 0) {
//       toast.error("No transactions to download");
//       return;
//     }

//     try {
//       setDownloading(true);
//       toast.loading("Generating PDF...");

//       // Format currency helper - simplified for PDF compatibility
//       const formatCurrency = (amount) => {
//         if (amount == null || amount === "") return "-";
//         const num = parseFloat(amount);
//         if (isNaN(num)) return "-";
//         return num.toFixed(2);
//       };

//       // Prepare table data
//       const tableData = data.items.map((t) => {
//         const txnId = t.TransactionID ?? t.transactionID ?? t.transactionId ?? "-";
//         return [
//           `TXN${String(txnId).padStart(4, "0")}`,
//           t.FromWalletID ?? t.fromWalletID ?? "-",
//           t.ToWalletID ?? t.toWalletID ?? "-",
//           `INR ${formatCurrency(t.Amount ?? t.amount)}`,
//           t.TransactionType ?? t.transactionType ?? "-",
//           t.Status ?? t.status ?? "-",
//           t.TransactionDate
//             ? new Date(t.TransactionDate).toLocaleString()
//             : "-",
//         ];
//       });

//       // Create PDF
//       const doc = new jsPDF();
//       doc.setFontSize(16);
//       doc.text("Transaction History Report", 14, 15);

//       doc.setFontSize(10);
//       doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 25);
//       doc.text(`Total Transactions: ${data.items.length}`, 14, 32);

//       // Add table
//       autoTable(doc, {
//         startY: 40,
//         head: [
//           [
//             "TXN ID",
//             "From Wallet",
//             "To Wallet",
//             "Amount",
//             "Type",
//             "Status",
//             "Date",
//           ],
//         ],
//         body: tableData,
//         styles: {
//           fontSize: 9,
//           cellPadding: 3,
//           overflow: "linebreak",
//         },
//         headStyles: {
//           fillColor: [99, 102, 241],
//           textColor: [255, 255, 255],
//           fontStyle: "bold",
//         },
//         alternateRowStyles: {
//           fillColor: [242, 242, 242],
//         },
//         margin: { top: 40, right: 14, bottom: 14, left: 14 },
//       });

//       // Save PDF
//       doc.save(
//         `transaction-history-${new Date().toISOString().split("T")[0]}.pdf`
//       );
//       toast.dismiss();
//       toast.success("Transaction history downloaded!");
//     } catch (error) {
//       toast.dismiss();
//       console.error("Download error:", error);
//       toast.error(error?.message || "Failed to download transactions");
//     } finally {
//       setDownloading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-8">
//       {/* Header */}
//       <div className="mb-8 flex items-center justify-between">
//         <div>
//           <h1 className="text-4xl font-bold text-white mb-2">Transactions</h1>
//           <p className="text-slate-400">View and manage your complete transaction history</p>
//         </div>
//         <button
//           onClick={handleDownloadPDF}
//           disabled={downloading || busy || !data || data.items?.length === 0}
//           className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 h-fit"
//         >
//           <Download size={18} />
//           {downloading ? "Downloading..." : "Download PDF"}
//         </button>
//       </div>

//       {/* Floating details panel - overlays the table without affecting layout */}
//       {selectedId && (
//         <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl mx-auto">
//           <TransactionDetailsPanel
//             id={selectedId}
//             onClose={() => {
//               setSelectedId(null);
//             }}
//           />
//         </div>
//       )}

//       {/* Error State */}
//       {err && (
//         <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
//           <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//           <p className="text-red-400">{err}</p>
//         </div>
//       )}

//       {/* Debug Info */}
//       {data && (
//         <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-300 text-sm">
//           <p><strong>Current User ID:</strong> {userId}</p>
//           <p><strong>First Transaction From/To:</strong> {data.items?.[0]?.FromWalletID ?? "N/A"} → {data.items?.[0]?.ToWalletID ?? "N/A"}</p>
//           <p><strong>Total Transactions:</strong> {data.items?.length}</p>
//         </div>
//       )}

//       {/* Transaction Report */}
//       {!busy && !err && data && (
//         <TransactionReport data={data} />
//       )}

//       {/* Filters Card */}
//       <div className="mb-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-xl">
//         <div className="flex items-center gap-2 mb-4">
//           <Filter size={18} className="text-teal-400" />
//           <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
//             Filters & Search
//           </h2>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
//           {/* Search Box */}
//           <div className="lg:col-span-2 relative">
//             <Search
//               size={16}
//               className="absolute left-3 top-3 text-slate-500"
//             />
//             <input
//               type="text"
//               placeholder="Search transaction ID..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-9 pr-3 py-2 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:border-teal-400/50 transition"
//             />
//           </div>

//           {/* Direction Filter */}
//           <div className="relative">
//             <select
//               value={direction}
//               onChange={(e) => {
//                 setDirection(e.target.value);
//                 setPage(1);
//               }}
//               className="w-full appearance-none pl-3 pr-8 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-teal-400/50 transition cursor-pointer"
//             >
//               <option value="all">All Transactions</option>
//               <option value="sent">Sent</option>
//               <option value="received">Received</option>
//             </select>
//             <ChevronDown
//               size={16}
//               className="absolute right-2 top-3 pointer-events-none text-slate-500"
//             />
//           </div>

//           {/* Status Filter - NEW */}
//           <div className="relative">
//             <select
//               value={statusFilter}
//               onChange={(e) => {
//                 setStatusFilter(e.target.value);
//                 setPage(1);
//               }}
//               className="w-full appearance-none pl-3 pr-8 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-teal-400/50 transition cursor-pointer"
//             >
//               <option value="all">All Status</option>
//               <option value="Completed">Completed Only</option>
//               <option value="Failed">Failed Only</option>
//             </select>
//             <ChevronDown
//               size={16}
//               className="absolute right-2 top-3 pointer-events-none text-slate-500"
//             />
//           </div>

//           {/* Sort By Filter */}
//           <div className="relative">
//             <select
//               value={sortBy}
//               onChange={(e) => {
//                 setSortBy(e.target.value);
//                 setPage(1);
//               }}
//               className="w-full appearance-none pl-3 pr-8 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-teal-400/50 transition cursor-pointer"
//             >
//               <option value="date">Date (Newest)</option>
//               <option value="amount">Amount (High to Low)</option>
//               <option value="direction">Direction</option>
//             </select>
//             <ChevronDown
//               size={16}
//               className="absolute right-2 top-3 pointer-events-none text-slate-500"
//             />
//           </div>

//           {/* Page Size Filter */}
//           <div className="relative">
//             <select
//               value={pageSize}
//               onChange={(e) => {
//                 setPageSize(Math.min(100, Math.max(1, +e.target.value)));
//                 setPage(1);
//               }}
//               className="w-full appearance-none pl-3 pr-8 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-teal-400/50 transition cursor-pointer"
//             >
//               <option value={10}>10 per page</option>
//               <option value={20}>20 per page</option>
//               <option value={50}>50 per page</option>
//               <option value={100}>100 per page</option>
//             </select>
//             <ChevronDown
//               size={16}
//               className="absolute right-2 top-3 pointer-events-none text-slate-500"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Loading State */}
//       {busy && (
//         <div className="flex items-center justify-center py-12">
//           <div className="flex flex-col items-center gap-3">
//             <div className="w-8 h-8 border-4 border-slate-700 border-t-teal-400 rounded-full animate-spin"></div>
//             <p className="text-slate-400">Loading transactions...</p>
//           </div>
//         </div>
//       )}

//       {/* Table */}
//       {!busy && !err && data && (
//         <HistoryTable
//           data={filteredData || data}
//           page={page}
//           onPrev={() => setPage((p) => Math.max(1, p - 1))}
//           onNext={() =>
//             setPage((p) => (p * (filteredData || data).pageSize < (filteredData || data).total ? p + 1 : p))
//           }
//           onView={(id) => setSelectedId(id)}
//         />
//       )}
//     </div>
//   );
// }

// // src/pages/transactions/UserTransactionsPage.jsx
// import { useEffect, useState } from "react";
// // import { useAuth } from "../../context/AuthContext.jsx";
// import { useSelector } from "react-redux";
// import { getUserHistory } from "../../services/transactions/transactionsApi";
// import HistoryTable from "../../components/transactions/HistoryTable.jsx";
// import TransactionDetailsPanel from "../../components/transactions/TransactionDetailsPanel.jsx";

// export default function UserTransactionsPage() {
//   // const { auth } = useAuth();
//   // const userId = auth?.userId;
//    const userId = useSelector((s) => s.auth?.userId);
//   // Inline details state
//   const [selectedId, setSelectedId] = useState(null);

//   // Filters
//   const [direction, setDirection] = useState("all");   // sent | received | all
//   const [sortBy, setSortBy]       = useState("date");  // date | amount | direction
//   const [page, setPage]           = useState(1);
//   const [pageSize, setPageSize]   = useState(20);

//   // Data
//   const [data, setData] = useState(null);
//   const [busy, setBusy] = useState(false);
//   const [err, setErr]   = useState("");

//   async function load() {
//     if (!userId) return;
//     setBusy(true);
//     setErr("");

//     try {
//       const res = await getUserHistory(userId, {
//         direction,
//         sortBy,
//         page,
//         pageSize,
//       });
//       setData(res);
//     } catch (e) {
//       const msg =
//         e?.response?.data?.detail ||
//         e?.message ||
//         "Failed to load transaction history";
//       setErr(msg);
//       console.error("[Transactions] Error:", e?.response?.data || e);
//     } finally {
//       setBusy(false);
//     }
//   }

//   useEffect(() => {
//     load();
//     // eslint-disable-next-line
//   }, [userId, direction, sortBy, page, pageSize]);

//   return (
//     <div className="px-6 py-4">
//       <h2 className="text-xl font-semibold mb-1">Transactions</h2>
//       <p className="text-slate-500 mb-4">View your transaction history</p>

//       {/* Inline details panel */}
//       {selectedId && (
//         <TransactionDetailsPanel
//           id={selectedId}
//           onClose={() => setSelectedId(null)}
//         />
//       )}

//       {/* Filters */}
//       <div className="flex flex-wrap items-center gap-2 mb-3">
//         <select
//           value={direction}
//           onChange={(e) => {
//             setDirection(e.target.value);
//             setPage(1);
//           }}
//           className="border rounded px-2 py-1"
//         >
//           <option value="all">All</option>
//           <option value="sent">Sent</option>
//           <option value="received">Received</option>
//         </select>

//         <select
//           value={sortBy}
//           onChange={(e) => {
//             setSortBy(e.target.value);
//             setPage(1);
//           }}
//           className="border rounded px-2 py-1"
//         >
//           <option value="date">Sort: Date (newest)</option>
//           <option value="amount">Sort: Amount (high → low)</option>
//           <option value="direction">Sort: Direction (sent first)</option>
//         </select>

//         <select
//           value={pageSize}
//           onChange={(e) => {
//             setPageSize(Math.min(100, Math.max(1, +e.target.value)));
//             setPage(1);
//           }}
//           className="border rounded px-2 py-1"
//         >
//           <option value={10}>10</option>
//           <option value={20}>20</option>
//           <option value={50}>50</option>
//           <option value={100}>100</option>
//         </select>

//         <button
//           onClick={() => setPage(1)}
//           className="ml-1 border rounded px-3 py-1"
//         >
//           Apply
//         </button>
//       </div>

//       {/* State */}
//       {busy && <p>Loading…</p>}
//       {err && <p className="text-red-600">Error: {err}</p>}

//       {!busy && !err && data && (
//         <HistoryTable
//           data={data}
//           page={page}
//           onPrev={() => setPage((p) => Math.max(1, p - 1))}
//           onNext={() =>
//             setPage((p) => (p * data.pageSize < data.total ? p + 1 : p))
//           }
//           onView={(id) => setSelectedId(id)}
//         />
//       )}
//     </div>
//   );
// }


// src/pages/transactions/UserTransactionsPage.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { getUserHistory } from "../../services/transactions/transactionsApi";
import HistoryTable from "../../components/transactions/HistoryTable.jsx";
import TransactionDetailsPanel from "../../components/transactions/TransactionDetailsPanel.jsx";
import TransactionReport from "../../components/transactions/TransactionReport.jsx";
import { Search, Filter, ChevronDown, Download } from "lucide-react";

export default function UserTransactionsPage() {
  const userId = useSelector((s) => s.auth?.userId);
  const [selectedId, setSelectedId] = useState(null);

  // Filters
  const [direction, setDirection] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // NEW: Status filter to show/hide failed

  // Data
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const [downloading, setDownloading] = useState(false);

  // Filter data by search term AND status
  useEffect(() => {
    if (!data) {
      setFilteredData(null);
      return;
    }

    let filtered = {
      ...data,
      items: data.items.filter((t) => {
        const id = String(t.TransactionID ?? t.transactionID ?? t.transactionId ?? "");
        const type = String(t.TransactionType ?? t.transactionType ?? "");
        const status = String(t.Status ?? t.status ?? "");
        const amount = String(t.Amount ?? t.amount ?? "");
        const searchLower = searchTerm.toLowerCase();

        // Search filter
        const matchesSearch = !searchTerm.trim() || (
          id.toLowerCase().includes(searchLower) ||
          type.toLowerCase().includes(searchLower) ||
          status.toLowerCase().includes(searchLower) ||
          amount.toLowerCase().includes(searchLower)
        );

        // Status filter
        let matchesStatus = true;
        if (statusFilter !== "all") {
          matchesStatus = status.toLowerCase() === statusFilter.toLowerCase();
        }

        return matchesSearch && matchesStatus;
      }),
    };

    setFilteredData(filtered);
  }, [data, searchTerm, statusFilter]);

  async function load() {
    if (!userId) return;
    setBusy(true);
    setErr("");

    try {
      console.log("[UserTransactionsPage] Loading history with params:", {
        userId,
        direction,
        sortBy,
        page,
        pageSize,
        status: "all"
      });
      
      const res = await getUserHistory(userId, {
        direction,
        sortBy,
        page,
        pageSize,
        status: "all" // Include both Completed and Failed transactions
      });
      
      console.log("[UserTransactionsPage] History loaded. Total items:", res?.items?.length, "Items:", res?.items);
      console.log("[UserTransactionsPage] Failed transactions:", res?.items?.filter(t => String(t.Status || t.status || "").toLowerCase() === "failed"));
      
      setData(res);
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        e?.message ||
        "Failed to load transaction history";
      setErr(msg);
      console.error("[Transactions] Error:", e?.response?.data || e);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [userId, direction, sortBy, page, pageSize]);

  const handleDownloadPDF = async () => {
    if (!data || !data.items || data.items.length === 0) {
      toast.error("No transactions to download");
      return;
    }

    try {
      setDownloading(true);
      toast.loading("Generating PDF...");

      // Format currency helper - simplified for PDF compatibility
      const formatCurrency = (amount) => {
        if (amount == null || amount === "") return "-";
        const num = parseFloat(amount);
        if (isNaN(num)) return "-";
        return num.toFixed(2);
      };

      // Prepare table data
      const tableData = data.items.map((t) => {
        const txnId = t.TransactionID ?? t.transactionID ?? t.transactionId ?? "-";
        return [
          `TXN${String(txnId).padStart(4, "0")}`,
          t.FromWalletID ?? t.fromWalletID ?? "-",
          t.ToWalletID ?? t.toWalletID ?? "-",
          `INR ${formatCurrency(t.Amount ?? t.amount)}`,
          t.TransactionType ?? t.transactionType ?? "-",
          t.Status ?? t.status ?? "-",
          t.TransactionDate
            ? new Date(t.TransactionDate).toLocaleString()
            : "-",
        ];
      });

      // Create PDF
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Transaction History Report", 14, 15);

      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 25);
      doc.text(`Total Transactions: ${data.items.length}`, 14, 32);

      // Add table
      autoTable(doc, {
        startY: 40,
        head: [
          [
            "TXN ID",
            "From Wallet",
            "To Wallet",
            "Amount",
            "Type",
            "Status",
            "Date",
          ],
        ],
        body: tableData,
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [99, 102, 241],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [242, 242, 242],
        },
        margin: { top: 40, right: 14, bottom: 14, left: 14 },
      });

      // Save PDF
      doc.save(
        `transaction-history-${new Date().toISOString().split("T")[0]}.pdf`
      );
      toast.dismiss();
      toast.success("Transaction history downloaded!");
    } catch (error) {
      toast.dismiss();
      console.error("Download error:", error);
      toast.error(error?.message || "Failed to download transactions");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Transactions</h1>
          <p className="text-slate-400">View and manage your complete transaction history</p>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={downloading || busy || !data || data.items?.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 h-fit"
        >
          <Download size={18} />
          {downloading ? "Downloading..." : "Download PDF"}
        </button>
      </div>

      {/* Floating details panel - overlays the table without affecting layout */}
      {selectedId && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl mx-auto">
          <TransactionDetailsPanel
            id={selectedId}
            onClose={() => {
              setSelectedId(null);
            }}
          />
        </div>
      )}

      {/* Error State */}
      {err && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <p className="text-red-400">{err}</p>
        </div>
      )}

      {/* Debug Info */}
      {data && (
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-300 text-sm">
          <p><strong>Current User ID:</strong> {userId}</p>
          <p><strong>First Transaction From/To:</strong> {data.items?.[0]?.FromWalletID ?? "N/A"} → {data.items?.[0]?.ToWalletID ?? "N/A"}</p>
          <p><strong>Total Transactions:</strong> {data.items?.length}</p>
        </div>
      )}

      {/* Transaction Report */}
      {!busy && !err && data && (
        <TransactionReport data={data} />
      )}

      {/* Filters Card */}
      <div className="mb-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-teal-400" />
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
            Filters & Search
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search
              size={16}
              className="absolute left-3 top-3 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:border-teal-400/50 transition"
            />
          </div>

          {/* Direction Filter */}
          <div className="relative">
            <select
              value={direction}
              onChange={(e) => {
                setDirection(e.target.value);
                setPage(1);
              }}
              className="w-full appearance-none pl-3 pr-8 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-teal-400/50 transition cursor-pointer"
            >
              <option value="all">All Transactions</option>
              <option value="sent">Sent</option>
              <option value="received">Received</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-2 top-3 pointer-events-none text-slate-500"
            />
          </div>

          {/* Status Filter - NEW */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full appearance-none pl-3 pr-8 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-teal-400/50 transition cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="Completed">Completed Only</option>
              <option value="Failed">Failed Only</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-2 top-3 pointer-events-none text-slate-500"
            />
          </div>

          {/* Sort By Filter */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full appearance-none pl-3 pr-8 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-teal-400/50 transition cursor-pointer"
            >
              <option value="date">Date (Newest)</option>
              <option value="amount">Amount (High to Low)</option>
              <option value="direction">Direction</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-2 top-3 pointer-events-none text-slate-500"
            />
          </div>

          {/* Page Size Filter */}
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Math.min(100, Math.max(1, +e.target.value)));
                setPage(1);
              }}
              className="w-full appearance-none pl-3 pr-8 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-teal-400/50 transition cursor-pointer"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-2 top-3 pointer-events-none text-slate-500"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {busy && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-slate-700 border-t-teal-400 rounded-full animate-spin"></div>
            <p className="text-slate-400">Loading transactions...</p>
          </div>
        </div>
      )}

      {/* Table */}
      {!busy && !err && data && (
        <HistoryTable
          data={filteredData || data}
          page={page}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() =>
            setPage((p) => (p * (filteredData || data).pageSize < (filteredData || data).total ? p + 1 : p))
          }
          onView={(id) => setSelectedId(id)}
        />
      )}
    </div>
  );
}