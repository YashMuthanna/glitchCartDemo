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
import {
  AlertTriangle,
  ZapOff,
  ShoppingCart,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface GlitchDetails {
  repairUrl: string;
  curlCommand: string;
  monitorUrl: string;
}

const glitchDetails: Record<FaultName, GlitchDetails> = {
  disableAddToCart: {
    repairUrl: "/api/faults/disableAddToCart/disable",
    curlCommand:
      "curl -X POST https://gc.alloi.ai/api/faults/disableAddToCart/disable",
    monitorUrl: "/api/cart",
  },
  jamPagination: {
    repairUrl: "/api/faults/jamPagination/disable",
    curlCommand:
      "curl -X POST https://gc.alloi.ai/api/faults/jamPagination/disable",
    monitorUrl: "/api/products?page=2",
  },
  fakeOutOfStock: {
    repairUrl: "/api/faults/fakeOutOfStock/disable",
    curlCommand:
      "curl -X POST https://gc.alloi.ai/api/faults/fakeOutOfStock/disable",
    monitorUrl: "/api/products/1",
  },
};

export default function ChaosPage() {
  const [faults, setFaults] = useState<FaultStatus>({
    disableAddToCart: false,
    jamPagination: false,
    fakeOutOfStock: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
    {}
  );

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

  const toggleCard = (cardId: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
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
              Chaos Dashboard
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
              <CardContent className="space-y-4">
                <FaultToggle
                  faultName="disableAddToCart"
                  isEnabled={faults.disableAddToCart}
                  onToggle={(enabled) =>
                    handleToggle("disableAddToCart", enabled)
                  }
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full flex items-center justify-between"
                  onClick={() => toggleCard("disableAddToCart")}
                >
                  Details
                  {expandedCards["disableAddToCart"] ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                {expandedCards["disableAddToCart"] && (
                  <div className="pt-2 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Monitor URL:
                      </p>
                      <pre className="text-xs bg-muted/50 p-2 rounded-lg overflow-x-auto">
                        <a
                          href={glitchDetails.disableAddToCart.monitorUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {glitchDetails.disableAddToCart.monitorUrl}
                        </a>
                      </pre>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Repair URL:
                      </p>
                      <pre className="text-xs bg-muted/50 p-2 rounded-lg overflow-x-auto">
                        {glitchDetails.disableAddToCart.repairUrl}
                      </pre>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Sample Curl Command:
                      </p>
                      <pre className="text-xs bg-muted/50 p-2 rounded-lg overflow-x-auto">
                        {glitchDetails.disableAddToCart.curlCommand}
                      </pre>
                    </div>
                  </div>
                )}
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
              <CardContent className="space-y-4">
                <FaultToggle
                  faultName="jamPagination"
                  isEnabled={faults.jamPagination}
                  onToggle={(enabled) => handleToggle("jamPagination", enabled)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full flex items-center justify-between"
                  onClick={() => toggleCard("jamPagination")}
                >
                  Details
                  {expandedCards["jamPagination"] ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                {expandedCards["jamPagination"] && (
                  <div className="pt-2 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Monitor URL:
                      </p>
                      <pre className="text-xs bg-muted/50 p-2 rounded-lg overflow-x-auto">
                        <a
                          href={glitchDetails.jamPagination.monitorUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {glitchDetails.jamPagination.monitorUrl}
                        </a>
                      </pre>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Repair URL:
                      </p>
                      <pre className="text-xs bg-muted/50 p-2 rounded-lg overflow-x-auto">
                        {glitchDetails.jamPagination.repairUrl}
                      </pre>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Sample Curl Command:
                      </p>
                      <pre className="text-xs bg-muted/50 p-2 rounded-lg overflow-x-auto">
                        {glitchDetails.jamPagination.curlCommand}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* <Card className="glass-effect border-2 border-purple-500/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-purple-400" />
                  <CardTitle>Stock Status</CardTitle>
                </div>
                <CardDescription>
                  Mark all products as out of stock
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FaultToggle
                  faultName="fakeOutOfStock"
                  isEnabled={faults.fakeOutOfStock}
                  onToggle={(enabled) =>
                    handleToggle("fakeOutOfStock", enabled)
                  }
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full flex items-center justify-between"
                  onClick={() => toggleCard("fakeOutOfStock")}
                >
                  Details
                  {expandedCards["fakeOutOfStock"] ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                {expandedCards["fakeOutOfStock"] && (
                  <div className="pt-2 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Monitor URL:
                      </p>
                      <pre className="text-xs bg-muted/50 p-2 rounded-lg overflow-x-auto">
                        <a
                          href={glitchDetails.fakeOutOfStock.monitorUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {glitchDetails.fakeOutOfStock.monitorUrl}
                        </a>
                      </pre>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Repair URL:
                      </p>
                      <pre className="text-xs bg-muted/50 p-2 rounded-lg overflow-x-auto">
                        {glitchDetails.fakeOutOfStock.repairUrl}
                      </pre>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Sample Curl Command:
                      </p>
                      <pre className="text-xs bg-muted/50 p-2 rounded-lg overflow-x-auto">
                        {glitchDetails.fakeOutOfStock.curlCommand}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card> */}
          </div>
        )}
      </div>
    </div>
  );
}
