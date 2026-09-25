import Link from 'next/link';
import { ChevronDown, ImageIcon, User } from 'lucide-react';
import MobileMenu from './MobileMenu'; 
import CartIcon from './CartIcon'; 
import SearchBar from './SearchBar'; 
import { queryD1 } from "@/lib/db/client"; 
import { Category } from "@/types";
import { getUser } from '@/lib/auth/getUser'; 

const Logo = () => (
  <Link href="/" className="outline-none select-none flex items-center gap-2">
    {/* LOGO IMAGE */}
    <img 
  src="/easy.png" 
  alt="Essyrise Logo" 
  className="w-9 h-8 md:w-9 md:h-10 object-contain scale-125"
/>

    
    {/* LOGO TEXT */}
    <div className="flex flex-col items-start">
      <span className="text-2xl md:text-3xl font-extrabold tracking-tight leading-none flex">
        <span className="text-red-600">ESSY</span>
        <span className="text-[#0076c0]">RISE</span>
      </span>
      <span className="text-[9px] md:text-[10px] font-bold text-[#0076c0] tracking-[0.2em] uppercase mt-0.5 leading-none">
        electronics
      </span>
    </div>
  </Link>
);

export default async function Header() {
  let categories: Category[] = [];

  const user = await getUser();

  try {
    const rawData = await queryD1<Category>(
      "SELECT slug, name, image_url FROM categories WHERE is_active = 1 ORDER BY name ASC"
    );

    const categoryArray = Array.isArray(rawData) ? rawData : (rawData as any)?.results || [];

    categories = categoryArray.map((cat: any) => ({
      slug: String(cat.slug || ''),
      name: String(cat.name || ''),
      image_url: cat.image_url ? String(cat.image_url) : null
    }));

  } catch (error) {
    console.error("Failed to fetch header categories:", error);
    categories = [];
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ======================= */}
        {/*       MOBILE VIEW       */}
        {/* ======================= */}
        <div className="flex items-center justify-between h-16 md:!hidden relative">
          
          {/* Left: Logo */}
          <div className="flex-none">
            <Logo />
          </div>

          {/* Right: Actions (Search -> Cart -> Menu) */}
          <div className="flex-none flex items-center gap-3 sm:gap-4">
            <SearchBar isMobile={true} />
            <CartIcon isMobile={true} />
            <MobileMenu categories={categories} user={user} />
          </div>
          
        </div>

        {/* ======================= */}
        {/*      DESKTOP VIEW       */}
        {/* ======================= */}
        <div className="!hidden md:!flex items-center justify-between h-[72px]">
          <div className="flex-shrink-0">
            <Logo />
          </div>

          <div className="flex items-center gap-6 lg:gap-8 ml-8">
            <Link href="/" className="text-[15px] font-bold text-gray-800 hover:text-[#0076c0] transition-colors">
              Home
            </Link>

            <div className="relative group py-6">
              <button type="button" className="flex items-center text-[15px] font-bold text-gray-800 group-hover:text-[#0076c0] gap-1 outline-none transition-colors">
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
                          <img src={cat.image_url} alt={cat.name} className="object-contain w-full h-full" loading="lazy" />
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

            <Link href="/shop" className="text-[15px] font-bold text-gray-800 hover:text-[#0076c0] transition-colors">
              View All
            </Link>
          </div>

          <div className="flex items-center gap-5 ml-auto">
            
            {/* Dynamic Desktop Search Bar */}
            <SearchBar />
            
            <div className="w-px h-5 bg-gray-200"></div>

            {/* === DYNAMIC AUTHENTICATION UI === */}
            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="text-[15px] font-bold text-red-600 hover:text-red-700 transition-colors">
                    Admin Panel
                  </Link>
                )}
                <Link href="/profile" className="flex items-center gap-2 bg-[#0076c0] text-white px-5 py-1.5 rounded-full text-[15px] font-bold hover:bg-blue-700 transition-colors shadow-sm">
                  <User className="h-4 w-4" />
                  My Account
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[15px] font-bold text-gray-800 hover:text-[#0076c0] transition-colors">
                  Login
                </Link>
                <Link href="/register" className="bg-[#0076c0] text-white px-5 py-1.5 rounded-full text-[15px] font-bold hover:bg-blue-700 transition-colors shadow-sm">
                  Register
                </Link>
              </>
            )}

            <CartIcon />
          </div>
        </div>

      </div>
    </nav>
  );
}
