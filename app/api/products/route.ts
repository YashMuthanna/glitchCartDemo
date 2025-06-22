import { NextResponse } from "next/server";
import { isFaultEnabled } from "@/lib/faults";
import { getProducts } from "@/lib/products";
import { triggerFakeErrorLog } from "@/lib/logging";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let page = Number(searchParams.get("page")) || 1;

    // Check if jamPagination fault is enabled
    const isJammed = await isFaultEnabled("jamPagination");
    if (isJammed) {
      // Trigger a fake API timeout error log
      await triggerFakeErrorLog(
        "jamPagination",
        "api-products",
        "app/api/products/route.ts"
      );

      // Return a 503 Service Unavailable with a clear error message
      return NextResponse.json(
        {
          error: "Pagination service degraded",
          code: "PAGINATION_JAMMED",
          requestedPage: page,
          message:
            "The pagination service is currently experiencing issues. All requests will default to page 1.",
          products: (await getProducts(1)).products, // Always get page 1
          totalPages: 1, // Force single page view when jammed
          currentPage: 1,
          isJammed: true,
        },
        {
          status: 503,
          headers: {
            "Retry-After": "300", // Suggest retry after 5 minutes
            "X-Error-Code": "PAGINATION_JAMMED",
          },
        }
      );
    }

    const { products, totalPages } = await getProducts(page);

    return NextResponse.json({
      products,
      totalPages,
      currentPage: page,
      isJammed: false,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
