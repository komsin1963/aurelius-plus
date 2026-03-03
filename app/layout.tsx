import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AURELIUS STUDIO | By Komsin",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="antialiased bg-[#020203] text-white">
        {children}
      </body>
    </html>
  );
}