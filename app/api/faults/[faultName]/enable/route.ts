import { NextResponse } from "next/server";
import { setFaultStatus } from "@/lib/faults";
import type { FaultName } from "@/lib/faults";

export async function POST(
  request: Request,
  { params }: { params: { faultName: string } }
) {
  try {
    const { faultName } = params;
    // console.log("API Route - Received request to enable fault:", faultName);

    // Validate fault name
    if (
      !["disableAddToCart", "jamPagination", "fakeOutOfStock"].includes(
        faultName
      )
    ) {
      // console.log("API Route - Invalid fault name:", faultName);
      return NextResponse.json(
        { error: "Invalid fault name" },
        { status: 400 }
      );
    }

    // console.log("API Route - Attempting to enable fault:", faultName);
    const updatedFaults = await setFaultStatus(faultName as FaultName, true);
    // console.log("API Route - Successfully updated faults:", updatedFaults);

    return NextResponse.json({
      message: `${faultName} fault enabled`,
      faults: updatedFaults,
    });
  } catch (error) {
    // Log the full error details
    console.error("API Route - Error enabling fault:", {
      faultName: params.faultName,
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
            }
          : error,
    });

    return NextResponse.json(
      { error: "Failed to enable fault" },
      { status: 500 }
    );
  }
}
