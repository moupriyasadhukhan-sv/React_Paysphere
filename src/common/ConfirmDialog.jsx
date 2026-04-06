import React from "react";


export default function ConfirmDialog({
  open,
  title = "Confirm",
  message = "Are you sure?",
  onCancel,
  onConfirm,
  confirmText = "Okay",
  cancelText = "Cancel",
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative z-10 w-[min(92vw,420px)] rounded-2xl overflow-hidden shadow-2xl"  onClick={(e) => e.stopPropagation()}>
        <div className="bg-blue-500 px-5 py-4 text-white flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center bg-blue-400 rounded-full text-2xl">?</div>
          <div className="font-semibold text-lg">{title}</div>
          <button
            onClick={onCancel}
            className="ml-auto text-white/90 hover:text-white"
            aria-label="Close dialog"
            title="Close"
          >
            ×
          </button>
        </div>

        <div className="bg-white px-6 py-5">
          <div className="text-gray-700">{message}</div>

          <div className="mt-5 flex items-center justify-end gap-3">
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
            >
              {confirmText}
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}