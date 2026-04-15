
// // import axios from "axios";

// // // This is the private variable in Memory (Heap)
// // let AUTH_TOKEN = null;

// // // Function to set the token (called during Login or Refresh)
// // export const setAuthToken = (token) => {
// //   AUTH_TOKEN = token || null;
// // };

// // // ADD THIS: Function to get the token (called by teammates or components)
// // export const getAuthToken = () => {
// //   return AUTH_TOKEN;
// // };

// // const http = axios.create({
// //   baseURL: "http://localhost:5245",
// //   withCredentials: true, 
// //   headers: {
// //     "Content-Type": "application/json",
// //   },
// // });

// // // Interceptor uses the memory variable directly
// // http.interceptors.request.use((config) => {
// //   if (AUTH_TOKEN) {
// //     config.headers.Authorization = `Bearer ${AUTH_TOKEN}`;
// //   }
// //   return config;
// // });

// // // Response Interceptor: Handle token refresh or logout
// // http.interceptors.response.use(
// //   (response) => response,
// //   (error) => {
// //     // If 401 Unauthorized, token might be expired
// //     if (error.response?.status === 401) {
// //       // Clear token from memory
// //       AUTH_TOKEN = null;
// //       // Optional: Dispatch logout event or redirect to login
// //       console.warn("Token expired or unauthorized. Please login again.");
// //     }
// //     return Promise.reject(error);
// //   }
// // );

// //  export { http as api };
// //   export default http;


// import axios from "axios";

// // Memory-only access token (lost on page reload → correct & secure)
// let AUTH_TOKEN = null;

// // Store access token only in memory
// export const setAuthToken = (token) => {
//   AUTH_TOKEN = token || null;   // No localStorage!
// };

// // Getter for other files (optional)
// export const getAuthToken = () => AUTH_TOKEN;

// const http = axios.create({
//   baseURL: "http://localhost:5245",
//   withCredentials: true,
//   headers: { "Content-Type": "application/json" },
// });

// // Add access token (from memory only) to every request
// http.interceptors.request.use((config) => {
//   if (AUTH_TOKEN) {
//     config.headers.Authorization = `Bearer ${AUTH_TOKEN}`;
//   }
//   return config;
// });

// // 401 → try silent refresh
// let isRefreshing = false;

// http.interceptors.response.use(
//   (res) => res,
//   async (err) => {
//     if (err.response?.status === 401 && !isRefreshing) {
//       isRefreshing = true;

//       try {
//         // ⬇️ Attempt silent refresh using refresh cookie
//         const refreshRes = await http.post("/api/auth/refresh");

//         const newToken = refreshRes.data.accessToken;

//         // Save new access token IN MEMORY ONLY
//         setAuthToken(newToken);

//         // Retry original failed request
//         err.config.headers.Authorization = `Bearer ${newToken}`;

//         isRefreshing = false;
//         return http(err.config);

//       } catch (e) {
//         console.warn("Silent refresh failed, redirect to login");
//         setAuthToken(null);   // remove token from memory
//       }
//     }

//     return Promise.reject(err);
//   }
// );

// export default http;
// export { http as api };






// import axios from "axios";

// // This is the private variable in Memory (Heap)
// let AUTH_TOKEN = null;

// // Function to set the token (called during Login or Refresh)
// export const setAuthToken = (token) => {
//   AUTH_TOKEN = token || null;
// };

// // ADD THIS: Function to get the token (called by teammates or components)
// export const getAuthToken = () => {
//   return AUTH_TOKEN;
// };

// const http = axios.create({
//   baseURL: "http://localhost:5245",
//   withCredentials: true, 
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Interceptor uses the memory variable directly
// http.interceptors.request.use((config) => {
//   if (AUTH_TOKEN) {
//     config.headers.Authorization = `Bearer ${AUTH_TOKEN}`;
//   }
//   return config;
// });

// // Response Interceptor: Handle token refresh or logout
// http.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // If 401 Unauthorized, token might be expired
//     if (error.response?.status === 401) {
//       // Clear token from memory
//       AUTH_TOKEN = null;
//       // Optional: Dispatch logout event or redirect to login
//       console.warn("Token expired or unauthorized. Please login again.");
//     }
//     return Promise.reject(error);
//   }
// );

//  export { http as api };
//   export default http;


import axios from "axios";

// Memory-only access token (lost on page reload → correct & secure)
let AUTH_TOKEN = null;

// Store access token only in memory
export const setAuthToken = (token) => {
  AUTH_TOKEN = token || null;   // No localStorage!
};

// Getter for other files (optional)
export const getAuthToken = () => AUTH_TOKEN;

const http = axios.create({
  baseURL: "http://localhost:5245",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Add access token (from memory only) to every request
http.interceptors.request.use((config) => {
  if (AUTH_TOKEN) {
    config.headers.Authorization = `Bearer ${AUTH_TOKEN}`;
  }
  return config;
});

// 401 → try silent refresh
let isRefreshing = false;

http.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && !isRefreshing) {
      isRefreshing = true;

      try {
        // ⬇️ Attempt silent refresh using refresh cookie
        const refreshRes = await http.post("/api/auth/refresh");

        const newToken = refreshRes.data.accessToken;

        // Save new access token IN MEMORY ONLY
        setAuthToken(newToken);

        // Retry original failed request
        err.config.headers.Authorization = `Bearer ${newToken}`;

        isRefreshing = false;
        return http(err.config);

      } catch (e) {
        console.warn("Silent refresh failed, redirect to login");
        setAuthToken(null);   // remove token from memory
        
        // Clear all localStorage on refresh failure (invalid/expired refresh token)
        localStorage.removeItem("ps_token");
        localStorage.removeItem("ps_userId");
        localStorage.removeItem("ps_role");
        localStorage.removeItem("ps_merchantId");
        localStorage.removeItem("ps_email");
        localStorage.removeItem("ps_name");
        localStorage.removeItem("ps_walletId");
        localStorage.removeItem("ps_notifications");
        
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default http;
export { http as api };