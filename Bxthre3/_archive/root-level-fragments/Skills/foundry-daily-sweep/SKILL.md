# Foundry Daily Sweep

## Purpose
Once-daily comprehensive workspace audit at 3am. Captures ALL intellectual property changes — every commit, file change, new document, code addition, note, or creative work. No filtering. No thresholds. Full transparency so brodiblanco decides what has value.

## Schedule
Runs daily at 3:00 AM local time (Monte Vista, UTC-6/-7 depending on DST).

## Process

### 1. Scan Phase
Scan everything since last checkpoint:
- Git commits across workspace root and all submodules
- New files in `/home/workspace/Bxthre3/` (and subdirectories)
- Modified files (any type: .md, .ts, .tsx, .js, .py, .json, etc.)
- Deleted files (for tracking)
- Agent INBOX activity
- INBOX/breadcrumbs entries
- VAULT changes

### 2. Capture Phase
Generate a complete delta report including:
- Every commit with message, author, timestamp
- Every new file with path and size
- Every modified file with lines changed
- Every deleted file
- Uncommitted changes (if any)
- New agent activity or INBOX entries

**NO FILTERING:** Capture everything — config tweaks, dependency updates, routine edits, one-line fixes, WIP commits, everything.

### 3. Report Phase
Generate a structured markdown report saved to:
- `Bxthre3/INBOX/foundry-reports/foundry-{date}.md`

Report includes:
- Summary counts (commits, new files, modified, deleted)
- Full list of all changes with paths
- Context snippets for text files
- Flag for review items (none filtered, just marked)

### 4. INBOX Notification
Add P3 entry to `Bxthre3/INBOX.md`:
```
Foundry Daily Sweep: [X commits, Y new files, Z modifications] — full report: INBOX/foundry-reports/foundry-{date}.md
```

## Outputs
- Complete daily report saved to `INBOX/foundry-reports/`
- P3 INBOX entry summarizing activity
- No synthesis, no auto-generated case studies — just raw capture

## Key Principles
- **Full visibility:** Every change gets reported
- **No judgment:** Let brodiblanco decide what's valuable
- **Silent unless activity:** Only notify if there's something to report
- **Structured data:** Reports are machine-readable and human-scannable

## Success Criteria
- [ ] All git commits captured (all repos, all branches)
- [ ] All file changes documented
- [ ] Report saved to INBOX/foundry-reports/
- [ ] INBOX.md updated with P3 entry
- [ ] Zero filtering applied

## Files Referenced
- `/home/workspace/Bxthre3/`
- `/home/workspace/Bxthre3/INBOX/foundry-reports/` (output)
- `/home/workspace/Bxthre3/INBOX.md`
- Git repositories (workspace + submodules)