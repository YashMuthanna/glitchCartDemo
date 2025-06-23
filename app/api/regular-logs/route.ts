import { NextResponse } from "next/server";
import { sendRegularLog, RegularLogData } from "@/lib/logging";

function randomLogLevel(): "info" | "debug" {
  return Math.random() > 0.5 ? "info" : "debug";
}

function randomService() {
  const services = ["api-cart", "api-products", "api-orders"];
  return services[Math.floor(Math.random() * services.length)];
}

function randomModule() {
  const modules = ["scheduler", "nextjs-api", "worker", "controller"];
  return modules[Math.floor(Math.random() * modules.length)];
}

function randomDataset() {
  const datasets = ["heartbeat", "api-requests", "background-jobs"];
  return datasets[Math.floor(Math.random() * datasets.length)];
}

function randomMessage() {
  const messages = [
    "Scheduled heartbeat tick",
    "Fetched product list",
    "Cart updated successfully",
    "Background job completed",
    "Health check passed",
    "Debug: cache hit for product page",
    "User session validated",
    "API request processed",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

function randomHttp() {
  if (Math.random() > 0.5) return undefined;
  const methods = ["GET", "POST", "PUT", "DELETE"];
  const paths = ["/api/cart", "/api/products", "/api/orders", "/api/health"];
  return {
    request: {
      method: methods[Math.floor(Math.random() * methods.length)] as
        | "GET"
        | "POST"
        | "PUT"
        | "DELETE",
      path: paths[Math.floor(Math.random() * paths.length)],
    },
    response: {
      status_code: [200, 201, 204, 400, 404][Math.floor(Math.random() * 5)],
      duration_ms: Math.floor(Math.random() * 100) + 10,
    },
  };
}

function randomMetadata() {
  if (Math.random() > 0.7) return undefined;
  return {
    page: Math.ceil(Math.random() * 5),
    userId: Math.floor(Math.random() * 1000),
  };
}

export async function POST() {
  const logs: RegularLogData[] = Array.from({ length: 8 }).map(() => {
    const service = randomService();
    return {
      "@timestamp": new Date().toISOString(),
      "log.level": randomLogLevel(),
      service: {
        name: service,
        version: "1.3.0",
      },
      host: {
        name: `${service}-pod-${Math.random().toString(36).substring(7)}`,
      },
      event: {
        dataset: randomDataset(),
        module: randomModule(),
      },
      http: randomHttp(),
      message: randomMessage(),
      metadata: randomMetadata(),
    };
  });

  await Promise.all(logs.map((log) => sendRegularLog(log)));
  return NextResponse.json({ success: true, sent: logs.length });
}
