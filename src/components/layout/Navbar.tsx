import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";
import NavigationMenu from "./NavigationMenu";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="brand-shell fixed top-0 inset-x-0 z-[var(--z-header)] h-[var(--header-h)]">
      <nav aria-label="Main" className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <Link href="/" aria-label="Apex Royale Drives home" className="shrink-0 h-[calc(var(--header-h)-1rem)] w-[min(44vw,12rem)] flex items-center justify-center">
          <BrandLogo />
        </Link>
        <div className="flex items-center gap-2 sm:gap-5">
          <ThemeToggle />
          <NavigationMenu />
        </div>
      </nav>
    </header>
  );
}
