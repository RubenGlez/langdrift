# LangDrift Benchmark Results

Scenario: ./examples/scenarios/support-cancel-subscription.yaml
Domain: support
Model: deepseek-chat (deepseek)
Iterations: 10
Total locale checks: 120
Pass rate: 74/120 (62%)
Average run duration: 22854 ms

| Locale | Pass  | no_tool_call | wrong_tool | wrong_argument | missing_argument | forbidden_tool | wrong_sequence |
| ------ | ----- | ------------ | ---------- | -------------- | ---------------- | -------------- | -------------- |
| en     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| fr     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| ar     | 3/10  | 7            | 0          | 0              | 0                | 0              | 0              |
| zh     | 0/10  | 10           | 0          | 0              | 0                | 0              | 0              |
| ru     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| id     | 2/10  | 8            | 0          | 0              | 0                | 0              | 0              |
| vi     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| sw     | 1/10  | 9            | 0          | 0              | 0                | 0              | 0              |
| cy     | 9/10  | 1            | 0          | 0              | 0                | 0              | 0              |
| eu     | 0/10  | 10           | 0          | 0              | 0                | 0              | 0              |
| mn     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| yo     | 9/10  | 1            | 0          | 0              | 0                | 0              | 0              |

## Runs

### Iteration 1

Duration: 22454 ms / Exit: 1

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
id      0/1     no_tool_call  expected cancel_subscription, got no tool calls
vi      1/1     -             cancel_subscription
sw      0/1     no_tool_call  expected cancel_subscription, got no tool calls
cy      0/1     no_tool_call  expected cancel_subscription, got no tool calls
eu      0/1     no_tool_call  expected cancel_subscription, got no tool calls
mn      1/1     -             cancel_subscription
yo      1/1     -             cancel_subscription

Result: failed, 5 of 12 locales failed
```

### Iteration 2

Duration: 23540 ms / Exit: 1

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_subscription
fr      1/1     -             cancel_subscription
ar      0/1     no_tool_call  expected cancel_subscription, got no tool calls
zh      0/1     no_tool_call  expected cancel_subscription, got no tool calls
ru      1/1     -             cancel_subscription
id      0/1     no_tool_call  expected cancel_subscription, got no tool calls
vi      1/1     -             cancel_subscription
sw      0/1     no_tool_call  expected cancel_subscription, got no tool calls
cy      1/1     -             cancel_subscription
eu      0/1     no_tool_call  expected cancel_subscription, got no tool calls
mn      1/1     -             cancel_subscription
yo      1/1     -             cancel_subscription

Result: failed, 5 of 12 locales failed
```

### Iteration 3

Duration: 23454 ms / Exit: 1

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_subscription
fr      1/1     -             cancel_subscription
ar      0/1     no_tool_call  expected cancel_subscription, got no tool calls
zh      0/1     no_tool_call  expected cancel_subscription, got no tool calls
ru      1/1     -             cancel_subscription
id      0/1     no_tool_call  expected cancel_subscription, got no tool calls
vi      1/1     -             cancel_subscription
sw      0/1     no_tool_call  expected cancel_subscription, got no tool calls
cy      1/1     -             cancel_subscription
eu      0/1     no_tool_call  expected cancel_subscription, got no tool calls
mn      1/1     -             cancel_subscription
yo      1/1     -             cancel_subscription

Result: failed, 5 of 12 locales failed
```

### Iteration 4

Duration: 21817 ms / Exit: 1

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
id      0/1     no_tool_call  expected cancel_subscription, got no tool calls
vi      1/1     -             cancel_subscription
sw      0/1     no_tool_call  expected cancel_subscription, got no tool calls
cy      1/1     -             cancel_subscription
eu      0/1     no_tool_call  expected cancel_subscription, got no tool calls
mn      1/1     -             cancel_subscription
yo      1/1     -             cancel_subscription

Result: failed, 4 of 12 locales failed
```

### Iteration 5

Duration: 22726 ms / Exit: 1

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_subscription
fr      1/1     -             cancel_subscription
ar      0/1     no_tool_call  expected cancel_subscription, got no tool calls
zh      0/1     no_tool_call  expected cancel_subscription, got no tool calls
ru      1/1     -             cancel_subscription
id      1/1     -             cancel_subscription
vi      1/1     -             cancel_subscription
sw      1/1     -             cancel_subscription
cy      1/1     -             cancel_subscription
eu      0/1     no_tool_call  expected cancel_subscription, got no tool calls
mn      1/1     -             cancel_subscription
yo      1/1     -             cancel_subscription

Result: failed, 3 of 12 locales failed
```

### Iteration 6

Duration: 22634 ms / Exit: 1

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
id      0/1     no_tool_call  expected cancel_subscription, got no tool calls
vi      1/1     -             cancel_subscription
sw      0/1     no_tool_call  expected cancel_subscription, got no tool calls
cy      1/1     -             cancel_subscription
eu      0/1     no_tool_call  expected cancel_subscription, got no tool calls
mn      1/1     -             cancel_subscription
yo      1/1     -             cancel_subscription

Result: failed, 4 of 12 locales failed
```

### Iteration 7

Duration: 23727 ms / Exit: 1

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_subscription
fr      1/1     -             cancel_subscription
ar      0/1     no_tool_call  expected cancel_subscription, got no tool calls
zh      0/1     no_tool_call  expected cancel_subscription, got no tool calls
ru      1/1     -             cancel_subscription
id      0/1     no_tool_call  expected cancel_subscription, got no tool calls
vi      1/1     -             cancel_subscription
sw      0/1     no_tool_call  expected cancel_subscription, got no tool calls
cy      1/1     -             cancel_subscription
eu      0/1     no_tool_call  expected cancel_subscription, got no tool calls
mn      1/1     -             cancel_subscription
yo      1/1     -             cancel_subscription

Result: failed, 5 of 12 locales failed
```

### Iteration 8

Duration: 22964 ms / Exit: 1

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_subscription
fr      1/1     -             cancel_subscription
ar      0/1     no_tool_call  expected cancel_subscription, got no tool calls
zh      0/1     no_tool_call  expected cancel_subscription, got no tool calls
ru      1/1     -             cancel_subscription
id      0/1     no_tool_call  expected cancel_subscription, got no tool calls
vi      1/1     -             cancel_subscription
sw      0/1     no_tool_call  expected cancel_subscription, got no tool calls
cy      1/1     -             cancel_subscription
eu      0/1     no_tool_call  expected cancel_subscription, got no tool calls
mn      1/1     -             cancel_subscription
yo      1/1     -             cancel_subscription

Result: failed, 5 of 12 locales failed
```

### Iteration 9

Duration: 23347 ms / Exit: 1

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_subscription
fr      1/1     -             cancel_subscription
ar      0/1     no_tool_call  expected cancel_subscription, got no tool calls
zh      0/1     no_tool_call  expected cancel_subscription, got no tool calls
ru      1/1     -             cancel_subscription
id      0/1     no_tool_call  expected cancel_subscription, got no tool calls
vi      1/1     -             cancel_subscription
sw      0/1     no_tool_call  expected cancel_subscription, got no tool calls
cy      1/1     -             cancel_subscription
eu      0/1     no_tool_call  expected cancel_subscription, got no tool calls
mn      1/1     -             cancel_subscription
yo      1/1     -             cancel_subscription

Result: failed, 5 of 12 locales failed
```

### Iteration 10

Duration: 21881 ms / Exit: 1

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_subscription
fr      1/1     -             cancel_subscription
ar      0/1     no_tool_call  expected cancel_subscription, got no tool calls
zh      0/1     no_tool_call  expected cancel_subscription, got no tool calls
ru      1/1     -             cancel_subscription
id      1/1     -             cancel_subscription
vi      1/1     -             cancel_subscription
sw      0/1     no_tool_call  expected cancel_subscription, got no tool calls
cy      1/1     -             cancel_subscription
eu      0/1     no_tool_call  expected cancel_subscription, got no tool calls
mn      1/1     -             cancel_subscription
yo      0/1     no_tool_call  expected cancel_subscription, got no tool calls

Result: failed, 5 of 12 locales failed
```
