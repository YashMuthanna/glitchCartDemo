"use client"

import { useState } from "react"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils"
import AddToCartButton from "@/components/add-to-cart-button"
import type { Product } from "@/types"

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="aspect-square relative bg-neutral-100 rounded-lg overflow-hidden">
        <Image
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">{product.name}</h1>
          <p className="mt-2 text-2xl font-medium text-neutral-900">{formatCurrency(product.price)}</p>
        </div>

        <div className="prose prose-neutral">
          <p>{product.description}</p>
        </div>

        <div className="pt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-700">Availability</span>
            <span className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>
        </div>

        {product.stock > 0 && (
          <div className="space-y-4">
            <div className="flex items-center">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center rounded-l-md border border-r-0 border-neutral-300 bg-neutral-50 text-neutral-600 disabled:opacity-50"
              >
                -
              </button>
              <div className="w-14 h-10 flex items-center justify-center border-y border-neutral-300 bg-white text-neutral-900">
                {quantity}
              </div>
              <button
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
                className="w-10 h-10 flex items-center justify-center rounded-r-md border border-l-0 border-neutral-300 bg-neutral-50 text-neutral-600 disabled:opacity-50"
              >
                +
              </button>
            </div>

            <AddToCartButton product={product} quantity={quantity} />
          </div>
        )}
      </div>
    </div>
  )
}
