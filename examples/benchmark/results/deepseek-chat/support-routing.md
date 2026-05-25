# LangDrift Benchmark Results

Scenario: ./examples/scenarios/support-routing.yaml
Domain: support
Model: deepseek-chat (deepseek)
Iterations: 10
Total locale checks: 120
Pass rate: 101/120 (84%)
Average run duration: 28894 ms

| Locale | Pass  | no_tool_call | wrong_tool | wrong_argument | missing_argument | forbidden_tool | wrong_sequence |
| ------ | ----- | ------------ | ---------- | -------------- | ---------------- | -------------- | -------------- |
| en     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| fr     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| ar     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| sw     | 9/10  | 0            | 1          | 0              | 0                | 0              | 0              |
| cy     | 2/10  | 0            | 8          | 0              | 0                | 0              | 0              |
| eu     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| mn     | 1/10  | 4            | 5          | 0              | 0                | 0              | 0              |
| yo     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| zh     | 9/10  | 1            | 0          | 0              | 0                | 0              | 0              |
| ru     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| id     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |
| vi     | 10/10 | 0            | 0          | 0              | 0                | 0              | 0              |

## Runs

### Iteration 1

Duration: 29412 ms / Exit: 1

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure     Detail
en      1/1     -           create_refund_ticket
fr      1/1     -           create_refund_ticket
ar      1/1     -           create_refund_ticket
sw      0/1     wrong_tool  expected create_refund_ticket, got check_payment_status
cy      0/1     wrong_tool  expected create_refund_ticket, got check_payment_status
eu      1/1     -           create_refund_ticket
mn      0/1     wrong_tool  expected create_refund_ticket, got check_payment_status
yo      1/1     -           create_refund_ticket
zh      1/1     -           create_refund_ticket
ru      1/1     -           create_refund_ticket
id      1/1     -           create_refund_ticket
vi      1/1     -           create_refund_ticket

Result: failed, 3 of 12 locales failed
```

### Iteration 2

Duration: 28168 ms / Exit: 1

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             create_refund_ticket
fr      1/1     -             create_refund_ticket
ar      1/1     -             create_refund_ticket
sw      1/1     -             create_refund_ticket
cy      0/1     wrong_tool    expected create_refund_ticket, got check_payment_status
eu      1/1     -             create_refund_ticket
mn      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
yo      1/1     -             create_refund_ticket
zh      1/1     -             create_refund_ticket
ru      1/1     -             create_refund_ticket
id      1/1     -             create_refund_ticket
vi      1/1     -             create_refund_ticket

Result: failed, 2 of 12 locales failed
```

### Iteration 3

Duration: 28470 ms / Exit: 1

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure     Detail
en      1/1     -           create_refund_ticket
fr      1/1     -           create_refund_ticket
ar      1/1     -           create_refund_ticket
sw      1/1     -           create_refund_ticket
cy      1/1     -           create_refund_ticket
eu      1/1     -           create_refund_ticket
mn      0/1     wrong_tool  expected create_refund_ticket, got check_payment_status
yo      1/1     -           create_refund_ticket
zh      1/1     -           create_refund_ticket
ru      1/1     -           create_refund_ticket
id      1/1     -           create_refund_ticket
vi      1/1     -           create_refund_ticket

Result: failed, 1 of 12 locales failed
```

### Iteration 4

Duration: 29593 ms / Exit: 1

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             create_refund_ticket
fr      1/1     -             create_refund_ticket
ar      1/1     -             create_refund_ticket
sw      1/1     -             create_refund_ticket
cy      0/1     wrong_tool    expected create_refund_ticket, got check_payment_status
eu      1/1     -             create_refund_ticket
mn      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
yo      1/1     -             create_refund_ticket
zh      1/1     -             create_refund_ticket
ru      1/1     -             create_refund_ticket
id      1/1     -             create_refund_ticket
vi      1/1     -             create_refund_ticket

Result: failed, 2 of 12 locales failed
```

### Iteration 5

Duration: 28163 ms / Exit: 1

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure     Detail
en      1/1     -           create_refund_ticket
fr      1/1     -           create_refund_ticket
ar      1/1     -           create_refund_ticket
sw      1/1     -           create_refund_ticket
cy      0/1     wrong_tool  expected create_refund_ticket, got check_payment_status
eu      1/1     -           create_refund_ticket
mn      0/1     wrong_tool  expected create_refund_ticket, got check_payment_status
yo      1/1     -           create_refund_ticket
zh      1/1     -           create_refund_ticket
ru      1/1     -           create_refund_ticket
id      1/1     -           create_refund_ticket
vi      1/1     -           create_refund_ticket

Result: failed, 2 of 12 locales failed
```

### Iteration 6

Duration: 27604 ms / Exit: 1

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             create_refund_ticket
fr      1/1     -             create_refund_ticket
ar      1/1     -             create_refund_ticket
sw      1/1     -             create_refund_ticket
cy      1/1     -             create_refund_ticket
eu      1/1     -             create_refund_ticket
mn      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
yo      1/1     -             create_refund_ticket
zh      1/1     -             create_refund_ticket
ru      1/1     -             create_refund_ticket
id      1/1     -             create_refund_ticket
vi      1/1     -             create_refund_ticket

Result: failed, 1 of 12 locales failed
```

### Iteration 7

Duration: 27075 ms / Exit: 1

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure     Detail
en      1/1     -           create_refund_ticket
fr      1/1     -           create_refund_ticket
ar      1/1     -           create_refund_ticket
sw      1/1     -           create_refund_ticket
cy      0/1     wrong_tool  expected create_refund_ticket, got check_payment_status
eu      1/1     -           create_refund_ticket
mn      0/1     wrong_tool  expected create_refund_ticket, got check_payment_status
yo      1/1     -           create_refund_ticket
zh      1/1     -           create_refund_ticket
ru      1/1     -           create_refund_ticket
id      1/1     -           create_refund_ticket
vi      1/1     -           create_refund_ticket

Result: failed, 2 of 12 locales failed
```

### Iteration 8

Duration: 29073 ms / Exit: 1

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             create_refund_ticket
fr      1/1     -             create_refund_ticket
ar      1/1     -             create_refund_ticket
sw      1/1     -             create_refund_ticket
cy      0/1     wrong_tool    expected create_refund_ticket, got check_payment_status
eu      1/1     -             create_refund_ticket
mn      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
yo      1/1     -             create_refund_ticket
zh      1/1     -             create_refund_ticket
ru      1/1     -             create_refund_ticket
id      1/1     -             create_refund_ticket
vi      1/1     -             create_refund_ticket

Result: failed, 2 of 12 locales failed
```

### Iteration 9

Duration: 29700 ms / Exit: 1

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure     Detail
en      1/1     -           create_refund_ticket
fr      1/1     -           create_refund_ticket
ar      1/1     -           create_refund_ticket
sw      1/1     -           create_refund_ticket
cy      0/1     wrong_tool  expected create_refund_ticket, got check_payment_status
eu      1/1     -           create_refund_ticket
mn      1/1     -           create_refund_ticket
yo      1/1     -           create_refund_ticket
zh      1/1     -           create_refund_ticket
ru      1/1     -           create_refund_ticket
id      1/1     -           create_refund_ticket
vi      1/1     -           create_refund_ticket

Result: failed, 1 of 12 locales failed
```

### Iteration 10

Duration: 31686 ms / Exit: 1

```
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             create_refund_ticket
fr      1/1     -             create_refund_ticket
ar      1/1     -             create_refund_ticket
sw      1/1     -             create_refund_ticket
cy      0/1     wrong_tool    expected create_refund_ticket, got check_payment_status
eu      1/1     -             create_refund_ticket
mn      0/1     wrong_tool    expected create_refund_ticket, got check_payment_status
yo      1/1     -             create_refund_ticket
zh      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
ru      1/1     -             create_refund_ticket
id      1/1     -             create_refund_ticket
vi      1/1     -             create_refund_ticket

Result: failed, 3 of 12 locales failed
```
