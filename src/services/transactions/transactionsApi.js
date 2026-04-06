
 import api from "../../utils/api";
 
/* ----------------------------- ADMIN ALL TRANSACTIONS ------------------------------ */

/**
 * Get all transactions (Admin view)
 * @param {number} page - Page number (1-based)
 * @param {number} pageSize - Number of items per page
 * @returns {Promise} - { items: [], total: number, pageSize: number }
 */
// export function getTransactionsSimple(page = 1, pageSize = 10) {
//   return api
//     .get("/Transactions", { params: { page, pageSize } })
//     .then((r) => ({
//       items: r.data?.items ?? r.data ?? [],
//       totalCount: r.data?.totalCount ?? r.data?.length ?? 0,
//     }));
// }


export function getTransactionsSimple(page = 1, pageSize = 10) {
  return api
    .get("/Transactions", { params: { page, pageSize } })
    .then((r) => ({
      items: r.data?.items ?? r.data ?? [],
      // ✅ Check for 'total' first, then 'totalCount'
      total: r.data?.total ?? r.data?.totalCount ?? r.data?.length ?? 0,
    }));
}
/**
 * Get all transactions with filters (Admin view for Ops Dashboard)
 * @param {Object} filters - Filter options
 * @param {number} filters.page - Page number
 * @param {number} filters.pageSize - Items per page
 * @param {string} filters.status - Filter by status (Completed, Failed, Pending, etc)
 * @param {string} filters.sortBy - Sort by field (date, amount)
 * @returns {Promise} - Transaction list with total count
 */
export function getAllTransactions(filters = {}) {
  const { page = 1, pageSize = 25, status = null, sortBy = "date" } = filters;
  
  const params = {
    page,
    pageSize,
    sortBy,
  };
  
  // Only add status filter if provided
  if (status) {
    params.status = status;
  }
  
  return api
    .get("/Transactions", { params })
    .then((r) => ({
      items: Array.isArray(r.data?.items) ? r.data.items : Array.isArray(r.data) ? r.data : [],
      total: r.data?.totalCount || r.data?.total || 0,
      pageSize: pageSize,
    }))
    .catch((err) => {
      console.error("[transactionsApi] Error fetching all transactions:", err);
      throw err;
    });
}

/* ----------------------------- HISTORY ------------------------------ */
 
export function getUserHistory(
  userId,
  { direction = "all", sortBy = "date", page = 1, pageSize = 20 } = {}
) {
  return api.get(`/users/${userId}/transactions`, {
      params: { direction, sortBy, page, pageSize },
    })
    .then((r) => r.data);
}
 
export function getMerchantHistory(
  merchantId,
  { direction = "all", sortBy = "date", page = 1, pageSize = 20 } = {}
) {
  return api.get(`/merchants/${merchantId}/transactions`, {
      params: { direction, sortBy, page, pageSize },
    })
    .then((r) => r.data);
}
 
/* ------------------------------ SINGLE READ ------------------------------ */
export function getTransactionById(id) {
  return api.get(`/Transactions/${id}`).then((r) => r.data);
}
 
/* ------------------------------ CREATE ------------------------------ */
 
export function createP2P({ toWalletID, amount, currency = "INR", transactionDate, phoneNumber }) {
  const body = {
    toWalletID: Number(toWalletID),
    amount: Number(amount),
    currency,
    transactionDate: transactionDate || new Date().toISOString(),
    phoneNumber: String(phoneNumber || "").trim(),
  };
  return api.post("/Transactions/p2p", body).then((r) => r.data);
}
 
export function createP2M({ toWalletID, amount, currency = "INR", transactionDate, phoneNumber }) {
  const body = {
    toWalletID: Number(toWalletID),
    amount: Number(amount),
    currency,
    transactionDate: transactionDate || new Date().toISOString(),
    phoneNumber: String(phoneNumber || "").trim(),
  };
  return api.post("/Transactions/p2m", body).then((r) => r.data);
}
 
// Refund execution (optionally by Approved requestId)
export function createRefund({
  originalTransactionID,
  amount,
  currency = "INR",
  transactionDate,
  phoneNumber,
  requestId,
}) {
  const body = {
    originalTransactionID: Number(originalTransactionID),
    amount: amount ? Number(amount) : undefined,
    currency,
    transactionDate: transactionDate || new Date().toISOString(),
    phoneNumber: String(phoneNumber || "").trim(),
    requestId: requestId || undefined,
  };
  return api.post("/Transactions/refunds", body).then((r) => r.data);
}
 