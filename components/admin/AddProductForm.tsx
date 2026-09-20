"use client";

import { useState } from "react";
import { UploadCloud, XCircle, CheckCircle, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types";
import { createProduct } from "@/lib/actions/admin";

export default function AddProductForm({ categories }: { categories: Category[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageName, setImageName] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Custom Popup State
  const [popup, setPopup] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showPopup = (message: string, type: "success" | "error") => {
    setPopup({ message, type });
    setTimeout(() => setPopup(null), 4000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPopup(null);

    const formData = new FormData(e.currentTarget);
    formData.set("is_featured", formData.get("is_featured") ? "true" : "false");
    formData.set("is_new_arrival", formData.get("is_new_arrival") ? "true" : "false");

    try {
      await createProduct(formData);
      // createProduct handles the redirect on success natively via Next.js
    } catch (error) {
      console.error("Failed to create product", error);
      showPopup("Failed to save product. Please check your connection and try again.", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* CUSTOM POPUP NOTIFICATION */}
      {popup && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl animate-in slide-in-from-top-4 fade-in font-bold text-sm ${
          popup.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>
          {popup.type === "success" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {popup.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BASIC INFO */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
          <h2 className="text-lg font-bold text-brand-charcoal border-b border-gray-100 pb-4">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input required name="name" type="text" className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary" placeholder="e.g., Samsung Galaxy A17" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select required name="category_id" className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary">
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <select name="availability" className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary" defaultValue="IN STOCK">
                <option value="IN STOCK">In Stock</option>
                <option value="LIMITED STOCK">Limited Stock</option>
                <option value="OUT OF STOCK">Out of Stock</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" rows={4} className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary" placeholder="Enter product details and features..."></textarea>
          </div>
        </div>

        {/* PRICING */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
          <h2 className="text-lg font-bold text-brand-charcoal border-b border-gray-100 pb-4">Pricing (UGX)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Regular Price *</label>
              <input required name="price" type="number" min="0" className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary" placeholder="e.g., 650000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (Optional)</label>
              <input name="discount_price" type="number" min="0" className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary" placeholder="e.g., 620000" />
            </div>
          </div>
        </div>

        {/* IMAGES */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
          <h2 className="text-lg font-bold text-brand-charcoal border-b border-gray-100 pb-4">Product Image</h2>
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* PREVIEW BOX */}
            <div className="w-full md:w-1/3 aspect-square bg-gray-50 border border-gray-200 rounded-xl overflow-hidden flex flex-col justify-center items-center relative">
              {imagePreview ? (
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="text-gray-400 text-center flex flex-col items-center">
                  <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                  <span className="text-sm font-medium">No Image Selected</span>
                </div>
              )}
            </div>

            {/* UPLOAD DROPZONE */}
            <div className="w-full md:w-2/3 relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer flex flex-col justify-center min-h-[200px]">
              <input 
                type="file" 
                name="image"
                accept="image/jpeg, image/png, image/webp"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageChange}
              />
              <UploadCloud className="w-10 h-10 text-brand-primary mx-auto mb-3" />
              <p className="text-brand-charcoal font-medium text-lg">
                {imageName ? "Change Image" : "Click or drag image to upload"}
              </p>
              <p className="text-sm text-gray-400 mt-1">{imageName || "JPG, PNG, WebP up to 5MB"}</p>
            </div>
          </div>
        </div>

        {/* MARKETING */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
          <h2 className="text-lg font-bold text-brand-charcoal border-b border-gray-100 pb-4">Marketing</h2>
          <div className="flex items-center gap-3">
            <input type="checkbox" name="is_featured" id="featured" className="rounded text-brand-primary focus:ring-brand-primary w-5 h-5 border-gray-300" />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">Mark as Featured Product (Shows on Homepage)</label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" name="is_new_arrival" id="newArrival" className="rounded text-brand-primary focus:ring-brand-primary w-5 h-5 border-gray-300" />
            <label htmlFor="newArrival" className="text-sm font-medium text-gray-700">Mark as New Arrival</label>
          </div>
        </div>

        {/* FORM ACTIONS */}
        <div className="flex justify-end gap-4 pt-4 pb-12">
          <Link href="/admin/products" className="px-6 py-3 rounded-lg font-medium text-gray-600 hover:bg-white border border-transparent hover:border-gray-200 transition-colors">
            Cancel
          </Link>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-brand-primary hover:bg-brand-secondary text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving Product..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
