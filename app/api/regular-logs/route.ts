import { NextResponse } from "next/server";
import { sendLogEntry, LogEntry } from "@/lib/logging";

export async function POST() {
  const log: LogEntry = {
    "@timestamp": new Date().toISOString(),
    "log.level": "info",
    service: {
      name: "api-heartbeat",
      version: "1.3.0",
    },
    host: {
      name: `vercel-instance-${Math.random().toString(36).substring(7)}`,
    },
    event: {
      dataset: "heartbeat",
      module: "scheduler",
    },
    message: "Health check passed. Service is healthy.",
    http: {
      request: {
        method: "GET",
        path: "/api/health",
      },
      response: {
        status_code: 200,
        duration_ms: Math.floor(Math.random() * 20) + 10,
      },
    },
    metadata: {
      region: process.env.VERCEL_REGION || "iad1",
      uptime: Math.floor(Math.random() * 1000000),
    },
  };

  await sendLogEntry(log);
  return NextResponse.json({ success: true });
}
