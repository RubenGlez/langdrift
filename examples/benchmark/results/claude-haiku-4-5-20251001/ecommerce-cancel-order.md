# LangDrift Benchmark Results

Scenario: ./examples/scenarios/ecommerce-cancel-order.yaml
Domain: ecommerce
Model: claude-haiku-4-5-20251001 (anthropic)
Iterations: 10
Total locale checks: 120
Pass rate: 83/120 (69%)
Average run duration: 28648 ms

| Locale | Pass  | no_tool_call | wrong_tool | wrong_argument | missing_argument | forbidden_tool |
| ------ | ----- | ------------ | ---------- | -------------- | ---------------- | -------------- |
| en     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| fr     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| ar     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| zh     | 6/10  | 4            | 0          | 0              | 0                | 0              |
| ru     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| id     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| vi     | 9/10  | 1            | 0          | 0              | 0                | 0              |
| sw     | 9/10  | 1            | 0          | 0              | 0                | 0              |
| cy     | 1/10  | 9            | 0          | 0              | 0                | 0              |
| eu     | 2/10  | 8            | 0          | 0              | 0                | 0              |
| mn     | 6/10  | 4            | 0          | 0              | 0                | 0              |
| yo     | 0/10  | 10           | 0          | 0              | 0                | 0              |

## Runs

### Iteration 1

Duration: 26136 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_order
fr      1/1     -             cancel_order
ar      1/1     -             cancel_order
zh      1/1     -             cancel_order
ru      1/1     -             cancel_order
id      1/1     -             cancel_order
vi      1/1     -             cancel_order
sw      1/1     -             cancel_order
cy      0/1     no_tool_call  expected cancel_order, got no tool calls
eu      0/1     no_tool_call  expected cancel_order, got no tool calls
mn      1/1     -             cancel_order
yo      0/1     no_tool_call  expected cancel_order, got no tool calls

Result: failed, 3 of 12 locales failed
```

### Iteration 2

Duration: 33012 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_order
fr      1/1     -             cancel_order
ar      1/1     -             cancel_order
zh      1/1     -             cancel_order
ru      1/1     -             cancel_order
id      1/1     -             cancel_order
vi      1/1     -             cancel_order
sw      1/1     -             cancel_order
cy      0/1     no_tool_call  expected cancel_order, got no tool calls
eu      0/1     no_tool_call  expected cancel_order, got no tool calls
mn      0/1     no_tool_call  expected cancel_order, got no tool calls
yo      0/1     no_tool_call  expected cancel_order, got no tool calls

Result: failed, 4 of 12 locales failed
```

### Iteration 3

Duration: 25694 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_order
fr      1/1     -             cancel_order
ar      1/1     -             cancel_order
zh      1/1     -             cancel_order
ru      1/1     -             cancel_order
id      1/1     -             cancel_order
vi      1/1     -             cancel_order
sw      1/1     -             cancel_order
cy      1/1     -             cancel_order
eu      0/1     no_tool_call  expected cancel_order, got no tool calls
mn      0/1     no_tool_call  expected cancel_order, got no tool calls
yo      0/1     no_tool_call  expected cancel_order, got no tool calls

Result: failed, 3 of 12 locales failed
```

### Iteration 4

Duration: 26419 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_order
fr      1/1     -             cancel_order
ar      1/1     -             cancel_order
zh      0/1     no_tool_call  expected cancel_order, got no tool calls
ru      1/1     -             cancel_order
id      1/1     -             cancel_order
vi      1/1     -             cancel_order
sw      1/1     -             cancel_order
cy      0/1     no_tool_call  expected cancel_order, got no tool calls
eu      0/1     no_tool_call  expected cancel_order, got no tool calls
mn      1/1     -             cancel_order
yo      0/1     no_tool_call  expected cancel_order, got no tool calls

Result: failed, 4 of 12 locales failed
```

### Iteration 5

Duration: 30216 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_order
fr      1/1     -             cancel_order
ar      1/1     -             cancel_order
zh      0/1     no_tool_call  expected cancel_order, got no tool calls
ru      1/1     -             cancel_order
id      1/1     -             cancel_order
vi      1/1     -             cancel_order
sw      1/1     -             cancel_order
cy      0/1     no_tool_call  expected cancel_order, got no tool calls
eu      0/1     no_tool_call  expected cancel_order, got no tool calls
mn      1/1     -             cancel_order
yo      0/1     no_tool_call  expected cancel_order, got no tool calls

Result: failed, 4 of 12 locales failed
```

### Iteration 6

Duration: 33893 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_order
fr      1/1     -             cancel_order
ar      1/1     -             cancel_order
zh      1/1     -             cancel_order
ru      1/1     -             cancel_order
id      1/1     -             cancel_order
vi      1/1     -             cancel_order
sw      1/1     -             cancel_order
cy      0/1     no_tool_call  expected cancel_order, got no tool calls
eu      0/1     no_tool_call  expected cancel_order, got no tool calls
mn      0/1     no_tool_call  expected cancel_order, got no tool calls
yo      0/1     no_tool_call  expected cancel_order, got no tool calls

Result: failed, 4 of 12 locales failed
```

### Iteration 7

Duration: 29593 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_order
fr      1/1     -             cancel_order
ar      1/1     -             cancel_order
zh      1/1     -             cancel_order
ru      1/1     -             cancel_order
id      1/1     -             cancel_order
vi      1/1     -             cancel_order
sw      0/1     no_tool_call  expected cancel_order, got no tool calls
cy      0/1     no_tool_call  expected cancel_order, got no tool calls
eu      1/1     -             cancel_order
mn      0/1     no_tool_call  expected cancel_order, got no tool calls
yo      0/1     no_tool_call  expected cancel_order, got no tool calls

Result: failed, 4 of 12 locales failed
```

### Iteration 8

Duration: 25576 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_order
fr      1/1     -             cancel_order
ar      1/1     -             cancel_order
zh      0/1     no_tool_call  expected cancel_order, got no tool calls
ru      1/1     -             cancel_order
id      1/1     -             cancel_order
vi      1/1     -             cancel_order
sw      1/1     -             cancel_order
cy      0/1     no_tool_call  expected cancel_order, got no tool calls
eu      1/1     -             cancel_order
mn      1/1     -             cancel_order
yo      0/1     no_tool_call  expected cancel_order, got no tool calls

Result: failed, 3 of 12 locales failed
```

### Iteration 9

Duration: 31200 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_order
fr      1/1     -             cancel_order
ar      1/1     -             cancel_order
zh      0/1     no_tool_call  expected cancel_order, got no tool calls
ru      1/1     -             cancel_order
id      1/1     -             cancel_order
vi      1/1     -             cancel_order
sw      1/1     -             cancel_order
cy      0/1     no_tool_call  expected cancel_order, got no tool calls
eu      0/1     no_tool_call  expected cancel_order, got no tool calls
mn      1/1     -             cancel_order
yo      0/1     no_tool_call  expected cancel_order, got no tool calls

Result: failed, 4 of 12 locales failed
```

### Iteration 10

Duration: 24739 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_order
fr      1/1     -             cancel_order
ar      1/1     -             cancel_order
zh      1/1     -             cancel_order
ru      1/1     -             cancel_order
id      1/1     -             cancel_order
vi      0/1     no_tool_call  expected cancel_order, got no tool calls
sw      1/1     -             cancel_order
cy      0/1     no_tool_call  expected cancel_order, got no tool calls
eu      0/1     no_tool_call  expected cancel_order, got no tool calls
mn      1/1     -             cancel_order
yo      0/1     no_tool_call  expected cancel_order, got no tool calls

Result: failed, 4 of 12 locales failed
```
