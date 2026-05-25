# LangDrift Benchmark Results

Scenario: ./examples/scenarios/ecommerce-cancel-order.yaml
Domain: ecommerce
Model: gpt-4o-mini (openai-compat)
Iterations: 10
Total locale checks: 120
Pass rate: 110/120 (92%)
Average run duration: 14181 ms

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
| eu     | 0/10  | 0            | 0          | 10             | 0                | 0              |
| mn     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| yo     | 10/10 | 0            | 0          | 0              | 0                | 0              |

## Runs

### Iteration 1

Duration: 15845 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure         Detail
en      1/1     -               cancel_order
fr      1/1     -               cancel_order
ar      1/1     -               cancel_order
zh      1/1     -               cancel_order
ru      1/1     -               cancel_order
id      1/1     -               cancel_order
vi      1/1     -               cancel_order
sw      1/1     -               cancel_order
cy      1/1     -               cancel_order
eu      0/1     wrong_argument  expected argument reason=ordered_by_mistake, got other
mn      1/1     -               cancel_order
yo      1/1     -               cancel_order

Result: failed, 1 of 12 locales failed
```

### Iteration 2

Duration: 14182 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure         Detail
en      1/1     -               cancel_order
fr      1/1     -               cancel_order
ar      1/1     -               cancel_order
zh      1/1     -               cancel_order
ru      1/1     -               cancel_order
id      1/1     -               cancel_order
vi      1/1     -               cancel_order
sw      1/1     -               cancel_order
cy      1/1     -               cancel_order
eu      0/1     wrong_argument  expected argument reason=ordered_by_mistake, got other
mn      1/1     -               cancel_order
yo      1/1     -               cancel_order

Result: failed, 1 of 12 locales failed
```

### Iteration 3

Duration: 14918 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure         Detail
en      1/1     -               cancel_order
fr      1/1     -               cancel_order
ar      1/1     -               cancel_order
zh      1/1     -               cancel_order
ru      1/1     -               cancel_order
id      1/1     -               cancel_order
vi      1/1     -               cancel_order
sw      1/1     -               cancel_order
cy      1/1     -               cancel_order
eu      0/1     wrong_argument  expected argument reason=ordered_by_mistake, got other
mn      1/1     -               cancel_order
yo      1/1     -               cancel_order

Result: failed, 1 of 12 locales failed
```

### Iteration 4

Duration: 13457 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure         Detail
en      1/1     -               cancel_order
fr      1/1     -               cancel_order
ar      1/1     -               cancel_order
zh      1/1     -               cancel_order
ru      1/1     -               cancel_order
id      1/1     -               cancel_order
vi      1/1     -               cancel_order
sw      1/1     -               cancel_order
cy      1/1     -               cancel_order
eu      0/1     wrong_argument  expected argument reason=ordered_by_mistake, got other
mn      1/1     -               cancel_order
yo      1/1     -               cancel_order

Result: failed, 1 of 12 locales failed
```

### Iteration 5

Duration: 11839 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure         Detail
en      1/1     -               cancel_order
fr      1/1     -               cancel_order
ar      1/1     -               cancel_order
zh      1/1     -               cancel_order
ru      1/1     -               cancel_order
id      1/1     -               cancel_order
vi      1/1     -               cancel_order
sw      1/1     -               cancel_order
cy      1/1     -               cancel_order
eu      0/1     wrong_argument  expected argument reason=ordered_by_mistake, got other
mn      1/1     -               cancel_order
yo      1/1     -               cancel_order

Result: failed, 1 of 12 locales failed
```

### Iteration 6

Duration: 12693 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure         Detail
en      1/1     -               cancel_order
fr      1/1     -               cancel_order
ar      1/1     -               cancel_order
zh      1/1     -               cancel_order
ru      1/1     -               cancel_order
id      1/1     -               cancel_order
vi      1/1     -               cancel_order
sw      1/1     -               cancel_order
cy      1/1     -               cancel_order
eu      0/1     wrong_argument  expected argument reason=ordered_by_mistake, got other
mn      1/1     -               cancel_order
yo      1/1     -               cancel_order

Result: failed, 1 of 12 locales failed
```

### Iteration 7

Duration: 11411 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure         Detail
en      1/1     -               cancel_order
fr      1/1     -               cancel_order
ar      1/1     -               cancel_order
zh      1/1     -               cancel_order
ru      1/1     -               cancel_order
id      1/1     -               cancel_order
vi      1/1     -               cancel_order
sw      1/1     -               cancel_order
cy      1/1     -               cancel_order
eu      0/1     wrong_argument  expected argument reason=ordered_by_mistake, got other
mn      1/1     -               cancel_order
yo      1/1     -               cancel_order

Result: failed, 1 of 12 locales failed
```

### Iteration 8

Duration: 17671 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure         Detail
en      1/1     -               cancel_order
fr      1/1     -               cancel_order
ar      1/1     -               cancel_order
zh      1/1     -               cancel_order
ru      1/1     -               cancel_order
id      1/1     -               cancel_order
vi      1/1     -               cancel_order
sw      1/1     -               cancel_order
cy      1/1     -               cancel_order
eu      0/1     wrong_argument  expected argument reason=ordered_by_mistake, got other
mn      1/1     -               cancel_order
yo      1/1     -               cancel_order

Result: failed, 1 of 12 locales failed
```

### Iteration 9

Duration: 16957 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure         Detail
en      1/1     -               cancel_order
fr      1/1     -               cancel_order
ar      1/1     -               cancel_order
zh      1/1     -               cancel_order
ru      1/1     -               cancel_order
id      1/1     -               cancel_order
vi      1/1     -               cancel_order
sw      1/1     -               cancel_order
cy      1/1     -               cancel_order
eu      0/1     wrong_argument  expected argument reason=ordered_by_mistake, got other
mn      1/1     -               cancel_order
yo      1/1     -               cancel_order

Result: failed, 1 of 12 locales failed
```

### Iteration 10

Duration: 12837 ms / Exit: 1

```
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure         Detail
en      1/1     -               cancel_order
fr      1/1     -               cancel_order
ar      1/1     -               cancel_order
zh      1/1     -               cancel_order
ru      1/1     -               cancel_order
id      1/1     -               cancel_order
vi      1/1     -               cancel_order
sw      1/1     -               cancel_order
cy      1/1     -               cancel_order
eu      0/1     wrong_argument  expected argument reason=ordered_by_mistake, got other
mn      1/1     -               cancel_order
yo      1/1     -               cancel_order

Result: failed, 1 of 12 locales failed
```
