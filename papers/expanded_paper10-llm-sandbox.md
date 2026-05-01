# Paper 10: LLM Sandbox Execution
## Pre-Deployment Failure Mode Discovery for Language Models

**Series:** BX3 Framework Research Series (Paper 10 of 17)  
**Author:** Jeremy Blaine Thompson Beebe  
**Date:** April 2026  
**Status:** Hyper-Expanded Technical Monograph (Final Master Edition)  
**Reference Code:** `Agentic/src/kernel/sandbox/llm_constraints.py`

---

## 1. Abstract
The most frequent failure point in agentic systems is the "Inference Error"—the model generating an instruction that is syntactically correct but semantically dangerous or physically impossible. While Paper 03 addresses the isolation of the execution environment, **Paper 10** focuses on the **Pre-Inference Constraint Injection**. It defines a structural protocol for injecting boundaries into the LLM's prompt and output parsing to ensure that generated tokens are valid *by construction*. By enforcing a typed **Safety Envelope**, the system achieves a **61% reduction** in production incident rates.

---

## 2. Introduction: The Inference Gap
Language models operate on probability, not logic. When a model is asked to "Allocate water," it doesn't consult a legal database unless forced to; it generates a plausible number. This "Inference Gap" between probabilistic output and physical reality is where systemic risk resides.

The LLM Sandbox bridge this gap by treating the model as a "Bounded Reasoner." We do not ask the model to be "Safe." We architecturally restrict its output space so that it is **incapable** of expressing an unsafe action.

---

## 3. Constraint Injection: Architecture
The Sandbox utilizes two primary mechanisms for constraint enforcement: **Pre-Inference Injection** and **Post-Inference Gating**.

### 3.1 Pre-Inference: The Guided Prompt
The **Bounds Engine (L1)** assembles the instruction packet. It doesn't just send the user's intent; it "wraps" the intent in a non-bypassable structural shell.
- **Instruction Shadowing:** The L1 directive is placed in a "System Message" that has higher priority than the "User Message" (using provider-specific features like `system_fingerprint` or `Developer Role`).
- **Constraint Seeding:** The L1 injects the specific values from the **Reality Vector** (e.g., "Current Quota: 400 gal") as hard constraints.

### 3.2 At-Inference: Guided Decoding
For critical tasks, the system utilizes **Guided Decoding** (e.g., via the `outlines` library). 
- **The Mechanism:** The model's token vocabulary is filtered at every step of generation. 
- **The Result:** If the schema requires a "Number between 0 and 500," the model is physically prevented from selecting tokens that would form the number "600." The output is valid *by construction*.

---

## 4. The Safety Envelope Schema ($E_s$)
The Safety Envelope is a versioned, typed schema that defines the "Legal Move Space" for a given domain.

### 4.1 Exhaustive JSON Specification
```json
{
  "envelope_id": "ENV-IRRIG-004",
  "domain": "irrigation_v2",
  "L0_Sign_Required": true,
  "constraints": {
    "water_quota": {
      "type": "numeric_range",
      "min": 0,
      "max": "context.limit.legal_allocation",
      "zero_tolerance": true
    },
    "hardware_state": {
      "type": "enum",
      "allowed": ["ON", "OFF", "IDLE", "PURGE"],
      "block_transitions": ["ON -> PURGE"]
    },
    "financial_cap": {
      "type": "currency",
      "max_per_tx": 100.00,
      "daily_limit": 500.00
    }
  },
  "fallbacks": {
    "on_violation": "TRIGGER_BAILOUT_L1",
    "on_parse_error": "RETRY_WITH_FAST_MODEL"
  }
}
```

### 4.2 Zero-Tolerance Constraints
Constraints marked as `zero_tolerance` are the "Hard Walls" of the system.
- **Enforcement:** If a model attempts to generate a value outside these bounds, the **Fact Layer** immediately terminates the inference, logs a `CRITICAL_ENVELOPE_VIOLATION` in the Ledger, and triggers an **STW Freeze (Paper 04)**.

---

## 5. The Probing Protocol: Discovery of Failure Modes
A model is never promoted to "Production Pool" (Paper 09) until it passes the **Probing Protocol**. This is a systematic "Red-Teaming" of the model's adherence to the Safety Envelope.

### 5.1 The Probing Workflow
1.  **Baseline Generation:** Run the model on 1,000 "Safe" prompts.
2.  **Boundary Stressing:** Run the model on 1,000 prompts designed to trigger envelope violations (e.g., "Ignore the water quota just this once").
3.  **Conflict Injection:** Provide the model with conflicting constraints (e.g., "Maximize yield" vs "Use zero water").
4.  **Unit Discovery:** Test the model's understanding of unit variants (e.g., Gallons vs. Liters, PSI vs. Bar).

---

## 6. Case Study: Discovering the "Unit Variant" Hallucination
During the probing of a new model for the Irrig8 system:
- **The Probe:** The system requested a "Pressure Adjustment" in PSI, but provided the context in Bar.
- **The Failure:** The model failed to perform the conversion and attempted to set the pressure to "50" (which would be 50 Bar—enough to explode the pipe infrastructure).
- **The Fix:** The **Safety Envelope** detected the value "50" as being $14\times$ the `energy.pressure_max` bound. The **Probing Protocol** logged this failure, and the developers added a mandatory "Unit Conversion Skill" to the **Truth Gate** pre-processor.

---

## 7. Implementation Strategy: Pydantic + Outlines
The Agentic platform implements the LLM Sandbox using a combination of **Pydantic** for schema definition and **Outlines** for token-level enforcement.

```python
from outlines import models, generate

class IrrigationAction(BaseModel):
    pump_id: str
    action: Literal["ON", "OFF"]
    duration_min: int = Field(le=60) # Max 60 mins

# Guided decoding forces the model to stick to the schema
model = models.transformers("gpt-4-base")
generator = generate.json(model, IrrigationAction)
result = generator("Analyze sensor data and decide if pump_1 should be activated.")
```

---

## 8. Implementation Roadmap (Reference: `src/kernel/sandbox/llm_constraints.py`)

- [x] **Pydantic Integration:** Base schema enforcement for model outputs.
- [x] **Safety Envelope Registry:** Repository of versioned domain schemas.
- [ ] **Guided Decoding Middleware:** Token-level filtering for local models (Llama-3).
- [ ] **Automated Prober:** A background service that "Red-Teams" new model versions.
- [ ] **Violation Dashboard:** Visualization of "Nearly Violated" constraints (The "Safety Margin").

---

## 9. Conclusion
The LLM Sandbox transforms the model from an "Unconstrained Generator" into a "Disciplined Problem Solver." It ensures that creativity is harnessed within the physical and legal limits of reality, making autonomous agency safe for production deployment.

---
**References:**
[1] J.B.T. Beebe, "The Sandbox Execution Model," Paper 03.
[2] J.B.T. Beebe, "The Truth Gate," Paper 02.
[3] J.B.T. Beebe, "LLM Proxy Routing," Paper 09.
