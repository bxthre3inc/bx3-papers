{
  "product": "SLV Now",
  "description": "Local news, events, and business directory for San Luis Valley",
  "launch_order": 4,
  "agents": {
    "marketing": [
      {
        "agent_id": "slvnow-content-curator",
        "role": "Aggregate and publish SLV local news and events",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=7"],
        "sources": ["local_gov_meetings", "school_events", "church_bulletins", "community_boards", "google_alerts"],
        "outputs": ["news_article_drafts", "event_listings", "breaking_alerts"],
        "kpis": {"articles_per_week": 15, "events_listed_per_week": 10}
      },
      {
        "agent_id": "slvnow-directory-monetizer",
        "role": "Convert business directory to paying listings",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=10"],
        "outreach_sequence": ["claim_listing", "upgrade_to_featured", "ad_spend_pitch"],
        "kpis": {"listing_conversion_rate": 0.12, "arpu_target_cents": 1900}
      },
      {
        "agent_id": "slvnow-event-promoter",
        "role": "Boost event attendance via targeted promotion",
        "rrules": ["FREQ=WEEKLY;BYDAY=FR"],
        "channels": ["facebook_events", "email_blast", "google_my_business", "slack_communities"],
        "kpis": {"event_attendance_lift": 0.3, "ticket_revenue_share": 0.05}
      }
    ],
    "sales": [
      {
        "agent_id": "slvnow-listing-sales",
        "role": "Sell business directory listings and featured slots",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=9"],
        "products": ["basic_listing", "featured_directory", "event_sponsorship", "ad_banner"],
        "kpis": {"close_rate": 0.25, "avg_deal_cents": 15000}
      },
      {
        "agent_id": "slvnow-ticketing-agent",
        "role": "Handle event ticketing and RSVP management",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=11"],
        "actions": ["ticket_confirmation", "reminder_sequence", "waitlist_management", "refund_processing"],
        "kpis": {"no_show_rate_max": 0.15, "ticket_revenue_collected": 0.05}
      }
    ],
    "cs": [
      {
        "agent_id": "slvnow-support",
        "role": "Community support and content moderation",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=8,16"],
        "channels": ["email", "in_app_chat", "community_forum"],
        "moderation": ["spam_filter", "fake_event_detection", "review_moderation"],
        "sla": {"response_time_hours": 4, "moderation_latency_hours": 2},
        "kpis": {"user_trust_score": 0.9, "report_resolution_hours": 12}
      },
      {
        "agent_id": "slvnow-weather-alert",
        "role": "Weather-based event alerts and safety notifications",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=6"],
        "triggers": ["snow_above_6in", "flood_watch", "wind_advisory", "extreme_heat"],
        "actions": ["event_cancellation_notice", "safety_alert_push", "makeup_event_scheduler"],
        "kpis": {"alert_accuracy": 0.95, "user_notification_rate": 0.8}
      }
    ]
  },
  "pricing": {
    "basic_listing_monthly_cents": 1900,
    "featured_directory_yearly_cents": 29900,
    "event_ticketing_fee_percent": 5
  },
  "tech_stack": ["Zo Space (web)", "React Native companion", "Agentic content", "Stripe", "Twilio"],
  "status": "planning"
}
