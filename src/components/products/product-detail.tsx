"use client";

import { useState } from "react";
import { SafeImage } from "@/components/shared/safe-image";
import { cleanImageUrl } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const cleaned = images.map(cleanImageUrl).filter(Boolean);
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-3">
      <SafeImage
        key={cleaned[selected] ?? "empty"}
        src={cleaned[selected]}
        alt={title}
        className="aspect-square w-full rounded-lg border object-cover"
      />

      {cleaned.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {cleaned.map((url, index) => (
            <button
              key={url + index}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Show image ${index + 1} of ${cleaned.length}`}
              aria-current={index === selected}
              className={`overflow-hidden rounded-md border-2 ${
                index === selected ? "border-brand" : "border-transparent"
              }`}
            >
              <SafeImage
                src={url}
                alt={`${title}, view ${index + 1}`}
                className="aspect-square w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}