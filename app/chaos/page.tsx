"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FaultToggle from "@/components/fault-toggle";
import type { FaultName, FaultStatus } from "@/lib/faults";
import { AlertTriangle, ZapOff, ShoppingCart, Layers } from "lucide-react";

export default function ChaosPage() {
  const [faults, setFaults] = useState<FaultStatus>({
    disableAddToCart: false,
    jamPagination: false,
    fakeOutOfStock: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch current fault states on component mount
    const fetchFaultStates = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/faults", {
          cache: "no-store",
          headers: {
            Pragma: "no-cache",
            "Cache-Control": "no-cache",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch fault states");
        }
        const data = await response.json();
        setFaults(data);
      } catch (error) {
        console.error("Failed to fetch fault states:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch fault states"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaultStates();
  }, []);

  const handleToggle = async (faultName: FaultName, enabled: boolean) => {
    try {
      const response = await fetch(
        `/api/faults/${faultName}/${enabled ? "enable" : "disable"}`,
        { method: "POST" }
      );
      if (!response.ok) throw new Error("Failed to toggle fault");
      const data = await response.json();
      setFaults(data.faults);
    } catch (error) {
      console.error("Failed to toggle fault:", error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-8 mb-16">
          <div className="flex items-center justify-center gap-4 animate-float">
            <div className="p-3 rounded-2xl glass-effect text-purple-400">
              <ZapOff className="h-8 w-8" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gradient leading-tight md:leading-tight pb-2">
              Chaos Engineering Dashboard
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed pb-2">
              Toggle fault flags to simulate various error scenarios in the
              application
            </p>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-destructive/50 p-4 bg-destructive/10 text-center">
            <AlertTriangle className="h-6 w-6 text-destructive mx-auto mb-2" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card
                key={i}
                className="glass-effect border-2 border-purple-500/20"
              >
                <CardHeader>
                  <div className="h-6 bg-muted rounded-lg animate-pulse mb-2 w-2/3"></div>
                  <div className="h-4 bg-muted/50 rounded-lg animate-pulse w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted/50 rounded-lg animate-pulse w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass-effect border-2 border-purple-500/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-purple-400" />
                  <CardTitle>Add to Cart</CardTitle>
                </div>
                <CardDescription>
                  Disable the ability to add items to cart
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FaultToggle
                  faultName="disableAddToCart"
                  isEnabled={faults.disableAddToCart}
                  onToggle={(enabled) =>
                    handleToggle("disableAddToCart", enabled)
                  }
                />
              </CardContent>
            </Card>

            <Card className="glass-effect border-2 border-purple-500/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-violet-400" />
                  <CardTitle>Pagination</CardTitle>
                </div>
                <CardDescription>
                  Force all pagination requests to return page 1
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FaultToggle
                  faultName="jamPagination"
                  isEnabled={faults.jamPagination}
                  onToggle={(enabled) => handleToggle("jamPagination", enabled)}
                />
              </CardContent>
            </Card>

            <Card className="glass-effect border-2 border-purple-500/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-purple-400" />
                  <CardTitle>Stock Status</CardTitle>
                </div>
                <CardDescription>
                  Mark all products as out of stock
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FaultToggle
                  faultName="fakeOutOfStock"
                  isEnabled={faults.fakeOutOfStock}
                  onToggle={(enabled) =>
                    handleToggle("fakeOutOfStock", enabled)
                  }
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
