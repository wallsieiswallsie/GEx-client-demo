import { useEffect } from "react";
import { useCustomerApi } from "../../../hooks/useCustomerApi";

function JadwalKirimPageDisplay() {
  const { items, loading, error, fetchItems } =
    useCustomerApi("jadwalKirim");

  // ✅ Ambil data saat halaman dibuka
  useEffect(() => {
    fetchItems();
  }, []);

  // ✅ Sort: tanggal_closing terdekat -> terjauh
  const sortedItems = [...items].sort(
    (a, b) => new Date(a.tanggal_closing) - new Date(b.tanggal_closing)
  );

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-[#3e146d]/20">
        <h2 className="text-2xl font-bold text-center text-[#3e146d] mb-6">
          Jadwal Kapal
        </h2>

        {loading && <p className="text-center text-gray-500">Memuat...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* List */}
        <div className="flex flex-col gap-3">
          {sortedItems.length === 0 && !loading && (
            <p className="text-center text-gray-500">Belum ada data.</p>
          )}

          {sortedItems.map((item, index) => (
            <div
              key={item.id}
              className="p-3 border rounded-lg shadow-sm bg-white w-full flex flex-col gap-1"
            >
              <div className="flex gap-2 items-start">
                <span className="font-semibold text-[#3e146d]">
                  {index + 1}.
                </span>

                <div className="flex-1">
                  <p className="text-gray-800 font-semibold">
                    {item.nama_kapal.toUpperCase()}
                  </p>

                  {/* Closing */}
                  <div className="flex text-sm text-gray-700">
                    <span className="w-32 bg-green-100 px-2 py-0.5 rounded my-1">
                      Closing
                    </span>
                    <span className="ml-1">
                      : {item.tanggal_closing.split("T")[0]}
                    </span>
                  </div>

                  {/* Berangkat */}
                  <div className="flex text-sm text-gray-700">
                    <span className="w-32 bg-yellow-100 px-2 py-0.5 rounded my-1">
                      Berangkat
                    </span>
                    <span className="ml-1">
                      : {item.tanggal_berangkat.split("T")[0]}
                    </span>
                  </div>

                  {/* Estimasi Tiba */}
                  <div className="flex text-sm text-gray-700">
                    <span className="w-32 bg-lime-100 px-2 py-0.5 rounded my-1">
                      Estimasi Tiba
                    </span>
                    <span className="ml-1">
                      : {item.estimasi_tiba.split("T")[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JadwalKirimPageDisplay;