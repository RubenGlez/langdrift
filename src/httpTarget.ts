import type { TargetResponse } from "./types.ts";

export type ExecuteTargetInput = {
  target: string;
  scenarioId: string;
  locale: string;
  input: string;
  agent: string;
  timeoutMs?: number;
};

// Every failure here is a harness/transport failure, not model behavior; the
// runner maps `ok: false` to the `target_error` failure mode (F-5).
export type ExecuteTargetResult =
  | { ok: true; response: TargetResponse }
  | { ok: false; detail: string };

const DEFAULT_TIMEOUT_MS = 30_000;

export async function executeHttpTarget(
  input: ExecuteTargetInput,
): Promise<ExecuteTargetResult> {
  let response: Response;

  try {
    response = await fetch(input.target, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        locale: input.locale,
        input: input.input,
        scenarioId: input.scenarioId,
        agent: input.agent,
      }),
      // Without a timeout one hung locale stalls the whole serial run forever (F-17).
      signal: AbortSignal.timeout(input.timeoutMs ?? DEFAULT_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return {
        ok: false,
        detail: `request timed out after ${input.timeoutMs ?? DEFAULT_TIMEOUT_MS}ms`,
      };
    }
    return {
      ok: false,
      detail: error instanceof Error ? error.message : "network error",
    };
  }

  if (!response.ok) {
    let errorDetail = `HTTP ${response.status} from target`;
    try {
      const errBody = (await response.json()) as Record<string, unknown>;
      if (typeof errBody.error === "string")
        errorDetail += `: ${errBody.error}`;
    } catch {
      // ignore parse errors, use status-only detail
    }
    return { ok: false, detail: errorDetail };
  }

  let body: unknown;

  try {
    body = await response.json();
  } catch {
    return { ok: false, detail: "invalid JSON response" };
  }

  return normalizeTargetResponse(body);
}

function normalizeTargetResponse(body: unknown): ExecuteTargetResult {
  // A response that isn't a JSON object violates the contract; surface it as a
  // transport error rather than silently coercing it to an empty response and
  // reporting a behavioral verdict for what is really an integration bug (F-21).
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      ok: false,
      detail: `malformed response: expected a JSON object, got ${describeShape(body)}`,
    };
  }

  const record = body as Record<string, unknown>;

  // A field of the wrong *type* is malformed; a `null` (or absent) field is
  // benign and falls through to the documented default.
  if (record.text != null && typeof record.text !== "string") {
    return {
      ok: false,
      detail: `malformed response: "text" must be a string, got ${describeShape(record.text)}`,
    };
  }

  if (record.toolCalls != null && !Array.isArray(record.toolCalls)) {
    return {
      ok: false,
      detail: `malformed response: "toolCalls" must be an array, got ${describeShape(record.toolCalls)}`,
    };
  }

  return {
    ok: true,
    response: {
      text: typeof record.text === "string" ? record.text : "",
      toolCalls: normalizeToolCalls(record.toolCalls),
      structured: "structured" in record ? record.structured : null,
    },
  };
}

function describeShape(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function normalizeToolCalls(value: unknown): TargetResponse["toolCalls"] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === "object",
    )
    .filter((item) => typeof item.name === "string")
    .map((item) => ({
      name: item.name as string,
      arguments: item.arguments,
    }));
}
