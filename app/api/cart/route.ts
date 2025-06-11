import { NextResponse } from "next/server";
import { isFaultEnabled } from "@/lib/faults";

export async function POST(request: Request) {
  try {
    // Check if the disableAddToCart fault is enabled
    const isDisabled = await isFaultEnabled("disableAddToCart");

    if (isDisabled) {
      return NextResponse.json(
        { error: "Add to cart functionality is currently disabled" },
        { status: 500 }
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
