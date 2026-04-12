{
  "product": "Agent Launcher",
  "tagline": "One agent. One role. Deployed today.",
  "description": "Simple AI employee deployment SaaS: define one agent, connect tools and knowledge, deploy into Sales, CS, Marketing, or HR. Built on Agentic architecture (single-agent mode).",
  "launch_order": 1,
  "built_on": "Agentic (single-instance, isolated memory)",
  "roles": ["sales", "customer_service", "marketing", "hr"],
  "agents": {
    "marketing": [
      {
        "agent_id": "al-content",
        "role": "Content and social presence for Agent Launcher",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=8", "FREQ=WEEKLY;BYDAY=MO"],
        "channels": ["linkedin", "twitter_x", "product_hunt", "indie_hackers", "hacker_news"],
        "kpis": {"leads_per_month": 50, "trial_signups": 20, "content_posts_per_week": 5},
        "status": "active"
      },
      {
        "agent_id": "al-promo",
        "role": "Launch campaigns, referral programs, partner outreach",
        "rrules": ["FREQ=WEEKLY;BYDAY=TH"],
        "campaigns": ["14_day_trial_upsell", "referral_50_credit", "launch_partner_program"],
        "kpis": {"trial_to_paid_rate": 0.25, "referral_conversion_rate": 0.35},
        "status": "active"
      }
    ],
    "sales": [
      {
        "agent_id": "al-inbound",
        "role": "Respond to inbound trials, qualify leads, schedule demos",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=7-21"],
        "channels": ["email", "in_app_chat", "demo_booking"],
        "kpis": {"lead_response_time_minutes": 5, "demo_bookings_per_week": 15, "trial_to_demo_rate": 0.4},
        "status": "active"
      },
      {
        "agent_id": "al-outreach",
        "role": "Outreach to ideal customer profiles (contractors, dentists, real estate)",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=9,14"],
        "channels": ["cold_email", "linkedin", "fb_ads"],
        "kpis": {"outreach_per_day": 50, "positive_reply_rate": 0.08, "meetings_booked_per_week": 8},
        "status": "active"
      }
    ],
    "customer_service": [
      {
        "agent_id": "al-support",
        "role": "Handle all Agent Launcher customer support",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=7-22"],
        "channels": ["email", "in_app_chat", "help_center"],
        "escalation_threshold": "complex_integration_issues",
        "kpis": {"first_response_time_minutes": 30, "resolution_rate": 0.85, "csat_target": 4.5},
        "status": "active"
      },
      {
        "agent_id": "al-onboarding",
        "role": "Guide new customers through setup — connect tools, load knowledge, first launch",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=7-22"],
        "channels": ["email", "in_app_chat"],
        "kpis": {"onboarding_completion_rate": 0.8, "time_to_first_agent_run_hours": 24},
        "status": "active"
      },
      {
        "agent_id": "al-review-agent",
        "role": "Monitor review sites (G2, Capterra, Product Hunt), respond + escalate",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=8,20"],
        "channels": ["g2", "capterra", "product_hunt", "trustpilot"],
        "kpis": {"review_response_within_24h": true, "rating_maintain_4.5_plus": true},
        "status": "active"
      }
    ]
  },
  "department_head": {
    "agent_id": "al-command",
    "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=8;TZ=America/Denver"],
    "reports_to": "brodiblanco",
    "responsibilities": ["pipeline_health", "trial_conversion", "churn_alerts", "feature_requests"]
  }
}
