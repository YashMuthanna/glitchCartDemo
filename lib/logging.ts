import { FaultName } from "./faults";

interface LogData {
  "@timestamp": string;
  "log.level": "error" | "fatal" | "warn";
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
  error: {
    type: string;
    message: string;
    stack_trace: string;
  };
  fault: {
    name: FaultName;
  };
}

// Regular (non-error) log interface
export interface RegularLogData {
  "@timestamp": string;
  "log.level": "info" | "debug";
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
  message: string;
  metadata?: Record<string, any>;
}

const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL;
const ELASTICSEARCH_API_KEY = process.env.ELASTICSEARCH_API_KEY;
const ELASTICSEARCH_INDEX = process.env.ELASTICSEARCH_INDEX || "search-j1bc";

async function sendLog(logData: LogData) {
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
        body: JSON.stringify(logData),
      }
    );

    if (response.ok) {
      console.log(
        `✅ Successfully sent log to Elasticsearch for fault: ${logData.fault.name}`
      );
    } else {
      const errorBody = await response.text();
      console.error(
        `Failed to send log to Elasticsearch. Status: ${response.status}`,
        errorBody
      );
    }
  } catch (error) {
    console.error("Error sending log to Elasticsearch:", error);
  }
}

function getLogTemplate(
  faultName: FaultName,
  serviceName: string,
  module: string
): LogData {
  const baseLog = {
    "@timestamp": new Date().toISOString(),
    "log.level": "error" as "error" | "fatal",
    service: { name: serviceName, version: "1.3.0" },
    host: {
      name: `${serviceName}-pod-${Math.random().toString(36).substring(7)}`,
    },
    event: { dataset: "ecommerce-demo.simulated-errors", module },
    fault: { name: faultName },
    error: { type: "", message: "", stack_trace: "" },
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
      break;
    case "jamPagination":
      baseLog.error = {
        type: "ApiTimeoutError",
        message:
          "Upstream service timeout. The request to the inventory service took too long to respond.",
        stack_trace:
          "TimeoutError: The request to https://inventory-service/api/products timed out after 3000ms\n    at Timeout.onTimeout [as _onTimeout] (internal/timers.js:512:13)\n    at listOnTimeout (internal/timers.js:345:12)",
      };
      break;
    case "fakeOutOfStock":
      baseLog.error = {
        type: "DatabaseConnectionError",
        message:
          "Error: connect ETIMEDOUT 52.37.141.153:5432. Could not connect to Supabase.",
        stack_trace:
          "Error: connect ETIMEDOUT\n    at Connection.connect (/app/node_modules/pg/lib/connection.js:112:17)\n    at Promise._execute (/app/node_modules/bluebird/js/release/promise.js:618:9)",
      };
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
  await sendLog(logData);
}

export async function sendRegularLog(logData: RegularLogData) {
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
        body: JSON.stringify(logData),
      }
    );

    if (response.ok) {
      console.log(
        `✅ Successfully sent regular log to Elasticsearch : ${logData.message}`
      );
    } else {
      const errorBody = await response.text();
      console.error(
        `Failed to send regular log to Elasticsearch. Status: ${response.status}`,
        errorBody
      );
    }
  } catch (error) {
    console.error("Error sending regular log to Elasticsearch:", error);
  }
}
