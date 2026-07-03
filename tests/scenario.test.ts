import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { assertExpectedToolCall } from "../src/assertions.ts";
import { INIT_TEMPLATES, initScenario, starterScenario } from "../src/init.ts";
import { formatJsonReport } from "../src/reportJson.ts";
import { formatMarkdownRunReport } from "../src/reportMarkdown.ts";
import { parseScenario } from "../src/scenario.ts";

test("parses the explicit v0 scenario shape", () => {
  const scenario = parseScenario(`
id: refund_request
agent: support

locales:
  en:
    input: "I was charged twice."
    expect:
      toolCall:
        name: create_refund_ticket
        arguments:
          reason: duplicate_charge
      noToolCall:
        name: escalate_to_human
`);

  assert.equal(scenario.id, "refund_request");
  assert.equal(scenario.agent, "support");
  assert.equal(scenario.locales.en.input, "I was charged twice.");
  const tc = scenario.locales.en.expect.toolCall;
  assert.ok(!Array.isArray(tc) && tc !== undefined);
  assert.equal(tc.name, "create_refund_ticket");
  assert.deepEqual(tc.arguments, { reason: "duplicate_charge" });
  assert.deepEqual(scenario.locales.en.expect.noToolCall?.names, [
    "escalate_to_human",
  ]);
});

test("fails when the expected tool call is missing", () => {
  const result = assertExpectedToolCall(
    { toolCall: { name: "create_refund_ticket" } },
    { text: "I can help.", toolCalls: [], structured: null },
  );

  assert.deepEqual(result, {
    pass: false,
    failureMode: "no_tool_call",
    detail: "expected create_refund_ticket, got no tool calls",
  });
});

test("fails when an expected tool call argument is missing", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: {
        name: "create_refund_ticket",
        arguments: { reason: "duplicate_charge" },
      },
    },
    {
      text: "I can help.",
      toolCalls: [{ name: "create_refund_ticket", arguments: {} }],
      structured: null,
    },
  );

  assert.deepEqual(result, {
    pass: false,
    failureMode: "missing_argument",
    detail: "expected argument reason=duplicate_charge, got missing",
  });
});

test("fails when a forbidden tool call appears", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: { name: "create_refund_ticket" },
      noToolCall: { names: ["escalate_to_human"] },
    },
    {
      text: "I need a person.",
      toolCalls: [
        { name: "create_refund_ticket" },
        { name: "escalate_to_human" },
      ],
      structured: null,
    },
  );

  assert.deepEqual(result, {
    pass: false,
    failureMode: "forbidden_tool",
    detail: "forbidden tool call escalate_to_human was called",
  });
});

test("passes when a forbidden tool call is absent", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: { name: "create_refund_ticket" },
      noToolCall: { names: ["escalate_to_human"] },
    },
    {
      text: "I can help.",
      toolCalls: [{ name: "create_refund_ticket" }],
      structured: null,
    },
  );

  assert.deepEqual(result, {
    pass: true,
    failureMode: null,
    detail: "create_refund_ticket",
  });
});

test("fails when an expected tool call argument has the wrong value", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: {
        name: "create_refund_ticket",
        arguments: { reason: "duplicate_charge" },
      },
    },
    {
      text: "I can help.",
      toolCalls: [
        { name: "create_refund_ticket", arguments: { reason: "other" } },
      ],
      structured: null,
    },
  );

  assert.deepEqual(result, {
    pass: false,
    failureMode: "wrong_argument",
    detail: "expected argument reason=duplicate_charge, got other",
  });
});

test("passes when expected tool call arguments match", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: {
        name: "create_refund_ticket",
        arguments: { reason: "duplicate_charge" },
      },
    },
    {
      text: "I can help.",
      toolCalls: [
        {
          name: "create_refund_ticket",
          arguments: { reason: "duplicate_charge", locale: "en" },
        },
      ],
      structured: null,
    },
  );

  assert.deepEqual(result, {
    pass: true,
    failureMode: null,
    detail: "create_refund_ticket",
  });
});

test("passes when the expected tool call appears", () => {
  const result = assertExpectedToolCall(
    { toolCall: { name: "create_refund_ticket" } },
    {
      text: "I can help.",
      toolCalls: [{ name: "create_refund_ticket" }],
      structured: null,
    },
  );

  assert.deepEqual(result, {
    pass: true,
    failureMode: null,
    detail: "create_refund_ticket",
  });
});

test("anyOf passes when the first option matches", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: [
        { name: "check_availability" },
        { name: "book_new_appointment" },
      ],
    },
    { text: "", toolCalls: [{ name: "check_availability" }], structured: null },
  );
  assert.deepEqual(result, {
    pass: true,
    failureMode: null,
    detail: "check_availability",
  });
});

test("anyOf passes when the second option matches", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: [
        { name: "check_availability" },
        { name: "book_new_appointment" },
      ],
    },
    {
      text: "",
      toolCalls: [{ name: "book_new_appointment" }],
      structured: null,
    },
  );
  assert.deepEqual(result, {
    pass: true,
    failureMode: null,
    detail: "book_new_appointment",
  });
});

test("anyOf fails when no option matches", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: [
        { name: "check_availability" },
        { name: "book_new_appointment" },
      ],
    },
    { text: "", toolCalls: [{ name: "cancel_order" }], structured: null },
  );
  assert.deepEqual(result, {
    pass: false,
    failureMode: "wrong_tool",
    detail:
      "expected one of [check_availability | book_new_appointment], got cancel_order",
  });
});

test("anyOf fails with no_tool_call when no tools called", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: [
        { name: "check_availability" },
        { name: "book_new_appointment" },
      ],
    },
    { text: "Let me look into that.", toolCalls: [], structured: null },
  );
  assert.deepEqual(result, {
    pass: false,
    failureMode: "no_tool_call",
    detail:
      "expected one of [check_availability | book_new_appointment], got no tool calls",
  });
});

test("toolCalls sequence passes when all steps appear in order", () => {
  const result = assertExpectedToolCall(
    {
      toolCalls: [
        { name: "check_availability" },
        { name: "book_new_appointment" },
      ],
    },
    {
      text: "",
      toolCalls: [
        { name: "check_availability" },
        { name: "book_new_appointment" },
      ],
      structured: null,
    },
  );
  assert.deepEqual(result, {
    pass: true,
    failureMode: null,
    detail: "check_availability → book_new_appointment",
  });
});

test("toolCalls sequence passes with extra tool calls between steps", () => {
  const result = assertExpectedToolCall(
    {
      toolCalls: [
        { name: "check_availability" },
        { name: "book_new_appointment" },
      ],
    },
    {
      text: "",
      toolCalls: [
        { name: "check_availability" },
        { name: "get_user_preferences" },
        { name: "book_new_appointment" },
      ],
      structured: null,
    },
  );
  assert.equal(result.pass, true);
});

test("toolCalls sequence fails when a step is missing", () => {
  const result = assertExpectedToolCall(
    {
      toolCalls: [
        { name: "check_availability" },
        { name: "book_new_appointment" },
      ],
    },
    { text: "", toolCalls: [{ name: "check_availability" }], structured: null },
  );
  assert.deepEqual(result, {
    pass: false,
    failureMode: "wrong_sequence",
    detail: "sequence incomplete, missing: book_new_appointment",
  });
});

test("toolCalls sequence fails when steps are out of order", () => {
  const result = assertExpectedToolCall(
    {
      toolCalls: [
        { name: "check_availability" },
        { name: "book_new_appointment" },
      ],
    },
    {
      text: "",
      toolCalls: [
        { name: "book_new_appointment" },
        { name: "check_availability" },
      ],
      structured: null,
    },
  );
  assert.deepEqual(result, {
    pass: false,
    failureMode: "wrong_sequence",
    detail: "sequence incomplete, missing: book_new_appointment",
  });
});

test("responseLanguage passes when Japanese text is in ja locale", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: { name: "create_refund_ticket" },
      responseLanguage: "ja",
    },
    {
      text: "払い戻しの手続きを開始します。",
      toolCalls: [{ name: "create_refund_ticket" }],
      structured: null,
    },
  );
  assert.equal(result.pass, true);
  assert.equal(result.failureMode, null);
});

test("responseLanguage fails when English text is expected to be Japanese", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: { name: "create_refund_ticket" },
      responseLanguage: "ja",
    },
    {
      text: "I will start the refund process for you.",
      toolCalls: [{ name: "create_refund_ticket" }],
      structured: null,
    },
  );
  assert.equal(result.pass, false);
  assert.equal(result.failureMode, "wrong_language");
  assert.match(result.detail, /expected ja script/);
});

test("responseLanguage passes when Latin-script response matches en locale", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: { name: "create_refund_ticket" },
      responseLanguage: "en",
    },
    {
      text: "I will process your refund now.",
      toolCalls: [{ name: "create_refund_ticket" }],
      structured: null,
    },
  );
  assert.equal(result.pass, true);
  assert.equal(result.failureMode, null);
});

test("responseLanguage fails when Japanese text is expected to be English", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: { name: "create_refund_ticket" },
      responseLanguage: "en",
    },
    {
      text: "払い戻しの手続きを開始します。",
      toolCalls: [{ name: "create_refund_ticket" }],
      structured: null,
    },
  );
  assert.equal(result.pass, false);
  assert.equal(result.failureMode, "wrong_language");
  assert.match(result.detail, /expected Latin-script response \(en\)/);
});

test("responseLanguage passes when Arabic text matches ar locale", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: { name: "create_refund_ticket" },
      responseLanguage: "ar",
    },
    {
      text: "سأبدأ عملية استرداد الأموال الآن.",
      toolCalls: [{ name: "create_refund_ticket" }],
      structured: null,
    },
  );
  assert.equal(result.pass, true);
  assert.equal(result.failureMode, null);
});

test("responseLanguage can be the sole assertion", () => {
  const result = assertExpectedToolCall(
    { responseLanguage: "ru" },
    {
      text: "Я обработаю ваш возврат.",
      toolCalls: [],
      structured: null,
    },
  );
  assert.equal(result.pass, true);
  assert.equal(result.failureMode, null);
  assert.match(result.detail, /responseLanguage: ru/);
});

test("responseLanguage tool call failure surfaces before language check", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: { name: "create_refund_ticket" },
      responseLanguage: "ja",
    },
    {
      text: "払い戻しの手続きを開始します。",
      toolCalls: [],
      structured: null,
    },
  );
  assert.deepEqual(result, {
    pass: false,
    failureMode: "no_tool_call",
    detail: "expected create_refund_ticket, got no tool calls",
  });
});

test("parses responseLanguage from YAML", () => {
  const scenario = parseScenario(`
id: multilingual_response
agent: support

locales:
  ja:
    input: 払い戻しを申請したいです
    expect:
      toolCall:
        name: create_refund_ticket
      responseLanguage: ja
`);
  assert.equal(scenario.locales.ja.expect.responseLanguage, "ja");
});

test("parses responseLanguage as sole assertion from YAML", () => {
  const scenario = parseScenario(`
id: language_check_only
agent: support

locales:
  en:
    input: Hello
    expect:
      responseLanguage: en
`);
  assert.equal(scenario.locales.en.expect.responseLanguage, "en");
  assert.equal(scenario.locales.en.expect.toolCall, undefined);
});

test("parses anyOf from YAML and asserts correctly", () => {
  const scenario = parseScenario(`
id: booking
agent: scheduling

locales:
  en:
    input: Book me a slot
    expect:
      toolCall:
        anyOf:
          - name: check_availability
          - name: book_new_appointment
            arguments:
              slot: morning
`);
  const tc = scenario.locales.en.expect.toolCall;
  assert.ok(Array.isArray(tc));
  assert.equal(tc.length, 2);
  assert.equal(tc[0].name, "check_availability");
  assert.equal(tc[1].name, "book_new_appointment");
  assert.deepEqual(tc[1].arguments, { slot: "morning" });
});

test("parses toolCalls sequence from YAML and asserts correctly", () => {
  const scenario = parseScenario(`
id: booking_flow
agent: scheduling

locales:
  en:
    input: Check and then book for me
    expect:
      toolCalls:
        - name: check_availability
        - name: book_new_appointment
          arguments:
            slot: morning
`);
  const tcs = scenario.locales.en.expect.toolCalls;
  assert.ok(Array.isArray(tcs));
  assert.equal(tcs?.length, 2);
  assert.equal(tcs?.[0].name, "check_availability");
  assert.equal(tcs?.[1].name, "book_new_appointment");
  assert.deepEqual(tcs?.[1].arguments, { slot: "morning" });
});

test("starter scenario generated by init is parseable", () => {
  const scenario = parseScenario(starterScenario("support"));

  assert.equal(scenario.id, "refund_request");
  assert.equal(scenario.agent, "support");
  assert.deepEqual(Object.keys(scenario.locales), ["en", "fr"]);
  const tc2 = scenario.locales.en.expect.toolCall;
  assert.ok(!Array.isArray(tc2) && tc2 !== undefined);
  assert.equal(tc2.name, "create_refund_ticket");
});

test("all init templates generate parseable scenarios", () => {
  const expectedAgents = {
    support: "support",
    ecommerce: "ecommerce",
    scheduling: "scheduling",
    generic: "generic",
  };

  for (const template of INIT_TEMPLATES) {
    const scenario = parseScenario(starterScenario(template));

    assert.equal(scenario.agent, expectedAgents[template]);
    assert.deepEqual(Object.keys(scenario.locales), ["en", "fr"]);
  }
});

test("init writes the requested template", async () => {
  const dir = await mkdtemp(join(tmpdir(), "langdrift-init-"));
  const path = join(dir, "scenario.yaml");

  await initScenario(path, "ecommerce");

  const scenario = parseScenario(await readFile(path, "utf8"));
  assert.equal(scenario.id, "cancel_order_request");
  assert.equal(scenario.agent, "ecommerce");
  const tc3 = scenario.locales.en.expect.toolCall;
  assert.ok(!Array.isArray(tc3) && tc3 !== undefined);
  assert.equal(tc3.name, "cancel_order");
});

test("formats a stable JSON run report with iteration counts", () => {
  const report = formatJsonReport({
    scenarioId: "refund_request",
    target: "http://127.0.0.1:3010/api/agent",
    iterations: 3,
    results: [
      {
        locale: "en",
        status: "pass",
        passed: 3,
        failed: 0,
        total: 3,
        failureMode: null,
        detail: "create_refund_ticket",
      },
      {
        locale: "fr",
        status: "fail",
        passed: 1,
        failed: 2,
        total: 3,
        failureMode: "no_tool_call",
        detail: "expected create_refund_ticket, got no tool calls",
      },
    ],
  });

  const parsed = JSON.parse(report) as {
    schemaVersion: number;
    status: string;
    iterations: number;
    summary: {
      locales: number;
      passedLocales: number;
      failedLocales: number;
      totalRuns: number;
      totalPassed: number;
    };
    results: Array<{
      locale: string;
      status: string;
      passed: number;
      failed: number;
      total: number;
    }>;
  };

  assert.equal(parsed.schemaVersion, 2);
  assert.equal(parsed.status, "failed");
  assert.equal(parsed.iterations, 3);
  assert.deepEqual(parsed.summary, {
    locales: 2,
    passedLocales: 1,
    failedLocales: 1,
    totalRuns: 6,
    totalPassed: 4,
  });
  assert.deepEqual(
    parsed.results.map((r) => [r.locale, r.status, r.passed, r.total]),
    [
      ["en", "pass", 3, 3],
      ["fr", "fail", 1, 3],
    ],
  );
});

test("JSON report strips response from results", () => {
  const report = formatJsonReport({
    scenarioId: "refund_request",
    target: "http://127.0.0.1:3010/api/agent",
    iterations: 1,
    results: [
      {
        locale: "en",
        status: "pass",
        passed: 1,
        failed: 0,
        total: 1,
        failureMode: null,
        detail: "create_refund_ticket",
        response: { text: "done", toolCalls: [], structured: null },
      },
    ],
  });

  const parsed = JSON.parse(report) as {
    results: Array<{ response?: unknown }>;
  };
  assert.equal(parsed.results[0].response, undefined);
});

test("markdown run report includes pass rates and scenario id", () => {
  const report = formatMarkdownRunReport({
    scenarioId: "refund_request",
    target: "http://127.0.0.1:3010/api/agent",
    iterations: 5,
    results: [
      {
        locale: "en",
        status: "pass",
        passed: 5,
        failed: 0,
        total: 5,
        failureMode: null,
        detail: "create_refund_ticket",
      },
      {
        locale: "fr",
        status: "fail",
        passed: 3,
        failed: 2,
        total: 5,
        failureMode: "no_tool_call",
        detail: "expected create_refund_ticket, got no tool calls",
      },
    ],
  });

  assert.ok(report.includes("refund_request"));
  assert.ok(report.includes("5/5"));
  assert.ok(report.includes("3/5"));
  assert.ok(report.includes("no_tool_call"));
  assert.ok(report.startsWith("# LangDrift Run"));
});

test("oneOf argument passes when actual matches any listed value", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: {
        name: "create_refund_ticket",
        arguments: { reason: { oneOf: ["duplicate_charge", "double_charge"] } },
      },
    },
    {
      text: "ok",
      toolCalls: [
        {
          name: "create_refund_ticket",
          arguments: { reason: "double_charge" },
        },
      ],
      structured: null,
    },
  );

  assert.equal(result.pass, true);
});

test("oneOf argument fails when actual matches no listed value", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: {
        name: "create_refund_ticket",
        arguments: { reason: { oneOf: ["duplicate_charge", "double_charge"] } },
      },
    },
    {
      text: "ok",
      toolCalls: [
        { name: "create_refund_ticket", arguments: { reason: "fraud" } },
      ],
      structured: null,
    },
  );

  assert.deepEqual(result, {
    pass: false,
    failureMode: "wrong_argument",
    detail:
      "expected argument reason=one of [duplicate_charge, double_charge], got fraud",
  });
});

test("scalar argument matches a numeric actual value", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: { name: "set_quantity", arguments: { count: "2" } },
    },
    {
      text: "ok",
      toolCalls: [{ name: "set_quantity", arguments: { count: 2 } }],
      structured: null,
    },
  );

  assert.equal(result.pass, true);
});

test("scalar argument matches a boolean actual value", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: { name: "set_flag", arguments: { enabled: "true" } },
    },
    {
      text: "ok",
      toolCalls: [{ name: "set_flag", arguments: { enabled: true } }],
      structured: null,
    },
  );

  assert.equal(result.pass, true);
});

test("parses oneOf argument from YAML", () => {
  const scenario = parseScenario(`
id: refund_request
agent: support

locales:
  en:
    input: "I was charged twice."
    expect:
      toolCall:
        name: create_refund_ticket
        arguments:
          reason:
            oneOf: [duplicate_charge, double_charge]
`);

  const tc = scenario.locales.en.expect.toolCall;
  assert.ok(!Array.isArray(tc) && tc !== undefined);
  assert.deepEqual(tc.arguments, {
    reason: { oneOf: ["duplicate_charge", "double_charge"] },
  });
});

test("rejects an empty oneOf list", () => {
  assert.throws(
    () =>
      parseScenario(`
id: refund_request
agent: support

locales:
  en:
    input: "x"
    expect:
      toolCall:
        name: create_refund_ticket
        arguments:
          reason:
            oneOf: []
`),
    /oneOf must list at least one value/,
  );
});

test("responseLanguage passes for a Mongolian Cyrillic response (mn maps to Cyrillic)", () => {
  // Regression: mn was previously treated as Latin and a correct Cyrillic
  // response was falsely flagged wrong_language.
  const result = assertExpectedToolCall(
    { responseLanguage: "mn" },
    {
      text: "Тантай холбогдоход баяртай байна.",
      toolCalls: [],
      structured: null,
    },
  );

  assert.equal(result.pass, true);
});

test("responseLanguage passes (cannot decide) for a locale in neither script map nor Latin set", () => {
  // Khmer (km) has no script entry and is not in LATIN_LOCALES, so the check
  // must not penalize it regardless of the response script.
  const result = assertExpectedToolCall(
    { responseLanguage: "km" },
    { text: "ខ្ញុំអាចជួយបាន", toolCalls: [], structured: null },
  );

  assert.equal(result.pass, true);
  assert.equal(result.detail, "responseLanguage: km (script not determinable)");
});

test("responseLanguage passes for Latin-vs-Latin (script cannot distinguish language)", () => {
  const result = assertExpectedToolCall(
    { responseLanguage: "fr" },
    {
      text: "I can help you with that refund.",
      toolCalls: [],
      structured: null,
    },
  );

  assert.equal(result.pass, true);
});

// --- Adversarial-audit regression tests -----------------------------------

test("F-1: an array argument does not pass a scalar assertion via String() coercion", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: {
        name: "create_refund_ticket",
        arguments: { reason: "duplicate_charge" },
      },
    },
    {
      text: "",
      toolCalls: [
        {
          name: "create_refund_ticket",
          arguments: { reason: ["duplicate_charge"] },
        },
      ],
      structured: null,
    },
  );
  assert.equal(result.pass, false);
  assert.equal(result.failureMode, "wrong_argument");
  assert.match(result.detail, /array/);
});

test("F-2: a fully Amharic reply fails responseLanguage: en", () => {
  const result = assertExpectedToolCall(
    { responseLanguage: "en" },
    { text: "እኔ በዚህ ማገዝ እችላለሁ።", toolCalls: [], structured: null },
  );
  assert.equal(result.pass, false);
  assert.equal(result.failureMode, "wrong_language");
});

test("F-2: a fully Georgian reply fails responseLanguage: en", () => {
  const result = assertExpectedToolCall(
    { responseLanguage: "en" },
    {
      text: "შემიძლია დაგეხმაროთ ამ საკითხში.",
      toolCalls: [],
      structured: null,
    },
  );
  assert.equal(result.pass, false);
  assert.equal(result.failureMode, "wrong_language");
});

test("F-3: pure-Chinese (Han only) text fails responseLanguage: ja", () => {
  const result = assertExpectedToolCall(
    { responseLanguage: "ja" },
    { text: "我可以帮您处理退款。", toolCalls: [], structured: null },
  );
  assert.equal(result.pass, false);
  assert.equal(result.failureMode, "wrong_language");
});

test("F-3: Japanese text with kana passes responseLanguage: ja", () => {
  const result = assertExpectedToolCall(
    { responseLanguage: "ja" },
    { text: "払い戻しのお手伝いをします。", toolCalls: [], structured: null },
  );
  assert.equal(result.pass, true);
});

test("F-28: noToolCall anyOf fails when any forbidden tool is called", () => {
  const scenario = parseScenario(`id: s
agent: support
locales:
  en:
    input: "hi"
    expect:
      toolCall:
        name: create_refund
      noToolCall:
        anyOf: [escalate, contact_seller]
`);
  assert.deepEqual(scenario.locales.en.expect.noToolCall?.names, [
    "escalate",
    "contact_seller",
  ]);
  const result = assertExpectedToolCall(scenario.locales.en.expect, {
    text: "",
    toolCalls: [{ name: "create_refund" }, { name: "contact_seller" }],
    structured: null,
  });
  assert.equal(result.pass, false);
  assert.equal(result.failureMode, "forbidden_tool");
});

test("F-7: oneOf items with quoted commas parse as whole items", () => {
  const scenario = parseScenario(`id: s
agent: support
locales:
  en:
    input: "hi"
    expect:
      toolCall:
        name: t
        arguments:
          reason:
            oneOf: ["a, b", c]
`);
  const tc = scenario.locales.en.expect.toolCall;
  assert.ok(!Array.isArray(tc) && tc?.arguments);
  assert.deepEqual(tc.arguments.reason, { oneOf: ["a, b", "c"] });
});

test("F-9: an empty noToolCall does not steal the next block's name", () => {
  const scenario = parseScenario(`id: s
agent: support
locales:
  en:
    input: "hi"
    expect:
      noToolCall:
      toolCall:
        name: create_refund
`);
  // noToolCall had no name, so it must not exist; the tool call is intact.
  assert.equal(scenario.locales.en.expect.noToolCall, undefined);
  const tc = scenario.locales.en.expect.toolCall;
  assert.ok(!Array.isArray(tc) && tc?.name === "create_refund");
});

test("F-10: duplicate locale keys are rejected", () => {
  assert.throws(
    () =>
      parseScenario(`id: s
agent: support
locales:
  en:
    input: "a"
    expect:
      toolCall:
        name: t
  en:
    input: "b"
    expect:
      toolCall:
        name: t
`),
    /duplicate locale "en"/,
  );
});

test("F-11: a tool-call list item without a name is rejected", () => {
  assert.throws(
    () =>
      parseScenario(`id: s
agent: support
locales:
  en:
    input: "hi"
    expect:
      toolCalls:
        - name: first
        - nme: typo
`),
    /missing "name"/,
  );
});

test("F-8: tab indentation is rejected with a clear message", () => {
  assert.throws(
    () => parseScenario("id: s\nagent: support\nlocales:\n\ten:\n"),
    /tab indentation/,
  );
});

test("F-8: block scalars are rejected with a clear message", () => {
  assert.throws(
    () =>
      parseScenario(`id: s
agent: support
locales:
  en:
    input: |
      multi
    expect:
      toolCall:
        name: t
`),
    /block scalars/,
  );
});
