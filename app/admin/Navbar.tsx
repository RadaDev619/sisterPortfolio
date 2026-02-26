"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, Loader2 } from "lucide-react";
import { logoutUserAction } from "@/actions/auth-actions"; // adjust path

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Teaching", href: "/admin/teachingAdmin" },
    { name: "Blog", href: "/admin/blogAdmin" },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUserAction();
      // The server action redirects, so we may not reach here,
      // but just in case, we can force a client-side redirect.
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-sm">
      <nav className="container mx-auto px-6 h-18 flex items-center justify-between">
        {/* --- LOGO SECTION --- */}
        <Link href="/admin" className="flex items-center h-full py-2">
          <img
            src="/logo.png"
            alt="Sonam Zangmo Logo"
            className="h-30 md:h-32 w-auto object-contain hover:opacity-80 transition-opacity"
          />
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-indigo-600"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                {link.name}
                {isActive && (
                  <div className="h-0.5 w-full bg-indigo-600 mt-0.5 rounded-full" />
                )}
              </Link>
            );
          })}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="ml-4 px-5 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loggingOut ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <LogOut size={16} />
            )}
            Logout
          </button>
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
          {/* Mobile Logout */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-lg font-medium p-4 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-3"
          >
            {loggingOut ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <LogOut size={20} />
            )}
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
