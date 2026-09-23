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
    // The main wrapper forces the layout to take up exactly the full screen height
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* 
        The sidebar handles its own responsive behavior:
        - Mobile: Shows the top header bar + slide-in drawer
        - Desktop: Shows the static left sidebar
      */}
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
