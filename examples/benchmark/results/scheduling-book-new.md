# LangDrift Benchmark Results

Scenario: ./examples/scenarios/scheduling-book-new.yaml
Domain: scheduling
Model: deepseek-chat (openai-compat)
Iterations: 3
Total locale checks: 36
Pass rate: 36/36 (100%)
Average run duration: 24278 ms

| Locale | Pass | no_tool_call | wrong_tool | wrong_argument | missing_argument | forbidden_tool |
| ------ | ---- | ------------ | ---------- | -------------- | ---------------- | -------------- |
| en     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| fr     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| ar     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| zh     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| ru     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| id     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| vi     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| sw     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| cy     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| eu     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| mn     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| yo     | 3/3  | 0            | 0          | 0              | 0                | 0              |

## Runs

### Iteration 1

Duration: 26627 ms / Exit: 0

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure  Detail
en      pass    -        check_availability
fr      pass    -        check_availability
ar      pass    -        check_availability
zh      pass    -        check_availability
ru      pass    -        check_availability
id      pass    -        check_availability
vi      pass    -        check_availability
sw      pass    -        check_availability
cy      pass    -        check_availability
eu      pass    -        check_availability
mn      pass    -        check_availability
yo      pass    -        check_availability

Result: passed, 0 of 12 locales failed
```

### Iteration 2

Duration: 22651 ms / Exit: 0

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure  Detail
en      pass    -        check_availability
fr      pass    -        check_availability
ar      pass    -        check_availability
zh      pass    -        check_availability
ru      pass    -        check_availability
id      pass    -        check_availability
vi      pass    -        check_availability
sw      pass    -        check_availability
cy      pass    -        check_availability
eu      pass    -        check_availability
mn      pass    -        check_availability
yo      pass    -        check_availability

Result: passed, 0 of 12 locales failed
```

### Iteration 3

Duration: 23557 ms / Exit: 0

```
LangDrift run

Scenario: scheduling_book_new
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure  Detail
en      pass    -        check_availability
fr      pass    -        check_availability
ar      pass    -        check_availability
zh      pass    -        check_availability
ru      pass    -        check_availability
id      pass    -        check_availability
vi      pass    -        check_availability
sw      pass    -        check_availability
cy      pass    -        check_availability
eu      pass    -        check_availability
mn      pass    -        check_availability
yo      pass    -        check_availability

Result: passed, 0 of 12 locales failed
```
