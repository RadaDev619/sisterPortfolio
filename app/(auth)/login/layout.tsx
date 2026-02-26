import React from "react";
import { Inter, Playfair_Display } from "next/font/google";
// We import the CSS from your admin folder so the styling works
// Ensure this path matches where one of your globals.css files is located
import "../../admin/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata = {
  title: "Login | Workspace",
  description: "Secure Admin Login",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-white`}
      >
        {children}
      </body>
    </html>
  );
}
