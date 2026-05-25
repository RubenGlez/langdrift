# LangDrift Benchmark Results

Scenario: ./examples/scenarios/ecommerce-track-order.yaml
Domain: ecommerce
Model: claude-haiku-4-5-20251001 (anthropic)
Iterations: 10
Total locale checks: 120
Pass rate: 55/120 (46%)
Average run duration: 39739 ms

| Locale | Pass | no_tool_call | wrong_tool | wrong_argument | missing_argument | forbidden_tool |
| ------ | ---- | ------------ | ---------- | -------------- | ---------------- | -------------- |
| en     | 3/10 | 7            | 0          | 0              | 0                | 0              |
| fr     | 7/10 | 3            | 0          | 0              | 0                | 0              |
| ar     | 8/10 | 2            | 0          | 0              | 0                | 0              |
| zh     | 2/10 | 8            | 0          | 0              | 0                | 0              |
| ru     | 8/10 | 2            | 0          | 0              | 0                | 0              |
| id     | 5/10 | 5            | 0          | 0              | 0                | 0              |
| vi     | 8/10 | 2            | 0          | 0              | 0                | 0              |
| sw     | 4/10 | 6            | 0          | 0              | 0                | 0              |
| cy     | 1/10 | 9            | 0          | 0              | 0                | 0              |
| eu     | 1/10 | 9            | 0          | 0              | 0                | 0              |
| mn     | 0/10 | 10           | 0          | 0              | 0                | 0              |
| yo     | 8/10 | 2            | 0          | 0              | 0                | 0              |

## Runs

### Iteration 1

Duration: 107050 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      0/1     no_tool_call  expected check_order_status, got no tool calls
fr      0/1     no_tool_call  expected check_order_status, got no tool calls
ar      1/1     -             check_order_status
zh      0/1     no_tool_call  expected check_order_status, got no tool calls
ru      1/1     -             check_order_status
id      1/1     -             check_order_status
vi      1/1     -             check_order_status
sw      0/1     no_tool_call  expected check_order_status, got no tool calls
cy      0/1     no_tool_call  expected check_order_status, got no tool calls
eu      1/1     -             check_order_status
mn      0/1     no_tool_call  expected check_order_status, got no tool calls
yo      1/1     -             check_order_status

Result: failed, 6 of 12 locales failed
```

### Iteration 2

Duration: 30517 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_order_status
fr      1/1     -             check_order_status
ar      1/1     -             check_order_status
zh      0/1     no_tool_call  expected check_order_status, got no tool calls
ru      0/1     no_tool_call  expected check_order_status, got no tool calls
id      0/1     no_tool_call  expected check_order_status, got no tool calls
vi      1/1     -             check_order_status
sw      0/1     no_tool_call  expected check_order_status, got no tool calls
cy      0/1     no_tool_call  expected check_order_status, got no tool calls
eu      0/1     no_tool_call  expected check_order_status, got no tool calls
mn      0/1     no_tool_call  expected check_order_status, got no tool calls
yo      1/1     -             check_order_status

Result: failed, 7 of 12 locales failed
```

### Iteration 3

Duration: 24071 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      0/1     no_tool_call  expected check_order_status, got no tool calls
fr      1/1     -             check_order_status
ar      1/1     -             check_order_status
zh      0/1     no_tool_call  expected check_order_status, got no tool calls
ru      1/1     -             check_order_status
id      1/1     -             check_order_status
vi      1/1     -             check_order_status
sw      1/1     -             check_order_status
cy      1/1     -             check_order_status
eu      0/1     no_tool_call  expected check_order_status, got no tool calls
mn      0/1     no_tool_call  expected check_order_status, got no tool calls
yo      1/1     -             check_order_status

Result: failed, 4 of 12 locales failed
```

### Iteration 4

Duration: 32861 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      0/1     no_tool_call  expected check_order_status, got no tool calls
fr      1/1     -             check_order_status
ar      0/1     no_tool_call  expected check_order_status, got no tool calls
zh      0/1     no_tool_call  expected check_order_status, got no tool calls
ru      1/1     -             check_order_status
id      1/1     -             check_order_status
vi      0/1     no_tool_call  expected check_order_status, got no tool calls
sw      1/1     -             check_order_status
cy      0/1     no_tool_call  expected check_order_status, got no tool calls
eu      0/1     no_tool_call  expected check_order_status, got no tool calls
mn      0/1     no_tool_call  expected check_order_status, got no tool calls
yo      1/1     -             check_order_status

Result: failed, 7 of 12 locales failed
```

### Iteration 5

Duration: 31739 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_order_status
fr      1/1     -             check_order_status
ar      1/1     -             check_order_status
zh      0/1     no_tool_call  expected check_order_status, got no tool calls
ru      0/1     no_tool_call  expected check_order_status, got no tool calls
id      0/1     no_tool_call  expected check_order_status, got no tool calls
vi      0/1     no_tool_call  expected check_order_status, got no tool calls
sw      0/1     no_tool_call  expected check_order_status, got no tool calls
cy      0/1     no_tool_call  expected check_order_status, got no tool calls
eu      0/1     no_tool_call  expected check_order_status, got no tool calls
mn      0/1     no_tool_call  expected check_order_status, got no tool calls
yo      1/1     -             check_order_status

Result: failed, 8 of 12 locales failed
```

### Iteration 6

Duration: 31444 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      0/1     no_tool_call  expected check_order_status, got no tool calls
fr      1/1     -             check_order_status
ar      1/1     -             check_order_status
zh      1/1     -             check_order_status
ru      1/1     -             check_order_status
id      0/1     no_tool_call  expected check_order_status, got no tool calls
vi      1/1     -             check_order_status
sw      1/1     -             check_order_status
cy      0/1     no_tool_call  expected check_order_status, got no tool calls
eu      0/1     no_tool_call  expected check_order_status, got no tool calls
mn      0/1     no_tool_call  expected check_order_status, got no tool calls
yo      0/1     no_tool_call  expected check_order_status, got no tool calls

Result: failed, 6 of 12 locales failed
```

### Iteration 7

Duration: 37372 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      0/1     no_tool_call  expected check_order_status, got no tool calls
fr      1/1     -             check_order_status
ar      1/1     -             check_order_status
zh      0/1     no_tool_call  expected check_order_status, got no tool calls
ru      1/1     -             check_order_status
id      0/1     no_tool_call  expected check_order_status, got no tool calls
vi      1/1     -             check_order_status
sw      0/1     no_tool_call  expected check_order_status, got no tool calls
cy      0/1     no_tool_call  expected check_order_status, got no tool calls
eu      0/1     no_tool_call  expected check_order_status, got no tool calls
mn      0/1     no_tool_call  expected check_order_status, got no tool calls
yo      1/1     -             check_order_status

Result: failed, 7 of 12 locales failed
```

### Iteration 8

Duration: 28631 ms / Exit: 1

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
vi      1/1     -             check_order_status
sw      0/1     no_tool_call  expected check_order_status, got no tool calls
cy      0/1     no_tool_call  expected check_order_status, got no tool calls
eu      0/1     no_tool_call  expected check_order_status, got no tool calls
mn      0/1     no_tool_call  expected check_order_status, got no tool calls
yo      1/1     -             check_order_status

Result: failed, 7 of 12 locales failed
```

### Iteration 9

Duration: 35875 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      0/1     no_tool_call  expected check_order_status, got no tool calls
fr      0/1     no_tool_call  expected check_order_status, got no tool calls
ar      1/1     -             check_order_status
zh      1/1     -             check_order_status
ru      1/1     -             check_order_status
id      1/1     -             check_order_status
vi      1/1     -             check_order_status
sw      1/1     -             check_order_status
cy      0/1     no_tool_call  expected check_order_status, got no tool calls
eu      0/1     no_tool_call  expected check_order_status, got no tool calls
mn      0/1     no_tool_call  expected check_order_status, got no tool calls
yo      1/1     -             check_order_status

Result: failed, 5 of 12 locales failed
```

### Iteration 10

Duration: 37831 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      0/1     no_tool_call  expected check_order_status, got no tool calls
fr      1/1     -             check_order_status
ar      1/1     -             check_order_status
zh      0/1     no_tool_call  expected check_order_status, got no tool calls
ru      1/1     -             check_order_status
id      0/1     no_tool_call  expected check_order_status, got no tool calls
vi      1/1     -             check_order_status
sw      0/1     no_tool_call  expected check_order_status, got no tool calls
cy      0/1     no_tool_call  expected check_order_status, got no tool calls
eu      0/1     no_tool_call  expected check_order_status, got no tool calls
mn      0/1     no_tool_call  expected check_order_status, got no tool calls
yo      0/1     no_tool_call  expected check_order_status, got no tool calls

Result: failed, 8 of 12 locales failed
```
