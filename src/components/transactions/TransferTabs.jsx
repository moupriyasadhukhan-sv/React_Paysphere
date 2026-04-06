// // src/components/transactions/TransferTabs.jsx
// // import { useAuth } from "../../context/AuthContext.jsx";
// import { useSelector } from "react-redux";
// import { useState } from "react";
// import P2PForm from "./forms/P2PForm.jsx";
// import P2MForm from "./forms/P2MForm.jsx";
// import RefundForm from "./forms/RefundForm.jsx";

// export default function TransferTabs({ onCompleted }) {
//   // const { auth } = useAuth();
//   // const role = auth?.role;
//   const userId = useSelector((s) => s.auth?.userId);
//   const role = useSelector((s) => s.auth?.role);

//   const [tab, setTab] = useState(role === "Merchant" ? "refund" : "p2p");
//   const baseBtn = "px-3 py-2 border-b-2";
//   const active  = "border-blue-600 text-blue-600 font-semibold";
//   const idle    = "border-transparent text-slate-600 hover:text-blue-600";

//   return (
//     <div>
//       <div className="flex gap-4 border-b mb-3">
//         <button className={`${baseBtn} ${tab==='p2p'?active:idle}`} onClick={()=>setTab("p2p")}>P2P</button>
//         <button className={`${baseBtn} ${tab==='p2m'?active:idle}`} onClick={()=>setTab("p2m")}>P2M</button>
//         <button className={`${baseBtn} ${tab==='refund'?active:idle}`} onClick={()=>setTab("refund")}>Refund</button>
//       </div>

//       {tab === "p2p"   && <P2PForm   onCompleted={onCompleted} />}
//       {tab === "p2m"   && <P2MForm   onCompleted={onCompleted} />}
//       {tab === "refund"&& <RefundForm onCompleted={onCompleted} />}
//     </div>
//   );
// }


import PaymentHub from "./PaymentHub.jsx";

export default function TransferTabs({ onCompleted }) {
  return <PaymentHub onCompleted={onCompleted} />;
}