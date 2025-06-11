import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart, Package, ZapOff } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 md:py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="text-center space-y-8 max-w-3xl px-4">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            GlitchCart
          </h1>
          <p className="text-xl md:text-2xl text-neutral-700 max-w-2xl mx-auto leading-relaxed">
            A full-stack Next.js application with product listings, shopping
            cart, and chaos engineering features.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button
            asChild
            size="lg"
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-lg"
          >
            <Link href="/products">
              Browse Products <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-purple-600 text-purple-700 hover:bg-purple-50 text-lg"
          >
            <Link href="/chaos">Chaos Dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
        <div className="group bg-white p-8 rounded-xl shadow-lg border-2 border-transparent hover:border-blue-500 transition-all duration-300">
          <div className="mb-4 p-3 bg-blue-100 rounded-lg w-fit group-hover:bg-blue-200 transition-colors">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-neutral-900">
            Product Catalog
          </h3>
          <p className="text-neutral-600 leading-relaxed">
            Browse our catalog with client-side pagination and detailed product
            views.
          </p>
        </div>
        <div className="group bg-white p-8 rounded-xl shadow-lg border-2 border-transparent hover:border-purple-500 transition-all duration-300">
          <div className="mb-4 p-3 bg-purple-100 rounded-lg w-fit group-hover:bg-purple-200 transition-colors">
            <ShoppingCart className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-neutral-900">
            Shopping Cart
          </h3>
          <p className="text-neutral-600 leading-relaxed">
            Client-side cart management with localStorage for persistence.
          </p>
        </div>
        <div className="group bg-white p-8 rounded-xl shadow-lg border-2 border-transparent hover:border-indigo-500 transition-all duration-300">
          <div className="mb-4 p-3 bg-indigo-100 rounded-lg w-fit group-hover:bg-indigo-200 transition-colors">
            <ZapOff className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-neutral-900">
            Chaos Engineering
          </h3>
          <p className="text-neutral-600 leading-relaxed">
            Toggle fault flags to simulate various error scenarios in the
            application.
          </p>
        </div>
      </div>
    </div>
  );
}
