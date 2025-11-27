#!/bin/bash

# Claude Branch Cleanup Script
# Purpose: Prevent duplicate Claude branches by cleaning up old/merged branches
# Usage: ./scripts/cleanup-claude-branches.sh [--dry-run] [--auto] [--keep-recent N]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DRY_RUN=false
AUTO_MODE=false
KEEP_RECENT=3  # Keep the N most recent branches by default
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --auto)
      AUTO_MODE=true
      shift
      ;;
    --keep-recent)
      KEEP_RECENT="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--dry-run] [--auto] [--keep-recent N]"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   Claude Branch Cleanup Tool${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}🔍 DRY RUN MODE - No branches will be deleted${NC}"
  echo ""
fi

# Fetch latest remote branches
echo -e "${BLUE}📡 Fetching remote branches...${NC}"
git fetch origin --prune

# Get all Claude branches (remote and local)
echo -e "${BLUE}🔍 Scanning for Claude branches...${NC}"
REMOTE_CLAUDE_BRANCHES=$(git branch -r | grep 'origin/claude/' | sed 's|origin/||' | sort || true)
LOCAL_CLAUDE_BRANCHES=$(git branch | grep 'claude/' | sed 's/^[ *]*//' | sort || true)

# Count branches
REMOTE_COUNT=$(echo "$REMOTE_CLAUDE_BRANCHES" | grep -c 'claude/' || echo "0")
LOCAL_COUNT=$(echo "$LOCAL_CLAUDE_BRANCHES" | grep -c 'claude/' || echo "0")

echo -e "${GREEN}✓ Found ${REMOTE_COUNT} remote Claude branches${NC}"
echo -e "${GREEN}✓ Found ${LOCAL_COUNT} local Claude branches${NC}"
echo ""

if [ "$REMOTE_COUNT" -eq 0 ] && [ "$LOCAL_COUNT" -eq 0 ]; then
  echo -e "${GREEN}✓ No Claude branches to clean up!${NC}"
  exit 0
fi

# Function to check if branch is merged
is_merged() {
  local branch=$1
  local target=${2:-main}

  # Check if main branch exists, if not try master
  if ! git rev-parse --verify main >/dev/null 2>&1; then
    if git rev-parse --verify master >/dev/null 2>&1; then
      target="master"
    else
      # If neither main nor master exists, use the default branch
      target=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || echo "main")
    fi
  fi

  # Check if branch is merged into target
  if git merge-base --is-ancestor "origin/$branch" "origin/$target" 2>/dev/null; then
    return 0
  else
    return 1
  fi
}

# Function to get branch last commit date
get_branch_date() {
  local branch=$1
  git log -1 --format=%ci "origin/$branch" 2>/dev/null || echo "unknown"
}

# Group branches by feature name (removing UUID suffix)
declare -A BRANCH_GROUPS
for branch in $REMOTE_CLAUDE_BRANCHES; do
  # Extract feature name (everything before the last hyphen and UUID)
  FEATURE_NAME=$(echo "$branch" | sed -E 's/-[0-9A-Za-z]{24,}$//')
  if [ ! -z "$FEATURE_NAME" ]; then
    BRANCH_GROUPS["$FEATURE_NAME"]+="$branch "
  fi
done

# Detect duplicate branches (multiple branches for same feature)
echo -e "${YELLOW}🔍 Detecting duplicate branches...${NC}"
echo ""

BRANCHES_TO_DELETE_REMOTE=()
BRANCHES_TO_DELETE_LOCAL=()

for FEATURE in "${!BRANCH_GROUPS[@]}"; do
  BRANCHES=(${BRANCH_GROUPS[$FEATURE]})
  BRANCH_COUNT=${#BRANCHES[@]}

  if [ "$BRANCH_COUNT" -gt 1 ]; then
    echo -e "${YELLOW}⚠️  Found ${BRANCH_COUNT} branches for feature: ${FEATURE}${NC}"

    # Sort branches by date (newest first)
    SORTED_BRANCHES=()
    for branch in "${BRANCHES[@]}"; do
      DATE=$(get_branch_date "$branch")
      SORTED_BRANCHES+=("$DATE|$branch")
    done

    # Sort and keep only the most recent
    IFS=$'\n' SORTED=($(sort -r <<<"${SORTED_BRANCHES[*]}"))
    unset IFS

    KEEP_COUNT=0
    for item in "${SORTED[@]}"; do
      BRANCH=$(echo "$item" | cut -d'|' -f2)
      DATE=$(echo "$item" | cut -d'|' -f1)

      if [ "$KEEP_COUNT" -lt "$KEEP_RECENT" ] && [ "$BRANCH" != "$CURRENT_BRANCH" ]; then
        echo -e "  ${GREEN}✓ KEEP${NC} $BRANCH (updated: $DATE)"
        KEEP_COUNT=$((KEEP_COUNT + 1))
      else
        if [ "$BRANCH" = "$CURRENT_BRANCH" ]; then
          echo -e "  ${BLUE}🔒 KEEP${NC} $BRANCH (current branch)"
        else
          MERGED_STATUS=""
          if is_merged "$BRANCH"; then
            MERGED_STATUS=" ${GREEN}[merged]${NC}"
          fi
          echo -e "  ${RED}✗ DELETE${NC} $BRANCH (updated: $DATE)$MERGED_STATUS"
          BRANCHES_TO_DELETE_REMOTE+=("$BRANCH")
        fi
      fi
    done
    echo ""
  fi
done

# Check for merged branches that should be deleted
echo -e "${BLUE}🔍 Checking for merged branches...${NC}"
for branch in $REMOTE_CLAUDE_BRANCHES; do
  if [[ ! " ${BRANCHES_TO_DELETE_REMOTE[@]} " =~ " ${branch} " ]]; then
    if [ "$branch" != "$CURRENT_BRANCH" ] && is_merged "$branch"; then
      echo -e "  ${GREEN}✓ Merged:${NC} $branch"
      if [ "$AUTO_MODE" = true ]; then
        BRANCHES_TO_DELETE_REMOTE+=("$branch")
      fi
    fi
  fi
done
echo ""

# Summary
TOTAL_TO_DELETE=${#BRANCHES_TO_DELETE_REMOTE[@]}

if [ "$TOTAL_TO_DELETE" -eq 0 ]; then
  echo -e "${GREEN}✓ No branches need to be deleted!${NC}"
  exit 0
fi

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Summary:${NC}"
echo -e "  Total Claude branches: $REMOTE_COUNT"
echo -e "  Branches to delete: ${RED}$TOTAL_TO_DELETE${NC}"
echo -e "  Branches to keep: ${GREEN}$((REMOTE_COUNT - TOTAL_TO_DELETE))${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Confirm deletion
if [ "$AUTO_MODE" = false ] && [ "$DRY_RUN" = false ]; then
  read -p "Do you want to proceed with deletion? (y/N): " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ Deletion cancelled${NC}"
    exit 0
  fi
fi

# Delete branches
if [ "$DRY_RUN" = false ]; then
  echo -e "${BLUE}🗑️  Deleting branches...${NC}"

  DELETED_COUNT=0
  FAILED_COUNT=0

  for branch in "${BRANCHES_TO_DELETE_REMOTE[@]}"; do
    echo -n "  Deleting remote branch: $branch ... "

    if git push origin --delete "$branch" 2>/dev/null; then
      echo -e "${GREEN}✓${NC}"
      DELETED_COUNT=$((DELETED_COUNT + 1))

      # Also delete local tracking branch if it exists
      if git show-ref --verify --quiet "refs/heads/$branch"; then
        git branch -D "$branch" >/dev/null 2>&1 || true
      fi
    else
      echo -e "${RED}✗ Failed${NC}"
      FAILED_COUNT=$((FAILED_COUNT + 1))
    fi
  done

  echo ""
  echo -e "${GREEN}✓ Deleted $DELETED_COUNT branches${NC}"

  if [ "$FAILED_COUNT" -gt 0 ]; then
    echo -e "${RED}✗ Failed to delete $FAILED_COUNT branches${NC}"
  fi
else
  echo -e "${YELLOW}🔍 DRY RUN - Would delete ${TOTAL_TO_DELETE} branches${NC}"
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   Cleanup complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
