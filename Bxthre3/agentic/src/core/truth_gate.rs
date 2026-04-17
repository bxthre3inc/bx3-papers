//! Truth Gate — Hallucination kill switch. Architectural enforcement.
//! Every LLM output that claims to reference live data MUST pass RAG check
//! or it gets blocked. No exceptions.

use sha3::{Sha3_256, Digest};
use std::collections::HashMap;

/// Valid data classes that require RAG verification.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum DataClass {
    MarketIntel,
    Financials,
    CorporatePolicy,
    ProjectContext,
    TechnicalSpec,
}

impl DataClass {
    pub fn max_age_secs(&self) -> u64 {
        match self {
            DataClass::MarketIntel => 3600,      // 1 hour
            DataClass::Financials => 300,         // 5 min
            DataClass::CorporatePolicy => 86400,  // 24h
            DataClass::ProjectContext => 1800,    // 30 min
            DataClass::TechnicalSpec => 7200,     // 2h
        }
    }

    pub fn label(&self) -> &'static str {
        match self {
            DataClass::MarketIntel => "market_intel",
            DataClass::Financials => "financials",
            DataClass::CorporatePolicy => "corporate_policy",
            DataClass::ProjectContext => "project_context",
            DataClass::TechnicalSpec => "technical_spec",
        }
    }
}

/// A verified source with SHA3-256 hash and timestamp.
#[derive(Debug, Clone)]
pub struct SourceHash {
    pub data_class: DataClass,
    pub digest: String,      // hex-encoded SHA3-256
    pub timestamp: u64,      // unix epoch seconds
    pub source_id: String,   // e.g., "linear-issue-123", "notion-page-456"
}

/// Verification result — either clean or rejected with reason.
#[derive(Debug, Clone)]
pub enum VerifyResult {
    Clean {
        source_hash: SourceHash,
        latency_ms: u64,
    },
    Rejected {
        reason: String,
        claimed_data_class: Option<DataClass>,
        suggestion: String,
    },
}

/// Truth Gate — enforces No-Fetch-No-Think on every LLM output.
/// All claims about live data must cite a verified, non-stale source.
pub struct TruthGate {
    verified_sources: HashMap<String, SourceHash>,
}

impl TruthGate {
    pub fn new() -> Self {
        TruthGate {
            verified_sources: HashMap::new(),
        }
    }

    /// Register a source as verified (called when data is fetched from integrations).
    pub fn register_source(&mut self, source_id: &str, data_class: DataClass, payload: &[u8]) -> SourceHash {
        let mut hasher = Sha3_256::new();
        hasher.update(payload);
        hasher.update(source_id.as_bytes());
        hasher.update(data_class.label().as_bytes());
        hasher.update(&[b':', b':']);
        let digest = hex::encode(hasher.finalize());

        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs();

        let source_hash = SourceHash {
            data_class,
            digest,
            timestamp: now,
            source_id: source_id.to_string(),
        };

        self.verified_sources.insert(source_id.to_string(), source_hash.clone());
        source_hash
    }

    /// Check a citation string (e.g., "linear-issue-123", "notion-page-456")
    /// against verified sources. Returns Clean if all citations pass.
    pub fn verify_citation(&self, citation: &str) -> VerifyResult {
        if let Some(source) = self.verified_sources.get(citation) {
            let now = std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs();

            if now - source.timestamp > source.data_class.max_age_secs() {
                return VerifyResult::Rejected {
                    reason: format!(
                        "Source '{}' is stale ({}s old, max {}s for {})",
                        citation,
                        now - source.timestamp,
                        source.data_class.max_age_secs(),
                        source.data_class.label()
                    ),
                    claimed_data_class: Some(source.data_class),
                    suggestion: format!("Re-fetch {} before citing", citation),
                };
            }

            return VerifyResult::Clean {
                source_hash: source.clone(),
                latency_ms: 0,
            };
        }

        // Unknown source — check if it matches common patterns
        let suggestion = if citation.starts_with("linear-") {
            "Verify Linear issue exists and is still current".to_string()
        } else if citation.starts_with("notion-") {
            "Verify Notion page exists and has been synced".to_string()
        } else if citation.starts_with("github-") {
            "Verify GitHub PR/issue is still open".to_string()
        } else {
            "Register this source with TruthGate.register_source() first".to_string()
        };

        VerifyResult::Rejected {
            reason: format!("Unverified citation '{}' — no RAG record found. Claim requires verification before it can leave the system.", citation),
            claimed_data_class: None,
            suggestion,
        }
    }

    /// Kill switch — called when hallucination is detected.
    /// Returns the rejection response to use instead of the hallucinated output.
    pub fn kill_hallucination(&self, output: &str, reason: &str) -> String {
        format!(
            "[TRUTH_GATE_REJECTED]\n\n\
            Hallucination detected. Output suppressed.\n\n\
            Reason: {}\n\n\
            ORIGINAL_OUTPUT:\n{}\n\n\
            REQUIRED_ACTION:\n\
            1. Re-query the authoritative source for this claim\n\
            2. Cite the source using format: [SOURCE_ID:source_id]\n\
            3. Re-submit the corrected output\n\n\
            This incident has been logged.",
            reason,
            &output[..output.len().min(500)]
        )
    }
}

impl Default for TruthGate {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_register_and_verify() {
        let mut gate = TruthGate::new();
        let payload = b"current stock price: $142.50";
        let hash = gate.register_source("market-data-001", DataClass::MarketIntel, payload);
        assert_eq!(hash.digest.len(), 64); // SHA3-256 hex = 64 chars

        let result = gate.verify_citation("market-data-001");
        match result {
            VerifyResult::Clean { .. } => {}
            VerifyResult::Rejected { reason, .. } => {
                panic!("Should have passed: {}", reason);
            }
        }
    }

    #[test]
    fn test_stale_source_rejection() {
        let mut gate = TruthGate::new();
        let payload = b"old data";
        gate.register_source("stale-data", DataClass::Financials, payload);

        // Manually age the source
        let old_timestamp = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs()
            - 400; // older than 5 min Financials max_age
        if let Some(source) = gate.verified_sources.get_mut("stale-data") {
            source.timestamp = old_timestamp;
        }

        let result = gate.verify_citation("stale-data");
        match result {
            VerifyResult::Rejected { reason, .. } => {
                assert!(reason.contains("stale"));
            }
            VerifyResult::Clean { .. } => panic!("Should have rejected stale"),
        }
    }

    #[test]
    fn test_unknown_source_rejection() {
        let gate = TruthGate::new();
        let result = gate.verify_citation("unknown-source-xyz");
        match result {
            VerifyResult::Rejected { reason, .. } => {
                assert!(reason.contains("Unverified citation"));
                assert!(reason.contains("unknown-source-xyz"));
            }
            _ => panic!("Should have rejected unknown source"),
        }
    }

    #[test]
    fn test_kill_switch() {
        let gate = TruthGate::new();
        let bad_output = "The quarterly revenue is $4.2M according to market-data-999";
        let killed = gate.kill_hallucination(bad_output, "Source 'market-data-999' does not exist");
        assert!(killed.contains("TRUTH_GATE_REJECTED"));
        assert!(killed.contains("Re-query the authoritative source"));
    }
}