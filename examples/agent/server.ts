#!/usr/bin/env node
import { createServer } from "node:http";
import { ecommerceTools } from "./tools/ecommerce.ts";
import { schedulingTools } from "./tools/scheduling.ts";
import { supportTools } from "./tools/support.ts";

type Domain = "support" | "ecommerce" | "scheduling";
type Provider = "openai-compat" | "anthropic";

const domain = (process.env.DOMAIN ?? "support") as Domain;
const provider = (process.env.MODEL_PROVIDER ?? "openai-compat") as Provider;
const modelName = process.env.MODEL_NAME ?? "gpt-4o-mini";
const port = Number.parseInt(process.env.PORT ?? "3010", 10);
const host = "127.0.0.1";

const apiUrl = process.env.MODEL_API_URL ?? defaultApiUrl(provider);
const apiKey = process.env.MODEL_API_KEY ?? resolveApiKey(provider);

const tools = loadTools(domain);

const server = createServer(async (request, response) => {
  if (request.method !== "POST" || request.url !== "/api/agent") {
    sendJson(response, 404, { error: "not found" });
    return;
  }

  if (!apiKey) {
    sendJson(response, 500, { error: `API key not set for provider ${provider}` });
    return;
  }

  const body = await readJson(request);

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    sendJson(response, 400, { error: "expected JSON object" });
    return;
  }

  const payload = body as Record<string, unknown>;
  const locale = typeof payload.locale === "string" ? payload.locale : "en";
  const input = typeof payload.input === "string" ? payload.input : "";

  try {
    const result = await callModel(locale, input);

    sendJson(response, 200, {
      text: result.text,
      toolCalls: result.toolCalls,
      structured: { model: modelName, provider, domain },
    });
  } catch (error) {
    sendJson(response, 502, {
      error: error instanceof Error ? error.message : "model request failed",
    });
  }
});

server.listen(port, host, () => {
  console.log(`LangDrift agent listening on http://${host}:${port}/api/agent`);
  console.log(`Provider: ${provider} / Model: ${modelName} / Domain: ${domain}`);
});

async function callModel(locale: string, input: string): Promise<{ text: string; toolCalls: Array<{ name: string; arguments: unknown }> }> {
  if (provider === "openai-compat") {
    return callOpenAICompat(locale, input);
  }

  if (provider === "anthropic") {
    return callAnthropic(locale, input);
  }

  throw new Error(`Unknown provider: ${provider}`);
}

async function callOpenAICompat(locale: string, input: string): Promise<{ text: string; toolCalls: Array<{ name: string; arguments: unknown }> }> {
  const openAITools = tools.map((tool) => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
      strict: true,
    },
  }));

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        {
          role: "system",
          content: `You are a multilingual customer support agent. Use the available functions to help the customer. Respond in locale ${locale}.`,
        },
        { role: "user", content: input },
      ],
      tools: openAITools,
      tool_choice: "auto",
      temperature: 0,
      stream: false,
    }),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  const completion = JSON.parse(text) as OpenAICompletion;
  const message = completion.choices?.[0]?.message ?? {};

  return {
    text: typeof message.content === "string" ? message.content : "",
    toolCalls: normalizeOpenAIToolCalls(message.tool_calls),
  };
}

async function callAnthropic(locale: string, input: string): Promise<{ text: string; toolCalls: Array<{ name: string; arguments: unknown }> }> {
  const anthropicTools = tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    input_schema: tool.parameters,
  }));

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: modelName,
      max_tokens: 1024,
      system: `You are a multilingual customer support agent. Use the available functions to help the customer. Respond in locale ${locale}.`,
      messages: [{ role: "user", content: input }],
      tools: anthropicTools,
    }),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  const completion = JSON.parse(text) as AnthropicCompletion;
  const toolCalls: Array<{ name: string; arguments: unknown }> = [];
  let textContent = "";

  for (const block of completion.content ?? []) {
    if (block.type === "text") {
      textContent += block.text;
    }

    if (block.type === "tool_use") {
      toolCalls.push({ name: block.name, arguments: block.input });
    }
  }

  return { text: textContent, toolCalls };
}

function normalizeOpenAIToolCalls(value: unknown): Array<{ name: string; arguments: unknown }> {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is OpenAIToolCall =>
      Boolean(item) && typeof item === "object" && item.type === "function",
    )
    .map((item) => ({
      name: item.function?.name ?? "",
      arguments: parseJson(item.function?.arguments),
    }));
}

function parseJson(value: unknown): unknown {
  if (typeof value !== "string") return {};
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

function loadTools(d: Domain) {
  if (d === "ecommerce") return ecommerceTools;
  if (d === "scheduling") return schedulingTools;
  return supportTools;
}

function defaultApiUrl(p: Provider): string {
  if (p === "anthropic") return "https://api.anthropic.com/v1/messages";
  return "https://api.openai.com/v1/chat/completions";
}

function resolveApiKey(p: Provider): string {
  if (p === "anthropic") return process.env.ANTHROPIC_API_KEY ?? "";
  return process.env.OPENAI_API_KEY ?? process.env.MODEL_API_KEY ?? "";
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

type OpenAICompletion = {
  choices?: Array<{
    message?: { content?: string | null; tool_calls?: unknown };
  }>;
};

type OpenAIToolCall = {
  type?: string;
  function?: { name?: string; arguments?: string };
};

type AnthropicCompletion = {
  content?: Array<
    | { type: "text"; text: string }
    | { type: "tool_use"; name: string; input: unknown }
  >;
};
