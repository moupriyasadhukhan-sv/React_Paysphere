// import React, { useState } from "react";
// import DashboardShell from "../../components/dashboard/DashboardShell";
// import useLogout from "../../hooks/useLogout";
// import MerchantRefundsPage from "../Payment/MerchantRefundPage";
// import MerchantSettlements from "../settlements/MerchantSettlements";
// import SettingsPage from "./SettingsPage";
// import { SettingsProvider, useSettings } from "../../context/SettingsContext";
// import { jwtDecode } from "jwt-decode";

// function getNameFromToken() {
//   try {
//     const token = localStorage.getItem("ps_token");
//     const decoded = jwtDecode(token);
//     const email = decoded.email || "";
//     const namePart = email.split("@")[0];
//     return namePart.charAt(0).toUpperCase() + namePart.slice(1);
//   } catch { return ""; }
// }

// const HomeIcon     = () => <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 3l9 8h-3v9H6v-9H3l9-8z"/></svg>;
// const WalletIcon   = () => <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M21 7H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-1 12H4V9h16v10zm-5-5a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM3 5h16V3H3a1 1 0 0 0-1 1v1h1z"/></svg>;
// const ReportIcon   = () => <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M5 3h10l4 4v14H5zM9 7v10M13 11v6"/></svg>;
// const RefundIcon   = () => <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M20 12a8 8 0 1 1-8-8v3l4-4-4-4v3a10 10 0 1 0 10 10h-2z"/></svg>;
// const SettingsIcon = () => <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.07-1.07-.9-.52a7 7 0 0 0 0-2.82l.9-.52a1 1 0 0 0 .37-1.37l-1-1.73a1 1 0 0 0-1.37-.37l-.9.52A7 7 0 0 0 13 6.07V5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v1.07a7 7 0 0 0-2.17 1.25l-.9-.52a1 1 0 0 0-1.37.37l-1 1.73a1 1 0 0 0 .37 1.37l.9.52a7 7 0 0 0 0 2.82l-.9.52a1 1 0 0 0-.37 1.37l1 1.73a1 1 0 0 0 1.37.37l.9-.52A7 7 0 0 0 9 17.93V19a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1.07a7 7 0 0 0 2.17-1.25l.9.52a1 1 0 0 0 1.37-.37l1-1.73a1 1 0 0 0-.37-1.37z"/></svg>;
// const LogoutIcon   = () => <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M16 13v-2H7V8l-5 4 5 4v-3h9zM20 3h-8v2h8v14h-8v2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/></svg>;

// function MerchantDashboardInner() {
//   const logout   = useLogout("/login");
//   const [activeKey, setActiveKey] = useState("home");
//   const userName = getNameFromToken();

//   const navItems = [
//     { key: "home",       label: "Home",        icon: <HomeIcon />     },
//     { key: "wallet",     label: "Wallet",      icon: <WalletIcon />   },
//     { key: "report",     label: "Report",      icon: <ReportIcon />   },
//     { key: "refund",     label: "Refunds",     icon: <RefundIcon />   },
//     { key: "settings",   label: "Settings",    icon: <SettingsIcon /> },
//     { key: "logout",     label: "Logout",      icon: <LogoutIcon />   },
//   ];

//   return (
//     <DashboardShell
//       variant="merchant"
//       navItems={navItems}
//       defaultKey="home"
//       activeTab={activeKey}
//       onTabChange={setActiveKey}
//       onLogout={logout}
//       userName={userName}
//     >
//       {activeKey === "wallet"   && <div className="flex items-center justify-center h-64 text-white/40">Wallet coming soon</div>}
//       {activeKey === "report"   && <MerchantSettlements />}
//       {activeKey === "refund"   && <MerchantRefundsPage />}
//       {activeKey === "settings" && <SettingsPage />}
//     </DashboardShell>
//   );
// }

// export default function MerchantDashboard() {
//   return (
//     <SettingsProvider>
//       <MerchantDashboardInner />
//     </SettingsProvider>
//   );
// }
import React, { useState } from "react";
import DashboardShell from "../../components/dashboard/DashboardShell";
import useLogout from "../../hooks/useLogout";
import MerchantRefundsPage from "../Payment/MerchantRefundPage";
import MerchantSettlements from "../settlements/MerchantSettlements";
import SettingsPage from "./SettingsPage";
import { SettingsProvider, useSettings } from "../../context/SettingsContext";
import { jwtDecode } from "jwt-decode";
import MerchantWalletDashboard from "./MerchantWalletDashboard";
function getNameFromToken() {
  try {
    const token = localStorage.getItem("ps_token");
    const decoded = jwtDecode(token);
    const email = decoded.email || "";
    const namePart = email.split("@")[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  } catch { return ""; }
}

const HomeIcon     = () => <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 3l9 8h-3v9H6v-9H3l9-8z"/></svg>;
const WalletIcon   = () => <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M21 7H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-1 12H4V9h16v10zm-5-5a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM3 5h16V3H3a1 1 0 0 0-1 1v1h1z"/></svg>;
const ReportIcon   = () => <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M5 3h10l4 4v14H5zM9 7v10M13 11v6"/></svg>;
const RefundIcon   = () => <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M20 12a8 8 0 1 1-8-8v3l4-4-4-4v3a10 10 0 1 0 10 10h-2z"/></svg>;
const SettingsIcon = () => <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.07-1.07-.9-.52a7 7 0 0 0 0-2.82l.9-.52a1 1 0 0 0 .37-1.37l-1-1.73a1 1 0 0 0-1.37-.37l-.9.52A7 7 0 0 0 13 6.07V5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v1.07a7 7 0 0 0-2.17 1.25l-.9-.52a1 1 0 0 0-1.37.37l-1 1.73a1 1 0 0 0 .37 1.37l.9.52a7 7 0 0 0 0 2.82l-.9.52a1 1 0 0 0-.37 1.37l1 1.73a1 1 0 0 0 1.37.37l.9-.52A7 7 0 0 0 9 17.93V19a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1.07a7 7 0 0 0 2.17-1.25l.9.52a1 1 0 0 0 1.37-.37l1-1.73a1 1 0 0 0-.37-1.37z"/></svg>;
const LogoutIcon   = () => <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M16 13v-2H7V8l-5 4 5 4v-3h9zM20 3h-8v2h8v14h-8v2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/></svg>;

function MerchantDashboardInner() {
  const logout   = useLogout("/login");
  const [activeKey, setActiveKey] = useState("home");
  const userName = getNameFromToken();

  const navItems = [
    { key: "home",       label: "Home",        icon: <HomeIcon />     },
    { key: "wallet",     label: "Wallet",      icon: <WalletIcon />   },
    { key: "report",     label: "Report",      icon: <ReportIcon />   },
    { key: "refund",     label: "Refunds",     icon: <RefundIcon />   },
    { key: "settings",   label: "Settings",    icon: <SettingsIcon /> },
    { key: "logout",     label: "Logout",      icon: <LogoutIcon />   },
  ];

  return (
    <DashboardShell
      variant="merchant"
      navItems={navItems}
      defaultKey="home"
      activeTab={activeKey}
      onTabChange={setActiveKey}
      onLogout={logout}
      userName={userName}
    >
      {activeKey === "wallet"   && <div className="flex items-center justify-center h-64 text-white/40">Wallet coming soon</div>}
      {activeKey === "report"   && <MerchantSettlements />}
      {activeKey === "refund"   && <MerchantRefundsPage />}
      {activeKey ==="wallet"   && <MerchantWalletDashboard />}
      {activeKey === "settings" && <SettingsPage />}
    </DashboardShell>
  );
}

export default function MerchantDashboard() {
  return (
    <SettingsProvider>
      <MerchantDashboardInner />
    </SettingsProvider>
  );
}
