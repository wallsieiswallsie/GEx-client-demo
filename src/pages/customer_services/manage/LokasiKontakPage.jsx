import { useEffect, useState } from "react";
import { useCustomerApi } from "../../../hooks/useCustomerApi";
import { MoreVertical } from "lucide-react";
import { FiMapPin, FiPhone } from "react-icons/fi";

function LokasiKontakPage() {
  const {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    patchItem,
    deleteItem,
  } = useCustomerApi("lokasiKontak");

  const [namaCabang, setNamaCabang] = useState("");
  const [alamat, setAlamat] = useState("");
  const [linkMap, setLinkMap] = useState("");
  const [noHp, setNoHp] = useState("");
  const [wa, setWa] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [menuOpen, setMenuOpen] = useState(null);
  const [localEditId, setLocalEditId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setNamaCabang("");
    setAlamat("");
    setLinkMap("");
    setNoHp("");
    setWa("");
    setLocalEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      nama_cabang: namaCabang,
      alamat_cabang: alamat,
      link_map: linkMap,
      no_hp: noHp,
      link_whatsapp: wa,
    };

    try {
      if (localEditId) {
        await patchItem(localEditId, payload);
        setMessage("Berhasil memperbarui lokasi.");
      } else {
        await createItem(payload);
        setMessage("Berhasil menambahkan lokasi.");
      }

      resetForm();
      fetchItems();
    } catch (err) {
      setMessage(err.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setLocalEditId(item.id);
    setNamaCabang(item.nama_cabang || "");
    setAlamat(item.alamat_cabang || "");
    setLinkMap(item.link_map || "");
    setNoHp(item.no_hp || "");
    setWa(item.link_whatsapp || "");
    setMenuOpen(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus lokasi ini?")) return;
    try {
      await deleteItem(id);
      fetchItems();
    } catch (err) {
      alert(err.message || "Gagal menghapus lokasi.");
    }
  };

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
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-[#3e146d]/20">
        <h2 className="text-2xl font-bold text-center text-[#3e146d] mb-6">
          {localEditId ? "Edit Lokasi" : "Tambah Lokasi Baru"}
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nama Cabang"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#3e146d]"
            value={namaCabang}
            onChange={(e) => setNamaCabang(e.target.value)}
          />

          <input
            type="text"
            placeholder="Alamat Cabang"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#3e146d]"
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
          />

          <input
            type="text"
            placeholder="Link Google Maps"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#3e146d]"
            value={linkMap}
            onChange={(e) => setLinkMap(e.target.value)}
          />

          <input
            type="text"
            placeholder="No HP"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#3e146d]"
            value={noHp}
            onChange={(e) => setNoHp(e.target.value)}
          />

          <input
            type="text"
            placeholder="Link WhatsApp"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#3e146d]"
            value={wa}
            onChange={(e) => setWa(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-[#3e146d] text-white font-semibold py-2 rounded-lg shadow-md hover:opacity-90 transition disabled:opacity-50"
            disabled={saving}
          >
            {saving ? "Menyimpan..." : localEditId ? "Simpan Perubahan" : "Tambah"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-[#3e146d]">{message}</p>
        )}
      </div>

      <div className="w-full max-w-md mt-8 flex flex-col gap-3">
        {loading ? (
          <p className="text-center text-gray-500">Memuat...</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="p-4 border rounded-2xl shadow-sm bg-white hover:shadow-md transition relative"
            >
              {/* Menu tombol kanan atas */}
              <button
                onClick={() =>
                  setMenuOpen(menuOpen === item.id ? null : item.id)
                }
                className="absolute right-3 top-3 p-2 rounded hover:bg-gray-100"
              >
                <MoreVertical size={20} />
              </button>

              {menuOpen === item.id && (
                <div className="absolute right-3 top-12 bg-white border shadow-md rounded-lg w-32 z-20">
                  <button
                    className="w-full px-3 py-2 hover:bg-gray-100 text-left"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="w-full px-3 py-2 hover:bg-gray-100 text-left text-red-600"
                    onClick={() => handleDelete(item.id)}
                  >
                    Hapus
                  </button>
                </div>
              )}

              {/* Nama Cabang */}
              <h2 className="font-bold text-[#3e146d] text-center mb-2">
                {item.nama_cabang?.toUpperCase() || "(Tanpa nama cabang)"}
              </h2>

              {/* Alamat */}
              <div className="flex items-start gap-2 mb-2">
                <FiMapPin className="text-gray-500 text-xl mt-1" />
                <p className="font-semibold text-gray-600 text-lg whitespace-pre-wrap break-words">
                  {item.alamat_cabang || "(Tanpa alamat)"}
                </p>
              </div>

              {/* No HP */}
              {item.no_hp && (
                <div className="flex items-center gap-2 mb-2">
                  <FiPhone className="text-gray-500 text-lg" />
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
          ))
        )}
      </div>
    </div>
  );
}

export default LokasiKontakPage;