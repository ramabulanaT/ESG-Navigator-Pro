#!/bin/bash

# Check for Duplicate Claude Branches
# Purpose: Warn before creating a new branch if similar ones exist
# Usage: ./scripts/check-duplicate-branches.sh <proposed-branch-name>

set -e

PROPOSED_BRANCH="$1"

if [ -z "$PROPOSED_BRANCH" ]; then
  echo "Usage: $0 <proposed-branch-name>"
  exit 1
fi

# Extract feature name (remove UUID suffix if present)
FEATURE_NAME=$(echo "$PROPOSED_BRANCH" | sed -E 's/-[0-9A-Za-z]{24,}$//')

# Colors
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Fetch latest branches quietly
git fetch origin --prune 2>/dev/null || true

# Find similar branches
SIMILAR_BRANCHES=$(git branch -r | grep -E "origin/claude/.*${FEATURE_NAME}" | sed 's|origin/||' || true)

if [ -z "$SIMILAR_BRANCHES" ]; then
  echo -e "${GREEN}✓ No duplicate branches found for feature: ${FEATURE_NAME}${NC}"
  exit 0
fi

# Count similar branches
COUNT=$(echo "$SIMILAR_BRANCHES" | wc -l)

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}⚠️  WARNING: Found ${COUNT} similar branch(es)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Feature: ${FEATURE_NAME}"
echo ""
echo "Existing branches:"
echo "$SIMILAR_BRANCHES" | while read -r branch; do
  # Get last commit date
  LAST_COMMIT=$(git log -1 --format="%cr" "origin/$branch" 2>/dev/null || echo "unknown")
  echo -e "  • $branch ${RED}(updated: $LAST_COMMIT)${NC}"
done
echo ""
echo -e "${YELLOW}Consider reusing an existing branch or cleaning up old branches first.${NC}"
echo -e "${GREEN}Run: ${NC}./scripts/cleanup-claude-branches.sh --dry-run"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

exit 1
