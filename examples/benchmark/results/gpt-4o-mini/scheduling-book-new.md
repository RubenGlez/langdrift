# LangDrift Benchmark Results

Scenario: ./examples/scenarios/scheduling-book-new.yaml
Domain: scheduling
Model: gpt-4o-mini (openai-compat)
Iterations: 10
Total locale checks: 120
Pass rate: 0/120 (0%)
Average run duration: 15499 ms

| Locale | Pass | no_tool_call | wrong_tool | wrong_argument | missing_argument | forbidden_tool |
| ------ | ---- | ------------ | ---------- | -------------- | ---------------- | -------------- |
| en     | 0/10 | 0            | 10         | 0              | 0                | 0              |
| fr     | 0/10 | 0            | 10         | 0              | 0                | 0              |
| ar     | 0/10 | 0            | 10         | 0              | 0                | 0              |
| zh     | 0/10 | 0            | 10         | 0              | 0                | 0              |
| ru     | 0/10 | 0            | 10         | 0              | 0                | 0              |
| id     | 0/10 | 0            | 10         | 0              | 0                | 0              |
| vi     | 0/10 | 0            | 10         | 0              | 0                | 0              |
| sw     | 0/10 | 0            | 10         | 0              | 0                | 0              |
| cy     | 0/10 | 5            | 5          | 0              | 0                | 0              |
| eu     | 0/10 | 0            | 10         | 0              | 0                | 0              |
| mn     | 0/10 | 0            | 10         | 0              | 0                | 0              |
| yo     | 0/10 | 0            | 10         | 0              | 0                | 0              |

## Runs

### Iteration 1

Duration: 17969 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure     Detail
en      0/1     wrong_tool  expected check_availability, got book_new_appointment
fr      0/1     wrong_tool  expected check_availability, got book_new_appointment
ar      0/1     wrong_tool  expected check_availability, got book_new_appointment
zh      0/1     wrong_tool  expected check_availability, got book_new_appointment
ru      0/1     wrong_tool  expected check_availability, got book_new_appointment
id      0/1     wrong_tool  expected check_availability, got book_new_appointment
vi      0/1     wrong_tool  expected check_availability, got book_new_appointment
sw      0/1     wrong_tool  expected check_availability, got book_new_appointment
cy      0/1     wrong_tool  expected check_availability, got book_new_appointment
eu      0/1     wrong_tool  expected check_availability, got book_new_appointment
mn      0/1     wrong_tool  expected check_availability, got book_new_appointment
yo      0/1     wrong_tool  expected check_availability, got book_new_appointment

Result: failed, 12 of 12 locales failed
```

### Iteration 2

Duration: 18691 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      0/1     wrong_tool    expected check_availability, got book_new_appointment
fr      0/1     wrong_tool    expected check_availability, got book_new_appointment
ar      0/1     wrong_tool    expected check_availability, got book_new_appointment
zh      0/1     wrong_tool    expected check_availability, got book_new_appointment
ru      0/1     wrong_tool    expected check_availability, got book_new_appointment
id      0/1     wrong_tool    expected check_availability, got book_new_appointment
vi      0/1     wrong_tool    expected check_availability, got book_new_appointment
sw      0/1     wrong_tool    expected check_availability, got book_new_appointment
cy      0/1     no_tool_call  expected check_availability, got no tool calls
eu      0/1     wrong_tool    expected check_availability, got book_new_appointment
mn      0/1     wrong_tool    expected check_availability, got book_new_appointment
yo      0/1     wrong_tool    expected check_availability, got book_new_appointment

Result: failed, 12 of 12 locales failed
```

### Iteration 3

Duration: 14998 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      0/1     wrong_tool    expected check_availability, got book_new_appointment
fr      0/1     wrong_tool    expected check_availability, got book_new_appointment
ar      0/1     wrong_tool    expected check_availability, got book_new_appointment
zh      0/1     wrong_tool    expected check_availability, got book_new_appointment
ru      0/1     wrong_tool    expected check_availability, got book_new_appointment
id      0/1     wrong_tool    expected check_availability, got book_new_appointment
vi      0/1     wrong_tool    expected check_availability, got book_new_appointment
sw      0/1     wrong_tool    expected check_availability, got book_new_appointment
cy      0/1     no_tool_call  expected check_availability, got no tool calls
eu      0/1     wrong_tool    expected check_availability, got book_new_appointment
mn      0/1     wrong_tool    expected check_availability, got book_new_appointment
yo      0/1     wrong_tool    expected check_availability, got book_new_appointment

Result: failed, 12 of 12 locales failed
```

### Iteration 4

Duration: 22829 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      0/1     wrong_tool    expected check_availability, got book_new_appointment
fr      0/1     wrong_tool    expected check_availability, got book_new_appointment
ar      0/1     wrong_tool    expected check_availability, got book_new_appointment
zh      0/1     wrong_tool    expected check_availability, got book_new_appointment
ru      0/1     wrong_tool    expected check_availability, got book_new_appointment
id      0/1     wrong_tool    expected check_availability, got book_new_appointment
vi      0/1     wrong_tool    expected check_availability, got book_new_appointment
sw      0/1     wrong_tool    expected check_availability, got book_new_appointment
cy      0/1     no_tool_call  expected check_availability, got no tool calls
eu      0/1     wrong_tool    expected check_availability, got book_new_appointment
mn      0/1     wrong_tool    expected check_availability, got book_new_appointment
yo      0/1     wrong_tool    expected check_availability, got book_new_appointment

Result: failed, 12 of 12 locales failed
```

### Iteration 5

Duration: 14393 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      0/1     wrong_tool    expected check_availability, got book_new_appointment
fr      0/1     wrong_tool    expected check_availability, got book_new_appointment
ar      0/1     wrong_tool    expected check_availability, got book_new_appointment
zh      0/1     wrong_tool    expected check_availability, got book_new_appointment
ru      0/1     wrong_tool    expected check_availability, got book_new_appointment
id      0/1     wrong_tool    expected check_availability, got book_new_appointment
vi      0/1     wrong_tool    expected check_availability, got book_new_appointment
sw      0/1     wrong_tool    expected check_availability, got book_new_appointment
cy      0/1     no_tool_call  expected check_availability, got no tool calls
eu      0/1     wrong_tool    expected check_availability, got book_new_appointment
mn      0/1     wrong_tool    expected check_availability, got book_new_appointment
yo      0/1     wrong_tool    expected check_availability, got book_new_appointment

Result: failed, 12 of 12 locales failed
```

### Iteration 6

Duration: 14182 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure     Detail
en      0/1     wrong_tool  expected check_availability, got book_new_appointment
fr      0/1     wrong_tool  expected check_availability, got book_new_appointment
ar      0/1     wrong_tool  expected check_availability, got book_new_appointment
zh      0/1     wrong_tool  expected check_availability, got book_new_appointment
ru      0/1     wrong_tool  expected check_availability, got book_new_appointment
id      0/1     wrong_tool  expected check_availability, got book_new_appointment
vi      0/1     wrong_tool  expected check_availability, got book_new_appointment
sw      0/1     wrong_tool  expected check_availability, got book_new_appointment
cy      0/1     wrong_tool  expected check_availability, got book_new_appointment
eu      0/1     wrong_tool  expected check_availability, got book_new_appointment
mn      0/1     wrong_tool  expected check_availability, got book_new_appointment
yo      0/1     wrong_tool  expected check_availability, got book_new_appointment

Result: failed, 12 of 12 locales failed
```

### Iteration 7

Duration: 11158 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure     Detail
en      0/1     wrong_tool  expected check_availability, got book_new_appointment
fr      0/1     wrong_tool  expected check_availability, got book_new_appointment
ar      0/1     wrong_tool  expected check_availability, got book_new_appointment
zh      0/1     wrong_tool  expected check_availability, got book_new_appointment
ru      0/1     wrong_tool  expected check_availability, got book_new_appointment
id      0/1     wrong_tool  expected check_availability, got book_new_appointment
vi      0/1     wrong_tool  expected check_availability, got book_new_appointment
sw      0/1     wrong_tool  expected check_availability, got book_new_appointment
cy      0/1     wrong_tool  expected check_availability, got book_new_appointment
eu      0/1     wrong_tool  expected check_availability, got book_new_appointment
mn      0/1     wrong_tool  expected check_availability, got book_new_appointment
yo      0/1     wrong_tool  expected check_availability, got book_new_appointment

Result: failed, 12 of 12 locales failed
```

### Iteration 8

Duration: 14385 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure     Detail
en      0/1     wrong_tool  expected check_availability, got book_new_appointment
fr      0/1     wrong_tool  expected check_availability, got book_new_appointment
ar      0/1     wrong_tool  expected check_availability, got book_new_appointment
zh      0/1     wrong_tool  expected check_availability, got book_new_appointment
ru      0/1     wrong_tool  expected check_availability, got book_new_appointment
id      0/1     wrong_tool  expected check_availability, got book_new_appointment
vi      0/1     wrong_tool  expected check_availability, got book_new_appointment
sw      0/1     wrong_tool  expected check_availability, got book_new_appointment
cy      0/1     wrong_tool  expected check_availability, got book_new_appointment
eu      0/1     wrong_tool  expected check_availability, got book_new_appointment
mn      0/1     wrong_tool  expected check_availability, got book_new_appointment
yo      0/1     wrong_tool  expected check_availability, got book_new_appointment

Result: failed, 12 of 12 locales failed
```

### Iteration 9

Duration: 13702 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure     Detail
en      0/1     wrong_tool  expected check_availability, got book_new_appointment
fr      0/1     wrong_tool  expected check_availability, got book_new_appointment
ar      0/1     wrong_tool  expected check_availability, got book_new_appointment
zh      0/1     wrong_tool  expected check_availability, got book_new_appointment
ru      0/1     wrong_tool  expected check_availability, got book_new_appointment
id      0/1     wrong_tool  expected check_availability, got book_new_appointment
vi      0/1     wrong_tool  expected check_availability, got book_new_appointment
sw      0/1     wrong_tool  expected check_availability, got book_new_appointment
cy      0/1     wrong_tool  expected check_availability, got book_new_appointment
eu      0/1     wrong_tool  expected check_availability, got book_new_appointment
mn      0/1     wrong_tool  expected check_availability, got book_new_appointment
yo      0/1     wrong_tool  expected check_availability, got book_new_appointment

Result: failed, 12 of 12 locales failed
```

### Iteration 10

Duration: 12683 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      0/1     wrong_tool    expected check_availability, got book_new_appointment
fr      0/1     wrong_tool    expected check_availability, got book_new_appointment
ar      0/1     wrong_tool    expected check_availability, got book_new_appointment
zh      0/1     wrong_tool    expected check_availability, got book_new_appointment
ru      0/1     wrong_tool    expected check_availability, got book_new_appointment
id      0/1     wrong_tool    expected check_availability, got book_new_appointment
vi      0/1     wrong_tool    expected check_availability, got book_new_appointment
sw      0/1     wrong_tool    expected check_availability, got book_new_appointment
cy      0/1     no_tool_call  expected check_availability, got no tool calls
eu      0/1     wrong_tool    expected check_availability, got book_new_appointment
mn      0/1     wrong_tool    expected check_availability, got book_new_appointment
yo      0/1     wrong_tool    expected check_availability, got book_new_appointment

Result: failed, 12 of 12 locales failed
```
