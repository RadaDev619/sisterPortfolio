"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 1. Import usePathname
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // 2. Get the current URL path

  const navLinks = [
    { name: "Bio", href: "/" },
    { name: "Teaching", href: "/teaching" },
    { name: "Blog", href: "/blogs" },
    { name: "Year in Review", href: "/year-in-review" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-sm">
      <nav className="container mx-auto px-6 h-18 flex items-center justify-between">
        {/* --- LOGO SECTION --- */}
        <Link href="/" className="flex items-center h-full pt-4 md:pt-6">
          <img
            src="/logo.png"
            alt="Sonam Zangmo Logo"
            className="h-32 md:h-40 w-auto object-contain hover:opacity-80 transition-opacity"
          />
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            // 3. Check if this link is currently active
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-indigo-600 " // Styles for Active Link
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-50" // Styles for Inactive Link
                }`}
              >
                {link.name}
                {/* 4. Optional: Underline indicator for active state */}
                {isActive && (
                  <div className="h-0.5 w-full bg-indigo-600 mt-0.5 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* --- MOBILE TOGGLE --- */}
        <button
          className="md:hidden p-2 text-stone-600 hover:bg-stone-50 rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* --- MOBILE MENU --- */}
      {isOpen && (
        <div className="md:hidden absolute top-[96px] left-0 w-full bg-white border-b border-stone-100 py-6 px-6 flex flex-col gap-2 shadow-xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium p-4 rounded-xl transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
