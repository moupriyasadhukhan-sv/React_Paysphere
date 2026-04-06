import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: { items: [], unread: 0 },
  reducers: {
    addNotification(state, { payload }) {
      state.items.unshift({ id: Date.now(), read: false, timestamp: new Date().toISOString(), ...payload });
      state.unread += 1;
    },
    markAllRead(state) {
      state.items.forEach((n) => (n.read = true));
      state.unread = 0;
    },
    clearNotifications(state) {
      state.items = [];
      state.unread = 0;
    },
  },
});

export const { addNotification, markAllRead, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
