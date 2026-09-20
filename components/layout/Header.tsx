"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search, ChevronDown } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">

        {/* BRANDING */}
        <Link href="/" className="text-xl md:text-2xl font-black tracking-tight text-brand-primary flex items-center gap-1">
          ESSYRISE<span className="text-brand-accent">.</span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-8 font-semibold text-sm text-brand-charcoal">
          <Link href="/" className="hover:text-brand-accent transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-brand-accent transition-colors">Shop All</Link>
          
          {/* CATEGORIES DROPDOWN */}
          <div className="relative">
            <button 
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              onBlur={() => setTimeout(() => setIsCategoryDropdownOpen(false), 200)}
              className="flex items-center gap-1 hover:text-brand-accent transition-colors py-2 outline-none"
            >
              Categories <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isCategoryDropdownOpen && (
              <div className="absolute top-full left-0 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl py-3 mt-1 flex flex-col z-50 animate-in fade-in slide-in-from-top-2">
                <Link href="/category/smartphones" className="px-5 py-2.5 hover:bg-brand-surface hover:text-brand-primary transition-colors text-sm font-medium">
                  Smartphones & Phones
                </Link>
                <Link href="/category/phone-accessories" className="px-5 py-2.5 hover:bg-brand-surface hover:text-brand-primary transition-colors text-sm font-medium">
                  Accessories & Chargers
                </Link>
                <Link href="/category/audio" className="px-5 py-2.5 hover:bg-brand-surface hover:text-brand-primary transition-colors text-sm font-medium">
                  Audio & Earbuds
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* UTILITY ICONS & SEARCH BAR */}
        <div className="hidden md:flex items-center gap-4">
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
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-full hover:bg-gray-50 text-brand-charcoal hover:text-brand-primary transition-colors"
              aria-label="Open Search"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          <Link href="/shop" className="bg-brand-primary text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-brand-secondary transition-all shadow-md shadow-brand-primary/20">
            Order Now
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex md:hidden items-center gap-2">
          <button 
            className="p-2.5 text-brand-charcoal hover:bg-gray-50 rounded-full"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-2xl py-6 px-6 flex flex-col gap-6 z-50 animate-in slide-in-from-top-4">
          
          {/* MOBILE SEARCH BAR */}
          <form onSubmit={handleSearch} className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input 
              type="text"
              placeholder="Search smartphones, accessories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm w-full outline-none text-brand-charcoal"
            />
          </form>

          {/* MOBILE LINKS */}
          <div className="flex flex-col gap-4 font-semibold text-brand-charcoal">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-gray-50 hover:text-brand-primary">Home</Link>
            <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-gray-50 hover:text-brand-primary">Shop All Products</Link>
            <Link href="/category/smartphones" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-gray-50 hover:text-brand-primary pl-4 text-sm text-gray-600">↳ Smartphones</Link>
            <Link href="/category/phone-accessories" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-gray-50 hover:text-brand-primary pl-4 text-sm text-gray-600">↳ Accessories</Link>
          </div>

          <Link 
            href="/shop" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full text-center bg-brand-accent text-white py-3.5 rounded-xl font-bold shadow-lg shadow-brand-accent/20"
          >
            Explore Catalog
          </Link>
        </div>
      )}
    </header>
  );
}
