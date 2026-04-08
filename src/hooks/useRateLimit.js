import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to implement rate limiting
 * @param {number} maxRequests - Max requests allowed per minute
 * @param {number} windowMs - Time window in milliseconds (default 60000 = 1 minute)
 * @returns {Object} - { canRequest, remaining, resetAt, timeLeft, tryRequest }
 */
export const useRateLimit = (maxRequests = 5, windowMs = 60000) => {
  const key = `rateLimit_${maxRequests}_${windowMs}`;
  
  const [requests, setRequests] = useState(() => {
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    const now = Date.now();
    // Filter out old requests outside the window
    return parsed.filter(time => now - time < windowMs);
  });

  const [timeLeft, setTimeLeft] = useState(0);

  // Calculate remaining time until oldest request expires
  useEffect(() => {
    if (requests.length === 0) {
      setTimeLeft(0);
      return;
    }

    const now = Date.now();
    const oldestRequest = requests[0];
    const timeUntilExpiry = Math.max(0, windowMs - (now - oldestRequest));

    setTimeLeft(Math.ceil(timeUntilExpiry / 1000)); // Convert to seconds

    if (timeUntilExpiry <= 0) {
      // Remove expired request
      const updated = requests.slice(1);
      setRequests(updated);
      localStorage.setItem(key, JSON.stringify(updated));
      return;
    }

    // Set timer to update timeLeft
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [requests, windowMs, key]);

  const canRequest = requests.length < maxRequests;
  const remaining = maxRequests - requests.length;

  const tryRequest = useCallback(() => {
    if (!canRequest) {
      return { success: false, message: `Rate limit exceeded. Try again in ${timeLeft}s` };
    }

    const now = Date.now();
    const updated = [...requests, now];
    setRequests(updated);
    localStorage.setItem(key, JSON.stringify(updated));

    return { success: true };
  }, [canRequest, requests, key, timeLeft]);

  return {
    canRequest,
    remaining,
    totalRequests: requests.length,
    timeLeft,
    tryRequest,
    maxRequests,
    resetAt: requests.length > 0 ? new Date(requests[0] + windowMs) : null,
  };
};
