import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import CheckoutForm from "@/components/orders/CheckoutForm";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Secure Checkout | Essyrise Electronics",
};

export default async function OrderPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // Prevent ordering out of stock items
  if (product.availability === "OUT OF STOCK") {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-brand-charcoal mb-4">Product Out of Stock</h1>
        <p className="text-gray-500 mb-8">Sorry, {product.name} is currently out of stock and cannot be ordered.</p>
        <Link href={`/products/${product.slug}`} className="bg-brand-primary text-white px-6 py-3 rounded-full font-semibold">
          Return to Product
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8">
        <Link href={`/products/${product.slug}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-primary mb-8 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Product
        </Link>
        
        <CheckoutForm product={product} />
      </div>
    </div>
  );
}
