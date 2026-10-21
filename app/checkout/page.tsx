"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/context/StoreContext";
import { createOrder } from "@/lib/actions/orders";
import { Loader2, CheckCircle2, Smartphone, Truck } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, isHydrated, removeFromCart } = useStore();

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ orderNumber: string; message?: string } | null>(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    location: "Mbarara",
    address: "",
    paymentMethod: "mobile_money" as "mobile_money" | "cash_on_delivery"
  });

  if (!isHydrated) return null;

  // Prevent checkout if cart is empty
  if (cart.length === 0 && !successData) {
    router.push("/cart");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await createOrder({
      ...formData,
      items: cart,
      total: cartTotal
    });

    if (!res.success) {
      setError(res.error || "Failed to process order.");
      setLoading(false);
      return;
    }

    // Empty the cart locally
    cart.forEach(item => removeFromCart(item.id));

    // Show Success Screen for Mobile Money or COD
    setSuccessData({
      orderNumber: res.orderNumber as string,
      message: res.message // Will contain the "Check your phone for PIN" message if mobile money
    });
    setLoading(false);
  }

  // SUCCESS SCREEN
  if (successData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center max-w-lg w-full border border-gray-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 mb-6">Your order number is <span className="font-bold text-gray-900">#{successData.orderNumber}</span></p>
          
          {successData.message ? (
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm font-medium mb-8">
              {successData.message}
            </div>
          ) : (
            <p className="text-gray-500 mb-8 text-sm">We have received your order and will contact you shortly for delivery.</p>
          )}

          <Link href="/shop" className="inline-block bg-[#0076c0] text-white px-8 py-3.5 rounded-full font-bold hover:bg-blue-700 transition-colors w-full">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // CHECKOUT FORM
  return (
    <div className="min-h-screen bg-gray-50 py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Form Details */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Contact Details */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">First Name</label>
                  <input type="text" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#0076c0]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Last Name</label>
                  <input type="text" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#0076c0]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                  <input type="tel" required placeholder="e.g. 0770000000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#0076c0]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#0076c0]" />
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">City / Region</label>
                  <select required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#0076c0] bg-white">
                    <option value="Mbarara">Mbarara</option>
                    <option value="Kampala">Kampala</option>
                    <option value="Other">Other Region</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Specific Address / Building</label>
                  <textarea required rows={2} placeholder="e.g. BNK Mall, Room BO23" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#0076c0]" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
              <div className="space-y-3">
                
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'mobile_money' ? 'border-[#0076c0] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="mobile_money" checked={formData.paymentMethod === 'mobile_money'} onChange={() => setFormData({...formData, paymentMethod: 'mobile_money'})} className="w-4 h-4 text-[#0076c0] border-gray-300 focus:ring-[#0076c0]" />
                  <Smartphone className={`w-5 h-5 ml-4 ${formData.paymentMethod === 'mobile_money' ? 'text-[#0076c0]' : 'text-gray-400'}`} />
                  <div className="ml-3">
                    <span className="block text-sm font-bold text-gray-900">MTN / Airtel Mobile Money</span>
                    <span className="block text-xs text-gray-500">Pay instantly from your phone</span>
                  </div>
                </label>

                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'cash_on_delivery' ? 'border-[#0076c0] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="cash_on_delivery" checked={formData.paymentMethod === 'cash_on_delivery'} onChange={() => setFormData({...formData, paymentMethod: 'cash_on_delivery'})} className="w-4 h-4 text-[#0076c0] border-gray-300 focus:ring-[#0076c0]" />
                  <Truck className={`w-5 h-5 ml-4 ${formData.paymentMethod === 'cash_on_delivery' ? 'text-[#0076c0]' : 'text-gray-400'}`} />
                  <div className="ml-3">
                    <span className="block text-sm font-bold text-gray-900">Cash on Delivery</span>
                    <span className="block text-xs text-gray-500">Pay when your order arrives</span>
                  </div>
                </label>

              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your Order</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">{item.quantity}x</span>
                      <span className="text-gray-600 line-clamp-1">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900 whitespace-nowrap">UGX {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total to Pay</span>
                  <span className="text-xl font-extrabold text-[#0076c0]">UGX {cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#0076c0] text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Order"}
              </button>
              
              <p className="text-xs text-center text-gray-500 mt-4">
                Payments are securely processed via <span className="text-[#ffcc00] font-bold">MTN momo</span> and <span className="text-red-600 font-bold">AIRTEL money</span>.
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
