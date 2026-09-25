export const dynamic = "force-dynamic";

import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import NewsletterForm from "@/components/marketing/NewsletterForm";
import CategoryGrid from "@/components/categories/CategoryGrid";
import { getProducts, getCategories } from "@/lib/actions/products";

export default async function Home() {
  const products = await getProducts();
  const categories = await getCategories();

  // Display up to 20 products. 
  // (If you want ONLY featured items, change this to: products.filter(p => p.is_featured).slice(0, 20))
  const displayProducts = products.slice(0, 20);

  return (
    <div>
      {/* DYNAMIC CATEGORIES */}
      <section className="py-16 bg-gray-50 border-b border-gray-200">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
          </div>
          <CategoryGrid categories={categories} />
        </div>
      </section>

      {/* PRODUCTS GRID (20 Items, Full Width, Responsive) */}
      <section className="py-16 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Latest Arrivals & Deals</h2>
        </div>

        {displayProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {/* VIEW ALL CALL TO ACTION */}
            <div className="mt-16 flex flex-col items-center text-center">
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
            <p className="text-gray-500">No products added yet. Add your first product in the admin dashboard.</p>
          </div>
        )}
      </section>

      {/* NEWSLETTER CTA SECTION */}
      <section className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Never Miss a Deal</h2>
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
