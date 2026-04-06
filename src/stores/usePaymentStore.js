import { create } from 'zustand';
// import { paymentService } from '../services/paymentService';
import { paymentService } from '../services/paymentService';

export const usePaymentStore = create((set) => ({
  instruments: [],
  isLoading: false,

  fetchInstruments: async () => {
    set({ isLoading: true });
    try {
      const data = await paymentService.getInstruments();
      set({ instruments: data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error(error);
    }
  },

  addInstrument: (newInstrument) => 
    set((state) => ({ instruments: [...state.instruments, newInstrument] })),
}));