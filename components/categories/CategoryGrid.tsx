import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types";

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  // Only show active categories on the storefront
  const activeCategories = categories.filter(cat => cat.is_active !== 0 && cat.is_active !== false);

  if (activeCategories.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-200">
        <p className="text-gray-500">No categories found. Add some in the admin dashboard.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Horizontal scrolling container with RED scrollbar */}
      <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 snap-x snap-mandatory [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-red-500/60 hover:[&::-webkit-scrollbar-thumb]:bg-red-600 [&::-webkit-scrollbar-thumb]:rounded-full transition-colors">

        {activeCategories.map((cat) => (
          <Link 
            href={`/category/${cat.slug}`} 
            key={cat.id} 
            className="group relative flex-shrink-0 w-36 h-44 md:w-48 md:h-56 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-red-200 transition-all snap-start bg-white border border-gray-100 flex flex-col p-4"
          >
            {/* Image Container - Using object-contain so transparent images fit perfectly */}
            <div className="relative flex-1 w-full h-full mb-3">
              {cat.image_url ? (
                <Image 
                  src={cat.image_url} 
                  alt={cat.name} 
                  fill 
                  className="object-contain transition-transform duration-300 group-hover:-translate-y-1" 
                  sizes="(max-width: 768px) 144px, 192px" 
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-400">No img</span>
                </div>
              )}
            </div>

            {/* Category Name positioned at the bottom in dark text */}
            <div className="text-center mt-auto">
              <h3 className="font-bold text-gray-900 text-sm md:text-base leading-tight group-hover:text-red-600 transition-colors">
                {cat.name}
              </h3>
            </div>
          </Link>
        ))}

      </div>
    </div>
  );
}
