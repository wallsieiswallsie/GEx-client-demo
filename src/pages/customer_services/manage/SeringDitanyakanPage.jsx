import { useEffect, useState } from "react";
import { useCustomerApi } from "../../../hooks/useCustomerApi";
import { MoreVertical } from "lucide-react";

function SeringDitanyakanPage() {
  const {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    patchItem,
    deleteItem,
  } = useCustomerApi("seringDitanyakan");

  const [pertanyaan, setPertanyaan] = useState("");
  const [jawaban, setJawaban] = useState("");
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setPertanyaan("");
    setJawaban("");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = { pertanyaan, jawaban };

    try {
      if (editId) {
        await patchItem(editId, payload);
      } else {
        await createItem(payload);
      }
      resetForm();
      fetchItems();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setPertanyaan(item.pertanyaan);
    setJawaban(item.jawaban);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus pertanyaan ini?")) return;
    try {
      await deleteItem(id);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-10">
      {/* FORM */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-[#3e146d]/20 mb-6">
        <h2 className="text-2xl font-bold text-center text-[#3e146d] mb-6">
          Sering Ditanyakan
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Masukkan pertanyaan..."
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#3e146d]"
            value={pertanyaan}
            onChange={(e) => setPertanyaan(e.target.value)}
            required
          />

          <textarea
            placeholder="Masukkan jawaban..."
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#3e146d] h-28"
            value={jawaban}
            onChange={(e) => setJawaban(e.target.value)}
            required
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#3e146d] text-white font-semibold py-2 rounded-lg shadow-md hover:opacity-90 transition disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : editId ? "Update" : "Tambah"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 border border-gray-400 text-gray-700 font-semibold py-2 rounded-lg shadow-sm hover:bg-gray-50 transition"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LIST FAQ */}
      <div className="w-full max-w-md flex flex-col gap-3">
        {loading ? (
          <p className="text-center text-gray-500">Memuat...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada data FAQ.</p>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id}
              className="p-4 border rounded-2xl shadow-sm bg-white w-full relative"
            >
              {/* DROPDOWN EDIT/DELETE */}
              <div className="absolute top-3 right-3">
                <DropdownActions
                  onEdit={() => handleEdit(item)}
                  onDelete={() => handleDelete(item.id)}
                />
              </div>

              <div className="flex gap-2">
                <span className="font-semibold text-[#3e146d]">{index + 1}.</span>
                <span className="flex-1">
                  <p className="text-gray-700 break-words whitespace-pre-wrap font-semibold">
                    {item.pertanyaan}
                  </p>
                  <p className="text-gray-700 break-words whitespace-pre-wrap mt-1">
                    {item.jawaban}
                  </p>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* DROPDOWN ACTIONS */
function DropdownActions({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <MoreVertical
        className="cursor-pointer"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-32 z-10">
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="block w-full px-3 py-2 text-left hover:bg-gray-100"
          >
            Edit
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="block w-full px-3 py-2 text-left text-red-600 hover:bg-red-50"
          >
            Hapus
          </button>
        </div>
      )}
    </div>
  );
}

export default SeringDitanyakanPage;