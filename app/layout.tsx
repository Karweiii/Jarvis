"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Spinner } from "@/components/ui/spinner";
import { Toaster } from "@/components/ui/toaster"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isNavbarLoaded, setIsNavbarLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsNavbarLoaded(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {!pathname.includes("login") && !pathname.includes("register") && (
          <Navbar />
        )}
        {!isNavbarLoaded ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col items-center justify-center h-screen">
              <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 font-semibold text-2xl">Loading...</p>
                
            </div>
            
            
          </div>
        ) : (
          children
        )}
        <Toaster />
      </body>
    </html>
  );
}
