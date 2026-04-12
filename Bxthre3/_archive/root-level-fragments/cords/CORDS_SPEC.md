# Cords — Firewood Marketplace Spec
## Bxthre3 Inc

**Purpose:** Local firewood marketplace connecting suppliers with buyers in Colorado

---

## Core Concept
Uber for firewood — local suppliers list cordwood, buyers order delivery

**Key Features:**
- Supplier profiles with wood types, pricing, delivery radius
- Buyer search by zip code + wood type (oak, pine, mixed)
- Schedule delivery windows
- Payment via Stripe Connect
- Reviews + ratings

---

## MVP Scope

### Suppliers
- [ ] Sign up with location + service radius
- [ ] List wood types + pricing per cord/face cord
- [ ] Set availability
- [ ] Receive orders
- [ ] Mark deliveries complete

### Buyers
- [ ] Search by zip + radius
- [ ] Filter by wood type + delivery date
- [ ] View supplier profiles + reviews
- [ ] Place order with delivery instructions
- [ ] Track delivery status

### Platform
- [ ] Stripe Connect for payments
- [ ] 10% platform fee
- [ ] SMS notifications for suppliers + buyers

---

## Brand Colors
Rustic wood theme with mountain roots:
- **Primary:** #5D4037 (dark wood brown)
- **Secondary:** #8D6E63 (medium wood)
- **Accent:** #FF5722 (fire orange)
- **Background:** #FFF8E1 (light wood/cream)

---

## Tech Stack
- React + TypeScript
- Tailwind CSS
- Stripe Connect
- Google Maps API (for radius search)
- Twilio SMS

---

*Created: 2026-04-02*
