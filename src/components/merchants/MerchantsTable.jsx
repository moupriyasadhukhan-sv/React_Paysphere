import { useEffect, useMemo, useState, useCallback } from "react";
import { api } from "../../services/http";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../common/ConfirmDialog";
import toast from "react-hot-toast";
import { useIcon } from "../../hooks/useIcon";

const PAGE_SIZE = 4;

export default function MerchantsTable() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [balances, setBalances] = useState({});

  const LoaderIcon = useIcon("Loader");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    onConfirm: null,
    confirmText: "Delete",
    cancelText: "Cancel",
  });

  const navigate = useNavigate();

  const getMerchantId = useCallback(
    (m) => m.merchantId ?? m.merchantID ?? m.MerchantId ?? m.id ?? m.ID ?? m.Id,
    []
  );

  // Load table
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    api
      .get("/api/Merchant")
      .then((res) => {
        const items = Array.isArray(res?.data?.data) ? res.data.data : [];
        if (mounted) setData(items);
      })
      .catch((e) => {
        console.error(e);
        if (mounted) setError("Failed to load merchants.");
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);


  useEffect(() => {
  if (!data.length) return;

  data.forEach((m) => {
    const merchantId = getMerchantId(m);
    if (!merchantId) return;

    // ✅ avoid refetch
    if (balances[merchantId]) return;

    // set loading
    setBalances(prev => ({
      ...prev,
      [merchantId]: { loading: true }
    }));

    api
      .get(`/api/Wallets/merchant/${merchantId}/verify`)
      .then(res => {
        setBalances(prev => ({
          ...prev,
          [merchantId]: {
            loading: false,
            balance: res.data.balance,
            currency: res.data.currency || "INR"
          }
        }));
      })
      .catch(() => {
        setBalances(prev => ({
          ...prev,
          [merchantId]: { loading: false, error: true }
        }));
      });
  });
}, [data, getMerchantId]);

  // Pagination
  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageSafe = Math.min(Math.max(1, page), totalPages);
  const current = useMemo(() => {
    const start = (pageSafe - 1) * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  }, [data, pageSafe]);

  const canPrev = useMemo(() => !loading && pageSafe > 1, [loading, pageSafe]);
  const canNext = useMemo(() => !loading && pageSafe < totalPages, [loading, pageSafe, totalPages]);
  const gotoPrev = () => canPrev && setPage((p) => Math.max(1, p - 1));
  const gotoNext = () => canNext && setPage((p) => Math.min(totalPages, p + 1));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);

  // ✅ Navigate to the nested settlements page
  const goToSettlement = (merchantId) =>
    navigate(`/dashboard/admin/settlements/merchant/${merchantId}`);

  
  const createSettlement=(merchantId)=> navigate(`/dashboard/admin/settlements/create/${merchantId}`)


  const openConfirm = ({ title, message, onConfirm, confirmText = "Delete", cancelText = "Cancel" }) => {
    setConfirmConfig({ title, message, onConfirm, confirmText, cancelText });
    setConfirmOpen(true);
  };
  const closeConfirm = () => {
    if (confirming) return;
    setConfirmOpen(false);
    setConfirmConfig({ title: "", message: "", onConfirm: null, confirmText: "Delete", cancelText: "Cancel" });
  };

 const deleteMerchant = async (merchantId) => {
  if (!merchantId) throw new Error("merchantId is missing");

  try {
    const url = `/api/Merchant/${merchantId}`;
    console.log("Deleting Merchant:", url);

    const res = await api.delete(url);
    return res.data;  // RETURN THE RESPONSE!!
  } 
  catch (err) {
    // THROW proper backend response so UI gets message
    const errorMessage =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to delete merchant";

    throw new Error(errorMessage);
  }
};

  // 👇 columns: removed Create Settlement (so -1)
  const HEAD_COLS = 8;

  return (
  <div className="space-y-3">

    {/* Header */}
    <div className="mb-1">
      <h2 className="text-2xl font-semibold text-white tracking-wide drop-shadow-lg">
        Merchants
      </h2>
      <p className="text-sm text-purple-200/70">
        View and manage merchant accounts
      </p>
    </div>

    {/* Table */}
    <div className="overflow-auto border border-white/10 rounded-xl 
                    bg-white/5 backdrop-blur-xl shadow-[0_0_25px_rgba(255,255,255,0.05)]">

      <table className="min-w-full text-sm text-slate-200">
        <thead className="bg-white/10 text-slate-100">
          <tr className="text-left">
            <th className="px-4 py-3">Merchant ID</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Balance</th>
            <th className="px-4 py-3">Check Settlement</th>
            <th className="px-4 py-3">Create Settlement</th>
            <th className="px-4 py-3">Delete Merchant</th>
          </tr>
        </thead>

        <tbody>
          
        {loading && (
            <tr>
              <td colSpan={4} className="py-10 text-center">
                <div className="flex items-center justify-center">
                  {LoaderIcon ? (
                    <LoaderIcon className="animate-spin text-blue-500" size={36} />
                  ) : (
                    "Loading..."
                  )}
                </div>
              </td>
            </tr>
          )}


          {!loading && error && (
            <tr>
              <td colSpan={HEAD_COLS} className="px-4 py-6 text-rose-400">
                {error}
              </td>
            </tr>
          )}

          {!loading && !error && current.length === 0 && (
            <tr>
              <td colSpan={HEAD_COLS} className="px-4 py-6 text-slate-400">
                No merchants found.
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            current.map((m) => {
              const id = getMerchantId(m);
              const status = (m.status || "").toLowerCase();
              const isActive = status === "active";

              return (
                <tr
                  key={id}
                  className="border-t border-white/10 
                             hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]
                             transition"
                >
                  <td className="px-4 py-3 whitespace-nowrap">{id}</td>
                  <td className="px-4 py-3">{m.name ?? "—"}</td>

                  <td className="px-4 py-3">
                    <span className="block truncate max-w-[240px]" title={m.email}>
                      {m.email ?? "—"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                        isActive
                          ? "bg-green-500/20 text-green-300"
                          : "bg-slate-500/20 text-slate-300"
                      }`}
                    >
                      {m.status ?? "—"}
                    </span>
                  </td>
                  
                  <td className="px-4 py-3">
                    {balances[id]?.loading && (
                      <span className="text-slate-400 animate-pulse">Loading…</span>
                    )}

                    {!balances[id]?.loading && balances[id]?.error && (
                      <span className="text-rose-400">—</span>
                    )}

                    {!balances[id]?.loading && balances[id]?.balance !== undefined && (
                      <span className="font-semibold text-emerald-400">
                        ₹{balances[id].balance.toLocaleString()}
                      </span>
                    )}
                  </td>



                  {/* Check Settlement */}
                  <td className="px-4 py-3">
                    <button
                      className="px-3 py-1.5 rounded-md text-white
                                 bg-gradient-to-r from-blue-500 to-indigo-500
                                 hover:from-blue-600 hover:to-indigo-600
                                 shadow-[0_0_12px_rgba(59,130,246,0.5)]
                                 hover:shadow-[0_0_18px_rgba(59,130,246,0.8)]
                                 active:scale-95 transition-all duration-200"
                      type="button"
                      onClick={() => goToSettlement(id)}
                    >
                      Check Settlement
                    </button>
                  </td>

                  {/* Create Settlement */}
                  <td className="px-4 py-3">
                    <button
                      className="px-3 py-1.5 rounded-md text-white
                                 bg-gradient-to-r from-green-500 to-emerald-600
                                 hover:from-green-600 hover:to-emerald-700
                                 shadow-[0_0_12px_rgba(16,185,129,0.5)]
                                 hover:shadow-[0_0_18px_rgba(16,185,129,0.8)]
                                 active:scale-95 transition-all duration-200"
                      type="button"
                      onClick={() => createSettlement(id)}
                    >
                      Create Settlement
                    </button>
                  </td>

                  {/* Delete Merchant */}
                  <td className="px-4 py-3">
  <button
    className="px-3 py-1.5 rounded-md text-white
               bg-gradient-to-r from-rose-600 to-red-700
               hover:from-rose-700 hover:to-red-800
               shadow-[0_0_12px_rgba(244,63,94,0.5)]
               hover:shadow-[0_0_18px_rgba(244,63,94,0.8)]
               active:scale-95 transition-all duration-200"
    type="button"
    onClick={() =>
      openConfirm({
        title: "Delete Merchant",
        message: (
          <div>
            This action cannot be undone. Delete{" "}
            <strong>Merchant {id}</strong>?
          </div>
        ),

        onConfirm: async () => {
          try {
            const response = await deleteMerchant(id);  // backend call

            // Show success toast (backend usually sends message)
            toast.success(response?.message || "Merchant deleted successfully!");

            // Remove deleted merchant from table
            setData(prev =>
              prev.filter(x => getMerchantId(x) !== id)
            );
          } catch (err) {
            // If pending settlements → backend sends message
            const errMsg = err?.message || "Failed to delete merchant.";
            toast.error(errMsg);
          }
        },

        confirmText: "Delete",
        cancelText: "Cancel",
      })
    }
    title="Delete merchant"
  >
    Delete Merchant
  </button>
</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>

    {/* Pager */}
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between mt-2">
      <span className="text-sm text-slate-300">
        Showing {current.length} of {total} &nbsp;|&nbsp; Page {pageSafe} / {totalPages}
      </span>

      <div className="flex items-center gap-3">
        <button
          className="px-3 py-1.5 rounded-md text-white 
                     bg-white/10 border border-white/20
                     hover:bg-white/20
                     shadow-[0_0_12px_rgba(255,255,255,0.15)]
                     hover:shadow-[0_0_18px_rgba(255,255,255,0.4)]
                     disabled:opacity-40 active:scale-95 transition-all duration-200"
          disabled={!canPrev}
          onClick={gotoPrev}
        >
          Previous
        </button>

        <button
          className="px-3 py-1.5 rounded-md text-white 
                     bg-white/10 border border-white/20
                     hover:bg-white/20
                     shadow-[0_0_12px_rgba(255,255,255,0.15)]
                     hover:shadow-[0_0_18px_rgba(255,255,255,0.4)]
                     disabled:opacity-40 active:scale-95 transition-all duration-200"
          disabled={!canNext}
          onClick={gotoNext}
        >
          Next
        </button>
      </div>
    </div>
    <ConfirmDialog
  open={confirmOpen}
  title={confirmConfig.title}
  message={confirmConfig.message}
  confirmText={confirmConfig.confirmText}
  cancelText={confirmConfig.cancelText}
  confirming={confirming}

  onCancel={() => {
    if (!confirming) setConfirmOpen(false);
  }}

  onConfirm={async () => {
    try {
      setConfirming(true);
      if (confirmConfig.onConfirm) {
        await confirmConfig.onConfirm();
      }
    } finally {
      setConfirming(false);
      setConfirmOpen(false);
    }
  }}
/>
  </div>
);
}