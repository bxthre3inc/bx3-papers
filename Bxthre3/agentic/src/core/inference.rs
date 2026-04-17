//! Inference Node — LLM dispatch + mesh offload + CTC injection
//!
//! Task processing pipeline: accepts TCO → routes via IER → calls LLM → injects CTC → returns result.