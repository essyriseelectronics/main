// app/components/navbar.tsx
import Link from 'next/link';
import { cookies, headers } from 'next/headers';
import { User, ChevronDown, Shield } from 'lucide-react';
import MobileMenu from './mobile-menu';
import { queryD1 } from '@/lib/db';

export default async function Navbar() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.has('etomu_session');

  const headersList = await headers();
  const userRole = headersList.get('x-user-role');
  const isAdmin = userRole === 'admin';

  let categories: { name: string; slug: string }[] = [];
  try {
    categories = await queryD1<{ name: string; slug: string }>(
      'SELECT name, slug FROM etomu_categories WHERE is_active = 1 ORDER BY display_order ASC LIMIT 6'
    );
  } catch (error) {
    console.error('Failed to fetch categories for navbar:', error);
  }

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-16">

          {/* NEW PURE TEXT LOGO */}
          <Link href="/" className="flex items-baseline outline-none select-none">
            <span className="text-3xl md:text-4xl font-extrabold text-[#0D4A38] tracking-tight">etomu</span>
            <span className="text-3xl md:text-4xl font-medium text-emerald-500 tracking-tight">.com</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 xl:space-x-10">
            <div className="relative group py-6">
              <button className="flex items-center text-gray-600 hover:text-[#0D4A38] font-medium transition-colors outline-none">
                Find Services <ChevronDown className="h-4 w-4 ml-1 opacity-50 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-[60px] left-0 w-64 bg-white border border-gray-100 shadow-xl rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {categories.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-500">Loading services...</p>
                ) : (
                  categories.map((cat) => (
                    <Link key={cat.slug} href={`/search?category=${cat.slug}`} className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#0D4A38] rounded-xl transition-colors">
                      {cat.name}
                    </Link>
                  ))
                )}
                <div className="border-t border-gray-50 mt-1 pt-1">
                  <Link href="/search" className="block px-4 py-2.5 text-sm font-bold text-[#0D4A38] hover:bg-emerald-50 rounded-xl transition-colors">
                    View all services &rarr;
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative group py-6">
              <button className="flex items-center text-gray-600 hover:text-[#0D4A38] font-medium transition-colors outline-none">
                Resources <ChevronDown className="h-4 w-4 ml-1 opacity-50 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-[60px] left-0 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link href="/how-it-works" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#0D4A38] rounded-xl transition-colors">How it Works</Link>
                <Link href="/faq" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#0D4A38] rounded-xl transition-colors">FAQ</Link>
                <Link href="/contact" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#0D4A38] rounded-xl transition-colors">Contact Support</Link>
              </div>
            </div>

            <Link href="/tasks/new" className="text-gray-600 hover:text-[#0D4A38] font-medium transition-colors">Post a Task</Link>

            {!hasSession && (
              <Link href="/become-provider" className="text-[#0D4A38] font-medium hover:text-emerald-800 transition-colors">Become a Provider</Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {isAdmin && (
              <Link href="/admin" className="flex items-center justify-center bg-purple-50 text-purple-700 px-4 py-2 rounded-xl font-medium hover:bg-purple-100 transition-colors">
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Link>
            )}
            {hasSession ? (
              <Link href="/dashboard" className="flex items-center justify-center bg-emerald-50 text-[#0D4A38] px-4 py-2 rounded-xl font-medium hover:bg-emerald-100 transition-colors">
                <User className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="bg-[#0D4A38] text-white px-5 py-2 rounded-xl font-medium hover:bg-emerald-900 transition-colors shadow-sm">
                Log In
              </Link>
            )}
          </div>

          <MobileMenu hasSession={hasSession} isAdmin={isAdmin} categories={categories} />
        </div>
      </div>
    </nav>
  );
}