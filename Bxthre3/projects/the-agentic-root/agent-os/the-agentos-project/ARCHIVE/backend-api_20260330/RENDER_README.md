# Render.com Deployment

## Setup Steps

1. Go to https://render.com and create a free account
2. Click "New" → "Web Service"
3. Connect your GitHub repo or use "Deploy from Git URL"
4. Configure:
   - **Name**: agentic-mesh-worker
   - **Environment**: Bun (or Docker)
   - **Build Command**: `bun install`
   - **Start Command**: `bun run workers/render-worker.ts`
5. Add Environment Variables:
   - `CONTROL_PLANE`: `https://agentic-backend-brodiblanco.zocomputer.io`
   - `MESH_SECRET`: `2a328ff528...` (check with brodiblanco)
   - `REGION`: `us-east`

## Alternative: Deploy via API

```bash
curl -X POST https://api.render.com/v1/services \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "web_service",
    "name": "agentic-mesh-worker",
    "ownerId": "YOUR_OWNER_ID",
    "serviceDetails": {
      "env": "bun",
      "buildCommand": "bun install",
      "startCommand": "bun run workers/render-worker.ts",
      "numInstances": 1,
      "plan": "free"
    }
  }'
```

## Files

- `workers/render-worker.ts` — Worker code
- `render.yaml` — Render Blueprint (for declarative deploy)