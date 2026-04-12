//! DAP — Deterministic Assessment Protocol (9-Plane Evaluation)
//!
//! Evaluates incoming events against 9 planes.
//! All 9 planes must match for FTE (Full Trust Execution).
//! Planes 7-9 (DHU) gate human authorization.
//!
//! Reference: AGENTIC_V1_BUILD_SPEC.md §2.2

use crate::types::{EventVector, PlaneResult};

/// 9 DAP planes
#[derive(Debug, Clone, Copy)]
pub enum DapPlane {
    /// Plane 1: Temporality — timestamp must be positive
    Temporality,
    /// Plane 2: Spatiality — at least one coordinate must be non-zero
    Spatiality,
    /// Plane 3: Compositional Lower — z_negative threshold
    CompositionalLower,
    /// Plane 4: Economic Value — value threshold
    EconomicValue,
    /// Plane 5: Fidelity — confidence threshold [0.8]
    Fidelity,
    /// Plane 6: Execution Matrix — z_positive threshold
    ExecutionMatrix,
    /// Plane 7: Evolutionary — value fidelity threshold
    Evolutionary,
    /// Plane 8: Thermodynamic Bounds — always true
    Thermodynamic,
    /// Plane 9: Governance — compliance + legal approval
    Governance,
}

impl DapPlane {
    pub fn id(&self) -> u8 {
        match self {
            DapPlane::Temporality => 1,
            DapPlane::Spatiality => 2,
            DapPlane::CompositionalLower => 3,
            DapPlane::EconomicValue => 4,
            DapPlane::Fidelity => 5,
            DapPlane::ExecutionMatrix => 6,
            DapPlane::Evolutionary => 7,
            DapPlane::Thermodynamic => 8,
            DapPlane::Governance => 9,
        }
    }

    pub fn name(&self) -> &'static str {
        match self {
            DapPlane::Temporality => "Temporality",
            DapPlane::Spatiality => "Spatiality",
            DapPlane::CompositionalLower => "Compositional Lower",
            DapPlane::EconomicValue => "Economic Value",
            DapPlane::Fidelity => "Fidelity",
            DapPlane::ExecutionMatrix => "Execution Matrix",
            DapPlane::Evolutionary => "Evolutionary",
            DapPlane::Thermodynamic => "Thermodynamic Bounds",
            DapPlane::Governance => "Governance",
        }
    }

    pub fn threshold_str(&self) -> &'static str {
        match self {
            DapPlane::Temporality => "t > 0",
            DapPlane::Spatiality => "s_x !== 0 || s_y !== 0",
            DapPlane::CompositionalLower => "z_negative < -0.20",
            DapPlane::EconomicValue => "e > 100",
            DapPlane::Fidelity => "c > 0.80",
            DapPlane::ExecutionMatrix => "z_positive < 0.25",
            DapPlane::Evolutionary => "v_f > 0.50",
            DapPlane::Thermodynamic => "default true",
            DapPlane::Governance => "g === COMPLIANT && l === APPROVED",
        }
    }

    /// Evaluate this plane against the given vector.
    pub fn evaluate(&self, v: &EventVector) -> bool {
        match self {
            DapPlane::Temporality => v.t > 0,
            DapPlane::Spatiality => v.s_x != 0.0 || v.s_y != 0.0,
            DapPlane::CompositionalLower => v.z_negative < -0.20,
            DapPlane::EconomicValue => v.e > 100,
            DapPlane::Fidelity => (0.0..=1.0).contains(&v.c) && v.c > 0.80,
            DapPlane::ExecutionMatrix => v.z_positive < 0.25,
            DapPlane::Evolutionary => v.v_f > 0.50,
            DapPlane::Thermodynamic => true,
            DapPlane::Governance => v.g == "COMPLIANT" && v.l == "APPROVED",
        }
    }
}

/// DAP Engine — evaluates events against all 9 planes.
pub struct DapEngine;

impl DapEngine {
    /// Evaluate all 9 planes against an event vector.
    pub fn evaluate(v: &EventVector) -> Vec<PlaneResult> {
        let planes = [
            DapPlane::Temporality,
            DapPlane::Spatiality,
            DapPlane::CompositionalLower,
            DapPlane::EconomicValue,
            DapPlane::Fidelity,
            DapPlane::ExecutionMatrix,
            DapPlane::Evolutionary,
            DapPlane::Thermodynamic,
            DapPlane::Governance,
        ];
        planes.iter()
            .map(|p| PlaneResult {
                plane: p.id(),
                matched: p.evaluate(v),
                threshold: p.threshold_str().to_string(),
            })
            .collect()
    }

    /// Returns true only if ALL 9 planes match.
    pub fn all_match(results: &[PlaneResult]) -> bool {
        results.iter().all(|r| r.matched)
    }

    /// Returns true if DHU planes (7, 8, 9) all match.
    pub fn dhu_pass(results: &[PlaneResult]) -> bool {
        results.iter()
            .filter(|r| r.plane >= 7)
            .all(|r| r.matched)
    }

    /// Determine execution state: execute | block | review
    pub fn execution_state(results: &[PlaneResult]) -> &'static str {
        if Self::all_match(results) {
            "execute"
        } else if results.iter().filter(|r| r.plane >= 7).all(|r| r.matched) {
            // DHU passes but not all — requires human review
            "review"
        } else {
            "block"
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn default_vector() -> EventVector {
        EventVector {
            t: 1712332800000,
            s_x: 37.1234,
            s_y: -105.5678,
            z_negative: -0.18,
            z_positive: 0.15,
            c: 0.98,
            l: "APPROVED".to_string(),
            v_f: 0.85,
            e: 2500,
            g: "COMPLIANT".to_string(),
        }
    }

    #[test]
    fn test_all_planes_match_default() {
        let v = default_vector();
        let results = DapEngine::evaluate(&v);
        assert!(DapEngine::all_match(&results), "All 9 planes should match");
    }

    #[test]
    fn test_fidelity_plane_rejects_low_confidence() {
        let mut v = default_vector();
        v.c = 0.75;
        let results = DapEngine::evaluate(&v);
        let fidelity = results.iter().find(|r| r.plane == 5).unwrap();
        assert!(!fidelity.matched, "Fidelity plane should reject c=0.75");
    }

    #[test]
    fn test_governance_plane_requires_compliance() {
        let mut v = default_vector();
        v.g = "REVIEW".to_string();
        let results = DapEngine::evaluate(&v);
        let gov = results.iter().find(|r| r.plane == 9).unwrap();
        assert!(!gov.matched, "Governance should reject non-COMPLIANT");
    }

    #[test]
    fn test_dhu_planes() {
        let v = default_vector();
        let results = DapEngine::evaluate(&v);
        assert!(DapEngine::dhu_pass(&results), "DHU planes (7,8,9) should pass");
    }
}