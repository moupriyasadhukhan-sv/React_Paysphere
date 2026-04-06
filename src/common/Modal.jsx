import React from "react";

export default function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative z-10 w-[min(92vw,480px)] mx-auto mt-24 rounded-xl overflow-hidden shadow-2xl bg-white"
      >
        {/* Header */}
        <div className="bg-indigo-600 px-5 py-4 text-white flex items-center justify-between">
          <h2 id="modal-title" className="font-semibold text-lg">{title || "Dialog"}</h2>
          <button
            type="button"
            className="rounded px-2 hover:bg-indigo-700"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-5">{children}</div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 flex items-center justify-end gap-3">
          {footer}
        </div>
      </div>
    </div>
  );
}