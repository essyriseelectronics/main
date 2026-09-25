'use client';

import { useState } from 'react';
import { useStore } from '@/lib/context/StoreContext';
import { ShoppingBag, Heart, Check, Minus, Plus } from 'lucide-react';

type ProductActionsProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image_url: string | null;
  };
};

export default function ProductActions({ product }: ProductActionsProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const isLiked = isInWishlist(product.id);

  const handleAddToCart = () => {
    // Add multiple quantities at once by looping, or adjust your context to accept a quantity parameter.
    // Since our current context addToCart adds 1, we can call it multiple times, OR
    // better yet, we pass a custom item object to a modified context, but for now we'll do:
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000); // Reset button after 2 seconds
  };

  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="font-medium text-gray-700">Quantity:</span>
        <div className="flex items-center bg-gray-50 rounded-full border border-gray-200">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-bold text-gray-900">
            {quantity}
          </span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleAddToCart}
          className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white transition-all duration-200 shadow-sm ${
            isAdded ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-[#0076c0] hover:bg-blue-700'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-5 h-5" /> Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" /> Add to Cart
            </>
          )}
        </button>

        <button
          onClick={() => toggleWishlist(product)}
          className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 transition-colors ${
            isLiked 
              ? 'border-red-100 bg-red-50 text-red-500' 
              : 'border-gray-200 bg-white text-gray-400 hover:border-red-100 hover:text-red-500'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500' : ''}`} />
        </button>
      </div>
    </div>
  );
}
