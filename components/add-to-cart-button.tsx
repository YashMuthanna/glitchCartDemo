"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
  quantity: number;
}

export default function AddToCartButton({
  product,
  quantity,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add item to cart");
      }

      // Add to local cart state
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity,
      });

      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.name} added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isLoading || product.stock === 0}
      className="w-full glass-effect hover:bg-primary/20"
      size="lg"
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      {isLoading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
