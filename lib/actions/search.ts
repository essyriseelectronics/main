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

// 3. Fetch paginated searches for the Admin Dashboard
export async function getPaginatedSearches(page: number = 1, limit: number = 20) {
  try {
    const offset = (page - 1) * limit;
    
    // Get the total count of searches for pagination math
    const countResult = await queryD1<{ total: number }>(
      `SELECT COUNT(*) as total FROM search_queries`
    );
    const total = countResult[0]?.total || 0;

    // Get the specific rows for the current page
    const queries = await queryD1<{ id: string; query: string; created_at: string }>(
      `SELECT id, query, created_at FROM search_queries ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return {
      queries,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  } catch (error) {
    console.error("Failed to fetch paginated searches", error);
    return { queries: [], total: 0, totalPages: 0, currentPage: page };
  }
}
