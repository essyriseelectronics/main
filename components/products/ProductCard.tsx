import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { Product } from "@/types";
import { formatUGX } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.is_primary)?.image_url || product.images?.[0]?.image_url;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border-4 border-red-500 overflow-hidden flex flex-col h-full relative">
      
      {/* 🚨 DEBUG CONSOLE - PRINTS RAW DATABASE DATA TO THE SCREEN 🚨 */}
      <div className="bg-black text-green-400 font-mono text-[10px] p-2 overflow-hidden h-24 relative z-50">
        <p className="text-white font-bold mb-1 border-b border-gray-700 pb-1">Debug: {product.name}</p>
        <pre>{JSON.stringify(product.images, null, 2)}</pre>
      </div>

      {/* IMAGE OR GRAY FALLBACK BOX */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-gray-50 flex flex-col items-center justify-center border-b border-gray-100">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-red-500 w-full h-full bg-red-50 absolute inset-0">
            <ImageIcon className="w-10 h-10 mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-wider">NO IMAGE DETECTED</span>
          </div>
        )}
      </Link>

      {/* DETAILS */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          <h3 className="font-semibold text-brand-charcoal">{product.name}</h3>
        </div>
        <div className="mt-auto text-brand-primary font-bold text-lg">
          {formatUGX(product.price)}
        </div>
      </div>
    </div>
  );
}
