# LangDrift Benchmark Results

Scenario: ./examples/scenarios/support-cancel-subscription.yaml
Domain: support
Model: deepseek-chat (openai-compat)
Iterations: 3
Total locale checks: 36
Pass rate: 22/36 (61%)
Average run duration: 23985 ms

| Locale | Pass | no_tool_call | wrong_tool | wrong_argument | missing_argument | forbidden_tool |
| ------ | ---- | ------------ | ---------- | -------------- | ---------------- | -------------- |
| en     | 0/3  | 3            | 0          | 0              | 0                | 0              |
| fr     | 2/3  | 1            | 0          | 0              | 0                | 0              |
| ar     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| zh     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| ru     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| id     | 2/3  | 1            | 0          | 0              | 0                | 0              |
| vi     | 0/3  | 3            | 0          | 0              | 0                | 0              |
| sw     | 0/3  | 3            | 0          | 0              | 0                | 0              |
| cy     | 1/3  | 2            | 0          | 0              | 0                | 0              |
| eu     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| mn     | 2/3  | 1            | 0          | 0              | 0                | 0              |
| yo     | 3/3  | 0            | 0          | 0              | 0                | 0              |

## Runs

### Iteration 1

Duration: 24353 ms / Exit: 1

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure       Detail
en      fail    no_tool_call  expected cancel_subscription, got no tool calls
fr      pass    -             cancel_subscription
ar      pass    -             cancel_subscription
zh      pass    -             cancel_subscription
ru      pass    -             cancel_subscription
id      fail    no_tool_call  expected cancel_subscription, got no tool calls
vi      fail    no_tool_call  expected cancel_subscription, got no tool calls
sw      fail    no_tool_call  expected cancel_subscription, got no tool calls
cy      pass    -             cancel_subscription
eu      pass    -             cancel_subscription
mn      pass    -             cancel_subscription
yo      pass    -             cancel_subscription

Result: failed, 4 of 12 locales failed
```

### Iteration 2

Duration: 23216 ms / Exit: 1

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure       Detail
en      fail    no_tool_call  expected cancel_subscription, got no tool calls
fr      fail    no_tool_call  expected cancel_subscription, got no tool calls
ar      pass    -             cancel_subscription
zh      pass    -             cancel_subscription
ru      pass    -             cancel_subscription
id      pass    -             cancel_subscription
vi      fail    no_tool_call  expected cancel_subscription, got no tool calls
sw      fail    no_tool_call  expected cancel_subscription, got no tool calls
cy      fail    no_tool_call  expected cancel_subscription, got no tool calls
eu      pass    -             cancel_subscription
mn      fail    no_tool_call  expected cancel_subscription, got no tool calls
yo      pass    -             cancel_subscription

Result: failed, 6 of 12 locales failed
```

### Iteration 3

Duration: 24385 ms / Exit: 1

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure       Detail
en      fail    no_tool_call  expected cancel_subscription, got no tool calls
fr      pass    -             cancel_subscription
ar      pass    -             cancel_subscription
zh      pass    -             cancel_subscription
ru      pass    -             cancel_subscription
id      pass    -             cancel_subscription
vi      fail    no_tool_call  expected cancel_subscription, got no tool calls
sw      fail    no_tool_call  expected cancel_subscription, got no tool calls
cy      fail    no_tool_call  expected cancel_subscription, got no tool calls
eu      pass    -             cancel_subscription
mn      pass    -             cancel_subscription
yo      pass    -             cancel_subscription

Result: failed, 4 of 12 locales failed
```
