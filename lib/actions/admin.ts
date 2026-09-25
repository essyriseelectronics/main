"use server";

import { queryD1 } from "@/lib/db/client";
import { uploadImageToR2 } from "@/lib/db/r2";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ==========================================
// CATEGORY ACTIONS
// ==========================================

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  // Create a URL-friendly slug
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const id = `cat-${crypto.randomUUID()}`;

  await queryD1(
    `INSERT INTO categories (id, name, slug, description, is_active) VALUES (?, ?, ?, ?, 1)`,
    [id, name, slug, description]
  );

  revalidatePath("/admin/categories");
  return { success: true, id };
}

// ==========================================
// PRODUCT ACTIONS
// ==========================================

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const categoryId = formData.get("category_id") as string;
    const description = formData.get("description") as string;
    const price = parseInt(formData.get("price") as string, 10);
    const discountPriceRaw = formData.get("discount_price") as string;
    const discountPrice = discountPriceRaw ? parseInt(discountPriceRaw, 10) : null;
    const availability = formData.get("availability") as string;
    const isFeatured = formData.get("is_featured") === "true" ? 1 : 0;
    const isNewArrival = formData.get("is_new_arrival") === "true" ? 1 : 0;

    const id = `prod-${crypto.randomUUID()}`;
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${id.slice(5, 10)}`;

    // 1. Insert Product into D1 
    await queryD1(
      `INSERT INTO products (id, name, slug, category_id, description, price, discount_price, availability, is_featured, is_new_arrival) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, slug, categoryId, description, price, discountPrice, availability, isFeatured, isNewArrival]
    );

    // 2. Extract multiple images from the form data
    const imageFiles = formData.getAll("images") as File[];

    // 3. Loop through the images, upload to R2, and save to database
    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i];

      if (imageFile && imageFile.size > 0) {
        const uploadResult = await uploadImageToR2(imageFile);
        const imgId = `img-${crypto.randomUUID()}`;
        const isPrimary = i === 0 ? 1 : 0; // First uploaded image is primary

        await queryD1(
          `INSERT INTO product_images (id, product_id, image_url, r2_key, is_primary) VALUES (?, ?, ?, ?, ?)`,
          [imgId, id, uploadResult.url, uploadResult.key, isPrimary]
        );
      }
    }

    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath("/admin/products");

  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }

  redirect("/admin/products");
}

export async function deleteProduct(productId: string) {
  try {
    // 1. Delete associated images first (Foreign Key cleanup)
    await queryD1(`DELETE FROM product_images WHERE product_id = ?`, [productId]);
    
    // 2. Delete the product itself
    await queryD1(`DELETE FROM products WHERE id = ?`, [productId]);

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

// ==========================================
// UPDATE PRODUCT (Production Grade w/ Images)
// ==========================================

export async function updateProduct(productId: string, formData: FormData) {
  try {
    // 1. Extract standard text and numeric fields
    const name = formData.get("name") as string;
    const categoryId = formData.get("category_id") as string;
    const description = formData.get("description") as string;
    const price = parseInt(formData.get("price") as string, 10);
    const discountPriceRaw = formData.get("discount_price") as string;
    const discountPrice = discountPriceRaw ? parseInt(discountPriceRaw, 10) : null;
    const availability = formData.get("availability") as string;
    const isFeatured = formData.get("is_featured") === "true" ? 1 : 0;
    const isNewArrival = formData.get("is_new_arrival") === "true" ? 1 : 0;

    // 2. Update the main product record (We do not change the ID or Slug to preserve SEO & links)
    await queryD1(
      `UPDATE products 
       SET name = ?, category_id = ?, description = ?, price = ?, discount_price = ?, availability = ?, is_featured = ?, is_new_arrival = ?
       WHERE id = ?`,
      [name, categoryId, description, price, discountPrice, availability, isFeatured, isNewArrival, productId]
    );

    // 3. Image Handling Logic
    // We get a list of the image IDs that the user decided to KEEP from the existing ones.
    const keptImageIds = formData.getAll("kept_image_ids") as string[]; 
    
    if (keptImageIds.length > 0) {
      // Delete any images in the database for this product that are NOT in the kept list
      const placeholders = keptImageIds.map(() => '?').join(',');
      await queryD1(
        `DELETE FROM product_images WHERE product_id = ? AND id NOT IN (${placeholders})`, 
        [productId, ...keptImageIds]
      );
    } else {
      // If the user deleted all existing images, clear them all from the DB
      await queryD1(`DELETE FROM product_images WHERE product_id = ?`, [productId]);
    }

    // 4. Upload and process NEW images added during the edit
    const newImageFiles = formData.getAll("new_images") as File[];
    
    for (let i = 0; i < newImageFiles.length; i++) {
      const file = newImageFiles[i];
      if (file && file.size > 0) {
        const uploadResult = await uploadImageToR2(file);
        const imgId = `img-${crypto.randomUUID()}`;
        
        await queryD1(
          `INSERT INTO product_images (id, product_id, image_url, r2_key, is_primary) VALUES (?, ?, ?, ?, 0)`,
          [imgId, productId, uploadResult.url, uploadResult.key]
        );
      }
    }

    // 5. Enforce Primary Image Logic
    // Reset all images to non-primary first
    await queryD1(`UPDATE product_images SET is_primary = 0 WHERE product_id = ?`, [productId]);
    
    // Grab the first image available for this product and set it as primary
    const remainingImages = await queryD1<{id: string}>(
      `SELECT id FROM product_images WHERE product_id = ? LIMIT 1`, 
      [productId]
    );
    
    if (remainingImages.length > 0) {
      await queryD1(`UPDATE product_images SET is_primary = 1 WHERE id = ?`, [remainingImages[0].id]);
    }

    // Clear caches
    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath("/admin/products");

  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }

  // Redirect on success
  redirect("/admin/products");
}
