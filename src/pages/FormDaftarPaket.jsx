import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
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

    const handleSubmit = () => {
        const filtered = fields.filter((f) => f.trim() !== "");
        console.log("Submit:", filtered);
    };

    const isAnyFilled = fields.some((f) => f.trim() !== "");

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
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
                        Daftarkan Paketmu
                    </h1>
                </div>

                {/* HERO */}
                <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        Daftarkan Paketmu
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Tambahkan nomor resi untuk mulai tracking
                    </p>

                    {/* ilustrasi dummy */}
                    <div className="my-6 flex justify-center">
                        <div className="w-40 h-40 bg-gradient-to-br from-blue-100 to-red-100 rounded-3xl flex items-center justify-center shadow-inner">
                            <span className="text-4xl">📦</span>
                        </div>
                    </div>

                    <h3 className="text-gray-800 font-semibold text-lg">
                        Belum ada paket.
                    </h3>
                    <p className="text-gray-500 text-sm">
                        Masukkan nomor resi untuk mulai.
                    </p>
                </div>

                {/* CARD FORM */}
                <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-4">

                    <label className="text-gray-800 font-medium mb-2 block">
                        Nomor Resi
                    </label>

                    <div className="flex flex-col gap-3">
                        {fields.map((field, index) => (
                            <input
                                key={index}
                                type="text"
                                value={field}
                                onChange={(e) => handleChange(index, e.target.value)}
                                placeholder="Contoh: JNE1234567890"
                                className="w-full px-4 py-3 rounded-2xl border border-blue-200 
                focus:outline-none focus:ring-2 focus:ring-blue-800
                transition bg-gray-50"
                            />
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
              ${isAnyFilled
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