{
  "product": "SLV Ride",
  "description": "Uber-style ride-hailing for San Luis Valley (rural route capable)",
  "launch_order": 3,
  "agents": {
    "marketing": [
      {
        "agent_id": "slvride-growth",
        "role": "Driver recruitment and rider acquisition",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=8"],
        "channels": ["Craigslist", "Facebook", "local job fairs", "word_of_mount"],
        "two_sided": true,
        "kpis": {"drivers_onboarded_per_week": 10, "active_riders_per_week": 30}
      },
      {
        "agent_id": "slvride-content",
        "role": "Local community transportation content",
        "rrules": ["FREQ=WEEKLY;BYDAY=SA"],
        "topics": ["rural transportation safety", "SLV geography", "agricultural worker logistics"],
        "kpis": {"community_awareness_score": 0.6}
      }
    ],
    "sales": [
      {
        "agent_id": "slvride-driver-onboarding",
        "role": "End-to-end driver onboarding (vehicle inspection, background, training)",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=9"],
        "steps": ["vehicle_photo_upload", "insurance_verification", "background_check_trigger", "training_module_completion", "activation"],
        "kpis": {"onboarding_completion_rate": 0.75, "time_to_active_hours": 72}
      },
      {
        "agent_id": "slvride-matching",
        "role": "Real-time rider-driver matching and pricing",
        "rrules": ["FREQ=HOURLY;INTERVAL=1"],
        "inputs": ["rider_location", "driver_locations", "demand_zones", "surge_pricing_rules"],
        "outputs": ["match_assignment", "ETA", "fare_quote"],
        "sla_seconds": 15
      },
      {
        "agent_id": "slvride-safety-compliance",
        "role": "Monitor trips for safety compliance and incident response",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=22"],
        "checks": ["trip_route_deviation", "emergency_sos_signals", "driver行为_score", "vehicle_inspection_expiry"],
        "incident_escalation": "P1 → INBOX.md + SMS + local_authorities"
      }
    ],
    "cs": [
      {
        "agent_id": "slvride-support",
        "role": "Rider and driver support (lost items, complaints, disputes)",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=6,22"],
        "channels": ["in_app_chat", "sms", "phone"],
        "sla": {"response_time_minutes": 10, "resolution_hours": 4},
        "kpis": {"dispute_resolution_rate": 0.9, "csat": 4.3}
      },
      {
        "agent_id": "slvride-retention",
        "role": "Driver and rider churn prevention",
        "rrules": ["FREQ=WEEKLY;BYDAY=SU;BYHOUR=18"],
        "signals": ["login_drop_7d", "rating_below_4", "trip_cancellation_rate_up"],
        "actions": ["check_in_message", "incentive_offer", "support_outreach"]
      }
    ]
  },
  "pricing": {
    "platform_fee_percent": 15,
    "driver_miles_rate_cents": 85,
    "base_fare_cents": 250
  },
  "tech_stack": ["React Native", "Agentic dispatch", "Zo Space admin dashboard", "Mapbox", "Stripe"],
  "status": "planning",
  "launch_requirements": ["min_10_active_drivers", "CO rideshare insurance", "background_check_system"]
}