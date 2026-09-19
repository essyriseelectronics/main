"use client";

import { useState } from "react";
import Image from "next/image";
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
      <div className="relative aspect-[4/5] md:aspect-square w-full bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  const activeImage = images[activeIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* MAIN IMAGE */}
      <div className="relative aspect-[4/5] md:aspect-square w-full bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
        <Image 
          src={activeImage.image_url} 
          alt={activeImage.alt_text || productName} 
          fill 
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* THUMBNAILS (Only show if multiple images) */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all snap-start",
                activeIndex === idx ? "border-brand-primary shadow-md" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image 
                src={img.image_url} 
                alt={`Thumbnail ${idx + 1}`} 
                fill 
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
