"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { ProductImage } from "@/types";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Fallback if no images are provided
  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[4/5] md:aspect-square w-full bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-gray-400">
        <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
        <span className="text-sm font-medium">No image available</span>
      </div>
    );
  }

  const activeImage = images[activeIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* MAIN IMAGE */}
      <div className="relative aspect-[4/5] md:aspect-square w-full bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center">
        {activeImage?.image_url ? (
          <Image src={activeImage.image_url} alt={activeImage.alt_text || productName} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
        ) : (
          <ImageIcon className="w-12 h-12 text-gray-300" />
        )}
      </div>

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all snap-start bg-gray-50",
                activeIndex === idx ? "border-brand-primary shadow-md" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              {img.image_url && <Image src={img.image_url} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" sizes="80px" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
