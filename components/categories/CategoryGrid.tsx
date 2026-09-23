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
      {/* 
        Horizontal scrolling container with CSS scroll snapping.
        The complex bracket classes at the end creatively style the scrollbar 
        into a sleek "progress bar" track natively.
      */}
      <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 snap-x snap-mandatory [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-brand-primary/40 hover:[&::-webkit-scrollbar-thumb]:bg-brand-primary/60 [&::-webkit-scrollbar-thumb]:rounded-full transition-colors">
        
        {activeCategories.map((cat) => (
          <Link 
            href={`/category/${cat.slug}`} 
            key={cat.id} 
            className="group relative flex-shrink-0 w-36 h-48 md:w-52 md:h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all snap-start bg-gray-50 border border-gray-100"
          >
            {/* Full-bleed background image */}
            {cat.image_url ? (
              <Image 
                src={cat.image_url} 
                alt={cat.name} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110" 
                sizes="(max-width: 768px) 144px, 208px" 
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <span className="text-xs font-medium text-gray-400">No img</span>
              </div>
            )}
            
            {/* Dark gradient overlay so the white text is always readable over any image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
            
            {/* Category Name positioned at the bottom */}
            <div className="absolute bottom-0 left-0 w-full p-4">
              <h3 className="font-bold text-white text-sm md:text-base leading-tight drop-shadow-md">
                {cat.name}
              </h3>
            </div>
          </Link>
        ))}
        
      </div>
    </div>
  );
}
