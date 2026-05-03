"use client";

import { useEffect, useRef } from "react";

interface QRScannerProps {
  onScan: (data: string) => void;
}

export function QRScanner({ onScan }: QRScannerProps) {
  const scannerRef = useRef<unknown>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { Html5QrcodeScanner } = await import("html5-qrcode");

      if (!mounted) return;

      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 260, height: 260 },
          rememberLastUsedCamera: true,
          aspectRatio: 1,
        },
        /* verbose= */ false
      );

      scannerRef.current = scanner;

      scanner.render(
        (text: string) => {
          scanner.clear().catch(() => {});
          onScan(text);
        },
        () => {
          // ignore per-frame errors
        }
      );
    };

    init();

    return () => {
      mounted = false;
      (scannerRef.current as { clear?: () => Promise<void> })
        ?.clear?.()
        .catch(() => {});
    };
  }, [onScan]);

  return (
    <div
      id="qr-reader"
      className="w-full [&>div]:border-0 [&_video]:rounded-xl [&_select]:rounded-lg [&_select]:border [&_select]:border-eco-200 [&_select]:text-sm"
    />
  );
}
