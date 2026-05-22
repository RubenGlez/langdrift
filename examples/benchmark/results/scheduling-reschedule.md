# LangDrift Benchmark Results

Scenario: ./examples/scenarios/scheduling-reschedule.yaml
Domain: scheduling
Model: deepseek-chat (openai-compat)
Iterations: 3
Total locale checks: 36
Pass rate: 28/36 (78%)
Average run duration: 28170 ms

| Locale | Pass | no_tool_call | wrong_tool | wrong_argument | missing_argument | forbidden_tool |
| ------ | ---- | ------------ | ---------- | -------------- | ---------------- | -------------- |
| en     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| fr     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| ar     | 1/3  | 2            | 0          | 0              | 0                | 0              |
| zh     | 2/3  | 1            | 0          | 0              | 0                | 0              |
| ru     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| id     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| vi     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| sw     | 0/3  | 1            | 2          | 0              | 0                | 0              |
| cy     | 2/3  | 1            | 0          | 0              | 0                | 0              |
| eu     | 2/3  | 1            | 0          | 0              | 0                | 0              |
| mn     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| yo     | 3/3  | 0            | 0          | 0              | 0                | 0              |

## Runs

### Iteration 1

Duration: 28037 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure       Detail
en      pass    -             reschedule_appointment
fr      pass    -             reschedule_appointment
ar      fail    no_tool_call  expected reschedule_appointment, got no tool calls
zh      pass    -             reschedule_appointment
ru      pass    -             reschedule_appointment
id      pass    -             reschedule_appointment
vi      pass    -             reschedule_appointment
sw      fail    wrong_tool    expected reschedule_appointment, got check_availability
cy      fail    no_tool_call  expected reschedule_appointment, got no tool calls
eu      pass    -             reschedule_appointment
mn      pass    -             reschedule_appointment
yo      pass    -             reschedule_appointment

Result: failed, 3 of 12 locales failed
```

### Iteration 2

Duration: 28157 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure       Detail
en      pass    -             reschedule_appointment
fr      pass    -             reschedule_appointment
ar      fail    no_tool_call  expected reschedule_appointment, got no tool calls
zh      pass    -             reschedule_appointment
ru      pass    -             reschedule_appointment
id      pass    -             reschedule_appointment
vi      pass    -             reschedule_appointment
sw      fail    no_tool_call  expected reschedule_appointment, got no tool calls
cy      pass    -             reschedule_appointment
eu      fail    no_tool_call  expected reschedule_appointment, got no tool calls
mn      pass    -             reschedule_appointment
yo      pass    -             reschedule_appointment

Result: failed, 3 of 12 locales failed
```

### Iteration 3

Duration: 28315 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure       Detail
en      pass    -             reschedule_appointment
fr      pass    -             reschedule_appointment
ar      pass    -             reschedule_appointment
zh      fail    no_tool_call  expected reschedule_appointment, got no tool calls
ru      pass    -             reschedule_appointment
id      pass    -             reschedule_appointment
vi      pass    -             reschedule_appointment
sw      fail    wrong_tool    expected reschedule_appointment, got check_availability
cy      pass    -             reschedule_appointment
eu      pass    -             reschedule_appointment
mn      pass    -             reschedule_appointment
yo      pass    -             reschedule_appointment

Result: failed, 2 of 12 locales failed
```
