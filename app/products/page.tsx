import type { Metadata } from "next";
import ProductList from "@/components/product-list";
import { getProducts } from "@/lib/products";
import { Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Products | E-commerce Demo",
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
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-blue-50/50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Package className="h-6 w-6" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              All Products
            </h1>
          </div>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Browse our complete product catalog
          </p>
        </div>

        <ProductList
          products={products}
          currentPage={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
