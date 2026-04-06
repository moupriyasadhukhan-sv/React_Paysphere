// src/pages/Dashboards/RegisterStaff.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../services/http";

import { toast } from "react-hot-toast";


const ROLES = ["Ops", "Risk"]; // adjust if needed

export default function RegisterStaff() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Ops",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/api/Auth/Admin-register", form);

      toast.success("Staff registered successfully!", {
        duration: 3000,
      });

      // Redirect after success
      setTimeout(() => {
        navigate("/dashboard/admin");
      }, 1200);

    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.title ||
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed.";

      // Detect 'already exists' cases
      if (
        msg.toLowerCase().includes("duplicate") ||
        msg.toLowerCase().includes("unique") ||
        msg.toLowerCase().includes("exists")
      ) {
        toast.error("User already exists!", { duration: 3000 });
      } else {
        toast.error(msg, { duration: 4000 });
      }
    } finally {
      setSubmitting(false);
    }
  };

// return (
//   <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-gray-900 p-6">
//     <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-2xl">

//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-xl font-semibold text-white">Register Staff</h1>

//         <Link
//           to="/dashboard/admin"
//           className="text-indigo-300 hover:text-indigo-400 text-sm"
//         >
//           ← Back to Dashboard
//         </Link>
//       </div>

//       <form onSubmit={onSubmit} className="space-y-4">

//         {error && (
//           <div className="rounded-md bg-red-900/40 border border-red-500/40 p-3 text-sm text-red-300">
//             {error}
//           </div>
//         )}

//         <div>
//           <label className="block text-sm text-gray-300 mb-1">Name *</label>
//           <input
//             name="name"
//             value={form.name}
//             onChange={onChange}
//             className="w-full bg-black/30 border border-gray-600 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
//             placeholder="Jane Doe"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm text-gray-300 mb-1">Email *</label>
//           <input
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={onChange}
//             className="w-full bg-black/30 border border-gray-600 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
//             placeholder="user@example.com"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm text-gray-300 mb-1">Password *</label>
//           <input
//             type="password"
//             name="password"
//             value={form.password}
//             onChange={onChange}
//             className="w-full bg-black/30 border border-gray-600 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
//             placeholder="••••••••"
//             required
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm text-gray-300 mb-1">Role *</label>
//             <select
//               name="role"
//               value={form.role}
//               onChange={onChange}
//               className="w-full bg-black/30 border border-gray-600 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
//               required
//             >
//               {ROLES.map((r) => (
//                 <option key={r} value={r} className="text-black">
//                   {r}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm text-gray-300 mb-1">Phone</label>
//             <input
//               name="phone"
//               value={form.phone}
//               onChange={onChange}
//               className="w-full bg-black/30 border border-gray-600 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
//               placeholder="7098474984"
//             />
//           </div>
//         </div>

//         <div className="pt-3">
//           <button
//             type="submit"
//             disabled={submitting}
//             className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 px-5 py-2 text-white font-medium hover:from-purple-600 hover:to-indigo-700 transition disabled:opacity-50"
//           >
//             {submitting ? "Registering…" : "Register Staff"}
//           </button>
//         </div>

//       </form>
//     </div>
//   </div>
//   )}

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
        w-full max-w-xl
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
        <h1 className="text-xl font-semibold text-white">
          Register Staff
        </h1>

        <Link
          to="/dashboard/admin"
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
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="text-red-400 bg-red-900/30 border border-red-500/40 p-2 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Name *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            required
            placeholder="Jane Doe"
            className="
              w-full rounded-lg bg-black/30
              border border-gray-600
              text-white px-3 py-2 outline-none
              focus:ring-2 focus:ring-indigo-400
            "
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
            placeholder="user@example.com"
            className="
              w-full rounded-lg bg-black/30
              border border-gray-600
              text-white px-3 py-2 outline-none
              focus:ring-2 focus:ring-indigo-400
            "
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Password *
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            required
            placeholder="••••••••"
            className="
              w-full rounded-lg bg-black/30
              border border-gray-600
              text-white px-3 py-2 outline-none
              focus:ring-2 focus:ring-indigo-400
            "
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Role *
            </label>
            <select
              name="role"
              value={form.role}
              onChange={onChange}
              required
              className="
                w-full rounded-lg bg-black/30
                border border-gray-600
                text-white px-3 py-2 outline-none
                focus:ring-2 focus:ring-indigo-400
              "
            >
              {ROLES.map((r) => (
                <option key={r} value={r} className="text-black">
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Phone
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="7098474984"
              className="
                w-full rounded-lg bg-black/30
                border border-gray-600
                text-white px-3 py-2 outline-none
                focus:ring-2 focus:ring-indigo-400
              "
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="
            w-full mt-2 px-4 py-2 rounded-lg font-medium
            text-teal-100
            bg-gradient-to-r from-teal-500/40 to-cyan-500/40
            border border-teal-400/40
            hover:from-teal-500/60 hover:to-cyan-500/60
            hover:shadow-[0_0_20px_#2dd4bf]
            disabled:opacity-50
            transition-all
          "
        >
          {submitting ? "Registering…" : "Register Staff"}
        </button>
      </form>
    </div>
  </div>
);}