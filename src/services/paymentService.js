import api from '../utils/api';

function getLoggedInUserId() {
  return localStorage.getItem('ps_userId') || null;
}

export const paymentService = {
  getInstruments: async () => {
    const userId = getLoggedInUserId();
    if (userId) {
      const response = await api.get(`/PaymentInstruments/user/${userId}`);
      return response.data;
    }
    const response = await api.get('/PaymentInstruments');
    return response.data;
  },
  addInstrument: async (data) => {
    const response = await api.post('/PaymentInstruments', data);
    return response.data;
  },
  deleteInstrument: async (id) => {
    await api.delete(`/PaymentInstruments/${id}`);
  },
  setDefault: async (id) => {
    // This now matches the [HttpPut("{id}/set-default")] we created
    return await api.put(`/PaymentInstruments/${id}/set-default`); 
  },
  // Update instrument status (Lost, Blocked, Active, Inactive)
  updateInstrumentStatus: async (id, status) => {
    const currentResponse = await api.get(`/PaymentInstruments/${id}`);
    const c = currentResponse.data;
    const updateDto = {
      userID: c.userID,
      type: c.type,
      maskedIdentifier: c.maskedIdentifier || null,
      providerName: c.providerName || null,
      cardType: c.cardType || null,
      expiry: c.expiry || null,
      ifsc: c.ifsc || null,
      upiId: c.upiId || null,
      status,
    };
    const response = await api.put(`/PaymentInstruments/${id}`, updateDto);
    return response.data;
  },
  // Admin unlock flagged/locked instruments
  getFlaggedInstruments: async () => {
    // Fetch all instruments with status = "Lost", "Blocked", or "Inactive"
    const response = await api.get('/PaymentInstruments/flagged');
    return response.data;
  },
  unlockInstrument: async (id) => {
    const response = await api.post(`/PaymentInstruments/${id}/unlock`);
    return response.data;
  }
};