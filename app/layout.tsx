import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import { CartProvider } from "@/components/cart-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "E-commerce Demo",
  description: "A full-stack e-commerce demo application",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
            <footer className="bg-neutral-100 py-6">
              <div className="container mx-auto px-4 text-center text-neutral-500 text-sm">
                © {new Date().getFullYear()} E-commerce Demo. All rights reserved.
              </div>
            </footer>
          </div>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
