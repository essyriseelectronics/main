import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StorefrontWrapper from "@/components/layout/StorefrontWrapper";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSettings } from "@/lib/actions/settings";
import { StoreProvider } from "@/lib/context/StoreContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Essyrise Electronics | Phones & Genuine Accessories in Mbarara",
    template: "%s | Essyrise Electronics",
  },
  description: "The latest phones, genuine accessories, and great deals in Mbarara, Uganda. Order online today.",
  keywords: ["electronics Mbarara", "smartphones Uganda", "Essyrise Electronics", "phone accessories BNK Mall"],
  openGraph: {
    title: "Essyrise Electronics | Phones & Genuine Accessories in Mbarara",
    description: "The latest phones, genuine accessories, and great deals in Mbarara, Uganda. Order online today.",
    url: "https://essyriseelectronics.com",
    siteName: "Essyrise Electronics",
    images: [
      {
        url: "/1200.png",
        width: 1200,
        height: 630,
        alt: "Essyrise Electronics Store",
      },
    ],
    locale: "en_UG",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
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
        <StoreProvider>
          <StorefrontWrapper 
            header={<Header />} 
            footer={<Footer />}
            isMaintenance={settings.maintenance_mode}
          >
            {children}
          </StorefrontWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
