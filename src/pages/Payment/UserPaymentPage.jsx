// // src/pages/payment/UserPaymentPage.jsx
// import { useEffect } from "react";
// import { useAuth } from "../../context/AuthContext.jsx";
// import usePrimaryWalletId from "../../hooks/usePrimaryWalletId";
// import TransferTabs from "../../components/transactions/TransferTabs.jsx";

// export default function UserPaymentPage() {
//   const { auth, setWalletId } = useAuth();
//   const { walletId, loading, error } =
//     usePrimaryWalletId({ role: auth?.role, userId: auth?.userId, merchantId: auth?.merchantId });

//   // cache the discovered walletId into context for forms (P2P/P2M)
//   useEffect(() => {
//     if (walletId && walletId !== auth?.walletId) {
//       setWalletId(walletId);
//     }
//   }, [walletId]); // eslint-disable-line

//   return (
//     <div className="px-6 py-4">
//       <h2 className="text-xl font-semibold mb-1">Payment</h2>
//       <p className="text-slate-500 mb-4">
//         Send money (P2P), pay merchants (P2M), or initiate refunds.
//       </p>

//       {/* Wallet info banner */}
//       {loading && <p>Resolving your wallet…</p>}
//       {error && <p className="text-amber-600">Wallet warning: {error}</p>}
//       {auth?.walletId && (
//         <p className="text-slate-600 mb-2 text-sm">
//           From wallet: <b>{auth.walletId}</b>
//         </p>
//       )}

//       {/* Your existing transfer tabs */}
//       <TransferTabs
//         onCompleted={() => {
//           // Optional: toast or redirect to /dashboard/user/transactions
//         }}
//       />
//     </div>
//   );
// }

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setWalletId } from "../../stores/authSlice";
import usePrimaryWalletId from "../../hooks/usePrimaryWalletId";
import TransferTabs from "../../components/transactions/TransferTabs.jsx";

export default function UserPaymentPage() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const { walletId, loading, error } = usePrimaryWalletId({
    role: auth?.role,
    userId: auth?.userId,
    merchantId: auth?.merchantId
  });

  useEffect(() => {
    if (walletId && walletId !== auth?.walletId) {
      dispatch(setWalletId(walletId));
    }
  }, [walletId]);

  return (
    <div className="px-6 py-4">
      <h2 className="text-xl font-semibold mb-1">Payment</h2>
      <p className="text-slate-500 mb-4">
        Send money (P2P), pay merchants (P2M), or initiate refunds.
      </p>

      {loading && <p>Resolving your wallet…</p>}
      {error && <p className="text-amber-600">Wallet warning: {error}</p>}

      {auth?.walletId && (
        <p className="text-slate-600 mb-2 text-sm">
          From wallet: <b>{auth.walletId}</b>
        </p>
      )}

      <TransferTabs onCompleted={() => {}} />
    </div>
  );
}