import http from "./http";

// POST /api/Auth/Admin-register
export const adminRegisterStaff = (payload) => {
  // payload: { name, email, password, role, phone }
  return http.post("/api/Auth/Admin-register", payload);
};