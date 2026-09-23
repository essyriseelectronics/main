// app/components/layout/Header.tsx
import Link from 'next/link';
import { Search, ShoppingCart, ChevronDown } from 'lucide-react';
import MobileMenu from './MobileMenu';

// 🚨 MOVED OUTSIDE: Prevents expensive re-rendering loops
const Logo = () => (
  <Link href="/" className="flex items-center gap-1.5 outline-none select-none">
    <span className="text-2xl md:text-3xl font-extrabold text-black tracking-tight">kabale</span>
    <span className="bg-[#0076c0] text-white text-[11px] md:text-sm font-bold px-2.5 py-0.5 rounded-full mt-1">online</span>
  </Link>
);

export default function Header() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ======================= */}
        {/*       MOBILE VIEW       */}
        {/* ======================= */}
        {/* Added !hidden to force override any conflicting global styles */}
        <div className="flex items-center justify-between h-14 md:!hidden">
          <div className="flex-none">
            <MobileMenu />
          </div>

          <div className="flex-1 flex justify-center">
            <Logo />
          </div>

          <div className="flex-none flex items-center gap-3">
            <button className="text-gray-700 hover:text-black">
              <Search className="h-6 w-6" strokeWidth={2} />
            </button>
            <Link href="/cart" className="text-gray-700 hover:text-black relative">
              <ShoppingCart className="h-6 w-6" strokeWidth={2} />
            </Link>
          </div>
        </div>

        {/* ======================= */}
        {/*      DESKTOP VIEW       */}
        {/* ======================= */}
        {/* Added !hidden and !flex to force state */}
        <div className="!hidden md:!flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Logo />
          </div>

          <div className="flex items-center gap-6 lg:gap-8 ml-8">
            <Link href="/" className="text-[15px] font-bold text-gray-800 hover:text-[#0076c0]">
              Home
            </Link>
            <button className="flex items-center text-[15px] font-bold text-gray-800 hover:text-[#0076c0] gap-1 group">
              Categories <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-[#0076c0]" />
            </button>
            <Link href="/shop" className="text-[15px] font-bold text-gray-800 hover:text-[#0076c0]">
              View All
            </Link>
            <button className="flex items-center text-[15px] font-bold text-gray-800 hover:text-[#0076c0] gap-1 group">
              Vendors <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-[#0076c0]" />
            </button>
            <button className="flex items-center text-[15px] font-bold text-gray-800 hover:text-[#0076c0] gap-1 group">
              More <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-[#0076c0]" />
            </button>
          </div>

          <div className="flex items-center gap-5 ml-auto">
            <button className="text-gray-700 hover:text-[#0076c0]">
              <Search className="h-5 w-5" strokeWidth={2.5} />
            </button>
            <div className="w-px h-5 bg-gray-200"></div>
            <Link href="/login" className="text-[15px] font-bold text-gray-800 hover:text-[#0076c0]">
              Login
            </Link>
            <Link href="/register" className="bg-[#0076c0] text-white px-5 py-1.5 rounded-full text-[15px] font-bold hover:bg-blue-700 transition-colors shadow-sm">
              Register
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-[#0076c0] ml-2 relative">
              <ShoppingCart className="h-5 w-5" strokeWidth={2} />
            </Link>
          </div>
        </div>

      </div>
    </nav>
  );
}
