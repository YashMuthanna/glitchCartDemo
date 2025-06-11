import { NextResponse } from "next/server";
import { getFaultStatus } from "@/lib/faults";

export const dynamic = "force-dynamic"; // Disable static optimization
export const revalidate = 0; // Disable cache

export async function GET() {
  try {
    const faults = await getFaultStatus();

    // Return response with cache control headers
    return new NextResponse(JSON.stringify(faults), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error fetching faults:", error);
    return NextResponse.json(
      { error: "Failed to fetch fault status" },
      { status: 500 }
    );
  }
}
