{
  "product": "TradeDesk",
  "description": "AI-powered back office OS for trades (plumbing, electrical, HVAC, locksmith)",
  "launch_order": 1,
  "agents": {
    "marketing": [
      {
        "agent_id": "tradedesk-growth",
        "role": "Trade contractor demand gen (plumbers, electricians, HVAC)",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=7"],
        "channels": ["Google Ads", "Industry publications", "Yelp", "Angi"],
        "target_audiences": ["1-10 truck trade businesses", "trade unions", "equipment suppliers"],
        "kpis": {"mqls_per_week": 25, "cpl_target": 55}
      },
      {
        "agent_id": "tradedesk-content",
        "role": "Trade industry content + case studies",
        "rrules": ["FREQ=WEEKLY;BYDAY=MO,WE;BYHOUR=6"],
        "topics": ["job scheduling efficiency", "parts inventory management", "customer service AI"],
        "kpis": {"posts_per_week": 2, "organic_leads_per_month": 20}
      }
    ],
    "sales": [
      {
        "agent_id": "tradedesk-lead-qualifier",
        "role": "Assess trade business readiness for AI back office",
        "rrules": ["FREQ=HOURLY"],
        "qualification_criteria": ["num_technicians", "current_software_stack", "monthly_ticket_volume"],
        "paths": {
          "small_1_3_techs": "self_serve_79mo",
          "mid_4_10_techs": "demo_required_149mo",
          "enterprise_10plus": "enterprise_outreach"
        }
      },
      {
        "agent_id": "tradedesk-demo-scheduler",
        "role": "Book product demos for trade pros",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=9"],
        "calendar_integration": "google_calendar",
        "kpis": {"demo_show_rate": 0.4, "booking_time_hours": 24}
      },
      {
        "agent_id": "tradedesk-close",
        "role": "Execute Stripe checkout for TradeDesk subscriptions",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=11"],
        "products": ["tradedesk-starter", "tradedesk-pro"],
        "post_purchase_actions": ["provision_account", "send_welcome_kit", "schedule_onboarding_call"]
      }
    ],
    "cs": [
      {
        "agent_id": "tradedesk-dispatch-optimizer",
        "role": "AI dispatch optimization for field techs",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=6"],
        "inputs": ["job_queue", "tech_locations", "traffic_data", "skill_matching"],
        "outputs": ["dispatch_schedule", "route_optimization", "ETA_notifications"],
        "kpis": {"dispatch_efficiency_gain": 0.25, "on_time_rate": 0.9}
      },
      {
        "agent_id": "tradedesk-csr-agent",
        "role": "AI phone/SMS customer service for trade businesses",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=8,12,17"],
        "channels": ["voice", "sms", "email"],
        "capabilities": ["appointment_scheduling", "parts_inquiry", "invoice_questions", "emergency_routing"],
        "sla": {"response_time_minutes": 5, "resolution_hours": 2}
      },
      {
        "agent_id": "tradedesk-invoice-agent",
        "role": "Automated invoicing and payment follow-up",
        "rrules": ["FREQ=WEEKLY;BYDAY=FR"],
        "functions": ["generate_invoices", "send_payment_reminders", "process_partial_payments", "reconcile_aging"],
        "kpis": {"days_sales_outstanding_target": 30, "collection_rate": 0.92}
      },
      {
        "agent_id": "tradedesk-onboarding",
        "role": "Get trade businesses operational within 72hrs",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=10"],
        "checkpoints": ["account_setup", "technician_invited", "first_job_scheduled", "first_invoice_sent"],
        "kpis": {"activation_rate_7d": 0.85}
      }
    ]
  },
  "pricing": {
    "tiers": [
      {"name": "starter", "monthly_cents": 7900, "features": ["5 techs", "basic scheduling", "email support"]},
      {"name": "pro", "monthly_cents": 14900, "features": ["unlimited techs", "AI dispatch", "voice/SMS CSR", "priority support"]}
    ]
  },
  "tech_stack": ["Zo Space (admin dashboard)", "React Native (field app)", "Twilio", "Agentic", "Stripe"],
  "status": "planning"
}