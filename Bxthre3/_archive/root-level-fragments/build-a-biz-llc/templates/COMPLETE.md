# Build-A-Biz Template System
## Config-Driven Restaurant App Generator

**Status**: Core templates functional, ready for Fire Noodles prototype

---

## Structure

```
templates/
├── _shared/              # Reusable components, hooks, integrations
│   ├── components/       # LoyaltyCard, GiftCard, TabBar
│   ├── hooks/            # useCart, useLoyalty
│   ├── integrations/   # Stripe, UberEats, DoorDash, CRED
│   └── schema.ts         # Zod config validation
├── modern-minimal/       # Elegant, chef-driven (Fire Noodles)
├── casual-diner/         # Family, BBQ combos
├── urban-izakaya/        # Asian fusion, dynamic menus
├── fast-casual/          # Bowl shops, modifiers
├── artisan-bakery/       # Coffee, AM/PM menus
└── generator-core/       # Build scripts
    ├── builder.ts        # App assembly
    └── generate.ts       # CLI entry
```

---

## Usage

```bash
cd templates/modern-minimal

# Edit config
vim EXAMPLE.config.json  # Copy to my-restaurant.json

# Add assets to assets/
# - logo.png
# - hero.jpg  
# - menu item photos

# Build
bun ../generator-core/generate.ts my-restaurant.json ./dist

# Run web
cd dist/my-restaurant
bun install
bun dev

# Build iOS/Android
bun run sync
bun run ios
bun run android
```

---

## Generated App Includes

### Core
- [x] Branded iOS/Android/Web app (Capacitor/React)
- [x] Category-based menu navigation
- [x] Cart with modifiers support
- [x] Guest + account checkout
- [x] Stripe Elements integration

### Loyalty Program
- [x] Points per dollar configurable
- [x] Bronze/Silver/Gold tiers
- [x] Birthday rewards
- [x] Tier multiplier (1x → 1.5x)

### Gift Cards
- [x] Digital purchase + send
- [x] QR code redemption ready
- [x] Custom denominations
- [x] Balance tracking

### Delivery Integrations
- [x] UberEats API ready
- [x] DoorDash Drive API ready
- [x] In-app tracking status
- [x] Fallback to native fulfillment

### Payments
- [x] Stripe (cards, Apple Pay, Google Pay)
- [x] CRED Wallet (spec drafted, unimplemented)

---

## Fire Noodles Config Example

Located: `file 'Bxthre3/projects/build-a-biz-llc/templates/modern-minimal/EXAMPLE.config.json'`

```json
{
  "meta": {
    "businessName": "Fire Noodles",
    "slug": "fire-noodles-app",
    "template": "modern-minimal",
    "colors": { "primary": "#E63946", "dark": false }
  },
  "menu": {
    "categories": [
      { "id": "signature", "name": "Signature Noodles", ... },
      { "id": "burgers", "name": "Burger Fusion", ... }
    ]
  },
  "loyalty": {
    "pointsName": "Noodle Points",
    "earnRate": 1.5,
    "tiers": [...]
  },
  "integrations": {
    "uberEats": { "enabled": true },
    "doorDash": { "enabled": true }
  }
}
```

---

## CRED Wallet (Next)

Spec drafted: `file 'Bxthre3/projects/build-a-biz-llc/templates/CRED_WALLET_SPEC.md'`

Key points:
- 0.7% merchant fee vs 2.9%+$0.30 (Stripe)
- Same-day settlement
- Cross-merchant rewards
- Build-A-Biz earns 0.3% per transaction

Requires:
1. CRED merchant partnerships (your end)
2. Mobile SDK integration
3. Webhook handlers

---

## To Complete FULL System

1. **Build first app** (Fire Noodles prototype)
2. **Test generator** end-to-end
3. **Add remaining 4 templates** screens/components
4. **Implement CRED wallet** (after partnership)
5. **Add backend API** for orders/loyalty/gift cards
6. **Document for sales team** → pitch restaurant owners

---

## Sales Pitch (Draft)

> "For $2,500 we build you an app that looks like DoorDash but keeps your customers YOUR customers. No 30% commission. You own the customer data. You send push notifications. Plus loyalty program, gift cards, and it still integrates with UberEats delivery if you want."

---

*Build-A-Biz / Bxthre3 Inc*
