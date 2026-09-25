export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug } from "@/lib/actions/products";
import { formatUGX } from "@/lib/utils";
import ProductGallery from "@/components/products/ProductGallery";
import ShareButton from "@/components/products/ShareButton";
import ProductActions from "@/components/products/ProductActions";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Essyrise Electronics`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0]?.image_url || ""],
    },
  };
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const isOutOfStock = product.availability === "OUT OF STOCK";
  
  // Use the discount price if it exists, otherwise fall back to regular price
  const activePrice = product.discount_price || product.price;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      <nav className="text-sm text-gray-500 mb-8 font-medium">
        <Link href="/" className="hover:text-brand-primary hover:text-[#0076c0] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-brand-primary hover:text-[#0076c0] transition-colors">Shop</Link>
        <span className="mx-2">/</span>
        <Link href={`/category/${product.category_id}`} className="hover:text-brand-primary hover:text-[#0076c0] transition-colors">
          {product.category_name}
        </Link>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        <div className="flex flex-col">
          <div className="mb-6 border-b border-gray-100 pb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-charcoal text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-4">
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                isOutOfStock ? "bg-gray-200 text-gray-600" : 
                product.availability === "LIMITED STOCK" ? "bg-orange-100 text-orange-700" : 
                "bg-green-100 text-green-700"
              }`}>
                {product.availability}
              </span>
              {product.is_new_arrival === true && (
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-[#0076c0] border border-blue-100">
                  NEW ARRIVAL
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-4 mt-4">
              {product.discount_price ? (
                <>
                  <span className="text-3xl font-black text-[#0076c0]">{formatUGX(product.discount_price)}</span>
                  <span className="text-lg text-gray-400 line-through font-medium">{formatUGX(product.price)}</span>
                </>
              ) : (
                <span className="text-3xl font-black text-[#0076c0]">{formatUGX(product.price)}</span>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{product.description}</p>
          </div>

          {/* ACTIONS */}
          <div className="mt-auto pt-6 flex flex-col gap-6">
            {isOutOfStock ? (
              <button 
                disabled 
                className="w-full text-center font-bold py-4 px-8 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
              >
                Out of Stock
              </button>
            ) : (
              <ProductActions 
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: activePrice,
                  image_url: product.images?.[0]?.image_url || null
                }} 
              />
            )}

            <div className="border-t border-gray-100 pt-6 mt-2 flex items-center justify-between">
               <span className="text-sm font-medium text-gray-500">Love this product?</span>
               <ShareButton title={product.name} text={`Check out the ${product.name} at Essyrise Electronics!`} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
