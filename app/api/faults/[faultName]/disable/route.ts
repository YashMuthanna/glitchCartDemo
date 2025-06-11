import { NextResponse } from "next/server";
import { setFaultStatus } from "@/lib/faults";
import type { FaultName } from "@/lib/faults";

export async function POST(
  request: Request,
  { params }: { params: { faultName: string } }
) {
  try {
    const { faultName } = params;
    console.log("API Route - Received request to disable fault:", faultName);

    // Validate fault name
    if (
      !["disableAddToCart", "jamPagination", "fakeOutOfStock"].includes(
        faultName
      )
    ) {
      console.log("API Route - Invalid fault name:", faultName);
      return NextResponse.json(
        { error: "Invalid fault name" },
        { status: 400 }
      );
    }

    console.log("API Route - Attempting to disable fault:", faultName);
    const updatedFaults = await setFaultStatus(faultName as FaultName, false);
    console.log("API Route - Successfully updated faults:", updatedFaults);

    return NextResponse.json({
      message: `${faultName} fault disabled`,
      faults: updatedFaults,
    });
  } catch (error) {
    // Log the full error details
    console.error("API Route - Error disabling fault:", {
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
      { error: "Failed to disable fault" },
      { status: 500 }
    );
  }
}
