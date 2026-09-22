"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
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
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /*
   * Lock the main page when the mobile drawer is open.
   */
  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  /*
   * Close the menu when navigating.
   */
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
  }, [pathname]);

  /*
   * Escape key closes the drawer.
   */
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* =====================================================
          DESKTOP HEADER
          Completely independent from mobile navigation.
          ===================================================== */}

      <nav className="hidden md:block bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center h-20">

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
                  className="flex items-center text-gray-600 hover:text-brand-primary font-medium transition-colors"
                >
                  Categories

                  <ChevronDown
                    className="h-4 w-4 ml-1 opacity-50 transition-transform group-hover:rotate-180"
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

              <Link
                href="/shop"
                className="text-gray-600 hover:text-brand-primary font-medium transition-colors"
              >
                View All
              </Link>

            </div>

            {/* Desktop utilities */}
            <div className="flex items-center space-x-6">

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

              <div className="flex items-center space-x-3">

                <Link
                  href="/login"
                  className="text-gray-600 hover:text-brand-primary font-medium transition-colors"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="bg-brand-primary text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-colors"
                >
                  Register
                </Link>

              </div>

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

      {/* =====================================================
          MOBILE HEADER
          Completely separate from desktop.
          ===================================================== */}

      <nav className="md:hidden bg-white sticky top-0 z-50 border-b border-gray-100">

        <div className="h-16 px-4 flex items-center justify-between">

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            className="w-11 h-11 -ml-2 flex items-center justify-center text-gray-800"
          >
            <Menu
              className="h-6 w-6"
              strokeWidth={1.7}
            />
          </button>

          {/* Centered logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-baseline select-none text-2xl font-black tracking-tight text-brand-primary"
          >
            ESSYRISE
            <span className="text-brand-accent text-3xl">
              .
            </span>
          </Link>

          {/* Right utilities */}
          <div className="flex items-center">

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

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative w-11 h-11 flex items-center justify-center text-gray-700"
            >
              <ShoppingBag
                className="h-5 w-5"
                strokeWidth={1.6}
              />

              <span className="absolute top-1 right-0.5 w-4 h-4 bg-brand-accent text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                0
              </span>
            </Link>

          </div>

        </div>
      </nav>

      {/* =====================================================
          MOBILE DRAWER
          
          IMPORTANT:
          This is PORTALED directly to document.body.
          It is therefore completely independent from the
          sticky navbar's stacking/layout context.
          ===================================================== */}

      {mounted &&
        mobileMenuOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] md:hidden">

            {/* Dark backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={closeMobileMenu}
            />

            {/* Drawer */}
            <aside
              className="
                absolute
                left-0
                top-0
                bottom-0
                w-[85vw]
                max-w-[390px]
                bg-white
                flex
                flex-col
                shadow-[4px_0_18px_rgba(0,0,0,0.12)]
                animate-mobile-drawer
              "
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
                  className="w-11 h-11 flex items-center justify-center text-gray-500"
                >
                  <X
                    className="h-7 w-7"
                    strokeWidth={1.7}
                  />
                </button>

              </div>

              {/* =================================================
                  NAVIGATION
                  ================================================= */}

              <div className="flex-1 overflow-y-auto">

                {/* HOME */}
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className={`
                    h-[74px]
                    px-8
                    flex
                    items-center
                    border-b
                    border-gray-200
                    text-[17px]
                    font-normal
                    ${
                      isActive("/")
                        ? "text-brand-primary"
                        : "text-gray-800"
                    }
                  `}
                >
                  Home
                </Link>

                {/* =================================================
                    CATEGORY
                    ================================================= */}

                <div className="border-b border-gray-200">

                  <button
                    type="button"
                    onClick={() =>
                      setCategoriesOpen((value) => !value)
                    }
                    className="w-full h-[74px] px-8 flex items-center justify-between text-left text-[17px] font-normal text-gray-800"
                  >

                    <span>
                      Shop by Category
                    </span>

                    <ChevronRight
                      className={`
                        h-5
                        w-5
                        text-gray-400
                        transition-transform
                        duration-200
                        ${
                          categoriesOpen
                            ? "rotate-90"
                            : ""
                        }
                      `}
                      strokeWidth={1.6}
                    />

                  </button>

                  {/* Category children */}
                  {categoriesOpen && (
                    <div className="bg-gray-50 border-t border-gray-200">

                      <Link
                        href="/category/smartphones"
                        onClick={closeMobileMenu}
                        className="h-[58px] px-12 flex items-center justify-between border-b border-gray-200 text-[15px] text-gray-700"
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
                        className="h-[58px] px-12 flex items-center justify-between text-[15px] text-gray-700"
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
                  className={`
                    h-[74px]
                    px-8
                    flex
                    items-center
                    border-b
                    border-gray-200
                    text-[17px]
                    font-normal
                    ${
                      isActive("/shop")
                        ? "text-brand-primary"
                        : "text-gray-800"
                    }
                  `}
                >
                  View All
                </Link>

                {/* =================================================
                    CART
                    ================================================= */}

                <Link
                  href="/cart"
                  onClick={closeMobileMenu}
                  className="h-[74px] px-8 flex items-center justify-between border-b border-gray-200"
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

                {/* LISTS */}

                <Link
                  href="/wishlist"
                  onClick={closeMobileMenu}
                  className="h-[74px] px-8 flex items-center border-b border-gray-200 text-[17px] text-gray-800"
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
                  BOTTOM AUTH AREA
                  ================================================= */}

              <div className="shrink-0 bg-gray-50 border-t border-gray-200 px-7 py-7">

                <div className="flex items-center">

                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="
                      h-[56px]
                      px-7
                      flex-[1.1]
                      flex
                      items-center
                      justify-center
                      bg-brand-primary
                      text-white
                      rounded-full
                      text-[16px]
                      font-semibold
                    "
                  >
                    <User
                      className="h-5 w-5 mr-2"
                      strokeWidth={2}
                    />

                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="
                      h-[56px]
                      flex-1
                      flex
                      items-center
                      justify-center
                      text-brand-primary
                      text-[16px]
                      font-semibold
                    "
                  >
                    Register
                  </Link>

                </div>

              </div>

            </aside>

            {/* Drawer animation */}
            <style jsx global>{`
              @keyframes mobileDrawerIn {
                from {
                  transform: translateX(-100%);
                }
                to {
                  transform: translateX(0);
                }
              }

              .animate-mobile-drawer {
                animation: mobileDrawerIn 260ms cubic-bezier(0.22, 1, 0.36, 1);
              }
            `}</style>

          </div>,
          document.body
        )}
    </>
  );
}