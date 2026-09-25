"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types";

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout to prevent memory leaks if component unmounts
  useEffect(() => {
    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  // Show the scrollbar when scrolling, hide it 2 seconds after stopping
  const handleScroll = () => {
    setIsScrolling(true);
    
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 2000);
  };

  // Only show active categories on the storefront
  const activeCategories = categories.filter(cat => cat.is_active !== 0 && cat.is_active !== false);

  if (activeCategories.length === 0) {
    return (
      <div className="text-center py-6 bg-white rounded-xl border border-dashed border-gray-200">
        <p className="text-gray-500 text-sm">No categories found. Add some in the admin dashboard.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Horizontal scrolling container with dynamic RED scrollbar visibility */}
      <div 
        onScroll={handleScroll}
        className={`flex overflow-x-auto gap-2 md:gap-4 pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full transition-all duration-300 ${
          isScrolling 
            ? '[&::-webkit-scrollbar-thumb]:bg-red-500/60' 
            : '[&::-webkit-scrollbar-thumb]:bg-transparent'
        }`}
      >
        {activeCategories.map((cat) => (
          <Link 
            href={`/category/${cat.slug}`} 
            key={cat.id} 
            className="group relative flex-shrink-0 w-28 h-32 md:w-36 md:h-44 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-red-200 transition-all snap-start bg-white border border-gray-100 flex flex-col p-2"
          >
            {/* Image Container - Highly compact with object-contain */}
            <div className="relative flex-1 w-full h-full mb-1">
              {cat.image_url ? (
                <Image 
                  src={cat.image_url} 
                  alt={cat.name} 
                  fill 
                  className="object-contain transition-transform duration-300 group-hover:-translate-y-1" 
                  sizes="(max-width: 768px) 112px, 144px" 
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-medium text-gray-400">No img</span>
                </div>
              )}
            </div>

            {/* Category Name */}
            <div className="text-center mt-auto">
              <h3 className="font-bold text-gray-900 text-xs md:text-sm leading-tight group-hover:text-red-600 transition-colors line-clamp-1">
                {cat.name}
              </h3>
            </div>
          </Link>
        ))}

      </div>
    </div>
  );
}
