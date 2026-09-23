import Image from "next/image";
import { Plus, Trash2, Eye, EyeOff, ImageIcon, Tag, Upload } from "lucide-react";
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
          <form action={addCategory} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24 space-y-4">
            <h2 className="text-lg font-bold text-brand-charcoal mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand-primary" />
              Add New Category
            </h2>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Category Name</label>
              <input 
                required
                name="name" 
                type="text" 
                placeholder="e.g. Smartphones"
                className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary text-sm"
              />
            </div>

            {/* UPLOAD IMAGE FILE INPUT (Optimized for phone gallery & transparent icons) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Upload Image (Transparent PNG)</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-4 pb-4 px-4 text-center">
                    <Upload className="w-5 h-5 text-gray-400 mb-1" />
                    <p className="text-xs text-gray-600 font-medium">Tap to upload icon image</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG or WebP</p>
                  </div>
                  <input name="image_file" type="file" accept="image/*" className="hidden" />
                </label>
              </div>
            </div>

            {/* OR IMAGE URL */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Or Image Link / URL</label>
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
                rows={2}
                placeholder="Brief description..."
                className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary text-sm resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-secondary text-white py-3 rounded-xl font-bold transition-colors shadow-sm"
            >
              Create Category
            </button>
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
                            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0 p-1">
                              {cat.image_url ? (
                                <Image 
                                  src={cat.image_url} 
                                  alt={cat.name} 
                                  width={48} 
                                  height={48} 
                                  className="object-contain w-full h-full"
                                />
                              ) : (
                                <ImageIcon className="w-5 h-5 text-gray-400" />
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
