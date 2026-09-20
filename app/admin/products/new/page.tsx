import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCategories } from "@/lib/actions/products";
import AddProductForm from "@/components/admin/AddProductForm";

export default async function AddProductPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 text-gray-400 hover:text-brand-primary hover:bg-white rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">Add New Product</h1>
          <p className="text-gray-500 text-sm mt-1">Create a new product listing for your store.</p>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl text-center">
          <h3 className="font-bold text-yellow-800 mb-2">No Categories Found</h3>
          <p className="text-yellow-700 mb-4">You must create at least one category before adding a product.</p>
          {/* We will build the category UI next, but for testing, you can manually insert a category in the Cloudflare D1 dashboard */}
        </div>
      ) : (
        <AddProductForm categories={categories} />
      )}
    </div>
  );
}
