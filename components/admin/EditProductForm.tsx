'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Save, X, Loader2, ImagePlus } from 'lucide-react';
import { updateProduct } from '@/lib/actions/admin'; 

// Basic types to ensure TypeScript is happy
type Category = { id: string; name: string };
type ProductImage = { id: string; image_url: string; is_primary?: boolean | number };
type Product = {
  id: string;
  name: string;
  category_id: string;
  price: number;
  discount_price: number | null;
  description: string;
  availability: string;
  is_featured: boolean | number;
  is_new_arrival: boolean | number;
  images: ProductImage[];
};

export default function EditProductForm({ product, categories }: { product: Product, categories: Category[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  
  // Image State Management (Max 5 Combined)
  const [existingImages, setExistingImages] = useState<ProductImage[]>(product.images || []);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const totalImages = existingImages.length + newImageFiles.length;

  // Handle adding new images
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    
    // Check combined limit (existing + new)
    if (totalImages + files.length > 5) {
      alert('You can only have a maximum of 5 images per product.');
      return;
    }

    const addedFiles = files.slice(0, 5 - totalImages);
    setNewImageFiles(prev => [...prev, ...addedFiles]);

    // Generate local previews for the new files
    const addedPreviews = addedFiles.map(file => URL.createObjectURL(file));
    setNewImagePreviews(prev => [...prev, ...addedPreviews]);
  };

  // Handle removing an image that is already in the database
  const removeExistingImage = (idToRemove: string) => {
    setExistingImages(prev => prev.filter(img => img.id !== idToRemove));
  };

  // Handle removing an image that was just selected but not uploaded yet
  const removeNewImage = (indexToRemove: number) => {
    setNewImageFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setNewImagePreviews(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (totalImages === 0) {
      setError('Please have at least one product image.');
      return;
    }

    const formData = new FormData(e.currentTarget);
    
    // 1. Append the IDs of the existing images we decided to KEEP
    existingImages.forEach((img) => {
      formData.append('kept_image_ids', img.id);
    });

    // 2. Append the actual File objects for the NEW images we are adding
    newImageFiles.forEach((file) => {
      formData.append('new_images', file);
    });

    startTransition(async () => {
      try {
        // Send it all to the Server Action!
        await updateProduct(product.id, formData);
      } catch (err) {
        setError('Failed to update product. Please try again.');
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

        {/* 1. Image Upload & Management Section */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            Product Images <span className="text-gray-400 font-normal">(Max 5 total)</span>
          </label>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            
            {/* Display Existing Images (from database) */}
            {existingImages.map((img, idx) => (
              <div key={img.id} className="relative aspect-square rounded-xl border border-gray-200 overflow-hidden bg-gray-50 group">
                <Image src={img.image_url} alt={`Existing ${idx + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img.id)}
                  className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-500 hover:text-white"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                {idx === 0 && (
                  <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-[10px] text-center py-1 font-bold">
                    CURRENT PRIMARY
                  </div>
                )}
              </div>
            ))}

            {/* Display New Image Previews */}
            {newImagePreviews.map((preview, idx) => (
              <div key={`new-${idx}`} className="relative aspect-square rounded-xl border-2 border-[#0076c0] overflow-hidden bg-blue-50 group">
                <Image src={preview} alt={`New Preview ${idx + 1}`} fill className="object-cover opacity-80" />
                <button
                  type="button"
                  onClick={() => removeNewImage(idx)}
                  className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full opacity-100 shadow-sm hover:bg-red-500 hover:text-white z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 w-full bg-[#0076c0] text-white text-[10px] text-center py-1 font-bold z-10">
                  NEW UPLOAD
                </div>
              </div>
            ))}

            {/* Upload Button */}
            {totalImages < 5 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-[#0076c0] hover:bg-blue-50 flex flex-col items-center justify-center cursor-pointer transition-colors text-gray-500 hover:text-[#0076c0]">
                <ImagePlus className="w-6 h-6 mb-2" />
                <span className="text-xs font-semibold">Add Image</span>
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
          <p className="text-xs text-gray-500 mt-3">
            Note: The first image in the sequence will automatically become the primary thumbnail for your store.
          </p>
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
              defaultValue={product.name}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category_id"
              required
              defaultValue={product.category_id}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0] bg-white outline-none"
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
              defaultValue={product.price}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (Optional)</label>
            <input
              type="number"
              name="discount_price"
              min="0"
              defaultValue={product.discount_price || ''}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0] outline-none"
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
            defaultValue={product.description}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0] outline-none"
          />
        </div>

        {/* 5. Inventory & Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
            <select
              name="availability"
              defaultValue={product.availability}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0] bg-white outline-none"
            >
              <option value="IN STOCK">In Stock</option>
              <option value="LIMITED STOCK">Limited Stock</option>
              <option value="OUT OF STOCK">Out of Stock</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pb-3">
            <input
              type="checkbox"
              id="is_featured"
              name="is_featured"
              value="true"
              defaultChecked={product.is_featured === 1 || product.is_featured === true}
              className="w-5 h-5 text-[#0076c0] border-gray-300 rounded focus:ring-[#0076c0]"
            />
            <label htmlFor="is_featured" className="text-sm font-medium text-gray-700 cursor-pointer">
              Featured Product
            </label>
          </div>
          <div className="flex items-center gap-3 pb-3">
            <input
              type="checkbox"
              id="is_new_arrival"
              name="is_new_arrival"
              value="true"
              defaultChecked={product.is_new_arrival === 1 || product.is_new_arrival === true}
              className="w-5 h-5 text-[#0076c0] border-gray-300 rounded focus:ring-[#0076c0]"
            />
            <label htmlFor="is_new_arrival" className="text-sm font-medium text-gray-700 cursor-pointer">
              New Arrival
            </label>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 md:p-8 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 bg-[#0076c0] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-70 transition-colors w-full md:w-auto shadow-sm"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" /> Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}
