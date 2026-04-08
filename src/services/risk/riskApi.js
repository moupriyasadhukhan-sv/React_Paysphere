import { api } from "../http";
import { store } from "../../stores/store";

/**
 * Fetch all risk flags
 */
export async function getAllRiskFlags(filters = {}) {
  try {
    console.log("[riskApi] Fetching risk flags...");
    const response = await api.get("/api/risk/flags", { params: filters });
    console.log("[riskApi] Risk flags fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("[riskApi] Error fetching risk flags:");
    console.error("[riskApi] Status:", error.response?.status);
    console.error("[riskApi] Data:", error.response?.data);
    console.error("[riskApi] Message:", error.message);
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

/**
 * Log a risk event when suspicious activity is detected
 * Maps to CreateRiskFlagDto structure from backend
 * CreateRiskFlagDto requires: TransactionID, RiskType, Severity, Status
 * POST /api/risk/flags
 */
export async function logRiskEvent(eventData) {
  try {
    console.log("\n======== [riskApi] RISK FLAG CREATION START ========");
    console.log("[riskApi] Input eventData:", JSON.stringify(eventData, null, 2));
    
    // Extract numeric transaction ID - check all possible properties
    let transactionID = eventData.transactionId || eventData.TransactionID;
    
    console.log("[riskApi] Extracted transactionID from eventData:", transactionID, "(type:", typeof transactionID, ")");
    
    // Convert to safe number
    if (typeof transactionID === 'string') {
      const digits = transactionID.replace(/[^\d]/g, '');
      transactionID = digits ? parseInt(digits, 10) : null;
      console.log("[riskApi] Converted STRING to NUMBER:", transactionID);
    } else if (typeof transactionID === 'number') {
      transactionID = parseInt(transactionID, 10);
      console.log("[riskApi] Already a NUMBER:", transactionID);
    } else {
      console.error("[riskApi] ❌ transactionID is INVALID type:", typeof transactionID, "value:", transactionID);
      transactionID = null;
    }

    // Validate
    if (!transactionID || transactionID <= 0) {
      console.error("[riskApi] ❌ INVALID transactionID:", transactionID);
      throw new Error("Invalid transaction ID - cannot create risk flag");
    }

    console.log("[riskApi] ✅ FINAL transactionID:", transactionID);

    // Build payload - MUST match backend DTO exactly
    const riskType = (eventData.transactionType || "UNKNOWN").toUpperCase();
    const severity = (eventData.severity || "LOW").toUpperCase();
    
    const payload = {
      TransactionID: transactionID,
      RiskType: riskType,
      Severity: severity,
      Status: "Open"
    };

    console.log("[riskApi] 🔵 PAYLOAD BEFORE POST:");
    console.log("[riskApi]   TransactionID:", payload.TransactionID, "(type:", typeof payload.TransactionID, ")");
    console.log("[riskApi]   RiskType:", payload.RiskType);
    console.log("[riskApi]   Severity:", payload.Severity);
    console.log("[riskApi]   Status:", payload.Status);
    console.log("[riskApi] Full payload JSON:", JSON.stringify(payload));

    console.log("[riskApi] 🟢 Making POST to /api/risk/flags...");
    const response = await api.post("/api/risk/flags", payload);
    
    console.log("[riskApi] ✅ POST SUCCESSFUL!");
    console.log("[riskApi] Response:", response.data);
    console.log("======== [riskApi] RISK FLAG CREATION END ========\n");
    
    return response.data;
  } catch (error) {
    console.error("\n======== [riskApi] RISK FLAG CREATION ERROR ========");
    console.error("[riskApi] ❌ Error creating risk flag");
    console.error("[riskApi] HTTP Status:", error.response?.status);
    console.error("[riskApi] Error Response:", error.response?.data);
    console.error("[riskApi] Error Message:", error.message);
    console.error("======== [riskApi] ERROR END ========\n");
    throw error;
  }
}

/**
 * Check if a refund has already been processed for a transaction
 */
export async function checkRefundStatus(transactionId) {
  try {
    const response = await api.get(`/api/RefundRequests/CheckStatus/${transactionId}`);
    console.log("[riskApi] Refund status:", response.data);
    return response.data;
  } catch (error) {
    // If 404, the refund doesn't exist (which is good)
    if (error.response?.status === 404) {
      return { exists: false, completed: false };
    }
    console.error("[riskApi] Error checking refund status:", error.response?.data || error.message);
    throw error;
  }
}
