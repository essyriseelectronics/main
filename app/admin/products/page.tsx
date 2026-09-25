import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit, MessageSquare } from "lucide-react";
import { getProducts } from "@/lib/actions/products";
import { formatUGX } from "@/lib/utils";
import DeleteProductButton from "@/components/admin/DeleteProductButton"; // <-- Import the new button

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your inventory, prices, and marketing.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="bg-[#0076c0] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* TOOLBAR */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50">
          <div className="relative w-full sm:w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-[#0076c0] focus:border-[#0076c0] text-sm outline-none"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="border border-gray-200 rounded-lg text-sm focus:ring-[#0076c0] flex-1 sm:flex-none outline-none px-3 py-2 bg-white">
              <option>All Categories</option>
              <option>Phones</option>
              <option>Accessories</option>
            </select>
            <select className="border border-gray-200 rounded-lg text-sm focus:ring-[#0076c0] flex-1 sm:flex-none outline-none px-3 py-2 bg-white">
              <option>All Status</option>
              <option>In Stock</option>
              <option>Out of Stock</option>
            </select>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length > 0 ? (
                products.map((product) => {
                  const primaryImage = product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url;
                  
                  return (
                    <tr key={product.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0">
                            {primaryImage ? (
                              <Image src={primaryImage} alt={product.name} fill className="object-cover" sizes="48px" />
                            ) : (
                              <div className="w-full h-full bg-gray-100"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{product.name}</p>
                            <p className="text-xs text-blue-600 font-medium mt-0.5">{product.is_featured ? 'Featured' : ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.category_name}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="font-semibold text-gray-900">{formatUGX(product.discount_price || product.price)}</span>
                        {product.discount_price && <span className="block text-xs text-gray-400 line-through">{formatUGX(product.price)}</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                          product.availability === "IN STOCK" ? "bg-emerald-100 text-emerald-700 border-emerald-200 border" :
                          product.availability === "LIMITED STOCK" ? "bg-orange-100 text-orange-700 border-orange-200 border" :
                          "bg-gray-100 text-gray-600 border-gray-200 border"
                        }`}>
                          {product.availability}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 items-center">
                          
                          {/* 1. Campaign Link (Passes product ID to SMS page) */}
                          <Link 
                            href={`/admin/sms?product_id=${product.id}`} 
                            title="Promote via SMS" 
                            className="p-2 text-[#0076c0] hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Link>

                          {/* 2. Edit Link (Routes to the edit page) */}
                          <Link 
                            href={`/admin/products/edit/${product.slug}`} 
                            title="Edit Product" 
                            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {/* 3. Delete Action Button (Client component) */}
                          <DeleteProductButton productId={product.id} productName={product.name} />

                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    No products found in database. Add your first product above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
