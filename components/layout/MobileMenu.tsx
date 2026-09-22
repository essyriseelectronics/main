'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ChevronRight, ShoppingBag, Heart } from 'lucide-react';

type MobileMenuProps = {
  categories: { name: string; slug: string }[];
};

export default function MobileMenu({ categories }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

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
    <div className="md:hidden">
      <button onClick={() => setIsOpen(true)} className="p-2 text-black focus:outline-none hover:bg-gray-50 rounded-lg transition-colors">
        <Menu className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-start">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />

          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">

              {/* ESSYRISE TEXT LOGO FOR MOBILE */}
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-baseline outline-none select-none">
                <span className="text-2xl font-black text-brand-primary tracking-tight">ESSYRISE</span>
                <span className="text-2xl font-black text-brand-accent tracking-tight">.</span>
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
                  <span className="flex items-center">Shop by Category</span>
                  <ChevronDown className={`h-4 w-4 text-black transition-transform ${activeDropdown === 'categories' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'categories' && (
                  <div className="bg-white border-t border-gray-100 flex flex-col">
                    {categories.length === 0 ? (
                       <span className="px-12 py-3 text-sm text-gray-500">Loading...</span>
                    ) : (
                      categories.map((cat) => (
                        <Link key={cat.slug} href={`/category/${cat.slug}`} onClick={() => setIsOpen(false)} className={`px-12 py-3 text-sm font-medium flex items-center justify-between transition-colors ${isActive(`/category/${cat.slug}`) ? 'bg-gray-100 text-black' : 'text-black hover:bg-gray-50'}`}>
                          {cat.name} <ChevronRight className="h-4 w-4 opacity-50" />
                        </Link>
                      ))
                    )}
                    <Link href="/shop" onClick={() => setIsOpen(false)} className="px-12 py-3 text-sm font-bold text-brand-primary hover:bg-gray-100 border-t border-gray-50 mt-1">
                      View all products &rarr;
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
                <Heart className="h-5 w-5 mr-3 text-brand-accent" /> Lists
              </Link>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
