export type Scenario = {
  id: string;
  agent: string;
  locales: Record<string, ScenarioLocale>;
};

export type ScenarioLocale = {
  input: string;
  expect: {
    toolCall: {
      name: string;
      arguments?: Record<string, string>;
    };
    noToolCall?: {
      name: string;
    };
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

export type FailureMode =
  | "no_tool_call"
  | "wrong_tool"
  | "wrong_argument"
  | "missing_argument"
  | "forbidden_tool"
  | null;

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
