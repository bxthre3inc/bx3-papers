# Technology Radar — Bxthre3 R&D
> Last Updated: 2026-04-01
> Maintainer: Scout (R&D Lead)

---

## How to Read This Radar

- **🔴 ADOPT** — Move fast. High confidence, ready for production evaluation.
- **🟡 EVALUATE** — Proof of concept warranted. Active monitoring required.
- **🟢 HOLD** — Maintain awareness. Not yet relevant to Bxthre3 stack.
- **⚫ ARCHIVED** — No longer tracked. Was previously on radar.

---

## Agent & Orchestration Layer

### 🔴 ADOPT

| Technology | Signal | Bxthre3 Relevance | Status |
|---|---|---|---|
| **Model Context Protocol (MCP)** | 56 production servers; DomainTools live; AI-SPM emerging; A2A complementary | Zoe tool layer → MCP wiring in Q2; highest priority arch decision | Active |
| **GPT-5.4 Thinking** | Native computer use; 1M token context; 95% USAMO 2026; 83% spreadsheet vs 68% | Benchmark Zoe vs GPT-5.4 Thinking on complex orchestration | Benchmark pending |

### 🟡 EVALUATE

| Technology | Signal | Bxthre3 Relevance | Status |
|---|---|---|---|
| **OpenClaw** | 210K GitHub stars; inside OpenAI ecosystem; wearable StepClaw launched; enterprise gate holds | Commoditization risk for horizontal tooling; moat is vertical depth + deterministic data | Positioning doc needed before AgentCon May 4 |
| **Agency Agents** | 35K stars; 51 AI specialists across 9 departments | Proof that multi-agent company models work; Agentic already has more | Monitor |
| **Self-Evolving Agents (Meta)** | Data-free agent adaptation via HRPO; matches supervised agents | Could reduce Irrig8 vertical expansion costs; long-term watch | Research phase |

### 🟢 HOLD

| Technology | Signal | Rationale |
|---|---|---|
| **Claude Opus 4.6** | Still leads SWE-bench coding; no major update this cycle | No change; monitor for Claude 5.x |
| **CrewAI** | Growing enterprise adoption; multi-agent orchestration | Agentic already operational with more agents |
| **LangChain** | Developer framework, wide adoption | Zo/Agentic = higher abstraction |
| **AutoGPT** | Consumer agentic AI, broad awareness | No domain depth; not Bxthre3 moat |

### ⚫ ARCHIVED

| Technology | Reason |
|---|---|
| **FarmSense** | Retired 2026-03-23; canonical name is Irrig8 |
| **GPT-5.2** | Superseded by GPT-5.4 |

---

## Multimodal & Foundation Models

### 🟡 EVALUATE

| Technology | Signal | Bxthre3 Relevance | Status |
|---|---|---|---|
| **GPT-5.4 Mini** | 94% of coding performance at 1/6th cost ($0.40/$1.60 per 1M tokens) | Evaluate for high-volume coding tasks | Await task need |
| **Kakao Honeybee MLLM** | Multimodal: text, images, video, audio, coding; open source module | Hold for voice interface phase of Irrig8 | Future phase |
| **SpeechGPT / AudioGPT** | Text-to-speech; multimodal conversation | Hold for voice interface phase | Future phase |

### 🟢 HOLD

| Technology | Signal | Rationale |
|---|---|---|
| **Gemini 2.5 Flash Audio** | Voice model benchmark tight with GPT-4o Audio | Hold for voice interface phase |
| **SuperNinja AI Agent** | Autonomous VM-based agents, multi-model | Consumer-grade; not relevant |

---

## Infrastructure & Tooling

### 🟡 EVALUATE

| Technology | Signal | Bxthre3 Relevance | Status |
|---|---|---|---|
| **Lightpanda** | Headless browser built for agents; 11x faster, 9x less memory than Chromium | Monitor for Agentic browser automation needs | Monitoring |
| **llmfit** | Hardware benchmarking CLI; benchmarks every model against your hardware | Useful for Engineering toolchain decisions | Monitoring |

### 🟢 HOLD

| Technology | Signal | Rationale |
|---|---|---|
| **Nvidia NeMoClaw** | Enterprise on-prem agent deployment | Monitor for Agentic enterprise tier需求 | Future |

---

## Enterprise & Production Trends

### 🔴 ADOPT

| Trend | Signal | Bxthre3 Relevance | Status |
|---|---|---|---|
| **AI Agent Scaling Gap** | 78% pilot, 14% production (March 2026, 650 enterprises) | VALIDATION: gap is operational, not technical. Agentic has deterministic UX + sensor data + operational structure | Messaging asset for sales/marketing |

### 🟡 EVALUATE

| Trend | Signal | Bxthre3 Relevance | Status |
|---|---|---|---|
| **AI-SPM (AI Security Posture Management)** | New category; MCP CVE tracking active | Sentinel/Vault should evaluate tooling | Engagement pending |
| **Multi-Agent LLM Academic Codification** | IGI Global research chapter published; patterns now mainstream | Position Agentic in academic framing; potential research dataset from Irrig8 energy data | Long-term |

---

## Key Events Calendar

| Event | Date | Radar Relevance |
|---|---|---|
| **AgentCon San Francisco** | May 4, 2026 | OpenClaw momentum; positioning doc needed BEFORE this |
| **LangChain Interrupt** | May 13–14, 2026 | Agent framework competition landscape |

---

## Change Log

| Date | Changes |
|---|---|
| 2026-04-01 | Initial radar. Added MCP (ADOPT), OpenClaw (EVALUATE), Enterprise Scaling Gap (ADOPT), Self-Evolving Agents (EVALUATE). Archived FarmSense. |
| 2026-03-24 | Previous scan: GPT-5.4 (ADOPT), MCP (ADOPT), OpenClaw (EVALUATE), Claude Opus 4.6 (EVALUATE) |

---

*Maintained by Scout — R&D Lead*
*Next scheduled update: 2026-04-07 (weekly cadence)*
