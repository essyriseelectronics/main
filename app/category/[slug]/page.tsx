import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/lib/mock-data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const category = MOCK_CATEGORIES.find((c) => c.slug === resolvedParams.slug);
  if (!category) return { title: "Category Not Found" };
  return { title: `${category.name} | Essyrise Electronics` };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const category = MOCK_CATEGORIES.find((c) => c.slug === resolvedParams.slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = MOCK_PRODUCTS.filter(
    (product) => product.category_id === category.id
  );

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-4">{category.name}</h1>
        {category.description && (
          <p className="text-gray-500">{category.description}</p>
        )}
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
        <p className="text-sm font-medium text-gray-500">
          Showing <span className="text-brand-charcoal font-bold">{categoryProducts.length}</span> products
        </p>
      </div>

      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <h2 className="text-xl font-bold text-brand-charcoal mb-2">No products yet</h2>
          <p className="text-gray-500">Check back later for new arrivals in this category.</p>
        </div>
      )}
    </div>
  );
}
