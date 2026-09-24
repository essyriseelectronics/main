import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StorefrontWrapper from "@/components/layout/StorefrontWrapper";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSettings } from "@/lib/actions/settings";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Essyrise Electronics | Phones & Genuine Accessories in Mbarara",
  description: "The latest phones, genuine accessories, and great deals in Mbarara, Uganda. Order online today.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch global settings to check if maintenance mode is active
  const settings = await getSettings();

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <StorefrontWrapper 
          header={<Header />} 
          footer={<Footer />}
          isMaintenance={settings.maintenance_mode}
        >
          {children}
        </StorefrontWrapper>
      </body>
    </html>
  );
}
