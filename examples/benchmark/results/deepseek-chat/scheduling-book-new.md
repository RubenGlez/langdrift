# LangDrift Benchmark Results

Scenario: ./examples/scenarios/scheduling-book-new.yaml
Domain: scheduling
Model: deepseek-chat (deepseek)
Iterations: 10
Total locale checks: 120
Pass rate: 112/120 (93%)
Average run duration: 22934 ms

| Locale | Pass  | no_tool_call | wrong_tool | wrong_argument | missing_argument | forbidden_tool | wrong_sequence |
| ------ | ----- | ------------ | ---------- | -------------- | ---------------- | -------------- | -------------- |
| en     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| fr     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| ar     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| zh     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| ru     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| id     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| vi     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| sw     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| cy     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| eu     | 2/10  | 8            | 0          | 0              | 0                | 0              | 0              |
| mn     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| yo     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |

## Runs

### Iteration 1

Duration: 22607 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_availability
fr      1/1     -             check_availability
ar      1/1     -             check_availability
zh      1/1     -             check_availability
ru      1/1     -             check_availability
id      1/1     -             check_availability
vi      1/1     -             check_availability
sw      1/1     -             check_availability
cy      1/1     -             check_availability
eu      0/1     no_tool_call  expected check_availability, got no tool calls
mn      1/1     -             check_availability
yo      1/1     -             check_availability

Result: failed, 1 of 12 locales failed
```

### Iteration 2

Duration: 24157 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_availability
fr      1/1     -             check_availability
ar      1/1     -             check_availability
zh      1/1     -             check_availability
ru      1/1     -             check_availability
id      1/1     -             check_availability
vi      1/1     -             check_availability
sw      1/1     -             check_availability
cy      1/1     -             check_availability
eu      0/1     no_tool_call  expected check_availability, got no tool calls
mn      1/1     -             check_availability
yo      1/1     -             check_availability

Result: failed, 1 of 12 locales failed
```

### Iteration 3

Duration: 22576 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_availability
fr      1/1     -             check_availability
ar      1/1     -             check_availability
zh      1/1     -             check_availability
ru      1/1     -             check_availability
id      1/1     -             check_availability
vi      1/1     -             check_availability
sw      1/1     -             check_availability
cy      1/1     -             check_availability
eu      0/1     no_tool_call  expected check_availability, got no tool calls
mn      1/1     -             check_availability
yo      1/1     -             check_availability

Result: failed, 1 of 12 locales failed
```

### Iteration 4

Duration: 24155 ms / Exit: 0

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        check_availability
fr      1/1     -        check_availability
ar      1/1     -        check_availability
zh      1/1     -        check_availability
ru      1/1     -        check_availability
id      1/1     -        check_availability
vi      1/1     -        check_availability
sw      1/1     -        check_availability
cy      1/1     -        check_availability
eu      1/1     -        check_availability
mn      1/1     -        check_availability
yo      1/1     -        check_availability

Result: passed, 0 of 12 locales failed
```

### Iteration 5

Duration: 22759 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_availability
fr      1/1     -             check_availability
ar      1/1     -             check_availability
zh      1/1     -             check_availability
ru      1/1     -             check_availability
id      1/1     -             check_availability
vi      1/1     -             check_availability
sw      1/1     -             check_availability
cy      1/1     -             check_availability
eu      0/1     no_tool_call  expected check_availability, got no tool calls
mn      1/1     -             check_availability
yo      1/1     -             check_availability

Result: failed, 1 of 12 locales failed
```

### Iteration 6

Duration: 23683 ms / Exit: 0

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure  Detail
en      1/1     -        check_availability
fr      1/1     -        check_availability
ar      1/1     -        check_availability
zh      1/1     -        check_availability
ru      1/1     -        check_availability
id      1/1     -        check_availability
vi      1/1     -        check_availability
sw      1/1     -        check_availability
cy      1/1     -        check_availability
eu      1/1     -        check_availability
mn      1/1     -        check_availability
yo      1/1     -        check_availability

Result: passed, 0 of 12 locales failed
```

### Iteration 7

Duration: 23214 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_availability
fr      1/1     -             check_availability
ar      1/1     -             check_availability
zh      1/1     -             check_availability
ru      1/1     -             check_availability
id      1/1     -             check_availability
vi      1/1     -             check_availability
sw      1/1     -             check_availability
cy      1/1     -             check_availability
eu      0/1     no_tool_call  expected check_availability, got no tool calls
mn      1/1     -             check_availability
yo      1/1     -             check_availability

Result: failed, 1 of 12 locales failed
```

### Iteration 8

Duration: 21803 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_availability
fr      1/1     -             check_availability
ar      1/1     -             check_availability
zh      1/1     -             check_availability
ru      1/1     -             check_availability
id      1/1     -             check_availability
vi      1/1     -             check_availability
sw      1/1     -             check_availability
cy      1/1     -             check_availability
eu      0/1     no_tool_call  expected check_availability, got no tool calls
mn      1/1     -             check_availability
yo      1/1     -             check_availability

Result: failed, 1 of 12 locales failed
```

### Iteration 9

Duration: 22324 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_availability
fr      1/1     -             check_availability
ar      1/1     -             check_availability
zh      1/1     -             check_availability
ru      1/1     -             check_availability
id      1/1     -             check_availability
vi      1/1     -             check_availability
sw      1/1     -             check_availability
cy      1/1     -             check_availability
eu      0/1     no_tool_call  expected check_availability, got no tool calls
mn      1/1     -             check_availability
yo      1/1     -             check_availability

Result: failed, 1 of 12 locales failed
```

### Iteration 10

Duration: 22060 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             check_availability
fr      1/1     -             check_availability
ar      1/1     -             check_availability
zh      1/1     -             check_availability
ru      1/1     -             check_availability
id      1/1     -             check_availability
vi      1/1     -             check_availability
sw      1/1     -             check_availability
cy      1/1     -             check_availability
eu      0/1     no_tool_call  expected check_availability, got no tool calls
mn      1/1     -             check_availability
yo      1/1     -             check_availability

Result: failed, 1 of 12 locales failed
```
