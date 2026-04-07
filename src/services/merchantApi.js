import api from "../utils/api";

/**
 * GET /api/Dashboard/merchant/analytics/{merchantId}
 * Returns comprehensive merchant analytics data
 * Response includes: summary metrics, revenue trends, settlements, transactions, payment methods
 */
export const getMerchantAnalytics = async (merchantId = 1) => {
  try {
    const res = await api.get(`Dashboard/merchant/analytics/${merchantId}`);
    return res;
  } catch (error) {
    console.error("Failed to fetch merchant analytics:", error);
    throw error;
  }
};

/**
 * GET /merchants/{merchantId}/transactions
 * Get merchant transaction history
 * Query: { direction, sortBy, page, pageSize }
 */
export const getMerchantTransactions = async (merchantId = 1, queryParams = {}) => {
  try {
    const params = new URLSearchParams({
      direction: queryParams.direction || "all",
      sortBy: queryParams.sortBy || "date",
      page: queryParams.page || 1,
      pageSize: queryParams.pageSize || 100,
    });
    const res = await api.get(`/merchants/${merchantId}/transactions?${params.toString()}`);
    return res.data || res;
  } catch (error) {
    console.error("Failed to fetch merchant transactions:", error);
    throw error;
  }
};

/**
 * GET /api/settlements/merchant/{merchantId}
 * Returns merchant settlements
 */
export const getMerchantSettlements = async (merchantId = 1) => {
  try {
    const res = await api.get(`/settlements/merchant/${merchantId}`);
    return res;
  } catch (error) {
    console.error("Failed to fetch merchant settlements:", error);
    throw error;
  }
};

/**
 * GET /api/Settlement/merchant/{merchantId}
 * Alternative endpoint for settlements
 */
export const getSettlementsByMerchant = async (merchantId = 1) => {
  try {
    const res = await api.get(`/Settlement/merchant/${merchantId}`);
    return res;
  } catch (error) {
    console.error("Failed to fetch settlements:", error);
    throw error;
  }
};

/**
 * GET /api/Merchant/{merchantId}
 * Returns merchant details
 */
export const getMerchantById = async (merchantId) => {
  try {
    const res = await api.get(`/Merchant/${merchantId}`);
    return res;
  } catch (error) {
    console.error("Failed to fetch merchant details:", error);
    throw error;
  }
};

/**
 * GET /api/Dashboard/merchant
 * Returns merchant dashboard data
 */
export const getMerchantDashboard = async () => {
  try {
    const res = await api.get(`/Dashboard/merchant`);
    return res;
  } catch (error) {
    console.error("Failed to fetch merchant dashboard:", error);
    throw error;
  }
};

export default {
  getMerchantAnalytics,
  getMerchantTransactions,
  getMerchantSettlements,
  getSettlementsByMerchant,
  getMerchantById,
  getMerchantDashboard,
};
