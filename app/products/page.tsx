import type { Metadata } from "next"
import ProductList from "@/components/product-list"
import { getProducts } from "@/lib/products"

export const metadata: Metadata = {
  title: "Products | E-commerce Demo",
  description: "Browse our complete product catalog",
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = Number.parseInt(searchParams.page || "1") || 1
  const { products, totalPages } = await getProducts(page)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
        <p className="text-neutral-500 mt-2">Browse our complete product catalog</p>
      </div>

      <ProductList products={products} currentPage={page} totalPages={totalPages} />
    </div>
  )
}
