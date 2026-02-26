import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "./Navbar";
import {
  Facebook,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  Building2,
} from "lucide-react";
import { SiTiktok, SiYoutube } from "react-icons/si"; // Added TikTok & YouTube
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sonam Zangmo | Portfolio",
  description: "Mathematics Educator & STEM Advocate",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar />

          <main className="flex-grow">{children}</main>

          <footer className="bg-slate-900 text-slate-300 pt-12 pb-8">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-white font-bold mb-4 text-lg">
                  Contact Information
                </h3>
                <div className="space-y-3 text-sm">
                  <p className="flex items-center gap-3">
                    <Building2 size={18} className="text-blue-400" /> Office:
                    +975 2 322166
                  </p>
                  <p className="flex items-center gap-3">
                    <Phone size={18} className="text-blue-400" /> Mobile: +975
                    17999799
                  </p>
                  <p className="flex items-center gap-3">
                    <Mail size={18} className="text-blue-400" />
                    <a
                      href="mailto:sonam.zangmo@education.gov.bt"
                      className="hover:text-white underline"
                    >
                      sonam.zangmo@education.gov.bt
                    </a>
                  </p>
                </div>
              </div>
              <div className="md:text-right">
                <h3 className="text-white font-bold mb-4 text-lg">
                  Connect With Me
                </h3>
                <div className="flex md:justify-end gap-5">
                  <a
                    href="https://www.facebook.com/sonam.adap#"
                    className="hover:text-blue-400 transition"
                  >
                    <Facebook />
                  </a>
                  <a
                    href="https://youtube.com/@adapsom7009"
                    className="hover:text-blue-400 transition"
                  >
                    <SiYoutube className="w-6 h-6" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/sonam-zangmo-50b52b169/"
                    className="hover:text-blue-400 transition"
                  >
                    <Linkedin />
                  </a>
                  <a
                    href="https://www.instagram.com/somzam2021/"
                    className="hover:text-blue-400 transition"
                  >
                    <Instagram />
                  </a>
                  <a
                    href="https://www.tiktok.com/@adap_som"
                    className="hover:text-blue-400 transition"
                  >
                    <SiTiktok className="w-6 h-6" />
                  </a>
                </div>
                <Link
                  href="/login"
                  className="inline-block mt-8 text-xs text-slate-500 hover:text-slate-300"
                >
                  Admin Login
                </Link>
              </div>
            </div>
            <div className="container mx-auto px-6 mt-12 pt-6 border-t border-slate-800 text-center text-xs">
              ©2026 Sonam Zangmo. All rights reserved. &{" "}
              <span className="ml-1">
                Website developed by{" "}
                <a
                  href="https://your-portfolio.com"
                  className="hover:text-slate-700 underline"
                  target="_blank"
                >
                  Rada
                </a>
              </span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
