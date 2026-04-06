// // import { useEffect, useState } from "react";
// // import { useNavigate, useParams } from "react-router-dom";
// // import http from "../../services/http";

// // export default function ShowLimit() {
// //   const { userId } = useParams();
// //   const navigate = useNavigate();
// //   const [loading, setLoading] = useState(true);
// //   const [limit, setLimit] = useState(null);
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     let mounted = true;
// //     setLoading(true);
// //     setError("");

// //     http.get("/api/limits", { params: { userId } })
// //       .then((res) => {
// //         if (!mounted) return;
// //         const data = res?.data?.data;
// //         const first = Array.isArray(data) ? data[0] : data;
// //         setLimit(first ?? null);
// //       })
// //       .catch((e) => {
// //         console.error(e);
// //         setError("Failed to fetch limits");
// //       })
// //       .finally(() => mounted && setLoading(false));

// //     return () => { mounted = false; };
// //   }, [userId]);

// //   return (
// //     <div className="p-6">
// //       <div className="mb-4 flex items-center justify-between">
// //         <h2 className="text-xl font-semibold">User Limits</h2>
// //         <div className="flex gap-2">
// //           <button
// //             onClick={() => navigate(`/dashboard/admin/limits/create?userId=${encodeURIComponent(userId)}`)}
// //             className="px-3 py-1.5 rounded-md text-white bg-emerald-500 hover:bg-emerald-600"
// //           >
// //             Create / Update Limit
// //           </button>
// //           <button
// //             onClick={() => navigate(-1)}
// //             className="px-3 py-1.5 rounded-md border hover:bg-slate-50"
// //           >
// //             Back
// //           </button>
// //         </div>
// //       </div>

// //       <div className="rounded-lg border bg-white p-4">
// //         {loading && <p className="text-slate-600">Loading…</p>}
// //         {!loading && error && <p className="text-red-500">{error}</p>}
// //         {!loading && !error && !limit && <p className="text-slate-600">No limit found for user {userId}.</p>}
// //         {!loading && !error && limit && (
// //           <div className="space-y-2">
// //             <div><span className="font-medium">User ID:</span> {limit.userID ?? userId}</div>
// //             <div><span className="font-medium">Daily Limit:</span> {limit.dailyLimit}</div>
// //             <div><span className="font-medium">Monthly Limit:</span> {limit.monthlyLimit}</div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }


// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { api } from "../../services/http";

// export default function ShowLimit() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [limit, setLimit] = useState(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let mounted = true;
//     setLoading(true);
//     setError("");

//     api.get("/api/limits", { params: { userId } })
//       .then((res) => {
//         if (!mounted) return;
//         const data = res?.data?.data;
//         const only = Array.isArray(data) ? data[0] : data;
//         setLimit(only ?? null);
//       })
//       .catch(() => setError("Failed to fetch limits"))
//       .finally(() => mounted && setLoading(false));

//     return () => { mounted = false; };
//   }, [userId]);

// //   return (
// //     <div className="p-6">
// //       <div className="mb-4 flex items-center justify-between">
// //         <h2 className="text-xl font-semibold">User Limits</h2>
// //         <div className="flex gap-2">
// //           <button
// //             onClick={() => {
// //               if (limit) navigate(`/dashboard/admin/limits/update/${limit.limitID}`);
// //               else navigate(`/dashboard/admin/limits/create?userId=${userId}`);
// //             }}
// //             className="px-3 py-1.5 rounded-md text-white bg-emerald-500 hover:bg-emerald-600"
// //           >
// //             {limit ? "Update Limit" : "Create Limit"}
// //           </button>

// //           <button
// //             onClick={() => navigate(-1)}
// //             className="px-3 py-1.5 rounded-md border hover:bg-slate-50"
// //           >
// //             Back
// //           </button>
// //         </div>
// //       </div>

// //       <div className="rounded-lg border bg-white p-4">
// //         {loading && <p className="text-slate-600">Loading…</p>}
// //         {!loading && error && <p className="text-red-500">{error}</p>}
// //         {!loading && !error && !limit && (
// //           <p className="text-slate-600">No limit found for user {userId}.</p>
// //         )}

// //         {!loading && limit && (
// //           <div className="space-y-2">
// //             <div><b>User ID:</b> {limit.userID}</div>
// //             <div><b>Daily Limit:</b> {limit.dailyLimit}</div>
// //             <div><b>Monthly Limit:</b> {limit.monthlyLimit}</div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
//     return (
//   <div className="min-h-screen flex items-center justify-center p-6">

//     <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl 
//                     border border-white/20 rounded-2xl p-6 shadow-xl">

//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-semibold text-white">User Limits</h2>

//         <button
//           onClick={() => navigate(-1)}
//           className="px-3 py-1.5 rounded-md border border-white/30 text-white 
//                      hover:bg-white/10 transition"
//         >
//           Back
//         </button>
//       </div>

//       {loading && <p className="text-slate-300">Loading…</p>}
//       {!loading && error && <p className="text-red-400">{error}</p>}

//       {!loading && !error && !limit && (
//         <p className="text-slate-300">No limit found for user {userId}.</p>
//       )}

//       {!loading && limit && (
//         <div className="space-y-2 text-white/90">
//           <div><b>User ID:</b> {limit.userID}</div>
//           <div><b>Daily Limit:</b> {limit.dailyLimit}</div>
//           <div><b>Monthly Limit:</b> {limit.monthlyLimit}</div>
//         </div>
//       )}

//       <div className="mt-4 flex gap-2">
//         <button
//           onClick={() =>
//             limit
//               ? navigate(`/dashboard/admin/limits/update/${limit.limitID}`)
//               : navigate(`/dashboard/admin/limits/create?userId=${userId}`)
//           }
//           className="px-3 py-1.5 rounded-md text-white 
//                      bg-emerald-500 hover:bg-emerald-600 transition"
//         >
//           {limit ? "Update Limit" : "Create Limit"}
//         </button>
//       </div>

//     </div>
//   </div>
// );
//  }


import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/http";

export default function ShowLimit() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    api.get("/api/limits", { params: { userId } })
      .then((res) => {
        if (!mounted) return;
        const data = res?.data?.data;
        const only = Array.isArray(data) ? data[0] : data;
        setLimit(only ?? null);
      })
      .catch(() => setError("Failed to fetch limits"))
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [userId]);

  
// return (
//   <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-gray-900 
//                   flex items-center justify-center p-6">

//     <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl 
//                     border border-white/20 rounded-2xl p-6 shadow-xl">

//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-semibold text-white">User Limits</h2>

//         <button
//           onClick={() => navigate(-1)}
//           className="px-3 py-1.5 rounded-md border border-white/30 text-white 
//                      hover:bg-white/10 transition"
//         >
//           Back
//         </button>
//       </div>

//       {loading && <p className="text-slate-300">Loading…</p>}
//       {!loading && error && <p className="text-red-400">{error}</p>}

//       {!loading && !error && !limit && (
//         <p className="text-slate-300">No limit found for user {userId}.</p>
//       )}

//       {!loading && limit && (
//         <div className="space-y-2 text-white/90">
//           <div><b>User ID:</b> {limit.userID}</div>
//           <div><b>Daily Limit:</b> {limit.dailyLimit}</div>
//           <div><b>Monthly Limit:</b> {limit.monthlyLimit}</div>
//         </div>
//       )}

//       <div className="mt-4 flex gap-2">
//         <button
//           onClick={() =>
//             limit
//               ? navigate(`/dashboard/admin/limits/update/${limit.limitID}`)
//               : navigate(`/dashboard/admin/limits/create?userId=${userId}`)
//           }
//           className="px-3 py-1.5 rounded-md text-white font-medium
//            bg-gradient-to-r from-purple-500 to-indigo-600
//            hover:from-purple-600 hover:to-indigo-700
//            transition"
//         >
//           {limit ? "Update Limit" : "Create Limit"}
//         </button>
//       </div>

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
    {/* subtle grid overlay */}
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
        shadow-[0_0_35px_rgba(45,212,191,0.25)]
        relative
      "
    >

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">
          User <span className="text-teal-300">Limits</span>
        </h2>

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

      {loading && <p className="text-slate-300">Loading…</p>}
      {!loading && error && <p className="text-red-400">{error}</p>}

      {!loading && !error && !limit && (
        <p className="text-slate-300">
          No limit found for user <span className="text-teal-300">{userId}</span>.
        </p>
      )}

      {!loading && limit && (
        <div className="space-y-2 text-white/90">
          <div>
            <b className="text-teal-300">User ID:</b> {limit.userID}
          </div>
          <div>
            <b className="text-teal-300">Daily Limit:</b> {limit.dailyLimit}
          </div>
          <div>
            <b className="text-teal-300">Monthly Limit:</b> {limit.monthlyLimit}
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={() =>
            limit
              ? navigate(`/dashboard/admin/limits/update/${limit.limitID}`)
              : navigate(`/dashboard/admin/limits/create?userId=${userId}`)
          }
          className="
            px-3 py-1.5 rounded-md font-medium
            text-teal-100
            bg-gradient-to-r from-teal-500/40 to-cyan-500/40
            border border-teal-400/40
            hover:from-teal-500/60 hover:to-cyan-500/60
            hover:shadow-[0_0_18px_#2dd4bf]
            transition-all
          "
        >
          {limit ? "Update Limit" : "Create Limit"}
        </button>
      </div>

    </div>
  </div>
);
}