export type Scenario = {
  id: string;
  agent: string;
  locales: Record<string, ScenarioLocale>;
};

// An expected argument value: a scalar compared with scalar-normalized
// equality, or a `oneOf` list that matches if the actual value equals any option.
export type ArgMatcher =
  | string
  | number
  | boolean
  | { oneOf: Array<string | number | boolean> };

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
      name: string;
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

export type FailureMode =
  | "no_tool_call"
  | "wrong_tool"
  | "wrong_argument"
  | "missing_argument"
  | "forbidden_tool"
  | "wrong_sequence"
  | "wrong_language"
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
