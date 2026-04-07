import { Wallet, Zap, AlertCircle } from "lucide-react";
import { useMerchantWallet } from "../../hooks/useMerchantWallet";
 
export default function MerchantWalletDashboard() {
  // ✅ Get merchantId (correct key + case)
  const merchantId = localStorage.getItem("ps_merchantId");
 
  console.log("Merchant ID:", merchantId);
 
  // ✅ CALL HOOK ONLY ONCE
  const { wallet, loading, error, closeWallet } =
    useMerchantWallet(merchantId);
 
  if (loading) {
    return <div className="p-6 text-white">Loading wallet...</div>;
  }
 
  if (error) {
    return (
      <div className="p-6 text-red-400 flex items-center gap-2">
        <AlertCircle size={18} />
        Failed to load wallet
      </div>
    );
  }
 
  if (!wallet) {
    return (
      <div className="p-6 text-yellow-400">
        Wallet not available. Please contact support.
      </div>
    );
  }
 
  const statusMessage = {
    Active: "Ready to use",
    Frozen: "Your wallet has been frozen by admin. Please contact support.",
    Closed: "Your wallet has been closed. This action is permanent.",
  }[wallet.status];
 
  return (
    <div className="min-h-screen p-6 bg-[#080d1a]">
      <h1 className="text-white text-xl font-bold flex items-center gap-2 mb-6">
        <Wallet className="text-indigo-400" />
        Merchant Wallet
      </h1>
 
      <div
        className="rounded-3xl p-10 text-white flex justify-between"
        style={{
          background:
            "linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)",
        }}
      >
        <div>
          <p className="text-sm uppercase opacity-70">Wallet Balance</p>
          <h2 className="text-4xl font-black mt-2">
            ₹{wallet.balance.toLocaleString("en-IN")}
          </h2>
          <p className="mt-2 text-sm opacity-80">{statusMessage}</p>
          <p className="text-xs opacity-60 mt-1">
            Wallet ID: {wallet.walletID}
          </p>
        </div>
        <Zap size={48} className="opacity-30" />
      </div>
 
      {/* {wallet.status === "Active" && (
        // <button
        //   onClick={closeWallet}
        //   className="mt-8 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl"
        // >
        //   Close Wallet
        // </button>
      )} */}
    </div>
  );
}