// // import { useEffect, useState } from "react";
// // import { useNavigate, useParams } from "react-router-dom";
// // import api from "../../utils/api";

// // export default function UpdateLimit() {
// //   const { limitId } = useParams();
// //   const navigate = useNavigate();

// //   const [form, setForm] = useState({ limitID: limitId, userID: "", dailyLimit: "", monthlyLimit: "" });
// //   const [loading, setLoading] = useState(true);
// //   const [submitting, setSubmitting] = useState(false);
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     api.get(`/limits/${limitId}`)
// //       .then((res) => {
// //         const d = res.data?.data ?? res.data;
// //         setForm({ limitID: d.limitID, userID: d.userID, dailyLimit: d.dailyLimit, monthlyLimit: d.monthlyLimit });
// //         setLoading(false);
// //       })
// //       .catch(() => { setError("Could not find this limit record."); setLoading(false); });
// //   }, [limitId]);

// //   const onSubmit = async (e) => {
// //     e.preventDefault();
// //     setSubmitting(true);
// //     try {
// //       await api.put(`/limits/${limitId}`, {
// //         dailyLimit: Number(form.dailyLimit),
// //         monthlyLimit: Number(form.monthlyLimit),
// //       });
// //       alert("Limit updated successfully!");
// //       navigate("/dashboard/admin");
// //     } catch {
// //       setError("Failed to update limit.");
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   if (loading) return <div className="p-6 text-white">Loading Limit Data...</div>;

// //   return (
// //     <div className="min-h-screen flex items-center justify-center p-6">
// //       <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
// //         <div className="flex items-center justify-between mb-4">
// //           <h2 className="text-xl font-semibold text-white">Update Limit (ID: {limitId})</h2>
// //           <button onClick={() => navigate(-1)} className="px-3 py-1.5 rounded-md border border-white/30 text-white hover:bg-white/10 transition">
// //             Back
// //           </button>
// //         </div>

// //         <form onSubmit={onSubmit} className="space-y-4">
// //           {error && <p className="text-red-400">{error}</p>}

// //           <div>
// //             <label className="block text-sm text-white/80 mb-1">User ID</label>
// //             <input disabled value={form.userID} className="w-full bg-white/10 border border-white/20 text-white p-2 rounded-md" />
// //           </div>

// //           <div>
// //             <label className="block text-sm text-white/80 mb-1">Daily Limit</label>
// //             <input type="number" value={form.dailyLimit}
// //               onChange={(e) => setForm({ ...form, dailyLimit: e.target.value })}
// //               className="w-full bg-white/10 border border-white/20 text-white p-2 rounded-md" required />
// //           </div>

// //           <div>
// //             <label className="block text-sm text-white/80 mb-1">Monthly Limit</label>
// //             <input type="number" value={form.monthlyLimit}
// //               onChange={(e) => setForm({ ...form, monthlyLimit: e.target.value })}
// //               className="w-full bg-white/10 border border-white/20 text-white p-2 rounded-md" required />
// //           </div>

// //           <div className="flex gap-2">
// //             <button type="submit" disabled={submitting}
// //               className="bg-emerald-600 text-white px-4 py-2 rounded-md disabled:opacity-50 hover:bg-emerald-700 transition">
// //               {submitting ? "Updating..." : "Save Changes"}
// //             </button>
// //             <button type="button" onClick={() => navigate(-1)}
// //               className="border border-white/30 text-white px-4 py-2 rounded-md hover:bg-white/10 transition">
// //               Cancel
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "../../utils/api";

// export default function UpdateLimit() {
//   const { limitId } = useParams();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({ limitID: limitId, userID: "", dailyLimit: "", monthlyLimit: "" });
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     api.get(`/limits/${limitId}`)
//       .then((res) => {
//         const d = res.data?.data ?? res.data;
//         setForm({ 
//           limitID: d.limitID, 
//           userID: d.userID, 
//           dailyLimit: d.dailyLimit, 
//           monthlyLimit: d.monthlyLimit 
//         });
//         setLoading(false);
//       })
//       .catch(() => { 
//         setError("Could not find this limit record."); 
//         setLoading(false); 
//       });
//   }, [limitId]);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       await api.put(`/limits/${limitId}`, {
//         dailyLimit: Number(form.dailyLimit),
//         monthlyLimit: Number(form.monthlyLimit),
//       });
//       alert("Limit updated successfully!");
//       navigate("/dashboard/admin");
//     } catch {
//       setError("Failed to update limit.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Improved Loading State with background to prevent "white screen"
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
//           <p className="text-slate-400 font-medium">Loading Limit Data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     // Added bg-[#0f172a] (Dark Navy) to ensure visibility
//     <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 font-sans">
      
//       {/* Glow Effect behind the card */}
//       <div className="absolute w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

//       <div className="relative w-full max-w-lg bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h2 className="text-2xl font-bold text-white tracking-tight">Update Limit</h2>
//             <p className="text-slate-400 text-sm">Managing Record ID: {limitId}</p>
//           </div>
//           <button 
//             onClick={() => navigate(-1)} 
//             className="px-4 py-2 rounded-xl border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-all active:scale-95"
//           >
//             Back
//           </button>
//         </div>

//         <form onSubmit={onSubmit} className="space-y-6">
//           {error && (
//             <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
//               {error}
//             </div>
//           )}

//           {/* User ID - Read Only */}
//           <div className="space-y-2">
//             <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">User ID</label>
//             <input 
//               disabled 
//               value={form.userID} 
//               className="w-full bg-black/20 border border-white/5 text-slate-500 p-3 rounded-xl cursor-not-allowed" 
//             />
//           </div>

//           {/* Daily Limit */}
//           <div className="space-y-2">
//             <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Daily Limit ($)</label>
//             <input 
//               type="number" 
//               value={form.dailyLimit}
//               onChange={(e) => setForm({ ...form, dailyLimit: e.target.value })}
//               className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all" 
//               placeholder="0.00"
//               required 
//             />
//           </div>

//           {/* Monthly Limit */}
//           <div className="space-y-2">
//             <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Monthly Limit ($)</label>
//             <input 
//               type="number" 
//               value={form.monthlyLimit}
//               onChange={(e) => setForm({ ...form, monthlyLimit: e.target.value })}
//               className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all" 
//               placeholder="0.00"
//               required 
//             />
//           </div>

//           {/* Actions */}
//           <div className="flex gap-3 pt-4">
//             <button 
//               type="submit" 
//               disabled={submitting}
//               className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-[#0f172a] font-bold py-3 rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
//             >
//               {submitting ? "Processing..." : "Save Changes"}
//             </button>
//             <button 
//               type="button" 
//               onClick={() => navigate(-1)}
//               className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/http";
import toast from "react-hot-toast";

export default function UpdateLimit() {
  const { limitId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    limitID: limitId,
    userID: "",
    dailyLimit: "",
    monthlyLimit: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/api/limits/${limitId}`)
      .then((res) => {
        const d = res.data.data;
        setForm({
          limitID: d.limitID,
          userID: d.userID,
          dailyLimit: d.dailyLimit,
          monthlyLimit: d.monthlyLimit,
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Could not find this limit record.");
        setLoading(false);
      });
  }, [limitId]);

 
const onSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  setError("");

  try {
    const payload = {
      dailyLimit: Number(form.dailyLimit),
      monthlyLimit: Number(form.monthlyLimit),
    };

    await api.put(`/api/limits/${limitId}`, payload);

    toast.success("Limit updated successfully!");

    navigate("/dashboard/admin");

  } catch (err) {
    console.error(err);

    toast.error("Failed to update limit.");
    setError("Failed to update limit.");

  } finally {
    setSubmitting(false);
  }
};

  if (loading) return <div className="p-6">Loading Limit Data...</div>;

  // return (
  //   <div className="p-6">
  //     <h2 className="text-xl font-semibold mb-4">Update Limit (ID: {limitId})</h2>

  //     <form onSubmit={onSubmit} className="max-w-md space-y-4 bg-white p-6 border rounded-xl">
  //       {error && <p className="text-red-500">{error}</p>}

  //       <div>
  //         <label className="block text-sm font-medium">User ID</label>
  //         <input
  //           disabled
  //           value={form.userID}
  //           className="w-full bg-gray-100 border p-2 rounded-md"
  //         />
  //       </div>

  //       <div>
  //         <label className="block text-sm font-medium">Daily Limit</label>
  //         <input
  //           type="number"
  //           value={form.dailyLimit}
  //           onChange={(e) => setForm({ ...form, dailyLimit: e.target.value })}
  //           className="w-full border p-2 rounded-md"
  //           required
  //         />
  //       </div>

  //       <div>
  //         <label className="block text-sm font-medium">Monthly Limit</label>
  //         <input
  //           type="number"
  //           value={form.monthlyLimit}
  //           onChange={(e) => setForm({ ...form, monthlyLimit: e.target.value })}
  //           className="w-full border p-2 rounded-md"
  //           required
  //         />
  //       </div>

  //       <div className="flex gap-2">
  //         <button
  //           type="submit"
  //           disabled={submitting}
  //           className="bg-emerald-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
  //         >
  //           {submitting ? "Updating..." : "Save Changes"}
  //         </button>
  //         <button
  //           type="button"
  //           onClick={() => navigate(-1)}
  //           className="border px-4 py-2 rounded-md"
  //         >
  //           Cancel
  //         </button>
  //       </div>

  //     </form>
  //   </div>
  // );

//   return (
//   <div className="min-h-screen flex items-center justify-center p-6">

//     <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl 
//                     border border-white/20 rounded-2xl p-6 shadow-xl">

//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-semibold text-white">
//           Update Limit (ID: {limitId})
//         </h2>

//         <button
//           onClick={() => navigate(-1)}
//           className="px-3 py-1.5 rounded-md border border-white/30 text-white 
//                      hover:bg-white/10 transition"
//         >
//           Back
//         </button>
//       </div>

//       <form onSubmit={onSubmit} className="space-y-4">

//         {error && <p className="text-red-400">{error}</p>}

//         <div>
//           <label className="block text-sm text-white/80 mb-1">User ID</label>
//           <input
//             disabled
//             value={form.userID}
//             className="w-full bg-white/10 border border-white/20 text-white 
//                        p-2 rounded-md"
//           />
//         </div>

//         <div>
//           <label className="block text-sm text-white/80 mb-1">Daily Limit</label>
//           <input
//             type="number"
//             value={form.dailyLimit}
//             onChange={(e) =>
//               setForm({ ...form, dailyLimit: e.target.value })
//             }
//             className="w-full bg-white/10 border border-white/20 text-white 
//                        p-2 rounded-md"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm text-white/80 mb-1">Monthly Limit</label>
//           <input
//             type="number"
//             value={form.monthlyLimit}
//             onChange={(e) =>
//               setForm({ ...form, monthlyLimit: e.target.value })
//             }
//             className="w-full bg-white/10 border border-white/20 text-white 
//                        p-2 rounded-md"
//             required
//           />
//         </div>

//         <div className="flex gap-2">
//           <button
//             type="submit"
//             disabled={submitting}
//             className="bg-emerald-600 text-white px-4 py-2 rounded-md 
//                        disabled:opacity-50 hover:bg-emerald-700 transition"
//           >
//             {submitting ? "Updating..." : "Save Changes"}
//           </button>

//           <button
//             onClick={() => navigate(-1)}
//             type="button"
//             className="border border-white/30 text-white px-4 py-2 rounded-md 
//                        hover:bg-white/10 transition"
//           >
//             Cancel
//           </button>
//         </div>

//       </form>
//     </div>
//   </div>
// );

//   return (
//   <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-gray-900 
//                   flex items-center justify-center p-6">

//     <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl 
//                     border border-white/20 rounded-2xl p-6 shadow-2xl">

//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-semibold text-white">
//           Update Limit (ID: {limitId})
//         </h2>

//         <button
//           onClick={() => navigate(-1)}
//           className="px-3 py-1.5 rounded-md border border-white/30 text-white 
//                      hover:bg-white/10 transition"
//         >
//           Back
//         </button>
//       </div>

//       {/* Form */}
//       <form onSubmit={onSubmit} className="space-y-4">

//         {error && (
//           <p className="text-red-400 bg-red-900/30 border border-red-500/40 
//                         p-2 rounded-md text-sm">
//             {error}
//           </p>
//         )}

//         {/* User ID */}
//         <div>
//           <label className="block text-sm text-gray-300 mb-1">User ID</label>
//           <input
//             disabled
//             value={form.userID}
//             className="w-full rounded-lg bg-black/30 border border-gray-600 
//                        text-white px-3 py-2 outline-none opacity-60"
//           />
//         </div>

//         {/* Daily Limit */}
//         <div>
//           <label className="block text-sm text-gray-300 mb-1">Daily Limit</label>
//           <input
//             type="number"
//             value={form.dailyLimit}
//             onChange={(e) =>
//               setForm({ ...form, dailyLimit: e.target.value })
//             }
//             className="w-full rounded-lg bg-black/30 border border-gray-600 
//                        text-white px-3 py-2 outline-none
//                        focus:ring-2 focus:ring-indigo-400"
//             required
//           />
//         </div>

//         {/* Monthly Limit */}
//         <div>
//           <label className="block text-sm text-gray-300 mb-1">Monthly Limit</label>
//           <input
//             type="number"
//             value={form.monthlyLimit}
//             onChange={(e) =>
//               setForm({ ...form, monthlyLimit: e.target.value })
//             }
//             className="w-full rounded-lg bg-black/30 border border-gray-600 
//                        text-white px-3 py-2 outline-none
//                        focus:ring-2 focus:ring-indigo-400"
//             required
//           />
//         </div>

//         {/* Buttons */}
//         <div className="flex gap-3 pt-2">

//           <button
//             type="submit"
//             disabled={submitting}
//             className="px-4 py-2 rounded-lg text-white font-medium
//                        bg-gradient-to-r from-purple-500 to-indigo-600
//                        hover:from-purple-600 hover:to-indigo-700
//                        transition disabled:opacity-50"
//           >
//             {submitting ? "Updating..." : "Save Changes"}
//           </button>

//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 rounded-lg border border-white/30 
//                        text-white hover:bg-white/10 transition"
//           >
//             Cancel
//           </button>
//         </div>

//       </form>
//     </div>
//   </div>
// );
// return (
//   <div className="
//       min-h-screen
//       bg-[radial-gradient(circle_at_top,_#0f172a,_#020617_70%)]
//       flex items-center justify-center
//       p-6
//       relative overflow-hidden">

//     <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl 
//                     border border-white/20 rounded-2xl p-6 shadow-2xl">

//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-semibold text-white">
//           Update Limit (ID: {limitId})
//         </h2>

//         <button
//           onClick={() => navigate(-1)}
//           className="px-3 py-1.5 rounded-md border border-white/30 text-white 
//                      hover:bg-white/10 transition"
//         >
//           Back
//         </button>
//       </div>

//       {/* Form */}
//       <form onSubmit={onSubmit} className="space-y-4">

//         {error && (
//           <p className="text-red-400 bg-red-900/30 border border-red-500/40 
//                         p-2 rounded-md text-sm">
//             {error}
//           </p>
//         )}

//         {/* User ID */}
//         <div>
//           <label className="block text-sm text-gray-300 mb-1">User ID</label>
//           <input
//             disabled
//             value={form.userID}
//             className="
//               w-full rounded-lg
//               bg-teal-500/10
//               border border-teal-400/30
//               text-white px-3 py-2
//               outline-none opacity-70
//               backdrop-blur-md"
//           />
//         </div>

//         {/* Daily Limit */}
//         <div>
//           <label className="block text-sm text-gray-300 mb-1">Daily Limit</label>
//           <input
//             type="number"
//             value={form.dailyLimit}
//             onChange={(e) =>
//               setForm({ ...form, dailyLimit: e.target.value })
//             }
//             className="
//               w-full rounded-lg
//               bg-teal-500/10
//               border border-teal-400/30
//               text-white px-3 py-2
//               outline-none
//               backdrop-blur-md
//               focus:ring-2 focus:ring-teal-400/50"
//             required
//           />
//         </div>

//         {/* Monthly Limit */}
//         <div>
//           <label className="block text-sm text-gray-300 mb-1">Monthly Limit</label>
//           <input
//             type="number"
//             value={form.monthlyLimit}
//             onChange={(e) =>
//               setForm({ ...form, monthlyLimit: e.target.value })
//             }
//             className="
//               w-full rounded-lg
//               bg-teal-500/10
//               border border-teal-400/30
//               text-white px-3 py-2
//               outline-none
//               backdrop-blur-md
//               focus:ring-2 focus:ring-teal-400/50"
//             required
//           />
//         </div>

//         {/* Buttons */}
//         <div className="flex gap-3 pt-2">

//           <button
//             type="submit"
//             disabled={submitting}
//             className="
//               px-4 py-2 rounded-lg font-medium
//               text-teal-100
//               bg-gradient-to-r from-teal-500/40 to-cyan-500/40
//               border border-teal-400/40
//               hover:from-teal-500/60 hover:to-cyan-500/60
//               hover:shadow-[0_0_20px_#2dd4bf]
//               transition-all
//               disabled:opacity-50
// "
//           >
//             {submitting ? "Updating..." : "Save Changes"}
//           </button>

//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="
//               px-4 py-2 rounded-lg
//               text-teal-200
//               bg-teal-500/10
//               border border-teal-400/40
//               backdrop-blur-md
//               hover:bg-teal-500/20
//               hover:shadow-[0_0_12px_#2dd4bf]
//               transition-all
// "
//           >
//             Cancel
//           </button>
//         </div>

//       </form>
//     </div>
//   </div>
// );
//  }

return (
  <div
    className="
      min-h-screen
      bg-[radial-gradient(circle_at_top,_#0f172a,_#020617_70%)]
      flex items-center justify-center
      p-6
      relative overflow-hidden
    "
  >

    {/* subtle grid / tile overlay */}
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.05]"
      style={{
        backgroundImage:
          "linear-gradient(to right, #2dd4bf 1px, transparent 1px), linear-gradient(to bottom, #2dd4bf 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />

    <div
      className="
        w-full max-w-lg
        bg-gradient-to-br from-teal-500/15 to-cyan-500/5
        backdrop-blur-xl
        border border-teal-400/25
        rounded-2xl
        p-6
        shadow-[0_0_40px_rgba(45,212,191,0.25)]
        relative
      "
    >

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">
          Update <span className="text-teal-300">Limit</span> (ID: {limitId})
        </h2>

        <button
          onClick={() => navigate(-1)}
          className="
            px-3 py-1.5 rounded-md
            text-teal-200
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

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">

        {error && (
          <p
            className="text-red-300 bg-red-900/30 border border-red-500/40
                       p-2 rounded-md text-sm"
          >
            {error}
          </p>
        )}

        {/* User ID */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">User ID</label>
          <input
            disabled
            value={form.userID}
            className="
              w-full rounded-lg
              bg-teal-500/10
              border border-teal-400/30
              text-white px-3 py-2
              outline-none opacity-70
              backdrop-blur-md
            "
          />
        </div>

        {/* Daily Limit */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Daily Limit</label>
          <input
            type="number"
            value={form.dailyLimit}
            onChange={(e) =>
              setForm({ ...form, dailyLimit: e.target.value })
            }
            className="
              w-full rounded-lg
              bg-teal-500/10
              border border-teal-400/30
              text-white px-3 py-2
              outline-none
              backdrop-blur-md
              focus:ring-2 focus:ring-teal-400/50
            "
            required
          />
        </div>

        {/* Monthly Limit */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Monthly Limit</label>
          <input
            type="number"
            value={form.monthlyLimit}
            onChange={(e) =>
              setForm({ ...form, monthlyLimit: e.target.value })
            }
            className="
              w-full rounded-lg
              bg-teal-500/10
              border border-teal-400/30
              text-white px-3 py-2
              outline-none
              backdrop-blur-md
              focus:ring-2 focus:ring-teal-400/50
            "
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">

          <button
            type="submit"
            disabled={submitting}
            className="
              px-4 py-2 rounded-lg font-medium
              text-teal-100
              bg-gradient-to-r from-teal-500/40 to-cyan-500/40
              border border-teal-400/40
              hover:from-teal-500/60 hover:to-cyan-500/60
              hover:shadow-[0_0_20px_#2dd4bf]
              transition-all
              disabled:opacity-50
            "
          >
            {submitting ? "Updating..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              px-4 py-2 rounded-lg
              text-teal-200
              bg-teal-500/10
              border border-teal-400/40
              backdrop-blur-md
              hover:bg-teal-500/20
              hover:shadow-[0_0_12px_#2dd4bf]
              transition-all
            "
          >
            Cancel
          </button>

        </div>

      </form>
    </div>
  </div>
);
}