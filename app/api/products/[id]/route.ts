import { NextResponse } from "next/server";
import { isFaultEnabled } from "@/lib/faults";
import { getProduct } from "@/lib/products";
import { triggerFakeErrorLog } from "@/lib/logging";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProduct(params.id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if fakeOutOfStock fault is enabled
    const isOutOfStock = await isFaultEnabled("fakeOutOfStock");
    if (isOutOfStock) {
      // Trigger a fake out of memory error log
      await triggerFakeErrorLog(
        "fakeOutOfStock",
        "api-products-detail",
        "app/api/products/[id]/route.ts"
      );

      return NextResponse.json(
        {
          ...product,
          stock: 0,
          error: "Product temporarily out of stock",
          code: "STOCK_UNAVAILABLE",
          message:
            "This product is currently out of stock due to a service degradation",
        },
        {
          status: 503,
          headers: {
            "Retry-After": "300", // Suggest retry after 5 minutes
            "X-Error-Code": "STOCK_UNAVAILABLE",
          },
        }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
