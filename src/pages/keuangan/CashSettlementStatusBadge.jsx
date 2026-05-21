const STATUS_MAP = {
  draft: "bg-amber-50 text-amber-700 border-amber-100",
  submitted: "bg-violet-50 text-violet-700 border-violet-100",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
  rejected: "bg-red-50 text-red-700 border-red-100",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
};

const LABEL_MAP = {
  draft: "Draft",
  submitted: "Diajukan",
  approved: "Disetujui",
  rejected: "Ditolak",
  cancelled: "Dibatalkan",
};

export default function CashSettlementStatusBadge({ value }) {
  const normalized = String(value || "draft").toLowerCase();

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${STATUS_MAP[normalized] || STATUS_MAP.draft}`}>
      {LABEL_MAP[normalized] || normalized}
    </span>
  );
}
