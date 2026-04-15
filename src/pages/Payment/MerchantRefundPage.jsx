// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import {
//   listMerchantRefundRequests,
//   approveRefundRequest,
//   rejectRefundRequest,
// } from "../../services/refunds/refundRequestsApi";
// import { createRefund } from "../../services/transactions/transactionsApi";
// import { addNotification } from "../../stores/notificationsSlice";

// function StatusBadge({ status }) {
//   const s = (status || "").toLowerCase();
//   const cfg =
//     s === "pending"   ? { bg: "bg-yellow-500/20",  text: "text-yellow-300"  } :
//     s === "approved"  ? { bg: "bg-blue-500/20",    text: "text-blue-300"    } :
//     s === "completed" ? { bg: "bg-emerald-500/20", text: "text-emerald-300" } :
//     s === "rejected"  ? { bg: "bg-red-500/20",     text: "text-red-300"     } :
//                         { bg: "bg-white/10",       text: "text-slate-300"   };
//   return (
//     <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
//       {status || "—"}
//     </span>
//   );
// }

// export default function MerchantRefundsPage() {
//   const dispatch = useDispatch();
//   const [rows, setRows]     = useState([]);
//   const [busyId, setBusyId] = useState(null);
//   const [err, setErr]       = useState("");
//   const [msg, setMsg]       = useState("");
//   const [loading, setLoading] = useState(true);

//   async function refresh() {
//     setErr(""); setMsg("");
//     setLoading(true);
//     try {
//       const data = await listMerchantRefundRequests();
//       const newRows = data.map((x) => ({
//         id:                    x.id,
//         originalTransactionID: x.OriginalTransactionID ?? x.originalTransactionID,
//         amount:                x.Amount ?? x.amount,
//         userId:                x.UserId ?? x.userId,
//         phone:                 x.Phone ?? x.phone,
//         requestedAtUtc:        x.RequestedAtUtc ?? x.requestedAtUtc,
//         status:                x.Status ?? x.status,
//       }));

//       // Check for new pending refund requests and notify merchant
//       const pendingRequests = newRows.filter((r) => (r.status || "").toLowerCase() === "pending");
//       if (pendingRequests.length > 0) {
//         // Notify merchant of new refund requests
//         pendingRequests.forEach((req) => {
//           dispatch(addNotification({
//             title: "New Refund Request 📋",
//             message: `User has requested a refund for transaction #${req.originalTransactionID} (Amount: ₹${req.amount})`,
//             icon: "🔔",
//             timestamp: new Date().toISOString()
//           }));
//         });
//       }

//       setRows(newRows);
//     } catch (e) {
//       const d = e?.response?.data;
//       setErr(d?.detail || d?.title || d?.message || e?.message || "Failed to load refund requests");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => { refresh(); }, []);

//   async function approve(id) {
//     setErr(""); setMsg("");
//     setBusyId(id);
//     try {
//       await approveRefundRequest(id);
//       setMsg("Request approved.");
      
//       dispatch(addNotification({
//         title: "Refund Request Approved ✓",
//         message: `Refund request #${id} has been approved`,
//         icon: "👏",
//         timestamp: new Date().toISOString()
//       }));
      
//       await refresh();
//     } catch (e) {
//       const d = e?.response?.data;
//       setErr(d?.detail || d?.title || d?.message || e?.message || "Approve failed");
//     } finally { setBusyId(null); }
//   }

//   async function reject(id) {
//     setErr(""); setMsg("");
//     setBusyId(id);
//     try {
//       await rejectRefundRequest(id);
//       setMsg("Request rejected.");
      
//       dispatch(addNotification({
//         title: "Refund Request Rejected ❌",
//         message: `Refund request #${id} has been rejected`,
//         icon: "🙅",
//         timestamp: new Date().toISOString()
//       }));
      
//       await refresh();
//     } catch (e) {
//       const d = e?.response?.data;
//       setErr(d?.detail || d?.title || d?.message || e?.message || "Reject failed");
//     } finally { setBusyId(null); }
//   }

//   async function execute(row) {
//     setErr(""); setMsg("");
//     setBusyId(row.id);
//     try {
//       const res = await createRefund({
//         originalTransactionID: row.originalTransactionID,
//         phoneNumber: row.phone,
//         requestId: row.id,
//       });
//       setMsg(res?.message || "Refund executed.");
      
//       dispatch(addNotification({
//         title: "Refund Executed Successfully 💵",
//         message: `Refund of ₹${row.amount} for request #${row.id} has been executed`,
//         icon: "💵",
//         timestamp: new Date().toISOString()
//       }));
      
//       await refresh();
//     } catch (e) {
//       const d = e?.response?.data;
//       setErr(d?.detail || d?.title || d?.message || e?.message || "Execution failed");
//     } finally { setBusyId(null); }
//   }

//   return (
//     <div className="px-6 py-4">
//       <div className="mb-4">
//         <h2 className="text-xl font-semibold text-white">Refund Requests</h2>
//         <p className="text-sm text-slate-300">Approve or reject requests, then execute the refund.</p>
//       </div>

//       {err && <div className="mb-3 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 text-sm">{err}</div>}
//       {msg && <div className="mb-3 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-sm">{msg}</div>}

//       <div className="overflow-auto border border-white/10 rounded-xl bg-white/5 backdrop-blur-lg">
//         <table className="min-w-full text-sm text-slate-200">
//           <thead className="bg-white/10 text-slate-100">
//             <tr className="text-left">
//               <th className="px-4 py-3">Request ID</th>
//               <th className="px-4 py-3">Original Txn</th>
//               <th className="px-4 py-3">Amount</th>
//               <th className="px-4 py-3">User Phone</th>
//               <th className="px-4 py-3">Requested At</th>
//               <th className="px-4 py-3">Status</th>
//               <th className="px-4 py-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading && (
//               <tr><td colSpan={7} className="px-4 py-6 text-slate-400 text-center">Loading refund requests…</td></tr>
//             )}
//             {!loading && rows.length === 0 && (
//               <tr><td colSpan={7} className="px-4 py-6 text-slate-400 text-center">No refund requests found.</td></tr>
//             )}
//             {!loading && rows.map((r) => (
//               <tr key={r.id} className="border-t border-white/10 hover:bg-white/10 transition">
//                 <td className="px-4 py-3 font-mono text-purple-300">{r.id}</td>
//                 <td className="px-4 py-3">{r.originalTransactionID ?? "—"}</td>
//                 <td className="px-4 py-3 font-semibold text-white">₹{r.amount ?? "—"}</td>
//                 <td className="px-4 py-3">{r.phone ?? "—"}</td>
//                 <td className="px-4 py-3 text-slate-400">
//                   {r.requestedAtUtc ? new Date(r.requestedAtUtc).toLocaleString() : "—"}
//                 </td>
//                 <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
//                 <td className="px-4 py-3">
//                   <div className="flex gap-2">
//                     {r.status === "Pending" && (
//                       <>
//                         <button
//                           disabled={busyId === r.id}
//                           onClick={() => approve(r.id)}
//                           className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 disabled:opacity-40 transition"
//                         >
//                           {busyId === r.id ? "…" : "Approve"}
//                         </button>
//                         <button
//                           disabled={busyId === r.id}
//                           onClick={() => reject(r.id)}
//                           className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 disabled:opacity-40 transition"
//                         >
//                           {busyId === r.id ? "…" : "Reject"}
//                         </button>
//                       </>
//                     )}
//                     {r.status === "Approved" && (
//                       <button
//                         disabled={busyId === r.id}
//                         onClick={() => execute(r)}
//                         className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 disabled:opacity-40 transition"
//                       >
//                         {busyId === r.id ? "…" : "Execute Refund"}
//                       </button>
//                     )}
//                     {(r.status === "Rejected" || r.status === "Completed") && (
//                       <span className="text-slate-500 text-xs italic">No actions</span>
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listMerchantRefundRequests,
  approveRefundRequest,
  rejectRefundRequest,
} from "../../services/refunds/refundRequestsApi";
import { createRefund } from "../../services/transactions/transactionsApi";
//import { addNotification } from "../../stores/notificationsSlice";
//import { notifyRefundApproved, notifyRefundCompleted, notifyRefundRejected } from "../../services/notifications/refundNotificationsApi";
//import { notifyRefundReceived } from "../../services/notifications/paymentReceivedNotificationsApi";

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  const cfg =
    s === "pending"   ? { bg: "bg-yellow-500/20",  text: "text-yellow-300"  } :
    s === "approved"  ? { bg: "bg-blue-500/20",    text: "text-blue-300"    } :
    s === "completed" ? { bg: "bg-emerald-500/20", text: "text-emerald-300" } :
    s === "rejected"  ? { bg: "bg-red-500/20",     text: "text-red-300"     } :
                        { bg: "bg-white/10",       text: "text-slate-300"   };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      {status || "—"}
    </span>
  );
}

export default function MerchantRefundsPage() {
  const dispatch = useDispatch();
  const merchantId = useSelector((s) => s.auth?.merchantId);
  const [rows, setRows]     = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [err, setErr]       = useState("");
  const [msg, setMsg]       = useState("");
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setErr(""); setMsg("");
    setLoading(true);
    try {
      const data = await listMerchantRefundRequests();
      const newRows = data.map((x) => ({
        id:                    x.id,
        originalTransactionID: x.OriginalTransactionID ?? x.originalTransactionID,
        amount:                x.Amount ?? x.amount,
        userId:                x.UserId ?? x.userId,
        phone:                 x.Phone ?? x.phone,
        requestedAtUtc:        x.RequestedAtUtc ?? x.requestedAtUtc,
        status:                x.Status ?? x.status,
      }));

      // Check for new pending refund requests and notify merchant
      const pendingRequests = newRows.filter((r) => (r.status || "").toLowerCase() === "pending");
      if (pendingRequests.length > 0) {
        // Notify merchant of new refund requests
        pendingRequests.forEach((req) => {
          dispatch(addNotification({
            title: "New Refund Request 📋",
            message: `User has requested a refund for transaction #${req.originalTransactionID} (Amount: ₹${req.amount})`,
            icon: "🔔",
            timestamp: new Date().toISOString()
          }));
        });
      }

      setRows(newRows);
    } catch (e) {
      const d = e?.response?.data;
      setErr(d?.detail || d?.title || d?.message || e?.message || "Failed to load refund requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function approve(id) {
    setErr(""); setMsg("");
    setBusyId(id);
    try {
      await approveRefundRequest(id);
      
      // Find the request to get user ID and other details
      const request = rows.find(r => r.id === id);
      
      // Send notification to user
      if (request) {
        try {
          await notifyRefundApproved({
            requestId: id,
            userId: request.userId,
            transactionId: request.originalTransactionID,
            amount: request.amount,
          });
        } catch (notifErr) {
          console.warn("[MerchantRefundPage] Failed to send approval notification:", notifErr);
        }
      }
      
      setMsg("Request approved.");
      
      dispatch(addNotification({
        title: "Refund Request Approved ✓",
        message: `Refund request #${id} has been approved`,
        icon: "👏",
        timestamp: new Date().toISOString()
      }));
      
      await refresh();
    } catch (e) {
      const d = e?.response?.data;
      setErr(d?.detail || d?.title || d?.message || e?.message || "Approve failed");
    } finally { setBusyId(null); }
  }

  async function reject(id) {
    setErr(""); setMsg("");
    setBusyId(id);
    try {
      await rejectRefundRequest(id);
      
      // Find the request to get user ID and other details
      const request = rows.find(r => r.id === id);
      
      // Send notification to user
      if (request) {
        try {
          await notifyRefundRejected({
            requestId: id,
            userId: request.userId,
            transactionId: request.originalTransactionID,
            reason: "Request does not meet refund criteria",
          });
        } catch (notifErr) {
          console.warn("[MerchantRefundPage] Failed to send rejection notification:", notifErr);
        }
      }
      
      setMsg("Request rejected.");
      
      dispatch(addNotification({
        title: "Refund Request Rejected ❌",
        message: `Refund request #${id} has been rejected`,
        icon: "🙅",
        timestamp: new Date().toISOString()
      }));
      
      await refresh();
    } catch (e) {
      const d = e?.response?.data;
      setErr(d?.detail || d?.title || d?.message || e?.message || "Reject failed");
    } finally { setBusyId(null); }
  }

  async function execute(row) {
    setErr(""); setMsg("");
    setBusyId(row.id);
    try {
      const res = await createRefund({
        originalTransactionID: row.originalTransactionID,
        phoneNumber: row.phone,
        requestId: row.id,
      });
      
      console.log("[MerchantRefundPage] Refund executed:", res);
      
      // Send notification to both user and merchant that refund is completed
      try {
        console.log("[MerchantRefundPage] Sending refund completion notification for request:", row.id, "userId:", row.userId, "merchantId:", merchantId);
        await notifyRefundCompleted({
          requestId: row.id,
          userId: row.userId,
          merchantId: merchantId,
          transactionId: row.originalTransactionID,
          amount: row.amount,
        });
        console.log("[MerchantRefundPage] Refund completion notification sent successfully");
      } catch (notifErr) {
        console.warn("[MerchantRefundPage] Failed to send completion notification:", notifErr);
      }
      
      // Send notification to user that they received the refund
      try {
        console.log("[MerchantRefundPage] Sending refund received notification to user:", row.userId);
        await notifyRefundReceived({
          userId: row.userId,
          merchantId: merchantId,
          amount: row.amount,
          requestId: row.id,
          transactionId: row.originalTransactionID,
        });
        console.log("[MerchantRefundPage] Refund received notification sent to user");
      } catch (receivedNotifErr) {
        console.warn("[MerchantRefundPage] Failed to send refund received notification:", receivedNotifErr);
      }
      
      setMsg(res?.message || "Refund executed.");
      
      // Show local notification for merchant
      dispatch(addNotification({
        title: "Refund Completed 💵",
        message: `Refund of ₹${row.amount} for request #${row.id} has been executed`,
        icon: "💵",
        timestamp: new Date().toISOString(),
        read: false
      }));
      
      await refresh();
    } catch (e) {
      const d = e?.response?.data;
      setErr(d?.detail || d?.title || d?.message || e?.message || "Execution failed");
    } finally { setBusyId(null); }
  }

  return (
    <div className="px-6 py-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">Refund Requests</h2>
        <p className="text-sm text-slate-300">Approve or reject requests, then execute the refund.</p>
      </div>

      {err && <div className="mb-3 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 text-sm">{err}</div>}
      {msg && <div className="mb-3 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-sm">{msg}</div>}

      <div className="overflow-auto border border-white/10 rounded-xl bg-white/5 backdrop-blur-lg">
        <table className="min-w-full text-sm text-slate-200">
          <thead className="bg-white/10 text-slate-100">
            <tr className="text-left">
              <th className="px-4 py-3">Request ID</th>
              <th className="px-4 py-3">Original Txn</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">User Phone</th>
              <th className="px-4 py-3">Requested At</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="px-4 py-6 text-slate-400 text-center">Loading refund requests…</td></tr>
            )}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-slate-400 text-center">No refund requests found.</td></tr>
            )}
            {!loading && rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10 hover:bg-white/10 transition">
                <td className="px-4 py-3 font-mono text-purple-300">{r.id}</td>
                <td className="px-4 py-3">{r.originalTransactionID ?? "—"}</td>
                <td className="px-4 py-3 font-semibold text-white">₹{r.amount ?? "—"}</td>
                <td className="px-4 py-3">{r.phone ?? "—"}</td>
                <td className="px-4 py-3 text-slate-400">
                  {r.requestedAtUtc ? new Date(r.requestedAtUtc).toLocaleString() : "—"}
                </td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {r.status === "Pending" && (
                      <>
                        <button
                          disabled={busyId === r.id}
                          onClick={() => approve(r.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 disabled:opacity-40 transition"
                        >
                          {busyId === r.id ? "…" : "Approve"}
                        </button>
                        <button
                          disabled={busyId === r.id}
                          onClick={() => reject(r.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 disabled:opacity-40 transition"
                        >
                          {busyId === r.id ? "…" : "Reject"}
                        </button>
                      </>
                    )}
                    {r.status === "Approved" && (
                      <button
                        disabled={busyId === r.id}
                        onClick={() => execute(r)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 disabled:opacity-40 transition"
                      >
                        {busyId === r.id ? "…" : "Execute Refund"}
                      </button>
                    )}
                    {(r.status === "Rejected" || r.status === "Completed") && (
                      <span className="text-slate-500 text-xs italic">No actions</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


