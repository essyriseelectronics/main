"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search, ChevronDown, ChevronRight, ShoppingBag } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDesktopCategoryOpen, setIsDesktopCategoryOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Detect screen size dynamically to prevent any CSS compilation overlaps
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

  // Prevent hydration mismatch layout shift by returning a neutral wrapper on first mount
  if (isMobile === null) {
    return <header className="sticky top-0 z-50 w-full h-20 bg-white border-b border-gray-100" />;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      
      {/* ================================================= */}
      {/* DESKTOP VIEW (Rendered ONLY when width >= 768px)   */}
      {/* ================================================= --> */}
      {!isMobile ? (
        <div className="flex items-center justify-between h-20 w-full px-8 lg:px-16">
          
          {/* Brand Logo */}
          <Link href="/" className="text-2xl font-black tracking-tight text-brand-primary flex items-center gap-1">
            ESSYRISE<span className="text-brand-accent">.</span>
          </Link>

          {/* Spread Navigation & Dropdowns */}
          <nav className="flex items-center gap-10 font-semibold text-sm text-brand-charcoal">
            <Link href="/" className="hover:text-brand-accent transition-colors">Home</Link>
            <Link href="/shop" className="hover:text-brand-accent transition-colors">Shop All</Link>

            {/* Categories Dropdown */}
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
          </nav>

          {/* Utilities & Action Buttons */}
          <div className="flex items-center gap-6">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 w-72 shadow-inner">
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

            <Link href="/cart" className="p-2 text-brand-charcoal hover:text-brand-primary transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full">0</span>
            </Link>

            <Link href="/admin/products" className="bg-brand-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-secondary transition-all shadow-md shadow-brand-primary/20">
              Admin Panel
            </Link>
          </div>
        </div>
      ) : (
        /* ================================================= */
        /* MOBILE VIEW (Rendered ONLY when width < 768px)     */
        /* ================================================= */
        <div className="flex items-center justify-between h-16 px-4 w-full relative">
          
          {/* Left: Hamburger Menu Icon */}
          <button 
            className="p-2 -ml-2 text-brand-charcoal hover:bg-gray-100 rounded-lg flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Center: Brand Logo */}
          <Link href="/" className="text-lg font-black tracking-tight text-brand-primary absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            ESSYRISE<span className="text-brand-accent">.</span>
          </Link>

          {/* Right: Search & Cart Icons */}
          <div className="flex items-center gap-1 -mr-2">
            <button 
              className="p-2 text-brand-charcoal hover:bg-gray-100 rounded-lg flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link href="/cart" className="p-2 text-brand-charcoal hover:bg-gray-100 rounded-lg relative flex items-center justify-center" aria-label="Cart">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">0</span>
            </Link>
          </div>

          {/* Mobile Slide-Out Drawer */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-[100] flex">
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
              
              <div className="relative w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
                
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-black tracking-tight text-brand-primary">
                    ESSYRISE<span className="text-brand-accent">.</span>
                  </Link>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" aria-label="Close Menu">
                    <X className="w-6 h-6" />
                  </button>
                </div>

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
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-4 border-b border-gray-50 hover:bg-gray-50">
                      Home
                    </Link>
                    
                    <div>
                      <button 
                        onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
                        className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-50 hover:bg-gray-50"
                      >
                        <span>Shop by Category</span>
                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isMobileCategoryOpen ? "rotate-90" : ""}`} />
                      </button>
                      {isMobileCategoryOpen && (
                        <div className="bg-gray-50 flex flex-col border-b border-gray-100">
                          <Link href="/category/smartphones" onClick={() => setIsMobileMenuOpen(false)} className="py-3 pl-8 text-gray-600 hover:text-brand-primary">
                            Smartphones & Phones
                          </Link>
                          <Link href="/category/phone-accessories" onClick={() => setIsMobileMenuOpen(false)} className="py-3 pl-8 text-gray-600 hover:text-brand-primary">
                            Accessories & Chargers
                          </Link>
                        </div>
                      )}
                    </div>

                    <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-4 border-b border-gray-50 hover:bg-gray-50">
                      View All
                    </Link>
                    <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-5 py-4 border-b border-gray-50 hover:bg-gray-50">
                      <span className="flex items-center gap-3"><ShoppingBag className="w-4 h-4 text-brand-primary"/> Cart</span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-bold">0 items</span>
                    </Link>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3 mt-auto">
                  <Link href="/admin/products" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 bg-brand-primary text-white text-center py-3 rounded-xl font-bold text-xs shadow-sm">
                    Admin Panel
                  </Link>
                  <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 bg-white text-brand-primary border border-gray-200 text-center py-3 rounded-xl font-bold text-xs shadow-sm">
                    Browse Shop
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
