import type {
  ArgMatcher,
  FailureMode,
  ScenarioLocale,
  TargetResponse,
  ToolCallAssertion,
} from "./types.ts";

// responseLanguage is a script-family check, not language detection. It confirms
// a response uses the script a locale is written in; it cannot tell apart
// languages that share a script (en/fr, ar/fa/ur, ru/uk). Maps BCP-47 base tags
// to their primary non-Latin Unicode script range.
const SCRIPT_PATTERNS: Record<string, RegExp> = {
  ja: /[぀-ヿ一-鿿㐀-䶿]/,
  zh: /[一-鿿㐀-䶿]/,
  ko: /[가-힯]/,
  ar: /[؀-ۿ]/,
  fa: /[؀-ۿ]/,
  ur: /[؀-ۿ]/,
  ru: /[Ѐ-ӿ]/,
  uk: /[Ѐ-ӿ]/,
  bg: /[Ѐ-ӿ]/,
  sr: /[Ѐ-ӿ]/,
  mn: /[Ѐ-ӿ]/,
  hi: /[ऀ-ॿ]/,
  mr: /[ऀ-ॿ]/,
  bn: /[ঀ-৿]/,
  th: /[฀-๿]/,
  he: /[֐-׿]/,
  el: /[Ͱ-Ͽ]/,
  ka: /[Ⴀ-ჿ]/,
  am: /[ሀ-፿]/,
};

// Locales known to use a Latin script. The non-Latin penalty only fires for
// these; a locale that is neither in SCRIPT_PATTERNS nor here is treated as
// "script not determinable" and passes rather than being wrongly flagged.
const LATIN_LOCALES = new Set([
  "en",
  "fr",
  "es",
  "de",
  "it",
  "pt",
  "nl",
  "sv",
  "da",
  "no",
  "fi",
  "pl",
  "cs",
  "tr",
  "id",
  "vi",
  "sw",
  "cy",
  "eu",
  "yo",
]);

// All non-Latin script ranges combined; used to detect unexpected non-Latin content in Latin-locale responses.
const NON_LATIN_PATTERN = /[Ͱ-ϿЀ-ӿ֐-׿؀-ۿऀ-৿฀-๿ᄀ-ᇿ぀-ヿ㐀-䶿一-鿿가-힯]/;

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
    if (primaryResult === null) primaryResult = sequenceResult;
  }

  // Language assertion: runs last so tool call failures surface first
  if (expected.responseLanguage) {
    const langResult = assertResponseLanguage(
      expected.responseLanguage,
      response.text,
    );
    if (!langResult.pass) return langResult;
    if (primaryResult === null) return langResult;
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

function assertResponseLanguage(
  expectedLocale: string,
  text: string,
): AssertionResult {
  const letters = [...text].filter((c) => /\p{L}/u.test(c));

  if (letters.length === 0) {
    return {
      pass: true,
      detail: `responseLanguage: ${expectedLocale}`,
      failureMode: null,
    };
  }

  const base = expectedLocale.split("-")[0].toLowerCase();
  const scriptPattern = SCRIPT_PATTERNS[base];

  if (scriptPattern) {
    const scriptCount = letters.filter((c) => scriptPattern.test(c)).length;
    if (scriptCount / letters.length < 0.1) {
      return {
        pass: false,
        failureMode: "wrong_language",
        detail: `expected ${base} script in response, got mostly other script`,
      };
    }
  } else if (LATIN_LOCALES.has(base)) {
    // Known Latin-script locale: response should not be dominated by a non-Latin script.
    const nonLatinCount = letters.filter((c) =>
      NON_LATIN_PATTERN.test(c),
    ).length;
    if (nonLatinCount / letters.length > 0.5) {
      return {
        pass: false,
        failureMode: "wrong_language",
        detail: `expected Latin-script response (${base}), got mostly non-Latin characters`,
      };
    }
  } else {
    // Script not determinable for this locale: pass rather than guess.
    return {
      pass: true,
      detail: `responseLanguage: ${expectedLocale} (script not determinable)`,
      failureMode: null,
    };
  }

  return {
    pass: true,
    detail: `responseLanguage: ${expectedLocale}`,
    failureMode: null,
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

// Scalar-normalized equality: tolerates JSON-type vs YAML-string differences
// (number 2 matches "2", boolean true matches "true") so canonical tool args
// are not falsely failed on type alone.
function matchesScalar(
  actual: unknown,
  expected: string | number | boolean,
): boolean {
  return String(actual) === String(expected);
}

function matchesArg(actual: unknown, expected: ArgMatcher): boolean {
  if (
    typeof expected === "object" &&
    expected !== null &&
    "oneOf" in expected
  ) {
    return expected.oneOf.some((option) => matchesScalar(actual, option));
  }
  return matchesScalar(actual, expected);
}

function describeArg(expected: ArgMatcher): string {
  if (
    typeof expected === "object" &&
    expected !== null &&
    "oneOf" in expected
  ) {
    return `one of [${expected.oneOf.join(", ")}]`;
  }
  return String(expected);
}

function assertExpectedArguments(
  toolName: string,
  expectedArguments: Record<string, ArgMatcher> | undefined,
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
        detail: `expected argument ${key}=${describeArg(expectedValue)}, got missing`,
      };
    }

    if (!matchesArg(actual[key], expectedValue)) {
      return {
        pass: false,
        failureMode: "wrong_argument",
        detail: `expected argument ${key}=${describeArg(expectedValue)}, got ${String(actual[key])}`,
      };
    }
  }

  return { pass: true, detail: toolName, failureMode: null };
}
