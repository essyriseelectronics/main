export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { getProducts } from "@/lib/actions/products";

export const metadata: Metadata = {
  title: "Shop All Products | Essyrise Electronics",
  description: "Browse our full catalog of smartphones, accessories, audio, and power devices in Mbarara.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const searchQuery = typeof resolvedParams.search === 'string' ? resolvedParams.search.toLowerCase() : '';

  let products = await getProducts();

  // Filter products if the user typed something in the SearchBar
  if (searchQuery) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery) || 
      (p.description && p.description.toLowerCase().includes(searchQuery)) ||
      (p.category_name && p.category_name.toLowerCase().includes(searchQuery))
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {searchQuery ? `Search Results for "${resolvedParams.search}"` : "Shop All Products"}
        </h1>
        <p className="text-gray-500 max-w-2xl text-sm md:text-base">
          {searchQuery 
            ? "Here is what we found matching your search." 
            : "Browse our complete collection of genuine smartphones, premium audio, fast chargers, and durable accessories."}
        </p>
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8">
        <p className="text-sm font-medium text-gray-500">
          Showing <span className="text-gray-900 font-bold">{products.length}</span> results
        </p>
        
        {/* Show a clear button if a search is active */}
        {searchQuery && (
          <Link href="/shop" className="text-sm font-bold text-[#0076c0] hover:text-blue-700 transition-colors">
            Clear Search
          </Link>
        )}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2">No products found</h2>
          <p className="text-gray-500 mb-6 text-sm">We couldn't find anything matching your criteria.</p>
          {searchQuery && (
            <Link href="/shop" className="bg-[#0076c0] hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-bold transition-colors">
              View All Products
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
