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
// to their primary non-Latin Unicode script range, expressed as a character-class
// body so SCRIPT_PATTERNS and NON_LATIN_PATTERN are derived from one source and
// can never drift apart (F-2).
const SCRIPT_RANGES: Record<string, string> = {
  ja: "぀-ヿ一-鿿㐀-䶿", // kana + Han; see KANA_PATTERN for the Japanese-specific guard
  zh: "一-鿿㐀-䶿",
  ko: "가-힯",
  ar: "؀-ۿ",
  fa: "؀-ۿ",
  ur: "؀-ۿ",
  ru: "Ѐ-ӿ",
  uk: "Ѐ-ӿ",
  bg: "Ѐ-ӿ",
  sr: "Ѐ-ӿ",
  mn: "Ѐ-ӿ",
  hi: "ऀ-ॿ",
  mr: "ऀ-ॿ",
  bn: "ঀ-৿",
  th: "฀-๿",
  he: "֐-׿",
  el: "Ͱ-Ͽ",
  ka: "Ⴀ-ჿ",
  am: "ሀ-፿",
};

const SCRIPT_PATTERNS: Record<string, RegExp> = Object.fromEntries(
  Object.entries(SCRIPT_RANGES).map(([locale, range]) => [
    locale,
    new RegExp(`[${range}]`, "u"),
  ]),
);

// Hiragana + katakana. A reply written entirely in Han (i.e. Chinese) has zero
// kana, so requiring at least one kana character stops pure-Chinese text from
// passing `responseLanguage: ja` (F-3).
const KANA_PATTERN = /[぀-ヿ]/u;

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

// Every non-Latin script range known to SCRIPT_RANGES, combined; used to detect
// unexpected non-Latin content in Latin-locale responses. Derived from the same
// table as SCRIPT_PATTERNS so newly added scripts (e.g. ka, am) are covered here
// automatically. Duplicate ranges in the class are harmless.
const NON_LATIN_PATTERN = new RegExp(
  `[${Object.values(SCRIPT_RANGES).join("")}]`,
  "u",
);

// Whether the script check can ever fail for a locale. When false, the check is
// a guaranteed pass (a silent no-op) and lint should say so (F-29).
export function isScriptDeterminable(locale: string): boolean {
  const base = locale.split("-")[0].toLowerCase();
  return base in SCRIPT_PATTERNS || LATIN_LOCALES.has(base);
}

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
    expected.noToolCall?.names,
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
  // Best near-miss for the step we're currently waiting on: a call with the
  // right name whose arguments didn't match. Surfaced so the failure detail
  // doesn't claim a present-but-wrong call is "missing" (F-6).
  let nearMiss: string | null = null;

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
        nearMiss = null;
      } else {
        nearMiss = `${actual.name} called but ${argResult.detail}`;
      }
    }
  }

  if (expectedIndex < expected.length) {
    const missing = expected
      .slice(expectedIndex)
      .map((e) => e.name)
      .join(", ");
    const detail = nearMiss
      ? `sequence incomplete, missing: ${missing} (${nearMiss})`
      : `sequence incomplete, missing: ${missing}`;
    return {
      pass: false,
      failureMode: "wrong_sequence",
      detail,
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
    const ratio = scriptCount / letters.length;

    // Japanese: Han alone is Chinese; require at least one kana character.
    if (base === "ja" && !KANA_PATTERN.test(text)) {
      return {
        pass: false,
        failureMode: "wrong_language",
        detail: `expected ja script (kana) in response, found none (in-script ratio ${ratio.toFixed(2)})`,
      };
    }

    if (ratio < 0.1) {
      return {
        pass: false,
        failureMode: "wrong_language",
        detail: `expected ${base} script in response, got mostly other script (in-script ratio ${ratio.toFixed(2)})`,
      };
    }

    return {
      pass: true,
      detail: `responseLanguage: ${expectedLocale} (in-script ratio ${ratio.toFixed(2)})`,
      failureMode: null,
    };
  }

  if (LATIN_LOCALES.has(base)) {
    // Known Latin-script locale: response should not be dominated by a non-Latin script.
    const nonLatinCount = letters.filter((c) =>
      NON_LATIN_PATTERN.test(c),
    ).length;
    const nonLatinRatio = nonLatinCount / letters.length;
    if (nonLatinRatio > 0.5) {
      return {
        pass: false,
        failureMode: "wrong_language",
        detail: `expected Latin-script response (${base}), got mostly non-Latin characters (non-Latin ratio ${nonLatinRatio.toFixed(2)})`,
      };
    }

    return {
      pass: true,
      detail: `responseLanguage: ${expectedLocale} (non-Latin ratio ${nonLatinRatio.toFixed(2)})`,
      failureMode: null,
    };
  }

  // Script not determinable for this locale: pass rather than guess.
  return {
    pass: true,
    detail: `responseLanguage: ${expectedLocale} (script not determinable)`,
    failureMode: null,
  };
}

function assertForbiddenToolCall(
  forbiddenNames: string[] | undefined,
  response: TargetResponse,
): Pass | Fail {
  if (!forbiddenNames || forbiddenNames.length === 0) {
    return { pass: true, detail: "", failureMode: null };
  }

  const found = response.toolCalls.find((c) => forbiddenNames.includes(c.name));

  if (!found) {
    return { pass: true, detail: "", failureMode: null };
  }

  return {
    pass: false,
    failureMode: "forbidden_tool",
    detail: `forbidden tool call ${found.name} was called`,
  };
}

// Scalar-normalized equality: tolerates JSON-type vs YAML-string differences
// (number 2 matches "2", boolean true matches "true") so canonical tool args
// are not falsely failed on type alone. Non-scalar actuals (arrays, objects,
// null, undefined) never match — `String()` would flatten `["x"]` to `"x"` and
// let a regressed array-of-enums pass a scalar assertion (F-1).
function matchesScalar(actual: unknown, expected: string): boolean {
  if (
    typeof actual !== "string" &&
    typeof actual !== "number" &&
    typeof actual !== "boolean"
  ) {
    return false;
  }
  return String(actual) === expected;
}

// Human-readable rendering of an actual argument value for failure details,
// naming the shape rather than coercing it (F-1).
function describeActual(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return `array ${JSON.stringify(value)}`;
  if (typeof value === "object") return `object ${JSON.stringify(value)}`;
  return String(value);
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
        detail: `expected argument ${key}=${describeArg(expectedValue)}, got ${describeActual(actual[key])}`,
      };
    }
  }

  return { pass: true, detail: toolName, failureMode: null };
}
