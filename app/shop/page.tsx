import { Metadata } from "next";
import ProductCard from "@/components/products/ProductCard";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Shop All Products | Essyrise Electronics",
  description: "Browse our full catalog of smartphones, accessories, audio, and power devices in Mbarara.",
};

export default function ShopPage() {
  // In Phase 2, this will be replaced with a D1 database fetch
  const products = MOCK_PRODUCTS;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-4">Shop All Products</h1>
        <p className="text-gray-500 max-w-2xl">
          Browse our complete collection of genuine smartphones, premium audio, fast chargers, and durable accessories.
        </p>
      </div>

      {/* FILTER & SORT PLACEHOLDER BAR */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
        <p className="text-sm font-medium text-gray-500">
          Showing <span className="text-brand-charcoal font-bold">{products.length}</span> results
        </p>
        <select className="text-sm border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary">
          <option>Sort by: Featured</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest Arrivals</option>
        </select>
      </div>

      {/* PRODUCT GRID */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <h2 className="text-xl font-bold text-brand-charcoal mb-2">No products found</h2>
          <p className="text-gray-500">We couldn't find any products matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
