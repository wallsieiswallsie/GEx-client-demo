import { useEffect } from "react";
import { useCustomerApi } from "../../../hooks/useCustomerApi";

function SyaratKetentuanPageDisplay() {
  const { items, loading, error, fetchItems } =
    useCustomerApi("syaratKetentuan");

  // Load data ketika halaman dibuka
  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-[#3e146d]/20">
        <h2 className="text-2xl font-bold text-center text-[#3e146d] mb-6">
          Syarat & Ketentuan
        </h2>

        {loading && <p className="text-center text-gray-500">Memuat...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Daftar konten */}
        <div className="flex flex-col gap-3">
          {items.length === 0 && !loading && (
            <p className="text-center text-gray-500">Belum ada data.</p>
          )}

          {items.map((item, index) => (
            <div
              key={item.id}
              className="p-3 border rounded-lg shadow-sm bg-white w-full"
            >
              <div className="flex gap-2">
                <span className="font-semibold text-[#3e146d]">
                  {index + 1}.
                </span>
                <span className="flex-1">
                  <p className="text-gray-700 break-words whitespace-pre-wrap">
                    {item.list}
                  </p>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SyaratKetentuanPageDisplay;
