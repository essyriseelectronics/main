export const dynamic = "force-dynamic";

import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import NewsletterForm from "@/components/marketing/NewsletterForm";
import CategoryGrid from "@/components/categories/CategoryGrid";
import { getProducts, getCategories } from "@/lib/actions/products";

export default async function Home() {
  const products = await getProducts();
  const categories = await getCategories();

  // 1. Filter out ONLY the featured products
  const featuredProducts = products.filter(p => p.is_featured);
  
  // 2. Filter out the non-featured products and grab the latest 20
  const regularProducts = products.filter(p => !p.is_featured).slice(0, 20);

  return (
    <div>
      {/* DYNAMIC CATEGORIES (Reduced padding from py-16 to py-8 md:py-10) */}
      <section className="py-8 md:py-10 bg-gray-50 border-b border-gray-200">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8 md:mb-10">
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 relative inline-block">
              Shop by Category
              <span className="absolute -bottom-3 left-0 w-[115%] h-1.5 bg-[#0076c0] rounded-full"></span>
            </h2>
          </div>
          <CategoryGrid categories={categories} />
        </div>
      </section>

      {/* FEATURED PRODUCTS (Reduced padding from pt-16 to pt-8 md:pt-10) */}
      {featuredProducts.length > 0 && (
        <section className="pt-8 md:pt-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8 md:mb-10">
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 relative inline-block">
              Featured Deals
              <span className="absolute -bottom-3 left-0 w-[115%] h-1.5 bg-[#0076c0] rounded-full"></span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* LATEST ARRIVALS (Reduced padding from py-16 to py-10 md:py-12) */}
      <section className="py-10 md:py-12 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8 md:mb-10">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 relative inline-block">
            Latest Arrivals
            <span className="absolute -bottom-3 left-0 w-[115%] h-1.5 bg-[#0076c0] rounded-full"></span>
          </h2>
        </div>

        {regularProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
              {regularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {/* VIEW ALL CALL TO ACTION */}
            <div className="mt-12 flex flex-col items-center text-center">
              <p className="text-gray-500 max-w-lg mx-auto mb-6 text-[15px]">
                Looking for something else? Discover our complete collection of premium electronics, accessories, and everyday tech essentials.
              </p>
              <Link 
                href="/shop" 
                className="bg-[#0076c0] hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-bold transition-colors shadow-sm"
              >
                View All Products
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500">No recent products available. Check back soon!</p>
          </div>
        )}
      </section>

      {/* NEWSLETTER CTA SECTION */}
      <section className="bg-gray-900 text-white py-12 md:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Never Miss a Deal</h2>
          <p className="text-gray-400 mb-8 text-sm md:text-base">
            Join the Essyrise community. Subscribe to our newsletter to get exclusive offers, new arrival alerts, and tech tips straight to your inbox.
          </p>

          <div className="max-w-md mx-auto">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
