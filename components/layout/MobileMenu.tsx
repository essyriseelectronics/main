// app/components/layout/MobileMenu.tsx
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronRight, ShoppingCart, Heart, User } from 'lucide-react';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <>
      {/* Trigger Button - Matches the mobile header UI */}
      <button onClick={() => setIsOpen(true)} className="p-1 text-gray-800 focus:outline-none">
        <Menu className="h-7 w-7" strokeWidth={2.5} />
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Dark transparent background */}
          <div 
            className="absolute inset-0 bg-black/60 transition-opacity" 
            onClick={() => setIsOpen(false)} 
          />

          {/* Drawer Content - Sliding from LEFT */}
          <div className="relative w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-1.5 outline-none select-none">
                <span className="text-xl font-extrabold text-black tracking-tight">kabale</span>
                <span className="bg-[#0076c0] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">online</span>
              </Link>
              <button onClick={() => setIsOpen(false)} className="p-1 text-gray-500 hover:bg-gray-100 rounded-lg">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="flex-1 overflow-y-auto bg-white">
              <div className="flex flex-col py-2">
                <Link href="/" onClick={() => setIsOpen(false)} className="px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50">
                  Home
                </Link>
                <button className="flex items-center justify-between w-full px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50">
                  Shop by Category <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
                <Link href="/shop" onClick={() => setIsOpen(false)} className="px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50">
                  View All
                </Link>
                <Link href="/shops" onClick={() => setIsOpen(false)} className="px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50">
                  Browse Shops
                </Link>
                <Link href="/create-store" onClick={() => setIsOpen(false)} className="px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50">
                  Create Store
                </Link>
                <Link href="/orders" onClick={() => setIsOpen(false)} className="px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50">
                  Orders
                </Link>
                <button className="flex items-center justify-between w-full px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50">
                  My Account <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>

              <div className="border-t border-gray-100 py-2">
                <Link href="/cart" onClick={() => setIsOpen(false)} className="flex items-center justify-between px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5 text-emerald-600" />
                    <span>Cart</span>
                  </div>
                  <span className="text-gray-400 text-sm">0 Items</span>
                </Link>
                <Link href="/lists" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50">
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
      )}
    </>
  );
}
