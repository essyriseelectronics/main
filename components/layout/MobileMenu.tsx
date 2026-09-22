// app/components/layout/MobileMenu.tsx
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, ChevronDown, ShoppingBag, Smartphone, Shield } from 'lucide-react';

type MobileMenuProps = {
  hasSession: boolean;
  isAdmin: boolean;
  categories: { name: string; slug: string }[];
};

export default function MobileMenu({ hasSession, isAdmin, categories }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="md:hidden flex items-center">
      {/* Mobile Cart Icon (Visible before opening menu) */}
      <Link href="/cart" className="relative p-2 text-gray-800 hover:text-[#0D4A38] transition-colors mr-2">
        <ShoppingBag className="h-6 w-6" />
        <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">0</span>
      </Link>

      {/* Hamburger Button */}
      <button onClick={() => setIsOpen(true)} className="p-2 text-gray-800 focus:outline-none hover:bg-gray-100 rounded-lg transition-colors">
        <Menu className="h-6 w-6" />
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-300">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-baseline outline-none select-none">
                <span className="text-2xl font-black text-[#0D4A38] tracking-tight">ESSYRISE</span>
                <span className="text-2xl font-black text-emerald-500 tracking-tight">.</span>
              </Link>
              <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
              {isAdmin && (
                <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-3 mb-4 rounded-xl font-bold bg-purple-50 text-purple-700 border border-purple-100">
                  <Shield className="h-5 w-5 mr-3" />
                  Admin Dashboard
                </Link>
              )}

              <Link href="/" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl font-bold transition-colors ${isActive('/') ? 'bg-emerald-50 text-[#0D4A38]' : 'text-gray-800 hover:bg-gray-50'}`}>
                Home
              </Link>
              
              <Link href="/shop" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl font-bold transition-colors ${isActive('/shop') ? 'bg-emerald-50 text-[#0D4A38]' : 'text-gray-800 hover:bg-gray-50'}`}>
                Shop All Products
              </Link>

              {/* Categories Dropdown */}
              <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50/50">
                <button onClick={() => toggleDropdown('categories')} className="flex items-center justify-between w-full px-4 py-3 font-bold text-gray-800 hover:bg-gray-100 transition-colors">
                  <span className="flex items-center"><Smartphone className="h-5 w-5 mr-3 text-gray-600" /> Categories</span>
                  <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${activeDropdown === 'categories' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === 'categories' && (
                  <div className="bg-white border-t border-gray-100 flex flex-col">
                    {categories.map((cat) => (
                      <Link key={cat.slug} href={`/category/${cat.slug}`} onClick={() => setIsOpen(false)} className={`px-12 py-3 text-sm font-medium transition-colors ${isActive(`/category/${cat.slug}`) ? 'bg-emerald-50 text-[#0D4A38]' : 'text-gray-600 hover:bg-gray-50'}`}>
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer (Auth) */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 space-y-3">
              {hasSession ? (
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center justify-center w-full bg-[#0D4A38] text-white px-4 py-3.5 rounded-xl font-bold hover:bg-[#083325] transition-colors">
                  <User className="h-5 w-5 mr-2" /> My Account
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center w-full bg-white text-[#0D4A38] border-2 border-[#0D4A38] px-4 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
                    Log In
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)} className="flex items-center justify-center w-full bg-[#0D4A38] text-white px-4 py-3 rounded-xl font-bold hover:bg-[#083325] transition-colors">
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
