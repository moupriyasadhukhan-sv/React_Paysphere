import http from "../http";

// GET /api/Dashboard/user
export async function getUserDashboard() {
  const res = await http.get("/api/Dashboard/user");
  return res?.data || {};
}

// GET /api/Dashboard/merchant
export async function getMerchantDashboard() {
  const res = await http.get("/api/Dashboard/merchant");
  return res?.data || {};
}


export async function getMerchantAnalytics(merchantId = 1) {
  try {
    const res = await http.get(`/api/Report/merchant/${merchantId}`);
    return res; 
  } catch (error) {
    throw error; // Let the frontend catch this so the failsafe UI kicks in!
  }
}