#!/usr/bin/env bash
# publish-to-github.sh
# Usage: bash scripts/publish-to-github.sh <repo-url>
# Example: bash scripts/publish-to-github.sh https://github.com/mo7ammed-saleh/SQU_smart_weather_station.git
#
# Requires GITHUB_TOKEN to be set in Replit Secrets.
# The token must have 'repo' scope (classic PAT) or Contents: Read+write
# permission on the target repository (fine-grained PAT).

set -e

REPO_URL="${1}"

if [ -z "$REPO_URL" ]; then
  echo "Usage: bash scripts/publish-to-github.sh <repo-url>"
  echo "Example: bash scripts/publish-to-github.sh https://github.com/mo7ammed-saleh/SQU_smart_weather_station.git"
  exit 1
fi

if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GITHUB_TOKEN is not set."
  echo "Store your GitHub Personal Access Token as a Replit Secret named GITHUB_TOKEN."
  echo "See README.md → 'Publishing to GitHub' for instructions."
  exit 1
fi

# Strip any existing credentials from the URL and inject the token
CLEAN_URL=$(echo "$REPO_URL" | sed 's|https://[^@]*@|https://|')
AUTH_URL=$(echo "$CLEAN_URL" | sed "s|https://|https://$GITHUB_TOKEN@|")

echo "Setting remote origin..."
git remote set-url origin "$AUTH_URL"

echo "Pushing to GitHub..."
git push origin main

# Remove token from local git config — never leave credentials in remote URL
echo "Cleaning up credentials from remote config..."
git remote set-url origin "$CLEAN_URL"

echo "Done. Code is live at: $REPO_URL"
