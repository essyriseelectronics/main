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
  
  // Custom WhatsApp message pre-filled with the product name
  const waMessage = `Hi Essyrise Electronics, I would like to inquire about: ${product.name}`;

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
          <div className="mt-auto pt-6 flex flex-col gap-4">
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

            {/* NEW: Direct WhatsApp Inquiry Button */}
            <a 
              href={`https://wa.me/256758288233?text=${encodeURIComponent(waMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 font-bold py-4 px-8 rounded-xl bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964 1.026-3.565c-.642-1.06-1.002-2.316-1.002-3.58 0-4.004 3.281-7.254 7.288-7.254 3.992 0 7.254 3.254 7.254 7.254s-3.262 7.254-7.288 7.254z"/>
              </svg>
              Inquire on WhatsApp
            </a>

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
