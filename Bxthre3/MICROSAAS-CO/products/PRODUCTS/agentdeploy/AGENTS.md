{
  "product": "AgentDeploy",
  "tagline": "One agent. One role. Deployed in minutes. — The simplest AI employee for small business.",
  "description": "Simple SaaS: a company defines a single agent, equips it with tools (email, calendar, CRM, Stripe, etc.) and a knowledge base, then deploys it into a dedicated role — Sales, Customer Service, Marketing, or HR. No coordination, no mesh — just one focused agent working its role.",
  "launch_order": 5,
  "distinction_from_agentic": "Agentic = coordinated multi-agent mesh. AgentDeploy = single uncoordinated agent per role, much simpler UX and pricing.",
  "roles_supported": ["sales", "customer_service", "marketing", "hr"],
  "agents": {
    "marketing": [
      {
        "agent_id": "agentdeploy-content",
        "role": "Content and social presence for AgentDeploy itself",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=8"],
        "channels": ["linkedin", "twitter_x", "product_hunt", "indie_hackers"],
        "kpis": {"leads_per_month": 50, "trial_signups": 20}
      },
      {
        "agent_id": "agentdeploy-promo",
        "role": "Launch campaigns and affiliate program management",
        "rrules": ["FREQ=WEEKLY;BYDAY=MO"],
        "campaigns": ["first_month_free", "referral_bonus", "comparison_landing"],
        "kpis": {"conversion_rate": 0.08, "affiliate_referrals_per_month": 15}
      }
    ],
    "sales": [
      {
        "agent_id": "agentdeploy-concierge",
        "role": "Trial-to-paid conversion, onboarding guidance, feature discovery",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=9,14"],
        "steps": ["trial_check_in_day_2", "feature_walk_day_5", "objection_handling_day_8", "go_live_celebration_day_10"],
        "kpis": {"trial_to_paid_rate": 0.35, "avg_days_to_close": 12}
      },
      {
        "agent_id": "agentdeploy-onboarding",
        "role": "Guide new customer through agent definition: role, tools, knowledge base",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=10,15"],
        "steps": ["welcome_sequence", "role_definition_wizard", "tool_connection", "knowledge_base_populate", "test_run", "go_live"],
        "kpis": {"onboarding_completion_rate": 0.85, "time_to_first_deployment_hours": 24}
      }
    ],
    "cs": [
      {
        "agent_id": "agentdeploy-support",
        "role": "Technical support for AgentDeploy customers: agent behavior issues, tool connections, billing",
        "rrules": ["FREQ=DAILY;INTERVAL=1;BYHOUR=7,12,17,21"],
        "channels": ["email", "in_app_chat", "sms"],
        "refund_authority_cents": 2000,
        "sla": {"response_time_minutes": 15, "resolution_hours": 4},
        "kpis": {"csat": 4.6, "first_contact_resolution": 0.7}
      }
    ]
  },
  "customer_journey": {
    "1_signup": "Choose role (Sales/CS/Marketing/HR)",
    "2_connect": "Connect tools (Gmail, Calendar, CRM, Stripe, Notion, etc.)",
    "3_knowledge": "Upload docs / paste knowledge base",
    "4_customize": "Name agent, set tone, define guardrails",
    "5_test": "Run 5 test scenarios, rate outcomes",
    "6_deploy": "Agent goes live in chosen role",
    "7_monitor": "Dashboard shows agent activity, ratings, outcomes"
  },
  "pricing": {
    "tier_starter_cents": 4900,
    "tier_pro_cents": 9900,
    "tier_team_cents": 19900,
    "annual_discount_percent": 20,
    "free_trial_days": 14
  },
  "tech_stack": ["Agentic (single agent mode)", "Zo Space dashboard", "Stripe billing", "Gmail/Google Calendar OAuth", "Notion API", "HubSpot API"],
  "status": "planning",
  "launch_requirements": ["working_single_agent_deployment", "min_3_tool_integrations", "knowledge_base_upload_functionality", "test_scenario_runner"]
}
