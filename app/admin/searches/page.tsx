export const dynamic = "force-dynamic";

import { Search, Clock } from "lucide-react";
import { getPaginatedSearches } from "@/lib/actions/search";
import Pagination from "@/components/admin/Pagination";

export default async function AdminSearchesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  
  // Parse the page number from the URL, default to 1 if it doesn't exist
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1;
  const limit = 20; // Show 20 searches per page

  const { queries, total, totalPages, currentPage } = await getPaginatedSearches(page, limit);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Search Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track what your customers are looking for to optimize your inventory.
          </p>
        </div>
        <div className="bg-[#0076c0]/10 text-[#0076c0] px-4 py-2 rounded-lg font-bold text-sm">
          {total} Total Queries
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* TOOLBAR */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Search className="w-4 h-4" />
            Showing recent customer searches (Page {currentPage})
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4 font-semibold">Search Term</th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {queries.length > 0 ? (
                queries.map((q) => {
                  const dateObj = new Date(q.created_at);
                  const formattedDate = dateObj.toLocaleDateString(undefined, { 
                    month: 'short', day: 'numeric', year: 'numeric' 
                  });
                  const formattedTime = dateObj.toLocaleTimeString(undefined, {
                    hour: '2-digit', minute: '2-digit'
                  });

                  return (
                    <tr key={q.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg text-sm">
                          "{q.query}"
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{formattedDate} • <span className="font-medium">{formattedTime}</span></span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={2} className="text-center py-12 text-gray-500">
                    No search queries found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION COMPONENT */}
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          basePath="/admin/searches" 
        />
      </div>
    </div>
  );
}
