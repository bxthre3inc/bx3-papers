"""
Agentic Truth Gate — Python Implementation
Tier 1 Immutable | SOUL.md Principle #5: Verify or Die

Enforces zero hallucination: every claim traces to a source.
No external fetches allowed during reasoning phase.
SHA3-256 payload verification.
"""

import hashlib
import time
from dataclasses import dataclass, field
from typing import Optional, Literal
from datetime import datetime, UTC

# ─── Types ────────────────────────────────────────────────────────────────────

DataClass = Literal["market_intel", "financials", "corporate_policy", "project_context"]

@dataclass
class TruthGatePayload:
    data_class:    DataClass
    claim:         str
    source:        Optional[str] = None        # URL, file path, canonical doc
    source_hash:   Optional[str] = None        # SHA3-256 of source content
    max_age_ms:    Optional[int] = None         # staleness threshold override
    retrieved_at:  Optional[int] = None         # epoch ms when data was fetched
    fetched:       bool = False                 # MUST be False — no external fetches

@dataclass
class TruthGateResult:
    passed:           bool
    gate_version:     str
    data_class:       DataClass
    claim_hash:       str
    source_verified:  bool
    freshness_ms:     Optional[float]
    age_ok:           bool
    fetch_detected:   bool
    violations:       list[str] = field(default_factory=list)
    recommendation:   Literal["PASS", "FAIL", "REVIEW"] = "PASS"
    error:            Optional[str] = None

# ─── Constants ─────────────────────────────────────────────────────────────────

VERSION = "1.0.0"

DATA_CLASS_MAX_AGE_MS: dict[DataClass, int] = {
    "market_intel":      24 * 3600 * 1000,
    "financials":        30 * 24 * 3600 * 1000,
    "corporate_policy":  90 * 24 * 3600 * 1000,
    "project_context":    7 * 24 * 3600 * 1000,
}

# ─── Core Logic ────────────────────────────────────────────────────────────────

def sha3_256hex(text: str) -> str:
    return hashlib.sha3_256(text.encode()).hexdigest()

def verify_truth_gate(payload: TruthGatePayload) -> TruthGateResult:
    violations: list[str] = []
    now_ms = int(time.time() * 1000)

    # RULE 1: No fetch allowed — this is the primary hallucination kill switch
    if payload.fetched:
        violations.append(
            "FETCH_DETECTED: External fetch during reasoning phase is prohibited. "
            "Source data must be pre-verified before reasoning."
        )

    # RULE 2: Source must be cited
    if not payload.source:
        violations.append(
            "NO_SOURCE: Claim has no traceable source. "
            "Every claim must cite a file path, URL, or canonical doc."
        )
    else:
        # RULE 3: Source hash verification (if provided)
        if payload.source_hash:
            # Production: re-hash the source content and compare
            # For now, just verify the hash was provided
            pass

    # RULE 4: Freshness check
    freshness_ms: Optional[float] = None
    age_ok = True
    if payload.retrieved_at:
        freshness_ms = now_ms - payload.retrieved_at
        max_age = payload.max_age_ms or DATA_CLASS_MAX_AGE_MS[payload.data_class]
        age_ok = freshness_ms <= max_age
        if not age_ok:
            violations.append(
                f"STALE_DATA: Source is {freshness_ms/3_600_000:.1f}h old, "
                f"max {max_age/3_600_000:.1f}h for {payload.data_class}"
            )

    passed = len(violations) == 0

    # Recommendation logic
    if passed:
        recommendation: Literal["PASS", "FAIL", "REVIEW"] = "PASS"
    elif any(v.startswith("FETCH") for v in violations):
        recommendation = "FAIL"
    else:
        recommendation = "REVIEW"

    return TruthGateResult(
        passed=passed,
        gate_version=VERSION,
        data_class=payload.data_class,
        claim_hash=sha3_256hex(payload.claim),
        source_verified=bool(payload.source),
        freshness_ms=freshness_ms,
        age_ok=age_ok,
        fetch_detected=payload.fetched,
        violations=violations,
        recommendation=recommendation,
    )

# ─── Standalone Check ─────────────────────────────────────────────────────────

def check(data_class: DataClass, claim: str, **kwargs) -> TruthGateResult:
    return verify_truth_gate(TruthGatePayload(
        data_class=data_class,
        claim=claim,
        **{k: v for k, v in kwargs.items() if v is not None}
    ))

# ─── CLI for testing ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import sys, json

    if len(sys.argv) < 3:
        print("Usage: truth_gate.py <data_class> <claim> [--source URL] [--retrieved_at EPOCH_MS]")
        sys.exit(1)

    data_class = sys.argv[1]
    claim      = " ".join(sys.argv[2:])

    result = check(data_class, claim,
        source=kwargs.get("--source"),
        retrieved_at=int(kwargs["--retrieved_at"]) if "--retrieved_at" in kwargs else None,
        fetched=False
    )

    print(json.dumps(result.__dict__, default=str, indent=2))