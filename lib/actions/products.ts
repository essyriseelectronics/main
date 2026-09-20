"use server";

import { queryD1 } from "@/lib/db/client";
import { Product, Category, ProductImage } from "@/types";

export async function getCategories(): Promise<Category[]> {
  try {
    return await queryD1<Category>("SELECT * FROM categories WHERE is_active = 1 ORDER BY name ASC");
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return [];
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    // 1. Fetch products and categories
    const sql = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_active = 1 
      ORDER BY p.created_at DESC
    `;
    const products = await queryD1<Product>(sql);

    // 2. Fetch all primary images for active products
    const imageSql = `SELECT * FROM product_images WHERE is_primary = 1`;
    const images = await queryD1<ProductImage>(imageSql);

    // 3. Attach images to their respective products
    return products.map(p => {
      const productImages = images.filter(img => img.product_id === p.id);
      return {
        ...p,
        images: productImages
      };
    });
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
      // Fetch images just for this product
      const images = await queryD1<ProductImage>(`SELECT * FROM product_images WHERE product_id = ?`, [product.id]);
      
      return { ...product, images: images || [] };
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch product ${slug}`, error);
    return null;
  }
}
