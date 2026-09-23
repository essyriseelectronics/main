import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Dashboard | Essyrise",
  description: "Essyrise store management and administration.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Changed: Added flex-col for mobile stacking, lg:flex-row for desktop side-by-side
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden">
      
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
    </div>
  );
}
