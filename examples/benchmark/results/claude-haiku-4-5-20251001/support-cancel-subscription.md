# LangDrift Benchmark Results

Scenario: ./examples/scenarios/support-cancel-subscription.yaml
Domain: support
Model: claude-haiku-4-5-20251001 (anthropic)
Iterations: 10
Total locale checks: 120
Pass rate: 82/120 (68%)
Average run duration: 28271 ms

| Locale | Pass  | no_tool_call | wrong_tool | wrong_argument | missing_argument | forbidden_tool |
| ------ | ----- | ------------ | ---------- | -------------- | ---------------- | -------------- |
| en     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| fr     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| ar     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| zh     | 9/10  | 1            | 0          | 0              | 0                | 0              |
| ru     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| id     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| vi     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| sw     | 1/10  | 9            | 0          | 0              | 0                | 0              |
| cy     | 6/10  | 4            | 0          | 0              | 0                | 0              |
| eu     | 4/10  | 6            | 0          | 0              | 0                | 0              |
| mn     | 2/10  | 8            | 0          | 0              | 0                | 0              |
| yo     | 0/10  | 10           | 0          | 0              | 0                | 0              |

## Runs

### Iteration 1

Duration: 27442 ms / Exit: 1

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_subscription
fr      1/1     -             cancel_subscription
ar      1/1     -             cancel_subscription
zh      0/1     no_tool_call  expected cancel_subscription, got no tool calls
ru      1/1     -             cancel_subscription
id      1/1     -             cancel_subscription
vi      1/1     -             cancel_subscription
sw      0/1     no_tool_call  expected cancel_subscription, got no tool calls
cy      1/1     -             cancel_subscription
eu      0/1     no_tool_call  expected cancel_subscription, got no tool calls
mn      1/1     -             cancel_subscription
yo      0/1     no_tool_call  expected cancel_subscription, got no tool calls

Result: failed, 4 of 12 locales failed
```

### Iteration 2

Duration: 30417 ms / Exit: 1

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_subscription
fr      1/1     -             cancel_subscription
ar      1/1     -             cancel_subscription
zh      1/1     -             cancel_subscription
ru      1/1     -             cancel_subscription
id      1/1     -             cancel_subscription
vi      1/1     -             cancel_subscription
sw      0/1     no_tool_call  expected cancel_subscription, got no tool calls
cy      1/1     -             cancel_subscription
eu      0/1     no_tool_call  expected cancel_subscription, got no tool calls
mn      0/1     no_tool_call  expected cancel_subscription, got no tool calls
yo      0/1     no_tool_call  expected cancel_subscription, got no tool calls

Result: failed, 4 of 12 locales failed
```

### Iteration 3

Duration: 29692 ms / Exit: 1

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_subscription
fr      1/1     -             cancel_subscription
ar      1/1     -             cancel_subscription
zh      1/1     -             cancel_subscription
ru      1/1     -             cancel_subscription
id      1/1     -             cancel_subscription
vi      1/1     -             cancel_subscription
sw      0/1     no_tool_call  expected cancel_subscription, got no tool calls
cy      0/1     no_tool_call  expected cancel_subscription, got no tool calls
eu      0/1     no_tool_call  expected cancel_subscription, got no tool calls
mn      0/1     no_tool_call  expected cancel_subscription, got no tool calls
yo      0/1     no_tool_call  expected cancel_subscription, got no tool calls

Result: failed, 5 of 12 locales failed
```

### Iteration 4

Duration: 29257 ms / Exit: 1

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_subscription
fr      1/1     -             cancel_subscription
ar      1/1     -             cancel_subscription
zh      1/1     -             cancel_subscription
ru      1/1     -             cancel_subscription
id      1/1     -             cancel_subscription
vi      1/1     -             cancel_subscription
sw      0/1     no_tool_call  expected cancel_subscription, got no tool calls
cy      0/1     no_tool_call  expected cancel_subscription, got no tool calls
eu      0/1     no_tool_call  expected cancel_subscription, got no tool calls
mn      0/1     no_tool_call  expected cancel_subscription, got no tool calls
yo      0/1     no_tool_call  expected cancel_subscription, got no tool calls

Result: failed, 5 of 12 locales failed
```

### Iteration 5

Duration: 29933 ms / Exit: 1

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_subscription
fr      1/1     -             cancel_subscription
ar      1/1     -             cancel_subscription
zh      1/1     -             cancel_subscription
ru      1/1     -             cancel_subscription
id      1/1     -             cancel_subscription
vi      1/1     -             cancel_subscription
sw      0/1     no_tool_call  expected cancel_subscription, got no tool calls
cy      0/1     no_tool_call  expected cancel_subscription, got no tool calls
eu      0/1     no_tool_call  expected cancel_subscription, got no tool calls
mn      0/1     no_tool_call  expected cancel_subscription, got no tool calls
yo      0/1     no_tool_call  expected cancel_subscription, got no tool calls

Result: failed, 5 of 12 locales failed
```

### Iteration 6

Duration: 30267 ms / Exit: 1

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_subscription
fr      1/1     -             cancel_subscription
ar      1/1     -             cancel_subscription
zh      1/1     -             cancel_subscription
ru      1/1     -             cancel_subscription
id      1/1     -             cancel_subscription
vi      1/1     -             cancel_subscription
sw      0/1     no_tool_call  expected cancel_subscription, got no tool calls
cy      1/1     -             cancel_subscription
eu      1/1     -             cancel_subscription
mn      0/1     no_tool_call  expected cancel_subscription, got no tool calls
yo      0/1     no_tool_call  expected cancel_subscription, got no tool calls

Result: failed, 3 of 12 locales failed
```

### Iteration 7

Duration: 24103 ms / Exit: 1

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_subscription
fr      1/1     -             cancel_subscription
ar      1/1     -             cancel_subscription
zh      1/1     -             cancel_subscription
ru      1/1     -             cancel_subscription
id      1/1     -             cancel_subscription
vi      1/1     -             cancel_subscription
sw      1/1     -             cancel_subscription
cy      0/1     no_tool_call  expected cancel_subscription, got no tool calls
eu      0/1     no_tool_call  expected cancel_subscription, got no tool calls
mn      1/1     -             cancel_subscription
yo      0/1     no_tool_call  expected cancel_subscription, got no tool calls

Result: failed, 3 of 12 locales failed
```

### Iteration 8

Duration: 30752 ms / Exit: 1

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_subscription
fr      1/1     -             cancel_subscription
ar      1/1     -             cancel_subscription
zh      1/1     -             cancel_subscription
ru      1/1     -             cancel_subscription
id      1/1     -             cancel_subscription
vi      1/1     -             cancel_subscription
sw      0/1     no_tool_call  expected cancel_subscription, got no tool calls
cy      1/1     -             cancel_subscription
eu      1/1     -             cancel_subscription
mn      0/1     no_tool_call  expected cancel_subscription, got no tool calls
yo      0/1     no_tool_call  expected cancel_subscription, got no tool calls

Result: failed, 3 of 12 locales failed
```

### Iteration 9

Duration: 26039 ms / Exit: 1

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_subscription
fr      1/1     -             cancel_subscription
ar      1/1     -             cancel_subscription
zh      1/1     -             cancel_subscription
ru      1/1     -             cancel_subscription
id      1/1     -             cancel_subscription
vi      1/1     -             cancel_subscription
sw      0/1     no_tool_call  expected cancel_subscription, got no tool calls
cy      1/1     -             cancel_subscription
eu      1/1     -             cancel_subscription
mn      0/1     no_tool_call  expected cancel_subscription, got no tool calls
yo      0/1     no_tool_call  expected cancel_subscription, got no tool calls

Result: failed, 3 of 12 locales failed
```

### Iteration 10

Duration: 24807 ms / Exit: 1

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_subscription
fr      1/1     -             cancel_subscription
ar      1/1     -             cancel_subscription
zh      1/1     -             cancel_subscription
ru      1/1     -             cancel_subscription
id      1/1     -             cancel_subscription
vi      1/1     -             cancel_subscription
sw      0/1     no_tool_call  expected cancel_subscription, got no tool calls
cy      1/1     -             cancel_subscription
eu      1/1     -             cancel_subscription
mn      0/1     no_tool_call  expected cancel_subscription, got no tool calls
yo      0/1     no_tool_call  expected cancel_subscription, got no tool calls

Result: failed, 3 of 12 locales failed
```
