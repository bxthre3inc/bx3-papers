# Bxthre3 Inc — Meta Repository

This is the **god view** repo that tracks all Bxthre3 Inc projects as git submodules.

## Repository Structure

```
Bxthre3/
├── README.md          # This file
├── .gitmodules        # Submodule definitions
├── docs/              # Company-level documentation
│   ├── STRATEGY.md    # Long-term vision
│   ├── OKRS.md        # Quarterly objectives
│   └── LEGAL/         # Incorporation, contracts
├── projects/          # Git submodules (actual code)
│   ├── farmsense/     → github.com/bxthre3inc/farmsense-main
│   └── zoe/           → github.com/bxthre3inc/zoe
└── scripts/           # Cross-project automation
    ├── sync-all.sh    # Pull all submodules
    └── release.sh     # Tag releases across projects
```

## Quick Start

```bash
# Clone with all submodules
git clone --recursive https://github.com/bxthre3inc/bxthre3.git

# Or clone then init submodules
git clone https://github.com/bxthre3inc/bxthre3.git
cd bxthre3
git submodule update --init --recursive

# Update all projects to latest
git submodule update --remote

# Work on Irrig8
cd projects/farmsense
# ... make changes ...
git push origin main
cd ../..
git add projects/farmsense  # Record new commit hash
git commit -m "Update farmsense to latest"
```

## Projects

| Project | Repo | Description | Language |
|---------|------|-------------|----------|
| **Irrig8** | [farmsense-main](https://github.com/bxthre3inc/farmsense-main) | Deterministic farming OS | Python/TypeScript |
| **Zoe** | [zoe](https://github.com/bxthre3inc/zoe) | Living digital assistant | TypeScript/Bun |

## Version Control Everything

This meta repo uses **git submodules** to:
- Track exact commit hashes of each project
- Enable atomic updates across projects
- Provide a single command to sync everything
- Maintain independent release cycles per project

## Company-Level Docs

- `docs/STRATEGY.md` — 10-year vision, market thesis
- `docs/OKRS.md` — Quarterly objectives and key results
- `docs/LEGAL/` — Incorporation docs, cap table, contracts
- `docs/BRAND/` — Brand guidelines, logos, assets

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/sync-all.sh` | Pull latest from all submodules |
| `scripts/status.sh` | Show dirty state across all projects |
| `scripts/release.sh` | Tag coordinated releases |

## Never Commit Node Modules

Global `.gitignore` is configured. If you see `node_modules/` in `git status`, something is wrong — check that the global ignore is active:

```bash
git config --global core.excludesfile
# Should print: /home/.gitignore_global
```

## License

Projects are licensed individually. See each project's README.

---

*Founded by brodiblanco | Built on Zo Computer*  
*github.com/bxthre3inc*
