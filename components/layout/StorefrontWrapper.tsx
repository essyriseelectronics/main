"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function StorefrontWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // If we are in the admin panel, ONLY render the page content (AdminLayout handles the rest)
  if (isAdmin) {
    return <>{children}</>;
  }

  // Otherwise, render the normal Storefront Header and Footer
  return (
    <>
      <Header />

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </>
  );
}
