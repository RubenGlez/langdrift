import { readFile } from "node:fs/promises";
import type {
  ArgMatcher,
  Scenario,
  ScenarioLocale,
  ToolCallAssertion,
} from "./types.ts";

type Line = {
  indent: number;
  key: string;
  value: string;
  number: number;
  isList?: true;
};

export async function loadScenario(path: string): Promise<Scenario> {
  const source = await readFile(path, "utf8");
  return parseScenario(source, path);
}

export function parseScenario(source: string, path = "scenario"): Scenario {
  const lines = tokenize(source);
  const id = scalarAt(lines, 0, "id");
  const agent = scalarAt(lines, 0, "agent");
  const localesIndex = lines.findIndex(
    (line) => line.indent === 0 && line.key === "locales",
  );

  if (!id) {
    throw new Error(`${path}: missing required field "id"`);
  }

  if (!agent) {
    throw new Error(`${path}: missing required field "agent"`);
  }

  if (localesIndex === -1) {
    throw new Error(`${path}: missing required field "locales"`);
  }

  const localeLines = lines.slice(localesIndex + 1);
  const locales = parseLocales(localeLines, path);

  if (Object.keys(locales).length === 0) {
    // Distinguish "genuinely empty" from "indented wrong" so a 4-space-indented
    // file gets an indentation hint rather than a bare "expected a locale" (F-8).
    if (localeLines.some((line) => line.indent > 0)) {
      throw new Error(
        `${path}: no locales found under "locales:"; locale entries must be indented exactly 2 spaces`,
      );
    }
    throw new Error(`${path}: expected at least one locale`);
  }

  return { id, agent, locales };
}

function parseToolCallList(
  lines: Line[],
  markerIndent: number,
): ToolCallAssertion[] {
  const contentIndent = markerIndent + 2;
  const assertions: ToolCallAssertion[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.indent < markerIndent) break;
    if (!line.isList || line.indent !== markerIndent) continue;

    let itemEnd = lines.length;
    for (let j = i + 1; j < lines.length; j += 1) {
      const next = lines[j];
      if (
        (next.isList && next.indent <= markerIndent) ||
        (!next.isList && next.indent <= markerIndent)
      ) {
        itemEnd = j;
        break;
      }
    }

    const itemLines = lines.slice(i + 1, itemEnd).filter((l) => !l.isList);
    const name = scalarAt(itemLines, contentIndent, "name");

    if (!name) {
      // A list item with no `name` contributes nothing and silently weakens the
      // assertion set (e.g. a `nme:` typo); reject it instead of dropping it (F-11).
      throw new Error(
        `scenario line ${line.number}: tool-call list item is missing "name"`,
      );
    }

    const toolArguments = nestedArgsAt(
      itemLines,
      [contentIndent],
      ["arguments"],
      contentIndent + 2,
    );
    assertions.push({
      name,
      ...(Object.keys(toolArguments).length > 0
        ? { arguments: toolArguments }
        : {}),
    });

    i = itemEnd - 1;
  }

  return assertions;
}

function parseLocales(
  lines: Line[],
  path: string,
): Record<string, ScenarioLocale> {
  const locales: Record<string, ScenarioLocale> = {};

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (line.indent <= 0) {
      break;
    }

    if (line.indent !== 2 || line.value !== "") {
      continue;
    }

    const locale = line.key;
    if (Object.hasOwn(locales, locale)) {
      // A duplicate mapping key would silently last-win and halve coverage; a
      // copy-pasted `en:` block should be an error, not a quiet overwrite (F-10).
      throw new Error(`${path}: duplicate locale "${locale}"`);
    }
    const nextLocaleIndex = lines.findIndex(
      (candidate, candidateIndex) =>
        candidateIndex > index &&
        candidate.indent === 2 &&
        candidate.value === "",
    );
    const blockEnd = nextLocaleIndex === -1 ? lines.length : nextLocaleIndex;
    const block = lines.slice(index + 1, blockEnd);
    const input = scalarAt(block, 4, "input");
    // toolCall: single assertion
    const toolName = nestedScalarAt(
      block,
      [4, 6, 8],
      ["expect", "toolCall", "name"],
    );
    const toolArguments = nestedArgsAt(
      block,
      [4, 6, 8],
      ["expect", "toolCall", "arguments"],
      10,
    );

    // toolCall.anyOf: list of valid alternatives (at indent 8 under toolCall at 6, list markers at 10)
    const anyOfKeyIndex = block.findIndex(
      (l) => !l.isList && l.indent === 8 && l.key === "anyOf",
    );
    const anyOfList =
      anyOfKeyIndex !== -1
        ? parseToolCallList(block.slice(anyOfKeyIndex + 1), 10)
        : [];

    // toolCalls: ordered sequence (list markers at 8)
    const toolCallsKeyIndex = block.findIndex(
      (l) => !l.isList && l.indent === 6 && l.key === "toolCalls",
    );
    const toolCallsList =
      toolCallsKeyIndex !== -1
        ? parseToolCallList(block.slice(toolCallsKeyIndex + 1), 8)
        : [];

    const forbiddenNames = parseForbiddenNames(block);

    const responseLanguage = nestedScalarAt(
      block,
      [4, 6],
      ["expect", "responseLanguage"],
    );

    const hasToolCall = toolName || anyOfList.length > 0;
    const hasToolCalls = toolCallsList.length > 0;
    const hasResponseLanguage = Boolean(responseLanguage);

    if (!input) {
      throw new Error(`${path}: locale "${locale}" is missing "input"`);
    }

    if (!hasToolCall && !hasToolCalls && !hasResponseLanguage) {
      throw new Error(
        `${path}: locale "${locale}" is missing at least one assertion (expect.toolCall, expect.toolCalls, or expect.responseLanguage)`,
      );
    }

    let toolCall: ScenarioLocale["expect"]["toolCall"];
    if (anyOfList.length > 0) {
      toolCall = anyOfList;
    } else if (toolName) {
      toolCall = {
        name: toolName,
        ...(Object.keys(toolArguments).length > 0
          ? { arguments: toolArguments }
          : {}),
      };
    }

    locales[locale] = {
      input,
      expect: {
        ...(toolCall !== undefined ? { toolCall } : {}),
        ...(toolCallsList.length > 0 ? { toolCalls: toolCallsList } : {}),
        ...(forbiddenNames ? { noToolCall: { names: forbiddenNames } } : {}),
        ...(responseLanguage ? { responseLanguage } : {}),
      },
    };

    index = blockEnd - 1;
  }

  return locales;
}

// Forbidden tool names from a locale's `expect.noToolCall` block, supporting
// either a single `name:` or an `anyOf: [a, b]` inline list (F-28). Scoped to
// the noToolCall block so an empty `noToolCall:` can't absorb a sibling's
// `name:` (F-9).
function parseForbiddenNames(block: Line[]): string[] | undefined {
  const expectIndex = block.findIndex(
    (l) => l.indent === 4 && l.key === "expect",
  );
  if (expectIndex === -1) return undefined;
  const expectEnd = blockEndAt(block, expectIndex, 4);

  let noToolCallIndex = -1;
  for (let i = expectIndex + 1; i < expectEnd; i += 1) {
    if (block[i].indent === 6 && block[i].key === "noToolCall") {
      noToolCallIndex = i;
      break;
    }
  }
  if (noToolCallIndex === -1) return undefined;

  const end = blockEndAt(block, noToolCallIndex, 6);
  const names: string[] = [];
  for (let i = noToolCallIndex + 1; i < end; i += 1) {
    const l = block[i];
    if (l.indent !== 8) continue;
    if (l.key === "name" && l.value !== "") {
      names.push(parseScalar(l.value, l.number));
    } else if (l.key === "anyOf") {
      names.push(...parseInlineList(l.value, l.number));
    }
  }

  return names.length > 0 ? names : undefined;
}

function tokenize(source: string): Line[] {
  const result: Line[] = [];

  for (const [index, raw] of source.split(/\r?\n/).entries()) {
    const number = index + 1;
    if (raw.trim() === "" || raw.trimStart().startsWith("#")) continue;

    const leading = raw.match(/^[ \t]*/)?.[0] ?? "";

    // The parser is a strict 2-space-indented YAML subset; catch the common ways
    // valid YAML falls outside it and say so, instead of failing later with an
    // unrelated message like "expected at least one locale" (F-8).
    if (leading.includes("\t")) {
      throw new Error(
        `scenario line ${number}: tab indentation is not supported; use 2 spaces per level`,
      );
    }

    const indent = leading.length;
    if (indent % 2 !== 0) {
      throw new Error(
        `scenario line ${number}: indentation must be a multiple of 2 spaces (got ${indent})`,
      );
    }

    const trimmed = raw.trim();

    if (trimmed.startsWith("- ")) {
      result.push({ indent, key: "", value: "", number, isList: true });
      const content = trimmed.slice(2);
      const separator = content.indexOf(":");
      if (separator !== -1) {
        const value = content.slice(separator + 1).trim();
        rejectBlockScalar(value, number);
        result.push({
          indent: indent + 2,
          key: content.slice(0, separator).trim(),
          value,
          number,
        });
      }
      continue;
    }

    const separator = trimmed.indexOf(":");
    if (separator === -1) {
      throw new Error(`scenario line ${number}: expected "key: value"`);
    }

    const value = trimmed.slice(separator + 1).trim();
    rejectBlockScalar(value, number);

    result.push({
      indent,
      key: trimmed.slice(0, separator).trim(),
      value,
      number,
    });
  }

  return result;
}

// Block scalars (`input: |` / `input: >`) span multiple lines, which this
// line-oriented parser can't represent; reject them with a clear message rather
// than swallowing the continuation lines as stray "key: value" errors (F-8).
function rejectBlockScalar(value: string, lineNumber: number): void {
  if (/^[|>][+-]?\d*$/.test(value)) {
    throw new Error(
      `scenario line ${lineNumber}: block scalars (| and >) are not supported; use a quoted single-line string`,
    );
  }
}

function scalarAt(
  lines: Line[],
  indent: number,
  key: string,
): string | undefined {
  const line = lines.find(
    (candidate) => candidate.indent === indent && candidate.key === key,
  );
  return line && line.value !== ""
    ? parseScalar(line.value, line.number)
    : undefined;
}

function nestedScalarAt(
  lines: Line[],
  indents: number[],
  keys: string[],
): string | undefined {
  let start = 0;
  // Upper bound of the current parent's block. Each descent narrows the window
  // to the lines nested under the matched parent, so a key can't be matched in a
  // sibling block (e.g. reading toolCall's `name` as noToolCall's) — F-9.
  let end = lines.length;

  for (let index = 0; index < keys.length; index += 1) {
    let lineIndex = -1;
    for (let i = start; i < end; i += 1) {
      if (lines[i].indent === indents[index] && lines[i].key === keys[index]) {
        lineIndex = i;
        break;
      }
    }

    if (lineIndex === -1) {
      return undefined;
    }

    if (index === keys.length - 1) {
      const line = lines[lineIndex];
      return line.value !== ""
        ? parseScalar(line.value, line.number)
        : undefined;
    }

    start = lineIndex + 1;
    end = blockEndAt(lines, lineIndex, indents[index]);
  }

  return undefined;
}

// Index of the first line after `parentIndex` whose indent is at or below the
// parent's — i.e. the exclusive end of the parent's nested block.
function blockEndAt(
  lines: Line[],
  parentIndex: number,
  parentIndent: number,
): number {
  for (let i = parentIndex + 1; i < lines.length; i += 1) {
    if (lines[i].indent <= parentIndent) return i;
  }
  return lines.length;
}

function nestedArgsAt(
  lines: Line[],
  indents: number[],
  keys: string[],
  childIndent: number,
): Record<string, ArgMatcher> {
  let start = 0;

  for (let index = 0; index < keys.length; index += 1) {
    const lineIndex = lines.findIndex(
      (line, candidateIndex) =>
        candidateIndex >= start &&
        line.indent === indents[index] &&
        line.key === keys[index],
    );

    if (lineIndex === -1) {
      return {};
    }

    start = lineIndex + 1;
  }

  const entries: Record<string, ArgMatcher> = {};

  for (let index = start; index < lines.length; index += 1) {
    const line = lines[index];

    if (line.indent < childIndent) {
      break;
    }

    if (line.indent !== childIndent) {
      continue;
    }

    // Scalar argument: `reason: duplicate_charge`
    if (line.value !== "") {
      entries[line.key] = parseScalar(line.value, line.number);
      continue;
    }

    // Matcher argument: an arg key with no inline value, e.g.
    //   reason:
    //     oneOf: [duplicate_charge, double_charge]
    const child = lines[index + 1];
    if (child && child.indent === childIndent + 2 && child.key === "oneOf") {
      entries[line.key] = { oneOf: parseInlineList(child.value, child.number) };
    }
  }

  return entries;
}

function parseInlineList(value: string, lineNumber: number): string[] {
  if (!value.startsWith("[") || !value.endsWith("]")) {
    throw new Error(
      `scenario line ${lineNumber}: oneOf must be an inline list like [a, b]`,
    );
  }

  const inner = value.slice(1, -1).trim();
  const items =
    inner === ""
      ? []
      : splitTopLevel(inner, lineNumber).map((item) =>
          parseScalar(item.trim(), lineNumber),
        );

  if (items.length === 0) {
    throw new Error(
      `scenario line ${lineNumber}: oneOf must list at least one value`,
    );
  }

  return items;
}

// Split a comma-separated inline list, ignoring commas inside quoted items so
// `["a, b", c]` yields `["a, b", "c"]` instead of mangled fragments (F-7).
function splitTopLevel(inner: string, lineNumber: number): string[] {
  const items: string[] = [];
  let current = "";
  let quote: '"' | "'" | null = null;

  for (const char of inner) {
    if (quote) {
      current += char;
      if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      current += char;
      continue;
    }
    if (char === ",") {
      items.push(current);
      current = "";
      continue;
    }
    current += char;
  }

  if (quote) {
    throw new Error(
      `scenario line ${lineNumber}: unterminated quote in inline list`,
    );
  }

  items.push(current);
  return items;
}

function parseScalar(value: string, lineNumber: number): string {
  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      return JSON.parse(value);
    } catch {
      throw new Error(
        `scenario line ${lineNumber}: invalid double-quoted string`,
      );
    }
  }

  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replaceAll("''", "'");
  }

  return value;
}
