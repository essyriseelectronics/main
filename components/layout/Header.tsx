// app/components/layout/Header.tsx
import Link from 'next/link';
import { ChevronDown, ShoppingBag, User } from 'lucide-react';
import MobileMenu from './MobileMenu';

export default function Header() {
  const categories = [
    { name: 'Smartphones & Phones', slug: 'smartphones' },
    { name: 'Laptops & Computers', slug: 'computers' },
    { name: 'Accessories & Chargers', slug: 'accessories' },
    { name: 'Audio & Headphones', slug: 'audio' }
  ];

  // Replace with your actual auth logic
  const hasSession = false;
  const isAdmin = false;

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* LOGO */}
          <Link href="/" className="flex items-baseline outline-none select-none z-10">
            <span className="text-2xl md:text-3xl font-black text-[#0D4A38] tracking-tight">ESSYRISE</span>
            <span className="text-2xl md:text-3xl font-black text-emerald-500 tracking-tight">.</span>
          </Link>

          {/* DESKTOP CENTER LINKS */}
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="text-gray-700 hover:text-[#0D4A38] font-semibold transition-colors">
              Home
            </Link>

            <div className="relative group py-6">
              <button className="flex items-center text-gray-700 hover:text-[#0D4A38] font-semibold transition-colors outline-none cursor-pointer">
                Categories <ChevronDown className="h-4 w-4 ml-1 opacity-50 transition-transform group-hover:rotate-180" />
              </button>
              
              {/* Desktop Dropdown */}
              <div className="absolute top-[65px] left-1/2 -translate-x-1/2 w-64 bg-white border border-gray-100 shadow-xl rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {categories.map((cat) => (
                  <Link key={cat.slug} href={`/category/${cat.slug}`} className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-emerald-50 hover:text-[#0D4A38] rounded-xl transition-colors">
                    {cat.name}
                  </Link>
                ))}
                <div className="border-t border-gray-50 mt-1 pt-1">
                  <Link href="/shop" className="block px-4 py-2.5 text-sm font-bold text-[#0D4A38] hover:bg-emerald-50 rounded-xl transition-colors text-center">
                    View all categories &rarr;
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/shop" className="text-gray-700 hover:text-[#0D4A38] font-semibold transition-colors">
              Shop
            </Link>
          </div>

          {/* DESKTOP RIGHT ACTIONS */}
          <div className="hidden md:flex items-center space-x-5 z-10">
            {hasSession ? (
              <Link href="/dashboard" className="text-gray-700 hover:text-[#0D4A38] font-semibold transition-colors flex items-center">
                <User className="w-5 h-5 mr-1" /> Account
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-700 hover:text-[#0D4A38] font-semibold transition-colors">
                  Log in
                </Link>
                <Link href="/register" className="bg-[#0D4A38] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#083325] transition-colors shadow-sm">
                  Sign up
                </Link>
              </div>
            )}
            
            <div className="w-px h-6 bg-gray-200 mx-2"></div>

            <Link href="/cart" className="relative flex items-center text-gray-700 hover:text-[#0D4A38] transition-colors group">
              <ShoppingBag className="h-6 w-6" />
              <span className="absolute -top-1 -right-2 w-5 h-5 bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
                0
              </span>
            </Link>
          </div>

          {/* MOBILE MENU TRIGGER (Hidden on md up) */}
          <MobileMenu 
            categories={categories} 
            hasSession={hasSession} 
            isAdmin={isAdmin} 
          />
        </div>
      </div>
    </nav>
  );
}
