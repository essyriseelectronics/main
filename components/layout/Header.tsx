"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, ShoppingBag } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* BRANDING */}
        <Link href="/" className="text-xl md:text-2xl font-extrabold tracking-tight text-brand-primary flex items-center gap-1">
          ESSYRISE<span className="text-brand-accent">.</span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-brand-charcoal">
          <Link href="/" className="hover:text-brand-accent transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-brand-accent transition-colors">Shop</Link>
          <Link href="/category/phones" className="hover:text-brand-accent transition-colors">Phones</Link>
          <Link href="/category/phone-accessories" className="hover:text-brand-accent transition-colors">Accessories</Link>
        </nav>

        {/* UTILITY ICONS (Search & Cart/Contact) */}
        <div className="hidden md:flex items-center gap-4 text-brand-charcoal">
          <button className="p-2 hover:text-brand-primary transition-colors" aria-label="Search">
            <Search className="w-5 h-5" />
          </button>
          <Link href="#contact" className="bg-brand-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand-secondary transition-colors">
            Contact Us
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex md:hidden items-center gap-2">
          <button className="p-2 text-brand-charcoal" aria-label="Search">
            <Search className="w-5 h-5" />
          </button>
          <button 
            className="p-2 text-brand-charcoal"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-lg py-4 px-4 flex flex-col gap-4 z-40">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-brand-charcoal font-medium border-b border-gray-50">Home</Link>
          <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-brand-charcoal font-medium border-b border-gray-50">Shop All</Link>
          <Link href="/category/phones" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-brand-charcoal font-medium border-b border-gray-50">Phones</Link>
          <Link href="/category/phone-accessories" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-brand-charcoal font-medium border-b border-gray-50">Accessories</Link>
          <Link href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-brand-accent font-bold mt-2">Contact Us</Link>
        </div>
      )}
    </header>
  );
}
