"use server";

import { revalidatePath } from "next/cache";
// Adjust this import to match your actual database query wrapper
import { queryD1 } from "@/lib/db"; 

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
    // Fetch all categories, including inactive ones, for the admin panel
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
  const image_url = formData.get("image_url") as string;

  if (!name) {
    throw new Error("Category name is required");
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
