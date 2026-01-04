    import { useEffect, useState } from "react";
import { useCustomerApi } from "../../../hooks/useCustomerApi";
import { ChevronDown, ChevronUp } from "lucide-react";

function SeringDitanyakanPageDisplay() {
  const { items, loading, error, fetchItems } = useCustomerApi("seringDitanyakan");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-[#3e146d]/20">
        <h2 className="text-2xl font-bold text-center text-[#3e146d] mb-6">
          Sering Ditanyakan
        </h2>

        {loading && <p className="text-center text-gray-500">Memuat...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {items.length === 0 && !loading && (
          <p className="text-center text-gray-500">Belum ada data FAQ.</p>
        )}

        <div className="flex flex-col gap-3 mt-3">
          {items.map((item, index) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="border rounded-2xl shadow-sm bg-white w-full p-4 transition-all duration-300"
              >
                <div className="flex justify-between items-center">
                  <p className="text-gray-700 font-semibold break-words whitespace-pre-wrap">
                    {index + 1}. {item.pertanyaan}
                  </p>
                  <button
                    onClick={() => toggleOpen(item.id)}
                    className="p-1 rounded hover:bg-gray-100 transition"
                  >
                    {isOpen ? (
                      <ChevronUp className="text-gray-500" size={20} />
                    ) : (
                      <ChevronDown className="text-gray-500" size={20} />
                    )}
                  </button>
                </div>

                {isOpen && (
                  <p className="text-gray-700 mt-2 whitespace-pre-wrap">
                    {item.jawaban}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SeringDitanyakanPageDisplay;