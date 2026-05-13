import { useEffect, useState } from "react";
import { Calendar, Package, Route, Receipt } from "lucide-react";

import SubPageHeader from "../../components/layout/SubPageHeader";
import { LoadingState } from "../../components/common/Loading";
import { getMyClaimedPackages } from "../../services/api/claimedPackages";

function StatusLabel({ item }) {
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
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.is_confirmed
      ? "bg-emerald-50 text-emerald-700"
      : "bg-yellow-50 text-yellow-700"
      }`}>
      {item.is_confirmed ? "Confirmed" : "Pending"}
    </span>
  );
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function PaketkuPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await getMyClaimedPackages();
      setPackages(data || []);
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

      {packages.length === 0 ? (
        <div className="mt-12 rounded-2xl bg-white p-8 text-center text-sm text-gray-400 shadow-sm">
          Belum ada paket yang diklaim
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {packages.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              {item.photo_url && (
                <img
                  src={item.photo_url}
                  alt={item.name || item.receipt}
                  className="h-40 w-full object-cover"
                />
              )}

              <div className="p-4">
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

                  <StatusLabel item={item} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">
                    <Route className="h-4 w-4" />
                    {item.route_code || "-"}
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(item.claimed_at)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
