import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Essyrise Electronics | Phones & Genuine Accessories in Mbarara",
  description: "The latest phones, genuine accessories, and great deals in Mbarara, Uganda. Order online today.",
  openGraph: {
    title: "Essyrise Electronics",
    description: "Phones & Genuine Accessories in Mbarara",
    url: "https://essyriseelectronics.com",
    siteName: "Essyrise Electronics",
    locale: "en_UG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* TOP NAVIGATION SHELL */}
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="text-xl font-bold tracking-tight text-brand-primary">
              ESSYRISE <span className="text-brand-accent">ELECTRONICS</span>
            </div>
            <nav className="hidden md:flex gap-6 font-medium text-sm">
              <a href="/" className="hover:text-brand-accent transition-colors">Home</a>
              <a href="/shop" className="hover:text-brand-accent transition-colors">Shop</a>
              <a href="/category/phones" className="hover:text-brand-accent transition-colors">Phones</a>
            </nav>
            {/* Mobile Menu Button Placeholder */}
            <button className="md:hidden p-2 text-brand-charcoal">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-grow">
          {children}
        </main>

        {/* FOOTER SHELL */}
        <footer className="bg-brand-charcoal text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Essyrise Electronics. Mbarara, Uganda.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
