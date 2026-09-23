"use server";

import { revalidatePath } from "next/cache";
import { queryD1 } from "@/lib/db/client"; 

// Utility to generate URL-friendly slugs from the category name
function generateSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -
}

export async function getAdminCategories() {
  try {
    const categories = await queryD1(
      "SELECT * FROM categories ORDER BY created_at DESC"
    );
    return categories as any[];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function addCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  let image_url = formData.get("image_url") as string;
  const imageFile = formData.get("image_file") as File;

  if (!name) {
    throw new Error("Category name is required");
  }

  // If a file is uploaded from mobile/PC, convert it to a Base64 data URL for SQLite storage
  if (imageFile && imageFile.size > 0) {
    try {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mimeType = imageFile.type || "image/png";
      image_url = `data:${mimeType};base64,${buffer.toString("base64")}`;
    } catch (err) {
      console.error("Failed to process uploaded image file:", err);
    }
  }

  const slug = generateSlug(name);
  const id = crypto.randomUUID();

  try {
    await queryD1(
      `INSERT INTO categories (id, name, slug, description, image_url, is_active) VALUES (?, ?, ?, ?, ?, 1)`,
      [id, name, slug, description || null, image_url || null]
    );

    revalidatePath("/admin/categories");
    revalidatePath("/"); // Update the storefront
  } catch (error) {
    console.error("Error adding category:", error);
    throw new Error("Failed to add category");
  }
}

export async function deleteCategory(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) return;

  try {
    await queryD1(`DELETE FROM categories WHERE id = ?`, [id]);
    revalidatePath("/admin/categories");
    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }
}

export async function toggleCategoryStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const currentStatus = parseInt(formData.get("current_status") as string);

  if (!id) return;

  const newStatus = currentStatus === 1 ? 0 : 1;

  try {
    await queryD1(`UPDATE categories SET is_active = ? WHERE id = ?`, [newStatus, id]);
    revalidatePath("/admin/categories");
    revalidatePath("/");
  } catch (error) {
    console.error("Error toggling category status:", error);
    throw new Error("Failed to update status");
  }
}
