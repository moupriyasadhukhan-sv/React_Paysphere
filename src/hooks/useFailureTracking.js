import { useState, useCallback, useEffect } from "react";

/**
 * Hook to track consecutive failed transaction attempts
 * LOCKS the FIRST transaction ID for the entire failure sequence
 * Severity increases: LOW (3 failures), MEDIUM (4), HIGH (5+)
 * Resets on successful transaction
 */
export function useFailureTracking() {
  const [failureCount, setFailureCount] = useState(0);
  const [showRiskAlert, setShowRiskAlert] = useState(false);
  const [firstTransactionId, setFirstTransactionId] = useState(null);  // LOCK: Only the FIRST failed ID
  
  const FAILURE_THRESHOLD = 3;
  const STORAGE_KEY = "ps_tx_failures";

  // Calculate severity based on failure count
  const getSeverity = (count) => {
    if (count >= 5) return "CRITICAL";
    if (count >= 4) return "MEDIUM";
    if (count >= 3) return "HIGH";
    return "LOW";
  };

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const now = Date.now();
        // Reset if more than 24 hours have passed
        if (now - data.timestamp > 24 * 60 * 60 * 1000) {
          localStorage.removeItem(STORAGE_KEY);
          setFailureCount(0);
          setFirstTransactionId(null);
        } else {
          setFailureCount(data.count || 0);
          setFirstTransactionId(data.firstTransactionId || null);  // Restore FIRST ID
        }
      } catch (e) {
        console.error("[useFailureTracking] Error reading localStorage:", e);
        setFailureCount(0);
        setFirstTransactionId(null);
      }
    }
  }, []);

  // Increment failure count - LOCK the first transaction ID
  const recordFailure = useCallback((currentTransactionId) => {
    setFailureCount(prev => {
      const newCount = prev + 1;
      
      // ✅ LOCK the first ID: Only set it if it's currently null
      setFirstTransactionId(prevId => {
        if (!prevId && currentTransactionId) {
          console.log("[useFailureTracking] 🔒 Storing FIRST failure ID (locked):", currentTransactionId);
          return currentTransactionId;
        }
        return prevId;
      });

      const severity = getSeverity(newCount);
      console.log(`[useFailureTracking] Failure #${newCount} | Current TxID: ${currentTransactionId} | Severity: ${severity}`);

      // Save to localStorage with FIRST transaction ID
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          count: newCount,
          firstTransactionId: firstTransactionId || currentTransactionId,
          severity: severity,
          timestamp: Date.now(),
        })
      );

      // Show risk alert if threshold reached
      if (newCount >= FAILURE_THRESHOLD) {
        setShowRiskAlert(true);
        console.warn("[useFailureTracking] ⚠️ Risk threshold reached! Failures:", newCount);
      }

      return newCount;
    });
  }, [firstTransactionId]);

  // Reset failure count and transaction ID on successful transaction
  const recordSuccess = useCallback(() => {
    console.log("[useFailureTracking] ✅ Success! Resetting failure sequence");
    setFailureCount(0);
    setFirstTransactionId(null);  // Reset for next sequence
    setShowRiskAlert(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Manually close risk alert
  const closeRiskAlert = useCallback(() => {
    setShowRiskAlert(false);
  }, []);

  const severity = getSeverity(failureCount);

  return {
    failureCount,
    showRiskAlert,
    recordFailure,
    recordSuccess,
    closeRiskAlert,
    transactionId: firstTransactionId,  // FIRST failed transaction ID (locked)
    severity,
    isRiskThresholdReached: failureCount >= FAILURE_THRESHOLD,
  };
}
