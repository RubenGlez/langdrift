# LangDrift Benchmark Results

Scenario: ./examples/scenarios/ecommerce-track-order.yaml
Domain: ecommerce
Model: gpt-4o-mini (openai-compat)
Iterations: 10
Total locale checks: 120
Pass rate: 120/120 (100%)
Average run duration: 17909 ms

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

Duration: 28721 ms / Exit: 0

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        check_order_status
fr      1/1     -        check_order_status
ar      1/1     -        check_order_status
zh      1/1     -        check_order_status
ru      1/1     -        check_order_status
id      1/1     -        check_order_status
vi      1/1     -        check_order_status
sw      1/1     -        check_order_status
cy      1/1     -        check_order_status
eu      1/1     -        check_order_status
mn      1/1     -        check_order_status
yo      1/1     -        check_order_status

Result: passed, 0 of 12 locales failed
```

### Iteration 2

Duration: 20165 ms / Exit: 0

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        check_order_status
fr      1/1     -        check_order_status
ar      1/1     -        check_order_status
zh      1/1     -        check_order_status
ru      1/1     -        check_order_status
id      1/1     -        check_order_status
vi      1/1     -        check_order_status
sw      1/1     -        check_order_status
cy      1/1     -        check_order_status
eu      1/1     -        check_order_status
mn      1/1     -        check_order_status
yo      1/1     -        check_order_status

Result: passed, 0 of 12 locales failed
```

### Iteration 3

Duration: 14643 ms / Exit: 0

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        check_order_status
fr      1/1     -        check_order_status
ar      1/1     -        check_order_status
zh      1/1     -        check_order_status
ru      1/1     -        check_order_status
id      1/1     -        check_order_status
vi      1/1     -        check_order_status
sw      1/1     -        check_order_status
cy      1/1     -        check_order_status
eu      1/1     -        check_order_status
mn      1/1     -        check_order_status
yo      1/1     -        check_order_status

Result: passed, 0 of 12 locales failed
```

### Iteration 4

Duration: 16730 ms / Exit: 0

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        check_order_status
fr      1/1     -        check_order_status
ar      1/1     -        check_order_status
zh      1/1     -        check_order_status
ru      1/1     -        check_order_status
id      1/1     -        check_order_status
vi      1/1     -        check_order_status
sw      1/1     -        check_order_status
cy      1/1     -        check_order_status
eu      1/1     -        check_order_status
mn      1/1     -        check_order_status
yo      1/1     -        check_order_status

Result: passed, 0 of 12 locales failed
```

### Iteration 5

Duration: 21272 ms / Exit: 0

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        check_order_status
fr      1/1     -        check_order_status
ar      1/1     -        check_order_status
zh      1/1     -        check_order_status
ru      1/1     -        check_order_status
id      1/1     -        check_order_status
vi      1/1     -        check_order_status
sw      1/1     -        check_order_status
cy      1/1     -        check_order_status
eu      1/1     -        check_order_status
mn      1/1     -        check_order_status
yo      1/1     -        check_order_status

Result: passed, 0 of 12 locales failed
```

### Iteration 6

Duration: 16065 ms / Exit: 0

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        check_order_status
fr      1/1     -        check_order_status
ar      1/1     -        check_order_status
zh      1/1     -        check_order_status
ru      1/1     -        check_order_status
id      1/1     -        check_order_status
vi      1/1     -        check_order_status
sw      1/1     -        check_order_status
cy      1/1     -        check_order_status
eu      1/1     -        check_order_status
mn      1/1     -        check_order_status
yo      1/1     -        check_order_status

Result: passed, 0 of 12 locales failed
```

### Iteration 7

Duration: 14488 ms / Exit: 0

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        check_order_status
fr      1/1     -        check_order_status
ar      1/1     -        check_order_status
zh      1/1     -        check_order_status
ru      1/1     -        check_order_status
id      1/1     -        check_order_status
vi      1/1     -        check_order_status
sw      1/1     -        check_order_status
cy      1/1     -        check_order_status
eu      1/1     -        check_order_status
mn      1/1     -        check_order_status
yo      1/1     -        check_order_status

Result: passed, 0 of 12 locales failed
```

### Iteration 8

Duration: 14591 ms / Exit: 0

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        check_order_status
fr      1/1     -        check_order_status
ar      1/1     -        check_order_status
zh      1/1     -        check_order_status
ru      1/1     -        check_order_status
id      1/1     -        check_order_status
vi      1/1     -        check_order_status
sw      1/1     -        check_order_status
cy      1/1     -        check_order_status
eu      1/1     -        check_order_status
mn      1/1     -        check_order_status
yo      1/1     -        check_order_status

Result: passed, 0 of 12 locales failed
```

### Iteration 9

Duration: 15091 ms / Exit: 0

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        check_order_status
fr      1/1     -        check_order_status
ar      1/1     -        check_order_status
zh      1/1     -        check_order_status
ru      1/1     -        check_order_status
id      1/1     -        check_order_status
vi      1/1     -        check_order_status
sw      1/1     -        check_order_status
cy      1/1     -        check_order_status
eu      1/1     -        check_order_status
mn      1/1     -        check_order_status
yo      1/1     -        check_order_status

Result: passed, 0 of 12 locales failed
```

### Iteration 10

Duration: 17323 ms / Exit: 0

```
LangDrift run

Scenario: ecommerce_track_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        check_order_status
fr      1/1     -        check_order_status
ar      1/1     -        check_order_status
zh      1/1     -        check_order_status
ru      1/1     -        check_order_status
id      1/1     -        check_order_status
vi      1/1     -        check_order_status
sw      1/1     -        check_order_status
cy      1/1     -        check_order_status
eu      1/1     -        check_order_status
mn      1/1     -        check_order_status
yo      1/1     -        check_order_status

Result: passed, 0 of 12 locales failed
```
