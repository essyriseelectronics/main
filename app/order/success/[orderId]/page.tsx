import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Confirmed | Essyrise Electronics",
};

export default async function OrderSuccessPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = await params;
  const orderNumber = resolvedParams.orderId;

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-2xl text-center">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
        <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-charcoal mb-4">
          Order Received Successfully!
        </h1>
        
        <p className="text-gray-600 mb-8 text-lg">
          Thank you for ordering from Essyrise Electronics. We have received your order and will contact you shortly to confirm delivery details.
        </p>

        <div className="bg-brand-surface border border-gray-200 w-full rounded-xl p-6 mb-8">
          <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Your Order Number</p>
          <p className="text-2xl font-black text-brand-primary tracking-wider">{orderNumber}</p>
        </div>

        <Link 
          href="/shop"
          className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-4 px-10 rounded-full transition-all shadow-lg"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
