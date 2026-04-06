import api from '../utils/api';

function getLoggedInUserId() {
  const userId = localStorage.getItem('ps_userId');
  if (!userId) {
    console.warn('No userId found in localStorage');
    return null;
  }
  return userId;
}

export const walletService = {
  checkSetup: () => {
    const userId = getLoggedInUserId();
    console.log('=== Wallet Service Diagnostic ===');
    console.log('UserId:', userId);
    console.log('================================');
    return { userId };
  },

  // Fetch user's wallet balance
  getWalletBalance: async () => {
    try {
      const userId = getLoggedInUserId();
      if (!userId) {
        throw new Error('User ID not found in token');
      }
      
      console.log('Fetching wallet for userId:', userId);
      // Correct endpoint: GET /api/Wallets?userId={userId}
      const response = await api.get(`/Wallets?userId=${userId}`);
      console.log('✓ Wallet balance response:', response.data);
      
      // Handle array response from query endpoint
      const walletData = Array.isArray(response.data) ? response.data[0] : response.data;
      return walletData;
    } catch (error) {
      console.error('Wallet fetch error:', error.response?.data || error.message);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  },

  // Top up wallet with payment instrument
  topup: async (instrumentId, amount) => {
    try {
      const response = await api.post('/Wallets/topup', {
        instrumentId,
        amount
      });
      return response.data;
    } catch (error) {
      // Re-throw to let the component handle different status codes
      throw error;
    }
  }
};
