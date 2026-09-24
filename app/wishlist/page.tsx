'use client';

import Link from 'next/link';
import { useStore } from '@/lib/context/StoreContext';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, isHydrated } = useStore();

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse w-8 h-8 rounded-full bg-gray-300"></div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center max-w-md w-full">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h1>
          <p className="text-gray-500 mb-8">Save items you like by clicking the heart icon on any product.</p>
          <Link 
            href="/shop" 
            className="inline-block bg-[#0076c0] text-white px-8 py-3.5 rounded-full font-bold hover:bg-blue-700 transition-colors w-full"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Wishlist ({wishlist.length})</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div 
              key={item.id} 
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between"
            >
              <div>
                <div className="w-full h-48 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center p-4 relative mb-4 overflow-hidden">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
                  ) : (
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                  )}
                  <button 
                    onClick={() => toggleWishlist(item)}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-red-500 hover:bg-white shadow-xs transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <Link href={`/products/${item.slug}`} className="font-bold text-gray-900 hover:text-[#0076c0] transition-colors line-clamp-2 mb-1">
                  {item.name}
                </Link>
                <p className="text-[#0076c0] font-extrabold mb-4">UGX {item.price.toLocaleString()}</p>
              </div>

              <button
                onClick={() => {
                  addToCart(item);
                  toggleWishlist(item); // Optional: remove from wishlist once moved to cart
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#0076c0] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm text-sm"
              >
                <ShoppingBag className="w-4 h-4" /> Move to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
