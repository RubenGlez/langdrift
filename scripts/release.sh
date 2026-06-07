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

pnpm lint
pnpm typecheck
pnpm test
pnpm audit --audit-level=high --prod

npm version "$BUMP" --no-git-tag-version

VERSION=$(node -p "require('./package.json').version")
TAG="v$VERSION"

git add package.json
git commit -m "$TAG"
git tag "$TAG"
git push && git push --tags

gh release create "$TAG" --generate-notes --title "$TAG"
pnpm publish --provenance --no-git-checks
