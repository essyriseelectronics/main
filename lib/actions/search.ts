"use server";

import { queryD1 } from "@/lib/db/client";

// 1. Save the search term to your database for analytics
export async function saveSearchQuery(query: string) {
  if (!query || query.trim().length < 2) return;
  
  try {
    const id = `sq-${crypto.randomUUID()}`;
    await queryD1(
      `INSERT INTO search_queries (id, query) VALUES (?, ?)`,
      [id, query.trim().toLowerCase()]
    );
  } catch (error) {
    console.error("Failed to save search query", error);
  }
}

// 2. Fetch live product suggestions as the user types
export type SearchSuggestion = {
  name: string;
  slug: string;
  image_url: string | null;
};

export async function getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
  if (!query || query.trim().length < 2) return [];
  
  try {
    const searchTerm = `%${query.trim()}%`;
    
    // Fetch up to 5 matching products, along with their primary image
    const results = await queryD1<SearchSuggestion>(
      `SELECT p.name, p.slug, 
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image_url
       FROM products p 
       WHERE p.name LIKE ? 
       LIMIT 5`,
      [searchTerm]
    );
    
    return results;
  } catch (error) {
    console.error("Failed to fetch search suggestions", error);
    return [];
  }
}
