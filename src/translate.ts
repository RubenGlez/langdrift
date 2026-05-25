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
  const enExpect = serializeExpect(scenario.locales.en);

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
    for (const line of enExpect) {
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

  const prompt = `You are a localization expert. Given an English customer service message and a list of target locales, produce natural-sounding equivalent phrasings that preserve the original intent and sound like something a real customer would write — not a formal translation.

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

function serializeExpect(
  locale: import("./types.ts").ScenarioLocale,
): string[] {
  const lines: string[] = [];
  lines.push(`  toolCall:`);
  lines.push(`    name: ${locale.expect.toolCall.name}`);

  if (locale.expect.toolCall.arguments) {
    lines.push(`    arguments:`);
    for (const [k, v] of Object.entries(locale.expect.toolCall.arguments)) {
      lines.push(`      ${k}: ${v}`);
    }
  }

  if (locale.expect.noToolCall) {
    lines.push(`  noToolCall:`);
    lines.push(`    name: ${locale.expect.noToolCall.name}`);
  }

  return lines;
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
