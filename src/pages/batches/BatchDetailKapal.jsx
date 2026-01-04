import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  getBatchWithKarungApi,
  addNoKarungToBatchKapalApi,
  addPackageToKarungApi,
} from "../../utils/api";
import PackingPackageToKarung from "../../components/modals/batches/PackingPackageToKarung";

export default function BatchDetailKapal() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [noKarung, setNoKarung] = useState("");
  const [selectedKarung, setSelectedKarung] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getBatchWithKarungApi(batchId);
      if (res.status === "success") setBatch(res.data);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil detail batch kapal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [batchId]);

  const handleAddKarung = async (e) => {
    e.preventDefault();
    try {
      const res = await addNoKarungToBatchKapalApi(batchId, noKarung);
      if (res.status === "success") {
        alert("Berhasil menambahkan nomor karung");
        setShowForm(false);
        setNoKarung("");
        fetchData();
      } else {
        alert("Gagal menambahkan karung: " + res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menambahkan karung");
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  if (!batch)
    return <p className="text-center text-gray-500 mt-10">Batch tidak ditemukan</p>;

  return (
    <div className="max-w-4xl mb-10 mx-6 px-4 md:px-6 mt-10 flex flex-col gap-6">
      
      {/* Info batch */}
      <div className="bg-white border border-[#3e146d]/20 shadow-lg rounded-2xl p-6 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[#3e146d]">{batch.id}</h1>
        <p><strong>{batch.nama_kapal.toUpperCase()}</strong></p>
        <p><strong>Tanggal Closing:</strong> {batch.tanggal_closing.split("T")[0]}</p>
        <p><strong>Tanggal Berangkat:</strong> {batch.tanggal_berangkat.split("T")[0]}</p>

        {(user?.role === "Manager Main Warehouse") && (
          <p><strong>Total Berat:</strong>{batch.total_berat} kg</p>
        )}

        {(user?.role === "Manager Main Warehouse") && (
          <p><strong>Total Nilai:</strong> Rp {Number(batch.total_value).toLocaleString("id-ID")}</p>
        )}
      </div>

      {/* Header Karung */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#3e146d]">Daftar Karung</h2>
        {(user?.role === "Manager Main Warehouse" ||
          user?.role === "Staff Main Warehouse") && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#3e146d] text-white px-4 py-2 rounded-3xl hover:opacity-90"
          >
            +
          </button>
        )}
      </div>

      {/* Form tambah karung */}
      {showForm && (
        <form
          onSubmit={handleAddKarung}
          className="mb-4 flex gap-2 items-center"
        >
          <input
            type="text"
            placeholder="Masukkan No Karung"
            value={noKarung}
            onChange={(e) => setNoKarung(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 w-64"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            Simpan
          </button>
        </form>
      )}

      {/* List Karung */}
      {batch.karung && batch.karung.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {batch.karung.map((karung) => {

            // === PERHITUNGAN TOTAL BERAT KARUNG ===
            const totalBeratKarung = Number(
              karung.packages?.reduce(
                (sum, p) => sum + (Number(p.berat_dipakai) || 0),
                0
              ).toFixed(2)
            );

            return (
              <div
                key={karung.id}
                className="bg-white border border-[#3e146d]/20 shadow-lg rounded-2xl p-4 flex flex-col gap-2 hover:shadow-xl transition"
              >
                <h2 className="font-bold text-[#3e146d] text-lg mb-2">
                  Karung: {karung.no_karung}
                </h2>

                <p>Total Paket: {karung.packages?.length || 0}</p>
                <p>Total Berat: {totalBeratKarung} kg</p>

                <div className="flex gap-2 mt-2">
                  {(user?.role === "Manager Main Warehouse" ||
                    user?.role === "Staff Main Warehouse") && (
                    <button
                      onClick={() => setSelectedKarung(karung)}
                      className="flex-1 bg-[#3e146d] text-white px-3 py-1 rounded hover:opacity-90"
                    >
                      Packing Paket
                    </button>
                  )}
                  <button
                    onClick={() =>
                      navigate(`/batches/kapal/${batchId}/karung/${karung.no_karung}`)
                    }
                    className="flex-1 bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                  >
                    Lihat Paket
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">Belum ada karung di batch ini</p>
      )}

      {/* Modal Packing */}
      {selectedKarung && (
        <PackingPackageToKarung
          karung={selectedKarung}
          onClose={() => setSelectedKarung(null)}
          onSuccess={fetchData}
          batchId={batchId}
          addPackageToKarungApi={addPackageToKarungApi}
        />
      )}
    </div>
  );
}