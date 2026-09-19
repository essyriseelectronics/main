"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UploadCloud, X } from "lucide-react";
import { MOCK_CATEGORIES } from "@/lib/mock-data";

export default function AddProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      <form className="space-y-6">
        
        {/* BASIC INFO */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
          <h2 className="text-lg font-bold text-brand-charcoal border-b border-gray-100 pb-4">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input required type="text" className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary" placeholder="e.g., Samsung Galaxy A17" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select required className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary">
                <option value="">Select a category</option>
                {MOCK_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <select className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary">
                <option value="IN STOCK">In Stock</option>
                <option value="LIMITED STOCK">Limited Stock</option>
                <option value="OUT OF STOCK">Out of Stock</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={4} className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary" placeholder="Enter product details and features..."></textarea>
          </div>
        </div>

        {/* PRICING */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
          <h2 className="text-lg font-bold text-brand-charcoal border-b border-gray-100 pb-4">Pricing (UGX)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Regular Price *</label>
              <input required type="number" min="0" className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary" placeholder="e.g., 650000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (Optional)</label>
              <input type="number" min="0" className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary" placeholder="e.g., 620000" />
            </div>
          </div>
        </div>

        {/* IMAGES */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
          <h2 className="text-lg font-bold text-brand-charcoal border-b border-gray-100 pb-4">Product Images</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
            <UploadCloud className="w-10 h-10 text-brand-primary mx-auto mb-3" />
            <p className="text-brand-charcoal font-medium">Click to upload images</p>
            <p className="text-sm text-gray-400 mt-1">JPG, PNG, WebP up to 5MB</p>
          </div>
        </div>

        {/* MARKETING */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
          <h2 className="text-lg font-bold text-brand-charcoal border-b border-gray-100 pb-4">Marketing</h2>
          
          <div className="flex items-center gap-3">
            <input type="checkbox" id="featured" className="rounded text-brand-primary focus:ring-brand-primary w-5 h-5 border-gray-300" />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">Mark as Featured Product (Shows on Homepage)</label>
          </div>
          
          <div className="flex items-center gap-3">
            <input type="checkbox" id="newArrival" className="rounded text-brand-primary focus:ring-brand-primary w-5 h-5 border-gray-300" />
            <label htmlFor="newArrival" className="text-sm font-medium text-gray-700">Mark as New Arrival</label>
          </div>
        </div>

        {/* FORM ACTIONS */}
        <div className="flex justify-end gap-4 pt-4">
          <Link href="/admin/products" className="px-6 py-3 rounded-lg font-medium text-gray-600 hover:bg-white border border-transparent hover:border-gray-200 transition-colors">
            Cancel
          </Link>
          <button 
            type="submit"
            className="bg-brand-primary hover:bg-brand-secondary text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-lg"
          >
            Save Product
          </button>
        </div>

      </form>
    </div>
  );
}
