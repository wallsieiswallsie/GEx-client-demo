import React, {
    useEffect,
    useRef,
} from "react";

import { useScanner } from "../../hooks/useScanner";

function ScannerModal({
    open,
    onClose,
    onResult,
}) {
    const videoRef = useRef(null);

    useScanner({
        active: open,
        videoRef,

        onScan: (text) => {
            onResult(text);

            onClose();
        },
    });

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (open) {
            window.addEventListener(
                "keydown",
                handleEsc
            );
        }

        return () => {
            window.removeEventListener(
                "keydown",
                handleEsc
            );
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">

            {/* HEADER */}
            <div className="flex items-center justify-between p-4 text-white border-b border-white/20">
                <h2 className="text-lg font-semibold">
                    Scan Resi
                </h2>

                <button
                    onClick={onClose}
                    className="text-2xl"
                >
                    ✕
                </button>
            </div>

            {/* CAMERA */}
            <div className="flex-1 relative overflow-hidden">
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                    autoPlay
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/40" />

                {/* SCAN AREA */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-80 h-24 border-2 border-orange-400 rounded-xl overflow-hidden bg-transparent">

                        {/* ANIMATION */}
                        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-orange-400 animate-pulse" />

                        {/* CORNERS */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-lg" />

                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-lg" />

                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-lg" />

                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-lg" />
                    </div>
                </div>

                {/* TEXT */}
                <div className="absolute bottom-10 left-0 right-0 text-center px-4">
                    <p className="text-white text-sm">
                        Arahkan barcode resi ke area scan
                    </p>
                </div>
            </div>

            {/* FOOTER */}
            <div className="p-4 border-t border-white/20">
                <button
                    onClick={onClose}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium"
                >
                    Tutup Scanner
                </button>
            </div>
        </div>
    );
}

export default ScannerModal;