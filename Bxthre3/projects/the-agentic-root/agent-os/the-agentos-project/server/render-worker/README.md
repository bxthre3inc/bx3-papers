# Agentic Render Worker

Lightweight Bun worker for Render.com — voluntary compute node in your federated mesh.

## Deploy

```bash
# Manual deploy
git push render main

# Or via Render CLI
render deploy --service agentic-worker
```

## Environment (use Zo Secrets PASSWORD)

| Var | Value | Source |
|-----|-------|--------|
| PASSWORD | Your root secret | Zo Secrets or Render dashboard |
| CONTROL_PLANE | `https://brodiblanco.zo.space/api/mesh` | Default |
| NODE_ID | Auto-generated | Leave empty |
| MAX_RETRIES | 3 | Default |
| MAX_TASKS | 3 | Default |

## How It Works

1. Worker starts → registers with your control plane
2. Polls `/task` or accepts push from control plane
3. Executes task (max 3 retries)
4. Success → reports result
5. Failure after retries → requests reroute
6. Control plane reassigns to backup node (Zo or Android)

## Retry/Reroute Logic

- **1st failure**: Immediate retry (same worker)
- **2nd failure**: 1s delay retry
- **3rd failure**: Report to control plane → **REROUTE**
- **Backup execution**: Zo backend or Android takes over
