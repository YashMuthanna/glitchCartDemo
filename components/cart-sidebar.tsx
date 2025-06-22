"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Package, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/components/cart-provider";

export default function CartSidebar() {
  const { items, updateQuantity, removeItem, isCartOpen, closeCart } =
    useCart();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-md bg-background/80 backdrop-blur-sm shadow-2xl transition-transform duration-300 ease-in-out z-50 ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-gradient flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Your Cart
          </h2>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 p-6">
            <div className="p-4 rounded-2xl glass-effect text-muted-foreground">
              <Package className="h-12 w-12" />
            </div>
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">
                Your cart is empty
              </p>
              <Button asChild onClick={closeCart}>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="glass-effect rounded-xl border-2 border-purple-500/20 p-4"
              >
                <div className="flex gap-4">
                  <div className="relative aspect-square w-20 overflow-hidden rounded-lg bg-background/50">
                    <Image
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.name}
                      className="object-cover"
                      fill
                      sizes="80px"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-2">
                    <div className="space-y-1">
                      <h3 className="font-medium text-md text-foreground">
                        <Link
                          href={`/products/${item.id}`}
                          className="hover:text-primary transition-colors"
                          onClick={closeCart}
                        >
                          {item.name}
                        </Link>
                      </h3>
                      <p className="text-gradient text-md font-medium">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 glass-effect hover:bg-muted"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center text-foreground text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 glass-effect hover:bg-muted"
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
                        className="text-xs text-muted-foreground hover:text-destructive"
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
        )}

        {items.length > 0 && (
          <div className="p-6 border-t border-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-foreground">Total</span>
              <span className="text-2xl font-bold text-gradient">
                {formatCurrency(total)}
              </span>
            </div>
            <Button size="lg" className="w-full">
              Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
