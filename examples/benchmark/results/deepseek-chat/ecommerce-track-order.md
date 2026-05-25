# LangDrift Benchmark Results

Scenario: ./examples/scenarios/ecommerce-track-order.yaml
Domain: ecommerce
Model: deepseek-chat (deepseek)
Iterations: 10
Total locale checks: 120
Pass rate: 50/120 (42%)
Average run duration: 24105 ms

| Locale | Pass  | no_tool_call | wrong_tool | wrong_argument | missing_argument | forbidden_tool | wrong_sequence |
| ------ | ----- | ------------ | ---------- | -------------- | ---------------- | -------------- | -------------- |
| en     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| fr     | 1/10  | 9            | 0          | 0              | 0                | 0              | 0              |
| ar     | 0/10  | 10           | 0          | 0              | 0                | 0              | 0              |
| zh     | 0/10  | 10           | 0          | 0              | 0                | 0              | 0              |
| ru     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| id     | 6/10  | 4            | 0          | 0              | 0                | 0              | 0              |
| vi     | 0/10  | 10           | 0          | 0              | 0                | 0              | 0              |
| sw     | 0/10  | 10           | 0          | 0              | 0                | 0              | 0              |
| cy     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| eu     | 9/10  | 1            | 0          | 0              | 0                | 0              | 0              |
| mn     | 3/10  | 7            | 0          | 0              | 0                | 0              | 0              |
| yo     | 1/10  | 9            | 0          | 0              | 0                | 0              | 0              |

## Runs

### Iteration 1

Duration: 23066 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_order_status
fr      0/1     no_tool_call  expected check_order_status, got no tool calls
ar      0/1     no_tool_call  expected check_order_status, got no tool calls
zh      0/1     no_tool_call  expected check_order_status, got no tool calls
ru      1/1     -             check_order_status
id      1/1     -             check_order_status
vi      0/1     no_tool_call  expected check_order_status, got no tool calls
sw      0/1     no_tool_call  expected check_order_status, got no tool calls
cy      1/1     -             check_order_status
eu      0/1     no_tool_call  expected check_order_status, got no tool calls
mn      0/1     no_tool_call  expected check_order_status, got no tool calls
yo      1/1     -             check_order_status

Result: failed, 7 of 12 locales failed
```

### Iteration 2

Duration: 22319 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_order_status
fr      0/1     no_tool_call  expected check_order_status, got no tool calls
ar      0/1     no_tool_call  expected check_order_status, got no tool calls
zh      0/1     no_tool_call  expected check_order_status, got no tool calls
ru      1/1     -             check_order_status
id      0/1     no_tool_call  expected check_order_status, got no tool calls
vi      0/1     no_tool_call  expected check_order_status, got no tool calls
sw      0/1     no_tool_call  expected check_order_status, got no tool calls
cy      1/1     -             check_order_status
eu      1/1     -             check_order_status
mn      1/1     -             check_order_status
yo      0/1     no_tool_call  expected check_order_status, got no tool calls

Result: failed, 7 of 12 locales failed
```

### Iteration 3

Duration: 25803 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_order_status
fr      1/1     -             check_order_status
ar      0/1     no_tool_call  expected check_order_status, got no tool calls
zh      0/1     no_tool_call  expected check_order_status, got no tool calls
ru      1/1     -             check_order_status
id      1/1     -             check_order_status
vi      0/1     no_tool_call  expected check_order_status, got no tool calls
sw      0/1     no_tool_call  expected check_order_status, got no tool calls
cy      1/1     -             check_order_status
eu      1/1     -             check_order_status
mn      1/1     -             check_order_status
yo      0/1     no_tool_call  expected check_order_status, got no tool calls

Result: failed, 5 of 12 locales failed
```

### Iteration 4

Duration: 24475 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_order_status
fr      0/1     no_tool_call  expected check_order_status, got no tool calls
ar      0/1     no_tool_call  expected check_order_status, got no tool calls
zh      0/1     no_tool_call  expected check_order_status, got no tool calls
ru      1/1     -             check_order_status
id      1/1     -             check_order_status
vi      0/1     no_tool_call  expected check_order_status, got no tool calls
sw      0/1     no_tool_call  expected check_order_status, got no tool calls
cy      1/1     -             check_order_status
eu      1/1     -             check_order_status
mn      0/1     no_tool_call  expected check_order_status, got no tool calls
yo      0/1     no_tool_call  expected check_order_status, got no tool calls

Result: failed, 7 of 12 locales failed
```

### Iteration 5

Duration: 24370 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_order_status
fr      0/1     no_tool_call  expected check_order_status, got no tool calls
ar      0/1     no_tool_call  expected check_order_status, got no tool calls
zh      0/1     no_tool_call  expected check_order_status, got no tool calls
ru      1/1     -             check_order_status
id      1/1     -             check_order_status
vi      0/1     no_tool_call  expected check_order_status, got no tool calls
sw      0/1     no_tool_call  expected check_order_status, got no tool calls
cy      1/1     -             check_order_status
eu      1/1     -             check_order_status
mn      0/1     no_tool_call  expected check_order_status, got no tool calls
yo      0/1     no_tool_call  expected check_order_status, got no tool calls

Result: failed, 7 of 12 locales failed
```

### Iteration 6

Duration: 24266 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_order_status
fr      0/1     no_tool_call  expected check_order_status, got no tool calls
ar      0/1     no_tool_call  expected check_order_status, got no tool calls
zh      0/1     no_tool_call  expected check_order_status, got no tool calls
ru      1/1     -             check_order_status
id      0/1     no_tool_call  expected check_order_status, got no tool calls
vi      0/1     no_tool_call  expected check_order_status, got no tool calls
sw      0/1     no_tool_call  expected check_order_status, got no tool calls
cy      1/1     -             check_order_status
eu      1/1     -             check_order_status
mn      0/1     no_tool_call  expected check_order_status, got no tool calls
yo      0/1     no_tool_call  expected check_order_status, got no tool calls

Result: failed, 8 of 12 locales failed
```

### Iteration 7

Duration: 25289 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_order_status
fr      0/1     no_tool_call  expected check_order_status, got no tool calls
ar      0/1     no_tool_call  expected check_order_status, got no tool calls
zh      0/1     no_tool_call  expected check_order_status, got no tool calls
ru      1/1     -             check_order_status
id      1/1     -             check_order_status
vi      0/1     no_tool_call  expected check_order_status, got no tool calls
sw      0/1     no_tool_call  expected check_order_status, got no tool calls
cy      1/1     -             check_order_status
eu      1/1     -             check_order_status
mn      1/1     -             check_order_status
yo      0/1     no_tool_call  expected check_order_status, got no tool calls

Result: failed, 6 of 12 locales failed
```

### Iteration 8

Duration: 22840 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_order_status
fr      0/1     no_tool_call  expected check_order_status, got no tool calls
ar      0/1     no_tool_call  expected check_order_status, got no tool calls
zh      0/1     no_tool_call  expected check_order_status, got no tool calls
ru      1/1     -             check_order_status
id      0/1     no_tool_call  expected check_order_status, got no tool calls
vi      0/1     no_tool_call  expected check_order_status, got no tool calls
sw      0/1     no_tool_call  expected check_order_status, got no tool calls
cy      1/1     -             check_order_status
eu      1/1     -             check_order_status
mn      0/1     no_tool_call  expected check_order_status, got no tool calls
yo      0/1     no_tool_call  expected check_order_status, got no tool calls

Result: failed, 8 of 12 locales failed
```

### Iteration 9

Duration: 23655 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_order_status
fr      0/1     no_tool_call  expected check_order_status, got no tool calls
ar      0/1     no_tool_call  expected check_order_status, got no tool calls
zh      0/1     no_tool_call  expected check_order_status, got no tool calls
ru      1/1     -             check_order_status
id      0/1     no_tool_call  expected check_order_status, got no tool calls
vi      0/1     no_tool_call  expected check_order_status, got no tool calls
sw      0/1     no_tool_call  expected check_order_status, got no tool calls
cy      1/1     -             check_order_status
eu      1/1     -             check_order_status
mn      0/1     no_tool_call  expected check_order_status, got no tool calls
yo      0/1     no_tool_call  expected check_order_status, got no tool calls

Result: failed, 8 of 12 locales failed
```

### Iteration 10

Duration: 24970 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_order_status
fr      0/1     no_tool_call  expected check_order_status, got no tool calls
ar      0/1     no_tool_call  expected check_order_status, got no tool calls
zh      0/1     no_tool_call  expected check_order_status, got no tool calls
ru      1/1     -             check_order_status
id      1/1     -             check_order_status
vi      0/1     no_tool_call  expected check_order_status, got no tool calls
sw      0/1     no_tool_call  expected check_order_status, got no tool calls
cy      1/1     -             check_order_status
eu      1/1     -             check_order_status
mn      0/1     no_tool_call  expected check_order_status, got no tool calls
yo      0/1     no_tool_call  expected check_order_status, got no tool calls

Result: failed, 7 of 12 locales failed
```
