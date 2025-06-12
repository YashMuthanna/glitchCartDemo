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
        <Alert variant={isJammed ? "service" : "destructive"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{isJammed ? "Service Degraded" : "Error"}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative overflow-hidden rounded-xl glass-effect border-2 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
          >
            <Link href={`/products/${product.id}`} className="block">
              <div className="relative aspect-square w-full overflow-hidden bg-background/50">
                <Image
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  priority={false}
                />
              </div>
              <div className="p-6">
                <h3 className="font-medium text-lg text-foreground group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="mt-2 text-muted-foreground text-sm line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-medium text-gradient">
                    {formatCurrency(product.price)}
                  </span>
                  <span
                    className={`text-sm ${
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
            className="glass-effect hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="glass-effect hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
