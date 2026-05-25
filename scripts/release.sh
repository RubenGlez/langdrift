#!/usr/bin/env bash
set -e

if [ -z "$1" ]; then
  echo "Usage: pnpm release <patch|minor|major|x.y.z>"
  exit 1
fi

pnpm lint
pnpm typecheck
pnpm test

pnpm version "$1"

VERSION=$(node -p "require('./package.json').version")

git push origin HEAD "v$VERSION"
gh release create "v$VERSION" --generate-notes --title "v$VERSION"
