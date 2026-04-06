import api from "./http";
 
/**
 * Fetch merchant wallet details
 */
export const fetchMerchantWalletDetails = (merchantId) =>
  api
    .get(`/api/wallets/merchant/${merchantId}/verify`)
    .then(res => res.data);
 
/**
 * Close / change merchant wallet status
 */
export const closeMerchantWallet = (merchantId) =>
  api.patch(`/api/wallets/merchant/${merchantId}/status`, {
    newStatus: "Closed",
  });
 