# VPC Cash Deposit System

## Overview
Cash-first payment system enabling local partners to accept physical cash deposits and credit player wallets instantly. No card processors needed.

## API Endpoints

### Create Deposit Request
```
POST /api/cash/deposit/request
Body: { "userId": "player-123", "amount": 1000 }

Response: {
  "success": true,
  "token": "VPC-CASH-A1B2C3",
  "amount": 1000,
  "qrData": "VPC-CASH:VPC-CASH-A1B2C3",
  "expiresAt": "2026-03-18T17:35:00Z"
}
```

### Confirm Deposit (Partner Action)
```
POST /api/cash/deposit/confirm
Body: { "partnerId": "local-shop-1", "token": "VPC-CASH-A1B2C3" }

Response: {
  "success": true,
  "userId": "player-123",
  "amountDeposited": 1000,
  "commissionEarned": 15.0,
  "message": "Successfully credited 1000 VLY to player account"
}
```

### List Partners
```
GET /api/cash/partners

Response: {
  "partners": [
    { "id": "local-shop-1", "name": "Valley Corner Store", "location": "Phoenix, AZ", "commissionTier": "silver", "balance": 0 }
  ]
}
```

### Register Partner
```
POST /api/cash/partners
Body: { "id": "shop-2", "name": "Main Street Market", "location": "Denver, CO", "commissionTier": "bronze" }
```

### Get Deposit History
```
GET /api/cash/deposit/history/:userId
```

## Commission Tiers
| Tier | Monthly Volume | Rate |
|------|----------------|------|
| Bronze | <$10K | 1.0% |
| Silver | $10K-$50K | 1.5% |
| Gold | >$50K | 2.0% |

## Security
- Tokens expire in 30 minutes
- Partner authentication via JWT
- Idempotent confirmations (replaying token fails)
- All transactions logged

## Deployment
System auto-initializes tables on server start via `CashNetworkService.initTables()`.

## Version
v1.0.0 - Cash-First MVP
