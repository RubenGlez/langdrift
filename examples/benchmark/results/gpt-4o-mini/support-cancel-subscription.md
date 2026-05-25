# LangDrift Benchmark Results

Scenario: ./examples/scenarios/support-cancel-subscription.yaml
Domain: support
Model: gpt-4o-mini (openai-compat)
Iterations: 10
Total locale checks: 120
Pass rate: 120/120 (100%)
Average run duration: 11989 ms

| Locale | Pass  | no_tool_call | wrong_tool | wrong_argument | missing_argument | forbidden_tool |
| ------ | ----- | ------------ | ---------- | -------------- | ---------------- | -------------- |
| en     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| fr     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| ar     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| zh     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| ru     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| id     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| vi     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| sw     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| cy     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| eu     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| mn     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| yo     | 10/10 | 0            | 0          | 0              | 0                | 0              |

## Runs

### Iteration 1

Duration: 10701 ms / Exit: 0

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        cancel_subscription
fr      1/1     -        cancel_subscription
ar      1/1     -        cancel_subscription
zh      1/1     -        cancel_subscription
ru      1/1     -        cancel_subscription
id      1/1     -        cancel_subscription
vi      1/1     -        cancel_subscription
sw      1/1     -        cancel_subscription
cy      1/1     -        cancel_subscription
eu      1/1     -        cancel_subscription
mn      1/1     -        cancel_subscription
yo      1/1     -        cancel_subscription

Result: passed, 0 of 12 locales failed
```

### Iteration 2

Duration: 13351 ms / Exit: 0

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        cancel_subscription
fr      1/1     -        cancel_subscription
ar      1/1     -        cancel_subscription
zh      1/1     -        cancel_subscription
ru      1/1     -        cancel_subscription
id      1/1     -        cancel_subscription
vi      1/1     -        cancel_subscription
sw      1/1     -        cancel_subscription
cy      1/1     -        cancel_subscription
eu      1/1     -        cancel_subscription
mn      1/1     -        cancel_subscription
yo      1/1     -        cancel_subscription

Result: passed, 0 of 12 locales failed
```

### Iteration 3

Duration: 10758 ms / Exit: 0

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        cancel_subscription
fr      1/1     -        cancel_subscription
ar      1/1     -        cancel_subscription
zh      1/1     -        cancel_subscription
ru      1/1     -        cancel_subscription
id      1/1     -        cancel_subscription
vi      1/1     -        cancel_subscription
sw      1/1     -        cancel_subscription
cy      1/1     -        cancel_subscription
eu      1/1     -        cancel_subscription
mn      1/1     -        cancel_subscription
yo      1/1     -        cancel_subscription

Result: passed, 0 of 12 locales failed
```

### Iteration 4

Duration: 11017 ms / Exit: 0

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        cancel_subscription
fr      1/1     -        cancel_subscription
ar      1/1     -        cancel_subscription
zh      1/1     -        cancel_subscription
ru      1/1     -        cancel_subscription
id      1/1     -        cancel_subscription
vi      1/1     -        cancel_subscription
sw      1/1     -        cancel_subscription
cy      1/1     -        cancel_subscription
eu      1/1     -        cancel_subscription
mn      1/1     -        cancel_subscription
yo      1/1     -        cancel_subscription

Result: passed, 0 of 12 locales failed
```

### Iteration 5

Duration: 11977 ms / Exit: 0

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        cancel_subscription
fr      1/1     -        cancel_subscription
ar      1/1     -        cancel_subscription
zh      1/1     -        cancel_subscription
ru      1/1     -        cancel_subscription
id      1/1     -        cancel_subscription
vi      1/1     -        cancel_subscription
sw      1/1     -        cancel_subscription
cy      1/1     -        cancel_subscription
eu      1/1     -        cancel_subscription
mn      1/1     -        cancel_subscription
yo      1/1     -        cancel_subscription

Result: passed, 0 of 12 locales failed
```

### Iteration 6

Duration: 11672 ms / Exit: 0

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        cancel_subscription
fr      1/1     -        cancel_subscription
ar      1/1     -        cancel_subscription
zh      1/1     -        cancel_subscription
ru      1/1     -        cancel_subscription
id      1/1     -        cancel_subscription
vi      1/1     -        cancel_subscription
sw      1/1     -        cancel_subscription
cy      1/1     -        cancel_subscription
eu      1/1     -        cancel_subscription
mn      1/1     -        cancel_subscription
yo      1/1     -        cancel_subscription

Result: passed, 0 of 12 locales failed
```

### Iteration 7

Duration: 11571 ms / Exit: 0

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        cancel_subscription
fr      1/1     -        cancel_subscription
ar      1/1     -        cancel_subscription
zh      1/1     -        cancel_subscription
ru      1/1     -        cancel_subscription
id      1/1     -        cancel_subscription
vi      1/1     -        cancel_subscription
sw      1/1     -        cancel_subscription
cy      1/1     -        cancel_subscription
eu      1/1     -        cancel_subscription
mn      1/1     -        cancel_subscription
yo      1/1     -        cancel_subscription

Result: passed, 0 of 12 locales failed
```

### Iteration 8

Duration: 13970 ms / Exit: 0

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        cancel_subscription
fr      1/1     -        cancel_subscription
ar      1/1     -        cancel_subscription
zh      1/1     -        cancel_subscription
ru      1/1     -        cancel_subscription
id      1/1     -        cancel_subscription
vi      1/1     -        cancel_subscription
sw      1/1     -        cancel_subscription
cy      1/1     -        cancel_subscription
eu      1/1     -        cancel_subscription
mn      1/1     -        cancel_subscription
yo      1/1     -        cancel_subscription

Result: passed, 0 of 12 locales failed
```

### Iteration 9

Duration: 12679 ms / Exit: 0

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        cancel_subscription
fr      1/1     -        cancel_subscription
ar      1/1     -        cancel_subscription
zh      1/1     -        cancel_subscription
ru      1/1     -        cancel_subscription
id      1/1     -        cancel_subscription
vi      1/1     -        cancel_subscription
sw      1/1     -        cancel_subscription
cy      1/1     -        cancel_subscription
eu      1/1     -        cancel_subscription
mn      1/1     -        cancel_subscription
yo      1/1     -        cancel_subscription

Result: passed, 0 of 12 locales failed
```

### Iteration 10

Duration: 12189 ms / Exit: 0

```
LangDrift run

Scenario: support_cancel_subscription
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        cancel_subscription
fr      1/1     -        cancel_subscription
ar      1/1     -        cancel_subscription
zh      1/1     -        cancel_subscription
ru      1/1     -        cancel_subscription
id      1/1     -        cancel_subscription
vi      1/1     -        cancel_subscription
sw      1/1     -        cancel_subscription
cy      1/1     -        cancel_subscription
eu      1/1     -        cancel_subscription
mn      1/1     -        cancel_subscription
yo      1/1     -        cancel_subscription

Result: passed, 0 of 12 locales failed
```
