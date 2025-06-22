import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { CartProvider } from "@/components/cart-provider";
import { Toaster } from "@/components/ui/toaster";
import GlitchSidebar from "@/components/glitch-sidebar";
import CartSidebar from "@/components/cart-sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GlitchCart",
  description: "A full-stack e-commerce demo application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 relative">
              <div className="container mx-auto px-4 py-8">{children}</div>
            </main>
            <footer className="py-6">
              <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
                © {new Date().getFullYear()} GlitchCart. All rights reserved.
              </div>
            </footer>
          </div>
          <CartSidebar />
          <GlitchSidebar />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
