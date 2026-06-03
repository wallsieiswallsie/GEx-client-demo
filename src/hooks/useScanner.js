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
        if (!active || !videoRef.current) return;

        let isMounted = true;
        let isScanned = false;

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

        const codeReader =
            new BrowserMultiFormatReader(hints);

        codeReader.setHints?.(hints);

        codeReaderRef.current = codeReader;

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
                    (result) => {
                        if (
                            result &&
                            !isScanned &&
                            isMounted
                        ) {
                            isScanned = true;

                            const text =
                                result.getText();

                            onScan(text);

                            stopScanner();
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

        const stopScanner = async () => {
            try {
                codeReader.reset();

                const stream =
                    videoRef.current?.srcObject;

                if (stream) {
                    stream
                        .getTracks()
                        .forEach((track) =>
                            track.stop()
                        );

                    videoRef.current.srcObject =
                        null;
                }
            } catch (err) {
                console.error(
                    "Stop scanner error:",
                    err
                );
            }
        };

        startScanner();

        return () => {
            isMounted = false;

            stopScanner();
        };
    }, [active, videoRef, onScan]);
};
