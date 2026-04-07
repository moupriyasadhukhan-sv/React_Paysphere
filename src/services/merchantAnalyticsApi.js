// // src/services/merchantApi.js
// import http from "../http";

// // We use fallback to 1 just in case the merchantId isn't found during testing
// export const getMerchantAnalytics = async (merchantId = 1) => {
//   return await http.get(`/api/Report/merchant/${merchantId}`);
// };

// export const getMerchantTransactions = async (merchantId = 1) => {
//   return await http.get(`/api/transactions/merchant/${merchantId}`);
// };

// export const getMerchantSettlements = async (merchantId = 1) => {
//   return await http.get(`/api/settlements/merchant/${merchantId}`);
// };

// src/services/merchantAnalyticsApi.js
// All API calls for the Merchant & Settlement & Analytics modules
import api from "../utils/api";

/* ─── ANALYTICS / REPORT ──────────────────────────────────────── */

/**
 * GET /api/Report/merchant/{merchantId}
 * Returns: { paymentMetrics, refundValue, totalSettledAmount, pendingSettlementAmount, ... }
 */
export async function getMerchantAnalytics(merchantId) {
  const res = await api.get(`/Report/merchant/${merchantId}`);
  return res.data ?? res;
}

/* ─── SETTLEMENTS ─────────────────────────────────────────────── */

/**
 * GET /api/Settlement/merchant/{merchantId}
 * Returns array of settlement objects
 */
export async function getMerchantSettlements(merchantId) {
  const res = await api.get(`/Settlement/merchant/${merchantId}`);
  // backend wraps in { data: [...] } or returns array directly
  return Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
}

/**
 * PUT /api/Settlement/{settlementId}
 * Update settlement status
 */
export async function updateSettlementStatus(settlementId, status) {
  const res = await api.put(`/Settlement/${settlementId}`, { status });
  return res.data;
}

/**
 * DELETE /api/Settlement/{settlementId}
 */
export async function deleteSettlement(settlementId) {
  const res = await api.delete(`/Settlement/${settlementId}`);
  return res.data;
}

/* ─── TRANSACTIONS (merchant view) ──────────────────────────────── */

/**
 * GET /api/merchants/{merchantId}/transactions
 */
export async function getMerchantTransactions(merchantId, { page = 1, pageSize = 10 } = {}) {
  const res = await api.get(`/merchants/${merchantId}/transactions`, {
    params: { page, pageSize },
  });
  return {
    items: res.data?.items ?? res.data ?? [],
    totalCount: res.data?.totalCount ?? 0,
  };
}

/* ─── REFUND REQUESTS (merchant view) ───────────────────────────── */
// Already handled by refundRequestsApi.js, re-exported here for convenience
export { listMerchantRefundRequests, approveRefundRequest, rejectRefundRequest } from "./refunds/refundRequestsApi";
