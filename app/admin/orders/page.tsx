import { Search, Eye } from "lucide-react";
import { getOrders } from "@/lib/actions/orders";
import { formatUGX } from "@/lib/utils";
import StatusUpdater from "@/components/admin/StatusUpdater";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW": return "bg-blue-100 text-blue-700";
      case "CONFIRMED": return "bg-purple-100 text-purple-700";
      case "PROCESSING": return "bg-orange-100 text-orange-700";
      case "READY_FOR_DELIVERY": return "bg-yellow-100 text-yellow-800";
      case "DELIVERED": return "bg-green-100 text-green-700";
      case "CANCELLED": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">Order Management</h1>
          <p className="text-gray-500 text-sm mt-1">Track and fulfill customer purchases.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* TOOLBAR */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by order number or phone..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-brand-primary focus:border-brand-primary text-sm"
            />
          </div>
          <select className="border border-gray-200 rounded-lg text-sm focus:ring-brand-primary w-full sm:w-auto">
            <option>All Statuses</option>
            <option>New Orders</option>
            <option>Pending Delivery</option>
            <option>Completed</option>
          </select>
        </div>

        {/* DATA TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Order ID / Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-brand-charcoal">{order.order_number}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-brand-charcoal">{order.customer_name}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{order.customer_phone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <p>{order.location}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[150px]">{order.delivery_address}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-brand-primary">{formatUGX(order.total_amount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      {/* Client component to handle status changes without full page reload */}
                      <StatusUpdater orderId={order.id} currentStatus={order.status} badgeClass={getStatusColor(order.status)} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-brand-primary hover:bg-purple-50 rounded-lg transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    No orders found. When customers check out, they will appear here.
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
