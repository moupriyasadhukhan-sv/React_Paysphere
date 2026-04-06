import { useEffect, useState } from "react";
import {
  verifyUserWallet,
  verifyMerchantWallet,
  getUserWallets,
  getMerchantWallets,
} from "../services/wallets/walletsApi";

/**
 * Resolves a primary wallet for the logged-in principal (User or Merchant).
 * 1) Try verify endpoints; if not exists -> list -> choose Active INR -> else first.
 */
export default function usePrimaryWalletId({ role, userId, merchantId }) {
  const [walletId, setWalletId] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => {
    async function load() {
      if (!role) return;
      setLoading(true); setError("");
      try {
        let wId = null;

        if (role === "User" && userId) {
          const v = await verifyUserWallet(userId);
          if (v?.exists && (v.walletID ?? v.WalletID)) {
            wId = v.walletID ?? v.WalletID;
          } else {
            const list = await getUserWallets(userId);
            const pick = (list || []).find(w => (w.Currency || w.currency) === "INR" && (w.Status || w.status) === "Active") || (list || [])[0];
            if (pick?.WalletID || pick?.walletID) wId = pick.WalletID ?? pick.walletID;
          }
        } else if (role === "Merchant" && merchantId) {
          const v = await verifyMerchantWallet(merchantId);
          if (v?.exists && (v.walletID ?? v.WalletID)) {
            wId = v.walletID ?? v.WalletID;
          } else {
            const list = await getMerchantWallets(merchantId);
            const pick = (list || []).find(w => (w.Currency || w.currency) === "INR" && (w.Status || w.status) === "Active") || (list || [])[0];
            if (pick?.WalletID || pick?.walletID) wId = pick.WalletID ?? pick.walletID;
          }
        }

        setWalletId(wId);
      } catch (e) {
        setError(e?.response?.data?.detail || e?.message || "Failed to resolve wallet");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [role, userId, merchantId]);

  return { walletId, loading, error };
}