import Link from "next/link";
import { Search, UserPlus, Phone, MapPin } from "lucide-react";
import { getContacts } from "@/lib/actions/contacts";

export default async function AdminContactsPage() {
  const contacts = await getContacts();

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">Customer Contacts</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your customer database and SMS marketing audience.</p>
        </div>
        <Link 
          href="/admin/contacts/new" 
          className="bg-brand-primary hover:bg-brand-secondary text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <UserPlus className="w-5 h-5" /> Add Contact
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* TOOLBAR */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-brand-primary focus:border-brand-primary text-sm"
            />
          </div>
          <div className="text-sm font-medium text-gray-500">
            Total Contacts: <span className="text-brand-charcoal font-bold">{contacts.length}</span>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Phone Number</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Source</th>
                <th className="px-6 py-4 font-medium">Marketing Opt-In</th>
                <th className="px-6 py-4 font-medium text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-brand-charcoal">{contact.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{contact.address || "No specific address"}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-brand-primary" />
                        {contact.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {contact.location || "Mbarara"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-purple-100 text-brand-primary px-2.5 py-1 text-xs font-bold rounded-full">
                        {contact.source || "ORDER"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        contact.marketing_opt_in ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {contact.marketing_opt_in ? "Opted In" : "Opted Out"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-gray-400">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    No contacts recorded yet. Customers will automatically appear here when they place an order.
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
