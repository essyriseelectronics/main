"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  ShoppingBag,
  Heart,
  User,
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Portal is only available after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent the page behind the drawer from scrolling
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close drawer whenever navigation changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
  }, [pathname]);

  // Close drawer with Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* =========================================================
          DESKTOP HEADER
          Only exists at md and above
      ========================================================= */}

      <nav className="hidden md:block sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-baseline select-none text-2xl font-black tracking-tight text-brand-primary"
            >
              ESSYRISE
              <span className="text-brand-accent text-3xl">
                .
              </span>
            </Link>

            {/* Desktop navigation */}
            <div className="flex items-center space-x-8 xl:space-x-10">

              {/* Home */}
              <Link
                href="/"
                className="text-gray-600 hover:text-brand-primary font-medium transition-colors"
              >
                Home
              </Link>

              {/* Categories */}
              <div className="relative group h-20 flex items-center">

                <button
                  type="button"
                  className="flex items-center text-gray-600 hover:text-brand-primary font-medium transition-colors outline-none"
                >
                  Categories

                  <ChevronDown
                    className="h-4 w-4 ml-1 opacity-50 transition-transform duration-200 group-hover:rotate-180"
                  />
                </button>

                <div className="absolute top-full left-0 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">

                  <Link
                    href="/category/smartphones"
                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-primary rounded-xl transition-colors"
                  >
                    Smartphones & Phones
                  </Link>

                  <Link
                    href="/category/phone-accessories"
                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-primary rounded-xl transition-colors"
                  >
                    Accessories & Chargers
                  </Link>

                </div>
              </div>

              {/* View All */}
              <Link
                href="/shop"
                className="text-gray-600 hover:text-brand-primary font-medium transition-colors"
              >
                View All
              </Link>

            </div>

            {/* Desktop utilities */}
            <div className="flex items-center space-x-6">

              {/* Search */}
              <button
                type="button"
                aria-label="Search"
                className="p-2 text-gray-600 hover:text-brand-primary transition-colors"
              >
                <Search
                  className="h-5 w-5"
                  strokeWidth={1.6}
                />
              </button>

              {/* Authentication */}
              <div className="flex items-center space-x-3">

                <Link
                  href="/login"
                  className="text-gray-600 hover:text-brand-primary font-medium transition-colors"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="bg-brand-primary text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-colors shadow-sm"
                >
                  Register
                </Link>

              </div>

              {/* Cart */}
              <Link
                href="/cart"
                aria-label="Cart"
                className="relative p-2 text-gray-600 hover:text-brand-primary transition-colors"
              >
                <ShoppingBag
                  className="h-5 w-5"
                  strokeWidth={1.6}
                />

                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  0
                </span>
              </Link>

            </div>
          </div>
        </div>
      </nav>

      {/* =========================================================
          MOBILE HEADER
          Only exists below md
      ========================================================= */}

      <nav className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-100">

        <div className="relative flex items-center justify-between h-16 px-4">

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
            className="w-11 h-11 -ml-2 flex items-center justify-center text-gray-800 rounded-md active:bg-gray-50"
          >
            <Menu
              className="h-6 w-6"
              strokeWidth={1.7}
            />
          </button>

          {/* Center logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-baseline select-none text-2xl font-black tracking-tight text-brand-primary"
          >
            ESSYRISE
            <span className="text-brand-accent text-3xl">
              .
            </span>
          </Link>

          {/* Mobile utilities */}
          <div className="flex items-center">

            {/* Search */}
            <button
              type="button"
              aria-label="Search"
              className="w-11 h-11 flex items-center justify-center text-gray-700"
            >
              <Search
                className="h-5 w-5"
                strokeWidth={1.6}
              />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative w-11 h-11 flex items-center justify-center text-gray-700"
            >
              <ShoppingBag
                className="h-5 w-5"
                strokeWidth={1.6}
              />

              <span className="absolute top-1 right-0 w-4 h-4 bg-brand-accent text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                0
              </span>
            </Link>

          </div>
        </div>
      </nav>

      {/* =========================================================
          MOBILE DRAWER
          
          Rendered directly into document.body.
          This prevents it from interfering with the header.
      ========================================================= */}

      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-[9999] md:hidden ${
              mobileMenuOpen
                ? "pointer-events-auto"
                : "pointer-events-none"
            }`}
          >

            {/* ===================================================
                BACKDROP
            =================================================== */}

            <div
              className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                mobileMenuOpen
                  ? "opacity-100"
                  : "opacity-0"
              }`}
              onClick={closeMobileMenu}
            />

            {/* ===================================================
                DRAWER
            =================================================== */}

            <aside
              className={`absolute left-0 top-0 bottom-0 w-[85vw] max-w-[390px] bg-white flex flex-col shadow-[4px_0_18px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out ${
                mobileMenuOpen
                  ? "translate-x-0"
                  : "-translate-x-full"
              }`}
              aria-label="Mobile navigation"
            >

              {/* =================================================
                  DRAWER HEADER
              ================================================= */}

              <div className="h-[76px] shrink-0 px-7 flex items-center justify-between border-b border-gray-200">

                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="flex items-baseline select-none text-2xl font-black tracking-tight text-brand-primary"
                >
                  ESSYRISE
                  <span className="text-brand-accent text-3xl">
                    .
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={closeMobileMenu}
                  aria-label="Close menu"
                  className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <X
                    className="h-7 w-7"
                    strokeWidth={1.7}
                  />
                </button>

              </div>

              {/* =================================================
                  NAVIGATION AREA
              ================================================= */}

              <div className="flex-1 overflow-y-auto">

                {/* HOME */}
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className={`h-[74px] px-8 flex items-center border-b border-gray-200 text-[17px] font-normal transition-colors ${
                    isActive("/")
                      ? "text-brand-primary"
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  Home
                </Link>

                {/* =================================================
                    SHOP BY CATEGORY
                ================================================= */}

                <div className="border-b border-gray-200">

                  <button
                    type="button"
                    onClick={() =>
                      setCategoriesOpen((current) => !current)
                    }
                    className="w-full h-[74px] px-8 flex items-center justify-between text-left text-[17px] font-normal text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    <span>
                      Shop by Category
                    </span>

                    <ChevronRight
                      className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                        categoriesOpen
                          ? "rotate-90"
                          : ""
                      }`}
                      strokeWidth={1.6}
                    />
                  </button>

                  {/* Category submenu */}
                  {categoriesOpen && (
                    <div className="bg-gray-50 border-t border-gray-200">

                      <Link
                        href="/category/smartphones"
                        onClick={closeMobileMenu}
                        className="h-[58px] px-12 flex items-center justify-between border-b border-gray-200 text-[15px] text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <span>
                          Smartphones & Phones
                        </span>

                        <ChevronRight
                          className="h-4 w-4 text-gray-400"
                          strokeWidth={1.6}
                        />
                      </Link>

                      <Link
                        href="/category/phone-accessories"
                        onClick={closeMobileMenu}
                        className="h-[58px] px-12 flex items-center justify-between text-[15px] text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <span>
                          Accessories & Chargers
                        </span>

                        <ChevronRight
                          className="h-4 w-4 text-gray-400"
                          strokeWidth={1.6}
                        />
                      </Link>

                    </div>
                  )}

                </div>

                {/* VIEW ALL */}
                <Link
                  href="/shop"
                  onClick={closeMobileMenu}
                  className={`h-[74px] px-8 flex items-center border-b border-gray-200 text-[17px] font-normal transition-colors ${
                    isActive("/shop")
                      ? "text-brand-primary"
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  View All
                </Link>

                {/* =================================================
                    CART
                ================================================= */}

                <Link
                  href="/cart"
                  onClick={closeMobileMenu}
                  className={`h-[74px] px-8 flex items-center justify-between border-b border-gray-200 transition-colors ${
                    isActive("/cart")
                      ? "bg-gray-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center text-[17px] text-gray-800">

                    <ShoppingBag
                      className="h-6 w-6 mr-5 text-brand-primary"
                      strokeWidth={1.7}
                    />

                    <span>
                      Cart
                    </span>

                  </div>

                  <span className="text-[16px] text-gray-400">
                    0 Items
                  </span>
                </Link>

                {/* =================================================
                    LISTS
                ================================================= */}

                <Link
                  href="/wishlist"
                  onClick={closeMobileMenu}
                  className={`h-[74px] px-8 flex items-center border-b border-gray-200 text-[17px] transition-colors ${
                    isActive("/wishlist")
                      ? "bg-gray-50 text-brand-primary"
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <Heart
                    className="h-6 w-6 mr-5 text-brand-accent"
                    strokeWidth={1.7}
                  />

                  <span>
                    Lists
                  </span>
                </Link>

              </div>

              {/* =================================================
                  BOTTOM AUTHENTICATION
              ================================================= */}

              <div className="shrink-0 bg-gray-50 border-t border-gray-200 px-7 py-7">

                <div className="flex items-center">

                  {/* Login */}
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="h-[56px] flex-[1.1] flex items-center justify-center bg-brand-primary text-white rounded-full text-[16px] font-semibold hover:opacity-90 transition-opacity"
                  >
                    <User
                      className="h-5 w-5 mr-2"
                      strokeWidth={2}
                    />

                    Login
                  </Link>

                  {/* Register */}
                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="h-[56px] flex-1 flex items-center justify-center text-brand-primary text-[16px] font-semibold hover:opacity-70 transition-opacity"
                  >
                    Register
                  </Link>

                </div>

              </div>

            </aside>
          </div>,
          document.body
        )}
    </>
  );
}