import { useEffect } from "react";
import { useCustomerApi } from "../../../hooks/useCustomerApi";
import { FiMapPin, FiPhone } from "react-icons/fi";

function LokasiKontakPageDisplay() {
  const { items, loading, error, fetchItems } = useCustomerApi("lokasiKontak");

  useEffect(() => {
    fetchItems();
  }, []);

  const getEmbedLink = (url) => {
    if (!url) return "";

    if (url.includes("maps/embed")) return url;

    if (url.includes("maps.app.goo.gl") || url.includes("goo.gl/maps")) {
      return `https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
        url
      )}&key=AIzaSyDd0GigMQWL7AuiFQLHYisCLY3_NBOJAxw`;
    }

    if (url.includes("/maps/")) {
      return url.replace("/maps/", "/maps/embed/");
    }

    return "";
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#3e146d] mb-6">
          Lokasi & Kontak Cabang
        </h2>

        {loading && <p className="text-center">Memuat...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 border rounded-2xl shadow-sm bg-white hover:shadow-md transition"
            >
              {/* Nama Cabang */}
              <h2 className="font-bold text-[#3e146d] text-center mb-2">
                {item.nama_cabang.toUpperCase() || "(Tanpa nama cabang)"}
              </h2>

              {/* Alamat */}
              <div className="flex items-start gap-2 mb-2">
                <FiMapPin className="text-gray-500 text-xl flex-shrink-0 mt-1" />
                <p className="font-semibold text-gray-600 text-lg whitespace-pre-wrap break-words">
                  {item.alamat_cabang || "(Tanpa alamat)"}
                </p>
              </div>

              {/* No HP */}
              {item.no_hp && (
                <div className="flex items-center gap-2 mb-2">
                  <FiPhone className="text-gray-500 flex-shrink-0 text-lg" />
                  <p className="text-gray-700 text-sm">{item.no_hp}</p>
                </div>
              )}

              {/* Map */}
              {item.link_map && (
                <div
                  className="cursor-pointer mt-2"
                  onClick={() => window.open(item.link_map, "_blank")}
                >
                  <iframe
                    className="w-full h-48 rounded-lg border mt-5 mb-5 pointer-events-none"
                    src={getEmbedLink(item.link_map)}
                    loading="lazy"
                  ></iframe>
                </div>
              )}

              {/* WhatsApp */}
              {item.link_whatsapp && (
                <a
                  href={item.link_whatsapp}
                  target="_blank"
                  className="w-full bg-green-500 !text-white text-sm py-2 px-4 rounded-xl shadow-md shadow-slate-600 inline-block text-center mb-2 hover:bg-green-600 transition"
                >
                  WhatsApp
                </a>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LokasiKontakPageDisplay;