"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Search, ChevronDown, ChevronRight, ShoppingBag, Heart, User } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Exact Etomu scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const isActive = (path: string) => pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="w-full">
        
        {/* ========================================= */}
        {/* DESKTOP NAVBAR (hidden md:flex)           */}
        {/* ========================================= */}
        <div className="hidden md:flex justify-between items-center h-20 px-8 lg:px-16">
          <Link href="/" className="flex items-baseline outline-none select-none text-2xl font-black tracking-tight text-brand-primary">
            ESSYRISE<span className="text-brand-accent">.</span>
          </Link>

          <div className="flex items-center space-x-8 xl:space-x-10 font-semibold text-sm text-brand-charcoal">
            <Link href="/" className="hover:text-brand-accent transition-colors">Home</Link>
            
            {/* Hover Dropdown (Etomu style) */}
            <div className="relative group py-6">
              <button className="flex items-center hover:text-brand-accent transition-colors outline-none cursor-pointer">
                Categories <ChevronDown className="h-4 w-4 ml-1 opacity-50 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-[65px] left-0 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link href="/category/smartphones" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-primary rounded-xl transition-colors">
                  Smartphones & Phones
                </Link>
                <Link href="/category/phone-accessories" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-primary rounded-xl transition-colors">
                  Accessories & Chargers
                </Link>
              </div>
            </div>

            <Link href="/shop" className="hover:text-brand-accent transition-colors">View All</Link>
          </div>

          <div className="flex items-center space-x-6">
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
                  <X className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <button onClick={() => setIsSearchOpen(true)} className="p-2 text-brand-charcoal hover:text-brand-primary transition-colors cursor-pointer outline-none">
                <Search className="h-5 w-5" />
              </button>
            )}

            <Link href="/login" className="text-sm font-semibold text-brand-charcoal hover:text-brand-primary transition-colors">
              Login
            </Link>

            <Link href="/register" className="bg-brand-primary text-white px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity shadow-sm">
              Register
            </Link>

            <Link href="/cart" className="p-2 text-brand-charcoal hover:text-brand-primary transition-colors relative outline-none">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full">0</span>
            </Link>
          </div>
        </div>

        {/* ========================================= */}
        {/* MOBILE NAVBAR (md:hidden)                 */}
        {/* ========================================= */}
        <div className="md:hidden flex items-center justify-between h-16 px-4">
          <div className="z-10">
            <button 
              onClick={() => setIsOpen(true)} 
              className="p-2 -ml-2 text-brand-charcoal focus:outline-none hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Link href="/" className="text-xl font-black tracking-tight text-brand-primary pointer-events-auto flex items-baseline">
              ESSYRISE<span className="text-brand-accent">.</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 z-10">
            <button 
              onClick={() => setIsOpen(true)}
              className="p-2 text-brand-charcoal hover:bg-gray-50 rounded-lg transition-colors outline-none"
            >
              <Search className="h-6 w-6" strokeWidth={1.5} />
            </button>
            <Link href="/cart" className="p-2 text-brand-charcoal hover:bg-gray-50 rounded-lg relative transition-colors outline-none">
              <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
              <span className="absolute top-1 right-0 w-4 h-4 bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">0</span>
            </Link>
          </div>
        </div>

      </div>

      {/* ========================================= */}
      {/* EXACT ETOMU MOBILE MENU STRUCTURE         */}
      {/* ========================================= */}
      {isOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 z-[100] flex justify-start">
            
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />

            <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-baseline outline-none select-none text-2xl font-black tracking-tight text-brand-primary">
                  ESSYRISE<span className="text-brand-accent text-3xl">.</span>
                </Link>
                <button onClick={() => setIsOpen(false)} className="p-2 text-black hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
                <Link href="/" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl font-bold transition-colors ${isActive('/') ? 'bg-gray-100 text-black' : 'text-black hover:bg-gray-50'}`}>
                  Home
                </Link>

                <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50/50">
                  <button onClick={() => toggleDropdown('categories')} className="flex items-center justify-between w-full px-4 py-3 font-bold text-black hover:bg-gray-100 transition-colors">
                    <span>Shop by Category</span>
                    <ChevronDown className={`h-4 w-4 text-black transition-transform ${activeDropdown === 'categories' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === 'categories' && (
                    <div className="bg-white border-t border-gray-100 flex flex-col">
                      <Link href="/category/smartphones" onClick={() => setIsOpen(false)} className={`px-12 py-3 text-sm font-medium flex items-center justify-between transition-colors ${isActive('/category/smartphones') ? 'bg-gray-50 text-brand-primary' : 'text-black hover:bg-gray-50'}`}>
                        Smartphones & Phones <ChevronRight className="h-4 w-4 opacity-50" />
                      </Link>
                      <Link href="/category/phone-accessories" onClick={() => setIsOpen(false)} className={`px-12 py-3 text-sm font-medium flex items-center justify-between transition-colors ${isActive('/category/phone-accessories') ? 'bg-gray-50 text-brand-primary' : 'text-black hover:bg-gray-50'}`}>
                        Accessories & Chargers <ChevronRight className="h-4 w-4 opacity-50" />
                      </Link>
                    </div>
                  )}
                </div>

                <Link href="/shop" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl font-bold transition-colors ${isActive('/shop') ? 'bg-gray-100 text-black' : 'text-black hover:bg-gray-50'}`}>
                  View All
                </Link>

                <Link href="/cart" onClick={() => setIsOpen(false)} className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-colors ${isActive('/cart') ? 'bg-gray-100 text-black' : 'text-black hover:bg-gray-50'}`}>
                  <span className="flex items-center"><ShoppingBag className="h-5 w-5 mr-3 text-emerald-600" /> Cart</span>
                  <span className="text-sm font-medium text-gray-500">0 Items</span>
                </Link>

                <Link href="/wishlist" onClick={() => setIsOpen(false)} className={`flex items-center px-4 py-3 rounded-xl font-bold transition-colors ${isActive('/wishlist') ? 'bg-gray-100 text-black' : 'text-black hover:bg-gray-50'}`}>
                  <Heart className="h-5 w-5 mr-3 text-red-500" /> Lists
                </Link>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
                <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center flex-1 bg-brand-primary text-white px-4 py-3.5 rounded-xl font-bold shadow-sm hover:opacity-90 transition-colors">
                  <User className="h-5 w-5 mr-2 text-white" /> Login
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="flex items-center justify-center flex-1 bg-white border border-gray-200 text-brand-primary px-4 py-3.5 rounded-xl font-bold shadow-sm hover:bg-gray-50 transition-colors">
                  Register
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </nav>
  );
}
