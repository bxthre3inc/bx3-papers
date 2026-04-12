#!/usr/bin/env python3
"""
Build-A-Biz Adaptive Questionnaire Engine
Dynamic paths, deterministic outputs
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional
from enum import Enum, auto
import json
import hashlib

class BusinessType(Enum):
    SERVICE = auto()
    PRODUCT = auto()
    RETAIL = auto()
    TECH = auto()
    FARM = auto()
    GRANT_WRITER = auto()

class OwnerArchetype(Enum):
    FIRST_TIME = auto()
    SERIAL = auto()
    PIVOT = auto()
    SIDE_HUSTLE = auto()

@dataclass
class Question:
    id: str
    text: str
    context: str
    required: bool = True
    weight: float = 1.0

@dataclass
class QuestionnairePath:
    path_id: str
    name: str
    description: str
    questions: List[Question]
    estimated_minutes: int = 30

class QuestionnaireEngine:
    RULES = {
        "SERVICE_FIRST": "first_time_service",
        "SERVICE_SERIAL": "serial_any",
        "FARM_ANY": "farm_specialist",
        "TECH_ANY": "tech_saas",
        "GRANT_WRITER_ANY": "grant_specialist",
        "RETAIL_ANY": "retail_b2c",
        "DEFAULT": "first_time_service",
    }
    
    def __init__(self):
        self.paths = self._build_paths()
    
    def generate_path_id(self, business_type: str, archetype: str, territory: str) -> str:
        """Deterministic hash = stable path selection."""
        seed = f"{business_type}:{archetype}:{territory}"
        return hashlib.sha256(seed.encode()).hexdigest()[:8]
    
    def _build_paths(self) -> Dict[str, QuestionnairePath]:
        return {
            "core": QuestionnairePath(
                path_id="core",
                name="Foundation",
                description="Questions every owner answers",
                questions=[
                    Question("origin", "What moment made you realize [BUSINESS] needed to exist?",
                            "Grant committees fund people. This is your hook.", weight=2.0),
                    Question("territory_why", "Why this territory? What makes you the local expert?",
                            "Local credibility = trust.", weight=1.5),
                    Question("moat", "What do you know that typical consultants miss?",
                            "Your unique insight.", weight=1.8),
                ],
            ),
            "first_time_service": QuestionnairePath(
                path_id="first_time_service",
                name="First-Timer: Service Business",
                description="For owners building their first service business",
                questions=[
                    Question("learning", "What is the hardest thing you have taught yourself?",
                            "Shows grit + self-awareness.", weight=1.2),
                    Question("support", "Who is in your corner when things get hard?",
                            "Resilience indicator.", weight=1.0),
                    Question("scary", "What part of this business terrifies you most?",
                            "Vulnerability builds trust.", weight=1.3),
                ],
                estimated_minutes=25
            ),
            "serial_any": QuestionnairePath(
                path_id="serial_any",
                name="Serial Builder",
                description="Owners with prior business experience",
                questions=[
                    Question("lesson", "What did your last business teach you?",
                            "Leverages past experience.", weight=1.5),
                    Question("why_now", "Why this business, and why right now?",
                            "Timing + strategic clarity.", weight=1.2),
                    Question("pattern", "What pattern do you see that others miss?",
                            "Strategic depth.", weight=1.4),
                ],
                estimated_minutes=20
            ),
            "farm_specialist": QuestionnairePath(
                path_id="farm_specialist",
                name="Agriculture: Water & Land",
                description="Farm/ag operations",
                questions=[
                    Question("water", "Tell me about water on your operation. What keeps you up?",
                            "Water = life. Reveals operational awareness.", weight=2.0),
                    Question("land", "How long have you worked this land?",
                            "Tribal knowledge = competitiveness.", weight=1.5),
                    Question("climate", "What has changed about conditions in 5 years?",
                            "Climate awareness = grant gold.", weight=1.8),
                    Question("irrigate", "Walk me through your watering decisions. How much, when, why?",
                            "Separates real operators from tourists.", weight=2.0),
                ],
                estimated_minutes=35
            ),
        }
    
    def build_questionnaire(self, business_type: str, archetype: str, territory: str) -> Dict:
        """Build deterministic questionnaire for this owner."""
        # Select path
        path_key = self._select_path(business_type, archetype)
        path = self.paths.get(path_key, self.paths["first_time_service"])
        
        # Combine core + specific
        all_questions = self.paths["core"].questions + path.questions
        
        return {
            "path_id": path.path_id,
            "path_name": path.name,
            "territory": territory,
            "estimated_minutes": 15 + path.estimated_minutes,
            "question_count": len(all_questions),
            "questions": [
                {"id": q.id, "text": q.text, "context": q.context, "weight": q.weight}
                for q in all_questions
            ],
            "hash": self.generate_path_id(business_type, archetype, territory),
        }
    
    def _select_path(self, bt: str, oa: str) -> str:
        """Deterministic path selection."""
        bt = bt.upper()
        oa = oa.upper()
        
        if bt == "FARM":
            return "farm_specialist"
        if bt == "TECH":
            return "tech_saas"
        if bt == "GRANT_WRITER":
            return "grant_specialist"
        if bt == "RETAIL":
            return "retail_b2c"
        if bt == "SERVICE" and oa == "SERIAL":
            return "serial_any"
        return "first_time_service"


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--type", required=True)
    parser.add_argument("--archetype", required=True)
    parser.add_argument("--territory", required=True)
    args = parser.parse_args()
    
    engine = QuestionnaireEngine()
    result = engine.build_questionnaire(args.type, args.archetype, args.territory)
    print(json.dumps(result, indent=2))
            
            "pivot_any": QuestionnairePath(
                path_id="pivot_any",
                name="Career Pivot",
                description="Transitioning from different industry or role",
                questions=[
                    Question("origin_story", "What was the last straw in your old career?",
                            "Pivot moment = emotional anchor.", weight=2.0),
                    Question("skill_bridge", "What from your old work transfers to this?",
                            "Shows strategic self-awareness.", weight=1.6),
                    Question("sunk_cost", "What are you leaving behind?",
                            "Vulnerability + stakes indicator.", weight=1.4),
                    Question("proof", "What have you already done to test this?",
                            "Action vs. just talking.", weight=1.8),
                ],
                estimated_minutes=30
            ),
            "side_hustle_growth": QuestionnairePath(
                path_id="side_hustle_growth",
                name="Side Hustle → Full Time",
                description="Validating before going all-in",
                questions=[
                    Question("runway", "How long can you survive on savings?",
                            "Risk assessment + planning.", weight=1.5),
                    Question("traction_metric", "What's the smallest win that proves this works?",
                            "Defines success threshold early.", weight=1.7),
                    Question("time_allocation", "How many hours per week now? Plan for full-time?",
                            "Commitment calibration.", weight=1.3),
                    Question("worst_case", "If this fails 6 months from now, what happens?",
                            "Realism check.", weight=1.2),
                ],
                estimated_minutes=25
            ),
