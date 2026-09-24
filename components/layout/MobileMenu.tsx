'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronRight, ChevronDown, ShoppingCart, Heart, User, ImageIcon } from 'lucide-react';
import { Category } from '@/types';

type MobileMenuProps = {
  categories: Category[];
};

export default function MobileMenu({ categories = [] }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Lock body scroll when the menu is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Trigger Button */}
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 text-gray-900 active:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        aria-label="Open Navigation Menu"
      >
        <Menu className="h-7 w-7 pointer-events-none" strokeWidth={2.5} />
      </button>

      {/* Full-Screen Overlay Container */}
      <div 
        className={`fixed inset-0 z-[99999] transition-all duration-300 ${
          isOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Dark Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60"
          onClick={() => setIsOpen(false)} 
        />

        {/* Sliding Drawer */}
        <div 
          className={`absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <Link href="/" onClick={() => setIsOpen(false)} className="outline-none flex flex-col items-start">
              <span className="text-xl font-extrabold text-black tracking-tight leading-none">ESSYRISE</span>
              <span className="text-[8px] font-semibold text-gray-400 tracking-[0.2em] uppercase mt-1 leading-none">electronics</span>
            </Link>
            <button 
              type="button"
              onClick={() => setIsOpen(false)} 
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="flex flex-col py-2">
              <Link href="/" onClick={() => setIsOpen(false)} className="px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50">
                Home
              </Link>

              {/* Categories Toggle */}
              <button 
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center justify-between w-full px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50"
              >
                Shop by Category 
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Categories List */}
              {isCategoryOpen && (
                <div className="bg-gray-50 flex flex-col border-y border-gray-100 py-1 space-y-1">
                  {categories.length === 0 ? (
                    <span className="px-8 py-3 text-sm text-gray-500">No categories found</span>
                  ) : (
                    categories.map((cat) => (
                      <Link 
                        key={cat.slug} 
                        href={`/category/${cat.slug}`} 
                        onClick={() => setIsOpen(false)} 
                        className="px-6 py-2.5 text-[14px] text-gray-700 font-medium hover:text-[#0076c0] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 p-0.5">
                            {cat.image_url ? (
                              <img src={cat.image_url} alt={cat.name} className="object-contain w-full h-full" loading="lazy" />
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
              )}

              <Link href="/shop" onClick={() => setIsOpen(false)} className="px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50">
                View All
              </Link>
            </div>

            {/* Quick Links */}
            <div className="border-t border-gray-100 py-2">
              <Link href="/cart" onClick={() => setIsOpen(false)} className="flex items-center justify-between px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5 text-emerald-600" />
                  <span>Cart</span>
                </div>
              </Link>
              <Link href="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50">
                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                <span>Lists</span>
              </Link>
            </div>
          </div>

          {/* Drawer Footer Buttons */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between gap-3 bg-white mb-2">
            <Link href="/login" onClick={() => setIsOpen(false)} className="flex-1 flex items-center justify-center gap-2 bg-[#0076c0] text-white px-4 py-2.5 rounded-full font-semibold">
              <User className="h-5 w-5 fill-white" /> Login
            </Link>
            <Link href="/register" onClick={() => setIsOpen(false)} className="flex-1 text-center text-[#0076c0] px-4 py-2.5 font-bold bg-blue-50 hover:bg-blue-100 rounded-full">
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
