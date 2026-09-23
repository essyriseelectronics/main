"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  Tags // Added this import for the Categories icon
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Tags }, // Added Categories link here
  { name: "Contacts", href: "/admin/contacts", icon: Users },
  { name: "SMS Campaigns", href: "/admin/sms", icon: MessageSquare },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Prevent background scrolling when the mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { 
      document.body.style.overflow = "unset"; 
    };
  }, [isOpen]);

  return (
    <>
      {/* ========================================= */}
      {/* MOBILE TOP BAR (Visible only on small screens) */}
      {/* ========================================= */}
      <div className="lg:hidden bg-brand-primary text-white p-4 flex justify-between items-center sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsOpen(true)}
            className="p-1 -ml-1 rounded-md hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-lg tracking-tight">Admin Panel</span>
        </div>

        {/* Optional: Add a quick-action icon here if needed, like notifications */}
        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold">A</span>
        </div>
      </div>

      {/* ========================================= */}
      {/* MOBILE OVERLAY BACKDROP                   */}
      {/* ========================================= */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ========================================= */}
      {/* SIDEBAR DRAWER (Mobile: Fixed & Slide-in | Desktop: Static) */}
      {/* ========================================= */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-[100] w-[85%] max-w-[320px] bg-brand-charcoal text-gray-300 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl lg:static lg:w-64 lg:translate-x-0 lg:z-auto lg:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>

        {/* Drawer Header (Visible on both Mobile and Desktop) */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              ESSYRISE<span className="text-brand-accent">.</span>
            </h2>
            <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-1 font-semibold">Workspace</p>
          </div>

          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsOpen(false)} 
            className="lg:hidden p-2 -mr-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)} // Auto-close on mobile after clicking
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 lg:py-3 rounded-xl transition-colors font-medium",
                  isActive 
                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20" 
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400")} />
                <span className="text-[15px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Action (Logout) */}
        <div className="p-4 border-t border-gray-800 bg-brand-charcoal">
          <button className="flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl text-gray-400 hover:text-white hover:bg-red-500/10 hover:text-red-500 w-full transition-colors font-medium">
            <LogOut className="w-5 h-5" />
            <span className="text-[15px]">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
