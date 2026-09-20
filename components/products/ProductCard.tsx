import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { formatUGX } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    // Notice the added "?" after product.images
  const primaryImage = product.images?.find((img) => img.is_primary)?.image_url || product.images?.[0]?.image_url || "/placeholder-image.jpg";
  const isOutOfStock = product.availability === "OUT OF STOCK";
  
  return (
    <div className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full relative">
      
      {/* BADGES */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.discount_price && (
          <span className="bg-brand-accent text-white text-xs font-bold px-2 py-1 rounded-md">
            SALE
          </span>
        )}
        {isOutOfStock && (
          <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-md">
            OUT OF STOCK
          </span>
        )}
      </div>

      {/* IMAGE */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-gray-50 block">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </Link>

      {/* DETAILS */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">{product.category_name}</p>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-brand-charcoal leading-tight line-clamp-2 hover:text-brand-primary transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* PRICING */}
        <div className="mt-auto">
          {product.discount_price ? (
            <div className="flex flex-col">
              <span className="text-brand-primary font-bold text-lg">{formatUGX(product.discount_price)}</span>
              <span className="text-gray-400 text-sm line-through">{formatUGX(product.price)}</span>
            </div>
          ) : (
            <div className="text-brand-primary font-bold text-lg">{formatUGX(product.price)}</div>
          )}
          
          <Link 
            href={`/products/${product.slug}`}
            className="mt-4 block w-full text-center bg-gray-50 hover:bg-brand-primary hover:text-white text-brand-charcoal font-semibold py-2 rounded-lg transition-colors border border-gray-200 hover:border-brand-primary"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
