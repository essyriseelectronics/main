import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      {/* DESKTOP NAV: Hidden on mobile, appears on medium screens and up (768px+) */}
      <div className="hidden md:block">
        <DesktopNav />
      </div>

      {/* MOBILE NAV: Appears on mobile screens, hidden on medium screens and up */}
      <div className="block md:hidden">
        <MobileNav />
      </div>
    </header>
  );
}
