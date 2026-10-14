"use client";

import { useState } from "react";
import { cleanImageUrl } from "@/lib/utils";

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
}

export function SafeImage({ src, alt, className = "" }: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const url = cleanImageUrl(src);

  if (!url || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-muted text-sm text-muted-foreground ${className}`}
      >
        No image
      </div>
    );
  }

  return (
    
    <img
      src={url}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}