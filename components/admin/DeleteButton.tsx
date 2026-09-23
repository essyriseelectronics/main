"use client";

import { Trash2 } from "lucide-react";

export default function DeleteButton() {
  return (
    <button 
      type="submit"
      title="Delete"
      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      onClick={(e) => {
        if (!confirm("Are you sure you want to delete this?")) {
          e.preventDefault();
        }
      }}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
