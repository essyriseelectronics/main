"use client";

import { usePathname } from "next/navigation";
import MaintenanceScreen from "./MaintenanceScreen";

export default function StorefrontWrapper({
  children,
  header,
  footer,
  isMaintenance,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
  isMaintenance: boolean;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // 1. If we are in the admin panel, ALWAYS render the page content (Admin bypasses maintenance)
  if (isAdmin) {
    return <>{children}</>;
  }

  // 2. If the store is in maintenance mode, block the storefront
  if (isMaintenance) {
    return <MaintenanceScreen />;
  }

  // 3. Otherwise, render the normal Storefront Header and Footer
  return (
    <>
      {header}
      <main className="flex-grow">
        {children}
      </main>
      {footer}
    </>
  );
}
