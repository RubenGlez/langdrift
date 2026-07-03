import { readFile, writeFile } from "node:fs/promises";
import { loadScenario } from "./scenario.ts";

export const DEFAULT_LOCALES = [
  "fr",
  "ar",
  "zh",
  "ru",
  "id",
  "vi",
  "sw",
  "cy",
  "eu",
  "mn",
  "yo",
];

export type TranslateOptions = {
  locales: string[];
  apiKey: string;
  apiUrl?: string;
  model?: string;
  write: boolean;
};

export type TranslateResult = {
  locale: string;
  input: string;
};

export async function translateScenario(
  path: string,
  options: TranslateOptions,
): Promise<{ results: TranslateResult[]; yamlSnippet: string }> {
  const scenario = await loadScenario(path);
  const enLocale = scenario.locales.en;

  if (!enLocale) {
    throw new Error(
      `scenario "${scenario.id}" has no "en" locale to translate from`,
    );
  }

  const targetLocales = options.locales.filter((l) => !scenario.locales[l]);

  if (targetLocales.length === 0) {
    throw new Error(`all requested locales already exist in the scenario`);
  }

  const translations = await callLlm(enLocale.input, targetLocales, options);

  // The LLM can silently return fewer locales than requested; surface the gap
  // instead of quietly producing a shorter scenario (F-30).
  const returned = new Set(translations.map((t) => t.locale));
  const dropped = targetLocales.filter((l) => !returned.has(l));
  if (dropped.length > 0) {
    process.stderr.write(
      `warning: model did not return translations for: ${dropped.join(", ")}\n`,
    );
  }

  const yamlLines: string[] = [
    `# Generated locale inputs for: ${scenario.id}`,
    `# Source (en): ${enLocale.input}`,
    `# NOTE: These are LLM-generated drafts. Review before use — phrasing gaps`,
    `# can be indistinguishable from model failures in eval results.`,
    "",
  ];

  for (const { locale, input } of translations) {
    yamlLines.push(`  ${locale}:`);
    yamlLines.push(`    input: ${yamlQuote(input)}`);
    yamlLines.push(`    expect:`);
    for (const line of serializeExpect(scenario.locales.en, locale)) {
      yamlLines.push(`    ${line}`);
    }
    yamlLines.push("");
  }

  const yamlSnippet = yamlLines.join("\n");

  if (options.write) {
    const source = await readFile(path, "utf8");
    const updated = appendLocalesToYaml(
      source,
      yamlSnippet.replace(/^#[^\n]*\n/gm, "").trimStart(),
    );
    await writeFile(path, updated, "utf8");
  }

  return { results: translations, yamlSnippet };
}

async function callLlm(
  englishInput: string,
  locales: string[],
  options: TranslateOptions,
): Promise<TranslateResult[]> {
  const apiUrl = options.apiUrl ?? "https://api.openai.com/v1/chat/completions";
  const model = options.model ?? "gpt-4o-mini";

  const prompt = `You are a localization expert. Given an English user message for an AI agent workflow and a list of target locales, produce natural-sounding equivalent phrasings that preserve the original intent, constraints, entities, and requested action.

The result should sound like something a real user would write in that locale — not a literal or formal translation. Do not add new details, remove requirements, soften urgency, or change what the user is asking the agent to do.

Return ONLY a JSON object mapping BCP 47 locale codes to translated inputs. No explanation, no markdown.

English input: ${JSON.stringify(englishInput)}
Target locales: ${locales.join(", ")}`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      authorization: `Bearer ${options.apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`LLM request failed (HTTP ${response.status}): ${body}`);
  }

  const completion = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = completion.choices?.[0]?.message?.content ?? "";
  let parsed: Record<string, string>;

  try {
    parsed = JSON.parse(content) as Record<string, string>;
  } catch {
    throw new Error(`LLM returned invalid JSON: ${content}`);
  }

  return locales
    .filter((locale) => typeof parsed[locale] === "string")
    .map((locale) => ({ locale, input: parsed[locale] }));
}

// Serializes an `expect` block back to the scenario's YAML subset. Used to copy
// the English assertions onto each generated locale. `targetLocale` is the
// locale the block is being generated for, so a script check can be rewritten to
// it (F-30).
export function serializeExpect(
  locale: import("./types.ts").ScenarioLocale,
  targetLocale: string,
): string[] {
  const lines: string[] = [];
  const { toolCall, toolCalls, noToolCall, responseLanguage } = locale.expect;

  if (toolCall !== undefined && !Array.isArray(toolCall)) {
    lines.push(`  toolCall:`);
    lines.push(`    name: ${toolCall.name}`);
    if (toolCall.arguments) {
      lines.push(`    arguments:`);
      lines.push(...serializeArgLines(toolCall.arguments, "      "));
    }
  } else if (Array.isArray(toolCall)) {
    lines.push(`  toolCall:`);
    lines.push(`    anyOf:`);
    for (const option of toolCall) {
      lines.push(`      - name: ${option.name}`);
      if (option.arguments) {
        lines.push(`        arguments:`);
        lines.push(...serializeArgLines(option.arguments, "          "));
      }
    }
  }

  if (toolCalls && toolCalls.length > 0) {
    lines.push(`  toolCalls:`);
    for (const step of toolCalls) {
      lines.push(`    - name: ${step.name}`);
      if (step.arguments) {
        lines.push(`      arguments:`);
        lines.push(...serializeArgLines(step.arguments, "        "));
      }
    }
  }

  if (noToolCall) {
    lines.push(`  noToolCall:`);
    if (noToolCall.names.length === 1) {
      lines.push(`    name: ${noToolCall.names[0]}`);
    } else {
      lines.push(`    anyOf: [${noToolCall.names.join(", ")}]`);
    }
  }

  // If the source asserts a response script, assert the target locale's script
  // on the generated block — the one assertion translate can add for free (F-30).
  if (responseLanguage) {
    lines.push(`  responseLanguage: ${targetLocale}`);
  }

  return lines;
}

// Serializes tool-argument matchers. A `oneOf` matcher becomes a nested inline
// list instead of stringifying to `[object Object]` (F-31).
function serializeArgLines(
  args: Record<string, import("./types.ts").ArgMatcher>,
  keyIndent: string,
): string[] {
  const out: string[] = [];
  for (const [k, v] of Object.entries(args)) {
    if (typeof v === "object" && v !== null && "oneOf" in v) {
      out.push(`${keyIndent}${k}:`);
      out.push(`${keyIndent}  oneOf: [${v.oneOf.join(", ")}]`);
    } else {
      out.push(`${keyIndent}${k}: ${v}`);
    }
  }
  return out;
}

function appendLocalesToYaml(source: string, snippet: string): string {
  const trimmed = source.trimEnd();
  return `${trimmed}\n\n${snippet}`;
}

function yamlQuote(value: string): string {
  if (/[:#[\]{}|>&*!,?'"]/.test(value) || value.includes("\n")) {
    return JSON.stringify(value);
  }
  return value;
}
