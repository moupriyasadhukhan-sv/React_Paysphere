
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/http";           // adjust if your path differs
import ConfirmDialog from "../../common/ConfirmDialog"; // adjust if needed

export default function MerchantSettlements() {
  const { merchantId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);   // settlements
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    onConfirm: null,
    confirmText: "Confirm",
    cancelText: "Cancel",
  });

  const openConfirm = ({ title, message, onConfirm, confirmText = "Confirm", cancelText = "Cancel" }) => {
    setConfirmConfig({ title, message, onConfirm, confirmText, cancelText });
    setConfirmOpen(true);
  };
  const closeConfirm = () => {
    if (confirming) return;
    setConfirmOpen(false);
    setConfirmConfig({ title: "", message: "", onConfirm: null, confirmText: "Confirm", cancelText: "Cancel" });
  };

  // Load settlements for merchant
  const fetchSettlements = async () => {
    setLoading(true);
    setError("");
    try {
      const url = `/api/Settlement/merchant/${merchantId}`;
      console.debug("GET settlements:", url);
      const res = await api.get(url);
      const items = Array.isArray(res?.data?.data) ? res.data.data : [];
      setData(items);
    } catch (e) {
      console.error(e);
      setError("Failed to load settlements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchantId]);

  const handleDelete = async (settlementId) => {
    const url = `/api/Settlement/${settlementId}`;
    console.debug("DELETE settlement:", url);
    await api.delete(url);
    setData((prev) => prev.filter((s) => String(s.settlementId ?? s.id) !== String(settlementId)));
  };

  const handleUpdateStatus = async (settlementId, newStatus) => {
    const url = `/api/Settlement/${settlementId}`;
    console.debug("PUT settlement:", url, "payload:", { status: newStatus });
    await api.put(url, { status: newStatus });
    setData((prev) =>
      prev.map((s) => (String(s.settlementId ?? s.id) === String(settlementId) ? { ...s, status: newStatus } : s))
    );
  };

  const statusOptions = ["Pending", "Settled"];

  // return (
  //   <div className="space-y-4">
  //     <div className="flex items-center justify-between">
  //       <div>
  //         <h2 className="text-lg font-semibold">Merchant {merchantId} — Settlements</h2>
  //         <p className="text-sm text-gray-500">View, update, or delete settlements for this merchant</p>
  //       </div>
  //       <div className="flex items-center gap-2">
  //         <button className="border rounded-md px-3 py-1" onClick={() => navigate(-1)} type="button">Back</button>
  //       </div>
  //     </div>

  //     <div className="overflow-auto border rounded-xl">
  //       <table className="min-w-full text-sm">
  //         <thead className="bg-gray-50">
  //           <tr className="text-left">
  //             <th className="px-4 py-3">Settlement ID</th>
  //             <th className="px-4 py-3">Period</th>
  //             <th className="px-4 py-3">Amount</th>
  //             <th className="px-4 py-3">Settled Date</th>
  //             <th className="px-4 py-3">Status</th>
  //             <th className="px-4 py-3">Actions</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {loading && (
  //             <tr><td colSpan={6} className="px-4 py-6 text-gray-500">Loading settlements…</td></tr>
  //           )}
  //           {!loading && error && (
  //             <tr><td colSpan={6} className="px-4 py-6 text-red-600">{error}</td></tr>
  //           )}
  //           {!loading && !error && data.length === 0 && (
  //             <tr><td colSpan={6} className="px-4 py-6 text-gray-500">No settlements found.</td></tr>
  //           )}

  //           {!loading && !error && data.map((s) => {
  //             const sid = s.settlementId ?? s.id;
  //             return (
  //               <tr key={sid} className="border-t">
  //                 <td className="px-4 py-3 whitespace-nowrap">{sid}</td>
  //                 <td className="px-4 py-3">{s.period ?? "—"}</td>
  //                 <td className="px-4 py-3">{s.amount ?? "—"}</td>
  //                 <td className="px-4 py-3">{s.settledDate ?? "—"}</td>
  //                 <td className="px-4 py-3">
  //                   <select
  //                     className="border rounded-md px-2 py-1"
  //                     value={s.status ?? "Pending"}
  //                     onChange={(e) => {
  //                       const newStatus = e.target.value;
  //                       openConfirm({
  //                         title: "Update Status",
  //                         message: <div>Change status of <strong>Settlement {sid}</strong> to <strong>{newStatus}</strong>?</div>,
  //                         confirmText: "Update",
  //                         onConfirm: async () => await handleUpdateStatus(sid, newStatus),
  //                       });
  //                     }}
  //                   >
  //                     {statusOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
  //                   </select>
  //                 </td>
  //                 <td className="px-4 py-3">
  //                   <button
  //                     className="border rounded-md px-3 py-1 hover:bg-red-50 text-red-700 border-red-300"
  //                     type="button"
  //                     onClick={() =>
  //                       openConfirm({
  //                         title: "Delete Settlement",
  //                         message: <div>Do you want to delete <strong>Settlement {sid}</strong>?</div>,
  //                         confirmText: "Delete",
  //                         onConfirm: async () => await handleDelete(sid),
  //                       })
  //                     }
  //                   >
  //                     Delete
  //                   </button>
  //                 </td>
  //               </tr>
  //             );
  //           })}
  //         </tbody>
  //       </table>
  //     </div>

  //     <ConfirmDialog
  //       open={confirmOpen}
  //       title={confirmConfig.title}
  //       message={confirmConfig.message}
  //       confirmText={confirmConfig.confirmText}
  //       cancelText={confirmConfig.cancelText}
  //       confirming={confirming}
  //       onCancel={closeConfirm}
  //       onConfirm={async () => {
  //         try {
  //           setConfirming(true);
  //           await confirmConfig.onConfirm?.();
  //           setConfirmOpen(false);
  //         } finally {
  //           setConfirming(false);
  //         }
  //       }}
  //     />
  //   </div>
  // );


  return (
  <div className="
    min-h-screen w-full p-6
        bg-[radial-gradient(circle_at_top,_#0f172a,_#020617_70%)]
        relative overflow-hidden
      "
    >

    <div className="max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          
          <h2 className="text-2xl font-semibold text-white">
            Merchant {merchantId} — <span className="text-teal-300">Settlements</span>
          </h2>

        </div>

        {/* BACK BUTTON MATCHING UI */}
        <button
            onClick={() => navigate(-1)}
            type="button"
            className="
              px-4 py-1.5 rounded-md
              text-teal-200 font-medium
              bg-teal-500/10
              border border-teal-400/40
              backdrop-blur-md
              hover:bg-teal-500/20
              hover:shadow-[0_0_12px_#2dd4bf]
              transition-all
            "
          >
          Back
        </button>
      </div>

      {/* GLASS TABLE CONTAINER */}
      <div
        className="
          rounded-2xl overflow-hidden
          bg-gradient-to-br from-teal-500/10 to-cyan-500/5
          backdrop-blur-xl
          border border-teal-400/25
          shadow-[0_0_30px_rgba(45,212,191,0.15)]
        "
      >

        <table className="w-full text-sm text-white">
          <thead>
            <tr className="bg-white/10 text-left text-gray-200">
              <th className="px-4 py-3">Settlement ID</th>
              <th className="px-4 py-3">Period</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Settled Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-gray-300">
                  Loading settlements…
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-red-400">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && data.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-gray-300">
                  No settlements found.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              data.map((s) => {
                const sid = s.settlementId ?? s.id;

                return (
                  <tr key={sid} className="border-t border-white/10">
                    <td className="px-4 py-3">{sid}</td>
                    <td className="px-4 py-3">{s.period ?? "—"}</td>
                    <td className="px-4 py-3">{s.amount ?? "—"}</td>
                    <td className="px-4 py-3">{s.settledDate ?? "—"}</td>

                    <td className="px-4 py-3">
                      {/* <select
                        className="bg-white/10 text-white border border-white/20 rounded-md px-2 py-1"
                        value={s.status ?? "Pending"}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          openConfirm({
                            title: "Update Status",
                            message: (
                              <div>
                                Change status of <strong>Settlement {sid}</strong> to{" "}
                                <strong>{newStatus}</strong>?
                              </div>
                            ),
                            confirmText: "Update",
                            onConfirm: async () => await handleUpdateStatus(sid, newStatus),
                          });
                        }}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select> */}

                      <select
  className="
    bg-gray-800 text-teal-200 
    border border-teal-400/40 
    rounded-md px-2 py-1
    focus:outline-none focus:ring-2 focus:ring-teal-400
  "
  value={s.status ?? "Pending"}
  onChange={(e) => {
    const newStatus = e.target.value;
    openConfirm({
      title: "Update Status",
      message: (
        <div>
          Change status of <strong>Settlement {sid}</strong> to{" "}
          <strong>{newStatus}</strong>?
        </div>
      ),
      confirmText: "Update",
      onConfirm: async () => await handleUpdateStatus(sid, newStatus),
    });
  }}
>
  {statusOptions.map((opt) => (
    <option
      key={opt}
      value={opt}
      className="bg-gray-900 text-teal-200"
    >
      {opt}
    </option>
  ))}
</select>

                    </td>

                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="px-3 py-1 rounded-md 
                                   border border-red-400 
                                   text-red-300 hover:bg-red-500/20 transition"
                        onClick={() =>
                          openConfirm({
                            title: "Delete Settlement",
                            message: (
                              <div>
                                Do you want to delete <strong>Settlement {sid}</strong>?
                              </div>
                            ),
                            confirmText: "Delete",
                            onConfirm: async () => await handleDelete(sid),
                          })
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        open={confirmOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        cancelText={confirmConfig.cancelText}
        confirming={confirming}
        onCancel={closeConfirm}
        onConfirm={async () => {
          try {
            setConfirming(true);
            await confirmConfig.onConfirm?.();
            setConfirmOpen(false);
          } finally {
            setConfirming(false);
          }
        }}
      />
    </div>
  </div>
);
}