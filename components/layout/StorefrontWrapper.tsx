"use client";

import { usePathname } from "next/navigation";

export default function StorefrontWrapper({
  children,
  header,
  footer,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // If we are in the admin panel, ONLY render the page content
  if (isAdmin) {
    return <>{children}</>;
  }

  // Otherwise, render the normal Storefront Header and Footer
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
