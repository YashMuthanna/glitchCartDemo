"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ZapOff, ChevronRight, ChevronLeft } from "lucide-react";
import type { FaultStatus } from "@/lib/faults";

export default function GlitchSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [faults, setFaults] = useState<FaultStatus>({
    disableAddToCart: false,
    jamPagination: false,
    fakeOutOfStock: false,
  });

  useEffect(() => {
    const fetchFaults = async () => {
      try {
        const response = await fetch("/api/faults", {
          cache: "no-store",
          headers: {
            Pragma: "no-cache",
            "Cache-Control": "no-cache",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch faults");
        const data = await response.json();
        setFaults(data);
      } catch (error) {
        console.error("Failed to fetch faults:", error);
      }
    };

    // Initial fetch
    fetchFaults();

    // Set up polling every 5 seconds
    const interval = setInterval(fetchFaults, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeFaults = Object.entries(faults).filter(
    ([_, isActive]) => isActive
  );

  return (
    <div
      className={`fixed right-0 top-20 z-40 h-auto transition-all duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className={`absolute left-0 top-0 transform -translate-x-full glass-effect border border-r-0 rounded-r-none h-12 w-8 ${
          activeFaults.length > 0 ? "text-destructive" : "text-muted-foreground"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      {/* Sidebar Content */}
      <div className="w-64 glass-effect border rounded-l-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <ZapOff className="h-5 w-5 text-destructive" />
          <h2 className="font-semibold text-sm">Active Chaos</h2>
        </div>

        {activeFaults.length > 0 ? (
          <div className="space-y-3">
            {activeFaults.map(([faultName, _]) => (
              <div
                key={faultName}
                className="p-3 rounded-lg bg-destructive/10 border border-destructive/20"
              >
                <p className="text-sm font-medium text-destructive">
                  {formatFaultName(faultName)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No active chaos</p>
        )}
      </div>
    </div>
  );
}

function formatFaultName(faultName: string): string {
  switch (faultName) {
    case "disableAddToCart":
      return "Add to Cart Disabled";
    case "jamPagination":
      return "Pagination Jammed";
    case "fakeOutOfStock":
      return "Products Out of Stock";
    default:
      return faultName;
  }
}
