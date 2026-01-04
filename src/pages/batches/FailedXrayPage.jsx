import { useState, useEffect } from "react";
import {
  fetchFailedXrayPackagesApi,
  failPackageXrayApi,
} from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

export default function FailedXrayPage() {
  const { user } = useAuth();
  const [failedPackages, setFailedPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchResi, setSearchResi] = useState("");
  const [newResi, setNewResi] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [adding, setAdding] = useState(false);

  // Ambil semua paket gagal X-ray
  const loadFailedPackages = async () => {
    setLoading(true);
    try {
      const res = await fetchFailedXrayPackagesApi();
      setFailedPackages(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFailedPackages();
  }, []);

  // Tambah paket gagal X-ray baru
  const handleAddResi = async () => {
    if (!newResi.trim()) return;
    setAdding(true);
    try {
      await failPackageXrayApi(newResi.trim());
      setNewResi("");
      await loadFailedPackages();
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  // Filter + search
  const filteredPackages = failedPackages.filter((pkg) => {
    const matchesFilter =
      filter === "Semua"
        ? true
        : filter === "Remu"
        ? pkg.kode === "JKSOQA"
        : filter === "Aimas"
        ? pkg.kode === "JKSOQB"
        : true;

    const matchesSearch = pkg.resi
      .toLowerCase()
      .includes(searchResi.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl text-[#3e146d] font-bold mb-4">Paket Gagal X-ray</h1>

      {/* Search Resi */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari berdasarkan resi..."
          value={searchResi}
          onChange={(e) => setSearchResi(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Tambah Resi */}
      {(user?.role === "Manager Main Warehouse" ||
        user?.role === "Staff Main Warehouse") && (
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Input resi baru"
          value={newResi}
          onChange={(e) => setNewResi(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleAddResi}
          disabled={adding}
          className="px-4 py-2 bg-[#3e146d] text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          +
        </button>
      </div>
      )}

      {/* Filter */}
      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="Semua">Semua Cabang</option>
          <option value="Remu">Remu</option>
          <option value="Aimas">Aimas</option>
        </select>
      </div>

      {/* Daftar Paket */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredPackages.length === 0 ? (
        <p className="text-center">Tidak ada paket.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Resi</th>
              <th className="border px-4 py-2 text-left">Nama</th>
            </tr>
          </thead>
          <tbody>
            {filteredPackages.map((pkg) => (
              <tr key={pkg.package_id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{pkg.resi}</td>
                <td className="border px-4 py-2">{pkg.nama}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}