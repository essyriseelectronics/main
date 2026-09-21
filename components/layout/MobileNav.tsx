"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search, ChevronRight, ShoppingBag, Heart } from "lucide-react";

export default function MobileNav() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <div className="flex md:hidden items-center justify-between h-16 px-4">
      {/* HAMBURGER TOGGLE */}
      <button 
        className="p-2 -ml-2 text-brand-charcoal hover:bg-gray-100 rounded-lg"
        onClick={() => setIsOpen(true)}
        aria-label="Open Menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* CENTER LOGO */}
      <Link href="/" className="text-lg font-black tracking-tight text-brand-primary">
        ESSYRISE<span className="text-brand-accent">.</span>
      </Link>

      {/* UTILITY ICONS */}
      <div className="flex items-center gap-1">
        <button 
          className="p-2 text-brand-charcoal hover:bg-gray-100 rounded-lg"
          onClick={() => setIsOpen(true)}
        >
          <Search className="w-5 h-5" />
        </button>
        <Link href="/cart" className="p-2 text-brand-charcoal hover:bg-gray-100 rounded-lg relative">
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">0</span>
        </Link>
      </div>

      {/* SLIDE-OUT DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* DRAWER TOP */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <Link href="/" onClick={() => setIsOpen(false)} className="text-xl font-black tracking-tight text-brand-primary">
                ESSYRISE<span className="text-brand-accent">.</span>
              </Link>
              <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* SCROLLABLE LINKS */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 border-b border-gray-100">
                <form onSubmit={handleSearch} className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                  <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <input 
                    type="text"
                    placeholder="Search catalog..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-sm w-full outline-none text-brand-charcoal"
                  />
                </form>
              </div>

              <div className="flex flex-col text-brand-charcoal font-medium text-sm">
                <Link href="/" onClick={() => setIsOpen(false)} className="px-5 py-4 border-b border-gray-50">Home</Link>
                
                {/* Accordion Categories */}
                <div>
                  <button 
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-50"
                  >
                    <span>Shop by Category</span>
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isCategoryOpen ? "rotate-90" : ""}`} />
                  </button>
                  {isCategoryOpen && (
                    <div className="bg-gray-50 flex flex-col border-b border-gray-100">
                      <Link href="/category/smartphones" onClick={() => setIsOpen(false)} className="py-3 pl-8 text-gray-600">Smartphones & Phones</Link>
                      <Link href="/category/phone-accessories" onClick={() => setIsOpen(false)} className="py-3 pl-8 text-gray-600">Accessories & Chargers</Link>
                    </div>
                  )}
                </div>

                <Link href="/shop" onClick={() => setIsOpen(false)} className="px-5 py-4 border-b border-gray-50">View All</Link>
                <Link href="/cart" onClick={() => setIsOpen(false)} className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                  <span className="flex items-center gap-3"><ShoppingBag className="w-4 h-4 text-brand-primary"/> Cart</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-bold">0 items</span>
                </Link>
                <Link href="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                  <span className="flex items-center gap-3"><Heart className="w-4 h-4 text-red-500"/> Wishlists</span>
                </Link>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3 mt-auto">
              <Link href="/admin/products" onClick={() => setIsOpen(false)} className="flex-1 bg-brand-primary text-white text-center py-3 rounded-xl font-bold text-xs shadow-sm">
                Admin Panel
              </Link>
              <Link href="/shop" onClick={() => setIsOpen(false)} className="flex-1 bg-white text-brand-primary border border-gray-200 text-center py-3 rounded-xl font-bold text-xs shadow-sm">
                Browse Shop
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
