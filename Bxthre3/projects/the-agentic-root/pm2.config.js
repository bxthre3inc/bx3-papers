// PM2 Process Manager Config
// For Zo-hosted standalon
[truncated]
endent Agentic

[truncated]
ite: '/home/workspace/Bxthre3/pr
[truncated]
',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      AGENTOS_MODE: 'standalone'
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    kill_timeout: 5000,
    listen_timeout: 10000
  }]
};
