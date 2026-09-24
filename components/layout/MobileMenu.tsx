'use client'

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronRight, ChevronDown, ShoppingCart, Heart, User, ImageIcon } from 'lucide-react';
import { Category } from '@/types';

type MobileMenuProps = {
  categories: Category[];
};

export default function MobileMenu({ categories }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Function to print logs directly to your phone screen
  const addLog = (msg: string) => {
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 4), // Keep last 5 logs
    ]);
  };

  useEffect(() => {
    setMounted(true);
    addLog(`Hydrated! Categories count: ${categories?.length ?? 0}`);
  }, [categories]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      addLog('Drawer OPEN state set');
    } else {
      document.body.style.overflow = 'unset';
      addLog('Drawer CLOSED state set');
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleOpenClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addLog(`Menu Button Tapped! Screen width: ${window.innerWidth}px`);
    setIsOpen(true);
  };

  // Mobile Drawer JSX
  const drawerContent = (
    <div 
      className={`fixed inset-0 z-[99999] transition-all duration-300 ${
        isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
      }`}
      style={{ zIndex: 99999 }}
    >
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/70 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => {
          addLog('Backdrop tapped -> Closing');
          setIsOpen(false);
        }} 
      />

      {/* Drawer Body */}
      <div 
        className={`fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col z-[100000] transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ zIndex: 100000 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Link href="/" onClick={() => setIsOpen(false)} className="outline-none select-none flex flex-col items-start">
            <span className="text-xl font-extrabold text-black tracking-tight leading-none">ESSYRISE</span>
            <span className="text-[8px] font-semibold text-gray-400 tracking-[0.2em] uppercase mt-1 leading-none">electronics</span>
          </Link>
          <button 
            type="button"
            onClick={() => setIsOpen(false)} 
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="flex flex-col py-2">
            <Link href="/" onClick={() => setIsOpen(false)} className="px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50">
              Home
            </Link>

            <button 
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center justify-between w-full px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50"
            >
              Shop by Category 
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoryOpen && (
              <div className="bg-gray-50 flex flex-col border-y border-gray-100 py-1 space-y-1">
                {(!categories || categories.length === 0) ? (
                  <span className="px-8 py-3 text-sm text-gray-500">No categories found</span>
                ) : (
                  categories.map((cat) => (
                    <Link 
                      key={cat.slug} 
                      href={`/category/${cat.slug}`} 
                      onClick={() => setIsOpen(false)} 
                      className="px-6 py-2.5 text-[14px] text-gray-700 font-medium hover:text-[#0076c0] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 p-0.5">
                          {cat.image_url ? (
                            <Image src={cat.image_url} alt={cat.name} width={28} height={28} className="object-contain w-full h-full" />
                          ) : (
                            <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
                          )}
                        </div>
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-50 flex-shrink-0" />
                    </Link>
                  ))
                )}
              </div>
            )}

            <Link href="/shop" onClick={() => setIsOpen(false)} className="px-5 py-3.5 text-[15px] text-gray-700 font-medium hover:bg-gray-50">
              View All
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between gap-3 bg-white mb-2">
          <Link href="/login" onClick={() => setIsOpen(false)} className="flex-1 flex items-center justify-center gap-2 bg-[#0076c0] text-white px-4 py-2.5 rounded-full font-semibold">
            <User className="h-5 w-5 fill-white" /> Login
          </Link>
          <Link href="/register" onClick={() => setIsOpen(false)} className="flex-1 text-center text-[#0076c0] px-4 py-2.5 font-bold hover:bg-blue-50 rounded-full">
            Register
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 🚨 ON-SCREEN DEBUG POPUP HUD FOR MOBILE 🚨 */}
      <div className="fixed top-2 left-2 right-2 z-[999999] bg-black/90 text-green-400 p-2.5 rounded-xl text-[11px] font-mono border border-green-500/30 shadow-2xl pointer-events-none">
        <div className="flex items-center justify-between text-white font-bold border-b border-gray-700 pb-1 mb-1">
          <span>DEBUG LOGS (On-Screen)</span>
          <span className={mounted ? "text-green-400" : "text-red-400"}>
            {mounted ? "Mounted" : "Unmounted"}
          </span>
        </div>
        <div className="space-y-0.5">
          {logs.length === 0 && <span className="text-gray-400">Tap hamburger to start logs...</span>}
          {logs.map((log, idx) => (
            <div key={idx} className="truncate">{log}</div>
          ))}
        </div>
      </div>

      {/* Hamburger Trigger Button */}
      <button 
        type="button"
        onClick={handleOpenClick} 
        className="p-2 bg-gray-100 text-gray-900 rounded-lg active:bg-blue-200 transition-colors z-50 relative"
        aria-label="Open Navigation Menu"
      >
        <Menu className="h-7 w-7" strokeWidth={2.5} />
      </button>

      {/* Render Portal directly to Body */}
      {mounted && createPortal(drawerContent, document.body)}
    </>
  );
}
