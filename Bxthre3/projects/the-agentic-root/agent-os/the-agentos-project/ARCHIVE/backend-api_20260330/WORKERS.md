# Agentic Mesh Workers

## External Worker Deployments

This directory contains lightweight MCP Mesh workers for deployment on external free-tier compute providers.

### Available Workers

| Worker | Platform | File | Cost |
|--------|----------|------|------|
| Render Worker | Render.com | `workers/render-worker.ts` | Free (sleep after 15min idle) |
| Fly.io Worker | Fly.io | `workers/fly-worker.ts` | Free (up to $5/mo credit) |
| Oracle Worker | Oracle Cloud | `workers/oracle-worker.ts` | Always Free (4 OCPUs, 24GB RAM) |

### Quick Deploy

**Render.com:**
```bash
git push render main
# Or: curl -X POST https://api.render.com/v1/services ...
```

**Fly.io:**
```bash
fly launch --dockerfile deploy/Dockerfile
fly secrets set MESH_SECRET=your-secret
```

**Oracle Cloud:**
```bash
scp workers/oracle-worker.ts ubuntu@YOUR_VM_IP:~/
ssh ubuntu@YOUR_VM_IP "bash < deploy/oracle.sh"
```

### Architecture

All workers:
1. Register with control plane on startup
2. Send heartbeat every 10 seconds
3. Poll for tasks every 5 seconds
4. Execute and complete tasks via HTTP

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CONTROL_PLANE` | Yes | Control plane URL (e.g., `https://brodiblanco.zo.space/api/mesh`) |
| `MESH_SECRET` | Yes | Authentication token |
| `NODE_ID` | Auto | Worker unique ID |
| `REGION` | Auto | Provider region |
| `PORT` | No | Local port (default: 3000/8080) |

---
*Part of the Agentic MCP Mesh*