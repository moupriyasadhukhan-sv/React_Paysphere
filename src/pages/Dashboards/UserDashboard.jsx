// // import React, { useState } from "react";
// // import { useSelector } from "react-redux";
// // import DashboardShell from "../../components/dashboard/DashboardShell";
// // import PaymentMethodsPage from "./PaymentMethodsPage";
// // import WalletDashboard from "./WalletDashboard";
// // import UserTransactionsPage from "../transactions/UserTransactionsPage";
// // import UserPaymentPage from "../Payment/UserPaymentPage";
// // import useLogout from "../../hooks/useLogout";
// // import SettingsPage from "./SettingsPage";
// // import { SettingsProvider, useSettings } from "../../context/SettingsContext";
// // import { selectUserName, selectUserEmail } from "../../stores/authSlice";

// // function UserDashboardInner() {
// //   const [activeTab, setActiveTab] = useState("home");
// //   const { t } = useSettings();
// //   const rawName = useSelector(selectUserName);
// //   const email = useSelector(selectUserEmail);

// //   // Derive display name: stored name → email prefix → fallback
// //   const userName = rawName
// //     || (email ? email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "")
// //     || localStorage.getItem("ps_name")
// //     || "User";

// //   const navItems = [
// //     { key: "home",         label: t.home,         icon: "🏠" },
// //     { key: "transactions", label: t.transactions,  icon: "💸" },
// //     { key: "payment",      label: t.payment,       icon: "📱" },
// //     { key: "wallet",       label: t.wallet,        icon: "👛" },
// //     { key: "cards",        label: t.cards,         icon: "💳" },
// //     { key: "settings",     label: t.settings,      icon: "⚙️" },
// //     { key: "logout",       label: t.logout,        icon: "🚪" },
// //   ];

// //   const handleLogout = () => {
// //     localStorage.clear();
// //     window.location.href = "/login";
// //   };

// //   return (
// //     <DashboardShell
// //       onTabChange={(key) => setActiveTab(key)}
// //       navItems={navItems}
// //       onLogout={handleLogout}
// //       userName={userName}
// //       activeTab={activeTab}
// //     >
// //       {activeTab === "cards"        && <PaymentMethodsPage />}
// //       {activeTab === "transactions" && <UserTransactionsPage />}
// //       {activeTab === "payment"      && <UserPaymentPage />}
// //       {activeTab === "wallet"       && <WalletDashboard />}
// //       {activeTab === "settings"     && <SettingsPage onNavigate={setActiveTab} />}
// //     </DashboardShell>
// //   );
// // }

// // export default function UserDashboard() {
// //   return (
// //     <SettingsProvider>
// //       <UserDashboardInner />
// //     </SettingsProvider>
// //   );
// // }

// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import useLogout from "../../hooks/useLogout";
// import DashboardShell from "../../components/dashboard/DashboardShell";
// import PaymentMethodsPage from "./PaymentMethodsPage";
// import WalletDashboard from "./WalletDashboard";
// import UserTransactionsPage from "../transactions/UserTransactionsPage";
// import UserPaymentPage from "../Payment/UserPaymentPage";
// import SettingsPage from "./SettingsPage";
// import { SettingsProvider, useSettings } from "../../context/SettingsContext";
// import { selectUserName, selectUserEmail } from "../../stores/authSlice";
// import UserHomePage from "../../components/dashboard/UserHomePage";
// function UserDashboardInner() {
//   const [activeTab, setActiveTab] = useState("home");
//   const { t } = useSettings();
//   const rawName = useSelector(selectUserName);
//   const email = useSelector(selectUserEmail);
 
//   //Derive display name: stored name → email prefix → fallback
//   const userName = rawName
//     || (email ? email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "")
//     || localStorage.getItem("ps_name")
//     || "User";
 
//   // const userName = localStorage.getItem("ps_name");

//   const navItems = [
//     { key: "home",         label: t.home,         icon: "🏠" },
//     { key: "transactions", label: t.transactions,  icon: "💸" },
//     { key: "payment",      label: t.payment,       icon: "📱" },
//     { key: "wallet",       label: t.wallet,        icon: "👛" },
//     { key: "cards",        label: t.cards,         icon: "💳" },
//     { key: "settings",     label: t.settings,      icon: "⚙️" },
//     { key: "logout",       label: t.logout,        icon: "🚪" },
//   ];
 
//   const handleLogout = useLogout("/login");
 
//   return (
//     <DashboardShell
//       onTabChange={(key) => setActiveTab(key)}
//       navItems={navItems}
//       onLogout={handleLogout}
//       userName={userName}
//       activeTab={activeTab}
//     >
//       {activeTab === "home"       && <UserHomePage darkMode={darkMode} username={username} />}
//       {activeTab === "cards"        && <PaymentMethodsPage />}
//       {activeTab === "transactions" && <UserTransactionsPage />}
//       {activeTab === "payment"      && <UserPaymentPage />}
//       {activeTab === "wallet"       && <WalletDashboard />}
//       {activeTab === "settings"     && <SettingsPage onNavigate={setActiveTab} />}
//     </DashboardShell>
//   );
// }
 
// export default function UserDashboard() {
//   return (
//     <SettingsProvider>
//       <UserDashboardInner />
//     </SettingsProvider>
//   );
// }
 
import React, { useState } from "react";
import { useSelector } from "react-redux";
import DashboardShell from "../../components/dashboard/DashboardShell";
import UserHomePage from "../../components/dashboard/UserHomePage";
import PaymentMethodsPage from "./PaymentMethodsPage";
import WalletDashboard from "./WalletDashboard";
import UserTransactionsPage from "../transactions/UserTransactionsPage";
import UserPaymentPage from "../Payment/UserPaymentPage";
import SettingsPage from "./SettingsPage";
import { SettingsProvider, useSettings } from "../../context/SettingsContext";
import { selectUserName, selectUserEmail } from "../../stores/authSlice";
// import UserHomePage from "../../components/dashboard/UserHomePage";
 
function UserDashboardInner() {
  const [activeTab, setActiveTab] = useState("home");
  const { t, darkMode } = useSettings();
  const rawName = useSelector(selectUserName);
  const email = useSelector(selectUserEmail);
 
  // Derive display name: stored name → email prefix → fallback
  const userName = rawName
    || (email ? email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "")
    || localStorage.getItem("ps_name")
    || "User";
 
  const navItems = [
    { key: "home",         label: t.home,         icon: "🏠" },
    { key: "transactions", label: t.transactions,  icon: "💸" },
    { key: "payment",      label: t.payment,       icon: "📱" },
    { key: "wallet",       label: t.wallet,        icon: "👛" },
    { key: "cards",        label: t.cards,         icon: "💳" },
    { key: "settings",     label: t.settings,      icon: "⚙️" },
    { key: "logout",       label: t.logout,        icon: "🚪" },
  ];
 
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
 
  return (
    <DashboardShell
      onTabChange={(key) => setActiveTab(key)}
      navItems={navItems}
      onLogout={handleLogout}
      userName={userName}
      activeTab={activeTab}
    >
      {activeTab === "home"       && <UserHomePage darkMode={darkMode} userName={userName} />}
      {activeTab === "cards"        && <PaymentMethodsPage />}
      {activeTab === "transactions" && <UserTransactionsPage />}
      {activeTab === "payment"      && <UserPaymentPage />}
      {activeTab === "wallet"       && <WalletDashboard />}
      {activeTab === "settings"     && <SettingsPage onNavigate={setActiveTab} />}
    </DashboardShell>
  );
}
 
export default function UserDashboard() {
  return (
    <SettingsProvider>
      <UserDashboardInner />
    </SettingsProvider>
  );
}
 