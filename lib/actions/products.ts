"use server";

import { queryD1 } from "@/lib/db/client";
import { Product, Category } from "@/types";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await queryD1<Category>("SELECT * FROM categories WHERE is_active = 1");
    if (categories.length === 0) return MOCK_CATEGORIES;
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return MOCK_CATEGORIES;
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    // We join the categories table to get the category name for the UI
    const sql = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_active = 1 
      ORDER BY p.created_at DESC
    `;
    const products = await queryD1<Product>(sql);
    
    if (products.length === 0) return MOCK_PRODUCTS;

    // In a full implementation, you would also fetch images from the product_images table here.
    // For V1 fallback, we map an empty images array if none exist to prevent UI crashes.
    return products.map(p => ({
      ...p,
      images: p.images || []
    }));
  } catch (error) {
    console.error("Failed to fetch products", error);
    return MOCK_PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const sql = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.slug = ? AND p.is_active = 1
    `;
    const products = await queryD1<Product>(sql, [slug]);
    
    if (products.length > 0) {
      const product = products[0];
      return { ...product, images: product.images || [] };
    }
    
    // Fallback to mock data for development
    return MOCK_PRODUCTS.find(p => p.slug === slug) || null;
  } catch (error) {
    console.error(`Failed to fetch product ${slug}`, error);
    return MOCK_PRODUCTS.find(p => p.slug === slug) || null;
  }
}
