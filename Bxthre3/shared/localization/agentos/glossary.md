# Agentic — Localization Terminology Glossary

**Version:** 0.1 (Draft)  
**Scope:** Internal agent instruction and communication localization  
**Status:** Draft — not yet ratified by all agents  
**Last Updated:** 2026-04-10

---

## Purpose

Standardize cross-agent communication by tagging all agent instructions with a `locale:` field. This ensures consistent behavior regardless of which agent handles a task or which channel it comes through.

---

## Locale Field Format

```
locale: {language}-{REGION}
```

| Field | Values | Notes |
|-------|--------|-------|
| `language` | ISO 639-1 (lowercase) | en, es, pt, fr, etc. |
| `REGION` | ISO 3166-1 alpha-2 (uppercase) | US, MX, BR, CO, AR, etc. |

### Currently Supported Locales

| Locale | Use Case | Status |
|--------|----------|--------|
| `en-US` | Default | Active |
| `es-MX` | Irrig8 farmworker UI | Draft — v0.1 |
| `pt-BR` | Future Brazil expansion | Future |
| `es-CO` | Future Colombia expansion | Future |

---

## Canonical Terms

| English Term | es-MX | Definition |
|--------------|-------|-----------|
| Agent | Agente | An autonomous AI worker in Agentic |
| Task | Tarea | A unit of work assigned to an agent |
| INBOX | Bandeja | Agent report routing hub |
| Escalation | Escalada | P1/P0 escalation to brodiblanco |
| Standup | Standup | Daily sync meeting (retained as English) |
| Route | Ruta | Communication pathway or instruction path |
| Prompt | Prompt | Instruction set for an agent |
| Schedule | Programación | When a scheduled agent fires |
| Trigger | Disparador | Event that starts a scheduled agent |

---

## Instruction Tagging Convention

Every agent instruction document should begin with:

```
---
locale: en-US
version: 1.0
department: Localization
last_updated: 2026-04-10
---
```

Cross-references: `Bxthre3/INBOX/agents/{agent}.md`

---

## Out of Scope

- External-facing product localization (Irrig8, VPC, Starting 5, Zoe)
- Customer-facing documentation
- Investor or marketing materials
- Legal or compliance documents

---

## Next Steps

- [ ] All agents to adopt `locale:` field in new instruction sets
- [ ] Ratify `en-US` and `es-MX` glossary terms across all active agents
- [ ] Integrate with Brand (voice/tone) and Frame (i18n) when sync is established