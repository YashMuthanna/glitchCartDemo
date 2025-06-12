"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/components/cart-provider";

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCart();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-8 mb-16">
          <div className="flex items-center justify-center gap-4 animate-float">
            <div className="p-3 rounded-2xl glass-effect text-purple-400">
              <ShoppingCart className="h-8 w-8" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gradient leading-tight md:leading-tight pb-2">
              Your Cart
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed pb-2">
              Review and manage your selected items
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 rounded-2xl glass-effect text-muted-foreground">
                <Package className="h-12 w-12" />
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">
                Your cart is empty
              </p>
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="glass-effect rounded-xl border-2 border-purple-500/20 p-6"
                >
                  <div className="flex gap-6">
                    <div className="relative aspect-square w-24 overflow-hidden rounded-lg bg-background/50">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        className="object-cover"
                        fill
                        sizes="96px"
                      />
                    </div>

                    <div className="flex flex-1 flex-col sm:flex-row sm:justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="font-medium text-lg text-foreground">
                          <Link
                            href={`/products/${item.id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {item.name}
                          </Link>
                        </h3>
                        <p className="text-gradient text-lg font-medium">
                          {formatCurrency(item.price)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 glass-effect hover:bg-muted"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="w-12 text-center text-foreground">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 glass-effect hover:bg-muted"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-effect rounded-xl border-2 border-purple-500/20 p-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-foreground">
                  Total
                </span>
                <span className="text-2xl font-bold text-gradient">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
