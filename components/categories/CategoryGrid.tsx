import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types"; // <-- Import your global type here to fix the mismatch

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  // Only show active categories on the storefront
  // Checking both 0 and false to be completely safe with SQLite typing
  const activeCategories = categories.filter(cat => cat.is_active !== 0 && cat.is_active !== false);

  if (activeCategories.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-200">
        <p className="text-gray-500">No categories found. Add some in the admin dashboard.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
      {activeCategories.map((cat) => (
        <Link 
          href={`/category/${cat.slug}`} 
          key={cat.id} 
          className="group bg-white rounded-2xl shadow-sm hover:shadow-card-hover p-4 text-center transition-all border border-gray-100 flex flex-col items-center"
        >
          <div className="w-20 h-20 relative mb-4 rounded-full overflow-hidden bg-gray-50 border-2 border-transparent group-hover:border-brand-accent transition-colors flex items-center justify-center text-gray-400">
            {cat.image_url ? (
              <Image 
                src={cat.image_url} 
                alt={cat.name} 
                fill 
                className="object-cover" 
                sizes="80px" 
              />
            ) : (
              <span className="text-xs font-medium">No img</span>
            )}
          </div>
          <h3 className="font-semibold text-brand-charcoal group-hover:text-brand-primary text-sm md:text-base">
            {cat.name}
          </h3>
        </Link>
      ))}
    </div>
  );
}
