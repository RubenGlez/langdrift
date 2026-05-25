# LangDrift Benchmark Results

Scenario: ./examples/scenarios/scheduling-reschedule.yaml
Domain: scheduling
Model: gpt-4o-mini (openai-compat)
Iterations: 10
Total locale checks: 120
Pass rate: 110/120 (92%)
Average run duration: 18817 ms

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
| eu     | 0/10  | 10           | 0          | 0              | 0                | 0              |
| mn     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| yo     | 10/10 | 0            | 0          | 0              | 0                | 0              |

## Runs

### Iteration 1

Duration: 19104 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             reschedule_appointment
fr      1/1     -             reschedule_appointment
ar      1/1     -             reschedule_appointment
zh      1/1     -             reschedule_appointment
ru      1/1     -             reschedule_appointment
id      1/1     -             reschedule_appointment
vi      1/1     -             reschedule_appointment
sw      1/1     -             reschedule_appointment
cy      1/1     -             reschedule_appointment
eu      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
mn      1/1     -             reschedule_appointment
yo      1/1     -             reschedule_appointment

Result: failed, 1 of 12 locales failed
```

### Iteration 2

Duration: 19235 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             reschedule_appointment
fr      1/1     -             reschedule_appointment
ar      1/1     -             reschedule_appointment
zh      1/1     -             reschedule_appointment
ru      1/1     -             reschedule_appointment
id      1/1     -             reschedule_appointment
vi      1/1     -             reschedule_appointment
sw      1/1     -             reschedule_appointment
cy      1/1     -             reschedule_appointment
eu      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
mn      1/1     -             reschedule_appointment
yo      1/1     -             reschedule_appointment

Result: failed, 1 of 12 locales failed
```

### Iteration 3

Duration: 18533 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             reschedule_appointment
fr      1/1     -             reschedule_appointment
ar      1/1     -             reschedule_appointment
zh      1/1     -             reschedule_appointment
ru      1/1     -             reschedule_appointment
id      1/1     -             reschedule_appointment
vi      1/1     -             reschedule_appointment
sw      1/1     -             reschedule_appointment
cy      1/1     -             reschedule_appointment
eu      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
mn      1/1     -             reschedule_appointment
yo      1/1     -             reschedule_appointment

Result: failed, 1 of 12 locales failed
```

### Iteration 4

Duration: 18279 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             reschedule_appointment
fr      1/1     -             reschedule_appointment
ar      1/1     -             reschedule_appointment
zh      1/1     -             reschedule_appointment
ru      1/1     -             reschedule_appointment
id      1/1     -             reschedule_appointment
vi      1/1     -             reschedule_appointment
sw      1/1     -             reschedule_appointment
cy      1/1     -             reschedule_appointment
eu      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
mn      1/1     -             reschedule_appointment
yo      1/1     -             reschedule_appointment

Result: failed, 1 of 12 locales failed
```

### Iteration 5

Duration: 18546 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             reschedule_appointment
fr      1/1     -             reschedule_appointment
ar      1/1     -             reschedule_appointment
zh      1/1     -             reschedule_appointment
ru      1/1     -             reschedule_appointment
id      1/1     -             reschedule_appointment
vi      1/1     -             reschedule_appointment
sw      1/1     -             reschedule_appointment
cy      1/1     -             reschedule_appointment
eu      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
mn      1/1     -             reschedule_appointment
yo      1/1     -             reschedule_appointment

Result: failed, 1 of 12 locales failed
```

### Iteration 6

Duration: 18725 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             reschedule_appointment
fr      1/1     -             reschedule_appointment
ar      1/1     -             reschedule_appointment
zh      1/1     -             reschedule_appointment
ru      1/1     -             reschedule_appointment
id      1/1     -             reschedule_appointment
vi      1/1     -             reschedule_appointment
sw      1/1     -             reschedule_appointment
cy      1/1     -             reschedule_appointment
eu      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
mn      1/1     -             reschedule_appointment
yo      1/1     -             reschedule_appointment

Result: failed, 1 of 12 locales failed
```

### Iteration 7

Duration: 22448 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             reschedule_appointment
fr      1/1     -             reschedule_appointment
ar      1/1     -             reschedule_appointment
zh      1/1     -             reschedule_appointment
ru      1/1     -             reschedule_appointment
id      1/1     -             reschedule_appointment
vi      1/1     -             reschedule_appointment
sw      1/1     -             reschedule_appointment
cy      1/1     -             reschedule_appointment
eu      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
mn      1/1     -             reschedule_appointment
yo      1/1     -             reschedule_appointment

Result: failed, 1 of 12 locales failed
```

### Iteration 8

Duration: 18105 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             reschedule_appointment
fr      1/1     -             reschedule_appointment
ar      1/1     -             reschedule_appointment
zh      1/1     -             reschedule_appointment
ru      1/1     -             reschedule_appointment
id      1/1     -             reschedule_appointment
vi      1/1     -             reschedule_appointment
sw      1/1     -             reschedule_appointment
cy      1/1     -             reschedule_appointment
eu      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
mn      1/1     -             reschedule_appointment
yo      1/1     -             reschedule_appointment

Result: failed, 1 of 12 locales failed
```

### Iteration 9

Duration: 18086 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             reschedule_appointment
fr      1/1     -             reschedule_appointment
ar      1/1     -             reschedule_appointment
zh      1/1     -             reschedule_appointment
ru      1/1     -             reschedule_appointment
id      1/1     -             reschedule_appointment
vi      1/1     -             reschedule_appointment
sw      1/1     -             reschedule_appointment
cy      1/1     -             reschedule_appointment
eu      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
mn      1/1     -             reschedule_appointment
yo      1/1     -             reschedule_appointment

Result: failed, 1 of 12 locales failed
```

### Iteration 10

Duration: 17110 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             reschedule_appointment
fr      1/1     -             reschedule_appointment
ar      1/1     -             reschedule_appointment
zh      1/1     -             reschedule_appointment
ru      1/1     -             reschedule_appointment
id      1/1     -             reschedule_appointment
vi      1/1     -             reschedule_appointment
sw      1/1     -             reschedule_appointment
cy      1/1     -             reschedule_appointment
eu      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
mn      1/1     -             reschedule_appointment
yo      1/1     -             reschedule_appointment

Result: failed, 1 of 12 locales failed
```
