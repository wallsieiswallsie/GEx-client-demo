import { useEffect, useState } from "react";
import { CalendarDays, Ship } from "lucide-react";
import SubPageHeader from "../../components/layout/SubPageHeader";
import { LoadingState } from "../../components/common/Loading";
import { getDisplayedShipSchedules } from "../../services/api/content/contentApi";

const formatDate = (value) => (value ? new Date(value).toLocaleDateString("id-ID") : "-");

export default function CustomerShipSchedulesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDisplayedShipSchedules()
      .then((data) => setItems(data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-dvh bg-gray-50 p-4">
      <SubPageHeader title="Jadwal Kapal" />

      {loading ? (
        <LoadingState variant="list" rows={4} />
      ) : items.length === 0 ? (
        <div className="rounded-xl border bg-white p-5 text-center text-sm text-gray-400">Belum ada jadwal kapal</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Ship className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-800">{item.ship_name}</p>
                  <p className="mt-1 text-sm text-gray-500">{item.origin_city || "-"} ke {item.destination_city || "-"}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <DateCell label="Closing" value={formatDate(item.closing_date)} />
                    <DateCell label="Berangkat" value={formatDate(item.depart_date)} />
                    <DateCell label="Tiba" value={formatDate(item.estimated_arrival)} />
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

function DateCell({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 p-2">
      <div className="mb-1 flex items-center gap-1 text-gray-400">
        <CalendarDays className="h-3 w-3" />
        {label}
      </div>
      <p className="font-semibold text-gray-700">{value}</p>
    </div>
  );
}
