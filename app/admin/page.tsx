import Link from "next/link";
import { Package, ShoppingCart, Users, MessageSquare } from "lucide-react";
import { queryD1 } from "@/lib/db/client";
import { getSmsBalance } from "@/lib/sms/provider";
import { formatUGX } from "@/lib/utils";

export default async function AdminDashboard() {
  // 1. Fetch live metrics from D1 and MarzSMS concurrently
  let productCount = 0;
  let orderCount = 0;
  let newOrderCount = 0;
  let contactCount = 0;
  let smsBalanceData = null;
  let recentOrders: any[] = [];
  let recentCampaigns: any[] = [];

  try {
    const productsRes = await queryD1<{ count: number }>("SELECT count(*) as count FROM products WHERE is_active = 1");
    productCount = productsRes[0]?.count || 0;

    const ordersRes = await queryD1<{ count: number }>("SELECT count(*) as count FROM orders");
    orderCount = ordersRes[0]?.count || 0;

    const newOrdersRes = await queryD1<{ count: number }>("SELECT count(*) as count FROM orders WHERE status = 'NEW'");
    newOrderCount = newOrdersRes[0]?.count || 0;

    const contactsRes = await queryD1<{ count: number }>("SELECT count(*) as count FROM contacts WHERE is_active = 1");
    contactCount = contactsRes[0]?.count || 0;

    recentOrders = await queryD1("SELECT * FROM orders ORDER BY created_at DESC LIMIT 5");
    recentCampaigns = await queryD1("SELECT * FROM sms_campaigns ORDER BY created_at DESC LIMIT 5");

    smsBalanceData = await getSmsBalance();
  } catch (err) {
    console.error("Error fetching dashboard analytics:", err);
  }

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-charcoal">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back. Here is your live business metrics.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-2.5 rounded-lg font-medium transition-colors text-center shadow-sm"
        >
          + Add Product
        </Link>
      </div>

      {/* LIVE SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        
        {/* NEW ORDERS */}
        <Link href="/admin/orders" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-brand-primary transition-all group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Total Orders</h3>
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-brand-charcoal">{orderCount}</p>
          <p className="text-sm text-green-600 mt-2 font-medium">{newOrderCount} new pending confirmation</p>
        </Link>

        {/* PRODUCTS */}
        <Link href="/admin/products" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-brand-primary transition-all group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Active Products</h3>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-brand-charcoal">{productCount}</p>
          <p className="text-sm text-gray-400 mt-2">In live inventory</p>
        </Link>

        {/* CONTACTS */}
        <Link href="/admin/contacts" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-brand-primary transition-all group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Total Contacts</h3>
            <div className="w-10 h-10 bg-purple-50 text-brand-primary rounded-full flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-brand-charcoal">{contactCount}</p>
          <p className="text-sm text-gray-400 mt-2">Customers & database entries</p>
        </Link>

        {/* SMS BALANCE */}
        <Link href="/admin/sms" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-brand-primary transition-all group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm">SMS Balance</h3>
            <div className="w-10 h-10 bg-orange-50 text-brand-coral rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-brand-charcoal">
            {smsBalanceData ? formatUGX(smsBalanceData.balance) : "Unavailable"}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {smsBalanceData ? `~${Math.floor(smsBalanceData.balance / smsBalanceData.costPerSms)} units left` : "Check API keys"}
          </p>
        </Link>
      </div>

      {/* RECENT ACTIVITY SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* RECENT ORDERS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-brand-charcoal">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs font-semibold text-brand-primary hover:underline">View All</Link>
          </div>
          
          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((ord: any) => (
                <div key={ord.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl text-sm">
                  <div>
                    <p className="font-bold text-brand-charcoal">{ord.order_number} - {ord.customer_name}</p>
                    <p className="text-xs text-gray-400">{ord.location} • {ord.customer_phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-primary">{formatUGX(ord.total_amount)}</p>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">{ord.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500 text-sm">No orders yet.</p>
            </div>
          )}
        </div>

        {/* RECENT SMS CAMPAIGNS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-brand-charcoal">Recent SMS Campaigns</h3>
            <Link href="/admin/sms" className="text-xs font-semibold text-brand-primary hover:underline">View All</Link>
          </div>

          {recentCampaigns.length > 0 ? (
            <div className="space-y-3">
              {recentCampaigns.map((camp: any) => (
                <div key={camp.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl text-sm">
                  <div>
                    <p className="font-bold text-brand-charcoal">{camp.name}</p>
                    <p className="text-xs text-gray-400">{camp.recipient_count} recipients</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-700">{formatUGX(camp.estimated_cost)}</p>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">{camp.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500 text-sm">No campaigns sent yet.</p>
              <Link href="/admin/sms/new" className="text-brand-primary text-xs font-semibold hover:underline mt-1 inline-block">
                Create your first broadcast
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
