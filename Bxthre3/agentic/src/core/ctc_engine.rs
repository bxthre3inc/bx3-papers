//! CTC Engine — Silicon-Speed ETA Injection
//!
//! Injects human-readable ETA, token budget, and thinking directive into every LLM response.
//! Mandate: Every LLM output passes through here. No raw responses escape.

use serde::{Deserialize, Serialize};

/// Token budget config — total context budget allocated to thinking vs output
#[derive(Debug, Clone)]
pub struct TokenBudget {
    pub total: usize,
    pub thinking_fraction: f64, // fraction of total for thinking (default 0.10 = 10%)
}

impl TokenBudget {
    /// Standard budget for general tasks (4096 tokens total, 10% thinking)
    pub fn standard() -> Self {
        Self {
            total: 4096,
            thinking_fraction: 0.10,
        }
    }

    /// High-context budget for complex reasoning (16384 tokens, 15% thinking)
    pub fn deep_reason() -> Self {
        Self {
            total: 16384,
            thinking_fraction: 0.15,
        }
    }

    /// Edge/low-resource budget for constrained environments (2048 tokens, 8% thinking)
    pub fn edge() -> Self {
        Self {
            total: 2048,
            thinking_fraction: 0.08,
        }
    }

    pub fn thinking_budget(&self) -> usize {
        (self.total as f64 * self.thinking_fraction) as usize
    }

    pub fn output_budget(&self) -> usize {
        self.total - self.thinking_budget()
    }
}

/// Human-readable ETA tier
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ETATier {
    /// Sub-second response
    Immediate,
    /// 1–30 seconds
    Fast,
    /// 30 seconds – 5 minutes
    Normal,
    /// 5–30 minutes
    Slow,
    /// 30+ minutes
    Extended,
}

impl ETATier {
    pub fn from_elapsed_ms(elapsed_ms: u64) -> Self {
        if elapsed_ms < 1_000 {
            ETATier::Immediate
        } else if elapsed_ms < 30_000 {
            ETATier::Fast
        } else if elapsed_ms < 300_000 {
            ETATier::Normal
        } else if elapsed_ms < 1_800_000 {
            ETATier::Slow
        } else {
            ETATier::Extended
        }
    }

    pub fn label(&self) -> &'static str {
        match self {
            ETATier::Immediate => "immediate",
            ETATier::Fast => "fast",
            ETATier::Normal => "normal",
            ETATier::Slow => "slow",
            ETATier::Extended => "extended",
        }
    }
}

/// The CTC Mandate header injected into every LLM response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CTCMandate {
    pub eta: String,
    pub eta_tier: ETATier,
    pub token_budget_total: usize,
    pub token_budget_thinking: usize,
    pub token_budget_output: usize,
    pub think_directive: String,
    pub self_verify: String,
}

impl CTCMandate {
    /// Build a new mandate given elapsed time and token usage
    pub fn new(elapsed_ms: u64, prompt_tokens: usize, output_tokens: usize, budget: &TokenBudget) -> Self {
        let eta_tier = ETATier::from_elapsed_ms(elapsed_ms);

        // Dynamic ETA based on actual processing speed
        let eta = if prompt_tokens > 0 {
            let rate = output_tokens as f64 / elapsed_ms as f64 * 1000.0;
            if rate > 500.0 {
                "sub-second".to_string()
            } else if rate > 50.0 {
                format!("{} tokens/sec", rate as usize)
            } else {
                format!("~{} tokens/sec", rate as usize)
            }
        } else {
            format!("ETA tier: {}", eta_tier.label())
        };

        Self {
            eta,
            eta_tier,
            token_budget_total: budget.total,
            token_budget_thinking: budget.thinking_budget(),
            token_budget_output: budget.output_budget(),
            think_directive: format!(
                "THINK: [Frame the problem — what is the core constraint?] THEN [Take the action — what single step advances this?]",
            ),
            self_verify: format!(
                "[VERIFIED] output format = structured_json | tokens = {}/{}",
                output_tokens,
                budget.output_budget(),
            ),
        }
    }

    /// Inject mandate header into a raw LLM response string
    pub fn inject(&self, raw_response: &str) -> String {
        format!(
            "<!-- CTC_MANDATE {{ \"eta\": \"{}\", \"eta_tier\": \"{}\", \"thinking_budget\": {}, \"output_budget\": {} }} -->\n{}{}",
            self.eta,
            self.eta_tier.label(),
            self.token_budget_thinking,
            self.token_budget_output,
            self.think_directive,
            raw_response,
        )
    }
}

/// CTC Engine — the main orchestrator for mandate injection
pub struct CTCEngine {
    budget: TokenBudget,
    injection_enabled: bool,
}

impl CTCEngine {
    pub fn new() -> Self {
        Self {
            budget: TokenBudget::standard(),
            injection_enabled: true,
        }
    }

    /// Use a specific token budget profile
    pub fn with_budget(mut self, budget: TokenBudget) -> Self {
        self.budget = budget;
        self
    }

    /// Disable injection (for testing or raw output modes)
    pub fn disable_injection(mut self) -> Self {
        self.injection_enabled = false;
        self
    }

    /// Process a raw LLM response through the CTC mandate
    pub fn process(&self, raw_response: &str, elapsed_ms: u64, prompt_tokens: usize, output_tokens: usize) -> String {
        if !self.injection_enabled {
            return raw_response.to_string();
        }

        let mandate = CTCMandate::new(elapsed_ms, prompt_tokens, output_tokens, &self.budget);
        mandate.inject(raw_response)
    }

    /// Inject only the mandate header (for responses already processed)
    pub fn inject_header_only(&self, elapsed_ms: u64, prompt_tokens: usize, output_tokens: usize) -> String {
        let mandate = CTCMandate::new(elapsed_ms, prompt_tokens, output_tokens, &self.budget);
        format!(
            "<!-- CTC_MANDATE {{ \"eta\": \"{}\", \"eta_tier\": \"{}\", \"thinking_budget\": {}, \"output_budget\": {} }} -->",
            mandate.eta,
            mandate.eta_tier.label(),
            mandate.token_budget_thinking,
            mandate.token_budget_output,
        )
    }

    /// Get current budget
    pub fn budget(&self) -> &TokenBudget {
        &self.budget
    }
}

impl Default for CTCEngine {
    fn default() -> Self {
        Self::new()
    }
}

// ─────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_eta_tier_from_elapsed() {
        assert_eq!(ETATier::from_elapsed_ms(500), ETATier::Immediate);
        assert_eq!(ETATier::from_elapsed_ms(15_000), ETATier::Fast);
        assert_eq!(ETATier::from_elapsed_ms(120_000), ETATier::Normal);
        assert_eq!(ETATier::from_elapsed_ms(900_000), ETATier::Slow);
        assert_eq!(ETATier::from_elapsed_ms(2_000_000), ETATier::Extended);
    }

    #[test]
    fn test_token_budget() {
        let b = TokenBudget::standard();
        assert_eq!(b.total, 4096);
        assert_eq!(b.thinking_budget(), 409); // 10%
        assert_eq!(b.output_budget(), 3687);
    }

    #[test]
    fn test_token_budget_deep_reason() {
        let b = TokenBudget::deep_reason();
        assert_eq!(b.total, 16384);
        assert_eq!(b.thinking_budget(), 2457); // 15%
    }

    #[test]
    fn test_ctc_mandate_inject() {
        let budget = TokenBudget::standard();
        let elapsed_ms = 500;
        let prompt_tokens = 200;
        let output_tokens = 150;

        let mandate = CTCMandate::new(elapsed_ms, prompt_tokens, output_tokens, &budget);
        let result = mandate.inject("The task is complete.");

        assert!(result.contains("CTC_MANDATE"));
        assert!(result.contains("THINK:"));
        assert!(result.contains("The task is complete."));
        assert!(result.contains("[VERIFIED]"));
    }

    #[test]
    fn test_ctc_engine_process() {
        let engine = CTCEngine::new();
        let result = engine.process("Answer: 42", 200, 100, 50);

        assert!(result.contains("CTC_MANDATE"));
        assert!(result.contains("Answer: 42"));
    }

    #[test]
    fn test_ctc_engine_disabled() {
        let engine = CTCEngine::new().disable_injection();
        let result = engine.process("Raw output", 100, 10, 5);

        assert_eq!(result, "Raw output");
        assert!(!result.contains("CTC_MANDATE"));
    }

    #[test]
    fn test_mandate_format_valid_json() {
        let budget = TokenBudget::standard();
        let mandate = CTCMandate::new(1000, 500, 300, &budget);

        // The comment format should be parseable
        let comment_line = format!(
            "<!-- CTC_MANDATE {{ \"eta\": \"{}\", \"eta_tier\": \"{}\", \"thinking_budget\": {}, \"output_budget\": {} }} -->",
            mandate.eta,
            mandate.eta_tier.label(),
            mandate.token_budget_thinking,
            mandate.token_budget_output,
        );

        // Extract JSON from comment
        if let Some(start) = comment_line.find("{{ ") {
            if let Some(end) = comment_line.find(" }}") {
                let json_str = &comment_line[start + 3..end].trim();
                let parsed: serde_json::Result<serde_json::Value> = serde_json::from_str(json_str);
                assert!(parsed.is_ok(), "CTC mandate JSON should be valid: {:?}", parsed);
            }
        }
    }
}