import { NextResponse } from "next/server";
import { isFaultEnabled } from "@/lib/faults";
import { getProducts } from "@/lib/products";
import { triggerFakeErrorLog, sendLogEntry } from "@/lib/logging";

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

    // Log successful product fetch
    await sendLogEntry({
      "@timestamp": new Date().toISOString(),
      "log.level": "info",
      service: { name: "api-products", version: "1.3.0" },
      host: {
        name: `vercel-instance-${Math.random().toString(36).substring(7)}`,
      },
      event: { dataset: "products", module: "products-handler" },
      message: `Fetched products for page ${page}`,
      http: {
        request: { method: "GET", path: "/api/products" },
        response: { status_code: 200, duration_ms: 0 },
      },
      metadata: { page, totalPages, count: products.length },
    });

    return NextResponse.json({
      products,
      totalPages,
      currentPage: page,
      isJammed: false,
    });
  } catch (error) {
    // Log server error
    await sendLogEntry({
      "@timestamp": new Date().toISOString(),
      "log.level": "error",
      service: { name: "api-products", version: "1.3.0" },
      host: {
        name: `vercel-instance-${Math.random().toString(36).substring(7)}`,
      },
      event: { dataset: "products", module: "products-handler" },
      message: "Failed to fetch products",
      error: {
        type: error instanceof Error ? error.name : "UnknownError",
        message: error instanceof Error ? error.message : String(error),
        stack_trace: error instanceof Error ? error.stack : undefined,
      },
      http: {
        request: { method: "GET", path: "/api/products" },
        response: { status_code: 500, duration_ms: 0 },
      },
    });
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
