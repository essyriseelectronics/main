import Link from "next/link";
import { Package, ShoppingCart, Users, MessageSquare } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-charcoal">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back. Here is what's happening today.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-2.5 rounded-lg font-medium transition-colors text-center shadow-sm"
        >
          + Add Product
        </Link>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm">New Orders</h3>
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-brand-charcoal">12</p>
          <p className="text-sm text-green-600 mt-2 font-medium">3 pending confirmation</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Active Products</h3>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-brand-charcoal">45</p>
          <p className="text-sm text-gray-400 mt-2">Across 5 categories</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Total Contacts</h3>
            <div className="w-10 h-10 bg-purple-50 text-brand-primary rounded-full flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-brand-charcoal">1,204</p>
          <p className="text-sm text-gray-400 mt-2">Imported & Customers</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm">SMS Balance</h3>
            <div className="w-10 h-10 bg-orange-50 text-brand-coral rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-brand-charcoal">UGX 45,000</p>
          <p className="text-sm text-gray-400 mt-2">~1,500 messages left</p>
        </div>
      </div>

      {/* QUICK ACTIONS & EMPTY STATES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-brand-charcoal mb-4">Recent Orders</h3>
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">No recent orders to show.</p>
            <p className="text-sm text-gray-400 mt-1">Orders will appear here once customers checkout.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-brand-charcoal mb-4">Recent SMS Campaigns</h3>
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">No campaigns sent yet.</p>
            <Link href="/admin/sms/new" className="text-brand-primary text-sm font-semibold hover:underline mt-2 inline-block">
              Create your first broadcast
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
