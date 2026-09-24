'use client'

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // <-- We are adding this to break out of the header
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronRight, ChevronDown, ShoppingCart, Search, ImageIcon, User, Heart } from 'lucide-react';
import { Category } from '@/types';

export default function ClientMobileNav({ categories }: { categories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // Used to safely mount the Portal

  // 1. Mark component as mounted on client to enable the Portal
  // 2. Prevent body scrolling when open
  useEffect(() => {
    setMounted(true);
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // The actual Drawer UI we will teleport to the document body
  const drawerContent = (
    <div 
      className={`fixed inset-0 z-[9999] flex md:hidden transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Dark Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/60" 
        onClick={() => setIsOpen(false)} 
      />

      {/* Drawer Panel - Slides in from the left */}
      <div 
        className={`relative w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Link href="/" onClick={() => setIsOpen(false)} className="outline-none select-none flex flex-col items-start">
            <span className="text-xl font-extrabold text-black tracking-tight leading-none">ESSYRISE</span>
            <span className="text-[8px] font-semibold text-gray-400 tracking-[0.2em] uppercase mt-1 leading-none">electronics</span>
          </Link>
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-1 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer active:scale-90 transition-transform"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Drawer Links */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="flex flex-col py-2">
            <Link href="/" onClick={() => setIsOpen(false)} className="px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50">
              Home
            </Link>

            {/* Category Accordion */}
            <button 
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center justify-between w-full px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50 cursor-pointer"
            >
              Shop by Category 
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Collapsible Categories */}
            <div 
              className={`bg-gray-50 flex flex-col border-y border-gray-100 overflow-hidden transition-all duration-300 ${
                isCategoryOpen ? 'max-h-[500px] py-1 opacity-100' : 'max-h-0 py-0 opacity-0 border-transparent'
              }`}
            >
              {categories.length === 0 ? (
                <span className="px-8 py-3 text-sm text-gray-500">No categories found</span>
              ) : (
                categories.map((cat) => (
                  <Link 
                    key={cat.slug} 
                    href={`/category/${cat.slug}`} 
                    onClick={() => setIsOpen(false)} 
                    className="px-6 py-2.5 text-[14px] text-gray-700 font-medium hover:text-[#0076c0] flex items-center justify-between hover:bg-gray-100/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0 p-0.5 shadow-xs">
                        {cat.image_url ? (
                          <Image src={cat.image_url} alt={cat.name} width={28} height={28} className="object-contain w-full h-full" />
                        ) : (
                          <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
                        )}
                      </div>
                      <span className="truncate">{cat.name}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-50 flex-shrink-0" />
                  </Link>
                ))
              )}
            </div>

            <Link href="/shop" onClick={() => setIsOpen(false)} className="px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50">
              View All
            </Link>
          </div>

          <div className="border-t border-gray-100 py-2">
            <Link href="/cart" onClick={() => setIsOpen(false)} className="flex items-center justify-between px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-emerald-600" />
                <span>Cart</span>
              </div>
              <span className="text-gray-400 text-sm">0 Items</span>
            </Link>
            <Link href="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50">
              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
              <span>Lists</span>
            </Link>
          </div>
        </div>

        {/* Drawer Footer Buttons */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between gap-3 bg-white mb-2">
          <Link href="/login" onClick={() => setIsOpen(false)} className="flex-1 flex items-center justify-center gap-2 bg-[#0076c0] text-white px-4 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition-colors">
            <User className="h-5 w-5 fill-white" /> Login
          </Link>
          <Link href="/register" onClick={() => setIsOpen(false)} className="flex-1 text-center text-[#0076c0] px-4 py-2.5 font-bold hover:bg-blue-50 rounded-full transition-colors">
            Register
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="flex md:hidden items-center justify-between h-14 w-full relative z-50">
        <div className="flex-none">
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(true);
            }}
            className="p-2 -ml-2 text-gray-800 focus:outline-none cursor-pointer active:scale-90 transition-transform"
            aria-label="Open Menu"
          >
            <Menu className="h-7 w-7" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 flex justify-center">
          <Link href="/" className="outline-none select-none flex flex-col items-center">
            <span className="text-xl font-extrabold text-black tracking-tight leading-none">ESSYRISE</span>
            <span className="text-[8px] font-semibold text-gray-400 tracking-[0.2em] uppercase mt-1 leading-none">electronics</span>
          </Link>
        </div>

        <div className="flex-none flex items-center gap-3">
          <button className="text-gray-700 hover:text-black p-1 active:scale-90 transition-transform">
            <Search className="h-6 w-6" strokeWidth={2} />
          </button>
          <Link href="/cart" className="text-gray-700 hover:text-black p-1 relative active:scale-90 transition-transform">
            <ShoppingCart className="h-6 w-6" strokeWidth={2} />
          </Link>
        </div>
      </div>

      {/* Teleport the Drawer completely OUT of the Header trap to the body */}
      {mounted && createPortal(drawerContent, document.body)}
    </>
  );
}
