import { api } from "../http";

/**
 * Fetch user information by userId
 * @param {number} userId - The user ID to fetch
 * @returns {Promise<Object>} User object with name and other details
 */
export async function getUserById(userId) {
  try {
    console.log("[usersApi] Fetching user:", userId);
    const response = await api.get(`/api/users/${userId}`);
    console.log("[usersApi] User fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("[usersApi] Error fetching user:", userId);
    console.error("[usersApi] Status:", error.response?.status);
    console.error("[usersApi] Data:", error.response?.data);
    console.error("[usersApi] Message:", error.message);
    throw error;
  }
}

/**
 * Fetch all users
 * @param {Object} params - Query parameters (pagination, filters, etc.)
 * @returns {Promise<Array>} Array of user objects
 */
export async function getAllUsers(params = {}) {
  try {
    console.log("[usersApi] Fetching all users", params);
    const response = await api.get("/api/users", { params });
    console.log("[usersApi] Users fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("[usersApi] Error fetching users:");
    console.error("[usersApi] Status:", error.response?.status);
    console.error("[usersApi] Data:", error.response?.data);
    console.error("[usersApi] Message:", error.message);
    throw error;
  }
}
