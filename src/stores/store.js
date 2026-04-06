import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import paymentInstrumentsReducer from "./paymentInstrumentsSlice";
import notificationsReducer from "./notificationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    paymentInstruments: paymentInstrumentsReducer,
    notifications: notificationsReducer,
  }
});