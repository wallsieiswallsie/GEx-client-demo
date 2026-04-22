import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SubPageHeader({ title, rightAction }) {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between mb-4">

            {/* LEFT: BACK + TITLE */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-xl hover:bg-gray-200 transition"
                >
                    <ArrowLeft size={22} className="text-gray-700" />
                </button>

                <h1 className="text-lg font-semibold text-gray-800">
                    {title}
                </h1>
            </div>

            {/* RIGHT (OPTIONAL ACTION) */}
            {rightAction && (
                <div>
                    {rightAction}
                </div>
            )}
        </div>
    );
}