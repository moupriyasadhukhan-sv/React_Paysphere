import { X } from "lucide-react";

export default function StatusEditModal({ 
  isOpen, 
  onClose, 
  onSave, 
  title, 
  currentStatus, 
  statusOptions = ["Active", "Resolved", "Pending", "Closed"],
  saving = false 
}) {
  if (!isOpen) return null;

  const [newStatus, setNewStatus] = React.useState(currentStatus);

  const handleSave = () => {
    onSave(newStatus);
    setNewStatus(currentStatus);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Status */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Current Status</label>
          <div className="px-4 py-2 bg-slate-700/30 rounded-lg text-slate-200 text-sm border border-slate-600/30">
            {currentStatus}
          </div>
        </div>

        {/* New Status Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Change To</label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-600 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-medium transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || newStatus === currentStatus}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
