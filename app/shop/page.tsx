import { Metadata } from "next";
import ProductCard from "@/components/products/ProductCard";
import { getProducts } from "@/lib/actions/products";

export const metadata: Metadata = {
  title: "Shop All Products | Essyrise Electronics",
  description: "Browse our full catalog of smartphones, accessories, audio, and power devices in Mbarara.",
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-4">Shop All Products</h1>
        <p className="text-gray-500 max-w-2xl">
          Browse our complete collection of genuine smartphones, premium audio, fast chargers, and durable accessories.
        </p>
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
        <p className="text-sm font-medium text-gray-500">
          Showing <span className="text-brand-charcoal font-bold">{products.length}</span> results
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <h2 className="text-xl font-bold text-brand-charcoal mb-2">No products found</h2>
          <p className="text-gray-500">Inventory is currently empty.</p>
        </div>
      )}
    </div>
  );
}
