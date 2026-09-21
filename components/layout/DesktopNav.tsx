"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, ShoppingBag, X } from "lucide-react";

export default function DesktopNav() {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <div className="hidden md:flex items-center justify-between h-20 px-6 container mx-auto">
      {/* BRANDING */}
      <Link href="/" className="text-2xl font-black tracking-tight text-brand-primary flex items-center gap-1">
        ESSYRISE<span className="text-brand-accent">.</span>
      </Link>

      {/* SPREAD DESKTOP LINKS & DROPDOWNS */}
      <nav className="flex items-center gap-8 font-semibold text-sm text-brand-charcoal">
        <Link href="/" className="hover:text-brand-accent transition-colors">Home</Link>
        <Link href="/shop" className="hover:text-brand-accent transition-colors">Shop All</Link>

        {/* CATEGORIES DROPDOWN */}
        <div className="relative">
          <button 
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            onBlur={() => setTimeout(() => setIsCategoryOpen(false), 200)}
            className="flex items-center gap-1 hover:text-brand-accent transition-colors py-2 outline-none"
          >
            Categories <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} />
          </button>

          {isCategoryOpen && (
            <div className="absolute top-full left-0 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl py-3 mt-1 flex flex-col z-50 animate-in fade-in slide-in-from-top-2">
              <Link href="/category/smartphones" className="px-5 py-2.5 hover:bg-brand-surface hover:text-brand-primary transition-colors text-sm font-medium">
                Smartphones & Phones
              </Link>
              <Link href="/category/phone-accessories" className="px-5 py-2.5 hover:bg-brand-surface hover:text-brand-primary transition-colors text-sm font-medium">
                Accessories & Chargers
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* RIGHT SIDE UTILITIES & ACTION BUTTON */}
      <div className="flex items-center gap-5">
        {isSearchOpen ? (
          <form onSubmit={handleSearch} className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 w-64 shadow-inner">
            <input 
              type="text"
              autoFocus
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm w-full outline-none text-brand-charcoal"
            />
            <button type="button" onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-gray-600 ml-2">
              <X className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <button onClick={() => setIsSearchOpen(true)} className="p-2 text-brand-charcoal hover:text-brand-primary transition-colors">
            <Search className="w-5 h-5" />
          </button>
        )}

        <Link href="/cart" className="p-2 text-brand-charcoal hover:text-brand-primary transition-colors relative">
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-4 h-4 bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full">0</span>
        </Link>

        <Link href="/admin/products" className="bg-brand-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-secondary transition-all shadow-md shadow-brand-primary/20">
          Admin Panel
        </Link>
      </div>
    </div>
  );
}
