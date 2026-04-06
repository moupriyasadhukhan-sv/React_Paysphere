import { useState } from "react";
import { createP2M } from "../../../services/transactions/transactionsApi";
//import { useAuth } from "../../../context/AuthContext.jsx";
import { useSelector } from "react-redux";
const digitsOnly = (v) => (v || "").replace(/\D+/g, "");

export default function P2MForm({ onCompleted }) {
  // const { auth } = useAuth();
  // const resolvedWallet = auth?.walletId; // informational only
  const resolvedWallet=useSelector((s) => s.auth?.walletId);
  const [toWalletID, setTo] = useState(""); // merchant wallet id
  const [amount, setAmount] = useState("");
  const [phone, setPhone]   = useState(""); // 🔐 step-up

  const [busy, setBusy] = useState(false);
  const [msg, setMsg]   = useState("");
  const [err, setErr]   = useState("");

  const canSubmit =
    Number(toWalletID) > 0 &&
    Number(amount) > 0 &&
    digitsOnly(phone).length >= 10;

  async function submit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setMsg(""); setErr("");
    try {
      setBusy(true);
      const res = await createP2M({
        toWalletID,
        amount,
        currency: "INR",
        phoneNumber: digitsOnly(phone),
      });
      setMsg(res?.message || "P2M payment completed");
      onCompleted?.();
      setTo(""); setAmount(""); setPhone("");
    } catch (e2) {
      const d = e2?.response?.data;
      setErr(d?.detail || d?.title || e2?.message || "Payment failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-2 max-w-md">
      {resolvedWallet && (
        <div className="text-slate-500 text-sm">
          From wallet: <b>{resolvedWallet}</b>
        </div>
      )}

      <input className="border rounded px-3 py-2" placeholder="Merchant Wallet ID"
             value={toWalletID} onChange={e => setTo(e.target.value)} inputMode="numeric" />

      <input className="border rounded px-3 py-2" placeholder="Amount"
             value={amount} onChange={e => setAmount(e.target.value)} inputMode="decimal" />

      {/* 🔐 Step-up field */}
      <input className="border rounded px-3 py-2"
             placeholder="Registered Phone Number"
             value={phone} onChange={e => setPhone(e.target.value)} inputMode="tel" />

      <input className="border rounded px-3 py-2 bg-slate-50" value="INR" disabled />

      <button disabled={!canSubmit || busy} className="mt-1 px-4 py-2 border rounded bg-blue-600 text-white disabled:opacity-50">
        {busy ? "Processing…" : "Submit"}
      </button>

      {msg && <p className="text-green-600">{msg}</p>}
      {err && <p className="text-red-600">{err}</p>}
    </form>
  );
}