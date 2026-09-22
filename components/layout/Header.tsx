import Link from 'next/link';
import { ChevronDown, ShoppingBag } from 'lucide-react';
import MobileMenu from './MobileMenu'; // Resolves the Vercel error

export default function Header() {
  // Replaced DB query with exact categories
  const categories = [
    { name: 'Smartphones & Phones', slug: 'smartphones' },
    { name: 'Accessories & Chargers', slug: 'phone-accessories' }
  ];

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* LOGO */}
          <Link href="/" className="flex items-baseline outline-none select-none">
            <span className="text-2xl md:text-3xl font-black text-brand-primary tracking-tight">ESSYRISE</span>
            <span className="text-2xl md:text-3xl font-black text-brand-accent tracking-tight">.</span>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center space-x-8 xl:space-x-10">
            <Link href="/" className="text-brand-charcoal hover:text-brand-primary font-medium transition-colors">Home</Link>
            
            <div className="relative group py-6">
              <button className="flex items-center text-brand-charcoal hover:text-brand-primary font-medium transition-colors outline-none cursor-pointer">
                Categories <ChevronDown className="h-4 w-4 ml-1 opacity-50 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-[65px] left-0 w-64 bg-white border border-gray-100 shadow-xl rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {categories.map((cat) => (
                  <Link key={cat.slug} href={`/category/${cat.slug}`} className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-primary rounded-xl transition-colors">
                    {cat.name}
                  </Link>
                ))}
                <div className="border-t border-gray-50 mt-1 pt-1">
                  <Link href="/shop" className="block px-4 py-2.5 text-sm font-bold text-brand-primary hover:bg-gray-50 rounded-xl transition-colors">
                    View all products &rarr;
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/shop" className="text-brand-charcoal hover:text-brand-primary font-medium transition-colors">View All</Link>
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-brand-charcoal hover:text-brand-primary font-medium transition-colors px-2">
              Login
            </Link>
            <Link href="/register" className="bg-brand-primary text-white px-5 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-colors shadow-sm">
              Register
            </Link>
            <Link href="/cart" className="relative p-2 text-brand-charcoal hover:text-brand-primary transition-colors ml-2">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full">0</span>
            </Link>
          </div>

          {/* MOBILE MENU (Trigger + Drawer) */}
          <MobileMenu categories={categories} />
        </div>
      </div>
    </nav>
  );
}
