#!/usr/bin/env node
import { createServer } from "node:http";

const port = Number.parseInt(process.env.PORT ?? "3011", 10);
const host = "127.0.0.1";
const failingLocales = new Set((process.env.FAIL_LOCALES ?? "sw,zh").split(",").filter(Boolean));

const server = createServer(async (request, response) => {
  if (request.method !== "POST" || request.url !== "/api/agent") {
    sendJson(response, 404, { error: "not found" });
    return;
  }

  const body = await readJson(request);

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    sendJson(response, 400, { error: "expected JSON object" });
    return;
  }

  const payload = body as Record<string, unknown>;
  const locale = typeof payload.locale === "string" ? payload.locale : "en";

  if (failingLocales.has(locale)) {
    sendJson(response, 200, {
      text: localizedText(locale),
      toolCalls: [],
      structured: {
        fake: true,
        drift: "dropped_tool_call",
      },
    });
    return;
  }

  sendJson(response, 200, {
    text: localizedText(locale),
    toolCalls: [
      {
        name: "create_refund_ticket",
        arguments: {
          reason: "duplicate_charge",
        },
      },
    ],
    structured: {
      fake: true,
      drift: null,
    },
  });
});

server.listen(port, host, () => {
  console.log(`LangDrift fake agent listening on http://${host}:${port}/api/agent`);
  console.log(`Intentional dropped-tool locales: ${Array.from(failingLocales).join(", ") || "none"}`);
});

function localizedText(locale: string): string {
  if (locale === "fr") return "Je peux vous aider.";
  if (locale === "zh") return "我可以帮您处理。";
  if (locale === "sw") return "Naweza kusaidia.";
  return "I can help.";
}

function sendJson(response: import("node:http").ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, { "content-type": "application/json" });
  response.end(JSON.stringify(body));
}

async function readJson(request: import("node:http").IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (chunks.length === 0) return null;
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return null;
  }
}
