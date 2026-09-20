"use server";

import { queryD1 } from "@/lib/db/client";
import { Product, Category } from "@/types";

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await queryD1<Category>("SELECT * FROM categories WHERE is_active = 1 ORDER BY name ASC");
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return [];
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const sql = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_active = 1 
      ORDER BY p.created_at DESC
    `;
    const products = await queryD1<Product>(sql);
    return products.map(p => ({
      ...p,
      images: p.images || []
    }));
  } catch (error) {
    console.error("Failed to fetch products", error);
    return [];
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
    return null;
  } catch (error) {
    console.error(`Failed to fetch product ${slug}`, error);
    return null;
  }
}
