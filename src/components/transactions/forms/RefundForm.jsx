import { useState } from "react";
import { createRefundRequest } from "../../../services/refunds/refundRequestsApi";

// digits-only helper
const digitsOnly = (v) => (v || "").replace(/\D+/g, "");

/**
 * RefundForm (User) — creates a refund request
 * Calls: POST /api/RefundRequests
 * NOTE: This replaces the previous "direct refund" form. Merchants should use
 * their own page to approve/reject and (optionally) execute the refund later.
 */
export default function RefundForm({ onCompleted }) {
  const [originalTransactionID, setOrig] = useState("");
  const [phone, setPhone] = useState("");

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const canSubmit =
    Number(originalTransactionID) > 0 && digitsOnly(phone).length >= 10;

  async function submit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setMsg("");
    setErr("");
    try {
      setBusy(true);

      // USER flow: create a refund request (this triggers merchant notification)
      const out = await createRefundRequest({
        originalTransactionID,
        phoneNumber: digitsOnly(phone),
      });

      setMsg(out?.message || "Refund request submitted (Pending).");
      onCompleted?.();
      setOrig("");
      setPhone("");
    } catch (e2) {
      const d = e2?.response?.data;
      setErr(
        d?.detail || d?.title || d?.message || e2?.message || "Failed to submit refund request"
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-2 max-w-md">
      <h3 className="text-lg font-semibold mb-1">Request a Refund</h3>
      <p className="text-slate-600 mb-2 text-sm">
        Enter the original P2M Transaction ID and your registered phone number.
      </p>

      <input
        className="border rounded px-3 py-2"
        placeholder="Original Transaction ID"
        value={originalTransactionID}
        onChange={(e) => setOrig(e.target.value)}
        inputMode="numeric"
      />

      <input
        className="border rounded px-3 py-2"
        placeholder="Registered Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        inputMode="tel"
      />

      <input className="border rounded px-3 py-2 bg-slate-50" value="INR" disabled />

      <button
        disabled={!canSubmit || busy}
        className="mt-1 px-4 py-2 border rounded bg-blue-600 text-white disabled:opacity-50"
      >
        {busy ? "Submitting…" : "Submit Request"}
      </button>

      {msg && <p className="text-green-600">{msg}</p>}
      {err && <p className="text-red-600">{err}</p>}
    </form>
  );
}