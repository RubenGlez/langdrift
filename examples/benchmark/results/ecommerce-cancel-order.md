# LangDrift Benchmark Results

Scenario: ./examples/scenarios/ecommerce-cancel-order.yaml
Domain: ecommerce
Model: deepseek-chat (openai-compat)
Iterations: 3
Total locale checks: 36
Pass rate: 4/36 (11%)
Average run duration: 29769 ms

| Locale | Pass | no_tool_call | wrong_tool | wrong_argument | missing_argument | forbidden_tool |
| ------ | ---- | ------------ | ---------- | -------------- | ---------------- | -------------- |
| en     | 0/3  | 3            | 0          | 0              | 0                | 0              |
| fr     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| ar     | 0/3  | 3            | 0          | 0              | 0                | 0              |
| sw     | 0/3  | 3            | 0          | 0              | 0                | 0              |
| cy     | 0/3  | 3            | 0          | 0              | 0                | 0              |
| eu     | 0/3  | 3            | 0          | 0              | 0                | 0              |
| mn     | 0/3  | 3            | 0          | 0              | 0                | 0              |
| yo     | 0/3  | 3            | 0          | 0              | 0                | 0              |
| zh     | 0/3  | 3            | 0          | 0              | 0                | 0              |
| ru     | 0/3  | 3            | 0          | 0              | 0                | 0              |
| id     | 0/3  | 3            | 0          | 0              | 0                | 0              |
| vi     | 1/3  | 2            | 0          | 0              | 0                | 0              |

## Runs

### Iteration 1

Duration: 29324 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure       Detail
en      fail    no_tool_call  expected cancel_order, got no tool calls
fr      pass    -             cancel_order
ar      fail    no_tool_call  expected cancel_order, got no tool calls
sw      fail    no_tool_call  expected cancel_order, got no tool calls
cy      fail    no_tool_call  expected cancel_order, got no tool calls
eu      fail    no_tool_call  expected cancel_order, got no tool calls
mn      fail    no_tool_call  expected cancel_order, got no tool calls
yo      fail    no_tool_call  expected cancel_order, got no tool calls
zh      fail    no_tool_call  expected cancel_order, got no tool calls
ru      fail    no_tool_call  expected cancel_order, got no tool calls
id      fail    no_tool_call  expected cancel_order, got no tool calls
vi      fail    no_tool_call  expected cancel_order, got no tool calls

Result: failed, 11 of 12 locales failed
```

### Iteration 2

Duration: 30571 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure       Detail
en      fail    no_tool_call  expected cancel_order, got no tool calls
fr      pass    -             cancel_order
ar      fail    no_tool_call  expected cancel_order, got no tool calls
sw      fail    no_tool_call  expected cancel_order, got no tool calls
cy      fail    no_tool_call  expected cancel_order, got no tool calls
eu      fail    no_tool_call  expected cancel_order, got no tool calls
mn      fail    no_tool_call  expected cancel_order, got no tool calls
yo      fail    no_tool_call  expected cancel_order, got no tool calls
zh      fail    no_tool_call  expected cancel_order, got no tool calls
ru      fail    no_tool_call  expected cancel_order, got no tool calls
id      fail    no_tool_call  expected cancel_order, got no tool calls
vi      fail    no_tool_call  expected cancel_order, got no tool calls

Result: failed, 11 of 12 locales failed
```

### Iteration 3

Duration: 29413 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure       Detail
en      fail    no_tool_call  expected cancel_order, got no tool calls
fr      pass    -             cancel_order
ar      fail    no_tool_call  expected cancel_order, got no tool calls
sw      fail    no_tool_call  expected cancel_order, got no tool calls
cy      fail    no_tool_call  expected cancel_order, got no tool calls
eu      fail    no_tool_call  expected cancel_order, got no tool calls
mn      fail    no_tool_call  expected cancel_order, got no tool calls
yo      fail    no_tool_call  expected cancel_order, got no tool calls
zh      fail    no_tool_call  expected cancel_order, got no tool calls
ru      fail    no_tool_call  expected cancel_order, got no tool calls
id      fail    no_tool_call  expected cancel_order, got no tool calls
vi      pass    -             cancel_order

Result: failed, 10 of 12 locales failed
```
