# LangDrift Benchmark Results

Scenario: ./examples/scenarios/support-routing.yaml
Domain: support
Model: claude-haiku-4-5-20251001 (anthropic)
Iterations: 10
Total locale checks: 120
Pass rate: 71/120 (59%)
Average run duration: 39648 ms

| Locale | Pass  | no_tool_call | wrong_tool | wrong_argument | missing_argument | forbidden_tool |
| ------ | ----- | ------------ | ---------- | -------------- | ---------------- | -------------- |
| en     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| fr     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| ar     | 9/10  | 1            | 0          | 0              | 0                | 0              |
| sw     | 3/10  | 7            | 0          | 0              | 0                | 0              |
| cy     | 5/10  | 5            | 0          | 0              | 0                | 0              |
| eu     | 5/10  | 4            | 1          | 0              | 0                | 0              |
| mn     | 1/10  | 9            | 0          | 0              | 0                | 0              |
| yo     | 3/10  | 7            | 0          | 0              | 0                | 0              |
| zh     | 6/10  | 4            | 0          | 0              | 0                | 0              |
| ru     | 8/10  | 2            | 0          | 0              | 0                | 0              |
| id     | 7/10  | 3            | 0          | 0              | 0                | 0              |
| vi     | 4/10  | 6            | 0          | 0              | 0                | 0              |

## Runs

### Iteration 1

Duration: 36090 ms / Exit: 1

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             create_refund_ticket
fr      1/1     -             create_refund_ticket
ar      1/1     -             create_refund_ticket
sw      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
cy      1/1     -             create_refund_ticket
eu      1/1     -             create_refund_ticket
mn      1/1     -             create_refund_ticket
yo      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
zh      1/1     -             create_refund_ticket
ru      1/1     -             create_refund_ticket
id      1/1     -             create_refund_ticket
vi      1/1     -             create_refund_ticket

Result: failed, 2 of 12 locales failed
```

### Iteration 2

Duration: 37733 ms / Exit: 1

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             create_refund_ticket
fr      1/1     -             create_refund_ticket
ar      1/1     -             create_refund_ticket
sw      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
cy      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
eu      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
mn      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
yo      1/1     -             create_refund_ticket
zh      1/1     -             create_refund_ticket
ru      1/1     -             create_refund_ticket
id      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
vi      1/1     -             create_refund_ticket

Result: failed, 5 of 12 locales failed
```

### Iteration 3

Duration: 40504 ms / Exit: 1

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             create_refund_ticket
fr      1/1     -             create_refund_ticket
ar      1/1     -             create_refund_ticket
sw      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
cy      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
eu      1/1     -             create_refund_ticket
mn      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
yo      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
zh      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
ru      1/1     -             create_refund_ticket
id      1/1     -             create_refund_ticket
vi      0/1     no_tool_call  expected create_refund_ticket, got no tool calls

Result: failed, 6 of 12 locales failed
```

### Iteration 4

Duration: 35857 ms / Exit: 1

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             create_refund_ticket
fr      1/1     -             create_refund_ticket
ar      1/1     -             create_refund_ticket
sw      1/1     -             create_refund_ticket
cy      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
eu      1/1     -             create_refund_ticket
mn      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
yo      1/1     -             create_refund_ticket
zh      1/1     -             create_refund_ticket
ru      1/1     -             create_refund_ticket
id      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
vi      1/1     -             create_refund_ticket

Result: failed, 3 of 12 locales failed
```

### Iteration 5

Duration: 38256 ms / Exit: 1

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             create_refund_ticket
fr      1/1     -             create_refund_ticket
ar      1/1     -             create_refund_ticket
sw      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
cy      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
eu      1/1     -             create_refund_ticket
mn      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
yo      1/1     -             create_refund_ticket
zh      1/1     -             create_refund_ticket
ru      1/1     -             create_refund_ticket
id      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
vi      0/1     no_tool_call  expected create_refund_ticket, got no tool calls

Result: failed, 5 of 12 locales failed
```

### Iteration 6

Duration: 44755 ms / Exit: 1

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             create_refund_ticket
fr      1/1     -             create_refund_ticket
ar      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
sw      1/1     -             create_refund_ticket
cy      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
eu      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
mn      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
yo      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
zh      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
ru      1/1     -             create_refund_ticket
id      1/1     -             create_refund_ticket
vi      0/1     no_tool_call  expected create_refund_ticket, got no tool calls

Result: failed, 7 of 12 locales failed
```

### Iteration 7

Duration: 40232 ms / Exit: 1

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             create_refund_ticket
fr      1/1     -             create_refund_ticket
ar      1/1     -             create_refund_ticket
sw      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
cy      1/1     -             create_refund_ticket
eu      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
mn      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
yo      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
zh      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
ru      1/1     -             create_refund_ticket
id      1/1     -             create_refund_ticket
vi      1/1     -             create_refund_ticket

Result: failed, 5 of 12 locales failed
```

### Iteration 8

Duration: 47509 ms / Exit: 1

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             create_refund_ticket
fr      1/1     -             create_refund_ticket
ar      1/1     -             create_refund_ticket
sw      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
cy      1/1     -             create_refund_ticket
eu      0/1     wrong_tool    expected create_refund_ticket, got request_account_review
mn      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
yo      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
zh      1/1     -             create_refund_ticket
ru      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
id      1/1     -             create_refund_ticket
vi      0/1     no_tool_call  expected create_refund_ticket, got no tool calls

Result: failed, 6 of 12 locales failed
```

### Iteration 9

Duration: 39128 ms / Exit: 1

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             create_refund_ticket
fr      1/1     -             create_refund_ticket
ar      1/1     -             create_refund_ticket
sw      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
cy      1/1     -             create_refund_ticket
eu      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
mn      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
yo      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
zh      1/1     -             create_refund_ticket
ru      1/1     -             create_refund_ticket
id      1/1     -             create_refund_ticket
vi      0/1     no_tool_call  expected create_refund_ticket, got no tool calls

Result: failed, 5 of 12 locales failed
```

### Iteration 10

Duration: 36411 ms / Exit: 1

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             create_refund_ticket
fr      1/1     -             create_refund_ticket
ar      1/1     -             create_refund_ticket
sw      1/1     -             create_refund_ticket
cy      1/1     -             create_refund_ticket
eu      1/1     -             create_refund_ticket
mn      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
yo      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
zh      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
ru      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
id      1/1     -             create_refund_ticket
vi      0/1     no_tool_call  expected create_refund_ticket, got no tool calls

Result: failed, 5 of 12 locales failed
```
