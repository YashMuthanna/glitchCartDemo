"use client";

import { useState } from "react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import AddToCartButton from "@/components/add-to-cart-button";
import type { Product } from "@/types";
import { Plus, Minus, Package } from "lucide-react";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-blue-50/50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square relative bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-neutral-200/50">
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Package className="h-5 w-5" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                  {product.name}
                </h1>
              </div>
              <p className="text-3xl font-medium text-neutral-900">
                {formatCurrency(product.price)}
              </p>
            </div>

            <div className="prose prose-neutral max-w-none">
              <p className="text-lg text-neutral-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                <span className="text-sm font-medium text-neutral-700">
                  Availability
                </span>
                <span
                  className={`text-sm font-medium ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </span>
              </div>
            </div>

            {product.stock > 0 && (
              <div className="space-y-6">
                <div className="flex items-center">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="w-12 h-12 flex items-center justify-center rounded-l-lg border-2 border-r-0 border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="w-20 h-12 flex items-center justify-center border-y-2 border-neutral-200 bg-white text-lg font-medium text-neutral-900">
                    {quantity}
                  </div>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                    className="w-12 h-12 flex items-center justify-center rounded-r-lg border-2 border-l-0 border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <AddToCartButton product={product} quantity={quantity} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
