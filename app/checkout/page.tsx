'use client';

import Link from 'next/link';
import { useStore } from '@/lib/context/StoreContext';
import CheckoutForm from '@/components/orders/CheckoutForm';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, cartTotal, isHydrated } = useStore();

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse w-8 h-8 rounded-full bg-gray-300"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center max-w-md w-full">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">You need items in your cart to proceed to checkout.</p>
          <Link 
            href="/shop" 
            className="inline-block bg-[#0076c0] text-white px-8 py-3.5 rounded-full font-bold hover:bg-blue-700 transition-colors w-full"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Link href="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0076c0] mb-8 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        {/* Passing the cart items and total directly to your CheckoutForm component */}
        <CheckoutForm cartItems={cart} cartTotal={cartTotal} />
      </div>
    </div>
  );
}
