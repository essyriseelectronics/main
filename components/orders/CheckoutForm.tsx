"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types";
import { formatUGX, generateOrderNumber } from "@/lib/utils";

interface CheckoutFormProps {
  product: Product;
}

export default function CheckoutForm({ product }: CheckoutFormProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activePrice = product.discount_price || product.price;
  const total = activePrice * quantity;
  const primaryImage = product.images.find(img => img.is_primary)?.image_url || product.images[0]?.image_url;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // In Phase 2, this will be a real POST request to our Server Action / D1 Database
    // For now, we simulate network delay and redirect to success page
    setTimeout(() => {
      const mockOrderNumber = generateOrderNumber(Math.floor(Math.random() * 1000));
      router.push(`/order/success/${mockOrderNumber}`);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT: FORM */}
      <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-brand-charcoal mb-6">Delivery Details</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input required type="text" className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input required type="tel" className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm" placeholder="0700 000 000" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City / Location *</label>
              <input required type="text" className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm" placeholder="Mbarara" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input 
                required 
                type="number" 
                min="1" 
                max="10"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
            <input required type="text" className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm" placeholder="High Street, Next to Post Office" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Note (Optional)</label>
            <textarea rows={3} className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm" placeholder="Any specific instructions for delivery..."></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-4 rounded-xl transition-colors shadow-lg disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {isSubmitting ? "Processing Order..." : "Place Order"}
          </button>
        </form>
      </div>

      {/* RIGHT: ORDER SUMMARY */}
      <div className="lg:col-span-5 bg-brand-surface p-6 md:p-8 rounded-2xl border border-gray-200 sticky top-24">
        <h2 className="text-xl font-bold text-brand-charcoal mb-6">Order Summary</h2>
        
        <div className="flex gap-4 items-center mb-6 border-b border-gray-200 pb-6">
          <div className="w-20 h-20 relative rounded-lg overflow-hidden border border-gray-200 bg-white flex-shrink-0">
            {primaryImage && <Image src={primaryImage} alt={product.name} fill className="object-cover" />}
          </div>
          <div>
            <h3 className="font-semibold text-brand-charcoal line-clamp-2">{product.name}</h3>
            <p className="text-brand-primary font-bold mt-1">{formatUGX(activePrice)}</p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-gray-600 mb-6 border-b border-gray-200 pb-6">
          <div className="flex justify-between">
            <span>Price</span>
            <span>{formatUGX(activePrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>Quantity</span>
            <span>x {quantity}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Delivery</span>
            <span>Calculated after confirmation</span>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <span className="font-bold text-brand-charcoal text-lg">Total</span>
          <span className="text-2xl font-black text-brand-primary">{formatUGX(total)}</span>
        </div>
      </div>
      
    </div>
  );
}
