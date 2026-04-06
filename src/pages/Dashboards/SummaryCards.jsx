import { useEffect, useState } from "react";
import { api } from "../../services/http";

export default function SummaryCards() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalMerchants, setTotalMerchants] = useState(0);

  useEffect(() => {
    let mounted = true;

    api
      .get("/api/Users", { params: { role: "User", page: 1, pageSize: 1 } })
      .then((res) => { if (mounted) setTotalUsers(res?.data?.total ?? 0); })
      .catch(console.error);

    api
      .get("/api/Merchant")
      .then((res) => {
        const data = Array.isArray(res?.data?.data) ? res.data.data : [];
        if (mounted) setTotalMerchants(data.length);
      })
      .catch(console.error);

    return () => { mounted = false; };
  }, []);


  
const userPercent =
  totalUsers + totalMerchants === 0
    ? 0
    : (totalUsers / (totalUsers + totalMerchants)) * 100;

const merchantPercent =
  totalUsers + totalMerchants === 0
    ? 0
    : (totalMerchants / (totalUsers + totalMerchants)) * 100;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Total Users */}
      <div className="relative">
  {/* Glow layer */}
  <div
    className="
      absolute inset-0 rounded-2xl 
      bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.55),_rgba(56,189,248,0.25),_transparent)]
      blur-2xl opacity-70
    "
  />

  {/* Glass card */}
  <div
    className="
      relative rounded-2xl p-6
      bg-gradient-to-br from-teal-500/15 to-cyan-500/5
      backdrop-blur-xl
      border border-teal-400/25
      shadow-[0_0_24px_rgba(45,212,191,0.25)]
      hover:shadow-[0_0_40px_rgba(45,212,191,0.45)]
      transition-all
    "
  >
    <div className="text-sm text-slate-300 mb-1">Total Users</div>
    <div className="text-4xl font-bold text-white drop-shadow-xl">
      {totalUsers.toLocaleString()}
    </div>
    <div className="text-xs text-teal-400 mt-2 font-medium">
      {userPercent.toFixed(1)}% of total accounts
    </div>
  </div>
</div>


      {/* Total Merchants */}
      <div className="relative">
  {/* Glow layer */}
  <div
    className="
      absolute inset-0 rounded-2xl 
      bg-[radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.5),_rgba(45,212,191,0.25),_transparent)]
      blur-2xl opacity-70
    "
  />

  {/* Glass card */}
  <div
    className="
      relative rounded-2xl p-6
      bg-gradient-to-br from-cyan-500/15 to-teal-500/5
      backdrop-blur-xl
      border border-teal-400/25
      shadow-[0_0_24px_rgba(56,189,248,0.25)]
      hover:shadow-[0_0_40px_rgba(56,189,248,0.45)]
      transition-all
    "
  >
    <div className="text-sm text-slate-300 mb-1">Total Merchants</div>
    <div className="text-4xl font-bold text-white drop-shadow-xl">
      {totalMerchants.toLocaleString()}
    </div>
    <div className="text-xs text-teal-400 mt-2 font-medium">
      {merchantPercent.toFixed(1)}% of total accounts
    </div>
  </div>
</div>

    </div>
  );
}
