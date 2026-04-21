import { useState } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FormDaftarPaket() {
  const navigate = useNavigate();
  const [fields, setFields] = useState([""]);

  const handleChange = (index, value) => {
    if (value.length > 20) return;

    const newFields = [...fields];
    newFields[index] = value;
    setFields(newFields);
  };

  const handleAddField = () => {
    setFields([...fields, ""]);
  };

  const handleRemoveField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);

    // minimal 1 field biar UX aman
    if (newFields.length === 0) {
      setFields([""]);
    } else {
      setFields(newFields);
    }
  };

  const handleSubmit = () => {
    const filtered = fields.filter((f) => f.trim() !== "");
    console.log("Submit:", filtered);
  };

  const isAnyFilled = fields.some((f) => f.trim() !== "");

  return (
    <div
      className="min-h-screen bg-gray-50 flex justify-center bg-no-repeat bg-center bg-contain"
      style={{
        backgroundImage: "url('./public/images/empty-package.png')",
      }}
    >
      <div className="w-full max-w-md px-4 py-6 flex flex-col">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-gray-200 transition"
          >
            <ArrowLeft size={22} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">
            Daftarkan Paket
          </h1>
        </div>

        {/* FORM CARD */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg border border-gray-100 p-4">

          <label className="text-gray-800 font-medium mb-2 block">
            Nomor Resi
          </label>

          <div className="flex flex-col gap-3">
            {fields.map((field, index) => (
              <div key={index} className="relative">
                <input
                  type="text"
                  value={field}
                  onChange={(e) => handleChange(index, e.target.value)}
                  placeholder="Contoh: GEX1234567890"
                  className="w-full px-4 py-3 pr-10 rounded-2xl border border-blue-200 
                  focus:outline-none focus:ring-2 focus:ring-blue-800
                  transition bg-gray-50"
                />

                {/* DELETE BUTTON */}
                <button
                  onClick={() => handleRemoveField(index)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 
                  text-gray-400 hover:text-red-500 transition"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* ADD FIELD */}
          <button
            onClick={handleAddField}
            className="flex items-center gap-2 text-blue-900 mt-4 text-sm font-medium hover:opacity-80 transition"
          >
            <Plus size={18} />
            Tambah resi lain
          </button>

          <hr className="my-4 border-gray-100" />

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            disabled={!isAnyFilled}
            className={`w-full py-3 rounded-2xl font-semibold text-white shadow-md transition
              ${
                isAnyFilled
                  ? "bg-gradient-to-r from-blue-900 to-red-700 hover:opacity-90"
                  : "bg-gray-300 cursor-not-allowed"
              }
            `}
          >
            Daftarkan Paket
          </button>
        </div>
      </div>
    </div>
  );
}