import { NextResponse } from "next/server";
import { isFaultEnabled } from "@/lib/faults";
import { triggerFakeErrorLog, sendLogEntry } from "@/lib/logging";

export async function POST(request: Request) {
  try {
    // Check if the disableAddToCart fault is enabled
    const isDisabled = await isFaultEnabled("disableAddToCart");

    if (isDisabled) {
      // Trigger a fake database connection error log
      await triggerFakeErrorLog(
        "disableAddToCart",
        "api-cart",
        "app/api/cart/route.ts"
      );

      return NextResponse.json(
        { error: "Add to cart functionality is currently disabled" },
        { status: 503 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId || !quantity) {
      // Log user error
      await sendLogEntry({
        "@timestamp": new Date().toISOString(),
        "log.level": "warn",
        service: { name: "api-cart", version: "1.3.0" },
        host: {
          name: `vercel-instance-${Math.random().toString(36).substring(7)}`,
        },
        event: { dataset: "cart", module: "cart-handler" },
        message: "Product ID and quantity are required",
        http: {
          request: { method: "POST", path: "/api/cart" },
          response: { status_code: 400, duration_ms: 0 },
        },
        metadata: { productId, quantity },
      });
      return NextResponse.json(
        { error: "Product ID and quantity are required" },
        { status: 400 }
      );
    }

    // Log successful add to cart
    await sendLogEntry({
      "@timestamp": new Date().toISOString(),
      "log.level": "info",
      service: { name: "api-cart", version: "1.3.0" },
      host: {
        name: `vercel-instance-${Math.random().toString(36).substring(7)}`,
      },
      event: { dataset: "cart", module: "cart-handler" },
      message: `Product added to cart successfully (productId=${productId}, quantity=${quantity})`,
      http: {
        request: { method: "POST", path: "/api/cart" },
        response: { status_code: 200, duration_ms: 0 },
      },
      metadata: { productId, quantity },
    });

    // If we reach here, the cart operation was successful
    return NextResponse.json({
      message: "Product added to cart successfully",
      data: { productId, quantity },
    });
  } catch (error) {
    // Log server error
    await sendLogEntry({
      "@timestamp": new Date().toISOString(),
      "log.level": "error",
      service: { name: "api-cart", version: "1.3.0" },
      host: {
        name: `vercel-instance-${Math.random().toString(36).substring(7)}`,
      },
      event: { dataset: "cart", module: "cart-handler" },
      message: "Cart operation failed",
      error: {
        type: error instanceof Error ? error.name : "UnknownError",
        message: error instanceof Error ? error.message : String(error),
        stack_trace: error instanceof Error ? error.stack : undefined,
      },
      http: {
        request: { method: "POST", path: "/api/cart" },
        response: { status_code: 500, duration_ms: 0 },
      },
    });
    return NextResponse.json(
      { error: "Failed to process cart operation" },
      { status: 500 }
    );
  }
}
