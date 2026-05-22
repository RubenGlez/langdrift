# LangDrift Benchmark Results

Scenario: ./examples/scenarios/ecommerce-track-order.yaml
Domain: ecommerce
Model: deepseek-chat (openai-compat)
Iterations: 3
Total locale checks: 36
Pass rate: 29/36 (81%)
Average run duration: 25239 ms

| Locale | Pass | no_tool_call | wrong_tool | wrong_argument | missing_argument | forbidden_tool |
| ------ | ---- | ------------ | ---------- | -------------- | ---------------- | -------------- |
| en     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| fr     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| ar     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| zh     | 0/3  | 3            | 0          | 0              | 0                | 0              |
| ru     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| id     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| vi     | 2/3  | 1            | 0          | 0              | 0                | 0              |
| sw     | 0/3  | 3            | 0          | 0              | 0                | 0              |
| cy     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| eu     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| mn     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| yo     | 3/3  | 0            | 0          | 0              | 0                | 0              |

## Runs

### Iteration 1

Duration: 25249 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure       Detail
en      pass    -             check_order_status
fr      pass    -             check_order_status
ar      pass    -             check_order_status
zh      fail    no_tool_call  expected check_order_status, got no tool calls
ru      pass    -             check_order_status
id      pass    -             check_order_status
vi      pass    -             check_order_status
sw      fail    no_tool_call  expected check_order_status, got no tool calls
cy      pass    -             check_order_status
eu      pass    -             check_order_status
mn      pass    -             check_order_status
yo      pass    -             check_order_status

Result: failed, 2 of 12 locales failed
```

### Iteration 2

Duration: 23964 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure       Detail
en      pass    -             check_order_status
fr      pass    -             check_order_status
ar      pass    -             check_order_status
zh      fail    no_tool_call  expected check_order_status, got no tool calls
ru      pass    -             check_order_status
id      pass    -             check_order_status
vi      fail    no_tool_call  expected check_order_status, got no tool calls
sw      fail    no_tool_call  expected check_order_status, got no tool calls
cy      pass    -             check_order_status
eu      pass    -             check_order_status
mn      pass    -             check_order_status
yo      pass    -             check_order_status

Result: failed, 3 of 12 locales failed
```

### Iteration 3

Duration: 26505 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure       Detail
en      pass    -             check_order_status
fr      pass    -             check_order_status
ar      pass    -             check_order_status
zh      fail    no_tool_call  expected check_order_status, got no tool calls
ru      pass    -             check_order_status
id      pass    -             check_order_status
vi      pass    -             check_order_status
sw      fail    no_tool_call  expected check_order_status, got no tool calls
cy      pass    -             check_order_status
eu      pass    -             check_order_status
mn      pass    -             check_order_status
yo      pass    -             check_order_status

Result: failed, 2 of 12 locales failed
```
