import Image from "next/image";
import { Plus, Trash2, Eye, EyeOff, ImageIcon, Tag } from "lucide-react";
import { 
  getAdminCategories, 
  addCategory, 
  deleteCategory, 
  toggleCategoryStatus 
} from "@/lib/actions/adminCategories";

export const metadata = {
  title: "Manage Categories | Admin",
};

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-charcoal">Categories</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your store's product categories and navigation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ADD CATEGORY FORM */}
        <div className="lg:col-span-1">
          <form action={addCategory} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-brand-charcoal mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand-primary" />
              Add New Category
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Name</label>
                <input 
                  required
                  name="name" 
                  type="text" 
                  placeholder="e.g. Smartphones"
                  className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Image URL</label>
                <input 
                  name="image_url" 
                  type="url" 
                  placeholder="https://..."
                  className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Description (Optional)</label>
                <textarea 
                  name="description" 
                  rows={3}
                  placeholder="Brief description of this category..."
                  className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary text-sm resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-secondary text-white py-2.5 rounded-lg font-bold transition-colors mt-2"
              >
                Create Category
              </button>
            </div>
          </form>
        </div>

        {/* CATEGORIES TABLE */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-700 uppercase text-xs font-bold">
                  <tr>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Slug</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        <Tag className="w-8 h-8 mx-auto text-gray-300 mb-3" />
                        <p>No categories found.</p>
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                              {cat.image_url ? (
                                <Image 
                                  src={cat.image_url} 
                                  alt={cat.name} 
                                  width={40} 
                                  height={40} 
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <span className="font-bold text-brand-charcoal">{cat.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">
                          /{cat.slug}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            cat.is_active === 1 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {cat.is_active === 1 ? 'Active' : 'Hidden'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            
                            {/* Toggle Status Form */}
                            <form action={toggleCategoryStatus}>
                              <input type="hidden" name="id" value={cat.id} />
                              <input type="hidden" name="current_status" value={cat.is_active} />
                              <button 
                                type="submit"
                                title={cat.is_active === 1 ? "Hide on Store" : "Show on Store"}
                                className="p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-surface rounded-lg transition-colors"
                              >
                                {cat.is_active === 1 ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>
                            </form>

                            {/* Delete Form */}
                            <form action={deleteCategory}>
                              <input type="hidden" name="id" value={cat.id} />
                              <button 
                                type="submit"
                                title="Delete Category"
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                onClick={(e) => {
                                  if (!confirm("Are you sure you want to delete this category?")) e.preventDefault();
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </form>

                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
