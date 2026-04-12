"""
CARTOGRAPHER Growth Model — 2B2F Council Strategic Planning Unit
120-Month GDP Capture Simulation Framework

Status: v0.1 Scaffold — Pending GDP Definition (B1)
Zero budget, public research, open methodology
"""

import json
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional


@dataclass
class VentureProjection:
    """Individual venture revenue and valuation trajectory."""
    name: str
    m12_revenue: float  # USD
    m24_revenue: float
    m36_revenue: float
    m120_revenue: float
    valuation_multiple: float = 6.0  # Revenue multiple for venture growth

    def valuation_at(self, month: int) -> float:
        """Calculate valuation at given month using linear interpolation."""
        if month <= 12:
            return self.m12_revenue * self.valuation_multiple * (month / 12)
        elif month <= 24:
            progress = (month - 12) / 12
            revenue = self.m12_revenue + (self.m24_revenue - self.m12_revenue) * progress
        elif month <= 36:
            progress = (month - 24) / 12
            revenue = self.m24_revenue + (self.m36_revenue - self.m24_revenue) * progress
        else:
            progress = (month - 36) / 84
            revenue = self.m36_revenue + (self.m120_revenue - self.m36_revenue) * progress
        return revenue * self.valuation_multiple


@dataclass
class GDPScenario:
    """GDP capture scenario definition."""
    name: str
    definition: str  # e.g., "60% of addressable market cap"
    total_addressable_market: float  # USD
    target_capture_percent: float
    
    @property
    def target_value(self) -> float:
        return self.total_addressable_market * (self.target_capture_percent / 100)


class Bxthre3GrowthModel:
    """
    2B2F deterministic growth model for 120-month execution planning.
    
    Pending clarification on GDP definition (Blocker B1).
    """
    
    VENTURES = {
        "irrig8": VentureProjection(
            name="Irrig8",
            m12_revenue=300_000,
            m24_revenue=2_500_000,
            m36_revenue=10_000_000,
            m120_revenue=200_000_000,
            valuation_multiple=6.0
        ),
        "vpc": VentureProjection(
            name="Valley Players Club",
            m12_revenue=600_000,
            m24_revenue=4_000_000,
            m36_revenue=15_000_000,
            m120_revenue=300_000_000,
            valuation_multiple=6.5
        ),
        "zoe": VentureProjection(
            name="Zoe / Agentic",
            m12_revenue=150_000,
            m24_revenue=2_000_000,
            m36_revenue=8_000_000,
            m120_revenue=250_000_000,
            valuation_multiple=7.0
        ),
    }
    
    GDP_SCENARIOS = {
        "option_a_market_cap": GDPScenario(
            name="Option A: Market Cap Capture",
            definition="60% of addressable market capitalization",
            total_addressable_market=833_000_000_000,  # $833B Ag+Gaming+AI TAM
            target_capture_percent=60.0
        ),
        "option_b_revenue": GDPScenario(
            name="Option B: Revenue Capture",
            definition="60% of segment revenue",
            total_addressable_market=83_000_000_000,  # $83B segment revenue
            target_capture_percent=60.0
        ),
        "option_c_portfolio": GDPScenario(
            name="Option C: Portfolio Value",
            definition="60% of portfolio value vs available market",
            total_addressable_market=7_500_000_000,  # $7.5B venture studio TAM
            target_capture_percent=60.0
        ),
    }
    
    def __init__(self, gdp_scenario_key: Optional[str] = None):
        """
        Initialize model with GDP scenario.
        
        Args:
            gdp_scenario_key: One of "option_a_market_cap", "option_b_revenue", 
                              "option_c_portfolio", or None to use placeholder.
        """
        self.gdp_scenario = None
        if gdp_scenario_key:
            self.gdp_scenario = self.GDP_SCENARIOS.get(gdp_scenario_key)
        
        self.blocker_b1_active = self.gdp_scenario is None
    
    def portfolio_valuation(self, month: int) -> Dict:
        """Calculate portfolio valuation at given month."""
        results = {}
        total = 0.0
        
        for key, venture in self.VENTURES.items():
            val = venture.valuation_at(month)
            results[key] = {
                "name": venture.name,
                "valuation": val,
                "revenue": val / venture.valuation_multiple
            }
            total += val
        
        results["total_portfolio"] = total
        results["blocker_b1_active"] = self.blocker_b1_active
        
        if self.gdp_scenario:
            results["gdp_scenario"] = asdict(self.gdp_scenario)
            results["gap_to_target"] = self.gdp_scenario.target_value - total
            results["percent_of_target"] = (total / self.gdp_scenario.target_value) * 100
        
        return results
    
    def milestone_check(self) -> Dict:
        """Check progress against 2B2F milestones: 1% @ M24, 5% @ M36, 60%+ @ M120."""
        # NOTE: These percentages require GDP definition clarification
        # Currently reporting absolute values pending B1 resolution
        
        return {
            "m24": self.portfolio_valuation(24),
            "m36": self.portfolio_valuation(36),
            "m120": self.portfolio_valuation(120),
            "interpretation_note": "Percentages pending GDP target definition (Blocker B1)",
            "required_action": "Lead author (brodiblanco) to confirm GDP scope per ARCHIVIST M2 synthesis"
        }
    
    def export_scenarios(self) -> str:
        """Export all scenario projections as JSON."""
        scenarios = {}
        for scenario_key, scenario in self.GDP_SCENARIOS.items():
            model = Bxthre3GrowthModel(scenario_key)
            scenarios[scenario_key] = {
                "definition": asdict(scenario),
                "milestones": model.milestone_check()
            }
        
        # Add "no scenario" baseline
        baseline = Bxthre3GrowthModel(None)
        scenarios["baseline_no_gdp_defined"] = {
            "definition": {"note": "GDP target undefined — Blocker B1 active"},
            "milestones": baseline.milestone_check()
        }
        
        return json.dumps(scenarios, indent=2)


# --- CLI for direct execution ---
if __name__ == "__main__":
    print("=" * 70)
    print("CARTOGRAPHER — 2B2F Growth Model v0.1")
    print("120-Month GDP Capture Simulation")
    print("=" * 70)
    print()
    
    # Show current baseline (no GDP scenario selected)
    model = Bxthre3GrowthModel()
    print("⚠️  BLOCKER B1 ACTIVE: GDP target definition required")
    print("   Awaiting lead author (brodiblanco) clarification per ARCHIVIST M2 synthesis")
    print()
    
    print("Current Portfolio Projections (Absolute Values):")
    print("-" * 50)
    
    for month in [12, 24, 36, 120]:
        proj = model.portfolio_valuation(month)
        print(f"Month {month:3d}: ${proj['total_portfolio']:>15,.0f}")
        for key, data in proj.items():
            if key not in ['total_portfolio', 'blocker_b1_active']:
                print(f"  - {data['name']:20s}: ${data['valuation']:>12,.0f}")
    
    print()
    print("GDP Scenario Options:")
    print("-" * 50)
    for key, scenario in model.GDP_SCENARIOS.items():
        print(f"  {key}:")
        print(f"    {scenario.definition}")
        print(f"    Target: ${scenario.target_value:,.0f} ({scenario.target_capture_percent}% of ${scenario.total_addressable_market:,.0f})")
    
    print()
    print("=" * 70)
    print("Next: Run with scenario key after brodiblanco GDP clarification")
    print("Example: model = Bxthre3GrowthModel('option_a_market_cap')")
    print("=" * 70)
