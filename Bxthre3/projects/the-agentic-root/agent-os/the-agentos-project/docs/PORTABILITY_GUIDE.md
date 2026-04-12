# Agentic Portability Guide

**Can you build Agentic outside Zo?** Yes, with these changes.

---

## Current Zo Dependencies

### 1. API Endpoints (`zo.space`)
```kotlin
// mobile/app/build.gradle.kts
buildConfi
---

## Exit Path: Self-Hosted Agentic

### Step 1: Replace API Endpoint
```diff
// mobile/app/build.gradle.kts
buildConfigField("String", "API_BASE_URL", 
-    """"https://brodiblanco.zo.space/""""
+    """"https://your-domain.com/""""
)
```

### Step 2: Migrate Server
```bash
# Current: Zo-hosted Python server
# Target: Your VPS (Hetzner/DigitalOcean/Linode)

# 1. Provision Ubuntu 22.04
# 2. Install Python
apt update && apt install python3 python3-pip

# 3. Copy server/
rsync -av /home/workspace/Bxthre3/projects/the-agentic-project/server/ root@your-server:/opt/agentic/

# 4. Run
pip install -r requirements.txt
python mesh_server.py

# 5. Nginx + SSL
# (certbot --nginx -d your-domain.com)
```

### Step 3: Android Build
```bash
./gradlew assembleRelease
# APK works, just points at your server now
```

---

## What Requires Zo (Hard Lock)

| Feature | Why Zo-Locked | Alternative |
|---------|-------------|-------------|
| SMS via SignalWire | Zo manages webhook endpoints | Twilio + your own webhook handler |
| Space routes | Zo builds/deploys TSX routes | Self-host Hono/fastify |
| Agent orchestration | Currently only in Zo env | Self-run Python scheduler |

---

## Timeline to Exit

| Phase | Time | Cost | Notes |
|-------|------|------|-------|
| **1. Server migration** | 1 day | $6/mo VPS | Python server needs no changes |
| **2. API migration** | 2 days | $0 | Just nginx config |
| **3. SMS relay** | 3 days | $50/mo | Twilio + webhook handler |
| **4. Full escape** | 1 week | ~$100/mo | All functionality preserved |

---

## The Honest Answer

You CAN build Agentic outside Zo. BUT:

- **Zo saves you ~2 weeks/month** of DevOps
- **Portability is engineered-in** — the server is vanilla Python
- **Exit cost is low** when you want it

**Current state:** You're building WITH Zo, not building FOR Zo. The architecture is portable.

---

## What We Actually Did Today

| Deliverable | File | Portable? |
|-------------|------|-----------|
| AMP Protocol | `docs/AMP_PROTOCOL.md` | ✅ Yes |
| Foundry Integration | `docs/AMP_FOUNDRY_INTEGRATION.md` | ✅ Yes |
| Mobile scaffold | `mobile/` | ✅ With URL change |
| Desktop scaffold | `chromebook/` | ✅ Yes |
| Python server | `server/` | ✅ Fully independent |
| Execution plan | `EXECUTION_PLAN_W13_2026.md` | ✅ Strategy |

---

## To Fully Exit Zo:

Run these commands:
```bash
# 1. Copy entire project
rsync -av /home/workspace/Bxthre3/projects/the-agentic-project/ ~/agentic-backup/

# 2. Change API URLs
sed -i 's/brodiblanco.zo.space/YOUR_DOMAIN/g' mobile/app/build.gradle.kts

# 3. Deploy server
scp -r server/ root@YOUR_VPS:/opt/agentic/

# 4. Point devices at new server
# Edit mobile/, rebuild APK

# 5. Done
```

**ETA:** 1 day to exit. Zo's convenience, not prison.
