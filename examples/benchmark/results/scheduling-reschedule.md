# LangDrift Benchmark Results

Scenario: ./examples/scenarios/scheduling-reschedule.yaml
Domain: scheduling
Model: deepseek-chat (openai-compat)
Iterations: 3
Total locale checks: 36
Pass rate: 14/36 (39%)
Average run duration: 29104 ms

| Locale | Pass | no_tool_call | wrong_tool | wrong_argument | missing_argument | forbidden_tool |
| ------ | ---- | ------------ | ---------- | -------------- | ---------------- | -------------- |
| en     | 0/3  | 3            | 0          | 0              | 0                | 0              |
| fr     | 1/3  | 1            | 1          | 0              | 0                | 0              |
| ar     | 2/3  | 1            | 0          | 0              | 0                | 0              |
| sw     | 0/3  | 3            | 0          | 0              | 0                | 0              |
| cy     | 1/3  | 1            | 1          | 0              | 0                | 0              |
| eu     | 2/3  | 1            | 0          | 0              | 0                | 0              |
| mn     | 2/3  | 1            | 0          | 0              | 0                | 0              |
| yo     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| zh     | 0/3  | 3            | 0          | 0              | 0                | 0              |
| ru     | 0/3  | 3            | 0          | 0              | 0                | 0              |
| id     | 3/3  | 0            | 0          | 0              | 0                | 0              |
| vi     | 0/3  | 3            | 0          | 0              | 0                | 0              |

## Runs

### Iteration 1

Duration: 28729 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure       Detail
en      fail    no_tool_call  expected reschedule_appointment, got no tool calls
fr      fail    no_tool_call  expected reschedule_appointment, got no tool calls
ar      fail    no_tool_call  expected reschedule_appointment, got no tool calls
sw      fail    no_tool_call  expected reschedule_appointment, got no tool calls
cy      fail    wrong_tool    expected reschedule_appointment, got check_availability
eu      pass    -             reschedule_appointment
mn      pass    -             reschedule_appointment
yo      pass    -             reschedule_appointment
zh      fail    no_tool_call  expected reschedule_appointment, got no tool calls
ru      fail    no_tool_call  expected reschedule_appointment, got no tool calls
id      pass    -             reschedule_appointment
vi      fail    no_tool_call  expected reschedule_appointment, got no tool calls

Result: failed, 8 of 12 locales failed
```

### Iteration 2

Duration: 26866 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure       Detail
en      fail    no_tool_call  expected reschedule_appointment, got no tool calls
fr      fail    wrong_tool    expected reschedule_appointment, got check_availability
ar      pass    -             reschedule_appointment
sw      fail    no_tool_call  expected reschedule_appointment, got no tool calls
cy      fail    no_tool_call  expected reschedule_appointment, got no tool calls
eu      fail    no_tool_call  expected reschedule_appointment, got no tool calls
mn      fail    no_tool_call  expected reschedule_appointment, got no tool calls
yo      pass    -             reschedule_appointment
zh      fail    no_tool_call  expected reschedule_appointment, got no tool calls
ru      fail    no_tool_call  expected reschedule_appointment, got no tool calls
id      pass    -             reschedule_appointment
vi      fail    no_tool_call  expected reschedule_appointment, got no tool calls

Result: failed, 9 of 12 locales failed
```

### Iteration 3

Duration: 31718 ms / Exit: 1

```
LangDrift run

Scenario: scheduling_reschedule
Target: http://127.0.0.1:3010/api/agent

Locale  Status  Failure       Detail
en      fail    no_tool_call  expected reschedule_appointment, got no tool calls
fr      pass    -             reschedule_appointment
ar      pass    -             reschedule_appointment
sw      fail    no_tool_call  expected reschedule_appointment, got no tool calls
cy      pass    -             reschedule_appointment
eu      pass    -             reschedule_appointment
mn      pass    -             reschedule_appointment
yo      pass    -             reschedule_appointment
zh      fail    no_tool_call  expected reschedule_appointment, got no tool calls
ru      fail    no_tool_call  expected reschedule_appointment, got no tool calls
id      pass    -             reschedule_appointment
vi      fail    no_tool_call  expected reschedule_appointment, got no tool calls

Result: failed, 5 of 12 locales failed
```
