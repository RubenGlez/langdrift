# CI Integration

LangDrift exits non-zero on failure, so it works as a CI gate out of the box. This page covers the two flags that make it practical: `--min-pass-rate` and `--allow-fail`.

## Exit behavior

By default, `langdrift run` exits `1` if any locale fails. In CI that means a single flaky locale blocks every merge. The two gate flags let you tune this.

## `--min-pass-rate N`

Exit non-zero only if the overall pass rate falls below N percent (0–100).

```bash
# Pass as long as 90% of locale checks pass
langdrift run ./scenarios/support-routing.yaml \
  --target http://127.0.0.1:3010/api/agent \
  --iterations 3 \
  --min-pass-rate 90
```

Useful when you have known-flaky locales and don't want to block on occasional noise, but still want to catch regressions.

## `--allow-fail <locale>`

Exclude specific locales from the exit code calculation. Repeatable.

```bash
# eu and yo failures are known; don't block CI on them
langdrift run ./scenarios/support-routing.yaml \
  --target http://127.0.0.1:3010/api/agent \
  --allow-fail eu \
  --allow-fail yo
```

Allowed-fail locales still appear in the report. They just don't count toward failure.

## Combining both flags

`--allow-fail` filters before `--min-pass-rate` is evaluated. Allowed-fail locales are excluded from the pass rate calculation entirely.

```bash
langdrift run ./scenarios/ \
  --target http://127.0.0.1:3010/api/agent \
  --iterations 3 \
  --min-pass-rate 85 \
  --allow-fail eu \
  --allow-fail yo
```

## GitHub Actions

```yaml
name: Locale eval

on:
  pull_request:
  push:
    branches: [main]

jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 24

      - name: Install langdrift
        run: npm install -g langdrift

      - name: Start agent
        run: node ./your-agent/server.js &
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

      - name: Wait for agent
        run: npx wait-on http://127.0.0.1:3010/api/agent --timeout 15000

      - name: Run locale eval
        run: |
          langdrift run ./scenarios/ \
            --target http://127.0.0.1:3010/api/agent \
            --iterations 3 \
            --min-pass-rate 85 \
            --allow-fail eu \
            --format markdown >> $GITHUB_STEP_SUMMARY
```

The `--format markdown` flag writes the results table directly into the GitHub Actions job summary, visible on the PR checks page without downloading any artifacts.

### Emit JSON for downstream tooling

```yaml
      - name: Run locale eval (JSON)
        run: |
          langdrift run ./scenarios/ \
            --target http://127.0.0.1:3010/api/agent \
            --iterations 3 \
            --min-pass-rate 85 \
            --format json > results.json

      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: locale-eval-results
          path: results.json
```
