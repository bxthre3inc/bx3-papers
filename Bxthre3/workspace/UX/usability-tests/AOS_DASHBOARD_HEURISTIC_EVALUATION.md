# Agentic Dashboard — Heuristic Evaluation

**Evaluator:** Lens (UX Research Lead)
**Date:** 2026-04-08
**URL:** https://brodiblanco.zo.space/agentic-dashboard
**Method:** 10 Usability Heuristics for User Interface Design (Nielsen)

---

## Heuristic Scores

| # | Heuristic | Score (1-5) | Finding |
|---|-----------|-------------|---------|
| 1 | Visibility of system status | 4 | Clear metrics (agents, blockers, API uptime) |
| 2 | Match between system and real world | 3 | Mixed — "ARPA-E OPEN 2026 Sprint" is jargon-heavy |
| 3 | User control and freedom | 2 | Limited navigation, no clear back path |
| 4 | Consistency and standards | 3 | Mixed — "Blockers" vs "Active Blockers" inconsistent naming |
| 5 | Error prevention | 3 | No confirmations before escalations |
| 6 | Recognition rather than recall | 2 | Agents shown as initials (T, M, I, D, T) — low recognition |
| 7 | Flexibility and efficiency of use | 2 | No customization, no keyboard shortcuts |
| 8 | Aesthetic and minimalist design | 4 | Clean, functional layout |
| 9 | Help users recognize/fix errors | 2 | "ESCALATED" badge but no remediation guidance |
| 10 | Help and documentation | 1 | No help system, no tooltips |

**Overall Score: 26/50 → Usability: POOR (needs improvement)**

---

## Critical Findings

### H6: Agent Recognition (Score: 2)
Agents displayed as initials — no avatar, name, or role context visible in main view. A user cannot identify agents without knowing the roster.

**Recommendation:** Show agent name + role in table, not just initials.

### H9: Error Recovery (Score: 2)
Blockers are labeled "ESCALATED" but no guidance on how to resolve. A new user seeing a P1 blocker has no path to remediation.

**Recommendation:** Add inline resolution steps or link to issue tracker.

### H3: User Control (Score: 2)
No visible navigation back to main site. If a user lands on this dashboard from a link, browser back may not work as expected (SPA routing).

**Recommendation:** Add persistent breadcrumb navigation.

### H1: Status Clarity (Score: 4 — positive)
Sprint countdown ("23 days left") and blocker counts are immediately visible — this is good practice.

---

## Positive Findings

- Clean visual hierarchy (metrics prominent)
- API uptime shown clearly
- "Live 8/8 tests passing" provides confidence
- Responsive layout

---

## Recommended Actions

| Priority | Action | Owner |
|----------|--------|-------|
| H6 | Replace agent initials with full name + role | Palette |
| H9 | Add resolution links to blocker cards | Iris |
| H3 | Add breadcrumb/home navigation | Engineering |
| H10 | Add tooltip on first visit | Engineering |

---

*Lens — UX Research Lead | 2026-04-08*
