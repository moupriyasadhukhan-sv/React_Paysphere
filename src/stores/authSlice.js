// import { createSlice } from "@reduxjs/toolkit";

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     // We use a helper to ensure numbers are numbers and nulls are nulls
//     role: localStorage.getItem("ps_role") || null,
//     userId: localStorage.getItem("ps_userId") ? Number(localStorage.getItem("ps_userId")) : null,
//     merchantId: localStorage.getItem("ps_merchantId") ? Number(localStorage.getItem("ps_merchantId")) : null,
//     name: localStorage.getItem("ps_name") || null,
//     email: localStorage.getItem("ps_email") || null,
//     walletId: null,
//     loggedIn: localStorage.getItem("ps_loggedIn") === "true",
//   },
//   reducers: {
//     setCredentials(state, action) {
//       // Destructure from payload with fallback to existing state if missing
//       const { role, userId, merchantId, name, email } = action.payload;
      
//       // Update Redux State
//       state.role = role ?? state.role;
//       state.userId = userId ?? state.userId;
//       state.merchantId = merchantId ?? state.merchantId;
//       state.name = name ?? state.name;
//       state.email = email ?? state.email;
//       state.loggedIn = true;

//       // Update LocalStorage
//       // Using '??' ensures we don't save the word "null" as a string
//       localStorage.setItem("ps_role", state.role || "");
//       localStorage.setItem("ps_userId", state.userId || "");
//       localStorage.setItem("ps_merchantId", state.merchantId || "");
//       localStorage.setItem("ps_name", state.name || "");
//       localStorage.setItem("ps_email", state.email || "");
//       localStorage.setItem("ps_loggedIn", "true");
//     },
//     setWalletId(state, action) {
//       state.walletId = action.payload;
//     },
//     logout(state) {
//       state.role = null;
//       state.userId = null;
//       state.merchantId = null;
//       state.walletId = null;
//       state.loggedIn = false;

//       // Cleanup storage
//       localStorage.removeItem("ps_role");
//       localStorage.removeItem("ps_userId");
//       localStorage.removeItem("ps_merchantId");
//       localStorage.removeItem("ps_name");
//       localStorage.removeItem("ps_email");
//       localStorage.removeItem("ps_loggedIn");
//     }
//   }
// });

// export const { setCredentials, setWalletId, logout } = authSlice.actions;
// export default authSlice.reducer;

// // Selectors
// export const selectUserId = (state) => state.auth.userId;
// export const selectMerchantId = (state) => state.auth.merchantId;
// export const selectUserRole = (state) => state.auth.role;
// export const selectIsLoggedIn = (state) => state.auth.loggedIn;
// export const selectUserName = (state) => state.auth.name;
// export const selectUserEmail = (state) => state.auth.email;







import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // We use a helper to ensure numbers are numbers and nulls are nulls
    role: localStorage.getItem("ps_role") || null,
    userId: localStorage.getItem("ps_userId") ? Number(localStorage.getItem("ps_userId")) : null,
    merchantId: localStorage.getItem("ps_merchantId") ? Number(localStorage.getItem("ps_merchantId")) : null,
    name: localStorage.getItem("ps_name") || null,
    email: localStorage.getItem("ps_email") || null,
    walletId: null,
    loggedIn: localStorage.getItem("ps_loggedIn") === "true",
  },
  reducers: {
    setCredentials(state, action) {
      // Destructure from payload with fallback to existing state if missing
      const { role, userId, merchantId, name, email } = action.payload;
      
      // Update Redux State
      state.role = role ?? state.role;
      state.userId = userId ?? state.userId;
      state.merchantId = merchantId ?? state.merchantId;
      state.name = name ?? state.name;
      state.email = email ?? state.email;
      state.loggedIn = true;

      // Update LocalStorage
      // Using '??' ensures we don't save the word "null" as a string
      localStorage.setItem("ps_role", state.role || "");
      localStorage.setItem("ps_userId", state.userId || "");
      localStorage.setItem("ps_merchantId", state.merchantId || "");
      localStorage.setItem("ps_name", state.name || "");
      localStorage.setItem("ps_email", state.email || "");
      localStorage.setItem("ps_loggedIn", "true");
    },
    setWalletId(state, action) {
      state.walletId = action.payload;
    },
    logout(state) {
      state.role = null;
      state.userId = null;
      state.merchantId = null;
      state.walletId = null;
      state.loggedIn = false;

      // Cleanup storage
      localStorage.removeItem("ps_role");
      localStorage.removeItem("ps_userId");
      localStorage.removeItem("ps_merchantId");
      localStorage.removeItem("ps_name");
      localStorage.removeItem("ps_email");
      localStorage.removeItem("ps_loggedIn");
    }
  }
});

export const { setCredentials, setWalletId, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectUserId = (state) => state.auth.userId;
export const selectMerchantId = (state) => state.auth.merchantId;
export const selectUserRole = (state) => state.auth.role;
export const selectIsLoggedIn = (state) => state.auth.loggedIn;
export const selectUserName = (state) => state.auth.name;
export const selectUserEmail = (state) => state.auth.email;

