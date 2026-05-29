import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { CheckCircle2, Pencil, Plus, Search, ToggleLeft, X } from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import { isGeneralManagerRole } from "../../utils/roleAccess";
import { LoadingState } from "../../components/common/Loading";
import FloatingActionButton from "../../components/common/FloatingActionButton";
import { useAuth } from "../../context/useAuth";
import {
  createPaymentMethod,
  deactivatePaymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
} from "../../services/api/paymentMethodsApi";

const emptyForm = {
  id: null,
  name: "",
  code: "",
  fee_percentage: "",
  is_active: true,
  is_cash: false,
};

const formatDate = (value) => (value ? String(value).slice(0, 10) : "-");

const formatFee = (value) => {
  const number = Number(value || 0);
  return `${number.toLocaleString("id-ID", { maximumFractionDigits: 2 })}%`;
};

export default function PaymentMethodPage() {
  const { role } = useAuth();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setItems(await getPaymentMethods({ keyword: debouncedSearch }));
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (isGeneralManagerRole(role)) {
      fetchData();
    }
  }, [fetchData, role]);

  if (!isGeneralManagerRole(role)) {
    return <Navigate to="/home" replace />;
  }

  const openCreate = () => {
    setForm(emptyForm);
    setIsOpen(true);
  };

  const openEdit = (item) => {
    setForm({
      id: item.id,
      name: item.name || "",
      code: item.code || "",
      fee_percentage: item.fee_percentage ?? "",
      is_active: Boolean(item.is_active),
      is_cash: Boolean(item.is_cash),
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      fee_percentage: Number(form.fee_percentage),
      is_active: Boolean(form.is_active),
      is_cash: Boolean(form.is_cash),
    };

    if (!payload.name || !payload.code) {
      alert("Name dan code wajib diisi");
      return;
    }

    if (Number.isNaN(payload.fee_percentage) || payload.fee_percentage < 0) {
      alert("Fee percentage harus numeric dan minimal 0");
      return;
    }

    try {
      setSaving(true);
      if (form.id) {
        await updatePaymentMethod(form.id, payload);
      } else {
        await createPaymentMethod(payload);
      }

      closeModal();
      await fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (item) => {
    if (!confirm(`Nonaktifkan payment method ${item.code}?`)) return;

    try {
      await deactivatePaymentMethod(item.id);
      await fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50 p-4">
      <div className="mb-5">
        <SubPageHeader title="Payment Method" />
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari name atau code..."
          className="w-full rounded-xl border bg-white py-2.5 pl-9 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-2.5 text-gray-400"
            aria-label="Hapus pencarian"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {loading ? (
          <LoadingState variant="list" rows={4} />
        ) : items.length === 0 ? (
          <div className="rounded-xl border bg-white p-5 text-center text-sm text-gray-400">
            Belum ada payment method
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-gray-900">{item.name}</p>
                    <span className="rounded-lg bg-violet-50 px-2 py-1 text-[11px] font-bold text-violet-700">
                      {item.code}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>
                      <p className="font-medium text-gray-400">Fee</p>
                      <p className="font-semibold text-gray-700">{formatFee(item.fee_percentage)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-400">Created At</p>
                      <p className="font-semibold text-gray-700">{formatDate(item.created_at)}</p>
                    </div>
                  </div>
                  <span
                    className={`mt-3 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold ${
                      item.is_active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {item.is_active ? "Active" : "Inactive"}
                  </span>
                  {item.is_cash && (
                    <span className="ml-2 mt-3 inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                      Cash
                    </span>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => openEdit(item)}
                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                    aria-label="Edit payment method"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeactivate(item)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-40"
                    disabled={!item.is_active}
                    aria-label="Nonaktifkan payment method"
                  >
                    <ToggleLeft className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <FloatingActionButton
        onClick={openCreate}
        ariaLabel="Tambah payment method"
        title="Tambah payment method"
      >
        <Plus />
      </FloatingActionButton>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800">
                {form.id ? "Edit Payment Method" : "Tambah Payment Method"}
              </h2>
              <button type="button" onClick={closeModal} aria-label="Tutup modal">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                className="w-full rounded-xl border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
              />
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase().replace(/\s/g, "") })}
                placeholder="Code"
                className="w-full rounded-xl border bg-white px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-violet-200"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.fee_percentage}
                onChange={(e) => setForm({ ...form, fee_percentage: e.target.value })}
                placeholder="Fee Percentage"
                className="w-full rounded-xl border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
              />
              <label className="flex items-center justify-between rounded-xl border bg-white px-3 py-2 text-sm">
                <span className="font-medium text-gray-700">Active</span>
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="h-4 w-4 accent-violet-600"
                />
              </label>
              <label className="flex items-center justify-between rounded-xl border bg-white px-3 py-2 text-sm">
                <span className="font-medium text-gray-700">Tunai / Cash</span>
                <input
                  type="checkbox"
                  checked={form.is_cash}
                  onChange={(e) => setForm({ ...form, is_cash: e.target.checked })}
                  className="h-4 w-4 accent-violet-600"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-4 w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : form.id ? "Simpan Perubahan" : "Tambah"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
