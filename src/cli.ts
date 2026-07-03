#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { INIT_TEMPLATES, initScenario, isInitTemplate } from "./init.ts";
import { loadScenario } from "./scenario.ts";
import { resolveScenarioPaths, runScenario, runScenarios } from "./runner.ts";
import { formatJsonMatrixReport, formatJsonReport } from "./reportJson.ts";
import {
  formatTerminalMatrixReport,
  formatTerminalReport,
} from "./reportTerminal.ts";
import {
  formatMarkdownMatrixReport,
  formatMarkdownRunReport,
} from "./reportMarkdown.ts";
import { formatLintReport, lintScenarios } from "./lint.ts";
import { DEFAULT_LOCALES, translateScenario } from "./translate.ts";
import { shouldFail } from "./gate.ts";

const COMMANDS = new Set(["run", "init", "lint", "translate"]);

type CliOptions = RunOptions | InitOptions | LintOptions | TranslateOptions;

type RunOptions = {
  command: "run";
  scenarioPath: string;
  target: string;
  iterations: number;
  format: "text" | "json" | "markdown";
  minPassRate: number | null;
  allowFail: string[];
  timeoutMs: number | null;
};

type InitOptions = {
  command: "init";
  path: string;
  template: "support" | "ecommerce" | "scheduling" | "generic";
};

type LintOptions = {
  command: "lint";
  scenarioPath: string;
};

type TranslateOptions = {
  command: "translate";
  scenarioPath: string;
  locales: string[];
  write: boolean;
};

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // Only treat --help/--version as global when they aren't riding inside a real
  // command; otherwise `run s.yaml --target x -v` would silently print the
  // version and exit 0 in a CI script (F-18).
  if (!COMMANDS.has(args[0] ?? "")) {
    if (args.includes("--help") || args.includes("-h")) {
      process.stdout.write(`${usage()}\n`);
      return;
    }

    if (args.includes("--version") || args.includes("-v")) {
      process.stdout.write(`${readPackageVersion()}\n`);
      return;
    }
  }

  const options = parseArgs(args);

  if (options.command === "init") {
    const path = await initScenario(options.path, options.template);
    process.stdout.write(`Created ${path}\n`);
    return;
  }

  if (options.command === "lint") {
    const { paths } = await resolveScenarioPaths(options.scenarioPath);
    if (paths.length === 0) {
      throw new Error(`No scenario files found at ${options.scenarioPath}`);
    }
    const results = await lintScenarios(paths);
    process.stdout.write(formatLintReport(results));
    const hasErrors = results.some((r) =>
      r.issues.some((i) => i.severity === "error"),
    );
    if (hasErrors) process.exitCode = 1;
    return;
  }

  if (options.command === "translate") {
    const apiKey = process.env.OPENAI_API_KEY ?? "";
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is required for the translate command");
    }
    const { yamlSnippet } = await translateScenario(options.scenarioPath, {
      locales: options.locales,
      apiKey,
      write: options.write,
    });
    if (options.write) {
      process.stdout.write(
        `Locale inputs appended to ${options.scenarioPath}\n`,
      );
    } else {
      process.stdout.write(yamlSnippet);
    }
    return;
  }

  const { paths, isDirectory } = await resolveScenarioPaths(
    options.scenarioPath,
  );

  if (paths.length === 0) {
    throw new Error(`No scenario files found at ${options.scenarioPath}`);
  }

  const timeoutMs = options.timeoutMs ?? undefined;

  // Directory input always emits the matrix shape, even for a single file, so
  // downstream tooling parsing `runs[]` doesn't break when a directory shrinks
  // to one scenario (F-20).
  if (isDirectory) {
    const matrix = await runScenarios(
      paths,
      options.target,
      options.iterations,
      timeoutMs,
    );

    if (options.format === "json") {
      process.stdout.write(formatJsonMatrixReport(matrix));
    } else if (options.format === "markdown") {
      process.stdout.write(formatMarkdownMatrixReport(matrix));
    } else {
      process.stdout.write(formatTerminalMatrixReport(matrix));
    }

    const allResults = matrix.runs.flatMap((run) => run.results);
    warnUnknownAllowFail(options.allowFail, allResults);
    if (shouldFail(allResults, options.minPassRate, options.allowFail)) {
      process.exitCode = 1;
    }
  } else {
    const scenario = await loadScenario(paths[0]);
    const run = await runScenario(
      scenario,
      options.target,
      options.iterations,
      timeoutMs,
    );

    if (options.format === "json") {
      process.stdout.write(formatJsonReport(run));
    } else if (options.format === "markdown") {
      process.stdout.write(formatMarkdownRunReport(run));
    } else {
      process.stdout.write(formatTerminalReport(run));
    }

    warnUnknownAllowFail(options.allowFail, run.results);
    if (shouldFail(run.results, options.minPassRate, options.allowFail)) {
      process.exitCode = 1;
    }
  }
}

// A mistyped --allow-fail locale (e.g. `ue` for `eu`) filters nothing and lets
// the build fail with no hint; warn when it matches no locale in the run (F-19).
function warnUnknownAllowFail(
  allowFail: string[],
  results: import("./types.ts").LocaleResult[],
): void {
  const present = new Set(results.map((r) => r.locale));
  for (const locale of allowFail) {
    if (!present.has(locale)) {
      process.stderr.write(
        `warning: --allow-fail ${locale} matches no locale in the run\n`,
      );
    }
  }
}

function parseArgs(args: string[]): CliOptions {
  if (args[0] === "init") {
    const path = parseInitPath(args.slice(1));
    const templateFlagIndex = args.indexOf("--template");
    const template =
      templateFlagIndex === -1 ? "support" : args[templateFlagIndex + 1];

    if (!template || !isInitTemplate(template)) {
      throw new Error(usage());
    }

    return { command: "init", path, template };
  }

  if (args[0] === "lint") {
    const scenarioPath = args[1];
    if (!scenarioPath || scenarioPath.startsWith("--")) {
      throw new Error(usage());
    }
    return { command: "lint", scenarioPath };
  }

  if (args[0] === "translate") {
    const scenarioPath = args[1];
    if (!scenarioPath || scenarioPath.startsWith("--")) {
      throw new Error(usage());
    }
    const localesFlagIndex = args.indexOf("--locales");
    const localesRaw =
      localesFlagIndex === -1 ? null : args[localesFlagIndex + 1];
    const locales = localesRaw
      ? localesRaw.split(",").map((l) => l.trim())
      : DEFAULT_LOCALES;
    const write = args.includes("--write");
    return { command: "translate", scenarioPath, locales, write };
  }

  if (args[0] !== "run") {
    throw new Error(usage());
  }

  const scenarioPath = args[1];
  const targetFlagIndex = args.indexOf("--target");
  const target = targetFlagIndex === -1 ? undefined : args[targetFlagIndex + 1];
  const formatFlagIndex = args.indexOf("--format");
  const format = formatFlagIndex === -1 ? "text" : args[formatFlagIndex + 1];
  const iterationsFlagIndex = args.indexOf("--iterations");
  const iterationsRaw =
    iterationsFlagIndex === -1 ? "1" : args[iterationsFlagIndex + 1];
  const iterations = Number(iterationsRaw);

  const minPassRateIndex = args.indexOf("--min-pass-rate");
  const minPassRateRaw =
    minPassRateIndex === -1 ? null : args[minPassRateIndex + 1];
  const minPassRate = minPassRateRaw === null ? null : Number(minPassRateRaw);

  const timeoutIndex = args.indexOf("--timeout");
  const timeoutRaw = timeoutIndex === -1 ? null : args[timeoutIndex + 1];
  const timeoutMs = timeoutRaw === null ? null : Number(timeoutRaw);

  const allowFail: string[] = [];
  for (let i = 0; i < args.length; i += 1) {
    if (
      args[i] === "--allow-fail" &&
      args[i + 1] &&
      !args[i + 1].startsWith("--")
    ) {
      allowFail.push(args[i + 1]);
    }
  }

  if (
    !scenarioPath ||
    scenarioPath.startsWith("--") ||
    // A target that is itself a flag means `--target` swallowed the next flag
    // (e.g. `--target --format`); reject rather than run against a bogus URL (F-18).
    !target ||
    target.startsWith("--") ||
    !isValidUrl(target) ||
    (format !== "text" && format !== "json" && format !== "markdown") ||
    !Number.isInteger(iterations) ||
    iterations < 1 ||
    (minPassRate !== null &&
      (Number.isNaN(minPassRate) || minPassRate < 0 || minPassRate > 100)) ||
    (timeoutMs !== null && (!Number.isInteger(timeoutMs) || timeoutMs < 1))
  ) {
    throw new Error(usage());
  }

  return {
    command: "run",
    scenarioPath,
    target,
    iterations,
    format,
    minPassRate,
    allowFail,
    timeoutMs,
  };
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function parseInitPath(args: string[]): string {
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--template") {
      index += 1;
      continue;
    }

    if (!args[index].startsWith("--")) {
      return args[index];
    }
  }

  return "langdrift.scenario.yaml";
}

function usage(): string {
  return [
    "Usage:",
    `  langdrift init [scenario.yaml] [--template ${INIT_TEMPLATES.join("|")}]`,
    "  langdrift run <scenario.yaml|dir> --target <url> [--iterations N] [--format text|json|markdown] [--min-pass-rate N] [--allow-fail <locale>] [--timeout MS]",
    "  langdrift lint <scenario.yaml|dir>",
    "  langdrift translate <scenario.yaml> [--locales fr,ar,zh,...] [--write]",
  ].join("\n");
}

function readPackageVersion(): string {
  const packageJsonUrl = new URL("../package.json", import.meta.url);
  const packageJson = JSON.parse(readFileSync(packageJsonUrl, "utf8")) as {
    version?: unknown;
  };

  return typeof packageJson.version === "string"
    ? packageJson.version
    : "unknown";
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
