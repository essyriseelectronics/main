"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search, ChevronDown, ChevronRight, ShoppingBag, Heart, User } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDesktopCategoryOpen, setIsDesktopCategoryOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  if (isMobile === null) {
    return <header className="sticky top-0 z-50 w-full h-20 bg-white border-b border-gray-100" />;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      {!isMobile ? (
        <div className="flex items-center justify-between h-20 w-full px-8 lg:px-16">
          {/* ================================================= */}
          {/* 1. DESKTOP HEADER                                 */}
          {/* ================================================= */}
          
          <Link href="/" className="text-2xl font-black tracking-tight text-brand-primary flex items-center gap-1">
            ESSYRISE<span className="text-brand-accent">.</span>
          </Link>

          <nav className="flex items-center gap-8 font-semibold text-sm text-brand-charcoal">
            <Link href="/" className="hover:text-brand-accent transition-colors">Home</Link>
            
            <div className="relative">
              <button 
                onClick={() => setIsDesktopCategoryOpen(!isDesktopCategoryOpen)}
                onBlur={() => setTimeout(() => setIsDesktopCategoryOpen(false), 200)}
                className="flex items-center gap-1 hover:text-brand-accent transition-colors py-2 outline-none cursor-pointer"
              >
                Categories <ChevronDown className={`w-4 h-4 transition-transform ${isDesktopCategoryOpen ? "rotate-180" : ""}`} />
              </button>

              {isDesktopCategoryOpen && (
                <div className="absolute top-full left-0 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl py-3 mt-1 flex flex-col z-50">
                  <Link href="/category/smartphones" className="px-5 py-2.5 hover:bg-brand-surface hover:text-brand-primary transition-colors text-sm font-medium">
                    Smartphones & Phones
                  </Link>
                  <Link href="/category/phone-accessories" className="px-5 py-2.5 hover:bg-brand-surface hover:text-brand-primary transition-colors text-sm font-medium">
                    Accessories & Chargers
                  </Link>
                </div>
              )}
            </div>

            <Link href="/shop" className="hover:text-brand-accent transition-colors">View All</Link>
          </nav>

          <div className="flex items-center gap-6">
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
              <button onClick={() => setIsSearchOpen(true)} className="p-2 text-brand-charcoal hover:text-brand-primary transition-colors cursor-pointer">
                <Search className="w-5 h-5" />
              </button>
            )}

            <Link href="/admin/products" className="text-sm font-semibold text-brand-charcoal hover:text-brand-primary transition-colors">
              Login
            </Link>

            <Link 
              href="/shop" 
              className="bg-brand-primary text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-brand-secondary transition-all shadow-md shadow-brand-primary/25"
            >
              Register
            </Link>

            <Link href="/cart" className="p-2 text-brand-charcoal hover:text-brand-primary transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full">0</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* ================================================= */}
          {/* 2. MOBILE HEADER                                  */}
          {/* ================================================= */}
          <div className="relative flex items-center justify-between h-16 px-4 w-full">
            
            {/* Left: Hamburger Icon */}
            <div className="z-10">
              <button 
                className="p-2 -ml-2 text-brand-charcoal hover:bg-gray-100 rounded-lg flex items-center justify-center"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open Menu"
              >
                <Menu className="w-7 h-7" strokeWidth={1.5} />
              </button>
            </div>

            {/* Center: True Absolute Centered Logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Link href="/" className="text-xl font-black tracking-tight text-brand-primary pointer-events-auto">
                ESSYRISE<span className="text-brand-accent">.</span>
              </Link>
            </div>

            {/* Right: Search & Cart Icons */}
            <div className="z-10 flex items-center gap-2">
              <button 
                className="p-2 text-brand-charcoal hover:bg-gray-100 rounded-lg flex items-center justify-center"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open Search"
              >
                <Search className="w-6 h-6" strokeWidth={1.5} />
              </button>
              <Link href="/cart" className="p-2 text-brand-charcoal hover:bg-gray-100 rounded-lg relative flex items-center justify-center" aria-label="Cart">
                <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
                <span className="absolute top-1 right-0 w-4 h-4 bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">0</span>
              </Link>
            </div>
          </div>

          {/* ================================================= */}
          {/* 3. MOBILE DRAWER (Matched to Reference Image)     */}
          {/* ================================================= */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-[100] flex">
              <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
              
              <div className="relative w-[85%] max-w-[320px] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-black tracking-tight text-brand-primary">
                    ESSYRISE<span className="text-brand-accent">.</span>
                  </Link>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-gray-500" aria-label="Close Menu">
                    <X className="w-6 h-6" strokeWidth={1.5} />
                  </button>
                </div>

                {/* Scrollable Links */}
                <div className="flex-1 overflow-y-auto bg-white">
                  
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-4 text-[15px] text-gray-700 border-b border-gray-100 hover:bg-gray-50">
                    Home
                  </Link>
                  
                  <div>
                    <button 
                      onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
                      className="w-full flex items-center justify-between px-6 py-4 text-[15px] text-gray-700 border-b border-gray-100 hover:bg-gray-50"
                    >
                      <span>Shop by Category</span>
                      <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isMobileCategoryOpen ? "rotate-90" : ""}`} />
                    </button>
                    {isMobileCategoryOpen && (
                      <div className="bg-gray-50 flex flex-col border-b border-gray-100">
                        <Link href="/category/smartphones" onClick={() => setIsMobileMenuOpen(false)} className="py-3 pl-10 text-[14px] text-gray-600 hover:text-brand-primary">
                          Smartphones & Phones
                        </Link>
                        <Link href="/category/phone-accessories" onClick={() => setIsMobileMenuOpen(false)} className="py-3 pl-10 text-[14px] text-gray-600 hover:text-brand-primary">
                          Accessories & Chargers
                        </Link>
                      </div>
                    )}
                  </div>

                  <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-4 text-[15px] text-gray-700 border-b border-gray-100 hover:bg-gray-50">
                    View All
                  </Link>

                  <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-6 py-4 border-b border-gray-100 hover:bg-gray-50">
                    <div className="flex items-center gap-4 text-[15px] text-gray-700">
                      <ShoppingBag className="w-5 h-5 text-emerald-600" fill="currentColor" strokeWidth={1} /> 
                      <span>Cart</span>
                    </div>
                    <span className="text-sm text-gray-400">0 Items</span>
                  </Link>

                  <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 text-[15px] text-gray-700 border-b border-gray-100 hover:bg-gray-50">
                    <Heart className="w-5 h-5 text-brand-accent" fill="currentColor" strokeWidth={1} /> 
                    <span>Lists</span>
                  </Link>
                </div>

                {/* Footer (Login Pill & Register Link) */}
                <div className="p-6 bg-white border-t border-gray-100 flex items-center gap-6">
                  <Link 
                    href="/login" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="flex items-center justify-center gap-2 bg-brand-primary text-white px-8 py-2.5 rounded-full font-medium shadow-sm hover:bg-brand-secondary transition-colors"
                  >
                    <User className="w-4 h-4" /> Login
                  </Link>
                  <Link 
                    href="/register" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="text-brand-primary font-medium hover:text-brand-secondary transition-colors"
                  >
                    Register
                  </Link>
                </div>

              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
