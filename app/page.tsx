import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-24">
      <div className="text-center space-y-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900">
          GlitchCart
        </h1>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
          A full-stack Next.js application with product listings, shopping cart,
          and chaos engineering features.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/products">
              Browse Products <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/chaos">Chaos Dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-lg font-medium mb-2">Product Catalog</h3>
          <p className="text-neutral-600">
            Browse our catalog with client-side pagination and detailed product
            views.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-lg font-medium mb-2">Shopping Cart</h3>
          <p className="text-neutral-600">
            Client-side cart management with localStorage for persistence.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-lg font-medium mb-2">Chaos Engineering</h3>
          <p className="text-neutral-600">
            Toggle fault flags to simulate various error scenarios in the
            application.
          </p>
        </div>
      </div>
    </div>
  );
}
