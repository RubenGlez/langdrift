# Adversarial Codebase Audit — langdrift (2026-07-03)

Auditor: Claude (adversarial staff-engineer review, full-repo read).
Scope: all 82 tracked files at `d34d30f` on `claude/codebase-adversarial-audit-wo8pbw`.
Method: every `src/`, `tests/`, `examples/`, `docs/` file read in full; suspected
behaviors executed against the real code (Node 22.22, `node --test` suite green,
`pnpm build`/`typecheck`/`lint` green, fake-agent demo run end-to-end, dead-target
run executed, translate flow exercised against a mock LLM server, all 18 committed
benchmark result tables recounted against `RESEARCH.md`).

Note: the four ADRs under `.harness/adr/` are age-encrypted in this checkout
(doctier, no recipient key available), so ADR drift is assessed against the ADR
*titles*, `CHANGELOG.md`, and `RESEARCH.md` claims rather than ADR bodies.

---

## 1. System map

### What this actually is

Despite "library+tool" positioning, the published npm artifact is a **CLI only**:
`package.json` declares `bin: ./dist/cli.js` and **no `main`, `exports`, or
`types`** — nothing is importable from the installed package. The runtime core is
~1,600 lines of dependency-free TypeScript under `src/`, compiled to `dist/` by
`tsc -p tsconfig.build.json` (`rewriteRelativeImportExtensions` rewrites the
`.ts`-extension ESM imports). From a clone, everything runs raw `.ts` via Node
type-stripping.

### Real execution paths

1. **`langdrift run <file|dir> --target <url>`** (`src/cli.ts:202-254` →
   `src/runner.ts` → `src/httpTarget.ts` → `src/assertions.ts` → one of three
   reporters). For each iteration × locale, the runner POSTs
   `{locale, input, scenarioId}`, normalizes the response
   (`httpTarget.ts:61-94`), and evaluates assertions in fixed order:
   forbidden tool → `toolCall` (single/anyOf) → `toolCalls` sequence →
   `responseLanguage` (`assertions.ts:72-111`). Per-locale iterations are
   aggregated in `runner.ts:63-81` (first failure's mode/detail is the
   representative). Exit code comes from `shouldFail` (`cli.ts:148-163`)
   honoring `--allow-fail` then `--min-pass-rate`.
   A directory resolves to N files (`runner.ts:101-114`); N>1 switches to a
   *different* report schema (matrix) than N==1.
2. **`langdrift lint`** (`src/lint.ts`) — re-parses scenarios; parse errors
   become lint errors; adds three warnings (single locale, no `en`, cross-file
   locale gaps).
3. **`langdrift init`** (`src/init.ts`) — writes one of four inlined templates
   (`wx` flag, refuses overwrite).
4. **`langdrift translate`** (`src/translate.ts`) — OpenAI-only chat call, JSON
   response mapped to new locale blocks; `--write` appends to the YAML.
5. **Benchmark ingest** (`examples/benchmark/run.ts`) — spawns
   `examples/agent/server.ts` (OpenAI/Anthropic/DeepSeek wrapper over 5-tool
   domains), loops N iterations of `langdrift run --format json`, parses each
   JSON report, aggregates per-locale pass counts + failure-mode counts, computes
   a Wilson 95% CI per locale (`run.ts:171-186`), and overwrites
   `examples/benchmark/results/<model>/<scenario>.md`.

### Key invariants (and where they are enforced vs. assumed)

| Invariant | Enforced | Notes |
|---|---|---|
| Scenario has `id`, `agent`, ≥1 locale, each locale has `input` + ≥1 assertion | `scenario.ts:30-48,173-181` (parse-time) | `agent` is then **never used** by anything |
| YAML indentation is exactly 2 spaces per level, no block scalars, no flow maps | **Assumed** — hand-rolled parser (`scenario.ts:213-252`) silently or confusingly rejects valid YAML | See F-8 |
| `oneOf` has ≥1 entry, inline-list syntax | `scenario.ts:353-373` | commas inside quoted items break (F-7) |
| Argument equality is scalar-normalized | `assertions.ts:285-290` via `String()` | over-normalizes: arrays/objects/null coerce (F-1) |
| `responseLanguage` = script-family check, pass-if-undeterminable | `assertions.ts:13-62,207-259` | Latin-side detector misses Georgian/Ethiopic (F-2) |
| HTTP contract: `{text, toolCalls, structured}`, non-2xx fails locale | `httpTarget.ts` | contract violations silently coerced to empty response (F-21); failures mislabeled `no_tool_call` (F-5) |
| Exit non-zero on failure; `--allow-fail` filters before `--min-pass-rate` | `cli.ts:148-163`; matches `docs/ci.md` | tested only against a **copy** of the function (F-24) |
| Benchmark stats: report Wilson CIs, don't rerun (ADR-003 title) | CI code exists (`run.ts:171-186`, math verified correct) | **no committed artifact contains the CI column** (F-26) |

---

## 2. Findings

Severity: **P1** (wrong results / broken promises), **P2** (real but bounded),
**P3** (polish/debt). Every finding was traced; those actually executed are
marked CONFIRMED (run), those confirmed by full code trace CONFIRMED (trace),
remaining PLAUSIBLE.

### 2.1 Correctness — assertion engine

**F-1 · P1 · `src/assertions.ts:285-290` — `String()` scalar coercion lets non-scalars pass argument assertions.**
`matchesScalar` compares `String(actual) === String(expected)`. `String(["duplicate_charge"])`
is `"duplicate_charge"`, so a tool call whose argument is the *array*
`["duplicate_charge"]` passes the assertion `reason: duplicate_charge`; likewise
`null` passes `x: "null"` and any object passes `"[object Object]"`. An agent
that regresses from a scalar enum to an array of enums keeps passing evals.
CONFIRMED (run). Direction: type-gate first (`typeof actual` must be
string/number/boolean) and only then compare normalized scalars; report a distinct
detail for shape mismatches.

**F-2 · P1 · `src/assertions.ts:62` — `NON_LATIN_PATTERN` omits Georgian and Ethiopic, so fully wrong-script replies pass Latin-locale checks.**
`SCRIPT_PATTERNS` knows `ka` (U+10A0–10FF) and `am` (U+1200–137F), but the
combined `NON_LATIN_PATTERN` used for the Latin-locale dominance check does not
include either range. A reply to an `en`/`fr`/`sw` locale written **entirely in
Amharic or Georgian** passes `responseLanguage: en`. CONFIRMED (run: pure-Amharic
and pure-Georgian texts both passed `en`). The two tables are hand-maintained
duplicates of the same knowledge; they have already drifted. Direction: derive
`NON_LATIN_PATTERN` from `SCRIPT_PATTERNS` (union of values), or use
`\p{Script=Latin}` ratio instead of a blocklist.

**F-3 · P2 · `src/assertions.ts:14-15` — `ja` pattern includes the full CJK Unified block; a pure-Chinese reply passes `responseLanguage: ja`.**
`ja: /[぀-ヿ一-鿿㐀-䶿]/` matches Han-only text with zero kana. A model that
answers a Japanese user in Chinese sails through. CONFIRMED (run). The README's
"cannot distinguish languages that share a script" framing半-covers Han, but the
reverse direction is asymmetric (kana-only Japanese fails `zh`), and the docs
name only `fr`-vs-Latin and `ar/fa/ur` as examples. Related: `ko` (U+AC00–D7AF
syllables only) misses Hangul Jamo/Compatibility-Jamo, and all patterns are
BMP-only (CJK Extension B+ ignored — cosmetic at these thresholds). Direction:
for `ja` require presence of kana, and document the Han asymmetry explicitly.

**F-4 · P2 · `src/assertions.ts:225-238` — inconsistent, generous thresholds make the script check easy to satisfy.**
Non-Latin locales pass if ≥10% of letters are in-script; Latin locales fail only
if >50% are non-Latin. A reply that is 90% English with one trailing Chinese
sentence passes `responseLanguage: zh` (CONFIRMED, run), and a reply that is 50%
Japanese passes `en`. Neither threshold nor the asymmetry is documented.
Direction: single documented dominance threshold, or report the measured ratio in
`detail` so users can see near-misses.

**F-5 · P1 · `src/runner.ts:41-47` — transport failures are classified as `no_tool_call`, the same failure mode as the product's headline finding.**
Any fetch error, non-2xx, or invalid-JSON response is recorded with
`failureMode: "no_tool_call"`. Running against a dead target yields 12 locales ×
`no_tool_call  fetch failed` (CONFIRMED, run). Consequences: (a) `--min-pass-rate`
CI gates treat an agent outage as locale drift; (b) the benchmark aggregator
(`examples/benchmark/run.ts:229-235`) counts these in its `no_tool_call` column —
the exact statistic RESEARCH.md's "the dominant failure mode … is `no_tool_call`"
claim rests on. I grepped all 18 committed result files for `HTTP … from target` /
`fetch failed` / `invalid JSON response` and found none, so the *published* data
is clean — but nothing in the pipeline guarantees that. `docs/integrations.md:174`
documents the mislabeling, which makes it deliberate but no less corrosive.
Direction: introduce a distinct `target_error` failure mode (excluded from
behavioral stats and, arguably, fail-fast in CI).

**F-6 · P2 · `src/assertions.ts:170-205` — sequence assertion misreports argument mismatches as `wrong_sequence` and skips silently.**
`assertToolCallSequence` advances only when name *and* args match; a call with
the right name but wrong arguments is skipped without note, and the eventual
failure says `sequence incomplete, missing: X` — pointing the user at a missing
call that was in fact present with bad args (the `wrong_argument` mode never
fires from sequences). CONFIRMED (trace; the greedy skip itself is correct for
subsequence semantics). Direction: remember the best near-miss and surface it in
`detail`.

### 2.2 Correctness — scenario parser (hand-rolled YAML)

**F-7 · P2 · `src/scenario.ts:353-373` — `oneOf` items containing quoted commas are mangled.**
`oneOf: ["a, b", c]` parses to `["\"a", "b\"", "c"]` — naive `split(",")`
before unquoting. CONFIRMED (run). Silent: the assertion then matches garbage.
Direction: split respecting quotes, or reject quoted items containing commas.

**F-8 · P2 · `src/scenario.ts` (whole file) — only exactly-2-space indentation is a scenario; valid YAML is rejected with misleading errors.**
A 4-space-indented file (valid YAML) fails with `expected at least one locale`;
tab indentation likewise; a block scalar (`input: |`) fails with
`expected "key: value"` on the continuation line; flow mappings and multi-line
inputs are unsupported. None of this is documented — the README calls the files
"YAML scenarios". CONFIRMED (run, all four). Direction: either document "a strict
2-space-indented YAML subset" prominently with better error messages
(`line N: expected 2-space indentation`), or adopt a real YAML parser (the
zero-dependency constraint is a design choice worth revisiting — see §3).

**F-9 · P2 · `src/scenario.ts:267-297` — an empty `noToolCall:` block steals the next `name:` in the block, producing a self-contradictory assertion.**
```yaml
expect:
  noToolCall:
  toolCall:
    name: create_refund
```
parses to `noToolCall.name == toolCall.name == "create_refund"` — the expected
tool is also forbidden, so the locale can never pass, with a baffling
`forbidden_tool` failure. Cause: `nestedScalarAt` searches for `name` at indent 8
anywhere after the `noToolCall` line, unscoped to its sub-block. CONFIRMED (run).
Direction: scope nested lookups to the parent's indentation block.

**F-10 · P3 · `src/scenario.ts:195-208` — duplicate locale keys silently last-win.**
Two `en:` blocks → the second replaces the first, no parse error, no lint
warning. CONFIRMED (run). A copy-paste error silently halves coverage.

**F-11 · P3 · `src/scenario.ts:76-91` — `anyOf` / `toolCalls` list items without a `name:` are silently dropped.**
A typo (`nme:`) weakens the assertion set with no error (`parseToolCallList`
only pushes items that yielded a name). CONFIRMED (trace). Lint should flag
list items that contribute nothing.

### 2.3 Benchmark ingest & stats integrity

**F-12 · P1 · `examples/benchmark/run.ts:201-208` — the failure-mode column list omits `wrong_language`; such failures vanish from the table.**
`failureModes` enumerates six modes but not `wrong_language` (added in 0.2.2).
A `wrong_language` failure decrements Pass but appears in **no** failure column,
so rows stop summing and the mode is invisible in published artifacts. (It also
silently absorbs the mislabeled transport failures per F-5.) CONFIRMED (trace).
Direction: derive the list from the `FailureMode` union in `src/types.ts` —
today the benchmark keeps a second, already-stale copy of that enum.

**F-13 · P2 · `examples/benchmark/results/**` — the committed dataset was produced by three different generator schemas, and none contains the CI column the writeup points readers to.**
Header inspection of all 18 files: gpt-4o-mini and claude-haiku files have
neither `wrong_sequence` nor `95% CI` columns (oldest generator); deepseek files
have `wrong_sequence` but no CI; the current `run.ts` emits both. RESEARCH.md:60
says "The benchmark report now prints a 95% Wilson confidence interval per
locale, and per-cell pass rates throughout this document should be read as
estimates with that uncertainty" — but no committed report shows any CI.
ADR-003's title ("report CIs, not rerun benchmark") explains *why* the data
wasn't regenerated, yet the result is a writeup citing uncertainty numbers that
exist nowhere in the repo. CONFIRMED (verified all 18 headers). Direction:
either append a generated CI appendix computed *from* the committed pass counts
(no rerun needed — the CI is a pure function of `passes/n`), or state explicitly
that CIs appear in reports generated ≥0.3.0 only.

**F-14 · P1 · `RESEARCH.md:19-50` — the "Failing locale checks" columns silently omit failing locales, and at least one omission breaks any consistent "worst-N" reading.**
I recounted every committed result table. All 18 headline pass rates match
RESEARCH.md exactly (e.g. haiku support-routing 71/120, deepseek
ecommerce-track 50/120, gpt scheduling-book-new 0/120) — the totals are honest.
But the per-row failing-locale lists are truncated with no stated rule:
- haiku support-routing lists 7 locales; the artifact shows 10 failing (ar 9/10,
  ru 8/10, id 7/10 omitted).
- haiku ecommerce-track-order lists `mn (0/10), cy (1/10), eu (1/10), en (3/10),
  sw (4/10)` — but omits **zh (2/10)** and id (5/10). zh at 2/10 is *worse* than
  two listed cells, so this is not a "worst five" cut; it reads like an
  accidental drop.
- haiku scheduling-book-new omits vi/yo/eu (all 4/10, equal to the listed ar).
- deepseek support-cancel, ecommerce-cancel, ecommerce-track, and
  scheduling-reschedule each omit 2 locales failing at 9/10; haiku
  scheduling-reschedule and support-cancel omit 9/10 cells too.
Only the gpt-4o-mini rows and two deepseek rows are complete. For a document
whose thesis is cross-model recurrence of per-locale failures, incomplete
per-locale lists understate several recurrences (e.g. zh recurs on haiku more
than the writeup shows). CONFIRMED (recounted all 18 tables). Direction: state
the truncation rule ("locales with ≤6/10 shown") or list all failing cells; fix
the zh omission either way.

**F-15 · P3 · `examples/benchmark/run.ts:171-186` — Wilson interval math is correct (verified: 7/10 → [0.397, 0.892]); but it is untested and unused by anything else.**
No unit test covers `wilsonInterval` — the one piece of stats math the research
document leans on. CONFIRMED (run: matches reference values, incl. 0/10 →
[0, 0.278]). Direction: move it into `src/` with tests, and have the CLI's own
JSON report emit it, so the "report CIs" ADR is enforced by the tool rather than
by one example script.

**F-16 · P3 · `examples/benchmark/run.ts:79-84` — the SIGKILL fallback is dead code.**
`subprocess.killed` is true as soon as `kill("SIGINT")` *delivers* the signal,
not when the process exits, so `if (!server.killed) server.kill("SIGKILL")` can
never fire and a SIGINT-ignoring agent server outlives the benchmark. PLAUSIBLE
(Node semantics; not experimentally provoked). Also: a single malformed
`langdrift` stdout aborts the whole multi-iteration benchmark, discarding all
completed iterations (`parseJsonRun` throws mid-loop), and each run silently
overwrites the previous results file — repeated ingestion keeps no history.

### 2.4 Alternative / unintended paths

**F-17 · P2 · `src/httpTarget.ts:14-36` — no request timeout; one hung locale hangs the entire run (and CI job) forever.**
`fetch` has no `AbortSignal`; the runner is fully serial
(`runner.ts:32-61`), so iterations × locales requests execute one at a time with
unbounded patience. CONFIRMED (trace). Direction: `AbortSignal.timeout(30_000)`
+ a `--timeout` flag; classify as `target_error` (F-5).

**F-18 · P3 · `src/cli.ts:51-59` — a stray `-v`/`-h` anywhere hijacks any command.**
`langdrift run s.yaml --target http://x -v` prints the version and exits 0 —
in a CI script, that is a silent green. CONFIRMED (trace: `args.includes` runs
before command parsing). Similarly `--target --format` swallows the next flag as
the target URL (no URL validation), producing a confusing `fetch failed` run.

**F-19 · P3 · `src/cli.ts:127,148-163` — `--allow-fail` accepts any string; typos silently do nothing.**
`--allow-fail ue` (transposed `eu`) filters no results and the build fails with
no hint. No validation against the scenario's locale set. CONFIRMED (trace).

**F-20 · P2 · `src/cli.ts:109-145` — directory runs change output schema based on file count.**
A directory with two YAMLs emits the matrix JSON shape; the same directory with
one YAML emits the single-run shape (`isMatrix = paths.length > 1`). Downstream
tooling parsing `runs[]` breaks the day a scenarios directory shrinks to one
file. CONFIRMED (trace). Direction: directory input ⇒ matrix shape, always.

**F-21 · P3 · `src/httpTarget.ts:61-94` — contract violations are silently coerced instead of surfaced.**
A body of `"ok"`, `[]`, or `{toolCalls: "create_refund_ticket"}` normalizes to
`{text:"", toolCalls:[], structured:null}` and fails as `no_tool_call`,
hiding an integration bug behind a behavioral verdict; tool-call items without a
string `name` are dropped silently. CONFIRMED (trace). A "malformed response"
detail would save integrators real time.

### 2.5 Incoherences

**F-22 · P2 · `src/types.ts:3` / `src/scenario.ts:34-36` — `agent` is a required field that nothing reads.**
It is parsed, validated as required, and then never used: not sent to the target
(`httpTarget.ts:25-29`), not reported, not matched against anything. The repo's
own `examples/scenarios/support-routing.yaml:2` sets `agent: generic` under a
"Domain: support" header comment and nothing notices. CONFIRMED (grep: only
tests read `.agent`). Direction: either send it in the POST payload (useful
routing metadata) or make it optional and deprecate.

**F-23 · P2 · `tests/ci.test.ts:22-37` — the CI-gate logic is tested via a copy-pasted duplicate, not the real function.**
`shouldFail` in `src/cli.ts:148` is not exported, so the test file re-implements
it verbatim. The nine gate tests would keep passing if `cli.ts`'s copy regressed.
(The comment at `ci.test.ts:63` — "fails at 70 threshold but passes at 70" — is
self-contradictory, a smell of the drift risk.) CONFIRMED (read both).
Direction: export `shouldFail` (or move to a `gate.ts`) and import it in tests.

**F-24 · P3 · `CHANGELOG.md` 0.2.0 — claims `langdrift lint` validates "duplicate IDs"; no such check exists.**
`src/lint.ts` checks locale count, `en` presence, and cross-file locale gaps
only; nothing detects two files sharing a scenario `id` (which would collide in
matrix reports keyed by `scenarioId`). CONFIRMED (read). Either the feature was
lost or the changelog was aspirational.

**F-25 · P3 · `src/types.ts:9-13` — `ArgMatcher` promises `number | boolean` values the parser can never produce.**
`parseScalar`/`parseInlineList` return strings only; the numeric/boolean arms of
the type (and of `oneOf`'s array) are reachable only by hypothetical programmatic
callers — who cannot exist, because nothing is exported from the package (F-27).
CONFIRMED (trace).

**F-26 · P3 · `.gitignore:9` — stale path `examples/deepseek-support-agent/benchmark-results.md` (directory no longer exists).**

### 2.6 Affordance & missing functionality

**F-27 · P2 · `package.json` — no `main`/`exports`/`types`: the npm package has no programmatic surface.**
`import anything from "langdrift"` fails against the published package;
`declaration: false` in `tsconfig.build.json` means no types ship either. The
README's "small, inspectable core" and the well-typed internal modules suggest a
library; the artifact is CLI-only. Fine as a decision — but then `types.ts`'s
doc-comments about consumer-facing shapes are aspirational. CONFIRMED (read
package.json + build output). Direction: either add
`exports` + declarations for `parseScenario`/`runScenario`/`assertExpectedToolCall`,
or state "CLI-only" in the README.

**F-28 · P3 · `src/types.ts:25-27` — `noToolCall` forbids exactly one tool.**
No way to say "don't call any of [escalate_to_human, contact_seller]" without
… nothing; there is no workaround. Scenario authors will want a list within a
week of real use.

**F-29 · P3 · `src/lint.ts` — lint misses every scenario-level trap this audit found.**
No warnings for: `responseLanguage` locale not in either script table (the check
is then a silent no-op — README documents pass-on-unknown but lint should say
"this assertion cannot fail"); duplicate locale keys (F-10); nameless anyOf
items (F-11); empty `noToolCall:` (F-9); `agent`/domain mismatch (F-22).
Lint is the natural home for all of these.

**F-30 · P3 · `src/translate.ts:139-187` — `serializeExpect` drops `responseLanguage` and silently drops locales the LLM didn't return.**
Generated locale blocks copy `toolCall`/`toolCalls`/`noToolCall` but never emit a
`responseLanguage` (arguably it should emit `responseLanguage: <target>` — the
one assertion translate could add for free). `callLlm` filters out locales
missing from the LLM's JSON with no warning (`translate.ts:134-136`): ask for 5
locales, get 3, no error. CONFIRMED (trace + run).

**F-31 · P1 · `src/translate.ts:150-152` — `oneOf` matchers serialize as `[object Object]`.**
`lines.push(\`      ${k}: ${v}\`)` template-stringifies `ArgMatcher` values;
translating any scenario that uses `oneOf` (the 0.3.0 flagship feature) emits
`reason: [object Object]` into the YAML snippet / file. CONFIRMED (run, against
a mock LLM server; output reproduced exactly). The two flagship 0.3.0 features
are mutually broken through `translate`. Direction: serialize matchers back to
`oneOf: [a, b]` form; add a round-trip test (parse → serialize → parse).

### 2.7 Documentation

**F-32 · P2 · `docs/ci.md:76-79` — the recommended readiness probe cannot succeed against agents shaped like the repo's own.**
`npx wait-on http://127.0.0.1:3010/api/agent` requires a 2xx; both bundled agent
servers return 404 for anything but `POST /api/agent`
(`examples/agent/server.ts:28-31`), so the copy-pasted workflow times out after
15s even when the agent is healthy. PLAUSIBLE (wait-on semantics not executed
here; server behavior confirmed). Direction: recommend `wait-on tcp:3010`, or
add a GET health route to the example servers.

**F-33 · P3 · `README.md:155` — the script-check caveats undersell the holes.**
"For a locale whose script LangDrift cannot determine, the check passes" is
honest, but the documented examples omit that (a) `ja` accepts pure-Han Chinese
(F-3), (b) Latin locales accept Georgian/Ethiopic entirely (F-2), (c) 10% of
in-script letters suffices (F-4). A skeptical reader of README §Assertions would
still be surprised by all three behaviors.

**F-34 · P3 · `examples/scenarios/scheduling-book-new.yaml:76` — the Yoruba input likely says *Sunday*, not Monday.**
`ní òwúrọ̀ ọjọ́ Àìkú` — *ọjọ́ Àìkú* is Sunday in Yoruba (Monday is *ọjọ́ Ajé*);
every other locale says Monday morning. Day-of-week is immaterial to the
`check_availability` assertion, but it is exactly the "unreviewed locale
prompts" confound RESEARCH.md:62 warns about, sitting in the shipped eval suite.
PLAUSIBLE (not native-verified).

**F-35 · P3 · `src/reportMarkdown.ts:3-28` — the CI-recommended format drops the failure `Detail` column.**
Terminal output includes per-locale detail strings; the markdown table
(recommended for `$GITHUB_STEP_SUMMARY` in docs/ci.md) shows only the mode, so
"expected X, got Y" is invisible exactly where triage happens. Also
`formatMarkdownMatrixReport` bolds *passing* cells (inverted salience) and does
not escape `|` in scenario ids.

**F-36 · P3 · `package.json:59-60` — `engines: node >=24` is stricter than reality and unqualified.**
The full test suite, build, and CLI run on Node 22.22 (type stripping + compiled
dist). Consumers of the compiled package on Node 20/22 get engine warnings for
no runtime reason; the constraint exists for clone-mode type-stripping only.
CONFIRMED (run on v22.22.2).

### 2.8 Developer experience / CI

**F-37 · P2 · `.github/workflows/ci.yml` — CI never runs `pnpm build`.**
Lint, typecheck (`noEmit`), and tests all exercise the `.ts` source; the compiled
artifact (`tsconfig.build.json`, extension rewriting, shebang survival) is
validated only by the release script's smoke test. A build-only breakage merges
green and blocks at release time. CONFIRMED (read; `pnpm build` verified working
today). Direction: add `pnpm build && node dist/cli.js --version` to CI.

**F-38 · P2 · test coverage is concentrated on assertions/parser; the I/O half of the product is untested.**
Zero tests for: `httpTarget` normalization (F-21), `runner` aggregation
(first-fail representative logic), matrix reporters, `resolveScenarioPaths`,
`lint` rules, `translate` serialization (would have caught F-31), `wilsonInterval`
(F-15), and real CLI arg parsing (`shouldFail` tested only as a copy, F-23).
CONFIRMED (read both test files; suite = 39 tests, 419ms).

**F-39 · P3 · `scripts/release.sh` — solid overall (smoke-tests the packed tarball before bumping — good), but the check `git rev-list HEAD..origin/main` only catches being *behind*; unpushed local commits ride into the tag, and `CHANGELOG.md` is neither verified nor shipped (not in `files`).**

---

## 3. Design tensions

**T-1. The hand-rolled YAML subset is the largest bug factory in the repo, defending a "zero runtime dependencies" line item.**
F-7, F-8, F-9, F-10, F-11 all live in `scenario.ts`'s indentation-arithmetic
parser, and its rigidity (2-space only, no block scalars, no flow maps) directly
constrains scenario authors — multi-line inputs, the most natural thing in a
prompt-testing tool, are unsupported. Alternatives: (a) vendor a small YAML
parser (`yaml` is one dependency; the README's "zero runtime dependencies" is a
marketing line, not a security posture — the CLI already shells out to the
network); (b) keep the subset but specify it: publish a grammar, fix block
scoping, and emit precise indentation errors. The current middle ground —
YAML-looking files with silently different semantics — is the worst option.

**T-2. Failure modes are the product, but the taxonomy has no slot for "the harness failed".**
The pitch is failure-mode classification (`no_tool_call`, `wrong_tool`, …), yet
transport errors masquerade as `no_tool_call` (F-5), sequence argument
mismatches masquerade as `wrong_sequence` (F-6), and `wrong_language` doesn't
exist in the benchmark schema (F-12). One `FailureMode` union in `types.ts`
should be the single source of truth, consumed by the benchmark, with an
explicit `target_error` member. As long as infrastructure noise and model
behavior share labels, every aggregate statistic is one outage away from
corruption.

**T-3. The research artifact and the tool have drifted into three timelines.**
Code (CI-emitting, wrong_sequence-aware), committed benchmark data (three
generator generations, no CIs), and RESEARCH.md (cites CIs that appear nowhere,
truncates failing-locale lists inconsistently — F-13, F-14). ADR-003's
"report CIs, don't rerun" is a sound anti-p-hacking stance, but the repo needs a
mechanical link: regenerate the *presentation* (CIs are a pure function of the
committed pass counts) without regenerating the *data*, and make RESEARCH.md's
tables generated-from-artifacts rather than hand-copied.

**T-4. CLI-only artifact wearing a library's skin.**
Well-typed modules, exported functions, doc-commented types — and no
`exports`/`main`/`types` in the package (F-27), so none of it is reachable.
Tests already import the internals; external users get a copy-paste duplicate of
`shouldFail`-style logic (F-23 is the in-repo symptom of the same disease).
Decide: ship the API (index.ts + declarations + semver discipline) or declare
CLI-only and collapse `types.ts`'s public-shape pretensions.

**T-5. `responseLanguage`'s "never false-positive on uncertainty" policy is undermined by false negatives it can't see.**
ADR-001's premise (script check over language ID) is defensible: no deps, no
model, explainable. But the implementation direction is asymmetric in the unsafe
direction — unknown locale passes, Georgian/Ethiopic pass Latin checks, 10%
in-script passes, Han passes `ja`. A check whose failure is meaningful but whose
pass is nearly meaningless should say so in its `detail` on every pass
(`checked: script-family only, ratio 0.93`), or graduate to
`\p{Script=…}` property classes which Node's regex engine already supports and
which would delete both hand-maintained tables.

---

## 4. Expectation gaps

- **Expected** `npm install langdrift` to give me an importable API for the
  documented types; **found** a CLI-only package with no `exports` and no
  shipped types (F-27).
- **Expected** "YAML scenarios" to mean YAML; **found** a 2-space-indented
  subset where block scalars, tabs, and 4-space indents fail with unrelated
  error messages (F-8).
- **Expected** a `no_tool_call` verdict to mean the model didn't call a tool;
  **found** it also means "the server was down" (F-5).
- **Expected** the required `agent:` field to do something; **found** it is
  never read, and the repo's own scenario sets it to the wrong value (F-22).
- **Expected** `responseLanguage: en` to fail on a fully Amharic reply;
  **found** it passes (F-2).
- **Expected** `translate` to round-trip the 0.3.0 `oneOf` feature; **found**
  `reason: [object Object]` (F-31).
- **Expected** RESEARCH.md's per-scenario failing-locale lists to be complete
  (or a stated top-N); **found** unexplained omissions, including a cell worse
  than listed ones (F-14).
- **Expected** the writeup's Wilson CIs to be visible in the committed
  benchmark reports it describes; **found** no CI column in any of the 18 files
  (F-13).
- **Expected** the CI-gate math to be covered by its tests; **found** the tests
  exercise a copy-pasted duplicate (F-23).
- **Expected** CI to build the artifact npm ships; **found** only the release
  script does (F-37).

## 5. Open questions

1. **ADR bodies:** the four ADRs are age-encrypted here. Does ADR-001 discuss
   the Han/`ja` asymmetry and the Latin-blocklist approach (F-2/F-3), or were
   those unexamined? Does ADR-003 sanction regenerating *presentation* from
   committed counts (the F-13 fix), or freeze the artifacts byte-for-byte?
2. **Is `agent:` reserved for a future feature** (per-agent target routing?) or
   vestigial? If reserved, it should at least be sent in the POST body.
3. **Is the package intended to grow a programmatic API** (matrix runners,
   custom reporters would want one), or is CLI-only the durable position?
4. **What is the intended truncation rule** for RESEARCH.md's failing-locale
   columns — worst-N, ≤ threshold, or narrative pick? The haiku
   ecommerce-track row (zh 2/10 omitted) satisfies none of them.
5. **Node 24 floor:** deliberate simplification, or accidental coupling of the
   clone-mode requirement to the published-package requirement (F-36)?
6. **Was `lint`'s "duplicate IDs" check (CHANGELOG 0.2.0) removed deliberately**
   (F-24), and should matrix reports collide-check `scenarioId` instead?

---

*All findings verified against commit `d34d30f`. Test suite, `pnpm typecheck`,
`pnpm lint`, and `pnpm build` all pass on this tree; nothing in this audit
modified tracked files other than adding this report.*
