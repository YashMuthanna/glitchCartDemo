import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ProductDetail from "@/components/product-detail"
import { getProduct } from "@/lib/products"

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const product = await getProduct(params.id)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: `${product.name} | E-commerce Demo`,
    description: product.description,
  }
}

export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}
