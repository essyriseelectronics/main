import Link from "next/link";
import Image from "next/image";
import { formatUGX } from "@/lib/utils";
import { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  // Find the primary image, fallback to the first image, or use a placeholder
  const primaryImage = product.images?.find(img => img.is_primary)?.image_url 
    || product.images?.[0]?.image_url 
    || "/placeholder.png";

  // We only display the active selling price on the card
  const displayPrice = product.discount_price || product.price;

  return (
    <Link 
      href={`/products/${product.slug}`} /* <-- FIXED: Changed to /products/ */
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300"
    >
      {/* IMAGE CONTAINER: Restored height and changed to object-contain so nothing gets cut off */}
      <div className="relative h-48 md:h-56 w-full bg-gray-50 flex-shrink-0 p-4">
        <Image 
          src={primaryImage} 
          alt={product.name} 
          fill 
          className="object-contain group-hover:scale-105 transition-transform duration-500" 
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" 
        />
        
        {/* Status Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {product.is_new_arrival === 1 && (
            <span className="bg-[#0076c0] text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
              New
            </span>
          )}
          {product.availability === "OUT OF STOCK" && (
            <span className="bg-red-500 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
              Sold Out
            </span>
          )}
        </div>
      </div>

      {/* CONTENT CONTAINER */}
      <div className="p-3 md:p-4 flex flex-col flex-1">
        
        <h3 className="text-sm md:text-base font-bold text-gray-900 line-clamp-1 group-hover:text-[#0076c0] transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-1 md:mt-1.5 font-extrabold text-[#0076c0] text-[15px] md:text-lg">
          {formatUGX(displayPrice)}
        </div>

        {/* 2-Line Description */}
        <p className="mt-2 text-xs md:text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

      </div>
    </Link>
  );
}
