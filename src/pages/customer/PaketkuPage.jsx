import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Calendar, Package, Route, Receipt } from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import { LoadingState } from "../../components/common/Loading";
import { getMyPackagesByStatus } from "../../services/api/claimedPackages";

const SECTIONS = [
  { key: "semua", label: "Semua Paket" },
  { key: "menunggu_tiba", label: "Menunggu Tiba" },
  { key: "tidak_valid", label: "Tidak Valid" },
  { key: "tiba_gudang", label: "Tiba Gudang" },
  { key: "dipacking", label: "Dipacking" },
  { key: "dalam_pengiriman", label: "Dalam Pengiriman" },
  { key: "tiba_tujuan", label: "Tiba Tujuan" },
  { key: "siap_diambil", label: "Siap Diambil" },
  { key: "selesai", label: "Selesai" },
];

function normalizeStatus(value) {
  return String(value || "semua").replaceAll("-", "_");
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusLabel({ item, fallback }) {
  if (item.is_problematic) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
        <span>Bermasalah</span>
        <span className="h-1 w-1 rounded-full bg-orange-500" />
        <span>{item.is_confirmed ? "Confirmed" : "Pending"}</span>
      </div>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
      {fallback}
    </span>
  );
}

export default function PaketkuPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [groups, setGroups] = useState(null);
  const [loading, setLoading] = useState(true);
  const sectionRefs = useRef({});

  const orderedSections = useMemo(() => {
    const selected = normalizeStatus(searchParams.get("status"));
    const target = SECTIONS.find((section) => section.key === selected);

    if (!target || target.key === "semua") {
      return SECTIONS;
    }

    return [
      target,
      ...SECTIONS.filter((section) => section.key !== target.key),
    ];
  }, [searchParams]);

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    const selected = normalizeStatus(searchParams.get("status"));
    const node = sectionRefs.current[selected];

    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [searchParams, groups]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await getMyPackagesByStatus();
      setGroups(data || {});
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState text="Memuat paketku..." />;
  }

  return (
    <div className="min-h-dvh bg-gray-50 p-4 pb-28">
      <SubPageHeader title="Paketku" />

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {SECTIONS.map((section) => (
          <button
            key={section.key}
            onClick={() => navigate(`/paketku?status=${section.key.replaceAll("_", "-")}`)}
            className="shrink-0 rounded-full bg-white px-3 py-2 text-xs font-semibold text-gray-600 shadow-sm"
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-5">
        {orderedSections.map((section) => {
          const items = groups?.[section.key] || [];

          return (
            <section
              key={section.key}
              ref={(node) => {
                sectionRefs.current[section.key] = node;
              }}
              className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-800">
                  {section.label}
                </h2>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-500">
                  {items.length}
                </span>
              </div>

              {items.length === 0 ? (
                <div className="rounded-xl bg-gray-50 py-6 text-center text-sm text-gray-400">
                  Tidak ada package
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <button
                      key={`${section.key}-${item.id}`}
                      onClick={() =>
                        item.package_id && navigate(`/packages/${item.package_id}`)
                      }
                      className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white text-left shadow-sm active:scale-[0.99] transition disabled:cursor-default"
                      disabled={!item.package_id}
                    >
                      {item.photo_url && (
                        <img
                          src={item.photo_url}
                          alt={item.name || item.receipt}
                          className="h-36 w-full object-cover"
                        />
                      )}

                      <div className="p-3">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                              <Receipt className="h-4 w-4 shrink-0 text-violet-600" />
                              <span className="truncate">{item.receipt || "-"}</span>
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                              <Package className="h-4 w-4 shrink-0" />
                              <span className="truncate">{item.name || "-"}</span>
                            </div>
                          </div>

                          <StatusLabel item={item} fallback={section.label} />
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                          <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">
                            <Route className="h-4 w-4" />
                            <span className="truncate">{item.route_code || "-"}</span>
                          </div>
                          <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(item.claimed_at)}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
