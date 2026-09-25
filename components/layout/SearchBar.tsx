"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSearchSuggestions, saveSearchQuery, SearchSuggestion } from "@/lib/actions/search";

export default function SearchBar({ isMobile }: { isMobile?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input & lock background scrolling when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery("");
      setSuggestions([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Debounced search for live suggestions as the user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        const results = await getSearchSuggestions(query);
        setSuggestions(results);
        setIsLoading(false);
      } else {
        setSuggestions([]);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 300); // Waits 300ms after user stops typing to hit the database

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Handle final search submission
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (query.trim()) {
      // 1. Save to database in the background
      saveSearchQuery(query);
      
      // 2. Route to the shop page with the search parameter
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
      
      // 3. Close the modal
      setIsOpen(false);
    }
  };

  // If the input has text, the X clears it. If it's empty, the X closes the search bar.
  const handleClearOrClose = () => {
    if (query.length > 0) {
      setQuery("");
      inputRef.current?.focus();
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* TRIGGER BUTTON (Visible on Header) */}
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
          
          {/* Clickable backdrop to close the search if they click outside */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          <div className="w-full bg-white shadow-2xl rounded-b-3xl relative z-10 pt-2 pb-4">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Search Input Row */}
              <div className="flex items-center gap-3">
                <form onSubmit={handleSearch} className="flex-1 relative">
                  {/* Left Icon: X to Clear or Close */}
                  <button
                    type="button"
                    onClick={handleClearOrClose}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for products, brands, or categories..."
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0076c0] focus:bg-white transition-all text-[15px] font-medium"
                  />
                  
                  {/* Loading Spinner */}
                  {isLoading && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="w-4 h-4 text-[#0076c0] animate-spin" />
                    </div>
                  )}
                </form>

                {/* Right Button: "Search" Text */}
                <button
                  type="button"
                  onClick={() => handleSearch()}
                  className="font-bold text-[#0076c0] hover:text-blue-700 px-2 py-2 transition-colors flex-shrink-0"
                >
                  Search
                </button>
              </div>

              {/* Live Search Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="mt-4 border-t border-gray-100 pt-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                    Products
                  </p>
                  <div className="flex flex-col gap-1">
                    {suggestions.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/products/${item.slug}`} /* <-- FIXED PATH HERE */
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 p-1">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
                          ) : (
                            <Search className="w-4 h-4 text-gray-300" />
                          )}
                        </div>
                        <span className="font-semibold text-gray-800 text-[15px] truncate">
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
