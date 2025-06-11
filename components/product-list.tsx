"use client";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import Pagination from "@/components/pagination";
import type { Product } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ProductListProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
}

export default function ProductList({
  products,
  currentPage,
  totalPages,
}: ProductListProps) {
  const [error, setError] = useState<string | null>(null);
  const [isJammed, setIsJammed] = useState(false);

  const handlePageChange = async (page: number) => {
    try {
      const response = await fetch(`/api/products?page=${page}`);
      const data = await response.json();

      if (response.status === 503 && data.code === "PAGINATION_JAMMED") {
        setIsJammed(true);
        setError("Pagination service is degraded. Showing page 1 only.");
        // Don't update URL when jammed
        return;
      }

      if (!response.ok) {
        setError(data.message || "Failed to load page");
        return;
      }

      setError(null);
      setIsJammed(false);
      // Update the URL with the new page number
      window.history.pushState({}, "", `?page=${page}`);
      // Reload the page to reflect the new data
      window.location.reload();
    } catch (err) {
      setError("Failed to load page");
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <Alert variant={isJammed ? "default" : "destructive"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{isJammed ? "Service Degraded" : "Error"}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative overflow-hidden rounded-lg border bg-white"
          >
            <Link href={`/products/${product.id}`} className="block">
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
                <Image
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  priority={false}
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors">
                  {product.name}
                </h3>
                <p className="mt-1 text-neutral-500 text-sm line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-medium text-neutral-900">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-sm text-neutral-500">
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {!isJammed && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
