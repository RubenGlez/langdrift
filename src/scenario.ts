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

  const locales = parseLocales(lines.slice(localesIndex + 1), path);

  if (Object.keys(locales).length === 0) {
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

    if (name) {
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
    }

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

    const forbiddenToolName = nestedScalarAt(
      block,
      [4, 6, 8],
      ["expect", "noToolCall", "name"],
    );

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
        ...(forbiddenToolName
          ? { noToolCall: { name: forbiddenToolName } }
          : {}),
        ...(responseLanguage ? { responseLanguage } : {}),
      },
    };

    index = blockEnd - 1;
  }

  return locales;
}

function tokenize(source: string): Line[] {
  const result: Line[] = [];

  for (const [index, raw] of source.split(/\r?\n/).entries()) {
    const number = index + 1;
    if (raw.trim() === "" || raw.trimStart().startsWith("#")) continue;

    const indent = raw.match(/^ */)?.[0].length ?? 0;
    const trimmed = raw.trim();

    if (trimmed.startsWith("- ")) {
      result.push({ indent, key: "", value: "", number, isList: true });
      const content = trimmed.slice(2);
      const separator = content.indexOf(":");
      if (separator !== -1) {
        result.push({
          indent: indent + 2,
          key: content.slice(0, separator).trim(),
          value: content.slice(separator + 1).trim(),
          number,
        });
      }
      continue;
    }

    const separator = trimmed.indexOf(":");
    if (separator === -1) {
      throw new Error(`scenario line ${number}: expected "key: value"`);
    }

    result.push({
      indent,
      key: trimmed.slice(0, separator).trim(),
      value: trimmed.slice(separator + 1).trim(),
      number,
    });
  }

  return result;
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

  for (let index = 0; index < keys.length; index += 1) {
    const lineIndex = lines.findIndex(
      (line, candidateIndex) =>
        candidateIndex >= start &&
        line.indent === indents[index] &&
        line.key === keys[index],
    );

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
  }

  return undefined;
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
      : inner.split(",").map((item) => parseScalar(item.trim(), lineNumber));

  if (items.length === 0) {
    throw new Error(
      `scenario line ${lineNumber}: oneOf must list at least one value`,
    );
  }

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
