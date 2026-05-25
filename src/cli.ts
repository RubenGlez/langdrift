#!/usr/bin/env node
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

type CliOptions = RunOptions | InitOptions;

type RunOptions = {
  command: "run";
  scenarioPath: string;
  target: string;
  iterations: number;
  format: "text" | "json" | "markdown";
};

type InitOptions = {
  command: "init";
  path: string;
  template: "support" | "ecommerce" | "scheduling" | "generic";
};

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  if (options.command === "init") {
    const path = await initScenario(options.path, options.template);
    process.stdout.write(`Created ${path}\n`);
    return;
  }

  const paths = await resolveScenarioPaths(options.scenarioPath);

  if (paths.length === 0) {
    throw new Error(`No scenario files found at ${options.scenarioPath}`);
  }

  const isMatrix = paths.length > 1;

  if (isMatrix) {
    const matrix = await runScenarios(
      paths,
      options.target,
      options.iterations,
    );

    if (options.format === "json") {
      process.stdout.write(formatJsonMatrixReport(matrix));
    } else if (options.format === "markdown") {
      process.stdout.write(formatMarkdownMatrixReport(matrix));
    } else {
      process.stdout.write(formatTerminalMatrixReport(matrix));
    }

    const anyFailed = matrix.runs.some((run) =>
      run.results.some((r) => r.status === "fail"),
    );
    if (anyFailed) {
      process.exitCode = 1;
    }
  } else {
    const scenario = await loadScenario(paths[0]);
    const run = await runScenario(scenario, options.target, options.iterations);

    if (options.format === "json") {
      process.stdout.write(formatJsonReport(run));
    } else if (options.format === "markdown") {
      process.stdout.write(formatMarkdownRunReport(run));
    } else {
      process.stdout.write(formatTerminalReport(run));
    }

    if (run.results.some((result) => result.status === "fail")) {
      process.exitCode = 1;
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

  if (
    !scenarioPath ||
    scenarioPath.startsWith("--") ||
    !target ||
    (format !== "text" && format !== "json" && format !== "markdown") ||
    !Number.isInteger(iterations) ||
    iterations < 1
  ) {
    throw new Error(usage());
  }

  return {
    command: "run",
    scenarioPath,
    target,
    iterations,
    format,
  };
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
    "  langdrift run <scenario.yaml|dir> --target <url> [--iterations N] [--format text|json|markdown]",
  ].join("\n");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
