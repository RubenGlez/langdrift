# LangDrift Benchmark Results

Scenario: ./examples/scenarios/support-routing.yaml
Domain: support
Model: gpt-4o-mini (openai-compat)
Iterations: 10
Total locale checks: 120
Pass rate: 120/120 (100%)
Average run duration: 14107 ms

| Locale | Pass  | no_tool_call | wrong_tool | wrong_argument | missing_argument | forbidden_tool |
| ------ | ----- | ------------ | ---------- | -------------- | ---------------- | -------------- |
| en     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| fr     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| ar     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| sw     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| cy     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| eu     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| mn     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| yo     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| zh     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| ru     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| id     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| vi     | 10/10 | 0            | 0          | 0              | 0                | 0              |

## Runs

### Iteration 1

Duration: 15096 ms / Exit: 0

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        create_refund_ticket
fr      1/1     -        create_refund_ticket
ar      1/1     -        create_refund_ticket
sw      1/1     -        create_refund_ticket
cy      1/1     -        create_refund_ticket
eu      1/1     -        create_refund_ticket
mn      1/1     -        create_refund_ticket
yo      1/1     -        create_refund_ticket
zh      1/1     -        create_refund_ticket
ru      1/1     -        create_refund_ticket
id      1/1     -        create_refund_ticket
vi      1/1     -        create_refund_ticket

Result: passed, 0 of 12 locales failed
```

### Iteration 2

Duration: 11500 ms / Exit: 0

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        create_refund_ticket
fr      1/1     -        create_refund_ticket
ar      1/1     -        create_refund_ticket
sw      1/1     -        create_refund_ticket
cy      1/1     -        create_refund_ticket
eu      1/1     -        create_refund_ticket
mn      1/1     -        create_refund_ticket
yo      1/1     -        create_refund_ticket
zh      1/1     -        create_refund_ticket
ru      1/1     -        create_refund_ticket
id      1/1     -        create_refund_ticket
vi      1/1     -        create_refund_ticket

Result: passed, 0 of 12 locales failed
```

### Iteration 3

Duration: 12501 ms / Exit: 0

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        create_refund_ticket
fr      1/1     -        create_refund_ticket
ar      1/1     -        create_refund_ticket
sw      1/1     -        create_refund_ticket
cy      1/1     -        create_refund_ticket
eu      1/1     -        create_refund_ticket
mn      1/1     -        create_refund_ticket
yo      1/1     -        create_refund_ticket
zh      1/1     -        create_refund_ticket
ru      1/1     -        create_refund_ticket
id      1/1     -        create_refund_ticket
vi      1/1     -        create_refund_ticket

Result: passed, 0 of 12 locales failed
```

### Iteration 4

Duration: 11189 ms / Exit: 0

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        create_refund_ticket
fr      1/1     -        create_refund_ticket
ar      1/1     -        create_refund_ticket
sw      1/1     -        create_refund_ticket
cy      1/1     -        create_refund_ticket
eu      1/1     -        create_refund_ticket
mn      1/1     -        create_refund_ticket
yo      1/1     -        create_refund_ticket
zh      1/1     -        create_refund_ticket
ru      1/1     -        create_refund_ticket
id      1/1     -        create_refund_ticket
vi      1/1     -        create_refund_ticket

Result: passed, 0 of 12 locales failed
```

### Iteration 5

Duration: 13792 ms / Exit: 0

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        create_refund_ticket
fr      1/1     -        create_refund_ticket
ar      1/1     -        create_refund_ticket
sw      1/1     -        create_refund_ticket
cy      1/1     -        create_refund_ticket
eu      1/1     -        create_refund_ticket
mn      1/1     -        create_refund_ticket
yo      1/1     -        create_refund_ticket
zh      1/1     -        create_refund_ticket
ru      1/1     -        create_refund_ticket
id      1/1     -        create_refund_ticket
vi      1/1     -        create_refund_ticket

Result: passed, 0 of 12 locales failed
```

### Iteration 6

Duration: 11056 ms / Exit: 0

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        create_refund_ticket
fr      1/1     -        create_refund_ticket
ar      1/1     -        create_refund_ticket
sw      1/1     -        create_refund_ticket
cy      1/1     -        create_refund_ticket
eu      1/1     -        create_refund_ticket
mn      1/1     -        create_refund_ticket
yo      1/1     -        create_refund_ticket
zh      1/1     -        create_refund_ticket
ru      1/1     -        create_refund_ticket
id      1/1     -        create_refund_ticket
vi      1/1     -        create_refund_ticket

Result: passed, 0 of 12 locales failed
```

### Iteration 7

Duration: 12269 ms / Exit: 0

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        create_refund_ticket
fr      1/1     -        create_refund_ticket
ar      1/1     -        create_refund_ticket
sw      1/1     -        create_refund_ticket
cy      1/1     -        create_refund_ticket
eu      1/1     -        create_refund_ticket
mn      1/1     -        create_refund_ticket
yo      1/1     -        create_refund_ticket
zh      1/1     -        create_refund_ticket
ru      1/1     -        create_refund_ticket
id      1/1     -        create_refund_ticket
vi      1/1     -        create_refund_ticket

Result: passed, 0 of 12 locales failed
```

### Iteration 8

Duration: 30909 ms / Exit: 0

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        create_refund_ticket
fr      1/1     -        create_refund_ticket
ar      1/1     -        create_refund_ticket
sw      1/1     -        create_refund_ticket
cy      1/1     -        create_refund_ticket
eu      1/1     -        create_refund_ticket
mn      1/1     -        create_refund_ticket
yo      1/1     -        create_refund_ticket
zh      1/1     -        create_refund_ticket
ru      1/1     -        create_refund_ticket
id      1/1     -        create_refund_ticket
vi      1/1     -        create_refund_ticket

Result: passed, 0 of 12 locales failed
```

### Iteration 9

Duration: 11294 ms / Exit: 0

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        create_refund_ticket
fr      1/1     -        create_refund_ticket
ar      1/1     -        create_refund_ticket
sw      1/1     -        create_refund_ticket
cy      1/1     -        create_refund_ticket
eu      1/1     -        create_refund_ticket
mn      1/1     -        create_refund_ticket
yo      1/1     -        create_refund_ticket
zh      1/1     -        create_refund_ticket
ru      1/1     -        create_refund_ticket
id      1/1     -        create_refund_ticket
vi      1/1     -        create_refund_ticket

Result: passed, 0 of 12 locales failed
```

### Iteration 10

Duration: 11464 ms / Exit: 0

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        create_refund_ticket
fr      1/1     -        create_refund_ticket
ar      1/1     -        create_refund_ticket
sw      1/1     -        create_refund_ticket
cy      1/1     -        create_refund_ticket
eu      1/1     -        create_refund_ticket
mn      1/1     -        create_refund_ticket
yo      1/1     -        create_refund_ticket
zh      1/1     -        create_refund_ticket
ru      1/1     -        create_refund_ticket
id      1/1     -        create_refund_ticket
vi      1/1     -        create_refund_ticket

Result: passed, 0 of 12 locales failed
```
