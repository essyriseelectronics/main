'use client'

import { useState } from 'react';
import { Menu } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { Category } from '@/types';

type MobileMenuWrapperProps = {
  categories: Category[];
};

export default function MobileMenuWrapper({ categories }: MobileMenuWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button handled strictly on the client */}
      <button 
        onClick={() => setIsOpen(true)} 
        className="p-1 text-gray-800 focus:outline-none cursor-pointer"
        aria-label="Open Mobile Menu"
      >
        <Menu className="h-7 w-7" strokeWidth={2.5} />
      </button>

      {/* Drawer Component */}
      <MobileMenu categories={categories} isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
