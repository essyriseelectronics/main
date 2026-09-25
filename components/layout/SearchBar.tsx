"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchBar({ isMobile }: { isMobile?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input when the search bar opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      // Lock body scroll when search is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Route to your shop page with the search query URL parameter
      router.push(`/shop?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  return (
    <>
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          isMobile
            ? "text-gray-700 hover:text-black p-1 transition-colors"
            : "text-gray-700 hover:text-[#0076c0] transition-colors"
        }
        aria-label="Search"
      >
        <Search
          className={isMobile ? "h-6 w-6" : "h-5 w-5"}
          strokeWidth={isMobile ? 2 : 2.5}
        />
      </button>

      {/* OVERLAY SEARCH BAR */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full bg-white shadow-2xl rounded-b-3xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center gap-3">
              <form onSubmit={handleSearch} className="flex-1 relative">
                <Search className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for products, brands, or categories..."
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0076c0] focus:bg-white transition-all text-[15px] font-medium"
                />
              </form>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
