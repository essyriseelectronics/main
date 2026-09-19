import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

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
        {/* INTERACTIVE HEADER */}
        <Header />

        {/* MAIN CONTENT */}
        <main className="flex-grow">
          {children}
        </main>

        {/* FOOTER SHELL */}
        <footer id="contact" className="bg-brand-charcoal text-white py-12 mt-12">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div>
              <h3 className="text-lg font-bold mb-4 text-brand-coral">ESSYRISE ELECTRONICS</h3>
              <p className="text-gray-400">Your premium destination for top-tier electronics and smartphones in Mbarara.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/shop" className="hover:text-white transition-colors">Shop All</a></li>
                <li><a href="/category/phones" className="hover:text-white transition-colors">Phones</a></li>
                <li><a href="/category/phone-accessories" className="hover:text-white transition-colors">Accessories</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Mbarara, Uganda</li>
                <li>Call: +256 (0) 700 000 000</li>
                <li>Email: info@essyriseelectronics.com</li>
              </ul>
            </div>
          </div>
          <div className="container mx-auto px-4 text-center text-xs text-gray-500 mt-12 pt-8 border-t border-gray-800">
            <p>&copy; {new Date().getFullYear()} Essyrise Electronics. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
