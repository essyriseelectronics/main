"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImage } from "@/types";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const lightboxScrollRef = useRef<HTMLDivElement>(null);
  const thumbContainerRef = useRef<HTMLDivElement>(null);

  // 1. Lock body scroll when Lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isLightboxOpen]);

  // 2. Auto-center the active thumbnail
  useEffect(() => {
    if (thumbContainerRef.current && thumbContainerRef.current.children[activeIndex]) {
      const activeThumb = thumbContainerRef.current.children[activeIndex] as HTMLElement;
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeIndex]);

  // 3. Sync Lightbox initial position when opened
  useEffect(() => {
    if (isLightboxOpen && lightboxScrollRef.current) {
      lightboxScrollRef.current.scrollLeft = activeIndex * lightboxScrollRef.current.clientWidth;
    }
  }, [isLightboxOpen]);

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full aspect-[4/5] md:aspect-square bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-gray-400">
        <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
        <span className="text-sm font-medium">No image available</span>
      </div>
    );
  }

  // Handle Swipe on Main Gallery
  const handleMainScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const idx = Math.round(target.scrollLeft / target.clientWidth);
    if (idx !== activeIndex) setActiveIndex(idx);
  };

  // Handle Swipe on Lightbox (and sync background)
  const handleLightboxScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const idx = Math.round(target.scrollLeft / target.clientWidth);
    if (idx !== activeIndex) {
      setActiveIndex(idx);
      if (mainScrollRef.current) {
        mainScrollRef.current.scrollLeft = idx * mainScrollRef.current.clientWidth;
      }
    }
  };

  // Click to navigate
  const scrollTo = (index: number) => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({
        left: index * mainScrollRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      
      {/* ======================= */}
      {/*   MAIN SWIPE GALLERY    */}
      {/* ======================= */}
      <div className="relative w-full bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden group">
        
        {/* Swipeable Container */}
        <div 
          ref={mainScrollRef}
          onScroll={handleMainScroll}
          className="flex w-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {images.map((img, idx) => (
            <div 
              key={img.id} 
              onClick={() => setIsLightboxOpen(true)}
              className="relative w-full flex-shrink-0 snap-center aspect-[4/5] md:aspect-square cursor-zoom-in"
            >
              {img.image_url ? (
                <Image 
                  src={img.image_url} 
                  alt={img.alt_text || `${productName} image ${idx + 1}`} 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover" 
                  priority={idx === 0} 
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <ImageIcon className="w-12 h-12 text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Floating Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full pointer-events-none">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* ======================= */}
      {/*       THUMBNAILS        */}
      {/* ======================= */}
      {images.length > 1 && (
        <div 
          ref={thumbContainerRef}
          className="flex gap-3 overflow-x-auto pb-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => scrollTo(idx)}
              className={cn(
                "relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all snap-center bg-gray-50",
                activeIndex === idx ? "border-[#0076c0] shadow-md ring-2 ring-blue-100" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              {img.image_url && (
                <Image 
                  src={img.image_url} 
                  alt={`Thumbnail ${idx + 1}`} 
                  fill
                  sizes="80px"
                  className="object-cover" 
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* ======================= */}
      {/*   FULLSCREEN LIGHTBOX   */}
      {/* ======================= */}
      <div 
        className={cn(
          "fixed inset-0 z-[99999] bg-black/95 flex flex-col transition-all duration-300",
          isLightboxOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
      >
        {/* Lightbox Header */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
          <div className="text-white text-sm font-medium">
            {activeIndex + 1} of {images.length}
          </div>
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Lightbox Swipeable Container */}
        <div 
          ref={lightboxScrollRef}
          onScroll={handleLightboxScroll}
          className="flex-1 flex w-full h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] items-center"
        >
          {images.map((img, idx) => (
            <div key={`lb-${img.id}`} className="relative w-full h-full flex-shrink-0 snap-center flex items-center justify-center p-4 md:p-12">
               {img.image_url && (
                <Image 
                  src={img.image_url} 
                  alt={`${productName} fullscreen ${idx + 1}`} 
                  fill
                  sizes="100vw"
                  className="object-contain" 
                />
              )}
            </div>
          ))}
        </div>

        {/* Lightbox Desktop Navigation Controls (Hidden on mobile) */}
        {images.length > 1 && (
          <>
            <button 
              onClick={() => {
                if (lightboxScrollRef.current) {
                  lightboxScrollRef.current.scrollTo({ left: (activeIndex - 1) * lightboxScrollRef.current.clientWidth, behavior: 'smooth' });
                }
              }}
              className={cn(
                "hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all",
                activeIndex === 0 && "opacity-0 pointer-events-none"
              )}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button 
              onClick={() => {
                if (lightboxScrollRef.current) {
                  lightboxScrollRef.current.scrollTo({ left: (activeIndex + 1) * lightboxScrollRef.current.clientWidth, behavior: 'smooth' });
                }
              }}
              className={cn(
                "hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all",
                activeIndex === images.length - 1 && "opacity-0 pointer-events-none"
              )}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}
      </div>

    </div>
  );
}
