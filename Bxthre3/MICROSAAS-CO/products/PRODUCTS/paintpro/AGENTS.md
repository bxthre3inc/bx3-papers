{
  "product": "PaintPro",
  "description": "White-label mobile painting estimate app with AR visual measuring",
  "launch_order": 1,
  "agents": {
    "marketing": [
      {
        "agent_id": "paintpro-growth",
        "role": "Demand generation for painting contractors",
        "rrules": [
          "FREQ=DAILY;INTERVAL=1;BYHOUR=8;BYMINUTE=0",
          "FREQ=HOURLY;INTERVAL=1"
        ],
        "tools": ["gmail", "airtable_oauth", "google_calendar"],
        "metrics": ["CAC", "MQLs", "ad_conversion_rate"],
        "kpis": {
          "mqls_per_week": 50,
          "first_response_minutes": 15,
          "cac_target": 45
        }
      },
      {
        "agent_id": "paintpro-content",
        "role": "Local SEO blog posts + how-to painting guides",
        "rrules": ["FREQ=WEEKLY;BYDAY=MO,WE,FR;BYHOUR=6;BYMINUTE=0"],
        "content_focus": ["Colorado painting tips", "room estimation guides", "contractor pricing"],
        "kpis": {
          "posts_per_week": 3,
          "indexed_within_hours": 24
        }
      }
    ],
    "sales": [
      {
        "agent_id": "paintpro-lead-qualifier",
        "role": "Route inbound painting contractor leads",
        "rrules": ["FREQ=HOURLY"],
        "routing_rules": {
          "contractor_size_small": "self_serve_trial",
          "contractor_size_enterprise": "demo_booked",
          "diy_homeowner": "self_serve_free"
        },
        "kpis": {
          "routing_accuracy": 0.8,
          "first_response_minutes": 15
        }
      },
      {
        "agent_id": "paintpro-close",
        "role": "Close deals via Stripe Checkout",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=11"],
        "trigger_field": "stage",
        "trigger_value": "Closed Won",
        "actions": ["generate_stripe_link", "send_invoice_email", "confirm_onboarding"]
      }
    ],
    "cs": [
      {
        "agent_id": "paintpro-onboarding",
        "role": "Get contractors to first estimate within 48hrs",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=10;BYMINUTE=30"],
        "checkpoints": ["day_1", "day_3", "day_7"],
        "activation_criteria": ["first_room_measured", "first_estimate_sent"],
        "kpis": {
          "activation_rate_7d": 0.9
        }
      },
      {
        "agent_id": "paintpro-support",
        "role": "Handle contractor support tickets",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=8,10,12,14,16,18;TZ=America/Denver"],
        "channels": ["email", "chat", "sms"],
        "sla": {
          "first_response_minutes": 60,
          "resolution_hours": 24
        },
        "escalation": "P1 → INBOX.md + SMS",
        "kpis": {
          "csat_target": 4.5,
          "escalation_rate_max": 0.05
        }
      }
    ]
  },
  "pricing": {
    "tiers": [
      {"name": "starter", "monthly_cents": 2900, "features": ["5 rooms/mo", "basic reporting"]},
      {"name": "pro", "monthly_cents": 9900, "features": ["unlimited rooms", "white-label", "API access"]}
    ]
  },
  "tech_stack": ["React Native (Android)", "AR.js", "Agentic", "Zo Space", "Stripe"],
  "status": "planning"
}