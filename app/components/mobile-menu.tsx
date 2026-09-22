// app/components/mobile-menu.tsx
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, ChevronDown, HelpCircle, Briefcase, ChevronRight, Shield } from 'lucide-react';

type MobileMenuProps = {
  hasSession: boolean;
  isAdmin: boolean;
  categories: { name: string; slug: string }[];
};

export default function MobileMenu({ hasSession, isAdmin, categories }: MobileMenuProps) {
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
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />

          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-300">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">

              {/* NEW PURE TEXT LOGO FOR MOBILE */}
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-baseline outline-none select-none">
                <span className="text-2xl font-extrabold text-[#0D4A38] tracking-tight">etomu</span>
                <span className="text-2xl font-medium text-emerald-500 tracking-tight">.com</span>
              </Link>

              <button onClick={() => setIsOpen(false)} className="p-2 text-black hover:bg-gray-100 rounded-lg transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
              {isAdmin && (
                <Link href="/admin" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl font-bold transition-colors bg-purple-50 text-purple-700 flex items-center mb-4 border border-purple-100">
                  <Shield className="h-5 w-5 mr-3" />
                  Admin Dashboard
                </Link>
              )}

              <Link href="/" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl font-bold transition-colors ${isActive('/') ? 'bg-emerald-50 text-black' : 'text-black hover:bg-gray-50'}`}>
                Home
              </Link>

              <Link href="/tasks/new" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl font-bold transition-colors ${isActive('/tasks/new') ? 'bg-emerald-50 text-black' : 'text-black hover:bg-gray-50'}`}>
                Post a Task
              </Link>

              <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50/50">
                <button onClick={() => toggleDropdown('categories')} className="flex items-center justify-between w-full px-4 py-3 font-bold text-black hover:bg-gray-100 transition-colors">
                  <span className="flex items-center"><Briefcase className="h-5 w-5 mr-3 text-black" /> Top Services</span>
                  <ChevronDown className={`h-4 w-4 text-black transition-transform ${activeDropdown === 'categories' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'categories' && (
                  <div className="bg-white border-t border-gray-100 flex flex-col">
                    {categories.length === 0 ? (
                       <span className="px-12 py-3 text-sm text-gray-500">Loading...</span>
                    ) : (
                      categories.map((cat) => (
                        <Link key={cat.slug} href={`/search?category=${cat.slug}`} onClick={() => setIsOpen(false)} className={`px-12 py-3 text-sm font-medium flex items-center justify-between transition-colors ${isActive(`/search?category=${cat.slug}`) ? 'bg-emerald-50 text-black' : 'text-black hover:bg-gray-50'}`}>
                          {cat.name} <ChevronRight className="h-4 w-4 opacity-50" />
                        </Link>
                      ))
                    )}
                    <Link href="/search" onClick={() => setIsOpen(false)} className="px-12 py-3 text-sm font-bold text-[#0D4A38] hover:bg-emerald-50 border-t border-gray-50 mt-1">
                      View all services &rarr;
                    </Link>
                  </div>
                )}
              </div>

              <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50/50">
                <button onClick={() => toggleDropdown('help')} className="flex items-center justify-between w-full px-4 py-3 font-bold text-black hover:bg-gray-100 transition-colors">
                  <span className="flex items-center"><HelpCircle className="h-5 w-5 mr-3 text-black" /> Quick Help</span>
                  <ChevronDown className={`h-4 w-4 text-black transition-transform ${activeDropdown === 'help' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'help' && (
                  <div className="bg-white border-t border-gray-100 flex flex-col">
                    <Link href="/how-it-works" onClick={() => setIsOpen(false)} className={`px-12 py-3 text-sm font-medium transition-colors ${isActive('/how-it-works') ? 'bg-emerald-50 text-black' : 'text-black hover:bg-gray-50'}`}>How Etomu Works</Link>
                    <Link href="/faq" onClick={() => setIsOpen(false)} className={`px-12 py-3 text-sm font-medium transition-colors ${isActive('/faq') ? 'bg-emerald-50 text-black' : 'text-black hover:bg-gray-50'}`}>Frequently Asked Questions</Link>
                    <Link href="/contact" onClick={() => setIsOpen(false)} className={`px-12 py-3 text-sm font-medium transition-colors ${isActive('/contact') ? 'bg-emerald-50 text-black' : 'text-black hover:bg-gray-50'}`}>Contact Support</Link>
                  </div>
                )}
              </div>

              {!hasSession && (
                <Link href="/become-provider" onClick={() => setIsOpen(false)} className={`block px-4 py-3 mt-4 rounded-xl font-bold transition-colors ${isActive('/become-provider') ? 'bg-emerald-50 text-black' : 'text-black bg-gray-50 hover:bg-gray-100'}`}>
                  Become a Provider
                </Link>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
              {hasSession ? (
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center justify-center w-full bg-[#0D4A38] text-white px-4 py-3.5 rounded-xl font-bold shadow-sm hover:bg-emerald-900 transition-colors">
                  <User className="h-5 w-5 mr-2 text-white" /> Go to Dashboard
                </Link>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center w-full bg-[#0D4A38] text-white px-4 py-3.5 rounded-xl font-bold shadow-sm hover:bg-emerald-900 transition-colors">
                  Log In or Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
