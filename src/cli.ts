#!/usr/bin/env node
import { INIT_TEMPLATES, initScenario, isInitTemplate } from "./init.ts";
import { loadScenario } from "./scenario.ts";
import { runScenario } from "./runner.ts";
import { formatJsonReport } from "./reportJson.ts";
import { formatTerminalReport } from "./reportTerminal.ts";

type CliOptions = RunOptions | InitOptions;

type RunOptions = {
  command: "run";
  scenarioPath: string;
  target: string;
  format: "text" | "json";
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

  const scenario = await loadScenario(options.scenarioPath);
  const run = await runScenario(scenario, options.target);

  process.stdout.write(
    options.format === "json" ? formatJsonReport(run) : formatTerminalReport(run),
  );

  if (run.results.some((result) => result.status === "fail")) {
    process.exitCode = 1;
  }
}

function parseArgs(args: string[]): CliOptions {
  if (args[0] === "init") {
    const path = parseInitPath(args.slice(1));
    const templateFlagIndex = args.indexOf("--template");
    const template = templateFlagIndex === -1 ? "support" : args[templateFlagIndex + 1];

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

  if (
    !scenarioPath ||
    scenarioPath.startsWith("--") ||
    !target ||
    (format !== "text" && format !== "json")
  ) {
    throw new Error(usage());
  }

  return {
    command: "run",
    scenarioPath,
    target,
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
    "  langdrift run <scenario.yaml> --target <url> [--format text|json]",
  ].join("\n");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
