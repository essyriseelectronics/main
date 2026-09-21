"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search, ChevronDown, ShoppingBag, Heart, ChevronRight } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Dropdown states
  const [isDesktopCategoryOpen, setIsDesktopCategoryOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  
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
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm relative">
      <div className="container mx-auto px-4">
        
        {/* ======================= */}
        {/*     DESKTOP HEADER      */}
        {/* ======================= */}
        <div className="hidden md:flex items-center justify-between h-20">
          {/* BRANDING */}
          <Link href="/" className="text-2xl font-black tracking-tight text-brand-primary flex items-center gap-1">
            ESSYRISE<span className="text-brand-accent">.</span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="flex items-center gap-8 font-semibold text-sm text-brand-charcoal">
            <Link href="/" className="hover:text-brand-accent transition-colors">Home</Link>
            <Link href="/shop" className="hover:text-brand-accent transition-colors">Shop All</Link>
            
            {/* CATEGORIES DROPDOWN */}
            <div className="relative">
              <button 
                onClick={() => setIsDesktopCategoryOpen(!isDesktopCategoryOpen)}
                onBlur={() => setTimeout(() => setIsDesktopCategoryOpen(false), 200)}
                className="flex items-center gap-1 hover:text-brand-accent transition-colors py-2 outline-none"
              >
                Categories <ChevronDown className={`w-4 h-4 transition-transform ${isDesktopCategoryOpen ? "rotate-180" : ""}`} />
              </button>

              {isDesktopCategoryOpen && (
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

          {/* UTILITY ICONS & SEARCH BAR */}
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
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-brand-charcoal hover:text-brand-primary transition-colors"
                aria-label="Open Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            <Link href="/cart" className="p-2 text-brand-charcoal hover:text-brand-primary transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full">0</span>
            </Link>
          </div>
        </div>

        {/* ======================= */}
        {/*      MOBILE HEADER      */}
        {/* ======================= */}
        <div className="flex md:hidden items-center justify-between h-16 w-full relative">
          
          {/* LEFT: Hamburger */}
          <button 
            className="p-2 -ml-2 text-brand-charcoal hover:bg-gray-50 rounded-full"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Toggle Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* CENTER: Logo */}
          <Link href="/" className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-black tracking-tight text-brand-primary">
            ESSYRISE<span className="text-brand-accent">.</span>
          </Link>

          {/* RIGHT: Search & Cart */}
          <div className="flex items-center gap-2">
            <button 
              className="p-2 text-brand-charcoal hover:bg-gray-50 rounded-full"
              onClick={() => {
                setIsMobileMenuOpen(true);
                setTimeout(() => document.getElementById('mobile-search')?.focus(), 100);
              }}
            >
              <Search className="w-5 h-5" />
            </button>
            <Link href="/cart" className="p-2 text-brand-charcoal hover:bg-gray-50 rounded-full relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">0</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ======================= */}
      {/*   MOBILE SIDE DRAWER    */}
      {/* ======================= */}
      {isMobileMenuOpen && (
        <>
          {/* Dark Overlay Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 z-[60] md:hidden backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-[70] md:hidden flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-black tracking-tight text-brand-primary">
                ESSYRISE<span className="text-brand-accent">.</span>
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pb-6">
              
              {/* Mobile Search Bar inside Drawer */}
              <div className="p-4 border-b border-gray-100">
                <form onSubmit={handleSearch} className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <input 
                    id="mobile-search"
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-sm w-full outline-none text-brand-charcoal"
                  />
                </form>
              </div>

              {/* Navigation Links */}
              <ul className="flex flex-col text-sm font-semibold text-brand-charcoal">
                <li>
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50">
                    Home
                  </Link>
                </li>
                <li>
                  {/* Category Accordion */}
                  <button 
                    onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)} 
                    className="w-full flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50"
                  >
                    Shop by Category 
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isMobileCategoryOpen ? "rotate-90" : ""}`} />
                  </button>
                  {isMobileCategoryOpen && (
                    <div className="bg-gray-50 flex flex-col py-2 border-b border-gray-100">
                      <Link href="/category/smartphones" onClick={() => setIsMobileMenuOpen(false)} className="py-3 pl-8 text-gray-600 hover:text-brand-primary">Smartphones</Link>
                      <Link href="/category/phone-accessories" onClick={() => setIsMobileMenuOpen(false)} className="py-3 pl-8 text-gray-600 hover:text-brand-primary">Accessories</Link>
                    </div>
                  )}
                </li>
                <li>
                  <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50">
                    View All Products
                  </Link>
                </li>
                <li>
                  <Link href="#track" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50">
                    Track Order
                  </Link>
                </li>
              </ul>

              {/* Secondary Actions (Cart / Wishlist) */}
              <div className="mt-2">
                <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50">
                  <div className="flex items-center gap-3 font-semibold text-brand-charcoal">
                    <ShoppingBag className="w-5 h-5 text-green-600"/> Cart
                  </div>
                  <span className="text-sm text-gray-400 font-medium">0 Items</span>
                </Link>
                <Link href="#lists" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50">
                  <div className="flex items-center gap-3 font-semibold text-brand-charcoal">
                    <Heart className="w-5 h-5 text-red-500"/> Wishlists
                  </div>
                </Link>
              </div>
            </div>

            {/* Footer Buttons (Replacing Login/Register) */}
            <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50 mt-auto">
              <Link 
                href="/admin/products" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 bg-brand-primary hover:bg-brand-secondary text-white text-center py-3 rounded-xl font-bold shadow-sm transition-colors text-sm"
              >
                Admin Panel
              </Link>
              <Link 
                href="#contact" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 bg-white hover:bg-gray-100 text-brand-primary border border-gray-200 text-center py-3 rounded-xl font-bold shadow-sm transition-colors text-sm"
              >
                Support
              </Link>
            </div>

          </div>
        </>
      )}
    </header>
  );
}
