'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronRight, ChevronDown, ShoppingCart, Heart, User, ImageIcon } from 'lucide-react';
import { Category } from '@/types';
import { useStore } from '@/lib/context/StoreContext';

type MobileMenuProps = {
  categories: Category[];
  user?: { role: string; first_name: string } | null;
};

export default function MobileMenu({ categories = [], user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Bring in the global store for cart & wishlist counts
  const { cartCount, wishlist, isHydrated } = useStore();

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
        className="p-2 -mr-2 text-gray-900 active:bg-gray-100 rounded-lg transition-colors cursor-pointer"
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
          className={`absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <Link href="/" onClick={() => setIsOpen(false)} className="outline-none select-none flex items-center gap-2">
              {/* LOGO IMAGE */}
              <img 
                src="/easy.png" 
                alt="Essyrise Logo" 
                className="w-7 h-7 object-contain"
              />
              
              {/* LOGO TEXT */}
              <div className="flex flex-col items-start">
                <span className="text-xl font-extrabold tracking-tight leading-none flex">
                  <span className="text-red-600">ESSY</span>
                  <span className="text-[#0076c0]">RISE</span>
                </span>
                <span className="text-[8px] font-bold text-[#0076c0] tracking-[0.2em] uppercase mt-0.5 leading-none">
                  electronics
                </span>
              </div>
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

            {/* Quick Links with Live Badges */}
            <div className="border-t border-gray-100 py-2">
              <Link href="/cart" onClick={() => setIsOpen(false)} className="flex items-center justify-between px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5 text-[#0076c0]" />
                  <span>Cart</span>
                </div>
                {isHydrated && cartCount > 0 && (
                  <span className="bg-[#0076c0] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link href="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center justify-between px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                  <span>Lists</span>
                </div>
                {isHydrated && wishlist.length > 0 && (
                  <span className="bg-red-50 text-red-600 border border-red-100 text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Drawer Footer Buttons */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between gap-3 bg-white mb-2">
            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Link href="/admin" onClick={() => setIsOpen(false)} className="flex-1 text-center text-red-600 px-4 py-2.5 font-bold bg-red-50 hover:bg-red-100 rounded-full">
                    Admin
                  </Link>
                )}
                <Link href="/profile" onClick={() => setIsOpen(false)} className="flex-[2] flex items-center justify-center gap-2 bg-[#0076c0] text-white px-4 py-2.5 rounded-full font-semibold">
                  <User className="h-5 w-5 fill-white" /> My Account
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)} className="flex-1 flex items-center justify-center gap-2 bg-[#0076c0] text-white px-4 py-2.5 rounded-full font-semibold">
                  <User className="h-5 w-5 fill-white" /> Login
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="flex-1 text-center text-[#0076c0] px-4 py-2.5 font-bold bg-blue-50 hover:bg-blue-100 rounded-full">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
