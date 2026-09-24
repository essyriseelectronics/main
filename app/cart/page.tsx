'use client';

import Link from 'next/link';
import { useStore } from '@/lib/context/StoreContext';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, isHydrated } = useStore();

  // Prevent hydration mismatch
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
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link 
            href="/shop" 
            className="inline-block bg-[#0076c0] text-white px-8 py-3.5 rounded-full font-bold hover:bg-blue-700 transition-colors w-full"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div 
                key={item.id} 
                className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-start sm:items-center"
              >
                {/* Product Image */}
                <div className="w-24 h-24 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center flex-shrink-0 p-2 overflow-hidden">
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <ShoppingBag className="w-8 h-8 text-gray-300" />
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col sm:flex-row justify-between w-full gap-4">
                  <div className="space-y-1">
                    <Link href={`/products/${item.slug}`} className="text-lg font-bold text-gray-900 hover:text-[#0076c0] transition-colors line-clamp-2">
                      {item.name}
                    </Link>
                    <p className="text-[#0076c0] font-semibold">UGX {item.price.toLocaleString()}</p>
                  </div>

                  {/* Actions: Quantity & Remove */}
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-4">
                    <div className="flex items-center bg-gray-50 rounded-full border border-gray-200">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-gray-900 text-sm">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1.5 text-sm font-medium transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sm:hidden">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">UGX {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-gray-500 italic">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-extrabold text-[#0076c0]">UGX {cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <Link 
                href="/checkout" 
                className="w-full flex items-center justify-center gap-2 bg-[#0076c0] text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
