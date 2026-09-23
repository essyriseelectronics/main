import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingCart, ChevronDown, ImageIcon } from 'lucide-react';
import MobileMenuWrapper from './MobileMenuWrapper'; // <-- Using the client wrapper for the hamburger icon
import { queryD1 } from "@/lib/db/client"; 
import { Category } from "@/types";

// Logo with small subtext "electronics" under ESSYRISE
const Logo = () => (
  <Link href="/" className="outline-none select-none flex flex-col items-center md:items-start">
    <span className="text-2xl md:text-3xl font-extrabold text-black tracking-tight leading-none">ESSYRISE</span>
    <span className="text-[9px] md:text-[10px] font-semibold text-gray-400 tracking-[0.2em] uppercase mt-1 leading-none">electronics</span>
  </Link>
);

export default async function Header() {
  // Fetch categories directly from the database to avoid Server Action render errors
  let categories: Category[] = [];
  try {
    categories = await queryD1<Category>(
      "SELECT * FROM categories WHERE is_active = 1 ORDER BY name ASC"
    );
  } catch (error) {
    console.error("Failed to fetch header categories:", error);
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ======================= */}
        {/*       MOBILE VIEW       */}
        {/* ======================= */}
        <div className="flex items-center justify-between h-14 md:!hidden">
          <div className="flex-none">
            {/* Uses the client wrapper so the hamburger menu opens reliably on tap */}
            <MobileMenuWrapper categories={categories} />
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
        <div className="!hidden md:!flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Logo />
          </div>

          <div className="flex items-center gap-6 lg:gap-8 ml-8">
            <Link href="/" className="text-[15px] font-bold text-gray-800 hover:text-[#0076c0]">
              Home
            </Link>

            {/* Desktop Categories Dropdown with Thumbnails */}
            <div className="relative group py-6">
              <button className="flex items-center text-[15px] font-bold text-gray-800 group-hover:text-[#0076c0] gap-1 outline-none">
                Categories <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-[#0076c0] transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-[60px] left-0 w-64 bg-white border border-gray-100 shadow-xl rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 space-y-1">
                {categories.length === 0 ? (
                  <p className="px-4 py-2 text-sm text-gray-500">No categories found</p>
                ) : (
                  categories.map((cat) => (
                    <Link 
                      key={cat.slug} 
                      href={`/category/${cat.slug}`} 
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#0076c0] rounded-xl transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0 p-0.5">
                        {cat.image_url ? (
                          <Image src={cat.image_url} alt={cat.name} width={32} height={32} className="object-contain w-full h-full" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <span className="truncate">{cat.name}</span>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <Link href="/shop" className="text-[15px] font-bold text-gray-800 hover:text-[#0076c0]">
              View All
            </Link>
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
