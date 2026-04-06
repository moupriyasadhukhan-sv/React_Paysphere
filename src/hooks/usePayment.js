import { useState, useEffect } from 'react';
import { paymentService } from '../services/paymentService';

export const usePaymentMethods = () => {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMethods = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getInstruments();
      setInstruments(data);
    } catch (err) {
      setError("Failed to load payment methods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  return { instruments, loading, error, refresh: fetchMethods };
};