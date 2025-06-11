"use client"

import { useCart } from "@/components/cart-provider"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react"

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart()

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ShoppingBag className="h-16 w-16 text-neutral-300 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-neutral-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
        <Button asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
        <p className="text-neutral-500 mt-2">Review and modify your items</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
            <ul className="divide-y divide-neutral-200">
              {items.map((item) => (
                <li key={item.id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-24 h-24 bg-neutral-100 rounded-md overflow-hidden relative flex-shrink-0">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 96px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col sm:flex-row sm:justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-medium text-neutral-900">
                          <Link href={`/products/${item.id}`} className="hover:underline">
                            {item.name}
                          </Link>
                        </h3>
                        <p className="text-neutral-500 text-sm">{formatCurrency(item.price)}</p>
                      </div>

                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-4">
                        <div className="flex items-center border border-neutral-300 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center text-neutral-600"
                          >
                            -
                          </button>
                          <div className="w-10 h-8 flex items-center justify-center border-x border-neutral-300 bg-white text-neutral-900">
                            {item.quantity}
                          </div>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-neutral-600"
                          >
                            +
                          </button>
                        </div>

                        <button onClick={() => removeItem(item.id)} className="text-neutral-500 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="p-4 sm:p-6 border-t border-neutral-200 flex justify-between">
              <Button variant="outline" size="sm" onClick={clearCart}>
                Clear Cart
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/products">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden h-fit">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Tax</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="border-t border-neutral-200 pt-3 flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
            </div>

            <Button className="w-full mt-6">Proceed to Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
