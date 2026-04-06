import { api } from "../http";

/**
 * Fetch all risk flags
 */
export async function getAllRiskFlags(filters = {}) {
  try {
    const response = await api.get("/api/risk/flags", { params: filters });
    return response.data;
  } catch (error) {
    console.error("[riskApi] Error fetching risk flags:", error);
    throw error;
  }
}

/**
 * Get a specific risk flag by ID
 */
export async function getRiskFlagById(flagId) {
  try {
    const response = await api.get(`/api/risk/flags/${flagId}`);
    return response.data;
  } catch (error) {
    console.error("[riskApi] Error fetching risk flag:", error);
    throw error;
  }
}

/**
 * Create a new risk flag
 */
export async function createRiskFlag(data) {
  try {
    const response = await api.post("/api/risk/flags", data);
    return response.data;
  } catch (error) {
    console.error("[riskApi] Error creating risk flag:", error);
    throw error;
  }
}

/**
 * Update an existing risk flag
 */
export async function updateRiskFlag(flagId, data) {
  try {
    const response = await api.put(`/api/risk/flags/${flagId}`, data);
    return response.data;
  } catch (error) {
    console.error("[riskApi] Error updating risk flag:", error);
    throw error;
  }
}

/**
 * Delete a risk flag
 */
export async function deleteRiskFlag(flagId) {
  try {
    const response = await api.delete(`/api/risk/flags/${flagId}`);
    return response.data;
  } catch (error) {
    console.error("[riskApi] Error deleting risk flag:", error);
    throw error;
  }
}
