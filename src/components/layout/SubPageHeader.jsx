import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SubPageHeader({ title, subtitle, rightAction }) {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between mb-4 lg:mb-6">

            {/* LEFT: BACK + TITLE */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-xl hover:bg-gray-200 transition"
                >
                    <ArrowLeft size={22} className="text-gray-700" />
                </button>

                <div>
                    <h1 className="text-lg font-semibold text-gray-800 lg:text-2xl">
                        {title}
                    </h1>

                    {subtitle && (
                        <p className="mt-1 text-xs text-gray-500 lg:text-sm">
                            {subtitle}
                        </p>
                    )}
                </div>
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
