export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProductBySlug, getCategories } from "@/lib/actions/products";
import EditProductForm from "@/components/admin/EditProductForm";

export default async function EditProductPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  // Await the params and fetch data concurrently for speed
  const resolvedParams = await params;
  
  const [product, categories] = await Promise.all([
    getProductBySlug(resolvedParams.slug),
    getCategories()
  ]);

  // If someone tries to edit a product that doesn't exist, throw a 404
  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/products" 
          className="p-2 text-gray-400 hover:text-[#0076c0] hover:bg-blue-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-500 text-sm mt-1">
            Updating: <span className="font-semibold text-gray-700">{product.name}</span>
          </p>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl text-center">
          <h3 className="font-bold text-yellow-800 mb-2">No Categories Found</h3>
          <p className="text-yellow-700">Please ensure you have active categories before editing products.</p>
        </div>
      ) : (
        <EditProductForm product={product} categories={categories} />
      )}
    </div>
  );
}
