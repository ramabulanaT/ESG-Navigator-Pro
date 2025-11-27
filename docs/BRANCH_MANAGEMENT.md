# Branch Management Guide

## Problem: Duplicate Claude Branches

When using Claude Code, each session creates a new branch with a unique UUID suffix (e.g., `claude/fix-landing-buttons-01U4pjhgNyYKCCHSoXZF32CX`). Over time, these branches accumulate and create clutter in your repository.

### Current Status

As of the last scan, this repository had **28+ Claude-created branches** on the remote server, many of which are duplicates for the same feature.

## Solution: Automated Branch Cleanup

We've implemented a comprehensive solution to prevent and clean up duplicate branches:

### 1. Cleanup Script

**Location:** `scripts/cleanup-claude-branches.sh`

**Features:**
- 🔍 Automatically detects duplicate Claude branches
- 📊 Groups branches by feature name (ignoring UUID suffixes)
- 🗑️ Removes old duplicate branches while keeping the most recent ones
- ✅ Identifies and optionally removes merged branches
- 🔒 Protects the current branch from deletion
- 🎨 Color-coded output for easy review

**Usage:**

```bash
# Dry run (see what would be deleted without actually deleting)
./scripts/cleanup-claude-branches.sh --dry-run

# Interactive mode (prompts for confirmation)
./scripts/cleanup-claude-branches.sh

# Automatic mode (no prompts, useful for CI/CD)
./scripts/cleanup-claude-branches.sh --auto

# Keep only the 2 most recent branches per feature
./scripts/cleanup-claude-branches.sh --keep-recent 2

# Combine options
./scripts/cleanup-claude-branches.sh --dry-run --keep-recent 5
```

**Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `--dry-run` | Preview deletions without executing | `false` |
| `--auto` | Run without confirmation prompts | `false` |
| `--keep-recent N` | Keep N most recent branches per feature | `3` |

### 2. GitHub Actions Workflow

**Location:** `.github/workflows/cleanup-claude-branches.yml`

**Features:**
- 🕒 Runs automatically every Sunday at midnight UTC
- 🎮 Can be triggered manually from GitHub Actions tab
- 🔧 Configurable dry-run mode and keep-recent count
- 📝 Provides cleanup summary

**Manual Trigger:**

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Cleanup Claude Branches** workflow
4. Click **Run workflow**
5. Configure options:
   - Dry run mode: `true` or `false`
   - Keep recent: number of branches to keep (default: `3`)

### 3. Duplicate Detection Script

**Location:** `scripts/check-duplicate-branches.sh`

**Features:**
- ⚠️ Warns before creating a new branch if similar ones exist
- 📅 Shows when existing branches were last updated
- 💡 Suggests cleanup actions

**Usage:**

```bash
./scripts/check-duplicate-branches.sh "claude/my-new-feature-01ABC123"
```

**Example Output:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  WARNING: Found 3 similar branch(es)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Feature: my-new-feature

Existing branches:
  • claude/my-new-feature-01XYZ789 (updated: 2 days ago)
  • claude/my-new-feature-01ABC456 (updated: 1 week ago)
  • claude/my-new-feature-01DEF999 (updated: 2 weeks ago)

Consider reusing an existing branch or cleaning up old branches first.
Run: ./scripts/cleanup-claude-branches.sh --dry-run
```

## Best Practices

### For Developers

1. **Before creating a new branch:**
   ```bash
   ./scripts/check-duplicate-branches.sh "claude/your-feature-name-UUID"
   ```

2. **Regular cleanup (recommended monthly):**
   ```bash
   # First, preview what will be deleted
   ./scripts/cleanup-claude-branches.sh --dry-run

   # Then execute
   ./scripts/cleanup-claude-branches.sh
   ```

3. **After merging a pull request:**
   - The GitHub Actions workflow will automatically clean up merged branches weekly
   - You can manually trigger cleanup immediately via GitHub Actions

### For Teams

1. **Enable the GitHub Actions workflow:**
   - The workflow runs automatically every Sunday
   - No configuration needed after setup

2. **Customize retention policy:**
   - Edit `.github/workflows/cleanup-claude-branches.yml`
   - Adjust the `keep_recent` default value (currently `3`)

3. **Monitor branch count:**
   ```bash
   # Check number of Claude branches
   git fetch origin --prune
   git branch -r | grep 'origin/claude/' | wc -l
   ```

## Automation Schedule

| Task | Frequency | Method |
|------|-----------|--------|
| Automatic cleanup | Weekly (Sundays) | GitHub Actions |
| Manual cleanup | As needed | Run script locally |
| Duplicate detection | Before branch creation | Run check script |

## Troubleshooting

### "Permission denied" when running scripts

```bash
chmod +x scripts/cleanup-claude-branches.sh
chmod +x scripts/check-duplicate-branches.sh
```

### Script can't find branches

```bash
# Ensure you've fetched latest remote branches
git fetch origin --prune
```

### Want to keep more/fewer branches

```bash
# Adjust the --keep-recent parameter
./scripts/cleanup-claude-branches.sh --keep-recent 5
```

### Need to recover a deleted branch

```bash
# View reflog to find deleted branch
git reflog

# Restore branch
git checkout -b branch-name <commit-sha>
```

## Technical Details

### How It Works

1. **Branch Detection:**
   - Fetches all remote branches
   - Filters for branches matching pattern `claude/*`

2. **Grouping:**
   - Removes UUID suffix from branch names
   - Groups branches by feature name
   - Example: `claude/fix-buttons-01ABC` and `claude/fix-buttons-01XYZ` → group `fix-buttons`

3. **Cleanup Logic:**
   - Sorts branches by last commit date (newest first)
   - Keeps N most recent branches per group
   - Protects current branch from deletion
   - Optionally deletes merged branches

4. **Safety Features:**
   - Dry-run mode for preview
   - Confirmation prompt in interactive mode
   - Current branch protection
   - Detailed logging

### Branch Naming Convention

Claude Code branches follow this pattern:
```
claude/<feature-name>-<UUID-suffix>
```

Examples:
- `claude/fix-landing-buttons-01U4pjhgNyYKCCHSoXZF32CX`
- `claude/add-training-assessment-018YP8s9nUBzY5R4qzi7fwJa`
- `claude/fix-consultation-form-01HdKB4BaMqABvzX3GAoMi72`

The UUID suffix ensures uniqueness but also causes duplicates when working on the same feature across multiple sessions.

## Impact

### Before Cleanup
```
28+ Claude branches on remote
- Multiple duplicates for same features
- Cluttered branch list
- Difficult to find relevant branches
```

### After Cleanup
```
~6-9 Claude branches on remote
- Only recent branches kept
- Clear branch organization
- Easy to navigate
```

## Related Files

- `scripts/cleanup-claude-branches.sh` - Main cleanup script
- `scripts/check-duplicate-branches.sh` - Duplicate detection
- `.github/workflows/cleanup-claude-branches.yml` - Automation workflow
- `docs/BRANCH_MANAGEMENT.md` - This documentation

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review script output for error messages
3. Run with `--dry-run` to diagnose issues
4. Open an issue in the repository

---

**Last Updated:** 2025-11-27
**Maintenance:** Review and update quarterly
