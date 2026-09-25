"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useStore } from "@/lib/context/StoreContext";

export default function CartIcon({ isMobile }: { isMobile?: boolean }) {
  const { cartCount, isHydrated } = useStore();

  return (
    <Link 
      href="/cart" 
      className={`flex items-center gap-1.5 font-bold transition-colors ${
        isMobile 
          ? "text-gray-700 hover:text-black p-1" 
          : "text-gray-700 hover:text-[#0076c0] ml-2"
      }`}
      aria-label="Cart"
    >
      <ShoppingCart className={isMobile ? "h-6 w-6" : "h-5 w-5"} strokeWidth={2} />
      
      {/* Inline counter number instead of a floating bubble */}
      {isHydrated && cartCount > 0 && (
        <span className={isMobile ? "text-base" : "text-[15px]"}>
          {cartCount}
        </span>
      )}
    </Link>
  );
}
