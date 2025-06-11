import { NextResponse } from "next/server";
import { getFaultStatus } from "@/lib/faults";

export async function GET() {
  try {
    const faults = await getFaultStatus();
    return NextResponse.json(faults);
  } catch (error) {
    console.error("Error fetching faults:", error);
    return NextResponse.json(
      { error: "Failed to fetch fault status" },
      { status: 500 }
    );
  }
}
