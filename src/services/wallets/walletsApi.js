import api from "../../utils/api";

export function verifyUserWallet(userId) {
  return api.get(`/Wallets/verify/user/${userId}`).then((r) => r.data);
}

export function verifyMerchantWallet(merchantId) {
  return api.get(`/Wallets/verify/merchant/${merchantId}`).then((r) => r.data);
}

export function getUserWallets(userId) {
  return api.get(`/Wallets`, { params: { userId } }).then((r) => {
    const d = r.data;
    return Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : [];
  });
}

export function getMerchantWallets(merchantId) {
  return api.get(`/Wallets`, { params: { merchantId } }).then((r) => {
    const d = r.data;
    return Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : [];
  });
}
