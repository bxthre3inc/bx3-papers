#!/bin/bash
# Deploy to Oracle Cloud Always Free (run on the VM)

set -e

echo "=== Agentic Mesh Worker — Oracle Cloud ==="

cd ~
mkdir -p agentic-worker
cd agentic-worker

# Install Bun if not present
if ! command -v bun &> /dev/null; then
  curl -fsSL https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
fi

# Get worker code
curl -fsSL https://raw.githubusercontent.com/brodiblanco/agentic/main/workers/oracle-worker.ts > worker.ts

# Create systemd service
sudo tee /etc/systemd/system/agentic-worker.service > /dev/null << EOF
[Unit]
Description=Agentic Mesh Worker
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/agentic-worker
Environment="CONTROL_PLANE=https://brodiblanco.zo.space/api/mesh"
Environment="MESH_SECRET=${MESH_SECRET}"
Environment="NODE_ID=oracle-$(hostname)"
Environment="REGION=us-ashburn-1"
ExecStart=/home/ubuntu/.bun/bin/bun run worker.ts
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable agentic-worker
sudo systemctl start agentic-worker

echo "=== Worker deployed ==="
echo "Check status: sudo systemctl status agentic-worker"
echo "View logs: sudo journalctl -u agentic-worker -f"
