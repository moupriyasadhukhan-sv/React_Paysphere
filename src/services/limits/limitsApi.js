import { api } from "../http";

/**
 * Fetch all transaction limits for a user
 * @param {number|null} userId - Optional user ID. If not provided, fetches current user's limits
 * @returns {Promise<Array>} Array of transaction limit objects
 */
export async function getTransactionLimits(userId = null) {
  try {
    console.log("[limitsApi] Fetching transaction limits", userId ? `for user ${userId}` : "for current user");
    
    const params = userId ? { userId } : {};
    const response = await api.get("/api/limits", { params });
    
    console.log("[limitsApi] Transaction limits fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("[limitsApi] Error fetching transaction limits:");
    console.error("[limitsApi] Status:", error.response?.status);
    console.error("[limitsApi] Data:", error.response?.data);
    console.error("[limitsApi] Message:", error.message);
    throw error;
  }
}

/**
 * Fetch a single transaction limit by ID
 * @param {number} limitId - The limit ID to fetch
 * @returns {Promise<Object>} Transaction limit object
 */
export async function getTransactionLimitById(limitId) {
  try {
    console.log("[limitsApi] Fetching transaction limit:", limitId);
    
    const response = await api.get(`/api/limits/${limitId}`);
    
    console.log("[limitsApi] Transaction limit fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("[limitsApi] Error fetching transaction limit:", limitId);
    console.error("[limitsApi] Status:", error.response?.status);
    console.error("[limitsApi] Data:", error.response?.data);
    console.error("[limitsApi] Message:", error.message);
    throw error;
  }
}
