import { NextResponse } from "next/server";
import { isFaultEnabled } from "@/lib/faults";
import { getProducts } from "@/lib/products";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let page = Number(searchParams.get("page")) || 1;

    // Check if jamPagination fault is enabled
    const isJammed = await isFaultEnabled("jamPagination");
    if (isJammed) {
      page = 1; // Force page 1 if jamPagination is enabled
    }

    const { products, totalPages } = await getProducts(page);

    return NextResponse.json({
      products,
      totalPages,
      currentPage: isJammed ? 1 : page,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
