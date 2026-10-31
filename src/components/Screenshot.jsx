"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Ekran görüntüsü gösterici.
 *
 * Dosya `public/` altında henüz yoksa (ya da yüklenemezse) kırık görsel yerine
 * hangi dosyanın beklendiğini söyleyen bir yer tutucu gösterir. Görsel eklendiği
 * anda kod değişikliği gerekmeden otomatik olarak görünür.
 */
export default function Screenshot({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  placeholderLabel,
  // fill modunda tarayıcının gereğinden büyük (100vw) görsel istememesi için
  sizes = "(min-width: 1024px) 50vw, 100vw",
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-teal-200 bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-6 text-center ${fill ? "absolute inset-0" : ""} ${className}`}
        style={fill ? undefined : { width, height }}
      >
        <span className="text-3xl" aria-hidden="true">🖼️</span>
        <p className="text-sm font-semibold text-gray-600">
          {placeholderLabel || alt}
        </p>
        {src && (
          <code className="text-[11px] text-gray-400 break-all">public{src}</code>
        )}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill || undefined}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
