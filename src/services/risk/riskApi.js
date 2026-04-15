// import { api } from "../http";
// import { store } from "../../stores/store";

// /**
//  * Fetch all risk flags
//  */
// export async function getAllRiskFlags(filters = {}) {
//   try {
//     console.log("[riskApi] Fetching risk flags...");
//     const response = await api.get("/api/risk/flags", { params: filters });
//     console.log("[riskApi] Risk flags fetched successfully:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("[riskApi] Error fetching risk flags:");
//     console.error("[riskApi] Status:", error.response?.status);
//     console.error("[riskApi] Data:", error.response?.data);
//     console.error("[riskApi] Message:", error.message);
//     throw error;
//   }
// }

// /**
//  * Get a specific risk flag by ID
//  */
// export async function getRiskFlagById(flagId) {
//   try {
//     const response = await api.get(`/api/risk/flags/${flagId}`);
//     return response.data;
//   } catch (error) {
//     console.error("[riskApi] Error fetching risk flag:", error);
//     throw error;
//   }
// }

// /**
//  * Create a new risk flag
//  */
// export async function createRiskFlag(data) {
//   try {
//     const response = await api.post("/api/risk/flags", data);
//     return response.data;
//   } catch (error) {
//     console.error("[riskApi] Error creating risk flag:", error);
//     throw error;
//   }
// }

// /**
//  * Update an existing risk flag
//  */
// export async function updateRiskFlag(flagId, data) {
//   try {
//     const response = await api.put(`/api/risk/flags/${flagId}`, data);
//     return response.data;
//   } catch (error) {
//     console.error("[riskApi] Error updating risk flag:", error);
//     throw error;
//   }
// }

// /**
//  * Delete a risk flag
//  */
// export async function deleteRiskFlag(flagId) {
//   try {
//     const response = await api.delete(`/api/risk/flags/${flagId}`);
//     return response.data;
//   } catch (error) {
//     console.error("[riskApi] Error deleting risk flag:", error);
//     throw error;
//   }
// }

// /**
//  * Log a risk event when suspicious activity is detected
//  * Maps to CreateRiskFlagDto structure from backend
//  * CreateRiskFlagDto requires: TransactionID, RiskType, Severity, Status
//  * POST /api/risk/flags
//  */
// export async function logRiskEvent(eventData) {
//   try {
//     console.log("\n======== [riskApi] RISK FLAG CREATION START ========");
//     console.log("[riskApi] Input eventData:", JSON.stringify(eventData, null, 2));
    
//     // Extract numeric transaction ID - check all possible properties
//     let transactionID = eventData.transactionId || eventData.TransactionID;
    
//     console.log("[riskApi] Extracted transactionID from eventData:", transactionID, "(type:", typeof transactionID, ")");
    
//     // Convert to safe number
//     if (typeof transactionID === 'string') {
//       const digits = transactionID.replace(/[^\d]/g, '');
//       transactionID = digits ? parseInt(digits, 10) : null;
//       console.log("[riskApi] Converted STRING to NUMBER:", transactionID);
//     } else if (typeof transactionID === 'number') {
//       transactionID = parseInt(transactionID, 10);
//       console.log("[riskApi] Already a NUMBER:", transactionID);
//     } else {
//       console.error("[riskApi] ❌ transactionID is INVALID type:", typeof transactionID, "value:", transactionID);
//       transactionID = null;
//     }

//     // Validate
//     if (!transactionID || transactionID <= 0) {
//       console.error("[riskApi] ❌ INVALID transactionID:", transactionID);
//       throw new Error("Invalid transaction ID - cannot create risk flag");
//     }

//     console.log("[riskApi] ✅ FINAL transactionID:", transactionID);

//     // Build payload - MUST match backend DTO exactly
//     const riskType = (eventData.transactionType || "UNKNOWN").toUpperCase();
//     const severity = (eventData.severity || "LOW").toUpperCase();
    
//     const payload = {
//       TransactionID: transactionID,
//       RiskType: riskType,
//       Severity: severity,
//       Status: "Open"
//     };

//     console.log("[riskApi] 🔵 PAYLOAD BEFORE POST:");
//     console.log("[riskApi]   TransactionID:", payload.TransactionID, "(type:", typeof payload.TransactionID, ")");
//     console.log("[riskApi]   RiskType:", payload.RiskType);
//     console.log("[riskApi]   Severity:", payload.Severity);
//     console.log("[riskApi]   Status:", payload.Status);
//     console.log("[riskApi] Full payload JSON:", JSON.stringify(payload));

//     console.log("[riskApi] 🟢 Making POST to /api/risk/flags...");
//     const response = await api.post("/api/risk/flags", payload);
    
//     console.log("[riskApi] ✅ POST SUCCESSFUL!");
//     console.log("[riskApi] Response:", response.data);
//     console.log("======== [riskApi] RISK FLAG CREATION END ========\n");
    
//     return response.data;
//   } catch (error) {
//     console.error("\n======== [riskApi] RISK FLAG CREATION ERROR ========");
//     console.error("[riskApi] ❌ Error creating risk flag");
//     console.error("[riskApi] HTTP Status:", error.response?.status);
//     console.error("[riskApi] Error Response:", error.response?.data);
//     console.error("[riskApi] Error Message:", error.message);
//     console.error("======== [riskApi] ERROR END ========\n");
//     throw error;
//   }
// }

// /**
//  * Check if a refund has already been processed for a transaction
//  */
// export async function checkRefundStatus(transactionId) {
//   try {
//     const response = await api.get(`/api/RefundRequests/CheckStatus/${transactionId}`);
//     console.log("[riskApi] Refund status:", response.data);
//     return response.data;
//   } catch (error) {
//     // If 404, the refund doesn't exist (which is good)
//     if (error.response?.status === 404) {
//       return { exists: false, completed: false };
//     }
//     console.error("[riskApi] Error checking refund status:", error.response?.data || error.message);
//     throw error;
//   }
// }



import { api } from "../http";
import { store } from "../../stores/store";

/**
 * Fetch all risk flags
 * Updated to support new ML-based fraud detection fields
 */
export async function getAllRiskFlags(filters = {}) {
  try {
    console.log("[riskApi] Fetching risk flags with filters:", filters);
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
 * Get risk flags by transaction ID
 */
export async function getRiskFlagsByTransactionId(transactionId) {
  try {
    const response = await api.get(`/api/risk/flags/transaction/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error("[riskApi] Error fetching risk flags by transaction:", error);
    // Return empty array if no risk flags found (404 is expected for transactions without flags)
    if (error.response?.status === 404) {
      return [];
    }
    throw error;
  }
}

/**
 * Create a new risk flag
 * Updated to support ML-based fraud detection fields
 */
export async function createRiskFlag(data) {
  try {
    console.log("[riskApi] Creating risk flag with data:", JSON.stringify(data, null, 2));
    const response = await api.post("/api/risk/flags", data);
    console.log("[riskApi] Risk flag created successfully:", response.data);
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
    // Updated to support ML-based fraud detection fields
    const riskType = (eventData.transactionType || "UNKNOWN").toUpperCase();
    const severity = (eventData.severity || "LOW").toUpperCase();
    
    const payload = {
      TransactionID: transactionID,
      RiskType: riskType,
      Severity: severity,
      Status: "Open"
    };

    // Add optional ML-based fields if provided
    if (eventData.riskScore !== undefined && eventData.riskScore !== null) {
      payload.RiskScore = parseFloat(eventData.riskScore);
    }
    if (eventData.triggerFeatures) {
      payload.TriggerFeatures = typeof eventData.triggerFeatures === 'string' 
        ? eventData.triggerFeatures 
        : JSON.stringify(eventData.triggerFeatures);
    }

    console.log("[riskApi] 🔵 PAYLOAD BEFORE POST:");
    console.log("[riskApi]   TransactionID:", payload.TransactionID, "(type:", typeof payload.TransactionID, ")");
    console.log("[riskApi]   RiskType:", payload.RiskType);
    console.log("[riskApi]   Severity:", payload.Severity);
    console.log("[riskApi]   Status:", payload.Status);
    console.log("[riskApi]   RiskScore:", payload.RiskScore);
    console.log("[riskApi]   TriggerFeatures:", payload.TriggerFeatures);
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

/**
 * Mock data for testing ML fraud detection features
 * Remove this when backend ML service is deployed
 */
function getMockRiskFlags(filters = {}) {
  const mockFlags = [
    {
      flagID: 42,
      transactionID: "TXN-2024-001",
      userId: "user-123",
      merchantId: "merchant-456",
      amount: 150.00,
      currency: "USD",
      status: "Open",
      severity: "HIGH",
      riskType: "INSUFFICIENT_FUNDS",
      riskScore: 0.75, // 75%
      triggerFeatures: JSON.stringify({
        TransactionCount_24H: 15,
        FailureRatio_30D: 0.23,
        AmountDeviationRatio: 2.1,
        CurrentAmount: 150.00,
        AnalyzedAt: "2024-04-10T10:30:00Z"
      }),
      transactionDate: "2024-04-10T09:15:00Z",
      createdAt: "2024-04-10T09:15:00Z"
    },
    {
      flagID: 41,
      transactionID: "TXN-2024-002",
      userId: "user-789",
      merchantId: "merchant-101",
      amount: 25.50,
      currency: "USD",
      status: "Open",
      severity: "MEDIUM",
      riskType: "INSUFFICIENT_FUNDS",
      riskScore: 0.45, // 45%
      triggerFeatures: JSON.stringify({
        TransactionCount_24H: 3,
        FailureRatio_30D: 0.05,
        AmountDeviationRatio: 1.8,
        CurrentAmount: 25.50,
        AnalyzedAt: "2024-04-09T14:20:00Z"
      }),
      transactionDate: "2024-04-09T12:00:00Z",
      createdAt: "2024-04-09T12:00:00Z"
    },
    {
      flagID: 40,
      transactionID: "TXN-2024-003",
      userId: "user-456",
      merchantId: "merchant-202",
      amount: 500.00,
      currency: "USD",
      status: "Resolved",
      severity: "MEDIUM",
      riskType: "INSUFFICIENT_FUNDS",
      riskScore: 0.42, // 42%
      triggerFeatures: JSON.stringify({
        TransactionCount_24H: 8,
        FailureRatio_30D: 0.45,
        AmountDeviationRatio: 3.2,
        CurrentAmount: 500.00,
        AnalyzedAt: "2024-04-10T08:45:00Z"
      }),
      transactionDate: "2024-04-08T08:00:00Z",
      createdAt: "2024-04-10T08:45:00Z"
    }
  ];

  // Apply filters
  let filteredFlags = mockFlags;

  if (filters.status && filters.status !== "all") {
    filteredFlags = filteredFlags.filter(flag =>
      flag.status.toLowerCase() === filters.status.toLowerCase()
    );
  }

  if (filters.severity && filters.severity !== "all") {
    filteredFlags = filteredFlags.filter(flag =>
      flag.severity.toUpperCase() === filters.severity.toUpperCase()
    );
  }

  if (filters.riskScore_min !== undefined || filters.riskScore_max !== undefined) {
    filteredFlags = filteredFlags.filter(flag => {
      const score = flag.riskScore;
      if (filters.riskScore_min !== undefined && score < filters.riskScore_min) return false;
      if (filters.riskScore_max !== undefined && score > filters.riskScore_max) return false;
      return true;
    });
  }

  console.log("[riskApi] Returning mock data:", filteredFlags.length, "flags");
  return filteredFlags;
}
