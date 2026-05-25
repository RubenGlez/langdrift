# LangDrift Benchmark Results

Scenario: ./examples/scenarios/scheduling-book-new.yaml
Domain: scheduling
Model: claude-haiku-4-5-20251001 (anthropic)
Iterations: 10
Total locale checks: 120
Pass rate: 48/120 (40%)
Average run duration: 33798 ms

| Locale | Pass | no_tool_call | wrong_tool | wrong_argument | missing_argument | forbidden_tool |
| ------ | ---- | ------------ | ---------- | -------------- | ---------------- | -------------- |
| en     | 9/10 | 1            | 0          | 0              | 0                | 0              |
| fr     | 2/10 | 8            | 0          | 0              | 0                | 0              |
| ar     | 4/10 | 5            | 1          | 0              | 0                | 0              |
| zh     | 6/10 | 4            | 0          | 0              | 0                | 0              |
| ru     | 8/10 | 2            | 0          | 0              | 0                | 0              |
| id     | 0/10 | 10           | 0          | 0              | 0                | 0              |
| vi     | 4/10 | 6            | 0          | 0              | 0                | 0              |
| sw     | 0/10 | 10           | 0          | 0              | 0                | 0              |
| cy     | 0/10 | 10           | 0          | 0              | 0                | 0              |
| eu     | 4/10 | 6            | 0          | 0              | 0                | 0              |
| mn     | 7/10 | 3            | 0          | 0              | 0                | 0              |
| yo     | 4/10 | 6            | 0          | 0              | 0                | 0              |

## Runs

### Iteration 1

Duration: 31786 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_availability
fr      1/1     -             check_availability
ar      0/1     no_tool_call  expected check_availability, got no tool calls
zh      1/1     -             check_availability
ru      1/1     -             check_availability
id      0/1     no_tool_call  expected check_availability, got no tool calls
vi      1/1     -             check_availability
sw      0/1     no_tool_call  expected check_availability, got no tool calls
cy      0/1     no_tool_call  expected check_availability, got no tool calls
eu      1/1     -             check_availability
mn      1/1     -             check_availability
yo      0/1     no_tool_call  expected check_availability, got no tool calls

Result: failed, 5 of 12 locales failed
```

### Iteration 2

Duration: 27138 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_availability
fr      0/1     no_tool_call  expected check_availability, got no tool calls
ar      1/1     -             check_availability
zh      1/1     -             check_availability
ru      1/1     -             check_availability
id      0/1     no_tool_call  expected check_availability, got no tool calls
vi      0/1     no_tool_call  expected check_availability, got no tool calls
sw      0/1     no_tool_call  expected check_availability, got no tool calls
cy      0/1     no_tool_call  expected check_availability, got no tool calls
eu      1/1     -             check_availability
mn      1/1     -             check_availability
yo      1/1     -             check_availability

Result: failed, 5 of 12 locales failed
```

### Iteration 3

Duration: 34093 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_availability
fr      1/1     -             check_availability
ar      1/1     -             check_availability
zh      0/1     no_tool_call  expected check_availability, got no tool calls
ru      1/1     -             check_availability
id      0/1     no_tool_call  expected check_availability, got no tool calls
vi      0/1     no_tool_call  expected check_availability, got no tool calls
sw      0/1     no_tool_call  expected check_availability, got no tool calls
cy      0/1     no_tool_call  expected check_availability, got no tool calls
eu      0/1     no_tool_call  expected check_availability, got no tool calls
mn      0/1     no_tool_call  expected check_availability, got no tool calls
yo      0/1     no_tool_call  expected check_availability, got no tool calls

Result: failed, 8 of 12 locales failed
```

### Iteration 4

Duration: 33667 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_availability
fr      0/1     no_tool_call  expected check_availability, got no tool calls
ar      1/1     -             check_availability
zh      0/1     no_tool_call  expected check_availability, got no tool calls
ru      1/1     -             check_availability
id      0/1     no_tool_call  expected check_availability, got no tool calls
vi      1/1     -             check_availability
sw      0/1     no_tool_call  expected check_availability, got no tool calls
cy      0/1     no_tool_call  expected check_availability, got no tool calls
eu      0/1     no_tool_call  expected check_availability, got no tool calls
mn      1/1     -             check_availability
yo      0/1     no_tool_call  expected check_availability, got no tool calls

Result: failed, 7 of 12 locales failed
```

### Iteration 5

Duration: 32590 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_availability
fr      0/1     no_tool_call  expected check_availability, got no tool calls
ar      0/1     no_tool_call  expected check_availability, got no tool calls
zh      1/1     -             check_availability
ru      1/1     -             check_availability
id      0/1     no_tool_call  expected check_availability, got no tool calls
vi      0/1     no_tool_call  expected check_availability, got no tool calls
sw      0/1     no_tool_call  expected check_availability, got no tool calls
cy      0/1     no_tool_call  expected check_availability, got no tool calls
eu      1/1     -             check_availability
mn      0/1     no_tool_call  expected check_availability, got no tool calls
yo      0/1     no_tool_call  expected check_availability, got no tool calls

Result: failed, 8 of 12 locales failed
```

### Iteration 6

Duration: 36133 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_availability
fr      0/1     no_tool_call  expected check_availability, got no tool calls
ar      0/1     no_tool_call  expected check_availability, got no tool calls
zh      1/1     -             check_availability
ru      0/1     no_tool_call  expected check_availability, got no tool calls
id      0/1     no_tool_call  expected check_availability, got no tool calls
vi      1/1     -             check_availability
sw      0/1     no_tool_call  expected check_availability, got no tool calls
cy      0/1     no_tool_call  expected check_availability, got no tool calls
eu      0/1     no_tool_call  expected check_availability, got no tool calls
mn      1/1     -             check_availability
yo      0/1     no_tool_call  expected check_availability, got no tool calls

Result: failed, 8 of 12 locales failed
```

### Iteration 7

Duration: 36487 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_availability
fr      0/1     no_tool_call  expected check_availability, got no tool calls
ar      0/1     no_tool_call  expected check_availability, got no tool calls
zh      1/1     -             check_availability
ru      1/1     -             check_availability
id      0/1     no_tool_call  expected check_availability, got no tool calls
vi      0/1     no_tool_call  expected check_availability, got no tool calls
sw      0/1     no_tool_call  expected check_availability, got no tool calls
cy      0/1     no_tool_call  expected check_availability, got no tool calls
eu      0/1     no_tool_call  expected check_availability, got no tool calls
mn      1/1     -             check_availability
yo      1/1     -             check_availability

Result: failed, 7 of 12 locales failed
```

### Iteration 8

Duration: 35407 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_availability
fr      0/1     no_tool_call  expected check_availability, got no tool calls
ar      0/1     no_tool_call  expected check_availability, got no tool calls
zh      1/1     -             check_availability
ru      1/1     -             check_availability
id      0/1     no_tool_call  expected check_availability, got no tool calls
vi      0/1     no_tool_call  expected check_availability, got no tool calls
sw      0/1     no_tool_call  expected check_availability, got no tool calls
cy      0/1     no_tool_call  expected check_availability, got no tool calls
eu      1/1     -             check_availability
mn      0/1     no_tool_call  expected check_availability, got no tool calls
yo      1/1     -             check_availability

Result: failed, 7 of 12 locales failed
```

### Iteration 9

Duration: 34514 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      0/1     no_tool_call  expected check_availability, got no tool calls
fr      0/1     no_tool_call  expected check_availability, got no tool calls
ar      1/1     -             check_availability
zh      0/1     no_tool_call  expected check_availability, got no tool calls
ru      1/1     -             check_availability
id      0/1     no_tool_call  expected check_availability, got no tool calls
vi      0/1     no_tool_call  expected check_availability, got no tool calls
sw      0/1     no_tool_call  expected check_availability, got no tool calls
cy      0/1     no_tool_call  expected check_availability, got no tool calls
eu      0/1     no_tool_call  expected check_availability, got no tool calls
mn      1/1     -             check_availability
yo      1/1     -             check_availability

Result: failed, 8 of 12 locales failed
```

### Iteration 10

Duration: 36160 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_availability
fr      0/1     no_tool_call  expected check_availability, got no tool calls
ar      0/1     wrong_tool    expected check_availability, got book_new_appointment
zh      0/1     no_tool_call  expected check_availability, got no tool calls
ru      0/1     no_tool_call  expected check_availability, got no tool calls
id      0/1     no_tool_call  expected check_availability, got no tool calls
vi      1/1     -             check_availability
sw      0/1     no_tool_call  expected check_availability, got no tool calls
cy      0/1     no_tool_call  expected check_availability, got no tool calls
eu      0/1     no_tool_call  expected check_availability, got no tool calls
mn      1/1     -             check_availability
yo      0/1     no_tool_call  expected check_availability, got no tool calls

Result: failed, 9 of 12 locales failed
```
