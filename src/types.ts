export type Scenario = {
  id: string;
  agent: string;
  locales: Record<string, ScenarioLocale>;
};

// An expected argument value: a scalar compared with scalar-normalized
// equality, or a `oneOf` list that matches if the actual value equals any option.
// The scenario parser only ever produces strings; the CLI has no programmatic
// surface, so there are no other producers to model here.
export type ArgMatcher = string | { oneOf: string[] };

export type ToolCallAssertion = {
  name: string;
  arguments?: Record<string, ArgMatcher>;
};

export type ScenarioLocale = {
  input: string;
  expect: {
    toolCall?: ToolCallAssertion | ToolCallAssertion[]; // single or anyOf
    toolCalls?: ToolCallAssertion[]; // ordered sequence
    noToolCall?: {
      names: string[]; // one or more forbidden tool names
    };
    responseLanguage?: string; // BCP-47 locale code; checks response text is in that language
  };
};

export type ToolCall = {
  name: string;
  arguments?: unknown;
};

export type TargetResponse = {
  text: string;
  toolCalls: ToolCall[];
  structured: unknown;
};

// The single source of truth for behavioral failure modes. Anything that
// aggregates by failure mode (the benchmark, reports) derives its column set
// from this array so a new mode can never silently vanish from a table.
export const FAILURE_MODES = [
  "no_tool_call",
  "wrong_tool",
  "wrong_argument",
  "missing_argument",
  "forbidden_tool",
  "wrong_sequence",
  "wrong_language",
  "target_error", // the harness/transport failed, not the model — kept out of behavioral stats
] as const;

export type FailureMode = (typeof FAILURE_MODES)[number] | null;

export type LocaleResult = {
  locale: string;
  status: "pass" | "fail";
  passed: number;
  failed: number;
  total: number;
  failureMode: FailureMode;
  detail: string;
  response?: TargetResponse;
};

export type RunResult = {
  scenarioId: string;
  target: string;
  iterations: number;
  results: LocaleResult[];
};

export type MatrixResult = {
  target: string;
  iterations: number;
  runs: RunResult[];
};
