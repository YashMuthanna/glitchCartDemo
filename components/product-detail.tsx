"use client";

import { useState } from "react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import AddToCartButton from "@/components/add-to-cart-button";
import type { Product } from "@/types";
import { Plus, Minus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="relative aspect-square glass-effect rounded-xl border-2 border-purple-500/20 overflow-hidden">
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
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl glass-effect text-purple-400">
                  <Package className="h-6 w-6" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-gradient">
                  {product.name}
                </h1>
              </div>
              <p className="text-3xl font-medium text-gradient">
                {formatCurrency(product.price)}
              </p>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="pt-2">
              <div className="glass-effect rounded-xl border-2 border-purple-500/20 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">
                    Availability
                  </span>
                  <span
                    className={`font-medium ${
                      product.stock > 0
                        ? "text-emerald-400"
                        : "text-destructive"
                    }`}
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </span>
                </div>
              </div>
            </div>

            {product.stock > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    variant="outline"
                    size="icon"
                    className="glass-effect hover:bg-muted"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-20 h-12 flex items-center justify-center glass-effect rounded-lg border-2 border-purple-500/20 text-lg font-medium text-foreground">
                    {quantity}
                  </div>
                  <Button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                    variant="outline"
                    size="icon"
                    className="glass-effect hover:bg-muted"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
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
