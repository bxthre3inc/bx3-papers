{
  "product": "Special Delivery",
  "tagline": "Anything. Anywhere. Anytime. — SLV's last-mile delivery for food, goods, and errands.",
  "description": "DoorDash-meetserrands: not just food, but also regular shopping, pharmacy runs, and general same-day delivery. Onboard local restaurants AND general retail stores.",
  "launch_order": 3,
  "agents": {
    "marketing": [
      {
        "agent_id": "sd-growth",
        "role": "Driver recruitment and rider acquisition",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=8"],
        "channels": ["Craigslist", "Facebook", "Nextdoor", "job fairs", "local_schools"],
        "two_sided": true,
        "kpis": {"drivers_onboarded_per_week": 5, "stores_onboarded_per_week": 3}
      },
      {
        "agent_id": "sd-promo",
        "role": "Launch promo campaigns and referral programs",
        "rrules": ["FREQ=WEEKLY;BYDAY=TH"],
        "campaigns": ["first_delivery_free", "referral_credit", "store_featured_slot", "subscription_offer"],
        "kpis": {"coupon_redemption_rate": 0.35, "new_customer_rate": 0.5}
      }
    ],
    "sales": [
      {
        "agent_id": "sd-restaurant-onboarding",
        "role": "Find, contact, and onboard local restaurants",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=9"],
        "steps": ["prospect_research", "cold_outreach_email", "menu_digitization", "tablet_setup", "go_live"],
        "kpis": {"contacts_per_day": 20, "onboarding_completion_rate": 0.8, "time_to_first_order_hours": 48}
      },
      {
        "agent_id": "sd-store-onboarding",
        "role": "Find, contact, and onboard local retail/general stores",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=9"],
        "steps": ["prospect_research", "cold_outreach_email", "catalog_digitization", "setup_instructions", "go_live"],
        "target_stores": ["grocery", "pharmacy", "hardware", "flowers", "pet_store", "clothing", "gifts"],
        "kpis": {"contacts_per_day": 15, "onboarding_completion_rate": 0.75, "time_to_first_order_hours": 72}
      },
      {
        "agent_id": "sd-dispatch",
        "role": "Match orders to drivers, optimize routes, manage ETA expectations",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=7,11,17"],
        "inputs": ["order_queue", "driver_locations", "store_prep_times", "traffic_data"],
        "outputs": ["route_assignments", "ETA_notifications", "delay_alerts"],
        "kpis": {"avg_delivery_time_minutes": 40, "order_accuracy_rate": 0.97}
      }
    ],
    "cs": [
      {
        "agent_id": "sd-support",
        "role": "Order issue resolution (missing items, delays, wrong items, refunds)",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=8,11,14,17,20"],
        "channels": ["in_app_chat", "sms", "phone"],
        "refund_authority_cents": 2000,
        "sla": {"response_time_minutes": 5, "resolution_hours": 1},
        "kpis": {"refund_rate_max": 0.05, "csat": 4.4}
      },
      {
        "agent_id": "sd-review-agent",
        "role": "Post-delivery review collection and store feedback loop",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=13,20"],
        "post_delivery_actions": ["rating_request", "photo_prompt", "store_alerts"],
        "kpis": {"review_response_rate": 0.3, "avg_rating_target": 4.5}
      },
      {
        "agent_id": "sd-driver-support",
        "role": "Driver support: app issues, payout questions, deactivation requests",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=7,22"],
        "channels": ["sms", "in_app_chat", "phone_on_demand"],
        "kpis": {"driver_csat": 4.6, "payout_dispute_resolution_hours": 4}
      }
    ]
  },
  "pricing": {
    "delivery_fee_cents": 299,
    "service_fee_percent": 15,
    "driver_cut_percent": 75,
    "subscriber_monthly_cents": 999,
    "store_commission_percent": 18
  },
  "tech_stack": ["React Native", "Agentic dispatch", "Zo Space dashboard", "Stripe Connect", "Mapbox", "Twilio"],
  "status": "planning",
  "launch_requirements": ["min_5_active_restaurants", "min_3_active_stores", "min_10_active_drivers", "CO delivery compliance"]
}
