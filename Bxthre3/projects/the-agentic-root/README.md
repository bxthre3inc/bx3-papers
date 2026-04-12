# Agentic v4 — Self-Contained AI Workforce

**Zo-Hosted, Fully Independent Operating System**

## Quick Start

```bash
# Local development
bun run dev

# Build for production
bun run build

# Deploy to Zo
bun run deploy:zo

# Deploy with Docker
docker build -t agentic .
docker run -p 3000:3000 agentic
```

## Architecture

```
Agentic v4
├── Core Server (Hono/Bun)
│   ├── Work Generation Engine
│   ├── Financial Autonomy
│   ├── Starting 5 Agents
│   └── Integration Layer
├── Integrations
│   ├── Gmail (email automation)
│   ├── Calendar (scheduling)
│   ├── Google Tasks (task management)
│   ├── GitHub (code/PR automation)
│   ├── SMS (alerts)
│   ├── Crypto (Solana/USDC payments)
│   └── IoT Sensors (Irrig8)
└── Agentic Dashboard (/agentic)
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/status` | System status |
| GET | `/api/work/queue` | Unified work queue |
| GET | `/api/employees` | All employees |
| GET | `/api/starting5` | Starting 5 status |
| POST | `/api/crypto/invoice` | Generate invoice |
| POST | `/api/sensors` | Sensor telemetry |
| POST | `/api/automations` | Rule engine |

## Environment Variables

```env
GMAIL_CLIENT_ID=xxx
GMAIL_CLIENT_SECRET=xxx
GITHUB_TOKEN=xxx
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

## CI/CD

GitHub Actions automatically:
1. Lints on every push
2. Runs tests on PRs
3. Builds on merge to main
4. Deploys to Zo Hosting

## License

UNLICENSED — Private