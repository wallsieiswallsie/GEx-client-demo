import { useEffect, useRef } from "react";

import {
    BrowserMultiFormatReader,
} from "@zxing/browser";

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
                // QR
                BarcodeFormat.QR_CODE,

                // BARCODE RESI
                BarcodeFormat.CODE_128,
                BarcodeFormat.CODE_39,
                BarcodeFormat.CODE_93,

                // MARKETPLACE / LOGISTIC
                BarcodeFormat.EAN_13,
                BarcodeFormat.EAN_8,

                BarcodeFormat.ITF,

                BarcodeFormat.UPC_A,
                BarcodeFormat.UPC_E,

                BarcodeFormat.CODABAR,
            ]
        );

        const codeReader =
            new BrowserMultiFormatReader(
                hints,
                {
                    delayBetweenScanAttempts: 30,
                }
            );

        codeReaderRef.current = codeReader;

        let isScanned = false;

        const constraints = {
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

                focusMode: "continuous",
            },
        };

        codeReader
            .decodeFromConstraints(
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
                        }, 150);
                    }
                }
            )
            .catch((err) => {
                console.error(
                    "Scanner error:",
                    err
                );
            });

        return () => {
            try {
                codeReader.reset();
            } catch (e) { }
        };
    }, [active]);
};