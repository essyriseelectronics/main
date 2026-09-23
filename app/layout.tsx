import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StorefrontWrapper from "@/components/layout/StorefrontWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Essyrise Electronics | Phones & Genuine Accessories in Mbarara",
  description: "The latest phones, genuine accessories, and great deals in Mbarara, Uganda. Order online today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <StorefrontWrapper>
          {children}
        </StorefrontWrapper>
      </body>
    </html>
  );
}
