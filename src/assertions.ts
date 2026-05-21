import type { FailureMode, ScenarioLocale, TargetResponse } from "./types.ts";

type Pass = { pass: true; detail: string; failureMode: null };
type Fail = { pass: false; detail: string; failureMode: Exclude<FailureMode, null> };
type AssertionResult = Pass | Fail;

export function assertExpectedToolCall(
  expected: ScenarioLocale["expect"],
  response: TargetResponse,
): AssertionResult {
  const forbiddenResult = assertForbiddenToolCall(expected.noToolCall?.name, response);

  if (!forbiddenResult.pass) {
    return forbiddenResult;
  }

  const expectedName = expected.toolCall.name;
  const toolCall = response.toolCalls.find((candidate) => candidate.name === expectedName);

  if (toolCall) {
    return assertExpectedArguments(expectedName, expected.toolCall.arguments, toolCall.arguments);
  }

  if (response.toolCalls.length === 0) {
    return {
      pass: false,
      failureMode: "no_tool_call",
      detail: `expected ${expectedName}, got no tool calls`,
    };
  }

  return {
    pass: false,
    failureMode: "wrong_tool",
    detail: `expected ${expectedName}, got ${response.toolCalls.map((c) => c.name).join(", ")}`,
  };
}

function assertForbiddenToolCall(
  forbiddenName: string | undefined,
  response: TargetResponse,
): Pass | Fail {
  if (!forbiddenName) {
    return { pass: true, detail: "", failureMode: null };
  }

  const found = response.toolCalls.find((c) => c.name === forbiddenName);

  if (!found) {
    return { pass: true, detail: "", failureMode: null };
  }

  return {
    pass: false,
    failureMode: "forbidden_tool",
    detail: `forbidden tool call ${forbiddenName} was called`,
  };
}

function assertExpectedArguments(
  toolName: string,
  expectedArguments: Record<string, string> | undefined,
  actualArguments: unknown,
): Pass | Fail {
  if (!expectedArguments || Object.keys(expectedArguments).length === 0) {
    return { pass: true, detail: toolName, failureMode: null };
  }

  if (!actualArguments || typeof actualArguments !== "object" || Array.isArray(actualArguments)) {
    return {
      pass: false,
      failureMode: "missing_argument",
      detail: "expected tool arguments, got none",
    };
  }

  const actual = actualArguments as Record<string, unknown>;

  for (const [key, expectedValue] of Object.entries(expectedArguments)) {
    if (!(key in actual)) {
      return {
        pass: false,
        failureMode: "missing_argument",
        detail: `expected argument ${key}=${expectedValue}, got missing`,
      };
    }

    if (actual[key] !== expectedValue) {
      return {
        pass: false,
        failureMode: "wrong_argument",
        detail: `expected argument ${key}=${expectedValue}, got ${String(actual[key])}`,
      };
    }
  }

  return { pass: true, detail: toolName, failureMode: null };
}
