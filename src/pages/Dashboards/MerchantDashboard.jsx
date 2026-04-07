import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";

import DashboardShell from "../../components/dashboard/DashboardShell";
import { SettingsProvider } from "../../context/SettingsContext";
import useLogout from "../../hooks/useLogout";
import { getAuthToken } from "../../services/http";
import { initializeSignalR, stopSignalR } from "../../services/signalRService";

import ImprovedMerchantDashboard from "./ImprovedMerchantDashboard";
import MerchantSettlementsPage from "./merchant/MerchantSettlementsPage";
import MerchantRefundsPage from "../Payment/MerchantRefundPage";
import MerchantWalletPage from "./MerchantWalletDashboard";
import MerchantTransactionsPage from "../transactions/MerchantTransactionsPage";
import SettingsPage from "./SettingsPage";

// New motion-based pages
let MerchantSettlementsNew = null;

try {
  MerchantSettlementsNew = require("../settlements/MerchantSettlementsNew").default;
} catch (e) {
  console.log("MerchantSettlementsNew not available");
}

/* ────────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────────── */
function getInfoFromToken() {
  try {
    const token = getAuthToken() || localStorage.getItem("ps_token");
    if (!token) return { name: "Merchant", merchantId: 1 };
    const decoded = jwtDecode(token);
    const email = decoded.email || decoded.sub || "";
    const namePart = email.split("@")[0];
    const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const merchantId =
      decoded.merchantId ||
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
      decoded.sub ||
      1;
    return { name, merchantId: Number(merchantId) || 1 };
  } catch {
    return { name: "Merchant", merchantId: 1 };
  }
}

/* ────────────────────────────────────────────────────────────────
   ICONS (SVG)
──────────────────────────────────────────────────────────────── */
const Icon = ({ d, size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d={d} />
  </svg>
);
const HomeIcon     = () => <Icon d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />;
const WalletIcon   = () => <Icon d="M21 6h-2V4c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l2 3V8c0-1.1-.9-2-2-2zm-2 0H5V4h14v2zm0 6h-2v-2h2v2z" />;
const SettleIcon   = () => <Icon d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2V17zm4 0h-2V7h2V17zm4 0h-2v-4h2V17z" />;
const TransactionIcon = () => <Icon d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 9.5c0 .83-.67 1.5-1.5 1.5S11 13.33 11 12.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm3-4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-10 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />;
const RefundIcon   = () => <Icon d="M7 8c-1.1 0-1.99.9-1.99 2C5 11.1 7 13 7 13s2-1.9 2-3c0-1.1-.9-2-2-2zm0 2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm8.1-5.1L9.9 2.9c-.36-.36-.86-.59-1.41-.59-1.1 0-2 .9-2 2v3.26C5.33 7.02 4 8.57 4 10.5 4 14.08 7.13 17 11 17c3.87 0 7-2.92 7-6.5 0-2.93-1.33-4.48-3.49-5.1V4.3c0-1.1-.9-2-2-2-.55 0-1.05.23-1.41.59z" />;
const SettingsIcon = () => <Icon d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.62l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.48.1.62l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.62l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.48-.12-.62l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />;
const LogoutIcon   = () => <Icon d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />;

/* ────────────────────────────────────────────────────────────────
   MAIN COMPONENT
──────────────────────────────────────────────────────────────── */
function MerchantDashboardInner() {
  const logout = useLogout("/login");
  
  const { name: userName, merchantId } = getInfoFromToken();
  const [activeKey, setActiveKey] = useState("home"); 
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeSignalR(merchantId);
    return () => stopSignalR();
  }, [merchantId]);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [isInitialized, userName]);

  const handleTabChange = (key) => {
    if (key === "logout") {
      logout();
    } else {
      setActiveKey(key);
    }
  };

  return (
    <DashboardShell
        variant="merchant"
        navItems={[
          { key: "home",         label: "Home",         icon: <HomeIcon /> },
          { key: "wallet",       label: "Wallet",       icon: <WalletIcon /> },
          { key: "settlements",  label: "Settlements",  icon: <SettleIcon /> },
          { key: "transactions", label: "Transactions", icon: <TransactionIcon /> },
          { key: "refund",       label: "Refunds",      icon: <RefundIcon /> },
          { key: "settings",     label: "Settings",     icon: <SettingsIcon /> },
          { key: "logout",       label: "Logout",       icon: <LogoutIcon /> },
        ]}
        activeTab={activeKey}
        onTabChange={handleTabChange}
        onLogout={logout} 
        userName={userName}
        userRole="Merchant"
      >
      <div className="w-full h-full p-4">
        {activeKey === "home" && (
          <ImprovedMerchantDashboard merchantId={merchantId} userName={userName} />
        )}
        {activeKey === "wallet" && (
          <MerchantWalletPage merchantId={merchantId} />
        )}
        {activeKey === "settlements" && (
          <MerchantSettlementsPage merchantId={merchantId} />
        )}
        {activeKey === "transactions" && (
          <MerchantTransactionsPage merchantId={merchantId} />
        )}
        {activeKey === "refund" && <MerchantRefundsPage />}
        {activeKey === "settings" && <SettingsPage />}
      </div>
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