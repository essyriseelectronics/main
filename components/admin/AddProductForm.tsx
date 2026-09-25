'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { UploadCloud, X, Loader2, ImagePlus } from 'lucide-react';
import { addProduct } from '@/lib/actions/products'; // We will build this action next

type Category = { id: string; name: string };

export default function AddProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  
  // Image Upload State (Max 5)
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    
    // Check limit
    if (selectedImages.length + files.length > 5) {
      alert('You can only upload a maximum of 5 images.');
      return;
    }

    const newFiles = [...selectedImages, ...files].slice(0, 5);
    setSelectedImages(newFiles);

    // Generate previews
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };

  const removeImage = (indexToRemove: number) => {
    const newFiles = selectedImages.filter((_, idx) => idx !== indexToRemove);
    const newPreviews = imagePreviews.filter((_, idx) => idx !== indexToRemove);
    setSelectedImages(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (selectedImages.length === 0) {
      setError('Please select at least one product image.');
      return;
    }

    const formData = new FormData(e.currentTarget);
    
    // Append all selected images to the formData
    selectedImages.forEach((file) => {
      formData.append('images', file);
    });

    startTransition(async () => {
      const result = await addProduct(formData);
      if (result.success) {
        router.push('/admin/products');
      } else {
        setError(result.error || 'Failed to add product');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 md:p-8 space-y-8">
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        {/* 1. Image Upload Section */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            Product Images <span className="text-gray-400 font-normal">(Max 5)</span>
          </label>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {/* Image Previews */}
            {imagePreviews.map((preview, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl border border-gray-200 overflow-hidden bg-gray-50 group">
                <Image src={preview} alt={`Preview ${idx + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
                {idx === 0 && (
                  <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-[10px] text-center py-1 font-bold">
                    MAIN IMAGE
                  </div>
                )}
              </div>
            ))}

            {/* Upload Button */}
            {selectedImages.length < 5 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-[#0076c0] hover:bg-blue-50 flex flex-col items-center justify-center cursor-pointer transition-colors text-gray-500 hover:text-[#0076c0]">
                <ImagePlus className="w-6 h-6 mb-2" />
                <span className="text-xs font-semibold">Upload</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleImageSelect} 
                  className="hidden" 
                />
              </label>
            )}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* 2. Basic Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. iPhone 15 Pro Max"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category_id"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0] bg-white"
            >
              <option value="">Select a category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Pricing Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Regular Price (UGX)</label>
            <input
              type="number"
              name="price"
              required
              min="0"
              placeholder="5000000"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (Optional)</label>
            <input
              type="number"
              name="discount_price"
              min="0"
              placeholder="4800000"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0]"
            />
          </div>
        </div>

        {/* 4. Details Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            required
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0]"
            placeholder="Describe the product features, specs, and what's in the box..."
          />
        </div>

        {/* 5. Inventory & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
            <select
              name="availability"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0] bg-white"
            >
              <option value="IN STOCK">In Stock</option>
              <option value="LIMITED STOCK">Limited Stock</option>
              <option value="OUT OF STOCK">Out of Stock</option>
            </select>
          </div>
          <div className="flex items-center gap-3 mt-6 md:mt-8">
            <input
              type="checkbox"
              id="is_new_arrival"
              name="is_new_arrival"
              value="true"
              className="w-5 h-5 text-[#0076c0] border-gray-300 rounded focus:ring-[#0076c0]"
            />
            <label htmlFor="is_new_arrival" className="text-sm font-medium text-gray-700 cursor-pointer">
              Mark as "New Arrival"
            </label>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 md:p-8 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 bg-[#0076c0] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-70 transition-colors w-full md:w-auto"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <UploadCloud className="w-5 h-5" /> Save Product
            </>
          )}
        </button>
      </div>
    </form>
  );
}
