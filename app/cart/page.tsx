"use client";

import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  CreditCard,
} from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-blue-50/50 flex flex-col items-center justify-center py-12 text-center px-4">
        <div className="p-4 rounded-full bg-blue-100 text-blue-600 mb-6">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Your cart is empty
        </h1>
        <p className="text-lg text-neutral-600 mb-8">
          Looks like you haven't added any products to your cart yet.
        </p>
        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-blue-50/50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Shopping Cart
            </h1>
          </div>
          <p className="text-xl text-neutral-600">
            Review and modify your items
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border-2 border-neutral-200/50 overflow-hidden shadow-lg">
              <ul className="divide-y divide-neutral-200">
                {items.map((item) => (
                  <li key={item.id} className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="w-full sm:w-32 h-32 bg-neutral-100 rounded-lg overflow-hidden relative flex-shrink-0 border border-neutral-200">
                        <Image
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 128px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex flex-1 flex-col sm:flex-row sm:justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="font-medium text-lg text-neutral-900">
                            <Link
                              href={`/products/${item.id}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {item.name}
                            </Link>
                          </h3>
                          <p className="text-neutral-600 text-lg font-medium">
                            {formatCurrency(item.price)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-4">
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className="w-10 h-10 flex items-center justify-center rounded-l-lg border-2 border-r-0 border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <div className="w-14 h-10 flex items-center justify-center border-y-2 border-neutral-200 bg-white text-lg font-medium text-neutral-900">
                              {item.quantity}
                            </div>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-10 h-10 flex items-center justify-center rounded-r-lg border-2 border-l-0 border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-neutral-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="h-5 w-5" />
                            <span className="sr-only">Remove item</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="p-6 border-t border-neutral-200 flex justify-between">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="border-2 border-neutral-200 hover:bg-neutral-50 transition-colors"
                >
                  Clear Cart
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Link href="/products">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-neutral-200/50 overflow-hidden h-fit shadow-lg">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-base">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-neutral-600">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-neutral-600">Tax</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="border-t-2 border-neutral-200 pt-4 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
              </div>

              <Button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-lg h-12">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
