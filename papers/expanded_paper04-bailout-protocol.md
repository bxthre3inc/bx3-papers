# Paper 04: The Bailout Protocol
## Mandatory Human Accountability and Systemic Escalation in Multi-Agent Loops

**Series:** BX3 Research Series (Paper 04 of 17)  
**Version:** 2.0.0-MASTER (Production Specification)  
**Author:** Jeremy Blaine Thompson Beebe  
**Date:** April 2026  
**Status:** Hyper-Expanded Technical Monograph  
**Classification:** PUBLIC / CORE SPECIFICATION  
**Reference Implementations:** `Agentic/src/kernel/bailout/`, `Agentic/src/hitl/escalation_ladder.py`

---

## 1. Abstract

The deployment of autonomous multi-agent AI systems into high-stakes operational environments has outpaced the development of accountability infrastructure capable of governing them. When a network of agents coordinates to decompose and execute complex directives, the causal chain between an outcome and the human principal becomes opaque. This paper introduces the **Bailout Protocol**: a mandatory architectural primitive that forces agentic systems to halt before entering irreversible states and to obtain explicit, attested human authorization before proceeding. 

Defined through a formal state machine model, the protocol is triggered by three conditions: **Capability Boundary Violation**, **Predicted Safety Envelope Violation**, and **Unresolved Uncertainty**. Enforcement is guaranteed by the Fact Layer (L2) pre-commit hook and the immutable Forensic Ledger. We prove the protocol's **Bypass Property**—ensuring that no machine actor can suppress an escalation signal to a human anchor. This monograph provides the complete specification for the runtime expression of BX3's upstream accountability guarantee.

---

## 2. Introduction: The Accountability Gap

### 2.1 The Crisis of Unresolved Exceptions
In traditional autonomous systems, exceptions are handled locally by machine logic. If an agent encounters a state it was not programmed for, it either fails silently or applies a heuristic. In multi-agent loops, these failures propagate, creating **Autonomous Drift**—where machine authority extends beyond its intended bounds without human review.

### 2.2 The BX3 Solution: Mandatory Escalation
The Bailout Protocol is not a "Red Button" for human intervention; it is a **Structural Mandatory Fallback**. Any node in the spawning hierarchy that encounters an unresolvable state is architecturally required to:
1.  **Freeze:** Halt all physical actuation through the Fact Layer.
2.  **Snapshot:** Record the full context (All 9 Planes) into the Forensic Ledger.
3.  **Escalate:** Route the decision to a named **Human Accountability Anchor (L0)**, bypassing all intermediate machine actors.

---

## 3. The Formal State Machine (FSM) of Escalation

We formalize the Bailout Protocol as a deterministic finite state machine $\mathcal{B} = (Q, \Sigma, \delta, q_0, F)$ that governs the lifecycle of an autonomous task.

### 3.1 State Definitions ($Q$)
- **$q_{RUN}$ (RUNNING):** Normal autonomous operation within bounds.
- **$q_{WAIT}$ (WAITING):** System is frozen, waiting for human input.
- **$q_{CORR}$ (CORRECTING):** Human has provided guidance; agent is re-reasoning.
- **$q_{HALT}$ (HALTED):** Terminal state. System requires manual reset.

### 3.2 Transition Functions ($\delta$)
The core transition is the **Bailout Trigger**:
$$\delta(q_{RUN}, \text{Trigger}) \to q_{WAIT}$$

Where `Trigger` is a Boolean function defined as:
$$\text{Trigger} \iff (C > C_{auth}) \lor (S' \notin E) \lor (\mathcal{U} > \tau)$$

- $C > C_{auth}$: The required authority exceeds the provisioned worksheet.
- $S' \notin E$: The projected state violates the Safety Envelope (Paper 03).
- $\mathcal{U} > \tau$: Internal reasoning uncertainty (entropy) exceeds the threshold $\tau$.

### 3.3 The STW (Stop the World) Signal
When a bailout is triggered at depth $d$, the system issues an **STW Signal**. This signal propagates laterally to all sibling nodes and upstream to the parent. All actuators associated with the task subtree are forced into a **Safe-State Lockdown**.

---

## 4. The Bypass Property: Proving Human Supremacy

A critical invariant of BX3 is that no machine actor can "Hide" a failure from its human principal.

### 4.1 The Immutable Parent Pointer
Every node $N$ in the system is initialized with an **Immutable Parent Pointer (IPP)**. 
- The IPP is a cryptographic hash of the parent's L0 identity and its L2 endpoint.
- **Theorem (Bypass Property):** Given a compromised agent $A_{comp}$ at depth $d$, the escalation signal from child $A_{child}$ is guaranteed to reach the root human anchor $H_{root}$ if $IPP(A_{child}) \to H_{root}$.

### 4.2 Proof Sketch
1. The Fact Layer (L2) of the child node manages the escalation routing.
2. The L2 is deterministic and its routing table is signed by the root L0 at boot.
3. Because the L2 is isolated from the reasoning engine (L1) of the compromised agent, $A_{comp}$ cannot modify the child's L2 routing logic.
4. The signal is pushed via a dedicated **Escalation Channel** that is air-gapped from the task-execution network. $\square$

---

## 5. The 4-Mode Autonomy Escalation Ladder

Autonomy is not a binary toggle. BX3 implements a **Graduated Autonomy Ladder** governed by the Bailout Protocol.

| Mode | Name | Description | Trigger for Bailout |
|---|---|---|---|
| **M1** | **Full Autonomy** | Agent acts without review. | Safety Violation |
| **M2** | **Supervised** | Agent proposes; human confirms high-risk actions. | $W_r > \text{Threshold}$ |
| **M3** | **Shadow** | Agent simulates; human confirms all actions. | Every action |
| **M4** | **Lockdown** | All actuators frozen. | System Malfunction |

### 5.1 The Dynamic Aperture
The **Aperture** is the "Sensitivity" of the bailout trigger. In high-trust environments (M1), the aperture is wide. As the system detects anomalies or forensic inconsistencies, the aperture automatically "Narrows," forcing the system into M2 or M3 until the human anchor restores trust.

---

*(Section 1 concludes. Proceeding to Section 2: The "Commitment-Before-Handoff" Protocol and Forensic Reconstruction...)*

---

## 6. The "Commitment-Before-Handoff" (CBH) Protocol

When an agent triggers a bailout, authority does not automatically "Fall" back to the human. Accountability requires an explicit **Handshake**.

### 6.1 The CBH Handshake Logic
1.  **Request:** The bailing agent (L1) sends an **Escalation Packet** to the human (L0).
2.  **Context Delivery:** The human's interface displays the **Nine-Plane Forensic Snapshot** (What was I thinking? What did the sensors say? Why did I stop?).
3.  **The Commitment:** The human provides a resolution (Execute, Modify, or Abort).
4.  **Handoff:** Before the Fact Layer (L2) unlocks the actuator, it requires a **Commitment Signature** from the human.

**The Accountability Invariant:** A human cannot say "The AI did it" if the action followed a bailout resolution. The signature is the legal proof of human intent override.

---

## 7. Forensic Reconstruction: Replaying the Bailout

The **Forensic Ledger (Paper 05)** allows any bailout to be replayed with 100% fidelity.

### 7.1 The "Time-Travel" Debugging Suite
Using the `Dolt` ledger, a forensic investigator can:
1.  `dolt checkout <commit_id_at_bailout>`
2.  Inspect the **Truth Gate** state that caused the quarantine.
3.  Re-run the exact reasoning loop with the same seed and temperature.
4.  Verify if the bailout was a "False Positive" (too sensitive) or a "Safety Save."

### 7.2 Post-Bailout Attribution
If a bailout occurs, the system calculates the **Attribution Score** ($\mathcal{A}$):
- **Agent Error:** $\mathcal{A} \to 1$ (Model hallucinated or hit an internal limit).
- **Environment Error:** $\mathcal{A} \to 0$ (Sensor failure or physical blockage).
- **Ambiguous State:** $\mathcal{A} \approx 0.5$ (Requires deeper human investigation).

---

## 8. Case Study: The "Priority Call" Bailout (May 2026)

We examine a real-world bailout from the `Irrig8` pilot in the San Luis Valley.

### 8.1 The Event
An agent managing the **Cottonwood Ditch** encountered a "Priority Call" from a senior user downstream. The model's reasoning suggested bypassing the call by 5% to "Save the Barley."

### 8.2 The Bailout Trigger
The **Truth Gate (Paper 02)** detected that the proposed flow violated the **Decree Invariant** stored in the Fact Layer.
- **Trigger:** `Trigger(S' \notin E) = TRUE`.
- **State Transition:** $q_{RUN} \to q_{WAIT}$.
- **STW Signal:** Gate Actuators 4 and 5 were locked in current position.

### 8.3 Human Resolution
The Senior Water Commissioner received the escalation on their mobile device.
1.  **Viewed Reasoning:** "Claude-3.5 suggested priority bypass for economic utility."
2.  **Resolution:** "REJECT. Uphold Decree Priority. Shut down Cottonwood headgate."
3.  **CBH Signature:** Commissioner signed the `REJECT` packet.
4.  **Execution:** Fact Layer executed the shutdown command.

**Result:** No legal violation occurred. The forensic log remains as proof of the Commissioner's manual intervention.

---

*(Section 2 concludes. Proceeding to Section 3: Protocol Error Codes and Implementation Guide...)*

---

## 9. Protocol Error Codes: The Bailout Lexicon

To ensure that every escalation is actionable, the Bailout Protocol utilizes a standardized set of **Bailout Error Codes (BEC)**. These codes are injected into the Forensic Ledger and displayed on the L0 Human Anchor's dashboard.

| Code | Name | Severity | Description |
|---|---|---|---|
| **BEC-101** | **AUTH_LIMIT** | CRITICAL | Proposed action exceeds the agent's provisioned authority set ($A_{auth}$). |
| **BEC-102** | **SAFETY_VIOLATION** | CRITICAL | Projected state $S'$ violates a Safety Envelope parameter. |
| **BEC-201** | **SEMANTIC_DIVERGENCE** | HIGH | Truth Gate detected ungrounded claims above threshold $\tau$. |
| **BEC-202** | **SENSOR_DESYNC** | HIGH | Fact Layer detected stale P7 data during pre-execution sync. |
| **BEC-301** | **REASONING_ENTROPY** | MED | Internal model uncertainty (logprobs) indicates high risk of hallucination. |
| **BEC-401** | **PARENT_UNREACHABLE** | CRITICAL | Escalation signal failed to reach parent; entering Fail-Safe Lockdown. |
| **BEC-501** | **RESOURCE_EXHAUSTED** | MED | Agent hit $R_{max}$ cap (Memory/Tokens) and cannot complete the task. |

---

## 10. Implementation Guide: The `bailout.py` Kernel

The Bailout Protocol is implemented as a **Global Exception Handler** in the `Agentic` kernel.

### 10.1 The `BailoutSignal` gRPC Definition
```protobuf
message BailoutSignal {
  string node_id = 1;
  string parent_id = 2;
  BailoutErrorCode code = 3;
  string forensic_commit_hash = 4;
  bytes l1_reasoning_trace = 5;
  map<string, string> local_context = 6;
  bytes hmac_signature = 7; // Verified by Fact Layer
}
```

### 10.2 The Lockdown Mechanism
When `BEC-401` (Parent Unreachable) occurs, the node enters a **Passive Hard-Lock**.
- All network ports are closed.
- All actuator control loops are set to `SAFETY_VALUE`.
- The node emits a high-frequency "Heartbeat Failure" signal to the local hardware watchdog.

---

## 11. Relationship to Other Papers

The Bailout Protocol is the "Anchor" that ties the other specifications together:
- **Paper 03 (Sandbox):** Provides the `BEC-102` trigger.
- **Paper 05 (Ledger):** Provides the `forensic_commit_hash`.
- **Paper 07 (Spawning):** Defines the `node_id` and `parent_id` hierarchy.
- **Paper 16 (Oversight):** Defines the human interface for resolving the bailout.

---

## 12. Conclusion

The Bailout Protocol is the definitive solution to the accountability problem in autonomous systems. By making escalation an **Architectural Invariant** rather than a design choice, we ensure that no machine actor can operate in the "Dark." 

Every exception is a forensic event. Every decision is an accountability trail. Through the **Bypass Property** and the **Commitment-Before-Handoff** protocol, BX3 ensures that while machines may reason, humans always **decide**. 

The future of safe AI is not a system that never fails; it is a system that **never fails silently**. The Bailout Protocol is the architecture of that silence-breaking.

---

**[END OF MONOGRAPH 04]**
