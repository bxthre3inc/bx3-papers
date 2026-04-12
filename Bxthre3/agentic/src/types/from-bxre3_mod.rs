//! Core domain types for Agentic.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// Agent status
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum AgentStatus {
    Active,
    Idle,
    Offline,
    Error,
}

impl Default for AgentStatus {
    fn default() -> Self {
        AgentStatus::Offline
    }
}

/// Task status state machine
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum TaskStatus {
    Pending,
    Assigned,
    Working,
    Review,
    Done,
    Blocked,
    Suspended,
}

impl Default for TaskStatus {
    fn default() -> Self {
        TaskStatus::Pending
    }
}

/// Task priority
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub struct Priority(pub &'static str);

impl Priority {
    pub const P0: Priority = Priority("P0");
    pub const P1: Priority = Priority("P1");
    pub const P2: Priority = Priority("P2");
    pub const P3: Priority = Priority("P3");

    pub fn from_str(s: &str) -> Priority {
        match s {
            "P0" => Priority::P0,
            "P1" => Priority::P1,
            "P2" => Priority::P2,
            _ => Priority::P3,
        }
    }

    pub fn as_str(&self) -> &'static str {
        self.0
    }
}

/// Task — the primary unit of work
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Task {
    pub id: String,
    pub title: String,
    pub description: String,
    pub status: TaskStatus,
    pub priority: Priority,
    pub agent_id: Option<String>,
    pub agent_name: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub due_date: Option<String>,
    pub phase: String,
    pub blockers: Vec<String>,
}

impl Task {
    pub fn new(title: String, description: String, priority: Priority) -> Self {
        let now = Utc::now();
        let ts = uuid::Timestamp::now(uuid::NoContext::default());
        Self {
            id: Uuid::new_v7(ts).to_string(),
            title,
            description,
            status: TaskStatus::Pending,
            priority,
            agent_id: None,
            agent_name: None,
            created_at: now,
            updated_at: now,
            due_date: None,
            phase: "PENDING".into(),
            blockers: vec![],
        }
    }
}

/// Agent — a named AI worker
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Agent {
    pub id: String,
    pub name: String,
    pub role: String,
    pub department: String,
    pub status: AgentStatus,
    pub completion_rate: f64,
    pub active_tasks: usize,
    pub email: String,
    pub last_seen: DateTime<Utc>,
    pub avatar: String,
    pub agent_type: String,
    pub skills: Vec<String>,
    pub tools: Vec<String>,
    pub shifts: Vec<String>,
    pub colleagues: Vec<String>,
}

impl Agent {
    /// Canonical 19-agent roster (18 AI + 1 human)
    pub fn canonical_roster() -> Vec<Agent> {
        let now = chrono::Utc::now();
        let mut agents = Vec::with_capacity(19);

        agents.push(Agent {
            id: "brodiblanco".into(),
            name: "Jeremy Beebe".into(),
            role: "Founder & CEO".into(),
            department: "Executive".into(),
            status: AgentStatus::Active,
            completion_rate: 1.00,
            active_tasks: 0,
            email: "brodiblanco@bxthre3.io".into(),
            last_seen: now,
            avatar: "JB".into(),
            agent_type: "human".into(),
            skills: vec!["strategy".into(), "vision".into(), "execution".into()],
            tools: vec!["zo".into(), "terminal".into(), "all".into()],
            shifts: vec!["continuous".into()],
            colleagues: vec![],
        });

        let ai_agents = [
            ("zoe",      "Zoe Patel",       "Chief of Staff",        "Executive",   0.97),
            ("atlas",    "Atlas",           "COO",                   "Operations",  0.94),
            ("vance",    "Vance",           "Founders Assistant",    "Executive",   0.95),
            ("pulse",    "Pulse",           "People Ops",            "Operations",  0.96),
            ("sentinel", "Sentinel",         "System Monitor",        "Operations",  0.99),
            ("iris",     "Iris Park",       "Engineering Lead",      "Engineering", 0.91),
            ("dev",      "Dev",             "Backend Engineer",      "Engineering", 0.88),
            ("sam",      "Sam",             "Data Analyst",          "Engineering", 0.87),
            ("taylor",   "Taylor Reed",     "Security Engineer",     "Engineering", 0.92),
            ("theo",     "Theo",            "DevOps Engineer",       "Engineering", 0.89),
            ("casey",    "Casey Wu",        "Marketing Lead",        "Marketing",   0.85),
            ("maya",     "Maya Patel",      "Grant Strategist",      "Grants",      0.90),
            ("raj",      "Raj",             "Legal & Compliance",    "Legal",       0.92),
            ("drew",     "Drew Morrison",   "Sales Lead",            "Sales",       0.93),
            ("irrig8",   "Irrig8 Field Agent","Field Operations",   "Operations",  0.90),
            ("rain",     "RAIN",            "Regulatory Intelligence","Strategy",   0.88),
            ("vpc",      "VPC Agent",       "Gaming Operations",    "Operations",  0.87),
            ("trenchbabys","Trenchbabys Agent","Retail Operations",  "Sales",      0.85),
        ];

        for (id, name, role, dept, rate) in ai_agents {
            let initials = name.split_whitespace()
                .map(|p| p.chars().next().unwrap_or('?'))
                .collect::<String>();
            agents.push(Agent {
                id: id.into(),
                name: name.into(),
                role: role.into(),
                department: dept.into(),
                status: AgentStatus::Active,
                completion_rate: rate,
                active_tasks: 0,
                email: format!("{}@bxthre3.io", id),
                last_seen: now,
                avatar: initials.to_uppercase(),
                agent_type: "ai".into(),
                skills: vec![],
                tools: vec![],
                shifts: vec!["continuous".into()],
                colleagues: vec![],
            });
        }

        agents
    }
}

/// Org chart entry
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OrgEntry {
    pub id: String,
    pub name: String,
    pub role: String,
    pub department: String,
    pub agent_type: String,
    pub reports_to: Option<String>,
}

/// API response types
#[derive(Debug, Serialize, Deserialize)]
pub struct AgentResponse {
    pub agents: Vec<Agent>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TaskResponse {
    pub tasks: Vec<Task>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DashboardResponse {
    pub version: String,
    pub status: String,
    pub agent_count: usize,
    pub active_agents: usize,
    pub work_queue_depth: usize,
    pub escalation_count: usize,
    pub uptime: u64,
    pub avg_health: f64,
    pub known_issues: Vec<String>,
    pub agents: Vec<Agent>,
    pub tasks: Vec<Task>,
    pub timestamp: DateTime<Utc>,
}

/// Event types for the event bus
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Event {
    pub event_id: String,
    pub event_type: String,
    pub tier: u8,
    pub timestamp: DateTime<Utc>,
    pub vector: EventVector,
    pub plane_results: Vec<PlaneResult>,
    pub all_match: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EventVector {
    pub t: i64,
    pub s_x: f64,
    pub s_y: f64,
    pub z_negative: f64,
    pub z_positive: f64,
    pub c: f64,
    pub l: String,
    pub v_f: f64,
    pub e: i64,
    pub g: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PlaneResult {
    pub plane: u8,
    pub matched: bool,
    pub threshold: String,
}

/// Starting 5 — AI co-founder archetypes
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Starting5 {
    pub name: String,
    pub archetype: String,
    pub specialty: String,
    pub current_focus: String,
    pub metrics: Starting5Metrics,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Starting5Metrics {
    pub tasks_owned: u32,
    pub completion_rate: f64,
    pub escalations: u32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub pipeline: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub reach: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub patterns_found: Option<u32>,
}

impl Starting5 {
    pub fn canonical() -> Vec<Starting5> {
        vec![
            Starting5 {
                name: "Zoe Patel".into(),
                archetype: "Chief of Staff".into(),
                specialty: "Orchestration & Strategy".into(),
                current_focus: "Agentic architecture".into(),
                metrics: Starting5Metrics {
                    tasks_owned: 2,
                    completion_rate: 0.97,
                    escalations: 0,
                    pipeline: None,
                    reach: None,
                    patterns_found: None,
                },
            },
            Starting5 {
                name: "Drew".into(),
                archetype: "Sales Lead".into(),
                specialty: "Revenue & Partnerships".into(),
                current_focus: "VPC platform launch".into(),
                metrics: Starting5Metrics {
                    tasks_owned: 1,
                    completion_rate: 0.93,
                    escalations: 0,
                    pipeline: Some(".4M".into()),
                    reach: None,
                    patterns_found: None,
                },
            },
            Starting5 {
                name: "Casey Wu".into(),
                archetype: "Marketing Lead".into(),
                specialty: "Brand & Demand Gen".into(),
                current_focus: "Irrig8 launch campaign".into(),
                metrics: Starting5Metrics {
                    tasks_owned: 1,
                    completion_rate: 0.85,
                    escalations: 0,
                    pipeline: None,
                    reach: Some("12K".into()),
                    patterns_found: None,
                },
            },
            Starting5 {
                name: "Vance".into(),
                archetype: "Pattern Architect".into(),
                specialty: "Gap Detection & Continuity".into(),
                current_focus: "Cross-system anomaly monitoring".into(),
                metrics: Starting5Metrics {
                    tasks_owned: 1,
                    completion_rate: 0.95,
                    escalations: 0,
                    pipeline: None,
                    reach: None,
                    patterns_found: Some(24),
                },
            },
        ]
    }
}

/// Integrations status
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Integration {
    pub name: String,
    pub status: String,
    pub icon: String,
    pub last_sync: DateTime<Utc>,
    pub actions: Vec<String>,
}

impl Integration {
    pub fn canonical() -> Vec<Integration> {
        let now = chrono::Utc::now();
        vec![
            Integration { name: "Gmail".into(),    status: "CONNECTED".into(), icon: "email".into(),     last_sync: now, actions: vec!["read".into(), "send".into()] },
            Integration { name: "Calendar".into(),  status: "CONNECTED".into(), icon: "event".into(),    last_sync: now, actions: vec!["read".into(), "write".into()] },
            Integration { name: "Tasks".into(),     status: "CONNECTED".into(), icon: "checklist".into(), last_sync: now, actions: vec!["read".into(), "write".into()] },
            Integration { name: "Drive".into(),     status: "CONNECTED".into(), icon: "folder".into(),   last_sync: now, actions: vec!["read".into(), "write".into()] },
            Integration { name: "Notion".into(),    status: "CONNECTED".into(), icon: "article".into(),  last_sync: now, actions: vec!["read".into(), "write".into()] },
            Integration { name: "Airtable".into(),  status: "CONNECTED".into(), icon: "table".into(),    last_sync: now, actions: vec!["read".into(), "write".into()] },
            Integration { name: "Linear".into(),    status: "CONNECTED".into(), icon: "issue".into(),    last_sync: now, actions: vec!["read".into(), "write".into()] },
            Integration { name: "Spotify".into(),    status: "CONNECTED".into(), icon: "music".into(),    last_sync: now, actions: vec!["read".into()] },
            Integration { name: "Dropbox".into(),   status: "CONNECTED".into(), icon: "cloud".into(),     last_sync: now, actions: vec!["read".into()] },
            Integration { name: "Stripe".into(),     status: "PARTIAL".into(),   icon: "payment".into(),  last_sync: now, actions: vec!["read".into()] },
        ]
    }
}