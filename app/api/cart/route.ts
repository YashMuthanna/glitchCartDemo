import { NextResponse } from "next/server";
import { isFaultEnabled } from "@/lib/faults";
import { triggerFakeErrorLog } from "@/lib/logging";

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
      return NextResponse.json(
        { error: "Product ID and quantity are required" },
        { status: 400 }
      );
    }

    // If we reach here, the cart operation was successful
    return NextResponse.json({
      message: "Product added to cart successfully",
      data: { productId, quantity },
    });
  } catch (error) {
    console.error("Cart operation failed:", error);
    return NextResponse.json(
      { error: "Failed to process cart operation" },
      { status: 500 }
    );
  }
}
