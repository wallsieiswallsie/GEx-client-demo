import { useEffect, useState } from "react";
import { useCustomerApi } from "../../../hooks/useCustomerApi";
import { MoreVertical, CheckSquare, Square } from "lucide-react";

function SyaratKetentuanPage() {
  const {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    patchItem,
    deleteItem,
  } = useCustomerApi("syaratKetentuan");

  const [listContent, setListContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [localEditId, setLocalEditId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      if (!listContent.trim()) {
        setMessage("Isi Syarat & Ketentuan tidak boleh kosong.");
        setSaving(false);
        return;
      }

      if (localEditId) {
        await patchItem(localEditId, { list: listContent });
        setMessage("Berhasil memperbarui Syarat & Ketentuan.");
        setLocalEditId(null);
      } else {
        await createItem({ list: listContent });
        setListContent("");
        setMessage("Berhasil menambahkan Syarat & Ketentuan.");
      }

      fetchItems();
    } catch (err) {
      setMessage(err.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Checkbox handler
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm("Hapus syarat ketentuan yang dipilih?")) return;

    for (const id of selectedIds) {
      await deleteItem(id);
    }

    setSelectedIds([]);
    setSelectionMode(false);
    fetchItems();
  };

  // ✅ Edit terpilih (hanya 1 item)
  const handleEditSelected = () => {
    if (selectedIds.length !== 1) {
      alert("Pilih 1 item saja untuk edit.");
      return;
    }

    const selected = items.find((i) => i.id === selectedIds[0]);

    setLocalEditId(selected.id);
    setListContent(selected.list);
    setSelectionMode(false);
    setSelectedIds([]);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-[#3e146d]/20">
        <h2 className="text-2xl font-bold text-center text-[#3e146d] mb-6">
          {localEditId ? "Edit Syarat & Ketentuan" : "Tambah Syarat & Ketentuan"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            placeholder="Isi Syarat & Ketentuan"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d] resize-none h-32"
            value={listContent}
            onChange={(e) => setListContent(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#3e146d] text-white font-semibold py-2 rounded-lg shadow-md hover:opacity-90 transition disabled:opacity-50"
          >
            {saving
              ? "Menyimpan..."
              : localEditId
              ? "Simpan Perubahan"
              : "Tambah"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-[#3e146d]">{message}</p>
        )}

        {error && (
          <p className="mt-2 text-center text-sm text-red-500">{error}</p>
        )}
      </div>

      {items.length > 0 && (
        <div className="w-full max-w-md mt-8 flex flex-col gap-3">
          {/* ✅ Header + Menu 3 titik */}
          <div className="flex items-center justify-between mb-2 relative">
            <h3 className="text-lg font-semibold text-[#3e146d]">
              Daftar Syarat & Ketentuan
            </h3>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded hover:bg-gray-100"
            >
              <MoreVertical size={20} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 bg-white border shadow-md rounded-lg w-32 z-20">
                <button
                  className="w-full px-3 py-2 hover:bg-gray-100 text-left"
                  onClick={() => {
                    setSelectionMode(true);
                    setMenuOpen(false);
                  }}
                >
                  Edit
                </button>
                <button
                  className="w-full px-3 py-2 hover:bg-gray-100 text-left text-red-600"
                  onClick={() => {
                    setSelectionMode(true);
                    setMenuOpen(false);
                  }}
                >
                  Hapus
                </button>
              </div>
            )}
          </div>

          {/* ✅ Tombol aksi selection */}
          {selectionMode && (
            <div className="flex gap-2 mb-2">
              <button
                onClick={handleEditSelected}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm"
              >
                Edit Terpilih
              </button>
              <button
                onClick={handleDeleteSelected}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm"
              >
                Hapus Terpilih
              </button>
              <button
                onClick={() => {
                  setSelectionMode(false);
                  setSelectedIds([]);
                }}
                className="px-3 py-2 bg-gray-300 rounded-lg text-sm"
              >
                Batal
              </button>
            </div>
          )}

          {loading ? (
            <p className="text-center text-gray-500">Memuat...</p>
          ) : (
            items.map((item, index) => (
              <div
                key={item.id}
                className="p-3 border rounded-lg shadow-sm hover:shadow-md transition bg-white w-full flex gap-2"
              >
                {/* ✅ Checkbox */}
                {selectionMode ? (
                  <button onClick={() => toggleSelect(item.id)}>
                    {selectedIds.includes(item.id) ? (
                      <CheckSquare className="text-[#3e146d]" />
                    ) : (
                      <Square />
                    )}
                  </button>
                ) : (
                  <span className="font-semibold text-[#3e146d]">
                    {index + 1}.
                  </span>
                )}

                <p className="text-gray-700 break-words whitespace-pre-wrap flex-1">
                  {item.list}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default SyaratKetentuanPage;