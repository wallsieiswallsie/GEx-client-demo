import { useEffect, useRef } from "react";

import { BrowserMultiFormatReader } from "@zxing/browser";

import {
    BarcodeFormat,
    DecodeHintType,
} from "@zxing/library";

export const useScanner = ({
    active,
    videoRef,
    onScan,
}) => {
    const codeReaderRef = useRef(null);

    useEffect(() => {
        if (!active) return;

        const hints = new Map();

        hints.set(
            DecodeHintType.POSSIBLE_FORMATS,
            [
                BarcodeFormat.QR_CODE,

                BarcodeFormat.CODE_128,
                BarcodeFormat.CODE_39,
                BarcodeFormat.CODE_93,

                BarcodeFormat.EAN_13,
                BarcodeFormat.EAN_8,

                BarcodeFormat.ITF,

                BarcodeFormat.UPC_A,
                BarcodeFormat.UPC_E,

                BarcodeFormat.CODABAR,
            ]
        );

        hints.set(
            DecodeHintType.TRY_HARDER,
            true
        );

        // FIX UTAMA:
        // hints harus di-set manual
        // bukan lewat constructor parameter kedua
        const codeReader =
            new BrowserMultiFormatReader();

        codeReader.hints = hints;

        codeReaderRef.current = codeReader;

        let isScanned = false;

        const constraints = {
            audio: false,

            video: {
                facingMode: {
                    ideal: "environment",
                },

                width: {
                    ideal: 1920,
                },

                height: {
                    ideal: 1080,
                },
            },
        };

        const startScanner = async () => {
            try {
                await codeReader.decodeFromConstraints(
                    constraints,
                    videoRef.current,
                    (result, err) => {
                        if (
                            result &&
                            !isScanned
                        ) {
                            isScanned = true;

                            const text =
                                result.getText();

                            onScan(text);

                            setTimeout(() => {
                                try {
                                    codeReader.reset();
                                } catch (e) { }
                            }, 200);
                        }
                    }
                );
            } catch (err) {
                console.error(
                    "Scanner error:",
                    err
                );
            }
        };

        startScanner();

        return () => {
            try {
                codeReader.reset();
            } catch (e) { }
        };
    }, [active]);
};