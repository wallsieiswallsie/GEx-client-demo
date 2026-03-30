import { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export const useScanner = ({ active, videoRef, onScan }) => {
  const codeReaderRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const codeReader = new BrowserMultiFormatReader(undefined, {
      delayBetweenScanAttempts: 50,
    });

    codeReaderRef.current = codeReader;

    let isScanned = false;

    const constraints = {
      video: {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    };

    codeReader
      .decodeFromConstraints(
        constraints,
        videoRef.current,
        (result, err) => {
          if (result && !isScanned) {
            isScanned = true;

            const text = result.getText();

            // kirim hasil ke parent
            onScan(text);

            // stop camera
            setTimeout(() => {
              try {
                codeReader.reset();
              } catch (e) {}
            }, 100);
          }
        }
      )
      .catch((err) => {
        console.error("Scanner error:", err);
      });

    return () => {
      try {
        codeReader.reset();
      } catch (e) {}
    };
  }, [active]);
};