import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { formatUGX } from "@/lib/utils";
import ProductGallery from "@/components/products/ProductGallery";
import ShareButton from "@/components/products/ShareButton";

// Dynamic SEO Generation
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === resolvedParams.slug);
  
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Essyrise Electronics`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images.find(img => img.is_primary)?.image_url || ""],
    },
  };
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const isOutOfStock = product.availability === "OUT OF STOCK";

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      {/* BREADCRUMBS */}
      <nav className="text-sm text-gray-500 mb-8 font-medium">
        <Link href="/" className="hover:text-brand-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-brand-primary">Shop</Link>
        <span className="mx-2">/</span>
        <Link href={`/category/${product.category_id}`} className="hover:text-brand-primary">
          {product.category_name}
        </Link>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        
        {/* LEFT: IMAGE GALLERY */}
        <div>
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* RIGHT: PRODUCT INFO */}
        <div className="flex flex-col">
          <div className="mb-6 border-b border-gray-100 pb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-charcoal mb-4 leading-tight">
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
              {product.is_new_arrival && (
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-brand-surface text-brand-primary border border-brand-primary/20">
                  NEW ARRIVAL
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-4 mt-4">
              {product.discount_price ? (
                <>
                  <span className="text-3xl font-black text-brand-primary">{formatUGX(product.discount_price)}</span>
                  <span className="text-lg text-gray-400 line-through font-medium">{formatUGX(product.price)}</span>
                </>
              ) : (
                <span className="text-3xl font-black text-brand-primary">{formatUGX(product.price)}</span>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-brand-charcoal mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* SPECIFICATIONS */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mb-8 bg-brand-surface p-6 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-brand-charcoal mb-4">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-gray-500 font-medium">{key}</span>
                    <span className="text-brand-charcoal font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-4">
            <Link 
              href={`/order/${product.slug}`}
              className={`flex-grow text-center font-bold py-4 px-8 rounded-full transition-all text-lg shadow-lg ${
                isOutOfStock 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none" 
                  : "bg-brand-accent hover:bg-pink-600 text-white shadow-brand-accent/30"
              }`}
              style={{ pointerEvents: isOutOfStock ? 'none' : 'auto' }}
            >
              {isOutOfStock ? "Out of Stock" : "Order Now"}
            </Link>
            
            <ShareButton 
              title={product.name} 
              text={`Check out the ${product.name} at Essyrise Electronics!`} 
            />
          </div>
          
        </div>
      </div>
    </div>
  );
}
