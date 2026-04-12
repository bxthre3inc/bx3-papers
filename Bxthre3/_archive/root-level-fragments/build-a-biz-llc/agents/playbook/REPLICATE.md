# Build-A-Biz Replication Playbook

**Purpose:** Spin up a new Build-A-Biz instance for a new business owner.

---

## Pre-Flight Checklist

| Item | Status | Notes |
|------|--------|-------|
| Business owner identified | ⬜ | Name, location, niche |
| Partnership terms agreed | ⬜ | Revenue split, equity if applicable |
| Service tier selected | ⬜ | Basic / Pro / Ultimate |
| Pricing locked | ⬜ | Setup fee + monthly |

---

## Step 1: Scaffold New Business Directory

```bash
NEW_BUSINESS="owner-name-llc"
BASE="/home/workspace/Bxthre3/projects/build-a-biz-enterprise"

# Copy structure from template
cp -r "$BASE/templates" "$BASE/playbook/scaffolds/$NEW_BUSINESS"
mkdir -p "$BASE/playbook/scaffolds/$NEW_BUSINESS/client-data"
mkdir -p "$BASE/playbook/scaffolds/$NEW_BUSINESS/outreach"
```

---

## Step 2: Customize the Onboarding Packet

**Copy and modify:**

| Source | Destination | Changes Required |
|--------|-------------|------------------|
| `build-a-biz-llc/onboarding/Valley_Build_A_Biz_Onboarding_Packet.md` | `scaffolds/{new-business}/onboarding/Onboarding_Packet.md` | Update business name, owner name, service area |
| `build-a-biz-llc/onboarding/DESIRAE_QUESTIONNAIRE.md` | `scaffolds/{new-business}/onboarding/OWNER_QUESTIONNAIRE.md` | Blank template for new owner |
| `build-a-biz-llc/grants/` | `scaffolds/{new-business}/grants/` | New grant applications |

**Search-and-replace tokens:**
- `Valley Build-A-Biz LLC` → `[BUSINESS_NAME]`
- `Desirae Espinosa` → `[OWNER_NAME]`
- `San Luis Valley` → `[SERVICE_AREA]`
- Colorado-specific references → `[STATE]`

---

## Step 3: Initialize Agent Config

Each agent needs custom context:

**LeadGen Agent:** Update territory/target market
**Sales Agent:** Update pricing, service descriptions
**Onboarding Agent:** Update welcome email templates
**Account Manager:** Update escalation paths

---

## Step 4: Legal Setup Checklist

- [ ] Articles of Organization (state-specific)
- [ ] Operating Agreement (if multi-member)
- [ ] EIN obtained
- [ ] Bank account opened
- [ ] Business insurance quoted

---

## Step 5: Digital Presence

- [ ] Domain purchased
- [ ] Business email setup
- [ ] Google Business Profile claimed
- [ ] Calendly configured
- [ ] Onboarding portal deployed to Zo hosting

---

## Customization Script

Run this to auto-generate a new instance:
```bash
cd /home/workspace/Bxthre3/projects/build-a-biz-enterprise
python3 playbook/scripts/scaffold.py --name "New Business LLC" --owner "Jane Doe" --territory "Denver Metro"
```

---

*Template: Ready for replication*
