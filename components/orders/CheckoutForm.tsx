'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { StoreItem, useStore } from '@/lib/context/StoreContext';
import { User, Phone, MapPin, Loader2, CheckCircle2 } from 'lucide-react';

export type CheckoutFormProps = {
  cartItems: StoreItem[];
  cartTotal: number;
};

export default function CheckoutForm({ cartItems, cartTotal }: CheckoutFormProps) {
  const router = useRouter();
  const { clearCart } = useStore();
  
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.currentTarget);
    
    // Attach the cart data to the submission payload
    const orderPayload = {
      firstName: formData.get('first_name'),
      lastName: formData.get('last_name'),
      phone: formData.get('phone'),
      location: formData.get('location'),
      address: formData.get('address'),
      items: cartItems, // The array of products from the cart
      total: cartTotal,
    };

    startTransition(async () => {
      try {
        // TODO: Replace this timeout with your actual server action to save the order
        // const result = await placeMultiItemOrder(orderPayload);
        
        // Simulating network request
        await new Promise((resolve) => setTimeout(resolve, 1500)); 
        
        setSuccess(true);
        clearCart(); // Empty the cart from local storage after successful checkout
        
        // Redirect to a success/thank you page
        setTimeout(() => {
          router.push('/'); 
        }, 2000);
      } catch (err) {
        setError('Failed to process your order. Please try again.');
      }
    });
  };

  if (success) {
    return (
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-emerald-100 text-center max-w-2xl mx-auto">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
        <p className="text-gray-500 mb-8">
          Thank you for shopping with EssyRise Electronics. We will contact you shortly to confirm delivery.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Checkout Form */}
      <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Details</h2>
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="first_name"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0] sm:text-sm"
                  placeholder="John"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="last_name"
                required
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0] sm:text-sm"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0] sm:text-sm"
                placeholder="07XXXXXXXX"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City / Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="location"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0] sm:text-sm"
                  placeholder="e.g., Mbarara Town"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Address</label>
              <input
                type="text"
                name="address"
                required
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0] sm:text-sm"
                placeholder="Street name, building, etc."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center items-center py-4 px-4 rounded-xl text-base font-bold text-white bg-[#0076c0] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0076c0] disabled:opacity-70 transition-colors mt-8"
          >
            {isPending ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              `Confirm Order • UGX ${cartTotal.toLocaleString()}`
            )}
          </button>
        </form>
      </div>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Your Order</h2>
        
        <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
              <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 p-1 border border-gray-100">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-[#0076c0]">
                UGX {(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-6 space-y-4">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-semibold text-gray-900">UGX {cartTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span className="text-gray-500 italic text-sm">Calculated post-order</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-2xl font-extrabold text-[#0076c0]">UGX {cartTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
