import { useState } from "react";
import { ArrowLeft, Plus, Check } from "lucide-react";
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
        // nanti sambungkan ke API
    };

    const isAnyFilled = fields.some((f) => f.trim() !== "");

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className="w-full max-w-md p-4 flex flex-col">

                {/* HEADER */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-xl hover:bg-gray-200 transition"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <h1 className="text-lg font-semibold">Daftarkan Paketmu</h1>
                </div>

                {/* INPUT FIELDS */}
                <div className="flex flex-col gap-3 flex-1">
                    {fields.map((field, index) => (
                        <input
                            key={index}
                            type="text"
                            value={field}
                            onChange={(e) => handleChange(index, e.target.value)}
                            placeholder="Masukkan nomor resi"
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-black/80
                         transition bg-white shadow-sm"
                        />
                    ))}
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-6 flex justify-between items-center">

                    {/* ADD BUTTON */}
                    <button
                        onClick={handleAddField}
                        className="flex items-center justify-center w-12 h-12 rounded-2xl 
                       bg-black text-white shadow-md hover:scale-105 active:scale-95 transition"
                    >
                        <Plus size={20} />
                    </button>

                    {/* SUBMIT BUTTON */}
                    {isAnyFilled && (
                        <button
                            onClick={handleSubmit}
                            className="flex items-center justify-center w-12 h-12 rounded-2xl 
                         bg-green-500 text-white shadow-md hover:scale-105 active:scale-95 transition"
                        >
                            <Check size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}