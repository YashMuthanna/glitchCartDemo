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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Chaos Engineering Dashboard
        </h1>
        <p className="text-neutral-500 mt-2">
          Toggle fault flags to simulate various error scenarios in the
          application
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-neutral-200 rounded animate-pulse mb-2 w-2/3"></div>
                <div className="h-4 bg-neutral-100 rounded animate-pulse w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-neutral-100 rounded animate-pulse w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Disable Add to Cart</CardTitle>
              <CardDescription>
                When enabled, all attempts to add items to cart will fail with a
                500 error
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

          <Card>
            <CardHeader>
              <CardTitle>Jam Pagination</CardTitle>
              <CardDescription>
                When enabled, product listing will always show page 1 regardless
                of requested page
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

          <Card>
            <CardHeader>
              <CardTitle>Fake Out of Stock</CardTitle>
              <CardDescription>
                When enabled, all products will appear as out of stock (0
                quantity)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FaultToggle
                faultName="fakeOutOfStock"
                isEnabled={faults.fakeOutOfStock}
                onToggle={(enabled) => handleToggle("fakeOutOfStock", enabled)}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
