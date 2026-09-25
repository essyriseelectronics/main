"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProduct } from "@/lib/actions/admin";

export default function DeleteProductButton({ productId, productName }: { productId: string, productName: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      startTransition(async () => {
        await deleteProduct(productId);
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      title="Delete" 
      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin text-red-600" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
