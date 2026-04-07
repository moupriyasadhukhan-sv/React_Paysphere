import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/http";
import ConfirmDialog from "../../common/ConfirmDialog";

export default function CreateSettlement() {
  const { merchantId } = useParams();
  const navigate = useNavigate();

  const [period, setPeriod] = useState("");
  const [amount, setAmount] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    onConfirm: null,
    confirmText: "OK",
    cancelText: "",
  });

  const openConfirm = ({ title, message, confirmText = "OK", cancelText = "", onConfirm }) => {
    setConfirmConfig({ title, message, confirmText, cancelText, onConfirm });
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    if (confirming) return;
    setConfirmOpen(false);
  };

  const handleCreate = async () => {
    try {
      const payload = {
        merchantID: Number(merchantId),
        period,
        amount: Number(amount),
      };

      const res = await api.post("/api/Settlement", payload);

      if (!res.data.success) {
        throw new Error(res.data.message);
      }

      openConfirm({
        title: "Success",
        message: <div>Settlement created successfully!</div>,
        confirmText: "OK",
        onConfirm: () => navigate(-1),
      });

    } catch (e) {
      openConfirm({
        title: "Error Creating Settlement",
        message: e?.response?.data?.message || e.message,
        confirmText: "OK",
        cancelText: "",
      });
    }
  };

//   return (
//   <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-gray-900
//                 flex items-center justify-center p-6">

//     {/* Header */}
//     <div className="flex items-center justify-between">
//       <div>
//         <h2 className="text-lg font-semibold text-white">
//           Create Settlement — Merchant {merchantId}
//         </h2>
//         <p className="text-sm text-gray-300">Enter settlement details below</p>
//       </div>

//       <button
//         className="px-3 py-1.5 rounded-md border border-white/30 text-white 
//                    hover:bg-white/10 transition"
//         onClick={() => navigate(-1)}
//       >
//         Back
//       </button>
//     </div>

//     {/* Form Box */}
//     <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 text-white max-w-lg">

//       <div className="mb-4">
//         <label className="block mb-1 text-gray-300">Merchant ID</label>
//         <input
//           className="w-full px-3 py-2 rounded-lg bg-purple-900/40 border border-purple-700/40 text-white"
//           value={merchantId}
//           disabled
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block mb-1 text-gray-300">Period</label>
//         <input
//           className="w-full px-3 py-2 rounded-lg bg-purple-900/40 border border-purple-700/40 text-white"
//           placeholder="JAN-2026"
//           value={period}
//           onChange={(e) => setPeriod(e.target.value)}
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block mb-1 text-gray-300">Amount</label>
//         <input
//           type="number"
//           className="w-full px-3 py-2 rounded-lg bg-purple-900/40 border border-purple-700/40 text-white"
//           placeholder="1"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//         />
//       </div>

//       {/* Button */}
//       <button
//         className="w-full px-4 py-2 rounded-lg text-white font-medium
//                    bg-gradient-to-r from-purple-500 to-indigo-600
//                    hover:from-purple-600 hover:to-indigo-700
//                    transition"
//         onClick={handleCreate}
//       >
//         Create Settlement
//       </button>

//     </div>

//     {/* Confirm Dialog */}
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
// }
// return (
//   <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-gray-900 
//                   flex items-center justify-center p-6">

//     {/* Centered Card */}
//     <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl 
//                     border border-white/20 rounded-2xl p-6 shadow-xl space-y-4">

//       {/* Header inside the card */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-lg font-semibold text-white">
//             Create Settlement — Merchant {merchantId}
//           </h2>
//           <p className="text-sm text-gray-300">Enter settlement details below</p>
//         </div>

//         <button
//           className="px-3 py-1.5 rounded-md border border-white/30 text-white 
//                      hover:bg-white/10 transition"
//           onClick={() => navigate(-1)}
//         >
//           Back
//         </button>
//       </div>

//       {/* Form Fields */}
//       <div className="space-y-4">

//         <div>
//           <label className="block mb-1 text-gray-300">Merchant ID</label>
//           <input
//             className="w-full px-3 py-2 rounded-lg bg-purple-900/40 
//                        border border-purple-700/40 text-white"
//             value={merchantId}
//             disabled
//           />
//         </div>

//         <div>
//           <label className="block mb-1 text-gray-300">Period</label>
//           <input
//             className="w-full px-3 py-2 rounded-lg bg-purple-900/40 
//                        border border-purple-700/40 text-white"
//             placeholder="JAN-2026"
//             value={period}
//             onChange={(e) => setPeriod(e.target.value)}
//           />
//         </div>

//         <div>
//           <label className="block mb-1 text-gray-300">Amount</label>
//           <input
//             type="number"
//             className="w-full px-3 py-2 rounded-lg bg-purple-900/40 
//                        border border-purple-700/40 text-white"
//             placeholder="1"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//           />
//         </div>

//         {/* Submit Button */}
//         <button
//           className="w-full px-4 py-2 rounded-lg text-white font-medium
//                      bg-gradient-to-r from-purple-500 to-indigo-600
//                      hover:from-purple-600 hover:to-indigo-700 transition"
//           onClick={handleCreate}
//         >
//           Create Settlement
//         </button>

//       </div>
//     </div>

//     {/* Confirm Dialog */}
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
      min-h-screen w-full
      px-6 py-8
      bg-[radial-gradient(circle_at_top,_#0f172a,_#020617_70%)]
      relative overflow-hidden
    ">


    {/* GLASS CARD */}
      <div className="
      max-w-xl mx-auto mt-16 relative p-8
      rounded-2xl
      bg-gradient-to-br from-teal-500/15 to-cyan-500/5
      backdrop-blur-xl
      border border-teal-400/25
      shadow-[0_0_30px_rgba(45,212,191,0.3)]
      hover:shadow-[0_0_45px_rgba(45,212,191,0.5)]
      transition-all
    ">

      {/* HEADER + BACK BUTTON */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">
          Create Settlement
        </h2>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-1.5 rounded-md
                     text-white border border-white/30
                     hover:bg-white/10 transition">
          Back
        </button>
      </div>

      {/* SUBTITLE */}
      <p className="text-gray-300 mb-5">Merchant {merchantId}</p>

      {/* FORM */}
      <div className="space-y-4">

        <div>
          <label className="block mb-1 text-gray-300">Merchant ID</label>
          <input
            disabled
            value={merchantId}
            className="w-full px-3 py-2 rounded-lg
                       bg-white/10 border border-white/20
                       text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-300">Period</label>
          <input
            placeholder="JAN-2026"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full px-3 py-2 rounded-lg
                       bg-white/10 border border-white/20
                       text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-300">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1"
            className="w-full px-3 py-2 rounded-lg
                       bg-white/10 border border-white/20
                       text-white"
          />
        </div>

        <button
          className="
            w-full mt-4 py-2 rounded-lg
                bg-teal-500/30
                border border-teal-400/40
                text-teal-200 font-medium
                hover:bg-teal-500/50
                hover:shadow-[0_0_18px_#2dd4bf]
                transition-all
            "
            onClick={handleCreate}>
          Create Settlement
        </button>

      </div>
    </div>

    {/* Confirm Dialog */}
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
);
 }