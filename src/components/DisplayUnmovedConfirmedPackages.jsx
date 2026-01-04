import { useEffect, useState, useMemo } from "react";
import { 
  fetchUnmovedConfirmedPackagesApi,
  markConfirmedPackageAsMovedApi
} from "../utils/api";
import { useAuth } from "../context/AuthContext";

function DisplayUnmovedConfirmedPackages() {
  const { user } = useAuth();
  const userRole = user?.role || "";

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [resiInput, setResiInput] = useState("");
  const [processing, setProcessing] = useState(false);

  const loadPackages = async () => {
    try {
      const result = await fetchUnmovedConfirmedPackagesApi();

      const list = Array.isArray(result?.data?.packages)
        ? result.data.packages
        : Array.isArray(result?.data)
        ? result.data
        : [];

      setPackages(
        list.map((p) => ({
          id_confirmed: p.id,
          id_package: p.package_id,
          is_moved: p.is_moved,
          nama: p.nama,
          resi: p.resi,
          kode: p.kode,
        }))
      );
    } catch (err) {
      console.error("Gagal memuat data:", err);
      setPackages([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await loadPackages();
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSubmitMoved = async () => {
    if (!resiInput.trim()) return;

    try {
      setProcessing(true);
      await markConfirmedPackageAsMovedApi(resiInput.trim());
      setResiInput("");

      await loadPackages();
    } catch (err) {
      console.error("Gagal update:", err);
    } finally {
      setProcessing(false);
    }
  };

  const filteredPackages = useMemo(() => {
    const s = search.toLowerCase();
    return packages.filter(
      (p) =>
        p.resi?.toLowerCase().includes(s) ||
        p.nama?.toLowerCase().includes(s) ||
        p.kode?.toLowerCase().includes(s)
    );
  }, [packages, search]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-10">
      
      {/* Header */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#3e146d]">
          Paket Belum Dipindahkan
        </h2>
      </div>

      {/* Search */}
      <div className="w-full max-w-3xl flex flex-wrap gap-3 mb-3">
        <input
          type="text"
          placeholder="Cari nama / resi / kode"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
        />
      </div>

      {/* Input resi | hanya tampil untuk role tertentu */}
      {(userRole === "Manager Main Warehouse" ||
        userRole === "Staff Main Warehouse") && (
        <div className="w-full max-w-3xl flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Input resi yang sudah dipindahkan"
            value={resiInput}
            onChange={(e) => setResiInput(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
          />
          <button
            onClick={handleSubmitMoved}
            disabled={processing}
            className="px-4 py-2 bg-[#3e146d] text-white rounded-xl hover:bg-[#2a0d4c] disabled:opacity-50"
          >
            {processing ? "Memproses..." : "+"}
          </button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <p className="text-gray-500">Memuat paket...</p>
      ) : filteredPackages.length === 0 ? (
        <p className="text-gray-500">Tidak ada paket ditemukan.</p>
      ) : (
        <div className="w-full max-w-3xl grid grid-cols-1 md-grid-cols-2 gap-3">
          {filteredPackages.map((p) => (
            <div
              key={p.id_confirmed}
              className="p-4 border rounded-2xl shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-[#3e146d] w-1/2">
                  {p.nama?.toUpperCase()}
                </h3>
              </div>

              <p className="text-gray-700">
                Resi: {p.resi?.toUpperCase()}
              </p>
              <h4 className="font-semibold text-[#3e146d] w-1/2">
                {p.kode?.toUpperCase()}
              </h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DisplayUnmovedConfirmedPackages;