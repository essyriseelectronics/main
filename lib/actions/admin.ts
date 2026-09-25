"use server";

import { queryD1 } from "@/lib/db/client";
import { uploadImageToR2 } from "@/lib/db/r2";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- CATEGORY ACTIONS ---

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  // Create a URL-friendly slug (e.g., "Phone Accessories" -> "phone-accessories")
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const id = `cat-${crypto.randomUUID()}`;

  await queryD1(
    `INSERT INTO categories (id, name, slug, description, is_active) VALUES (?, ?, ?, ?, 1)`,
    [id, name, slug, description]
  );

  revalidatePath("/admin/categories");
  return { success: true, id };
}

// --- PRODUCT ACTIONS ---

export async function createProduct(formData: FormData) {
  try {
    // 1. Extract standard fields
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

    // 2. Insert Product into D1 FIRST (so we have the ID to attach images to)
    await queryD1(
      `INSERT INTO products (id, name, slug, category_id, description, price, discount_price, availability, is_featured, is_new_arrival) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, slug, categoryId, description, price, discountPrice, availability, isFeatured, isNewArrival]
    );

    // 3. Extract multiple images from the form data
    // "images" matches the key we used in formData.append('images', file) in the UI
    const imageFiles = formData.getAll("images") as File[];

    // 4. Loop through the images, upload to R2, and save to database
    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i];

      if (imageFile && imageFile.size > 0) {
        // Upload to Cloudflare R2 using your existing helper
        const uploadResult = await uploadImageToR2(imageFile);

        const imgId = `img-${crypto.randomUUID()}`;
        // The first image uploaded (index 0) becomes the primary image
        const isPrimary = i === 0 ? 1 : 0; 

        // Insert Image metadata into D1
        await queryD1(
          `INSERT INTO product_images (id, product_id, image_url, r2_key, is_primary) VALUES (?, ?, ?, ?, ?)`,
          [imgId, id, uploadResult.url, uploadResult.key, isPrimary]
        );
      }
    }

    // Clear Next.js cache so the new product shows up immediately
    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath("/admin/products");

  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }

  // Redirect back to product list after successful creation
  redirect("/admin/products");
}

export async function deleteProduct(productId: string) {
  try {
    // 1. Delete associated images first (Foreign Key cleanup)
    await queryD1(`DELETE FROM product_images WHERE product_id = ?`, [productId]);
    
    // 2. Delete the product itself
    await queryD1(`DELETE FROM products WHERE id = ?`, [productId]);

    // 3. Refresh the pages so the item disappears immediately
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
