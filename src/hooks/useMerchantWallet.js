import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchMerchantWalletDetails,
  closeMerchantWallet,
} from "../services/merchantWalletService";
 
export const useMerchantWallet = (merchantId) => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
 
  const fetchWallet = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await fetchMerchantWalletDetails(merchantId);
      setWallet(data);
    } catch (err) {
      console.error("Merchant wallet fetch failed:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };
 
  const closeWallet = async () => {
    try {
      await closeMerchantWallet(merchantId);
      toast.success("Wallet closed successfully");
      fetchWallet();
    } catch {
      toast.error("Unable to close wallet");
    }
  };
 
  useEffect(() => {
    if (merchantId) {
      fetchWallet();
    }
  }, [merchantId]);
 
  return { wallet, loading, error, closeWallet };
};
 