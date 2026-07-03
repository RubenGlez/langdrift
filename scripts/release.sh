#!/usr/bin/env bash
set -e

BUMP="${1:-patch}"

if [[ ! "$BUMP" =~ ^(patch|minor|major)$ ]]; then
  echo "Usage: release.sh [patch|minor|major]"
  exit 1
fi

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
  echo "Must be on main (currently on $BRANCH)"
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree is dirty — commit or stash changes first"
  exit 1
fi

git fetch origin main
BEHIND=$(git rev-list HEAD..origin/main --count)
if [ "$BEHIND" != "0" ]; then
  echo "Branch is $BEHIND commit(s) behind origin/main — pull first"
  exit 1
fi

# Being level-with-or-behind isn't enough: unpushed local commits would ride
# into the tag from an unpublished state. Require the tree to be pushed first.
AHEAD=$(git rev-list origin/main..HEAD --count)
if [ "$AHEAD" != "0" ]; then
  echo "Branch is $AHEAD commit(s) ahead of origin/main — push first"
  exit 1
fi

pnpm lint
pnpm typecheck
pnpm test
pnpm audit --audit-level=high --prod

# Smoke test the publishable artifact: pack (runs the prepack build), install the
# tarball in a throwaway dir, and run the installed bin. Running raw .ts under
# node_modules fails, so this guards against shipping a package that cannot run.
# Done before the version bump so a broken package aborts with no side effects.
echo "Smoke testing the packaged CLI..."
SMOKE_DIR=$(mktemp -d)
npm pack --pack-destination "$SMOKE_DIR" >/dev/null
SMOKE_TARBALL=$(ls "$SMOKE_DIR"/*.tgz)
if (cd "$SMOKE_DIR" \
  && npm init -y >/dev/null 2>&1 \
  && npm install "$SMOKE_TARBALL" --no-audit --no-fund --silent >/dev/null 2>&1 \
  && node ./node_modules/.bin/langdrift --version >/dev/null); then
  rm -rf "$SMOKE_DIR"
  echo "Smoke test passed."
else
  rm -rf "$SMOKE_DIR"
  echo "Smoke test failed: the packaged CLI does not run when installed. Aborting (no version bumped, nothing published)."
  exit 1
fi

npm version "$BUMP" --no-git-tag-version

VERSION=$(node -p "require('./package.json').version")
TAG="v$VERSION"

# The changelog ships in the package (see package.json "files"); make sure it
# actually documents this version before tagging.
if ! grep -q "$VERSION" CHANGELOG.md; then
  echo "CHANGELOG.md has no entry for $VERSION — add one before releasing. Reverting version bump."
  git checkout package.json
  exit 1
fi

git add package.json CHANGELOG.md
git commit -m "$TAG"
git tag "$TAG"
git push && git push --tags

gh release create "$TAG" --generate-notes --title "$TAG"
pnpm publish --no-git-checks
