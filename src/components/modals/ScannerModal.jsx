import React, { useRef } from "react";

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

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">

            {/* HEADER */}
            <div className="p-4 text-white flex justify-between">
                <span>Scan Resi</span>

                <button onClick={onClose}>
                    ✕
                </button>
            </div>

            {/* CAMERA */}
            <div className="flex-1 relative">
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                    autoPlay
                />

                {/* FRAME */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-80 h-24 border-2 border-red-500 rounded-lg relative overflow-hidden">
                        <div className="absolute w-full h-[2px] bg-orange-400 animate-pulse top-1/2" />
                    </div>
                </div>

                <p className="absolute bottom-10 w-full text-center text-white text-sm">
                    Scan the waybill barcode
                </p>
            </div>

            {/* CLOSE */}
            <button
                onClick={onClose}
                className="p-4 bg-red-600 text-white"
            >
                Tutup
            </button>
        </div>
    );
}

export default ScannerModal;