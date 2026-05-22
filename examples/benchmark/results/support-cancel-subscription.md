# LangDrift Benchmark Results

Scenario: ./examples/scenarios/support-cancel-subscription.yaml
Domain: support
Model: deepseek-chat (openai-compat)
Iterations: 3
Total locale checks: 36
Pass rate: 28/36 (78%)
Average run duration: 25086 ms

| Locale | Pass | no_tool_call | wrong_tool | wrong_argument | missing_argument | forbidden_tool |
| ------ | ---- | ------------ | ---------- | -------------- | ---------------- | -------------- |
| en     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| fr     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| ar     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| zh     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| ru     | 2/3  | 1            | 0          | 0              | 0                | 0              |
| id     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| vi     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| sw     | 1/3  | 2            | 0          | 0              | 0                | 0              |
| cy     | 1/3  | 2            | 0          | 0              | 0                | 0              |
| eu     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| mn     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| yo     | 0/3  | 3            | 0          | 0              | 0                | 0              |

## Runs

### Iteration 1

Duration: 24468 ms / Exit: 1

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure       Detail
en      pass    -             cancel_subscription
fr      pass    -             cancel_subscription
ar      pass    -             cancel_subscription
zh      pass    -             cancel_subscription
ru      pass    -             cancel_subscription
id      pass    -             cancel_subscription
vi      pass    -             cancel_subscription
sw      fail    no_tool_call  expected cancel_subscription, got no tool calls
cy      fail    no_tool_call  expected cancel_subscription, got no tool calls
eu      pass    -             cancel_subscription
mn      pass    -             cancel_subscription
yo      fail    no_tool_call  expected cancel_subscription, got no tool calls

Result: failed, 3 of 12 locales failed
```

### Iteration 2

Duration: 24977 ms / Exit: 1

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure       Detail
en      pass    -             cancel_subscription
fr      pass    -             cancel_subscription
ar      pass    -             cancel_subscription
zh      pass    -             cancel_subscription
ru      fail    no_tool_call  expected cancel_subscription, got no tool calls
id      pass    -             cancel_subscription
vi      pass    -             cancel_subscription
sw      fail    no_tool_call  expected cancel_subscription, got no tool calls
cy      fail    no_tool_call  expected cancel_subscription, got no tool calls
eu      pass    -             cancel_subscription
mn      pass    -             cancel_subscription
yo      fail    no_tool_call  expected cancel_subscription, got no tool calls

Result: failed, 4 of 12 locales failed
```

### Iteration 3

Duration: 25812 ms / Exit: 1

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure       Detail
en      pass    -             cancel_subscription
fr      pass    -             cancel_subscription
ar      pass    -             cancel_subscription
zh      pass    -             cancel_subscription
ru      pass    -             cancel_subscription
id      pass    -             cancel_subscription
vi      pass    -             cancel_subscription
sw      pass    -             cancel_subscription
cy      pass    -             cancel_subscription
eu      pass    -             cancel_subscription
mn      pass    -             cancel_subscription
yo      fail    no_tool_call  expected cancel_subscription, got no tool calls

Result: failed, 1 of 12 locales failed
```
