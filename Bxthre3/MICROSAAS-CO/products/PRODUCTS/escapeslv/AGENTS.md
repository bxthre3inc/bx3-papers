{
  "product": "EscapeSlv",
  "description": "At-home team escape room with phone-based VR (cardboard headset)",
  "launch_order": 2,
  "agents": {
    "marketing": [
      {
        "agent_id": "escapeslv-growth",
        "role": "Family/team demand gen for escape experiences",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=9"],
        "platforms": ["Facebook Groups", "Google Ads", "Instagram"],
        "target_audiences": ["families w/ kids 10+", "team building corporate", "friend groups"],
        "kpis": {"mqls_per_week": 30, "session_booking_rate": 0.15}
      },
      {
        "agent_id": "escapeslv-social",
        "role": "Community engagement and review generation",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=14"],
        "platforms": ["Google Reviews", "Yelp", "Facebook Events"],
        "kpis": {"response_time_hours": 2, "sentiment_score": 4.2}
      }
    ],
    "sales": [
      {
        "agent_id": "escapeslv-lead-qualifier",
        "role": "Qualify session bookings and group size",
        "rrules": ["FREQ=HOURLY"],
        "routing": {
          "single_player": "self_serve_booking",
          "group_6plus": "custom_room_request",
          "corporate": "enterprise_outreach"
        }
      },
      {
        "agent_id": "escapeslv-close",
        "role": "Process session payments via Stripe",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=11"],
        "trigger_field": "booking_confirmed",
        "actions": ["charge_card", "send_confirmation", "send_prep_instructions"]
      }
    ],
    "cs": [
      {
        "agent_id": "escapeslv-session-coordinator",
        "role": "Manage active escape room sessions",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=18"],
        "responsibilities": ["send_room_codes", "monitor_session_progress", "dispatch_hints"],
        "hint_engine": "rule_based + LLM_for_narrative_hints",
        "kpis": {"session_completion_rate": 0.85, "hint_satisfaction": 4.0}
      },
      {
        "agent_id": "escapeslv-support",
        "role": "Post-session support and review requests",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=20"],
        "post_session_actions": ["rating_request", "photo_share_prompt", "replay_offer"],
        "kpis": {"review_rate": 0.4, "csat": 4.5}
      }
    ]
  },
  "pricing": {
    "per_session_cents": 1999,
    "group_monthly_cents": 4999
  },
  "tech_stack": ["Zo Space (web)", "iOS/Android companion", "Particle puzzle system", "Cardboard VR"],
  "status": "planning"
}