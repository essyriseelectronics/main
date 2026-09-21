import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <DesktopNav />
      <MobileNav />
    </header>
  );
}
