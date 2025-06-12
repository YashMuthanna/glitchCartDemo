import type { Metadata } from "next";
import ProductList from "@/components/product-list";
import { getProducts } from "@/lib/products";
import { Package, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Products | GlitchCart",
  description: "Browse our complete product catalog",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number.parseInt(searchParams.page || "1") || 1;
  const { products, totalPages } = await getProducts(page);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-8 mb-16">
          <div className="flex items-center justify-center gap-4 animate-float">
            <div className="p-3 rounded-2xl glass-effect text-purple-400">
              <Package className="h-8 w-8" />
            </div>
            <div className="p-3 rounded-2xl glass-effect text-violet-400">
              <Sparkles className="h-8 w-8" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gradient leading-tight md:leading-tight pb-2">
              Discover Amazing Products
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed pb-2">
              Explore our curated collection of unique items
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-violet-500/5 rounded-3xl -m-4 blur-3xl"></div>
          <div className="relative">
            <ProductList
              products={products}
              currentPage={page}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
