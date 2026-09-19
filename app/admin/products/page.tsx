import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit, MessageSquare, Trash2 } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { formatUGX } from "@/lib/utils";

export default function AdminProductsPage() {
  const products = MOCK_PRODUCTS;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your inventory, prices, and marketing.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="bg-brand-primary hover:bg-brand-secondary text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* TOOLBAR */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-brand-primary focus:border-brand-primary text-sm"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="border border-gray-200 rounded-lg text-sm focus:ring-brand-primary flex-1 sm:flex-none">
              <option>All Categories</option>
              <option>Phones</option>
              <option>Accessories</option>
            </select>
            <select className="border border-gray-200 rounded-lg text-sm focus:ring-brand-primary flex-1 sm:flex-none">
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
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const primaryImage = product.images.find(img => img.is_primary)?.image_url || product.images[0]?.image_url;
                return (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 relative rounded-lg border border-gray-200 overflow-hidden bg-white flex-shrink-0">
                          {primaryImage && <Image src={primaryImage} alt={product.name} fill className="object-cover" sizes="48px" />}
                        </div>
                        <div>
                          <p className="font-semibold text-brand-charcoal">{product.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{product.is_featured ? 'Featured' : ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category_name}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="font-semibold text-brand-charcoal">{formatUGX(product.discount_price || product.price)}</span>
                      {product.discount_price && <span className="block text-xs text-gray-400 line-through">{formatUGX(product.price)}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        product.availability === "IN STOCK" ? "bg-green-100 text-green-700" :
                        product.availability === "LIMITED STOCK" ? "bg-orange-100 text-orange-700" :
                        "bg-gray-200 text-gray-600"
                      }`}>
                        {product.availability}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* SMS PROMOTION SHORTCUT */}
                        <button title="Promote via SMS" className="p-2 text-brand-primary hover:bg-purple-50 rounded-lg transition-colors">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button title="Edit Product" className="p-2 text-gray-400 hover:text-brand-charcoal hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button title="Delete" className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
