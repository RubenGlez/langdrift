# LangDrift Benchmark Results

Scenario: ./examples/scenarios/ecommerce-cancel-order.yaml
Domain: ecommerce
Model: deepseek-chat (deepseek)
Iterations: 10
Total locale checks: 120
Pass rate: 69/120 (57%)
Average run duration: 26608 ms

| Locale | Pass  | no_tool_call | wrong_tool | wrong_argument | missing_argument | forbidden_tool | wrong_sequence |
| ------ | ----- | ------------ | ---------- | -------------- | ---------------- | -------------- | -------------- |
| en     | 8/10  | 2            | 0          | 0              | 0                | 0              | 0              |
| fr     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| ar     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| zh     | 0/10  | 10           | 0          | 0              | 0                | 0              | 0              |
| ru     | 0/10  | 10           | 0          | 0              | 0                | 0              | 0              |
| id     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| vi     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| sw     | 3/10  | 7            | 0          | 0              | 0                | 0              | 0              |
| cy     | 9/10  | 1            | 0          | 0              | 0                | 0              | 0              |
| eu     | 0/10  | 10           | 0          | 0              | 0                | 0              | 0              |
| mn     | 9/10  | 1            | 0          | 0              | 0                | 0              | 0              |
| yo     | 0/10  | 10           | 0          | 0              | 0                | 0              | 0              |

## Runs

### Iteration 1

Duration: 26928 ms / Exit: 1

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
ru      0/1     no_tool_call  expected cancel_order, got no tool calls
id      1/1     -             cancel_order
vi      1/1     -             cancel_order
sw      1/1     -             cancel_order
cy      1/1     -             cancel_order
eu      0/1     no_tool_call  expected cancel_order, got no tool calls
mn      1/1     -             cancel_order
yo      0/1     no_tool_call  expected cancel_order, got no tool calls

Result: failed, 4 of 12 locales failed
```

### Iteration 2

Duration: 26839 ms / Exit: 1

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
ru      0/1     no_tool_call  expected cancel_order, got no tool calls
id      1/1     -             cancel_order
vi      1/1     -             cancel_order
sw      1/1     -             cancel_order
cy      1/1     -             cancel_order
eu      0/1     no_tool_call  expected cancel_order, got no tool calls
mn      1/1     -             cancel_order
yo      0/1     no_tool_call  expected cancel_order, got no tool calls

Result: failed, 4 of 12 locales failed
```

### Iteration 3

Duration: 26615 ms / Exit: 1

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
ru      0/1     no_tool_call  expected cancel_order, got no tool calls
id      1/1     -             cancel_order
vi      1/1     -             cancel_order
sw      0/1     no_tool_call  expected cancel_order, got no tool calls
cy      1/1     -             cancel_order
eu      0/1     no_tool_call  expected cancel_order, got no tool calls
mn      1/1     -             cancel_order
yo      0/1     no_tool_call  expected cancel_order, got no tool calls

Result: failed, 5 of 12 locales failed
```

### Iteration 4

Duration: 27652 ms / Exit: 1

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
ru      0/1     no_tool_call  expected cancel_order, got no tool calls
id      1/1     -             cancel_order
vi      1/1     -             cancel_order
sw      0/1     no_tool_call  expected cancel_order, got no tool calls
cy      1/1     -             cancel_order
eu      0/1     no_tool_call  expected cancel_order, got no tool calls
mn      1/1     -             cancel_order
yo      0/1     no_tool_call  expected cancel_order, got no tool calls

Result: failed, 5 of 12 locales failed
```

### Iteration 5

Duration: 25164 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      0/1     no_tool_call  expected cancel_order, got no tool calls
fr      1/1     -             cancel_order
ar      1/1     -             cancel_order
zh      0/1     no_tool_call  expected cancel_order, got no tool calls
ru      0/1     no_tool_call  expected cancel_order, got no tool calls
id      1/1     -             cancel_order
vi      1/1     -             cancel_order
sw      0/1     no_tool_call  expected cancel_order, got no tool calls
cy      1/1     -             cancel_order
eu      0/1     no_tool_call  expected cancel_order, got no tool calls
mn      1/1     -             cancel_order
yo      0/1     no_tool_call  expected cancel_order, got no tool calls

Result: failed, 6 of 12 locales failed
```

### Iteration 6

Duration: 26231 ms / Exit: 1

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
ru      0/1     no_tool_call  expected cancel_order, got no tool calls
id      1/1     -             cancel_order
vi      1/1     -             cancel_order
sw      0/1     no_tool_call  expected cancel_order, got no tool calls
cy      1/1     -             cancel_order
eu      0/1     no_tool_call  expected cancel_order, got no tool calls
mn      1/1     -             cancel_order
yo      0/1     no_tool_call  expected cancel_order, got no tool calls

Result: failed, 5 of 12 locales failed
```

### Iteration 7

Duration: 26937 ms / Exit: 1

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
ru      0/1     no_tool_call  expected cancel_order, got no tool calls
id      1/1     -             cancel_order
vi      1/1     -             cancel_order
sw      0/1     no_tool_call  expected cancel_order, got no tool calls
cy      1/1     -             cancel_order
eu      0/1     no_tool_call  expected cancel_order, got no tool calls
mn      1/1     -             cancel_order
yo      0/1     no_tool_call  expected cancel_order, got no tool calls

Result: failed, 5 of 12 locales failed
```

### Iteration 8

Duration: 25733 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      0/1     no_tool_call  expected cancel_order, got no tool calls
fr      1/1     -             cancel_order
ar      1/1     -             cancel_order
zh      0/1     no_tool_call  expected cancel_order, got no tool calls
ru      0/1     no_tool_call  expected cancel_order, got no tool calls
id      1/1     -             cancel_order
vi      1/1     -             cancel_order
sw      1/1     -             cancel_order
cy      1/1     -             cancel_order
eu      0/1     no_tool_call  expected cancel_order, got no tool calls
mn      1/1     -             cancel_order
yo      0/1     no_tool_call  expected cancel_order, got no tool calls

Result: failed, 5 of 12 locales failed
```

### Iteration 9

Duration: 27003 ms / Exit: 1

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
ru      0/1     no_tool_call  expected cancel_order, got no tool calls
id      1/1     -             cancel_order
vi      1/1     -             cancel_order
sw      0/1     no_tool_call  expected cancel_order, got no tool calls
cy      0/1     no_tool_call  expected cancel_order, got no tool calls
eu      0/1     no_tool_call  expected cancel_order, got no tool calls
mn      0/1     no_tool_call  expected cancel_order, got no tool calls
yo      0/1     no_tool_call  expected cancel_order, got no tool calls

Result: failed, 7 of 12 locales failed
```

### Iteration 10

Duration: 26973 ms / Exit: 1

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
ru      0/1     no_tool_call  expected cancel_order, got no tool calls
id      1/1     -             cancel_order
vi      1/1     -             cancel_order
sw      0/1     no_tool_call  expected cancel_order, got no tool calls
cy      1/1     -             cancel_order
eu      0/1     no_tool_call  expected cancel_order, got no tool calls
mn      1/1     -             cancel_order
yo      0/1     no_tool_call  expected cancel_order, got no tool calls

Result: failed, 5 of 12 locales failed
```
