import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { getProducts, getCategories } from "@/lib/actions/products";

// Convert to async component to fetch data server-side
export default async function Home() {
  const products = await getProducts();
  const categories = await getCategories();
  
  const featuredProducts = products.filter(p => p.is_featured).slice(0, 4);

  return (
    <div>
      {/* HERO SECTION */}
      <section className="bg-brand-primary text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-accent via-brand-primary to-brand-primary"></div>
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Latest Phones. <br className="md:hidden" />
            <span className="text-brand-accent">Genuine Accessories.</span> <br />
            Great Deals.
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Mbarara's premium destination for top-tier electronics, smartphones, and trusted accessories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="bg-brand-accent hover:bg-pink-600 text-white font-bold py-4 px-10 rounded-full transition-all shadow-lg shadow-brand-accent/30 text-lg">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* DYNAMIC CATEGORIES */}
      <section className="py-16 bg-brand-surface border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-charcoal">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link href={`/category/${cat.slug}`} key={cat.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-card-hover p-4 text-center transition-all border border-gray-100 flex flex-col items-center">
                <div className="w-20 h-20 relative mb-4 rounded-full overflow-hidden bg-gray-50 border-2 border-transparent group-hover:border-brand-accent transition-colors">
                  <Image 
                    src={cat.image_url || "/placeholder.jpg"} 
                    alt={cat.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <h3 className="font-semibold text-brand-charcoal group-hover:text-brand-primary text-sm md:text-base">{cat.name}</h3>
              </Link>
            ))}
          </div>
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
    </div>
  );
}
