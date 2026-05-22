#!/usr/bin/env node
import { initScenario } from "./init.ts";
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
};

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  if (options.command === "init") {
    const path = await initScenario(options.path);
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
    const path = args[1] && !args[1].startsWith("--") ? args[1] : "langdrift.scenario.yaml";
    return { command: "init", path };
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

function usage(): string {
  return [
    "Usage:",
    "  langdrift init [scenario.yaml]",
    "  langdrift run <scenario.yaml> --target <url> [--format text|json]",
  ].join("\n");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
