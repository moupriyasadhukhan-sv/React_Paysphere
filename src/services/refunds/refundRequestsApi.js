import { api } from "../http";
 
// USER: create refund request
export function createRefundRequest({ originalTransactionID, phoneNumber }) {
  return api
    .post("/api/RefundRequests", {
      originalTransactionID: Number(originalTransactionID),
      phoneNumber: String(phoneNumber || "").trim(),
    })
    .then((r) => r.data);
}
 
// MERCHANT: list own
export function listMerchantRefundRequests() {
  return api.get("/api/RefundRequests").then((r) => (Array.isArray(r.data) ? r.data : []));
}
 
// MERCHANT: status
export function getRefundRequestStatus(id) {
  return api.get(`/api/RefundRequests/${id}/status`).then((r) => r.data);
}
 
// MERCHANT: approve / reject
export function approveRefundRequest(id) {
  return api.post(`/api/RefundRequests/${id}/approve`).then((r) => r.data);
}
export function rejectRefundRequest(id) {
  return api.post(`/api/RefundRequests/${id}/reject`).then((r) => r.data);
}
 