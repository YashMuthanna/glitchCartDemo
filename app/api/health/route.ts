import { NextResponse } from "next/server";
import { sendLogEntry } from "@/lib/logging";

export async function GET() {
  try {
    await sendLogEntry({
      "@timestamp": new Date().toISOString(),
      "log.level": "info",
      service: { name: "api-health", version: "1.3.0" },
      host: {
        name: `vercel-instance-${Math.random().toString(36).substring(7)}`,
      },
      event: { dataset: "health", module: "health-handler" },
      message: "Health check passed.",
      http: {
        request: { method: "GET", path: "/api/health" },
        response: { status_code: 200, duration_ms: 0 },
      },
    });
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    await sendLogEntry({
      "@timestamp": new Date().toISOString(),
      "log.level": "error",
      service: { name: "api-health", version: "1.3.0" },
      host: {
        name: `vercel-instance-${Math.random().toString(36).substring(7)}`,
      },
      event: { dataset: "health", module: "health-handler" },
      message: "Health check failed.",
      error: {
        type: error instanceof Error ? error.name : "UnknownError",
        message: error instanceof Error ? error.message : String(error),
        stack_trace: error instanceof Error ? error.stack : undefined,
      },
      http: {
        request: { method: "GET", path: "/api/health" },
        response: { status_code: 500, duration_ms: 0 },
      },
    });
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
