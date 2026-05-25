# LangDrift Benchmark Results

Scenario: ./examples/scenarios/scheduling-reschedule.yaml
Domain: scheduling
Model: deepseek-chat (deepseek)
Iterations: 10
Total locale checks: 120
Pass rate: 77/120 (64%)
Average run duration: 24873 ms

| Locale | Pass  | no_tool_call | wrong_tool | wrong_argument | missing_argument | forbidden_tool | wrong_sequence |
| ------ | ----- | ------------ | ---------- | -------------- | ---------------- | -------------- | -------------- |
| en     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| fr     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| ar     | 0/10  | 10           | 0          | 0              | 0                | 0              | 0              |
| zh     | 0/10  | 10           | 0          | 0              | 0                | 0              | 0              |
| ru     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| id     | 1/10  | 9            | 0          | 0              | 0                | 0              | 0              |
| vi     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| sw     | 0/10  | 0            | 10         | 0              | 0                | 0              | 0              |
| cy     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| eu     | 9/10  | 1            | 0          | 0              | 0                | 0              | 0              |
| mn     | 8/10  | 2            | 0          | 0              | 0                | 0              | 0              |
| yo     | 9/10  | 1            | 0          | 0              | 0                | 0              | 0              |

## Runs

### Iteration 1

Duration: 26728 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             reschedule_appointment
fr      1/1     -             reschedule_appointment
ar      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
zh      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
ru      1/1     -             reschedule_appointment
id      1/1     -             reschedule_appointment
vi      1/1     -             reschedule_appointment
sw      0/1     wrong_tool    expected reschedule_appointment, got check_availability
cy      1/1     -             reschedule_appointment
eu      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
mn      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
yo      1/1     -             reschedule_appointment

Result: failed, 5 of 12 locales failed
```

### Iteration 2

Duration: 25698 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             reschedule_appointment
fr      1/1     -             reschedule_appointment
ar      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
zh      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
ru      1/1     -             reschedule_appointment
id      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
vi      1/1     -             reschedule_appointment
sw      0/1     wrong_tool    expected reschedule_appointment, got check_availability
cy      1/1     -             reschedule_appointment
eu      1/1     -             reschedule_appointment
mn      1/1     -             reschedule_appointment
yo      1/1     -             reschedule_appointment

Result: failed, 4 of 12 locales failed
```

### Iteration 3

Duration: 25528 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             reschedule_appointment
fr      1/1     -             reschedule_appointment
ar      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
zh      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
ru      1/1     -             reschedule_appointment
id      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
vi      1/1     -             reschedule_appointment
sw      0/1     wrong_tool    expected reschedule_appointment, got check_availability
cy      1/1     -             reschedule_appointment
eu      1/1     -             reschedule_appointment
mn      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
yo      1/1     -             reschedule_appointment

Result: failed, 5 of 12 locales failed
```

### Iteration 4

Duration: 24364 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             reschedule_appointment
fr      1/1     -             reschedule_appointment
ar      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
zh      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
ru      1/1     -             reschedule_appointment
id      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
vi      1/1     -             reschedule_appointment
sw      0/1     wrong_tool    expected reschedule_appointment, got check_availability
cy      1/1     -             reschedule_appointment
eu      1/1     -             reschedule_appointment
mn      1/1     -             reschedule_appointment
yo      1/1     -             reschedule_appointment

Result: failed, 4 of 12 locales failed
```

### Iteration 5

Duration: 24791 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             reschedule_appointment
fr      1/1     -             reschedule_appointment
ar      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
zh      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
ru      1/1     -             reschedule_appointment
id      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
vi      1/1     -             reschedule_appointment
sw      0/1     wrong_tool    expected reschedule_appointment, got check_availability
cy      1/1     -             reschedule_appointment
eu      1/1     -             reschedule_appointment
mn      1/1     -             reschedule_appointment
yo      1/1     -             reschedule_appointment

Result: failed, 4 of 12 locales failed
```

### Iteration 6

Duration: 24329 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             reschedule_appointment
fr      1/1     -             reschedule_appointment
ar      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
zh      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
ru      1/1     -             reschedule_appointment
id      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
vi      1/1     -             reschedule_appointment
sw      0/1     wrong_tool    expected reschedule_appointment, got check_availability
cy      1/1     -             reschedule_appointment
eu      1/1     -             reschedule_appointment
mn      1/1     -             reschedule_appointment
yo      1/1     -             reschedule_appointment

Result: failed, 4 of 12 locales failed
```

### Iteration 7

Duration: 25028 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             reschedule_appointment
fr      1/1     -             reschedule_appointment
ar      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
zh      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
ru      1/1     -             reschedule_appointment
id      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
vi      1/1     -             reschedule_appointment
sw      0/1     wrong_tool    expected reschedule_appointment, got check_availability
cy      1/1     -             reschedule_appointment
eu      1/1     -             reschedule_appointment
mn      1/1     -             reschedule_appointment
yo      0/1     no_tool_call  expected reschedule_appointment, got no tool calls

Result: failed, 5 of 12 locales failed
```

### Iteration 8

Duration: 24122 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             reschedule_appointment
fr      1/1     -             reschedule_appointment
ar      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
zh      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
ru      1/1     -             reschedule_appointment
id      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
vi      1/1     -             reschedule_appointment
sw      0/1     wrong_tool    expected reschedule_appointment, got check_availability
cy      1/1     -             reschedule_appointment
eu      1/1     -             reschedule_appointment
mn      1/1     -             reschedule_appointment
yo      1/1     -             reschedule_appointment

Result: failed, 4 of 12 locales failed
```

### Iteration 9

Duration: 23238 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             reschedule_appointment
fr      1/1     -             reschedule_appointment
ar      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
zh      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
ru      1/1     -             reschedule_appointment
id      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
vi      1/1     -             reschedule_appointment
sw      0/1     wrong_tool    expected reschedule_appointment, got check_availability
cy      1/1     -             reschedule_appointment
eu      1/1     -             reschedule_appointment
mn      1/1     -             reschedule_appointment
yo      1/1     -             reschedule_appointment

Result: failed, 4 of 12 locales failed
```

### Iteration 10

Duration: 24906 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             reschedule_appointment
fr      1/1     -             reschedule_appointment
ar      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
zh      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
ru      1/1     -             reschedule_appointment
id      0/1     no_tool_call  expected reschedule_appointment, got no tool calls
vi      1/1     -             reschedule_appointment
sw      0/1     wrong_tool    expected reschedule_appointment, got check_availability
cy      1/1     -             reschedule_appointment
eu      1/1     -             reschedule_appointment
mn      1/1     -             reschedule_appointment
yo      1/1     -             reschedule_appointment

Result: failed, 4 of 12 locales failed
```
