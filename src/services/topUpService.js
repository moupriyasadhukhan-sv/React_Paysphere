import api from '../utils/api';

// Step 1: Backend creates Razorpay order → returns orderId
export const createRazorpayOrder = (userId, amount) =>
  api.post('/Wallets/create-order', { userId, amount, currency: 'INR' }).then(r => r.data);

// Step 2: After Razorpay popup success → verify with backend → backend credits wallet
// payload: { orderId, paymentId, signature, userId, amount }
export const verifyRazorpayPayment = (payload) =>
  api.post('/Wallets/verify-payment', payload).then(r => r.data);
