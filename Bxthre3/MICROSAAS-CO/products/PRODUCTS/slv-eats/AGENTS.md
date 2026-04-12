{
  "product": "SLV Eats",
  "description": "DoorDash-style food delivery for San Luis Valley + farm-to-table",
  "launch_order": 3,
  "agents": {
    "marketing": [
      {
        "agent_id": "slveats-growth",
        "role": "Restaurant recruitment and rider acquisition",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=8"],
        "channels": ["cold_outreach", "fb_ads", "local_events", "restaurant_suppliers"],
        "two_sided": true,
        "kpis": {"restaurants_onboarded_per_week": 3, "active_riders": 15}
      },
      {
        "agent_id": "slveats-promo",
        "role": "Launch promo campaigns and referral programs",
        "rrules": ["FREQ=WEEKLY;BYDAY=TH"],
        "campaigns": ["first_order_free", "referral_credit", "restaurant_featured_slot"],
        "kpis": {"coupon_redemption_rate": 0.35, "new_customer_rate": 0.5}
      }
    ],
    "sales": [
      {
        "agent_id": "slveats-restaurant-onboarding",
        "role": "Onboard restaurants (menu upload, tablet setup, training)",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=9"],
        "steps": ["menu_digitization", "printers_setup", "staff_training", "go_live"],
        "kpis": {"time_to_first_order_hours": 48, "onboarding_completion_rate": 0.8}
      },
      {
        "agent_id": "slveats-delivery-routing",
        "role": "Optimize delivery routes and dispatcher",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=11,17"],
        "inputs": ["order_queue", "rider_locations", "restaurant_prep_times", "traffic"],
        "outputs": ["route_assignments", "ETA_notifications", "delay_alerts"],
        "kpis": {"avg_delivery_time_minutes": 35, "order_accuracy_rate": 0.97}
      }
    ],
    "cs": [
      {
        "agent_id": "slveats-support",
        "role": "Order issue resolution (missing items, delays, refunds)",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=11,18"],
        "channels": ["in_app_chat", "sms", "phone"],
        "refund_authority_cents": 1500,
        "sla": {"response_time_minutes": 5, "resolution_hours": 1},
        "kpis": {"refund_rate_max": 0.05, "csat": 4.4}
      },
      {
        "agent_id": "slveats-review-agent",
        "role": "Post-delivery review collection and restaurant feedback",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=13,20"],
        "post_delivery_actions": ["rating_request", "photo_prompt", "restaurant_alerts"],
        "kpis": {"review_response_rate": 0.3, "avg_rating_target": 4.5}
      }
    ]
  },
  "pricing": {
    "commission_percent": 20,
    "subscriber_monthly_cents": 999,
    "delivery_fee_cents": 299
  },
  "tech_stack": ["React Native", "Agentic logistics", "Zo Space restaurant dashboard", "Stripe", "Mapbox"],
  "status": "planning",
  "launch_requirements": ["min_5_active_restaurants", "min_10_active_riders", "CO food handling compliance"]
}
