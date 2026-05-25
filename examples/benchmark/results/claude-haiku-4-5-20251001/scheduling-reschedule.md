# LangDrift Benchmark Results

Scenario: ./examples/scenarios/scheduling-reschedule.yaml
Domain: scheduling
Model: claude-haiku-4-5-20251001 (anthropic)
Iterations: 10
Total locale checks: 120
Pass rate: 106/120 (88%)
Average run duration: 25655 ms

| Locale | Pass  | no_tool_call | wrong_tool | wrong_argument | missing_argument | forbidden_tool |
| ------ | ----- | ------------ | ---------- | -------------- | ---------------- | -------------- |
| en     | 9/10  | 1            | 0          | 0              | 0                | 0              |
| fr     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| ar     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| zh     | 9/10  | 1            | 0          | 0              | 0                | 0              |
| ru     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| id     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| vi     | 10/10 | 0            | 0          | 0              | 0                | 0              |
| sw     | 4/10  | 6            | 0          | 0              | 0                | 0              |
| cy     | 9/10  | 1            | 0          | 0              | 0                | 0              |
| eu     | 7/10  | 3            | 0          | 0              | 0                | 0              |
| mn     | 8/10  | 2            | 0          | 0              | 0                | 0              |
| yo     | 10/10 | 0            | 0          | 0              | 0                | 0              |

## Runs

### Iteration 1

Duration: 26980 ms / Exit: 1

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
sw      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
cy      1/1     -             reschedule_appointment
eu      1/1     -             reschedule_appointment
mn      1/1     -             reschedule_appointment
yo      1/1     -             reschedule_appointment

Result: failed, 1 of 12 locales failed
```

### Iteration 2

Duration: 28297 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
fr      1/1     -             reschedule_appointment
ar      1/1     -             reschedule_appointment
zh      1/1     -             reschedule_appointment
ru      1/1     -             reschedule_appointment
id      1/1     -             reschedule_appointment
vi      1/1     -             reschedule_appointment
sw      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
cy      1/1     -             reschedule_appointment
eu      1/1     -             reschedule_appointment
mn      1/1     -             reschedule_appointment
yo      1/1     -             reschedule_appointment

Result: failed, 2 of 12 locales failed
```

### Iteration 3

Duration: 29613 ms / Exit: 1

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
sw      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
cy      1/1     -             reschedule_appointment
eu      1/1     -             reschedule_appointment
mn      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
yo      1/1     -             reschedule_appointment

Result: failed, 2 of 12 locales failed
```

### Iteration 4

Duration: 25345 ms / Exit: 1

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
sw      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
cy      1/1     -             reschedule_appointment
eu      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
mn      1/1     -             reschedule_appointment
yo      1/1     -             reschedule_appointment

Result: failed, 2 of 12 locales failed
```

### Iteration 5

Duration: 22463 ms / Exit: 0

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        reschedule_appointment
fr      1/1     -        reschedule_appointment
ar      1/1     -        reschedule_appointment
zh      1/1     -        reschedule_appointment
ru      1/1     -        reschedule_appointment
id      1/1     -        reschedule_appointment
vi      1/1     -        reschedule_appointment
sw      1/1     -        reschedule_appointment
cy      1/1     -        reschedule_appointment
eu      1/1     -        reschedule_appointment
mn      1/1     -        reschedule_appointment
yo      1/1     -        reschedule_appointment

Result: passed, 0 of 12 locales failed
```

### Iteration 6

Duration: 29266 ms / Exit: 1

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
sw      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
cy      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
eu      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
mn      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
yo      1/1     -             reschedule_appointment

Result: failed, 4 of 12 locales failed
```

### Iteration 7

Duration: 21071 ms / Exit: 1

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
sw      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
cy      1/1     -             reschedule_appointment
eu      1/1     -             reschedule_appointment
mn      1/1     -             reschedule_appointment
yo      1/1     -             reschedule_appointment

Result: failed, 1 of 12 locales failed
```

### Iteration 8

Duration: 25933 ms / Exit: 1

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

Duration: 25614 ms / Exit: 0

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        reschedule_appointment
fr      1/1     -        reschedule_appointment
ar      1/1     -        reschedule_appointment
zh      1/1     -        reschedule_appointment
ru      1/1     -        reschedule_appointment
id      1/1     -        reschedule_appointment
vi      1/1     -        reschedule_appointment
sw      1/1     -        reschedule_appointment
cy      1/1     -        reschedule_appointment
eu      1/1     -        reschedule_appointment
mn      1/1     -        reschedule_appointment
yo      1/1     -        reschedule_appointment

Result: passed, 0 of 12 locales failed
```

### Iteration 10

Duration: 21970 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             reschedule_appointment
fr      1/1     -             reschedule_appointment
ar      1/1     -             reschedule_appointment
zh      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
ru      1/1     -             reschedule_appointment
id      1/1     -             reschedule_appointment
vi      1/1     -             reschedule_appointment
sw      1/1     -             reschedule_appointment
cy      1/1     -             reschedule_appointment
eu      1/1     -             reschedule_appointment
mn      1/1     -             reschedule_appointment
yo      1/1     -             reschedule_appointment

Result: failed, 1 of 12 locales failed
```
