// import http from "../http";

// // Add /api before /Auth
// export const registerUser = (data) => http.post("/api/Auth/register", data);
// export const loginUser = (data) => http.post("/auth/login", data);

import http from "../http";

// If your Program.cs uses app.MapPost("/auth/login"...), do NOT add /api
export const registerUser = (data) => http.post("/api/auth/register", data); 
export const loginUser = (data) =>
  http.post("/api/auth/login", data, { withCredentials: true });
export const logoutUser = () =>
  http.post("/api/uth/logout", {}, { withCredentials: true });
// import axios from "axios";

// let AUTH_TOKEN = null;

// export const setAuthToken = (token) => {
//   AUTH_TOKEN = token || null;
// };

// const http = axios.create({
//   baseURL: "http://localhost:5245",
//   withCredentials: true, // 🚨 MANDATORY: This allows cookies to be saved and sent
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// http.interceptors.request.use((config) => {
//   const url = config.url?.toLowerCase() ?? '';
  
//   // Check for auth endpoints to avoid sending old tokens during login/register
//   const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');
  
//   // Use the token from memory or fallback to localStorage for persistence
//   const token = AUTH_TOKEN || localStorage.getItem("ps_token");

//   if (token && !isAuthEndpoint) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
  
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

// export { http as api };
// export default http;