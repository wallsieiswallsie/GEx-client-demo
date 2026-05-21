import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Check,
  CheckCircle2,
  Eye,
  Filter,
  Image,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import { LoadingState } from "../../components/common/Loading";
import FloatingActionButton from "../../components/common/FloatingActionButton";
import Button from "../../components/common/Button";
import FilterInvoiceSheet from "../invoices/FilterInvoiceSheet";
import { useAuth } from "../../context/useAuth";
import { canAccessFinance } from "../../utils/financeAccess";
import {
  addCashSettlementItems,
  approveCashSettlement,
  createCashSettlement,
  getCashSettlementById,
  getCashSettlements,
  getEligibleCashInvoices,
  rejectCashSettlement,
  removeCashSettlementItem,
  submitCashSettlement,
} from "../../services/api/cashSettlementsApi";
import CashSettlementStatusBadge from "./CashSettlementStatusBadge";

const LIMIT = 20;
const STATUS_TABS = [
  ["", "Semua"],
  ["draft", "Draft"],
  ["submitted", "Diajukan"],
  ["approved", "Disetujui"],
  ["rejected", "Ditolak"],
];

function formatMoney(value) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

function formatDate(value) {
  return value ? String(value).slice(0, 10) : "-";
}

function emptyFilters() {
  return {
    month: "",
    month_label: "",
    via_code: "",
    via: null,
    batch_id: "",
    batch: null,
  };
}

function getBatchText(batches = []) {
  if (!batches.length) return "";
  const first = batches[0];
  const suffix = batches.length > 1 ? ` +${batches.length - 1} batch lain` : "";

  return `${first.via_name} • ${first.display_name || first.batch_code}${suffix}`;
}

export default function CashSettlementsPage({ mode = "list" }) {
  const { user, role } = useAuth();

  if (!canAccessFinance(user, role)) {
    return <Navigate to="/home" replace />;
  }

  if (mode === "new") return <CreateSettlementPage />;
  if (mode === "select") return <SelectInvoicesPage />;
  if (mode === "detail") return <SettlementDetailPage />;

  return <SettlementsListPage />;
}

function SettlementsListPage() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [searchParams] = useSearchParams();
  const approvalOnly = searchParams.get("approval") === "1";
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState(approvalOnly ? "submitted" : "");
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [staffId, setStaffId] = useState("");
  const [loading, setLoading] = useState(false);

  const isStaff = role === "branch_staff";
  const isGeneralManager = role === "general_manager";
  const title = approvalOnly ? "Approval Setoran Tunai" : "Setoran Tunai";

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCashSettlements({
        page: 1,
        limit: LIMIT,
        status,
        search,
        month,
        branch_code: branchCode.trim(),
        staff_id: staffId.trim(),
        approval_only: approvalOnly,
      });
      setItems(res.items || []);
      setTotal(res.total || 0);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }, [approvalOnly, branchCode, month, search, staffId, status]);

  useEffect(() => {
    const delay = setTimeout(fetchData, 300);

    return () => clearTimeout(delay);
  }, [fetchData]);

  return (
    <div className="min-h-dvh bg-gray-50 p-4">
      <div className="mb-5">
        <SubPageHeader title={title} />
      </div>

      <div className="mb-4 flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode setoran..."
            className="w-full rounded-xl border bg-white py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
        </div>
        <div className="relative w-32">
          <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full rounded-xl border bg-white py-2.5 pl-9 pr-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
        </div>
      </div>

      {isGeneralManager && (
        <div className="mb-4 grid grid-cols-2 gap-2">
          <input
            value={branchCode}
            onChange={(e) => setBranchCode(e.target.value)}
            placeholder="Filter cabang"
            className="rounded-xl border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
          <input
            value={staffId}
            onChange={(e) => setStaffId(e.target.value.replace(/\D/g, ""))}
            placeholder="ID staff"
            inputMode="numeric"
            className="rounded-xl border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
        </div>
      )}

      {!approvalOnly && (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {STATUS_TABS.map(([value, label]) => (
            <button
              key={value}
              onClick={() => setStatus(value)}
              className={`shrink-0 rounded-xl border px-3 py-2 text-xs font-semibold ${
                status === value ? "border-violet-600 bg-violet-600 text-white" : "bg-white text-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="mb-3 text-sm font-semibold text-gray-800">
        Total {total} setoran
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(`/cash-settlements/${item.id}`)}
            className="w-full rounded-2xl bg-white p-4 text-left shadow-sm transition active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-gray-900">{item.settlement_code}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {formatDate(item.submitted_at || item.created_at)}
                </div>
              </div>
              <CashSettlementStatusBadge value={item.status} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <InfoBox label="Invoice" value={item.total_invoice || 0} />
              <InfoBox label="Total" value={formatMoney(item.total_amount)} />
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Oleh {item.submitted_by_name || item.created_by_name || "-"}
            </div>
          </button>
        ))}
      </div>

      {!loading && items.length === 0 && (
        <EmptyState text={approvalOnly ? "Belum ada pengajuan setoran" : "Belum ada setoran tunai"} />
      )}

      {loading && <LoadingState variant="section" text="Memuat setoran..." />}

      {isStaff && !approvalOnly && (
        <FloatingActionButton
          onClick={() => navigate("/cash-settlements/new")}
          ariaLabel="Buat setoran tunai"
          title="Buat setoran tunai"
        >
          <Plus />
        </FloatingActionButton>
      )}
    </div>
  );
}

function CreateSettlementPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const handleNext = async () => {
    try {
      setSaving(true);
      const created = await createCashSettlement({ note });
      navigate(`/cash-settlements/${created.id}/select`);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50 p-4">
      <div className="mb-5">
        <SubPageHeader title="Buat Setoran Baru" />
      </div>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <InfoBox label="Branch" value={user?.branch_code || "Otomatis dari akun"} />
          <InfoBox label="Tanggal" value={formatDate(new Date().toISOString())} />
        </div>
        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs font-medium text-amber-700">
          Setoran hanya untuk invoice dengan metode pembayaran TUNAI (CASH).
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Catatan optional"
          rows={4}
          className="mt-4 w-full rounded-xl border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
        />
      </section>

      <div className="fixed bottom-16 left-0 right-0 z-30 mx-auto max-w-[430px] bg-white p-4 shadow-[0_-8px_24px_rgba(15,23,42,0.08)]">
        <Button onClick={handleNext} loading={saving} loadingText="Membuat..." fullWidth>
          Lanjut Pilih Invoice
        </Button>
      </div>
    </div>
  );
}

function SelectInvoicesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [appliedFilter, setAppliedFilter] = useState(emptyFilters());

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getEligibleCashInvoices({
        page: 1,
        limit: 50,
        search,
        month: appliedFilter.month,
        via_code: appliedFilter.via_code,
        batch_id: appliedFilter.batch_id,
      });
      setData(res.items || []);
      setTotal(res.total || 0);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }, [appliedFilter, search]);

  useEffect(() => {
    const delay = setTimeout(fetchData, 300);

    return () => clearTimeout(delay);
  }, [fetchData]);

  const selectedItems = useMemo(() => Object.values(selected), [selected]);
  const totalAmount = selectedItems.reduce((sum, item) => sum + Number(item.total_amount || 0), 0);

  const toggle = (item) => {
    setSelected((prev) => {
      const next = { ...prev };

      if (next[item.id]) {
        delete next[item.id];
      } else {
        next[item.id] = item;
      }

      return next;
    });
  };

  const handleContinue = async () => {
    if (selectedItems.length === 0) return;

    try {
      setSaving(true);
      await addCashSettlementItems(id, selectedItems.map((item) => item.id));
      navigate(`/cash-settlements/${id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50 p-4 pb-36">
      <div className="mb-5">
        <SubPageHeader title="Pilih Invoice Tunai" />
      </div>

      <div className="mb-4 flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari invoice/customer..."
            className="w-full rounded-xl border bg-white py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
        </div>
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className="rounded-xl border bg-white px-3 py-2.5 text-gray-700"
          aria-label="Filter invoice"
        >
          <Filter className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-3 text-sm font-semibold text-gray-800">
        {total} invoice tunai eligible
      </div>

      <div className="space-y-3">
        {data.map((item) => {
          const checked = Boolean(selected[item.id]);

          return (
            <button
              key={item.id}
              onClick={() => toggle(item)}
              className={`w-full rounded-2xl border bg-white p-4 text-left shadow-sm ${
                checked ? "border-violet-600 ring-2 ring-violet-100" : "border-transparent"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border ${
                  checked ? "border-violet-600 bg-violet-600 text-white" : "border-gray-300"
                }`}>
                  {checked && <Check className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-gray-900">{item.invoice_number}</div>
                  <div className="mt-1 truncate text-xs text-gray-500">{item.customer_name}</div>
                  <div className="mt-2 text-sm font-semibold text-violet-700">{formatMoney(item.total_amount)}</div>
                  {getBatchText(item.shipment_batches) && (
                    <div className="mt-2 text-xs text-gray-500">{getBatchText(item.shipment_batches)}</div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {!loading && data.length === 0 && <EmptyState text="Tidak ada invoice tunai eligible" />}
      {loading && <LoadingState variant="section" text="Memuat invoice tunai..." />}

      <div className="fixed bottom-16 left-0 right-0 z-30 mx-auto max-w-[430px] bg-white p-4 shadow-[0_-8px_24px_rgba(15,23,42,0.08)]">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="text-gray-500">{selectedItems.length} invoice dipilih</span>
          <span className="font-bold text-gray-900">{formatMoney(totalAmount)}</span>
        </div>
        <Button
          onClick={handleContinue}
          disabled={selectedItems.length === 0 || saving}
          loading={saving}
          loadingText="Menyimpan..."
          fullWidth
        >
          Lanjut
        </Button>
      </div>

      <FilterInvoiceSheet
        open={filterOpen}
        value={appliedFilter}
        onClose={() => setFilterOpen(false)}
        onApply={(next) => {
          setAppliedFilter(next);
          setFilterOpen(false);
        }}
        onReset={() => {
          setAppliedFilter(emptyFilters());
          setFilterOpen(false);
        }}
      />
    </div>
  );
}

function SettlementDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [proof, setProof] = useState(null);
  const [note, setNote] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCashSettlementById(id);
      setData(res);
      setNote(res.note || "");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isDraft = data?.status === "draft";
  const isRejected = data?.status === "rejected";
  const isSubmitted = data?.status === "submitted";
  const canStaffEdit = role === "branch_staff" && (isDraft || isRejected);
  const canManagerReview = role === "branch_manager" && isSubmitted;

  const handleRemove = async (itemId) => {
    if (!confirm("Hapus invoice dari draft setoran?")) return;

    try {
      setSaving(true);
      const res = await removeCashSettlementItem(id, itemId);
      setData(res);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!confirm("Ajukan setoran tunai ke branch manager?")) return;

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("note", note || "");
      if (proof) {
        formData.append("proof", proof);
      }
      const res = await submitCashSettlement(id, formData);
      setData(res);
      alert("Setoran tunai berhasil diajukan");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm("Setujui setoran tunai ini? Invoice terkait akan dikunci sebagai sudah disetor.")) return;

    try {
      setSaving(true);
      const res = await approveCashSettlement(id);
      setData(res);
      alert("Setoran tunai disetujui");
      navigate("/cash-settlements?approval=1");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Alasan penolakan wajib diisi");
      return;
    }

    try {
      setSaving(true);
      const res = await rejectCashSettlement(id, rejectReason.trim());
      setData(res);
      setRejectOpen(false);
      alert("Setoran tunai ditolak");
      navigate("/cash-settlements?approval=1");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50 p-4 pb-32">
      <div className="mb-5">
        <SubPageHeader title="Detail Setoran" />
      </div>

      {loading && !data ? (
        <LoadingState variant="section" text="Memuat setoran..." />
      ) : data && (
        <div className="space-y-4">
          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="truncate text-sm font-bold text-gray-900">{data.settlement_code}</h1>
                <p className="mt-1 text-xs text-gray-500">{data.branch_code}</p>
              </div>
              <CashSettlementStatusBadge value={data.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <InfoBox label="Invoice" value={data.total_invoice || 0} />
              <InfoBox label="Total Sistem" value={formatMoney(data.total_amount)} />
              <InfoBox label="Dibuat" value={formatDate(data.created_at)} />
              <InfoBox label="Diajukan" value={formatDate(data.submitted_at)} />
            </div>
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-gray-900">Invoice Tunai</h2>
              {canStaffEdit && (
                <button
                  onClick={() => navigate(`/cash-settlements/${id}/select`)}
                  className="text-xs font-semibold text-violet-600"
                >
                  Tambah
                </button>
              )}
            </div>
            <div className="space-y-2">
              {(data.items || []).map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-3 border-b border-gray-100 pb-2 last:border-b-0">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-gray-800">{item.invoice_number}</div>
                    <div className="truncate text-xs text-gray-500">{item.customer_name || "-"}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="text-right text-xs font-semibold text-gray-700">{formatMoney(item.invoice_amount)}</div>
                    {canStaffEdit && (
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                        aria-label="Hapus invoice"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {(data.items || []).length === 0 && (
              <div className="rounded-xl border border-dashed p-4 text-center text-sm text-gray-400">
                Belum ada invoice dipilih
              </div>
            )}
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">Bukti dan Catatan</h2>
            {data.proof_url ? (
              <button
                onClick={() => setPreviewImage(data.proof_url)}
                className="mb-3 flex w-full items-center gap-3 rounded-xl border bg-gray-50 p-3 text-left"
              >
                <Image className="h-5 w-5 text-violet-600" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-700">Lihat bukti setoran</span>
                <Eye className="h-4 w-4 text-gray-400" />
              </button>
            ) : (
              <div className="mb-3 rounded-xl border border-dashed p-4 text-center text-sm text-gray-400">
                Belum ada bukti setoran
              </div>
            )}

            {canStaffEdit && (
              <label className="mb-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border bg-white px-3 py-3 text-sm font-semibold text-gray-700">
                <Upload className="h-4 w-4" />
                {proof ? proof.name : "Upload bukti setoran"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProof(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            )}

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={!canStaffEdit}
              placeholder="Catatan optional"
              rows={3}
              className="w-full rounded-xl border bg-white px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
            />

            {data.rejected_reason && (
              <div className="mt-3 rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-700">
                {data.rejected_reason}
                <div className="mt-1 font-semibold">Ubah invoice untuk mengembalikan setoran menjadi draft.</div>
              </div>
            )}
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">Log Aktivitas</h2>
            <div className="space-y-3">
              {(data.logs || []).map((log) => (
                <div key={log.id} className="flex gap-3 text-xs">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-800">{log.action}</div>
                    <div className="text-gray-500">{log.description || "-"}</div>
                    <div className="mt-1 text-gray-400">{formatDate(log.created_at)} • {log.created_by_name || "-"}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {canStaffEdit && (
        <div className="fixed bottom-16 left-0 right-0 z-30 mx-auto max-w-[430px] bg-white p-4 shadow-[0_-8px_24px_rgba(15,23,42,0.08)]">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={fetchData} disabled={saving}>
              Simpan Draft
            </Button>
            <Button onClick={handleSubmit} disabled={saving || !isDraft || !data?.items?.length} loading={saving} loadingText="Mengajukan...">
              Ajukan Setoran
            </Button>
          </div>
        </div>
      )}

      {canManagerReview && (
        <div className="fixed bottom-16 left-0 right-0 z-30 mx-auto max-w-[430px] bg-white p-4 shadow-[0_-8px_24px_rgba(15,23,42,0.08)]">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => setRejectOpen(true)} disabled={saving}>
              Tolak
            </Button>
            <Button onClick={handleApprove} disabled={saving} loading={saving} loadingText="Menyetujui...">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Setujui
              </span>
            </Button>
          </div>
        </div>
      )}

      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
            aria-label="Tutup preview"
          >
            <X className="h-5 w-5" />
          </button>
          <img src={previewImage} alt="Bukti setoran" className="max-h-full max-w-full rounded-2xl object-contain" />
        </div>
      )}

      {rejectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Alasan Penolakan</h2>
              <button onClick={() => setRejectOpen(false)} aria-label="Tutup modal">
                <X className="h-5 w-5" />
              </button>
            </div>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              placeholder="Tuliskan alasan penolakan"
              className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
            <Button onClick={handleReject} loading={saving} loadingText="Menolak..." fullWidth>
              Tolak Setoran
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 px-3 py-2">
      <div className="text-[11px] font-medium text-gray-400">{label}</div>
      <div className="truncate text-xs font-bold text-gray-800">{value}</div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-sm text-gray-400">
      <div className="mb-3 h-12 w-12 rounded-full bg-gray-200" />
      {text}
    </div>
  );
}
