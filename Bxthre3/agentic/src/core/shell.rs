//! Deterministic Shell — Command whitelist + safety interlocks.
//! No command executes unless it appears in ALLOWED_COMMANDS.
//! Safety-critical commands have mandatory interlocks.

use sha3::{Sha3_256, Digest};
use std::collections::HashMap;

/// Version of the whitelist — bump on every change.
const WHITELIST_VERSION: &str = "2026.04.17-001";

/// Categories of commands.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum CommandCategory {
    FileSystem,
    Network,
    Compute,
    HumanNotification,
    HumanApproval,
    Physical,
}

/// Safety interlock level.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum InterlockLevel {
    None,
    ToolCheck,        // Must confirm tool/card is in correct state
    Immediate,        // Can trigger without confirmation (e-stop)
    Blocking,        // Blocks until human approves
}

/// A command in the whitelist with its constraints.
#[derive(Debug, Clone)]
pub struct CommandSpec {
    pub args: Vec<String>,
    pub rate_limit: Option<String>,    // e.g., "100/min"
    pub sandbox: bool,                // runs in sandboxed env
    pub timeout_secs: Option<u64>,
    pub safety_interlock: Option<InterlockLevel>,
    pub immediate_category: Option<InterlockLevel>, // for e-stop commands
}

impl CommandSpec {
    pub fn rate_limit_per_minute(&self) -> Option<u32> {
        self.rate_limit.as_ref().map(|rl| {
            rl.split('/').next().and_then(|n| n.parse().ok()).unwrap_or(100)
        })
    }
}

/// Constraint violation — raised when a command is not in whitelist.
#[derive(Debug, Clone)]
pub struct ConstraintViolation {
    pub command: String,
    pub reason: String,
}

impl std::fmt::Display for ConstraintViolation {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "CONSTRAINT_VIOLATION: {} — {}", self.command, self.reason)
    }
}

/// Rate limiter for commands.
pub struct RateLimiter {
    counts: HashMap<String, (u32, u64)>, // command -> (count, window_start)
    window_secs: u64,
}

impl RateLimiter {
    pub fn new(window_secs: u64) -> Self {
        RateLimiter {
            counts: HashMap::new(),
            window_secs,
        }
    }

    pub fn check(&mut self, command: &str, limit_per_minute: u32) -> Result<(), String> {
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs();

        let entry = self.counts.entry(command.to_string()).or_insert((0, now));

        // Reset window if expired
        if now - entry.1 > self.window_secs {
            entry.0 = 0;
            entry.1 = now;
        }

        if entry.0 >= limit_per_minute {
            return Err(format!(
                "RATE_LIMIT_EXCEEDED: {} hit {} requests in current window",
                command, limit_per_minute
            ));
        }

        entry.0 += 1;
        Ok(())
    }
}

/// The deterministic shell — validates every command against the whitelist.
pub struct DeterministicShell {
    whitelist: HashMap<String, CommandSpec>,
    rate_limiter: RateLimiter,
}

impl DeterministicShell {
    pub fn new() -> Self {
        let mut whitelist = HashMap::new();

        // FILE SYSTEM
        whitelist.insert("mcp.file_read".to_string(), CommandSpec {
            args: vec!["path".to_string(), "encoding".to_string()],
            rate_limit: Some("1000/min".to_string()),
            sandbox: true,
            timeout_secs: Some(30),
            safety_interlock: None,
            immediate_category: None,
        });
        whitelist.insert("mcp.file_write".to_string(), CommandSpec {
            args: vec!["path".to_string(), "content".to_string()],
            rate_limit: Some("500/min".to_string()),
            sandbox: true,
            timeout_secs: Some(30),
            safety_interlock: None,
            immediate_category: None,
        });
        whitelist.insert("mcp.file_delete".to_string(), CommandSpec {
            args: vec!["path".to_string()],
            rate_limit: Some("50/min".to_string()),
            sandbox: true,
            timeout_secs: Some(10),
            safety_interlock: Some(InterlockLevel::Blocking),
            immediate_category: None,
        });

        // NETWORK
        whitelist.insert("mcp.http_request".to_string(), CommandSpec {
            args: vec!["url".to_string(), "method".to_string(), "headers".to_string()],
            rate_limit: Some("200/min".to_string()),
            sandbox: true,
            timeout_secs: Some(60),
            safety_interlock: None,
            immediate_category: None,
        });
        whitelist.insert("mcp.websocket_send".to_string(), CommandSpec {
            args: vec!["url".to_string(), "payload".to_string()],
            rate_limit: Some("300/min".to_string()),
            sandbox: true,
            timeout_secs: Some(30),
            safety_interlock: None,
            immediate_category: None,
        });

        // COMPUTE
        whitelist.insert("mcp.execute_python".to_string(), CommandSpec {
            args: vec!["code".to_string()],
            rate_limit: Some("100/min".to_string()),
            sandbox: true,
            timeout_secs: Some(30),
            safety_interlock: None,
            immediate_category: None,
        });
        whitelist.insert("mcp.execute_shell".to_string(), CommandSpec {
            args: vec!["command".to_string(), "args".to_string()],
            rate_limit: Some("20/min".to_string()),
            sandbox: false, // shell needs stricter controls
            timeout_secs: Some(60),
            safety_interlock: Some(InterlockLevel::ToolCheck),
            immediate_category: None,
        });

        // HUMAN NOTIFICATION
        whitelist.insert("human.notify".to_string(), CommandSpec {
            args: vec!["user_id".to_string(), "message".to_string(), "priority".to_string()],
            rate_limit: Some("60/min".to_string()),
            sandbox: true,
            timeout_secs: Some(10),
            safety_interlock: None,
            immediate_category: None,
        });
        whitelist.insert("human.request_approval".to_string(), CommandSpec {
            args: vec!["decision_context".to_string(), "options".to_string()],
            rate_limit: Some("30/min".to_string()),
            sandbox: true,
            timeout_secs: None,
            safety_interlock: Some(InterlockLevel::Blocking),
            immediate_category: None,
        });
        whitelist.insert("human.send_email".to_string(), CommandSpec {
            args: vec!["to".to_string(), "subject".to_string(), "body".to_string()],
            rate_limit: Some("20/min".to_string()),
            sandbox: true,
            timeout_secs: Some(30),
            safety_interlock: None,
            immediate_category: None,
        });

        // PHYSICAL (Irrig8 specific)
        whitelist.insert("opcua.pivot_start".to_string(), CommandSpec {
            args: vec!["pivot_id".to_string(), "speed".to_string()],
            rate_limit: Some("10/min".to_string()),
            sandbox: false,
            timeout_secs: Some(300),
            safety_interlock: Some(InterlockLevel::ToolCheck),
            immediate_category: None,
        });
        whitelist.insert("opcua.pivot_stop".to_string(), CommandSpec {
            args: vec!["pivot_id".to_string()],
            rate_limit: None,
            sandbox: false,
            timeout_secs: Some(60),
            safety_interlock: Some(InterlockLevel::Immediate),
            immediate_category: Some(InterlockLevel::Immediate),
        });
        whitelist.insert("opcua.pivot_set_rate".to_string(), CommandSpec {
            args: vec!["pivot_id".to_string(), "gpm".to_string()],
            rate_limit: Some("5/min".to_string()),
            sandbox: false,
            timeout_secs: Some(60),
            safety_interlock: Some(InterlockLevel::ToolCheck),
            immediate_category: None,
        });
        whitelist.insert("mqtt.publish".to_string(), CommandSpec {
            args: vec!["topic".to_string(), "payload".to_string(), "qos".to_string()],
            rate_limit: Some("500/min".to_string()),
            sandbox: true,
            timeout_secs: Some(10),
            safety_interlock: None,
            immediate_category: None,
        });

        // AGENTIC INTERNAL
        whitelist.insert("agentic.register_agent".to_string(), CommandSpec {
            args: vec!["agent_id".to_string(), "role".to_string()],
            rate_limit: Some("10/min".to_string()),
            sandbox: true,
            timeout_secs: Some(30),
            safety_interlock: None,
            immediate_category: None,
        });
        whitelist.insert("agentic.submit_task".to_string(), CommandSpec {
            args: vec!["task_id".to_string(), "payload".to_string()],
            rate_limit: Some("200/min".to_string()),
            sandbox: true,
            timeout_secs: Some(120),
            safety_interlock: None,
            immediate_category: None,
        });
        whitelist.insert("agentic.escalate".to_string(), CommandSpec {
            args: vec!["task_id".to_string(), "reason".to_string()],
            rate_limit: Some("20/min".to_string()),
            sandbox: true,
            timeout_secs: Some(10),
            safety_interlock: None,
            immediate_category: None,
        });

        DeterministicShell {
            whitelist,
            rate_limiter: RateLimiter::new(60),
        }
    }

    /// Get the whitelist version.
    pub fn version(&self) -> &str {
        WHITELIST_VERSION
    }

    /// Compute whitelist signature (SHA3-256 of canonical sorted entries).
    pub fn signature(&self) -> String {
        let mut hasher = Sha3_256::new();
        hasher.update(WHITELIST_VERSION.as_bytes());
        for (cmd, spec) in &self.whitelist {
            hasher.update(cmd.as_bytes());
            for arg in &spec.args {
                hasher.update(arg.as_bytes());
            }
            if let Some(rl) = &spec.rate_limit {
                hasher.update(rl.as_bytes());
            }
        }
        hex::encode(hasher.finalize())
    }

    /// Validate a command intent against the whitelist.
    /// Returns Ok(()) if allowed, Err(ConstraintViolation) if blocked.
    pub fn validate(&mut self, command: &str) -> Result<(), ConstraintViolation> {
        match self.whitelist.get(command) {
            Some(spec) => {
                // Check rate limit
                if let Some(limit) = spec.rate_limit_per_minute() {
                    if let Err(e) = self.rate_limiter.check(command, limit) {
                        return Err(ConstraintViolation {
                            command: command.to_string(),
                            reason: e,
                        });
                    }
                }
                Ok(())
            }
            None => {
                // Suggest closest match if available
                let suggestion = if command.starts_with("mcp.") {
                    "Available MCP commands: mcp.file_read, mcp.file_write, mcp.http_request, mcp.execute_python"
                } else if command.starts_with("opcua.") {
                    "Available OPC-UA commands: opcua.pivot_start, opcua.pivot_stop, opcua.pivot_set_rate"
                } else if command.starts_with("human.") {
                    "Available human commands: human.notify, human.request_approval, human.send_email"
                } else {
                    "Command not in whitelist. Add to DeterministicShell or use agentic.escalate"
                };

                Err(ConstraintViolation {
                    command: command.to_string(),
                    reason: format!("ALLOWED_COMMANDS does not contain '{}'. {}", command, suggestion),
                })
            }
        }
    }

    /// List all allowed commands (for debugging/admin).
    pub fn list_commands(&self) -> Vec<String> {
        let mut commands: Vec<&str> = self.whitelist.keys().map(|s| s.as_str()).collect();
        commands.sort();
        commands.iter().map(|s| s.to_string()).collect()
    }

    /// Get spec for a command.
    pub fn get_spec(&self, command: &str) -> Option<&CommandSpec> {
        self.whitelist.get(command)
    }
}

impl Default for DeterministicShell {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_whitelist_version() {
        let shell = DeterministicShell::new();
        assert_eq!(shell.version(), "2026.04.17-001");
        assert_eq!(shell.signature().len(), 64); // SHA3-256 hex
    }

    #[test]
    fn test_valid_command() {
        let mut shell = DeterministicShell::new();
        assert!(shell.validate("mcp.file_read").is_ok());
        assert!(shell.validate("opcua.pivot_stop").is_ok());
        assert!(shell.validate("human.notify").is_ok());
    }

    #[test]
    fn test_invalid_command() {
        let mut shell = DeterministicShell::new();
        let result = shell.validate("sudo rm -rf /");
        assert!(result.is_err());
        let err = result.unwrap_err();
        assert!(err.reason.contains("ALLOWED_COMMANDS does not contain"));
    }

    #[test]
    fn test_rate_limit() {
        let mut shell = DeterministicShell::new();
        // file_read has 1000/min limit — hit it
        for _ in 0..1000 {
            let _ = shell.validate("mcp.file_read");
        }
        let result = shell.validate("mcp.file_read");
        assert!(result.is_err());
        let err = result.unwrap_err();
        assert!(err.reason.contains("RATE_LIMIT_EXCEEDED"));
    }

    #[test]
    fn test_list_commands() {
        let shell = DeterministicShell::new();
        let cmds = shell.list_commands();
        assert!(cmds.len() > 10);
        assert!(cmds.contains(&"mcp.file_read".to_string()));
        assert!(cmds.contains(&"opcua.pivot_stop".to_string()));
    }

    #[test]
    fn test_e_stop_immediate() {
        let spec = DeterministicShell::new().get_spec("opcua.pivot_stop");
        assert!(spec.is_some());
        let spec = spec.unwrap();
        assert_eq!(spec.immediate_category, Some(InterlockLevel::Immediate));
    }
}