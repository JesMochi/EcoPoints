"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRGeneratorProps {
  data: string;
  size?: number;
  label?: string;
}

export function QRGenerator({ data, size = 220, label }: QRGeneratorProps) {
  return (
    <div className="inline-flex flex-col items-center gap-3">
      <div className="bg-white p-5 rounded-2xl border-2 border-eco-100 shadow-sm">
        <QRCodeSVG
          value={data}
          size={size}
          level="M"
          includeMargin={false}
          bgColor="#ffffff"
          fgColor="#14532d"
        />
      </div>
      {label && (
        <p className="text-xs text-gray-500 text-center max-w-[220px]">{label}</p>
      )}
    </div>
  );
}
