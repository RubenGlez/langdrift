import type {
  FailureMode,
  ScenarioLocale,
  TargetResponse,
  ToolCallAssertion,
} from "./types.ts";

type Pass = { pass: true; detail: string; failureMode: null };
type Fail = {
  pass: false;
  detail: string;
  failureMode: Exclude<FailureMode, null>;
};
type AssertionResult = Pass | Fail;

export function assertExpectedToolCall(
  expected: ScenarioLocale["expect"],
  response: TargetResponse,
): AssertionResult {
  const forbiddenResult = assertForbiddenToolCall(
    expected.noToolCall?.name,
    response,
  );
  if (!forbiddenResult.pass) return forbiddenResult;

  // Primary assertion: toolCall (single or anyOf)
  let primaryResult: AssertionResult | null = null;

  if (expected.toolCall !== undefined) {
    primaryResult = Array.isArray(expected.toolCall)
      ? assertAnyToolCall(expected.toolCall, response)
      : assertSingleToolCall(expected.toolCall, response);

    if (!primaryResult.pass) return primaryResult;
  }

  // Sequence assertion: toolCalls
  if (expected.toolCalls && expected.toolCalls.length > 0) {
    const sequenceResult = assertToolCallSequence(expected.toolCalls, response);
    if (!sequenceResult.pass) return sequenceResult;
    if (primaryResult === null) return sequenceResult;
  }

  return primaryResult ?? { pass: true, detail: "", failureMode: null };
}

function assertSingleToolCall(
  expected: ToolCallAssertion,
  response: TargetResponse,
): AssertionResult {
  const toolCall = response.toolCalls.find((c) => c.name === expected.name);

  if (toolCall) {
    return assertExpectedArguments(
      expected.name,
      expected.arguments,
      toolCall.arguments,
    );
  }

  if (response.toolCalls.length === 0) {
    return {
      pass: false,
      failureMode: "no_tool_call",
      detail: `expected ${expected.name}, got no tool calls`,
    };
  }

  return {
    pass: false,
    failureMode: "wrong_tool",
    detail: `expected ${expected.name}, got ${response.toolCalls.map((c) => c.name).join(", ")}`,
  };
}

function assertAnyToolCall(
  options: ToolCallAssertion[],
  response: TargetResponse,
): AssertionResult {
  // Try each option; return the first pass
  for (const option of options) {
    const result = assertSingleToolCall(option, response);
    if (result.pass) return result;
  }

  // All failed — return the best failure description
  const names = options.map((o) => o.name).join(" | ");

  if (response.toolCalls.length === 0) {
    return {
      pass: false,
      failureMode: "no_tool_call",
      detail: `expected one of [${names}], got no tool calls`,
    };
  }

  return {
    pass: false,
    failureMode: "wrong_tool",
    detail: `expected one of [${names}], got ${response.toolCalls.map((c) => c.name).join(", ")}`,
  };
}

function assertToolCallSequence(
  expected: ToolCallAssertion[],
  response: TargetResponse,
): AssertionResult {
  // Check that expected tool calls appear as a subsequence in actual tool calls
  let expectedIndex = 0;

  for (const actual of response.toolCalls) {
    if (expectedIndex >= expected.length) break;
    if (actual.name === expected[expectedIndex].name) {
      const argResult = assertExpectedArguments(
        actual.name,
        expected[expectedIndex].arguments,
        actual.arguments,
      );
      if (argResult.pass) {
        expectedIndex += 1;
      }
    }
  }

  if (expectedIndex < expected.length) {
    const missing = expected
      .slice(expectedIndex)
      .map((e) => e.name)
      .join(", ");
    return {
      pass: false,
      failureMode: "wrong_sequence",
      detail: `sequence incomplete, missing: ${missing}`,
    };
  }

  const detail = expected.map((e) => e.name).join(" → ");
  return { pass: true, detail, failureMode: null };
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

  if (
    !actualArguments ||
    typeof actualArguments !== "object" ||
    Array.isArray(actualArguments)
  ) {
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
