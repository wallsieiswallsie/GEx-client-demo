import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getPackagesByKarungApi } from "../../utils/api";
import PackingPackageToKarung from "../../components/modals/batches/PackingPackageToKarung";

export default function PackagesByKarungPage() {
  const { user } = useAuth();
  const { batchId, noKarung } = useParams();
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await getPackagesByKarungApi(batchId, noKarung, search);
      if (res.status === "success") {
        setPackages(res.data.packages);
      } else {
        setPackages([]);
      }
    } catch (err) {
      console.error(err);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [search, batchId, noKarung]);

  return (
    <div className="max-w-4xl mx-6 mt-10 flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-[#3e146d]">
        Karung {noKarung} | {batchId}
      </h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Cari berdasarkan nama atau nomor resi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 flex-1"
        />
        {(user?.role === "Staff Main Warehouse" ||
          user?.role === "Manager Main Warehouse") && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="bg-[#3e146d] text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            +
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : packages.length === 0 ? (
        <p className="text-gray-500">Tidak ada paket ditemukan</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white border border-[#3e146d]/20 shadow-lg rounded-2xl p-4 flex flex-col gap-1 hover:shadow-xl transition"
            >
              <p className="font-semibold">{pkg.nama.toUpperCase()}</p>
              <p className="text-gray-600">{pkg.resi.toUpperCase()}</p>
              <p>{pkg.berat_dipakai} kg</p>
              
              {(user?.role === "Manager Destination Warehouse" ||
                user?.role === "Manager Main Warehouse") && (
                <p>Rp {Number(pkg.harga).toLocaleString("id-ID")}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <PackingPackageToKarung
          karung={{ no_karung: noKarung }}
          batchId={batchId}
          onClose={() => setModalOpen(false)}
          onSuccess={fetchPackages}
        />
      )}
    </div>
  );
}