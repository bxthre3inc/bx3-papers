-- Agentic SQLite Schema
-- Canonical database for Agentic v1.0

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Offline',
    completion_rate REAL NOT NULL DEFAULT 0.0,
    active_tasks INTEGER NOT NULL DEFAULT 0,
    email TEXT NOT NULL,
    avatar TEXT NOT NULL,
    agent_type TEXT NOT NULL DEFAULT 'ai',
    last_seen TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'PENDING',
    priority TEXT NOT NULL DEFAULT 'P3',
    agent_id TEXT,
    agent_name TEXT,
    due_date TEXT,
    phase TEXT NOT NULL DEFAULT 'PENDING',
    blockers TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id)
);

-- Reasoning stream — audit log for agent decisions
CREATE TABLE IF NOT EXISTS reasoning_stream (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    agent_id TEXT NOT NULL,
    phase TEXT NOT NULL,
    reasoning TEXT NOT NULL,
    evidence TEXT NOT NULL DEFAULT '[]',
    confidence REAL NOT NULL DEFAULT 0.0,
    next_action TEXT NOT NULL DEFAULT '',
    metadata TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Events table — event sourcing for cascade system
CREATE TABLE IF NOT EXISTS events (
    event_id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    tier_source INTEGER NOT NULL CHECK (tier_source IN (1, 2, 3)),
    v_t INTEGER NOT NULL,
    v_s_x REAL,
    v_s_y REAL,
    v_z_neg REAL,
    v_z_pos REAL,
    v_c REAL NOT NULL CHECK (v_c BETWEEN 0.0 AND 1.0),
    v_l TEXT,
    v_v_f REAL,
    v_e INTEGER,
    v_g TEXT,
    correlation_id TEXT NOT NULL,
    parent_event_id TEXT,
    cascade_depth INTEGER NOT NULL DEFAULT 0,
    hash_input TEXT NOT NULL,
    hash_full TEXT NOT NULL,
    sealed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_event_id) REFERENCES events(event_id)
);

-- Agent subscriptions — event patterns each agent listens to
CREATE TABLE IF NOT EXISTS agent_subscriptions (
    agent_id TEXT NOT NULL,
    event_pattern TEXT NOT NULL,
    PRIMARY KEY (agent_id, event_pattern),
    FOREIGN KEY (agent_id) REFERENCES agents(id)
);

-- Tasks indexes
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_agent ON tasks(agent_id);

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_correlation ON events(correlation_id);
CREATE INDEX IF NOT EXISTS idx_events_tier ON events(tier_source);

-- Reasoning stream indexes
CREATE INDEX IF NOT EXISTS idx_reasoning_task ON reasoning_stream(task_id);
CREATE INDEX IF NOT EXISTS idx_reasoning_agent ON reasoning_stream(agent_id);