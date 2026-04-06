import { useEffect, useMemo, useState } from "react";
import { getTransactionsSimple } from "../../services/transactions/transactionsApi";
import { useIcon } from "../../hooks/useIcon";

function formatCurrency(amount, currency) {
  if (amount == null) return "-";
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount));
  } catch {
    return `${amount} ${currency || ""}`.trim();
  }
}

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  const cfg =
    s === "completed"  ? { bg: "bg-emerald-500/20", text: "text-emerald-300", dot: "bg-emerald-400" } :
    s === "initiated"  ? { bg: "bg-yellow-500/20",  text: "text-yellow-300",  dot: "bg-yellow-400"  } :
    s === "pending"    ? { bg: "bg-blue-500/20",    text: "text-blue-300",    dot: "bg-blue-400"    } :
    s === "failed"     ? { bg: "bg-red-500/20",     text: "text-red-300",     dot: "bg-red-400"     } :
                         { bg: "bg-white/10",       text: "text-slate-300",   dot: "bg-slate-400"   };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status || "-"}
    </span>
  );
}

function TypeBadge({ type }) {
  const t = (type || "").toUpperCase();
  const cfg =
    t === "P2P"    ? { bg: "bg-purple-500/20", text: "text-purple-300" } :
    t === "P2M"    ? { bg: "bg-cyan-500/20",   text: "text-cyan-300"   } :
    t === "REFUND" ? { bg: "bg-orange-500/20", text: "text-orange-300" } :
                     { bg: "bg-white/10",      text: "text-slate-300"  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${cfg.bg} ${cfg.text}`}>
      {type || "-"}
    </span>
  );
}

function Pager({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;
  

  return (
    <div className="flex items-center justify-between mt-4 text-sm">
      <button
        onClick={() => canPrev && onPageChange(page - 1)}
        disabled={!canPrev}
        className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white disabled:opacity-30 hover:bg-white/10 transition"
      >
        Previous
      </button>
      <span className="text-slate-400">
        Page <span className="text-white font-medium">{page}</span> / {totalPages}
        {" · "}
        <span className="text-white font-medium">{total}</span> total
      </span>
      <button
        onClick={() => canNext && onPageChange(page + 1)}
        disabled={!canNext}
        className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white disabled:opacity-30 hover:bg-white/10 transition"
      >
        Next
      </button>
    </div>
  );
}

// export default function TransactionsTable() {
//   const [page, setPage] = useState(1);

//   // 👉 CHANGE #1 — Show 4 rows per page
//   const [pageSize] = useState(4);

//   const [rows, setRows] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");
//   const LoaderIcon = useIcon("Loader");
//   // useEffect(() => {
//   //   let mounted = true;
//   //   (async () => {
//   //     try {
//   //       setLoading(true);
//   //       setErr("");

//   //       // 👉 CHANGE #2 — backend returns { items, total }
//   //       const { items, total } = await getTransactionsSimple(page, pageSize);

//   //       if (!mounted) return;
//   //       setRows(items);
//   //       setTotal(total);
//   //     } catch (e) {
//   //       if (!mounted) return;
//   //       setErr(e?.response?.data?.message || e?.response?.data?.title || e?.message || "Failed to load transactions.");
//   //     } finally {
//   //       if (mounted) setLoading(false);
//   //     }
//   //   })();
//   //   return () => { mounted = false; };
//   // }, [page, pageSize]);


//   useEffect(() => {
//   let mounted = true;
//   (async () => {
//     try {
//       setLoading(true);
//       setErr("");

//       // 1. Get the raw response from your API
//       const response = await getTransactionsSimple(page, pageSize);

//       if (!mounted) return;

//       // 2. 🔥 THE FIX: Check both "total" and "Total" (and "items" vs "Items")
//       // This ensures that even if the backend is PascalCase, the frontend gets the data.
//       const totalCount = response?.total ?? response?.Total ?? 0;
//       const itemList = response?.items ?? response?.Items ?? [];

//       setRows(itemList);
//       setTotal(totalCount); // This will turn "NaN" into a real number like 20
//     } catch (e) {
//       if (mounted) setErr("Failed to load transactions.");
//     } finally {
//       if (mounted) setLoading(false);
//     }
//   })();
//   return () => { mounted = false; };
// }, [page, pageSize]);

//   const pageRows = useMemo(() => rows ?? [], [rows]);

//   return (
//     <div>
//       <div className="mb-3">
//         <h2 className="text-lg font-semibold text-white">Transaction History</h2>
//         <p className="text-sm text-slate-300">All platform transactions</p>
//       </div>

//       {/* {loading && <p className="text-slate-400 py-6 text-center">Loading…</p>} */}

//       {loading && (
//             <tr>
//               <td colSpan={7} className="py-10 text-center">
//                 <div className="flex items-center justify-center">
//                   {LoaderIcon ? (
//                     <LoaderIcon className="animate-spin text-blue-500" size={40} />
//                   ) : (
//                     "Loading..."
//                   )}
//                 </div>
//               </td>
//             </tr>
//           )}

//       {!loading && err && <p className="text-red-400 py-4">{err}</p>}
//       {!loading && !err && pageRows.length === 0 && (
//         <p className="text-slate-400 py-6 text-center">No transactions found.</p>
//       )}

//       {!loading && !err && pageRows.length > 0 && (
//         <>
//           <div className="overflow-auto border border-white/10 backdrop-blur-lg rounded-xl bg-white/5">
//             <table className="min-w-full text-sm text-slate-200">
//               <thead className="bg-white/10 text-slate-100">
//                 <tr className="text-left">
//                   <th className="px-4 py-3">TXN ID</th>
//                   <th className="px-4 py-3">From Wallet</th>
//                   <th className="px-4 py-3">To Wallet</th>
//                   <th className="px-4 py-3">Amount</th>
//                   <th className="px-4 py-3">Type</th>
//                   <th className="px-4 py-3">Status</th>
//                   <th className="px-4 py-3">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pageRows.map((r) => {
//                   const id = r.transactionId ?? r.transactionID;
//                   return (
//                     <tr key={id ?? Math.random()} className="border-t border-white/10 hover:bg-white/10 transition">
//                       <td className="px-4 py-3 font-mono text-purple-300">
//                         TXN{String(id ?? "-").padStart(4, "0")}
//                       </td>
//                       <td className="px-4 py-3">{r.fromWalletId ?? r.fromWalletID ?? "-"}</td>
//                       <td className="px-4 py-3">{r.toWalletId ?? r.toWalletID ?? "-"}</td>
//                       <td className="px-4 py-3 font-semibold text-white">
//                         {formatCurrency(r.amount, r.currency)}
//                       </td>
//                       <td className="px-4 py-3"><TypeBadge type={r.transactionType} /></td>
//                       <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
//                       <td className="px-4 py-3 text-slate-400">
//                         {r.transactionDate ? new Date(r.transactionDate).toLocaleString() : "-"}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           <Pager page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
//         </>
//       )}
//     </div>
//   );
// }


export default function TransactionsTable() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(4);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const LoaderIcon = useIcon("Loader");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");

        const response = await getTransactionsSimple(page, pageSize);

        if (!mounted) return;

        // 🔥 THE FIX: Access .data if using Axios, otherwise use response directly
        const result = response?.data ?? response;

        // 🔥 Handle both PascalCase (from .NET) and camelCase
        const totalCount = result?.total ?? result?.Total ?? 0;
        const itemList = result?.items ?? result?.Items ?? [];

        setRows(itemList);
        setTotal(totalCount); 
      } catch (e) {
        if (mounted) setErr("Failed to load transactions.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [page, pageSize]);

  const pageRows = useMemo(() => rows ?? [], [rows]);

  return (
    <div>
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-white">Transaction History</h2>
        <p className="text-sm text-slate-300">All platform transactions</p>
      </div>

      {err && <p className="text-red-400 py-4">{err}</p>}

      {/* Table Container - Keep this visible so the layout doesn't jump */}
      <div className="overflow-auto border border-white/10 backdrop-blur-lg rounded-xl bg-white/5">
        <table className="min-w-full text-sm text-slate-200">
          <thead className="bg-white/10 text-slate-100">
            <tr className="text-left">
              <th className="px-4 py-3">TXN ID</th>
              <th className="px-4 py-3">From Wallet</th>
              <th className="px-4 py-3">To Wallet</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // ✅ Loader properly inside <tbody>
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  <div className="flex justify-center">
                    {LoaderIcon ? <LoaderIcon className="animate-spin text-blue-500" size={40} /> : "Loading..."}
                  </div>
                </td>
              </tr>
            ) : pageRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">No transactions found.</td>
              </tr>
            ) : (
              pageRows.map((r) => {
                const id = r.transactionId ?? r.transactionID;
                return (
                  <tr key={id ?? Math.random()} className="border-t border-white/10 hover:bg-white/10 transition">
                    <td className="px-4 py-3 font-mono text-purple-300">
                      TXN{String(id ?? "-").padStart(4, "0")}
                    </td>
                    <td className="px-4 py-3">{r.fromWalletId ?? r.fromWalletID ?? "-"}</td>
                    <td className="px-4 py-3">{r.toWalletId ?? r.toWalletID ?? "-"}</td>
                    <td className="px-4 py-3 font-semibold text-white">
                      {formatCurrency(r.amount, r.currency)}
                    </td>
                    <td className="px-4 py-3"><TypeBadge type={r.transactionType} /></td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-slate-400">
                      {r.transactionDate ? new Date(r.transactionDate).toLocaleString() : "-"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Only show Pager if we have data or at least one page exists */}
      {!loading && (
        <Pager page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
      )}
    </div>
  );
}