// // src/components/transactions/HistoryTable.jsx
// import React from "react";
// import { ChevronRight, ChevronLeft, Eye } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const getStatusColor = (status) => {
//   if (!status) return "bg-slate-500/10 text-slate-300";
//   const statusStr = String(status).toLowerCase();
//   if (statusStr.includes("completed")) return "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30";
//   if (statusStr.includes("pending")) return "bg-yellow-500/10 text-yellow-300 border border-yellow-500/30";
//   if (statusStr.includes("failed")) return "bg-red-500/10 text-red-300 border border-red-500/30";
//   if (statusStr.includes("initiated")) return "bg-blue-500/10 text-blue-300 border border-blue-500/30";
//   return "bg-slate-500/10 text-slate-300";
// };

// export default function HistoryTable({ data, page, onPrev, onNext, onView }) {
//   const navigate = useNavigate();

//   const handleRetry = (transaction) => {
//     const type = String(transaction.TransactionType ?? transaction.transactionType ?? "").toUpperCase();
//     const toWallet = transaction.ToWalletID ?? transaction.toWalletID ?? transaction.toWalletId;
//     const amount = transaction.Amount ?? transaction.amount;
//     const phone = transaction.PhoneNumber ?? transaction.phoneNumber ?? "";
    
//     // Store transaction data in session storage for form to pre-fill
//     sessionStorage.setItem("retryTransaction", JSON.stringify({
//       toWallet,
//       amount,
//       phone,
//       originalTransactionId: transaction.TransactionID ?? transaction.transactionID ?? transaction.transactionId
//     }));

//     // Determine form type
//     let formTab = "p2p"; // default
//     if (type === "P2P") {
//       formTab = "p2p";
//     } else if (type === "P2M") {
//       formTab = "p2m";
//     } else if (type === "REFUND") {
//       formTab = "refund";
//     }
    
//     // Navigate to specific form page with form type in URL
//     navigate(`/dashboard/user/${formTab}`);
//   };

//   const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));

//   return (
//     <>
//       <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-slate-700/50 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
//                   ID
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
//                   Type
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
//                   Amount
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
//                   From
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
//                   To
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-4 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-700/30">
//               {data.items.length === 0 && (
//                 <tr>
//                   <td
//                     className="px-6 py-12 text-center text-slate-400 font-medium"
//                     colSpan={8}
//                   >
//                     <div className="flex flex-col items-center gap-2">
//                       <div className="w-12 h-12 rounded-full bg-slate-700/30 flex items-center justify-center">
//                         <Eye size={24} className="text-slate-500" />
//                       </div>
//                       <span>No transactions found</span>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//               {data.items.map((t, idx) => {
//                 const id = t.TransactionID ?? t.transactionID ?? t.transactionId;
//                 const type = t.TransactionType ?? t.transactionType ?? "Unknown";
//                 const status = t.Status ?? t.status ?? "Unknown";
//                 const amount = t.Amount ?? t.amount ?? "-";
//                 const currency = t.Currency ?? t.currency ?? "INR";
//                 const from = t.FromWalletID ?? t.fromWalletID ?? t.fromWalletId ?? "-";
//                 const to = t.ToWalletID ?? t.toWalletID ?? t.toWalletId ?? "-";
//                 const date = (t.TransactionDate ?? t.transactionDate)
//                   ? new Date(t.TransactionDate ?? t.transactionDate).toLocaleString()
//                   : "-";

//                 const isAlternate = idx % 2 === 0;

//                 return (
//                   <tr
//                     key={id}
//                     className={`transition-all duration-200 group ${
//                       isAlternate
//                         ? "hover:bg-slate-700/30 bg-slate-800/10"
//                         : "hover:bg-slate-700/30 bg-slate-900/20"
//                     }`}
//                   >
//                     <td className="px-6 py-4 text-sm font-mono text-slate-300 font-semibold">
//                       #{id}
//                     </td>
//                     <td className="px-6 py-4 text-sm">
//                       <span className="text-slate-300 font-medium capitalize">
//                         {String(type).toLowerCase()}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm">
//                       <span
//                         className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${getStatusColor(
//                           status
//                         )}`}
//                       >
//                         {status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm font-semibold text-right">
//                       <div className="flex items-baseline justify-end gap-1">
//                         <span className="text-slate-200">{amount}</span>
//                         <span className="text-slate-500 text-xs">{currency}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm">
//                       <code className="text-slate-400 text-xs bg-slate-900/50 px-2.5 py-1.5 rounded border border-slate-600/30 inline-block font-mono">
//                         {from}
//                       </code>
//                     </td>
//                     <td className="px-6 py-4 text-sm">
//                       <code className="text-slate-400 text-xs bg-slate-900/50 px-2.5 py-1.5 rounded border border-slate-600/30 inline-block font-mono">
//                         {to}
//                       </code>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-slate-400">
//                       <span className="text-xs">{date}</span>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-center">
//                       <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
//                         <button
//                           type="button"
//                           onClick={() => onView?.(id)}
//                           className="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 font-semibold transition-all group/btn hover:bg-teal-500/10 px-3 py-1.5 rounded-lg border border-teal-500/20 hover:border-teal-500/40 text-xs"
//                         >
//                           View
//                           <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
//                         </button>
//                         {status && String(status).toLowerCase().includes("failed") && (
//                           <button
//                             type="button"
//                             onClick={() => handleRetry(t)}
//                             className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 font-semibold transition-all group/btn hover:bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20 hover:border-orange-500/40 text-xs"
//                           >
//                             Retry
//                             <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Enhanced Pagination */}
//       <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={onPrev}
//             disabled={page === 1}
//             className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-300 rounded-lg border border-slate-600/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-medium"
//           >
//             <ChevronLeft size={18} />
//             Previous
//           </button>
//           <button
//             onClick={onNext}
//             disabled={page >= totalPages}
//             className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-300 rounded-lg border border-slate-600/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-medium"
//           >
//             Next
//             <ChevronRight size={18} />
//           </button>
//         </div>

//         <div className="text-sm text-slate-400 font-medium">
//           <span className="text-teal-400">Page {page}</span> of{" "}
//           <span className="text-teal-400">{totalPages}</span>
//           <span className="mx-3">•</span>
//           <span className="text-slate-300">{data.total}</span> transactions
//         </div>

//         <div className="text-sm text-slate-400 font-medium bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-600/30">
//           Showing <span className="text-slate-300">{data.pageSize}</span> per page
//         </div>
//       </div>
//     </>
//   );
// }


// src/components/transactions/HistoryTable.jsx
import React from "react";
import { ChevronRight, ChevronLeft, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const getStatusColor = (status) => {
  if (!status) return "bg-slate-500/10 text-slate-300";
  const statusStr = String(status).toLowerCase();
  if (statusStr.includes("completed")) return "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30";
  if (statusStr.includes("pending")) return "bg-yellow-500/10 text-yellow-300 border border-yellow-500/30";
  if (statusStr.includes("failed")) return "bg-red-500/10 text-red-300 border border-red-500/30";
  if (statusStr.includes("initiated")) return "bg-blue-500/10 text-blue-300 border border-blue-500/30";
  return "bg-slate-500/10 text-slate-300";
};

export default function HistoryTable({ data, page, onPrev, onNext, onView }) {
  const navigate = useNavigate();

  const handleRetry = (transaction) => {
    const type = String(transaction.TransactionType ?? transaction.transactionType ?? "").toUpperCase();
    const toWallet = transaction.ToWalletID ?? transaction.toWalletID ?? transaction.toWalletId;
    const amount = transaction.Amount ?? transaction.amount;
    const phone = transaction.PhoneNumber ?? transaction.phoneNumber ?? "";
    
    // Store transaction data in session storage for form to pre-fill
    sessionStorage.setItem("retryTransaction", JSON.stringify({
      toWallet,
      amount,
      phone,
      originalTransactionId: transaction.TransactionID ?? transaction.transactionID ?? transaction.transactionId
    }));

    // Determine form type
    let formTab = "p2p"; // default
    if (type === "P2P") {
      formTab = "p2p";
    } else if (type === "P2M") {
      formTab = "p2m";
    } else if (type === "REFUND") {
      formTab = "refund";
    }
    
    // Navigate directly to the specific payment form with sidebar
    navigate(`/dashboard/user/${formTab}`);
  };

  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));

  return (
    <>
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  From
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  To
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {data.items.length === 0 && (
                <tr>
                  <td
                    className="px-6 py-12 text-center text-slate-400 font-medium"
                    colSpan={8}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-slate-700/30 flex items-center justify-center">
                        <Eye size={24} className="text-slate-500" />
                      </div>
                      <span>No transactions found</span>
                    </div>
                  </td>
                </tr>
              )}
              {data.items.map((t, idx) => {
                const id = t.TransactionID ?? t.transactionID ?? t.transactionId;
                const type = t.TransactionType ?? t.transactionType ?? "Unknown";
                const status = t.Status ?? t.status ?? "Unknown";
                const amount = t.Amount ?? t.amount ?? "-";
                const currency = t.Currency ?? t.currency ?? "INR";
                const from = t.FromWalletID ?? t.fromWalletID ?? t.fromWalletId ?? "-";
                const to = t.ToWalletID ?? t.toWalletID ?? t.toWalletId ?? "-";
                const date = (t.TransactionDate ?? t.transactionDate)
                  ? new Date(t.TransactionDate ?? t.transactionDate).toLocaleString()
                  : "-";

                const isAlternate = idx % 2 === 0;

                return (
                  <tr
                    key={id}
                    className={`transition-all duration-200 group ${
                      isAlternate
                        ? "hover:bg-slate-700/30 bg-slate-800/10"
                        : "hover:bg-slate-700/30 bg-slate-900/20"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-mono text-slate-300 font-semibold">
                      #{id}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="text-slate-300 font-medium capitalize">
                        {String(type).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${getStatusColor(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-right">
                      <div className="flex items-baseline justify-end gap-1">
                        <span className="text-slate-200">{amount}</span>
                        <span className="text-slate-500 text-xs">{currency}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <code className="text-slate-400 text-xs bg-slate-900/50 px-2.5 py-1.5 rounded border border-slate-600/30 inline-block font-mono">
                        {from}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <code className="text-slate-400 text-xs bg-slate-900/50 px-2.5 py-1.5 rounded border border-slate-600/30 inline-block font-mono">
                        {to}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      <span className="text-xs">{date}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          type="button"
                          onClick={() => onView?.(id)}
                          className="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 font-semibold transition-all group/btn hover:bg-teal-500/10 px-3 py-1.5 rounded-lg border border-teal-500/20 hover:border-teal-500/40 text-xs"
                        >
                          View
                          <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                        {status && String(status).toLowerCase().includes("failed") && (
                          <button
                            type="button"
                            onClick={() => handleRetry(t)}
                            className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 font-semibold transition-all group/btn hover:bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20 hover:border-orange-500/40 text-xs"
                          >
                            Retry
                            <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Pagination */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onPrev}
            disabled={page === 1}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-300 rounded-lg border border-slate-600/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-medium"
          >
            <ChevronLeft size={18} />
            Previous
          </button>
          <button
            onClick={onNext}
            disabled={page >= totalPages}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-300 rounded-lg border border-slate-600/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-medium"
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="text-sm text-slate-400 font-medium">
          <span className="text-teal-400">Page {page}</span> of{" "}
          <span className="text-teal-400">{totalPages}</span>
          <span className="mx-3">•</span>
          <span className="text-slate-300">{data.total}</span> transactions
        </div>

        <div className="text-sm text-slate-400 font-medium bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-600/30">
          Showing <span className="text-slate-300">{data.pageSize}</span> per page
        </div>
      </div>
    </>
  );
}
