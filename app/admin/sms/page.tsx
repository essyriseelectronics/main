import Link from "next/link";
import { MessageSquare, Plus, AlertCircle } from "lucide-react";
import { fetchSmsDashboardData } from "@/lib/actions/sms";
import { formatUGX } from "@/lib/utils";

export default async function SmsDashboardPage() {
  const data = await fetchSmsDashboardData();
  const balance = data.balance;
  const campaigns = data.campaigns as any[];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">SMS Marketing</h1>
          <p className="text-gray-500 text-sm mt-1">Engage your customers with direct SMS broadcasts.</p>
        </div>
        <Link 
          href="/admin/sms/new" 
          className="bg-brand-primary hover:bg-brand-secondary text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" /> New Campaign
        </Link>
      </div>

      {/* BALANCE OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-medium text-sm mb-1">Live SMS Balance</p>
            {balance ? (
              <>
                <p className="text-3xl font-bold text-brand-charcoal">{formatUGX(balance.balance)}</p>
                <p className="text-sm text-green-600 mt-1">Approx. {Math.floor(balance.balance / balance.costPerSms)} messages remaining</p>
              </>
            ) : (
              <p className="text-red-500 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> API Disconnected
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-orange-50 text-brand-coral rounded-full flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-medium text-sm mb-1">Marketable Audience</p>
            <p className="text-3xl font-bold text-brand-charcoal">{data.marketableContactsCount}</p>
            <p className="text-sm text-gray-400 mt-1">Opted-in customers & imports</p>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-brand-primary rounded-full flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* CAMPAIGN HISTORY TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-bold text-brand-charcoal">Recent Campaigns</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Campaign / Date</th>
                <th className="px-6 py-4 font-medium">Recipients</th>
                <th className="px-6 py-4 font-medium">Estimated Cost</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {campaigns.length > 0 ? (
                campaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-brand-charcoal">{camp.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(camp.created_at).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-brand-charcoal">{camp.recipient_count}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatUGX(camp.estimated_cost)}</td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 px-2.5 py-1 text-xs font-bold rounded-full">
                        {camp.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-500">
                    No campaigns sent yet. Click "New Campaign" to engage your audience.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
