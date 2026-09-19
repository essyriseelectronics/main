/**
 * Cloudflare D1 HTTP Client for Vercel Deployments
 * Executes SQL queries against D1 via the Cloudflare REST API.
 */
export async function queryD1<T>(sql: string, params: any[] = []): Promise<T[]> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const dbId = process.env.CLOUDFLARE_D1_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;

  // If credentials aren't set yet, fail gracefully so the build doesn't crash
  if (!accountId || !dbId || !token) {
    console.warn("Database credentials missing. Returning empty results.");
    return [];
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
    // Disable caching for admin mutations; we will configure caching at the Next.js page level later
    cache: "no-store", 
  });

  const data = await response.json();

  if (!data.success) {
    console.error("Cloudflare D1 Error:", data.errors);
    throw new Error(`Database query failed: ${data.errors?.[0]?.message || "Unknown error"}`);
  }

  // Cloudflare D1 HTTP API returns data inside a nested results array
  return data.result[0].results as T[];
}
