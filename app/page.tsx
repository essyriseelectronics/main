export const dynamic = "force-dynamic"; // Bypasses the cache so your live database images always show

import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import NewsletterForm from "@/components/marketing/NewsletterForm";
import CategoryGrid from "@/components/categories/CategoryGrid";
import { getProducts, getCategories } from "@/lib/actions/products";

export default async function Home() {
  const products = await getProducts();
  const categories = await getCategories();

  const featuredProducts = products.filter(p => p.is_featured).slice(0, 4);

  return (
    <div>
      {/* DYNAMIC CATEGORIES */}
      <section className="py-16 bg-brand-surface border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-charcoal">Shop by Category</h2>
          </div>
          
          {/* Reusable Category Component */}
          <CategoryGrid categories={categories} />
          
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-charcoal">Featured Deals</h2>
          <Link href="/shop" className="text-brand-primary font-semibold hover:text-brand-accent transition-colors text-sm md:text-base">
            View All →
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500">No products added yet. Add your first product in the admin dashboard.</p>
          </div>
        )}
      </section>

      {/* NEWSLETTER CTA SECTION */}
      <section className="bg-brand-charcoal text-white py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
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
