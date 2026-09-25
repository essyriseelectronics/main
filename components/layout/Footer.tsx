import Link from 'next/link';
import Image from 'next/image';
import { queryD1 } from "@/lib/db/client";
import { Category } from "@/types";

export default async function Footer() {
  let categories: Category[] = [];
  try {
    categories = await queryD1<Category>(
      "SELECT * FROM categories WHERE is_active = 1 ORDER BY name ASC LIMIT 5"
    );
  } catch (error) {
    console.error("Failed to fetch footer categories:", error);
  }

  return (
    <footer id="contact" className="bg-gray-900 text-white py-12 mt-12 border-t border-gray-800">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">

        {/* Brand Info */}
        <div>
          <Link href="/" className="outline-none select-none flex items-center gap-2 mb-4">
            <img 
              src="/easy.png" 
              alt="Essyrise Logo" 
              className="w-8 h-8 object-contain"
            />
            <div className="flex flex-col items-start">
              <span className="text-xl font-extrabold tracking-tight leading-none flex">
                <span className="text-red-600">ESSY</span>
                <span className="text-[#0076c0]">RISE</span>
              </span>
              <span className="text-[8px] font-bold text-[#0076c0] tracking-[0.2em] uppercase mt-0.5 leading-none">
                electronics
              </span>
            </div>
          </Link>
          <p className="text-gray-400">Your premium destination for top-tier electronics and smartphones in Mbarara.</p>
        </div>

        {/* Dynamic Quick Links / Categories */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-white">Categories</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link href="/shop" className="hover:text-white transition-colors">Shop All Products</Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/category/${cat.slug}`} className="hover:text-white transition-colors">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Physical Address */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-white">Visit & Contact</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="font-semibold text-gray-200">BNK Mall, Room BO23</li>
            <li>Mbarara, Uganda</li>
            <li className="pt-2">
              <span className="block text-xs text-gray-500 uppercase tracking-wider mb-0.5">Call Us:</span>
              <a href="tel:0784269950" className="hover:text-blue-400 transition-colors font-medium">0784 269 950</a>
              <span className="mx-2 text-gray-600">|</span>
              <a href="tel:0759984350" className="hover:text-blue-400 transition-colors font-medium">0759 984 350</a>
            </li>
            <li className="pt-1 text-gray-400">Email: info@essyriseelectronics.com</li>
          </ul>
        </div>

      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500 mt-12 pt-8 border-t border-gray-800">
        <p>&copy; {new Date().getFullYear()} Essyrise Electronics. All rights reserved.</p>
      </div>
    </footer>
  );
}
