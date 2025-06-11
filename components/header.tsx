"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { items } = useCart();

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Chaos", href: "/chaos" },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-white hover:opacity-80 transition-opacity"
            >
              GlitchCart
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-all duration-200 hover:text-white/90 ${
                  pathname === item.href ||
                  (item.href !== "/" && pathname?.startsWith(item.href))
                    ? "text-white"
                    : "text-white/70"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="relative p-2 text-white/70 hover:text-white transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-blue-600 bg-white rounded-full border-2 border-blue-600">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-base font-medium rounded-lg transition-all duration-200 hover:bg-white/10 ${
                    pathname === item.href ||
                    (item.href !== "/" && pathname?.startsWith(item.href))
                      ? "text-white bg-white/10"
                      : "text-white/70"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
