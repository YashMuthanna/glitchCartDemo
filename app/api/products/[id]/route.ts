export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { isFaultEnabled } from "@/lib/faults";
import { getProduct } from "@/lib/products";
import { triggerFakeErrorLog, sendLogEntry } from "@/lib/logging";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProduct(params.id);

    if (!product) {
      // Log not found
      await sendLogEntry({
        "@timestamp": new Date().toISOString(),
        "log.level": "warn",
        service: { name: "api-products-detail", version: "1.3.0" },
        host: {
          name: `vercel-instance-${Math.random().toString(36).substring(7)}`,
        },
        event: { dataset: "products", module: "product-detail-handler" },
        message: `Product not found (id=${params.id})`,
        http: {
          request: { method: "GET", path: `/api/products/${params.id}` },
          response: { status_code: 404, duration_ms: 0 },
        },
        metadata: { id: params.id },
      });
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

    // Log successful product detail fetch
    await sendLogEntry({
      "@timestamp": new Date().toISOString(),
      "log.level": "info",
      service: { name: "api-products-detail", version: "1.3.0" },
      host: {
        name: `vercel-instance-${Math.random().toString(36).substring(7)}`,
      },
      event: { dataset: "products", module: "product-detail-handler" },
      message: `Fetched product detail (id=${params.id})`,
      http: {
        request: { method: "GET", path: `/api/products/${params.id}` },
        response: { status_code: 200, duration_ms: 0 },
      },
      metadata: { id: params.id },
    });

    return NextResponse.json(product);
  } catch (error) {
    // Log server error
    await sendLogEntry({
      "@timestamp": new Date().toISOString(),
      "log.level": "error",
      service: { name: "api-products-detail", version: "1.3.0" },
      host: {
        name: `vercel-instance-${Math.random().toString(36).substring(7)}`,
      },
      event: { dataset: "products", module: "product-detail-handler" },
      message: "Failed to fetch product detail",
      error: {
        type: error instanceof Error ? error.name : "UnknownError",
        message: error instanceof Error ? error.message : String(error),
        stack_trace: error instanceof Error ? error.stack : undefined,
      },
      http: {
        request: { method: "GET", path: `/api/products/${params.id}` },
        response: { status_code: 500, duration_ms: 0 },
      },
      metadata: { id: params.id },
    });
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
