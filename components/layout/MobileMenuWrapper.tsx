'use client'

import MobileMenu from './MobileMenu';
import { Category } from '@/types';

type MobileMenuWrapperProps = {
  categories: Category[];
};
export default function MobileMenuWrapper({ categories }: MobileMenuWrapperProps) {
  return <MobileMenu categories={categories} />;
}
