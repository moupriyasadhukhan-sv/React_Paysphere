// // import { useEffect, useState } from "react";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import http from "../../services/http";

// // function useQuery() {
// //   const { search } = useLocation();
// //   return new URLSearchParams(search);
// // }

// // export default function CreateLimit() {
// //   const navigate = useNavigate();
// //   const q = useQuery();
// //   const initialUserId = q.get("userId") || "";

// //   const [form, setForm] = useState({
// //     userID: initialUserId,
// //     dailyLimit: "",
// //     monthlyLimit: "",
// //   });
// //   const [submitting, setSubmitting] = useState(false);
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     setForm((f) => ({ ...f, userID: initialUserId }));
// //   }, [initialUserId]);

// //   const onChange = (e) => {
// //     const { name, value } = e.target;
// //     setForm((f) => ({ ...f, [name]: value }));
// //   };

// //   const onSubmit = async (e) => {
// //     e.preventDefault();
// //     setError("");
// //     setSubmitting(true);

// //     try {
// //       const payload = {
// //         userID: Number(form.userID),
// //         dailyLimit: Number(form.dailyLimit || 0),
// //         monthlyLimit: Number(form.monthlyLimit || 0),
// //       };
// //       await http.post("/api/limits", payload); // <-- DB update happens here

// //       navigate(`/dashboard/admin/limits/${encodeURIComponent(form.userID)}`, { replace: true });
// //       // or: navigate("/dashboard/admin"); // if you want to go straight back to dashboard
// //     } catch (err) {
// //       console.error(err);
// //       setError("Failed to create limit.");
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div className="p-6">
// //       <div className="mb-4 flex items-center justify-between">
// //         <h2 className="text-xl font-semibold">Create Limit</h2>
// //         <button onClick={() => navigate(-1)} className="px-3 py-1.5 rounded-md border hover:bg-slate-50">
// //           Back
// //         </button>
// //       </div>

// //       <form onSubmit={onSubmit} className="rounded-lg border bg-white p-4 max-w-lg space-y-4">
// //         {error && <div className="text-red-500 text-sm">{error}</div>}

// //         <div>
// //           <label className="block text-sm font-medium mb-1">User ID</label>
// //           <input
// //             type="number"
// //             name="userID"
// //             value={form.userID}
// //             onChange={onChange}
// //             className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
// //             required
// //           />
// //         </div>

// //         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //           <div>
// //             <label className="block text-sm font-medium mb-1">Daily Limit</label>
// //             <input
// //               type="number"
// //               name="dailyLimit"
// //               value={form.dailyLimit}
// //               onChange={onChange}
// //               className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
// //               placeholder="e.g., 100000"
// //             />
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium mb-1">Monthly Limit</label>
// //             <input
// //               type="number"
// //               name="monthlyLimit"
// //               value={form.monthlyLimit}
// //               onChange={onChange}
// //               className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
// //               placeholder="e.g., 1000000000"
// //             />
// //           </div>
// //         </div>

// //         <div className="pt-2">
// //           <button type="submit" disabled={submitting}
// //                   className="px-4 py-2 rounded-md text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60">
// //             {submitting ? "Saving..." : "Create Limit"}
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // }


// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { api } from "../../services/http";

// function useQuery() {
//   const { search } = useLocation();
//   return new URLSearchParams(search);
// }

// export default function CreateLimit() {
//   const navigate = useNavigate();
//   const q = useQuery();
//   const initialUserId = q.get("userId") || "";

//   const [form, setForm] = useState({
//     userID: initialUserId,
//     dailyLimit: "",
//     monthlyLimit: "",
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     setForm((f) => ({ ...f, userID: initialUserId }));
//   }, [initialUserId]);

//   const onChange = (e) => {
//     const { name, value } = e.target;
//     setForm((f) => ({ ...f, [name]: value }));
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSubmitting(true);

//     try {
//       const payload = {
//         userID: Number(form.userID),
//         dailyLimit: Number(form.dailyLimit || 0),
//         monthlyLimit: Number(form.monthlyLimit || 0),
//       };

//       await api.post("/api/limits", payload);

//       navigate(`/dashboard/admin/limits/${form.userID}`, { replace: true });
//     } catch (err) {
//       console.error(err);

//       if (err.response?.status === 409) {
//         // limit already exists
//         const msg = err.response?.data?.message || "Limit exists.";
//         setError(msg);

//         // redirect automatically to update page
//         if (err.response?.data?.data?.limitID) {
//           navigate(`/dashboard/admin/limits/update/${err.response.data.data.limitID}`);
//         }

//       } else {
//         setError("Failed to create limit.");
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };
// return (
//   <div className="min-h-screen flex items-center justify-center p-6">
    
//     <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl 
//                     border border-white/20 rounded-2xl p-6
//                     shadow-xl animate-[fadeIn_0.4s_ease]">

//       {/* Card Header */}
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-semibold text-white">Create Limit</h2>

//         <button
//           onClick={() => navigate(-1)}
//           className="px-3 py-1.5 rounded-md border border-white/30 
//                      text-white hover:bg-white/10 transition"
//         >
//           Back
//         </button>
//       </div>

//       {/* Form */}
//       <form onSubmit={onSubmit} className="space-y-4">

//         {error && <div className="text-red-400 text-sm">{error}</div>}

//         <div>
//           <label className="block text-sm text-white/80 mb-1">User ID</label>
//           <input
//             type="number"
//             name="userID"
//             value={form.userID}
//             onChange={onChange}
//             className="w-full rounded-md border border-white/20 bg-white/10 
//                        text-white px-3 py-2 focus:outline-none focus:ring-2 
//                        focus:ring-purple-400/40"
//             required
//           />
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm text-white/80 mb-1">Daily Limit</label>
//             <input
//               type="number"
//               name="dailyLimit"
//               value={form.dailyLimit}
//               onChange={onChange}
//               className="w-full rounded-md border border-white/20 bg-white/10 
//                          text-white px-3 py-2"
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-white/80 mb-1">Monthly Limit</label>
//             <input
//               type="number"
//               name="monthlyLimit"
//               value={form.monthlyLimit}
//               onChange={onChange}
//               className="w-full rounded-md border border-white/20 bg-white/10 
//                          text-white px-3 py-2"
//             />
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={submitting}
//           className="px-4 py-2 rounded-md text-white 
//                      bg-emerald-500 hover:bg-emerald-600 
//                      disabled:opacity-60 transition"
//         >
//           {submitting ? "Saving…" : "Create Limit"}
//         </button>

//       </form>
//     </div>
//   </div>
// );
// }


import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../services/http";
import toast from "react-hot-toast";

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export default function CreateLimit() {
  const navigate = useNavigate();
  const q = useQuery();
  const initialUserId = q.get("userId") || "";

  const [form, setForm] = useState({
    userID: initialUserId,
    dailyLimit: "",
    monthlyLimit: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm((f) => ({ ...f, userID: initialUserId }));
  }, [initialUserId]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSubmitting(true);

  try {
    const payload = {
      userID: Number(form.userID),
      dailyLimit: Number(form.dailyLimit || 0),
      monthlyLimit: Number(form.monthlyLimit || 0),
    };

    await api.post("/api/limits", payload);

    toast.success("Limit created successfully!");

    navigate(`/dashboard/admin/limits/${form.userID}`, { replace: true });

  } catch (err) {
    console.error(err);

    if (err.response?.status === 409) {
      // Limit already exists
      const msg = err.response?.data?.message || "Limit already exists.";
      toast.error(msg);

      // Redirect automatically to update page
      if (err.response?.data?.data?.limitID) {
        navigate(`/dashboard/admin/limits/update/${err.response.data.data.limitID}`);
      }

    } else {
      toast.error("Failed to create limit. Try again later.");
    }
  } finally {
    setSubmitting(false);
  }
};

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

   <div
  className="
    w-full max-w-lg
    bg-gradient-to-br from-teal-500/15 to-cyan-500/5
    backdrop-blur-xl
    border border-teal-400/25
    rounded-2xl
    p-6
    shadow-[0_0_40px_rgba(45,212,191,0.25)]
  "
>


      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Create Limit</h2>

        <button
          onClick={() => navigate(-1)}
          className="
            px-3 py-1.5 rounded-md
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

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">

        {error && (
          <div className="text-red-400 bg-red-900/30 border border-red-500/40 p-2 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-300 mb-1">User ID</label>
          <input
            type="number"
            name="userID"
            value={form.userID}
            onChange={onChange}
            className="w-full rounded-lg bg-black/30 border border-gray-600 
                       text-white px-3 py-2 outline-none 
                       focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Daily Limit</label>
            <input
              type="number"
              name="dailyLimit"
              value={form.dailyLimit}
              onChange={onChange}
              className="w-full rounded-lg bg-black/30 border border-gray-600 
                         text-white px-3 py-2 outline-none 
                         focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Monthly Limit</label>
            <input
              type="number"
              name="monthlyLimit"
              value={form.monthlyLimit}
              onChange={onChange}
              className="w-full rounded-lg bg-black/30 border border-gray-600 
                         text-white px-3 py-2 outline-none 
                         focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

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
            disabled:opacity-50
            transition-all
          "
        >
        {submitting ? "Saving…" : "Create Limit"}
      </button>

      </form>
    </div>
  </div>
);
}