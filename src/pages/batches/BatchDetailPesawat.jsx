import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchBatchPesawatDetailApi } from "../../utils/api";
import PackageCard from "../../components/PackageCard";
import AddPackageToBatchPesawatModal from "../../components/modals/batches/AddPackageToBatchPesawatModal";
import ErrorBoundary from "../../components/ErrorBoundary";

export default function BatchDetailPesawat() {
  const { batchId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const userRole = user?.role;
  const userCabang = user?.cabang?.toLowerCase();

  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [kodeFilter, setKodeFilter] = useState("all");
  const [invoiceFilter, setInvoiceFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetchBatchPesawatDetailApi(batchId);

      if (res.success) {
        setBatch(res.data);
      } else {
        setError(res.message || "Gagal mengambil data batch pesawat");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan pada server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [batchId]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!batch) return <p className="text-center mt-10 text-gray-500">Batch tidak ditemukan</p>;

  // ===================================================
  // FILTER: ROLE & CABANG
  // ===================================================
  const allowedRoles = ["Manager Main Warehouse", "Manager Destination Warehouse", "Staff Main Warehouse", "Staff Destination Warehouse"];
  const allowedCabangJPSOQA = ["main", "remu"];
  const allowedCabangJPSOQB = ["main", "aimas"];

  let filteredPackages = batch.packages.filter((pkg) => {
    const code = pkg.kode || "";

    if (!allowedRoles.includes(userRole)) return false;

    if (code.startsWith("JPSOQA")) {
      return allowedCabangJPSOQA.includes(userCabang);
    }
    if (code.startsWith("JPSOQB")) {
      return allowedCabangJPSOQB.includes(userCabang);
    }

    return true;
  });

  // ===================================================
  // FILTER: DROPDOWN (KODE)
  // ===================================================
  if (kodeFilter !== "all") {
    filteredPackages = filteredPackages.filter((pkg) => pkg.kode?.startsWith(kodeFilter));
  }

  // ===================================================
  // FILTER: DROPDOWN (INVOICE)
  // ===================================================
  if (invoiceFilter === "invoiced") {
    filteredPackages = filteredPackages.filter((pkg) => pkg.invoiced === true);
  } else if (invoiceFilter === "not_invoiced") {
    filteredPackages = filteredPackages.filter((pkg) => pkg.invoiced === false);
  }

  // ===================================================
  // FILTER: SEARCH (nama / resi)
  // ===================================================
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    filteredPackages = filteredPackages.filter((pkg) => {
      const namaLower = pkg.nama?.toLowerCase() || "";
      const resiLower = pkg.resi?.toLowerCase() || "";
      return namaLower.includes(q) || resiLower.includes(q);
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 mb-10 flex flex-col gap-6">
      {/* ======================================
          INFO BATCH
      ====================================== */}
      <div className="bg-white border border-purple-300 shadow-lg rounded-2xl p-6 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[#3e146d]">Batch: {batch.id}</h1>
        <p><strong>Tanggal Kirim:</strong> {batch.tanggal_kirim?.split("T")[0]}</p>

        {userRole === "Manager Main Warehouse" && (
          <>
            <p><strong>Total Berat:</strong> {batch.total_berat} kg</p>
            <p><strong>Total Nilai:</strong> Rp {Number(batch.total_value).toLocaleString("id-ID")}</p>
          </>
        )}
      </div>

      {/* ======================================
          FILTER SECTION
      ====================================== */}
      {/* Search Input */}
        <input
          type="text"
          placeholder="Cari nama atau resi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded-xl shadow-sm flex-1"
        />
      
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow border border-purple-200">

        {/* Filter Kode (Manager Main Warehouse saja) */}
        {userRole === "Manager Main Warehouse" && (
          <select
            value={kodeFilter}
            onChange={(e) => setKodeFilter(e.target.value)}
            className="border p-2 rounded-xl shadow-sm"
          >
            <option value="all">Semua Kode</option>
            <option value="JPSOQA">JPSOQA</option>
            <option value="JPSOQB">JPSOQB</option>
          </select>
        )}

        {/* Filter Invoice */}
        {(userRole === "Manager Main Warehouse" 
        || userRole === "Manager Destination Warehouse" 
        || userRole === "Staff Destination Warehouse") && (
          <select
            value={invoiceFilter}
            onChange={(e) => setInvoiceFilter(e.target.value)}
            className="border p-2 rounded-xl shadow-sm"
          >
            <option value="all">Semua Status Invoice</option>
            <option value="invoiced">Sudah Invoiced</option>
            <option value="not_invoiced">Belum Invoiced</option>
          </select>
        )}

        {/* Tombol Tambah Paket */}
        {(userRole === "Manager Main Warehouse" || userRole === "Staff Main Warehouse") && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#3e146d] text-white px-4 py-2 rounded-2xl hover:opacity-90"
          >
            +
          </button>
        )}
      </div>

      {/* ======================================
          LIST PAKET
      ====================================== */}
      {filteredPackages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPackages.map((pkg) => (
            <ErrorBoundary key={pkg.id}>
              <PackageCard
                pkg={pkg}
                isDisabled={pkg.invoiced === true}
                className="bg-white shadow-lg rounded-2xl border border-[#3e146d]/20 hover:shadow-xl transition cursor-pointer"
              />
            </ErrorBoundary>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Tidak ada paket yang cocok dengan filter</p>
      )}

      {/* ======================================
          MODAL TAMBAH PAKET
      ====================================== */}
      {showAddModal && (
        <AddPackageToBatchPesawatModal
          batchId={batchId}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}