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
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${enabled ? "enable" : "disable"} fault`);
      }

      const data = await response.json();
      setFaults(data.faults);
    } catch (error) {
      console.error("Failed to toggle fault:", error);
      setError(
        error instanceof Error ? error.message : "Failed to toggle fault"
      );
    }
  };

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-blue-50/50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Chaos Engineering Dashboard
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Toggle fault flags to simulate various error scenarios in the
            application
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-2 border-neutral-200/50">
                <CardHeader>
                  <div className="h-6 bg-neutral-200 rounded-lg animate-pulse mb-2 w-2/3"></div>
                  <div className="h-4 bg-neutral-100 rounded-lg animate-pulse w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-neutral-100 rounded-lg animate-pulse w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <Card className="group border-2 border-transparent hover:border-blue-500/50 transition-all duration-300 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                  <CardTitle>Disable Add to Cart</CardTitle>
                </div>
                <CardDescription className="text-neutral-600 mt-2">
                  When enabled, all attempts to add items to cart will fail with
                  a 500 error
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

            <Card className="group border-2 border-transparent hover:border-purple-500/50 transition-all duration-300 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Layers className="h-5 w-5" />
                  </div>
                  <CardTitle>Jam Pagination</CardTitle>
                </div>
                <CardDescription className="text-neutral-600 mt-2">
                  When enabled, product listing will always show page 1
                  regardless of requested page
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

            <Card className="group border-2 border-transparent hover:border-indigo-500/50 transition-all duration-300 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <ZapOff className="h-5 w-5" />
                  </div>
                  <CardTitle>Fake Out of Stock</CardTitle>
                </div>
                <CardDescription className="text-neutral-600 mt-2">
                  When enabled, all products will appear as out of stock (0
                  quantity)
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
