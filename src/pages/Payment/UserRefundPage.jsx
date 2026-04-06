import UserRefundRequestForm from "../../components/transactions/forms/UserRefundRequestForm.jsx";
 
export default function UserRefundPage() {
  return (
    <div className="px-6 py-4">
      <h2 className="text-xl font-semibold mb-1">Refund</h2>
      <p className="text-slate-600 mb-4">Create a refund request for a completed P2M transaction.</p>
      <UserRefundRequestForm />
    </div>
  );
}
 