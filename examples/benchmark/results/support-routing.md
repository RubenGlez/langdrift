# LangDrift Benchmark Results

Scenario: ./examples/scenarios/support-routing.yaml
Domain: support
Model: deepseek-chat (openai-compat)
Iterations: 3
Total locale checks: 36
Pass rate: 31/36 (86%)
Average run duration: 31937 ms

| Locale | Pass | no_tool_call | wrong_tool | wrong_argument | missing_argument | forbidden_tool |
| ------ | ---- | ------------ | ---------- | -------------- | ---------------- | -------------- |
| en     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| fr     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| ar     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| sw     | 0/3  | 3            | 0          | 0              | 0                | 0              |
| cy     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| eu     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| mn     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| yo     | 2/3  | 1            | 0          | 0              | 0                | 0              |
| zh     | 2/3  | 1            | 0          | 0              | 0                | 0              |
| ru     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| id     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| vi     | 3/3  | 0            | 0          | 0              | 0                | 0              |

## Runs

### Iteration 1

Duration: 31908 ms / Exit: 1

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure       Detail
en      pass    -             create_refund_ticket
fr      pass    -             create_refund_ticket
ar      pass    -             create_refund_ticket
sw      fail    no_tool_call  expected create_refund_ticket, got no tool calls
cy      pass    -             create_refund_ticket
eu      pass    -             create_refund_ticket
mn      pass    -             create_refund_ticket
yo      fail    no_tool_call  expected create_refund_ticket, got no tool calls
zh      fail    no_tool_call  expected create_refund_ticket, got no tool calls
ru      pass    -             create_refund_ticket
id      pass    -             create_refund_ticket
vi      pass    -             create_refund_ticket

Result: failed, 3 of 12 locales failed
```

### Iteration 2

Duration: 31165 ms / Exit: 1

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure       Detail
en      pass    -             create_refund_ticket
fr      pass    -             create_refund_ticket
ar      pass    -             create_refund_ticket
sw      fail    no_tool_call  expected create_refund_ticket, got no tool calls
cy      pass    -             create_refund_ticket
eu      pass    -             create_refund_ticket
mn      pass    -             create_refund_ticket
yo      pass    -             create_refund_ticket
zh      pass    -             create_refund_ticket
ru      pass    -             create_refund_ticket
id      pass    -             create_refund_ticket
vi      pass    -             create_refund_ticket

Result: failed, 1 of 12 locales failed
```

### Iteration 3

Duration: 32738 ms / Exit: 1

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure       Detail
en      pass    -             create_refund_ticket
fr      pass    -             create_refund_ticket
ar      pass    -             create_refund_ticket
sw      fail    no_tool_call  expected create_refund_ticket, got no tool calls
cy      pass    -             create_refund_ticket
eu      pass    -             create_refund_ticket
mn      pass    -             create_refund_ticket
yo      pass    -             create_refund_ticket
zh      pass    -             create_refund_ticket
ru      pass    -             create_refund_ticket
id      pass    -             create_refund_ticket
vi      pass    -             create_refund_ticket

Result: failed, 1 of 12 locales failed
```
