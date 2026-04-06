import { useState } from "react";
import { useNavigate, useOutlet } from "react-router-dom";

import LogoutButton from "../../common/LogoutButton";
import SummaryCards from "./SummaryCards";
import UsersTable from "../../components/users/UsersTable";
import MerchantTable from "../../components/merchants/MerchantsTable";
import TransactionsTable from "../../components/transactions/TransactionsTable";
import AuditLogsTable from "../../components/audit/AuditLogsTable";
import FlaggedInstruments from "../../components/FlaggedInstruments";

export default function AdminDashboard() {
  const [tab, setTab] = useState("users");
  const navigate = useNavigate();
  const outlet = useOutlet();

  const tabs = ["users", "merchants", "transactions", "flagged", "reports", "auditLog"];
  const renderLabel = (t) => ({
    auditLog: "Audit Log",
    flagged: "Flagged Instruments",
  }[t] ?? t[0].toUpperCase() + t.slice(1));

  const header = (
    <header className="w-full px-6 py-3 bg-black/40 backdrop-blur-xl shadow-lg border-b border-white/10 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-wide">Admin Dashboard</h1>
        <p className="text-sm text-gray-300">Manage users, merchants, and system operations</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/dashboard/admin/register-staff')}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 transition-all shadow-lg shadow-purple-700/40"        >
          Register Staff
        </button>
        <LogoutButton />
      </div>
    </header>
  );

  if (outlet) {
    return (
      
<div className="min-h-screen text-white 
  bg-[radial-gradient(circle_at_top_left,_#0f172a,_#020617_60%)]
  relative overflow-hidden">

        {header}
        <main className="space-y-6">{outlet}</main>
      </div>
    );
  }

  return (
   
<div className="min-h-screen text-white 
  bg-[radial-gradient(circle_at_top_left,_#0f172a,_#020617_60%)]
  relative overflow-hidden">

      {header}

      <main className="p-6 space-y-6">
        <SummaryCards />

        {/* TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
  {tabs.map((t) => (
    <button
      key={t}
      onClick={() => setTab(t)}
      className={`px-4 py-2 rounded-full text-sm 
        border backdrop-blur-lg whitespace-nowrap
        transition-all duration-200
        ${
          tab === t
            ? `
              bg-teal-500/20
              border-teal-400/60
              text-teal-200
              shadow-[0_0_14px_#2dd4bf]
            `
            : `
              bg-white/5
              border-white/10
              text-gray-300
              hover:bg-teal-500/20
              hover:border-teal-400/40
              hover:text-teal-200
            `
        }`}
    >
      {renderLabel(t)}
    </button>
  ))}
</div>

        {/* CONTENT PANEL */}
        <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 shadow-lg">
          {tab === "users" && <UsersTable />}
          {tab === "merchants" && <MerchantTable />}
          {tab === "transactions" && (
            <div>
              <TransactionsTable />
            </div>
          )}
          {tab === "reports" && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Reports</h2>

              <p className="text-sm text-gray-400 mb-4">
                Select a report to view detailed analytics.
              </p>

              <div className="flex gap-4">
                {/* USER REPORT BUTTON */}
                <button
               
                  onClick={() => navigate("/dashboard/admin/reports/users")}
                  className="px-5 py-2 bg-purple-700/40 border border-purple-400 
                    text-purple-200 rounded-lg hover:bg-purple-700/60 
                    transition-all shadow-[0_0_12px_#a855f7]"
                >
                  User Report
                </button>

                {/* MERCHANT REPORT BUTTON */}
                <button
                
                  onClick={() => navigate("/dashboard/admin/reports/merchants")}
                  className="px-5 py-2 bg-purple-700/40 border border-purple-400 
                    text-purple-200 rounded-lg hover:bg-purple-700/60 
                    transition-all shadow-[0_0_12px_#a855f7]"
                >
                  Merchant Report
                </button>
              </div>
            </div>
          )}
          {tab === "auditLog" && <AuditLogsTable />}
          {tab === "flagged" && <FlaggedInstruments />}
        </section>
      </main>
    </div>
  );
}
