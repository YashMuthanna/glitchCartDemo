import { FaultName } from "./faults";

// Unified log entry interface for all log types
export interface LogEntry {
  "@timestamp": string;
  "log.level": "fatal" | "error" | "warn" | "info" | "debug";
  service: {
    name: string;
    version: string;
  };
  host: {
    name: string;
  };
  event: {
    dataset: string;
    module: string;
  };
  message: string;
  // Optional error context
  error?: {
    type: string;
    message: string;
    stack_trace?: string;
  };
  // Optional fault context (for glitch/fault logs)
  fault?: {
    name: FaultName;
  };
  // Optional HTTP context
  http?: {
    request: {
      method: "GET" | "POST" | "PUT" | "DELETE";
      path: string;
    };
    response: {
      status_code: number;
      duration_ms: number;
    };
  };
  // Optional metadata
  metadata?: Record<string, any>;
}

const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL;
const ELASTICSEARCH_API_KEY = process.env.ELASTICSEARCH_API_KEY;
const ELASTICSEARCH_INDEX = process.env.ELASTICSEARCH_INDEX || "search-j1bc";

export async function sendLogEntry(log: LogEntry) {
  if (!ELASTICSEARCH_URL || !ELASTICSEARCH_API_KEY) {
    console.error(
      "Elasticsearch URL or API Key is not configured. Skipping log."
    );
    return;
  }

  try {
    const response = await fetch(
      `${ELASTICSEARCH_URL}/${ELASTICSEARCH_INDEX}/_doc`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `ApiKey ${ELASTICSEARCH_API_KEY}`,
        },
        body: JSON.stringify(log),
      }
    );

    if (response.ok) {
      console.log(
        `✅ Successfully sent log entry to Elasticsearch: ${log.message}`
      );
    } else {
      const errorBody = await response.text();
      console.error(
        `Failed to send log entry to Elasticsearch. Status: ${response.status}`,
        errorBody
      );
    }
  } catch (error) {
    console.error("Error sending log entry to Elasticsearch:", error);
  }
}

function getLogTemplate(
  faultName: FaultName,
  serviceName: string,
  module: string
): LogEntry {
  const baseLog: LogEntry = {
    "@timestamp": new Date().toISOString(),
    "log.level": "error",
    service: { name: serviceName, version: "1.3.0" },
    host: {
      name: `${serviceName}-pod-${Math.random().toString(36).substring(7)}`,
    },
    event: { dataset: "ecommerce-demo.simulated-errors", module },
    message: "",
    // error and fault will be set below if needed
  };

  switch (faultName) {
    case "disableAddToCart":
      baseLog["log.level"] = "fatal";
      baseLog.error = {
        type: "OutOfMemoryError",
        message:
          "FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory",
        stack_trace:
          "1: 0x10a2b7f v8::internal::`anonymous namespace'::V8_Fatal(char const*, ...)\n2: 0x15f4a7c v8::internal::FatalProcessOutOfMemory(v8::internal::Isolate*, char const*, bool)",
      };
      baseLog.fault = { name: faultName };
      baseLog.message = baseLog.error.message;
      break;
    case "jamPagination":
      baseLog.error = {
        type: "ApiTimeoutError",
        message:
          "Upstream service timeout. The request to the inventory service took too long to respond.",
        stack_trace:
          "TimeoutError: The request to https://inventory-service/api/products timed out after 3000ms\n    at Timeout.onTimeout [as _onTimeout] (internal/timers.js:512:13)\n    at listOnTimeout (internal/timers.js:345:12)",
      };
      baseLog.fault = { name: faultName };
      baseLog.message = baseLog.error.message;
      break;
    case "fakeOutOfStock":
      baseLog.error = {
        type: "DatabaseConnectionError",
        message:
          "Error: connect ETIMEDOUT 52.37.141.153:5432. Could not connect to Supabase.",
        stack_trace:
          "Error: connect ETIMEDOUT\n    at Connection.connect (/app/node_modules/pg/lib/connection.js:112:17)\n    at Promise._execute (/app/node_modules/bluebird/js/release/promise.js:618:9)",
      };
      baseLog.fault = { name: faultName };
      baseLog.message = baseLog.error.message;
      break;
  }
  return baseLog;
}

export async function triggerFakeErrorLog(
  faultName: FaultName,
  serviceName: string,
  module: string
) {
  const logData = getLogTemplate(faultName, serviceName, module);
  await sendLogEntry(logData);
}

// Deprecated: Old log types and senders (for migration)
// interface LogData { ... }
// interface RegularLogData { ... }
// async function sendLog(logData: LogData) { ... }
// async function sendRegularLog(logData: RegularLogData) { ... }
