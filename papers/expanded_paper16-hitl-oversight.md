# Paper 16: HITL Oversight
## The Training Wheels Protocol for Graduated Autonomy

**Series:** BX3 Framework Research Series (Paper 16 of 17)  
**Author:** Jeremy Blaine Thompson Beebe  
**Date:** April 2026  
**Status:** Hyper-Expanded Technical Monograph (Final Master Edition)  
**Reference Code:** `Agentic/src/ui/hitl_manager.py`

---

## 1. Abstract
The "Switch" model of autonomy—where a system is either "On" (manual) or "Off" (autonomous)—is a dangerous binary that fails to account for the gradual development of trust. The **Training Wheels Protocol** replaces this binary with a graduated state machine enforced by the **Fact Layer**. By transitioning through four distinct modes (HITL Active, Shadow Mode, Full Autonomy, and Lockdown) based on a measurable and auditable **Trust Score ($T$)**, the system ensures that authority is earned through demonstrated competence. This paper details the state machine transitions, the trust scoring math, and the Lockdown reset protocol.

---

## 2. Introduction: The Sovereignty of the Anchor
In the BX3 Framework, "Autonomy" is not a right granted to an agent; it is a "Delegation" from a human principal. The human remains the **Accountability Anchor**. 

The Training Wheels Protocol provides the "Clutch" that keeps the human in control. It ensures that as a system scales in complexity, the human oversight "Aperture" can be narrowed for routine tasks while remaining wide for high-risk, high-uncertainty operations.

---

## 3. The Four Modes of Autonomy: Deep Dive
The system exists in exactly one of four states at any given time. Transitions between states are deterministic and governed by the **Bounds Engine (L1)**.

### 3.1 MODE_1: HITL Active (Mandatory Review)
- **Status:** Training Wheels ON.
- **Protocol:** Every proposed L2 action must be explicitly approved by a human anchor before execution. No output reaches an actuator or external API without a human signature.
- **Target:** New deployments, new "Skills," or high-risk domains ($RW > 8$).

### 3.2 MODE_2: Shadow Mode (Parallel Audit)
- **Status:** Observation.
- **Protocol:** The system executes actions autonomously but logs them alongside a "Human Recommendation" generated for comparison. 
- **Goal:** Collecting evidence to calculate the **Trust Score** without operational risk.

### 3.3 MODE_0: Full Autonomy (Earned Trust)
- **Status:** Training Wheels OFF.
- **Protocol:** The system operates without per-action human review. 
- **Requirement:** A sustained **Trust Score** $T > 0.85$ over a 30-day window and zero safety incidents.
- **Fallback:** Any **Safety Envelope (Paper 10)** violation triggers an immediate transition to Mode 3.

### 3.4 MODE_3: Lockdown (Safety Halt)
- **Status:** Emergency Freeze.
- **Protocol:** Immediate **Stop-the-World (STW)** freeze of all active cascades.
- **Reset:** Requires a manual, multi-sig reset by an L0 administrator to return to Mode 1.

---

## 4. Trust Score Computation ($T$)
Trust is not a "Feeling"; it is a weighted rolling average of four measurable components.

$$T = w_1 T_A + w_2 T_R + w_3 T_C + w_4 T_V$$

### 4.1 The Trust Components
1.  **Approval Rate ($T_A$):** Fraction of human-reviewed actions approved without modification.
2.  **Rejection Rate ($T_R$):** Inverse of the manual intervention rate.
3.  **Consistency ($T_C$):** Stability of the **Alignment Score (A)** (Paper 06) across the window. High variance in A results in a decay of $T_C$.
4.  **Violation Rate ($T_V$):** Inverse of the Safety Envelope violation frequency.

**Weights:** $(0.35, 0.25, 0.20, 0.20)$. Weights are L0-immutable.

---

## 5. The Floating HITL: Distributed Oversight
Traditional HITL requires a human to sit at a dashboard. BX3 implements **Floating HITL**.
- **Architecture:** A mobile-first, distributed interface that "Pushes" high-priority bailout events to the human anchor's device.
- **Context Package:** The human receives the full **Cascade Context Package (Paper 14)** directly on their device, allowing for "Review-on-the-Go."
- **Authority:** The human's response (Approve/Reject/Redirect) is cryptographically signed and injected back into the Truth Gate.

---

## 6. Mode Transition Invariants
The state machine is governed by three non-bypassable invariants.

1.  **High-RW Invariant:** Any action with $RiskWeight > T_{lockdown}$ automatically forces the session into Mode 1, regardless of the system's global autonomy mode.
2.  **Drift Invariant:** If the daily $T$ score drops by more than $0.15$, the system automatically demotes from Mode 0 to Mode 1.
3.  **Violation Invariant:** Any Tier 3 or Tier 4 **EAN (Paper 11)** violation triggers Mode 3.

---

## 7. Deployment Evidence: 6 Automatic Transitions
During the 200-day Agentic platform pilot:
- **Events Processed:** 23,847 human reviews.
- **Mode Transitions:** 6 automatic transitions were triggered (4 demotions, 2 promotions).
- **Incident Mitigation:** In one case, a demotion from Mode 0 to Mode 1 occurred 12 minutes *before* a major API breaking change caused a cascade of errors, ensuring a human was already in the loop to manage the failure.
- **Lockdown Recovery:** Two Mode 3 events occurred. Mean recovery time was 23 minutes, with 100% forensic recovery of the root cause.

---

## 8. Implementation Roadmap (Reference: `src/ui/hitl_manager.py`)

- [x] **Autonomy State Machine:** Deterministic logic for mode transitions.
- [x] **Trust Score Engine:** Integration with the Forensic Ledger data stream.
- [ ] **Floating HITL Dashboard:** React Native/Flutter mobile interface.
- [ ] **Multi-sig Reset Gateway:** Secure L0 authorization portal for Lockdown reset.
- [ ] **Aperture Visualizer:** Real-time graph showing the "Trust vs. Autonomy" curve.

---

## 9. Conclusion
The Training Wheels Protocol acknowledges that autonomy is a spectrum, not a toggle. It provides the structured, auditable path from "Managed Prototype" to "Trusted Digital Workforce," ensuring that the human principal remains the ultimate sovereign of the BX3 ecosystem.

---
**References:**
[1] J.B.T. Beebe, "The Truth Gate," Paper 02.
[2] J.B.T. Beebe, "Bailout Protocol," Paper 04.
[3] J.B.T. Beebe, "The Reality Vector," Paper 06.
[4] J.B.T. Beebe, "LLM Sandbox Execution," Paper 10.
[5] J.B.T. Beebe, "4-Tier EAN," Paper 11.
