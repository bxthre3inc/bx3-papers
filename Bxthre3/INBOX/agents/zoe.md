# Zoe — Agent INBOX

## Daily Reports

---

## Hand-offs

---

## Blockers

---

## Notes

---
*Last updated: 2026-03-23*

---
## [CCR-P0] Stub Finder → zoe | 3/24/2026, 10:59:08 PM

**Subject:** [P0] Stub Finder: 3 P0 code issues — fix required

CODE CHANGE REQUEST — from Stub Finder

Agent: zoe
Findings: 93 total (3 P0, 88 P1, 2 P2)
Files affected: Bxthre3/projects/the-agentos-project/core/bxthre3/subsidiaries.ts, Bxthre3/projects/the-agentos-project/core/execution/workspace-manager.ts, Bxthre3/projects/the-agentos-project/core/employees/starting5-v2.ts, Bxthre3/projects/the-agentos-project/core/employees/alex.ts, Bxthre3/projects/the-agentos-project/core/employees/jordan.ts, Bxthre3/projects/the-agentos-project/core/employees/sentinel.ts, Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts, Bxthre3/projects/the-agentos-project/core/leads/finance-lead.ts, Bxthre3/projects/the-agentos-project/core/leads/intelligence-lead.ts, Bxthre3/projects/the-agentos-project/core/leads/marketing-lead.ts, Bxthre3/projects/the-agentos-project/core/leads/archive-lead.ts, Bxthre3/projects/the-agentos-project/core/leads/infrastructure-lead.ts, Bxthre3/projects/the-agentos-project/core/leads/ir-lead.ts, Bxthre3/projects/the-agentos-project/core/leads/ideation-lead.ts, Bxthre3/projects/the-agentos-project/core/leads/legal-lead.ts, Bxthre3/projects/the-agentos-project/core/leads/commercialization-lead.ts, Bxthre3/projects/the-agentos-project/core/personas/engine.ts, Bxthre3/projects/the-agentos-project/core/warroom/starting5.ts, Bxthre3/projects/the-agentos-project/core/departments/router.ts, Bxthre3/projects/the-agentos-project/core/hierarchy/org.ts, Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts, Bxthre3/projects/the-agentos-project/core/mentor/overwatch-v2.ts, Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/data/Models.kt, Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt, Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/ui/AgentOSApp.kt

FINDINGS:
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/bxthre3/subsidiaries.ts:65
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/bxthre3/subsidiaries.ts:97
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/execution/workspace-manager.ts:45
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/execution/workspace-manager.ts:64
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/starting5-v2.ts:72
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/alex.ts:92
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/jordan.ts:92
  [P2] TODO_STUB — Bxthre3/projects/the-agentos-project/core/employees/sentinel.ts:76
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:91
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:91
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:91
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:91
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:91
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:91
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:92
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:92
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:92
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:92
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:92
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:92
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:92
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:94
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:94
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:94
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:94
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:94
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:95
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:95
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:95
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:95
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:96
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:96
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:96
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:96
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:96
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:97
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:97
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:97
  [P2] TODO_STUB — Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:25
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/leads/finance-lead.ts:9
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/leads/intelligence-lead.ts:8
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/leads/marketing-lead.ts:8
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/leads/archive-lead.ts:9
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/leads/infrastructure-lead.ts:8
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/leads/ir-lead.ts:9
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/leads/ideation-lead.ts:10
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/leads/legal-lead.ts:8
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/leads/commercialization-lead.ts:9
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/personas/engine.ts:14
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/personas/engine.ts:16
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/personas/engine.ts:13
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/personas/engine.ts:12
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/warroom/starting5.ts:80
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/warroom/starting5.ts:92
  [P1] EMPTY_STUB — Bxthre3/projects/the-agentos-project/core/departments/router.ts
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/hierarchy/org.ts:165
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:220
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:220
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:132
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:132
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:132
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:132
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:133
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:133
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:133
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:133
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/mentor/overwatch-v2.ts:146
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-project/core/mentor/overwatch-v2.ts:158
  [P0] HARDCODED_RESPONSE — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/data/Models.kt
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:25
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:27
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:26
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:24
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:30
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:31
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:34
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:37
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:32
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:33
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:35
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:36
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:28
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:29
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt
  [P0] HARDCODED_RESPONSE — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/ui/AgentOSApp.kt
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/ui/AgentOSApp.kt
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/ui/AgentOSApp.kt
  [P1] HARDCODE_MOCK — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/ui/AgentOSApp.kt
  [P0] HARDCODED_RESPONSE — Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/ui/AgentOSApp.kt

REQUIRED CHANGES:
  1. Fake/stale agent ID "quinn" in code — not in canonical roster
  2. Fake/stale agent ID "riley" in code — not in canonical roster
  3. Fake/stale agent ID "jordan" in code — not in canonical roster
  4. Fake/stale agent ID "sage" in code — not in canonical roster
  5. Fake/stale agent ID "architect" in code — not in canonical roster
  6. Fake/stale agent ID "alex" in code — not in canonical roster
  7. Fake/stale agent ID "jordan" in code — not in canonical roster
  8. TODO/FIXME/STUB marker: "// Stub: no findings for now"
  9. Fake/stale agent ID "avery" in code — not in canonical roster
  10. Fake/stale agent ID "remy" in code — not in canonical roster
  11. Fake/stale agent ID "quinn" in code — not in canonical roster
  12. Fake/stale agent ID "chronicler" in code — not in canonical roster
  13. Fake/stale agent ID "architect" in code — not in canonical roster
  14. Fake/stale agent ID "brand" in code — not in canonical roster
  15. Fake/stale agent ID "navigate" in code — not in canonical roster
  16. Fake/stale agent ID "nexus" in code — not in canonical roster
  17. Fake/stale agent ID "blueprint" in code — not in canonical roster
  18. Fake/stale agent ID "palette" in code — not in canonical roster
  19. Fake/stale agent ID "sync" in code — not in canonical roster
  20. Fake/stale agent ID "vault" in code — not in canonical roster
  21. Fake/stale agent ID "trace" in code — not in canonical roster
  22. Fake/stale agent ID "jordan" in code — not in canonical roster
  23. Fake/stale agent ID "alex" in code — not in canonical roster
  24. Fake/stale agent ID "casey-lin" in code — not in canonical roster
  25. Fake/stale agent ID "iris-park" in code — not in canonical roster
  26. Fake/stale agent ID "quinn-taylor" in code — not in canonical roster
  27. Fake/stale agent ID "riley-kim" in code — not in canonical roster
  28. Fake/stale agent ID "taylor-brooks" in code — not in canonical roster
  29. Fake/stale agent ID "blake-rivera" in code — not in canonical roster
  30. Fake/stale agent ID "sage-williams" in code — not in canonical roster
  31. Fake/stale agent ID "nico-anderson" in code — not in canonical roster
  32. Fake/stale agent ID "riley" in code — not in canonical roster
  33. Fake/stale agent ID "sage" in code — not in canonical roster
  34. Fake/stale agent ID "nico" in code — not in canonical roster
  35. Fake/stale agent ID "blake" in code — not in canonical roster
  36. Fake/stale agent ID "ira" in code — not in canonical roster
  37. Fake/stale agent ID "skye" in code — not in canonical roster
  38. Fake/stale agent ID "cameron" in code — not in canonical roster
  39. TODO/FIXME/STUB marker: "| 'TODO_STUB'        // TODO/FIXME/STUB markers left in code"
  40. Fake/stale agent ID "quinn" in code — not in canonical roster
  41. Fake/stale agent ID "blake" in code — not in canonical roster
  42. Fake/stale agent ID "cameron" in code — not in canonical roster
  43. Fake/stale agent ID "riley" in code — not in canonical roster
  44. Fake/stale agent ID "skye" in code — not in canonical roster
  45. Fake/stale agent ID "ira" in code — not in canonical roster
  46. Fake/stale agent ID "alex" in code — not in canonical roster
  47. Fake/stale agent ID "sage" in code — not in canonical roster
  48. Fake/stale agent ID "jordan" in code — not in canonical roster
  49. Fake/stale agent ID "avery" in code — not in canonical roster
  50. Fake/stale agent ID "quinn" in code — not in canonical roster
  51. Fake/stale agent ID "jordan" in code — not in canonical roster
  52. Fake/stale agent ID "riley" in code — not in canonical roster
  53. Fake/stale agent ID "jordan" in code — not in canonical roster
  54. Fake/stale agent ID "alex" in code — not in canonical roster
  55. Empty/no-op: arrow function returning empty object
  56. Fake/stale agent ID "brand" in code — not in canonical roster
  57. Fake/stale agent ID "jordan" in code — not in canonical roster
  58. Fake/stale agent ID "alex" in code — not in canonical roster
  59. Fake/stale agent ID "casey-lin" in code — not in canonical roster
  60. Fake/stale agent ID "iris-park" in code — not in canonical roster
  61. Fake/stale agent ID "quinn-taylor" in code — not in canonical roster
  62. Fake/stale agent ID "riley-kim" in code — not in canonical roster
  63. Fake/stale agent ID "taylor-brooks" in code — not in canonical roster
  64. Fake/stale agent ID "blake-rivera" in code — not in canonical roster
  65. Fake/stale agent ID "sage-williams" in code — not in canonical roster
  66. Fake/stale agent ID "nico-anderson" in code — not in canonical roster
  67. Fake/stale agent ID "jordan" in code — not in canonical roster
  68. Fake/stale agent ID "alex" in code — not in canonical roster
  69. SystemHealth returns hardcoded values — no live API
  70. Fake/stale agent ID "avery" in code — not in canonical roster
  71. Fake/stale agent ID "remy" in code — not in canonical roster
  72. Fake/stale agent ID "quinn" in code — not in canonical roster
  73. Fake/stale agent ID "chronicler" in code — not in canonical roster
  74. Fake/stale agent ID "architect" in code — not in canonical roster
  75. Fake/stale agent ID "brand" in code — not in canonical roster
  76. Fake/stale agent ID "navigate" in code — not in canonical roster
  77. Fake/stale agent ID "nexus" in code — not in canonical roster
  78. Fake/stale agent ID "blueprint" in code — not in canonical roster
  79. Fake/stale agent ID "sync" in code — not in canonical roster
  80. Fake/stale agent ID "vault" in code — not in canonical roster
  81. Fake/stale agent ID "trace" in code — not in canonical roster
  82. Fake/stale agent ID "alex" in code — not in canonical roster
  83. Fake/stale agent ID "riley" in code — not in canonical roster
  84. Android mock status string: "awake_processing"
  85. Android mock status string: "standby"
  86. Android mock status string: "awakened"
  87. Android mock status string: "complete"
  88. SystemHealth returns hardcoded values — no live API
  89. Android mock status string: "awake_processing"
  90. Android mock status string: "standby"
  91. Android mock status string: "awakened"
  92. Android mock status string: "complete"
  93. SystemHealth returns hardcoded values — no live API

FIX DETAIL:
  File: Bxthre3/projects/the-agentos-project/core/bxthre3/subsidiaries.ts:65
    Fix: Remove "quinn". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/bxthre3/subsidiaries.ts:97
    Fix: Remove "riley". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/execution/workspace-manager.ts:45
    Fix: Remove "jordan". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/execution/workspace-manager.ts:64
    Fix: Remove "sage". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/starting5-v2.ts:72
    Fix: Remove "architect". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/alex.ts:92
    Fix: Remove "alex". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/jordan.ts:92
    Fix: Remove "jordan". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/sentinel.ts:76
    Fix: Implement the deferred work or remove the marker. Do not leave stub code in production.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:91
    Fix: Remove "avery". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:91
    Fix: Remove "remy". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:91
    Fix: Remove "quinn". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:91
    Fix: Remove "chronicler". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:91
    Fix: Remove "architect". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:91
    Fix: Remove "brand". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:92
    Fix: Remove "navigate". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:92
    Fix: Remove "nexus". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:92
    Fix: Remove "blueprint". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:92
    Fix: Remove "palette". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:92
    Fix: Remove "sync". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:92
    Fix: Remove "vault". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:92
    Fix: Remove "trace". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:94
    Fix: Remove "jordan". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:94
    Fix: Remove "alex". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:94
    Fix: Remove "casey-lin". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:94
    Fix: Remove "iris-park". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:94
    Fix: Remove "quinn-taylor". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:95
    Fix: Remove "riley-kim". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:95
    Fix: Remove "taylor-brooks". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:95
    Fix: Remove "blake-rivera". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:95
    Fix: Remove "sage-williams". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:96
    Fix: Remove "nico-anderson". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:96
    Fix: Remove "riley". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:96
    Fix: Remove "sage". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:96
    Fix: Remove "nico". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:96
    Fix: Remove "blake". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:97
    Fix: Remove "ira". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:97
    Fix: Remove "skye". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:97
    Fix: Remove "cameron". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/employees/stub-finder.ts:25
    Fix: Implement the deferred work or remove the marker. Do not leave stub code in production.
  File: Bxthre3/projects/the-agentos-project/core/leads/finance-lead.ts:9
    Fix: Remove "quinn". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/leads/intelligence-lead.ts:8
    Fix: Remove "blake". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/leads/marketing-lead.ts:8
    Fix: Remove "cameron". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/leads/archive-lead.ts:9
    Fix: Remove "riley". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/leads/infrastructure-lead.ts:8
    Fix: Remove "skye". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/leads/ir-lead.ts:9
    Fix: Remove "ira". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/leads/ideation-lead.ts:10
    Fix: Remove "alex". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/leads/legal-lead.ts:8
    Fix: Remove "sage". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/leads/commercialization-lead.ts:9
    Fix: Remove "jordan". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/personas/engine.ts:14
    Fix: Remove "avery". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/personas/engine.ts:16
    Fix: Remove "quinn". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/personas/engine.ts:13
    Fix: Remove "jordan". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/personas/engine.ts:12
    Fix: Remove "riley". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/warroom/starting5.ts:80
    Fix: Remove "jordan". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/warroom/starting5.ts:92
    Fix: Remove "alex". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/departments/router.ts
    Fix: Implement the function body or wire to real logic. Empty stubs are hidden bugs.
  File: Bxthre3/projects/the-agentos-project/core/hierarchy/org.ts:165
    Fix: Remove "brand". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:220
    Fix: Remove "jordan". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:220
    Fix: Remove "alex". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:132
    Fix: Remove "casey-lin". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:132
    Fix: Remove "iris-park". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:132
    Fix: Remove "quinn-taylor". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:132
    Fix: Remove "riley-kim". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:133
    Fix: Remove "taylor-brooks". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:133
    Fix: Remove "blake-rivera". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:133
    Fix: Remove "sage-williams". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:133
    Fix: Remove "nico-anderson". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/mentor/overwatch-v2.ts:146
    Fix: Remove "jordan". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-project/core/mentor/overwatch-v2.ts:158
    Fix: Remove "alex". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/data/Models.kt
    Fix: Replace hardcoded SystemHealth with live API call to /api/agentos/status
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:25
    Fix: Remove "avery". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:27
    Fix: Remove "remy". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:26
    Fix: Remove "quinn". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:24
    Fix: Remove "chronicler". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:30
    Fix: Remove "architect". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:31
    Fix: Remove "brand". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:34
    Fix: Remove "navigate". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:37
    Fix: Remove "nexus". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:32
    Fix: Remove "blueprint". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:33
    Fix: Remove "sync". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:35
    Fix: Remove "vault". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:36
    Fix: Remove "trace". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:28
    Fix: Remove "alex". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:29
    Fix: Remove "riley". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt
    Fix: Replace "awake_processing" with canonical statuses: ACTIVE, IDLE, OFFLINE, ERROR
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt
    Fix: Replace "standby" with canonical statuses: ACTIVE, IDLE, OFFLINE, ERROR
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt
    Fix: Replace "awakened" with canonical statuses: ACTIVE, IDLE, OFFLINE, ERROR
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt
    Fix: Replace "complete" with canonical statuses: ACTIVE, IDLE, OFFLINE, ERROR
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt
    Fix: Replace hardcoded SystemHealth with live API call to /api/agentos/status
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/ui/AgentOSApp.kt
    Fix: Replace "awake_processing" with canonical statuses: ACTIVE, IDLE, OFFLINE, ERROR
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/ui/AgentOSApp.kt
    Fix: Replace "standby" with canonical statuses: ACTIVE, IDLE, OFFLINE, ERROR
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/ui/AgentOSApp.kt
    Fix: Replace "awakened" with canonical statuses: ACTIVE, IDLE, OFFLINE, ERROR
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/ui/AgentOSApp.kt
    Fix: Replace "complete" with canonical statuses: ACTIVE, IDLE, OFFLINE, ERROR
  File: Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/ui/AgentOSApp.kt
    Fix: Replace hardcoded SystemHealth with live API call to /api/agentos/status

Auto-fixable: 87 / 93

*Auto-generated by Stub Finder v2. P0 findings escalate to canonical INBOX.*

## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt` line 1
**Description:** Phantom agent id in code: remy
**Snippet:** `remy`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt` line 1
**Description:** Phantom agent id in code: chronicler
**Snippet:** `chronicler`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt` line 1
**Description:** Phantom agent id in code: brand
**Snippet:** `brand`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt` line 1
**Description:** Phantom agent id in code: nexus
**Snippet:** `nexus`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt` line 1
**Description:** Phantom agent id in code: vault
**Snippet:** `vault`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt` line 1
**Description:** Phantom agent id in code: quinn
**Snippet:** `quinn`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt` line 1
**Description:** Phantom agent id in code: avery
**Snippet:** `avery`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt` line 1
**Description:** Phantom agent id in code: sync
**Snippet:** `sync`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt` line 1
**Description:** Phantom agent id in code: alex
**Snippet:** `alex`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt` line 1
**Description:** Phantom agent id in code: architect
**Snippet:** `architect`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt` line 1
**Description:** Phantom agent id in code: riley
**Snippet:** `riley`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt` line 1
**Description:** Phantom agent id in code: navigate
**Snippet:** `navigate`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt` line 1
**Description:** Phantom agent id in code: blueprint
**Snippet:** `blueprint`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt` line 1
**Description:** Phantom agent id in code: trace
**Snippet:** `trace`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt:7 | 2026-03-25 05:36 UTC
**Category:** stub | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/network/ApiService.kt` line 7
**Description:** fetchSystemHealth returning hardcoded data -- no HTTP call
**Snippet:** `fun fetchSystemHealth() = SystemHealth(`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/ui/AgentOSApp.kt:1 | 2026-03-25 05:36 UTC
**Category:** incomplete | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/ui/AgentOSApp.kt` line 1
**Description:** Mismatched braces -- likely truncated file
**Snippet:** `brace count off`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/ui/AgentOSApp.kt:31 | 2026-03-25 05:36 UTC
**Category:** stub | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/ui/AgentOSApp.kt` line 31
**Description:** fetchSystemHealth returning hardcoded data -- no HTTP call
**Snippet:** `val h = ApiService.fetchSystemHealth()`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/ui/AgentOSApp.kt:79 | 2026-03-25 05:36 UTC
**Category:** stub | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-native/app/src/main/kotlin/com/bxthre3/agentos/ui/AgentOSApp.kt` line 79
**Description:** fetchSystemHealth returning hardcoded data -- no HTTP call
**Snippet:** `val h = ApiService.fetchSystemHealth()`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/bxthre3/ip-portfolio.ts:142 | 2026-03-25 05:36 UTC
**Category:** stub | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/bxthre3/ip-portfolio.ts` line 142
**Description:** Hardcoded object literal return (mock/stub)
**Snippet:** `return { patents, byStatus, totalValuation, criticalDeadlines };`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/bxthre3/subsidiaries.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/bxthre3/subsidiaries.ts` line 1
**Description:** Phantom agent id in code: quinn
**Snippet:** `quinn`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/bxthre3/subsidiaries.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/bxthre3/subsidiaries.ts` line 1
**Description:** Phantom agent id in code: riley
**Snippet:** `riley`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/employees/alex.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/employees/alex.ts` line 1
**Description:** Phantom agent id in code: alex
**Snippet:** `alex`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/employees/architect.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/employees/architect.ts` line 1
**Description:** Phantom agent id in code: architect
**Snippet:** `architect`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/employees/architect.ts:228 | 2026-03-25 05:36 UTC
**Category:** stub | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/employees/architect.ts` line 228
**Description:** Hardcoded object literal return (mock/stub)
**Snippet:** `if (!debt) return { paid: false, cost: 0, residual: ['Debt not found'] };`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/employees/architect.ts:261 | 2026-03-25 05:36 UTC
**Category:** stub | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/employees/architect.ts` line 261
**Description:** Hardcoded object literal return (mock/stub)
**Snippet:** `return { systems, integrations, criticalPaths };`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/employees/builder.ts:177 | 2026-03-25 05:36 UTC
**Category:** stub | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/employees/builder.ts` line 177
**Description:** Hardcoded object literal return (mock/stub)
**Snippet:** `return { approval, feedback, concerns };`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/employees/builder.ts:185 | 2026-03-25 05:36 UTC
**Category:** stub | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/employees/builder.ts` line 185
**Description:** Hardcoded object literal return (mock/stub)
**Snippet:** `return { shipped: false, announcement: 'Feature not found in active sprints' };`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/employees/builder.ts:234 | 2026-03-25 05:36 UTC
**Category:** stub | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/employees/builder.ts` line 234
**Description:** Hardcoded object literal return (mock/stub)
**Snippet:** `return { recommendation, reasoning, confidence, impact };`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/employees/creative.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/employees/creative.ts` line 1
**Description:** Phantom agent id in code: brand
**Snippet:** `brand`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/employees/hunter.ts:111 | 2026-03-25 05:36 UTC
**Category:** stub | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/employees/hunter.ts` line 111
**Description:** Hardcoded object literal return (mock/stub)
**Snippet:** `if (!opp) return { success: false, nextAction: 'Opportunity not found' };`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/employees/hunter.ts:160 | 2026-03-25 05:36 UTC
**Category:** stub | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/employees/hunter.ts` line 160
**Description:** Hardcoded object literal return (mock/stub)
**Snippet:** `return { success: true, nextAction: opp.nextAction };`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/employees/hunter.ts:225 | 2026-03-25 05:36 UTC
**Category:** stub | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/employees/hunter.ts` line 225
**Description:** Hardcoded object literal return (mock/stub)
**Snippet:** `return { pipeline, weighted, closed, gapToTarget, recommendations };`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/employees/jordan.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/employees/jordan.ts` line 1
**Description:** Phantom agent id in code: jordan
**Snippet:** `jordan`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/employees/operator.ts:224 | 2026-03-25 05:36 UTC
**Category:** stub | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/employees/operator.ts` line 224
**Description:** Hardcoded object literal return (mock/stub)
**Snippet:** `return { allocation, conflicts };`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/employees/starting5-v2.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/employees/starting5-v2.ts` line 1
**Description:** Phantom agent id in code: architect
**Snippet:** `architect`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/employees/vance.ts:106 | 2026-03-25 05:36 UTC
**Category:** stub | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/employees/vance.ts` line 106
**Description:** Hardcoded object literal return (mock/stub)
**Snippet:** `return { urgency: 'critical', domain: 'security' };`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/employees/vance.ts:109 | 2026-03-25 05:36 UTC
**Category:** stub | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/employees/vance.ts` line 109
**Description:** Hardcoded object literal return (mock/stub)
**Snippet:** `return { urgency: 'critical', domain: 'grants' };`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/employees/vance.ts:112 | 2026-03-25 05:36 UTC
**Category:** stub | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/employees/vance.ts` line 112
**Description:** Hardcoded object literal return (mock/stub)
**Snippet:** `return { urgency: 'critical', domain: 'fundraising' };`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/employees/vance.ts:117 | 2026-03-25 05:36 UTC
**Category:** stub | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/employees/vance.ts` line 117
**Description:** Hardcoded object literal return (mock/stub)
**Snippet:** `return { urgency: 'high', domain: 'operations' };`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/employees/vance.ts:120 | 2026-03-25 05:36 UTC
**Category:** stub | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/employees/vance.ts` line 120
**Description:** Hardcoded object literal return (mock/stub)
**Snippet:** `return { urgency: 'high', domain: 'technical' };`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/employees/vance.ts:124 | 2026-03-25 05:36 UTC
**Category:** stub | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/employees/vance.ts` line 124
**Description:** Hardcoded object literal return (mock/stub)
**Snippet:** `return { urgency: 'normal', domain: 'general' };`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/employees/vance.ts:134 | 2026-03-25 05:36 UTC
**Category:** stub | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/employees/vance.ts` line 134
**Description:** Hardcoded object literal return (mock/stub)
**Snippet:** `return { confidence: 0, employeeId: '', action: '' };`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/employees/vance.ts:236 | 2026-03-25 05:36 UTC
**Category:** stub | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/employees/vance.ts` line 236
**Description:** Hardcoded object literal return (mock/stub)
**Snippet:** `return { choice: 'unknown', confidence: 0 };`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/employees/vance.ts:246 | 2026-03-25 05:36 UTC
**Category:** stub | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/employees/vance.ts` line 246
**Description:** Hardcoded object literal return (mock/stub)
**Snippet:** `return { choice: mode, confidence };`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts` line 1
**Description:** Phantom agent id in code: sage-williams
**Snippet:** `sage-williams`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts` line 1
**Description:** Phantom agent id in code: taylor-brooks
**Snippet:** `taylor-brooks`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts` line 1
**Description:** Phantom agent id in code: iris-park
**Snippet:** `iris-park`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts` line 1
**Description:** Phantom agent id in code: nico-anderson
**Snippet:** `nico-anderson`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts` line 1
**Description:** Phantom agent id in code: alex
**Snippet:** `alex`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts` line 1
**Description:** Phantom agent id in code: jordan
**Snippet:** `jordan`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts` line 1
**Description:** Phantom agent id in code: casey-lin
**Snippet:** `casey-lin`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts` line 1
**Description:** Phantom agent id in code: blake-rivera
**Snippet:** `blake-rivera`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts` line 1
**Description:** Phantom agent id in code: quinn-taylor
**Snippet:** `quinn-taylor`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/hierarchy/agentOSApi.ts` line 1
**Description:** Phantom agent id in code: riley-kim
**Snippet:** `riley-kim`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/hierarchy/org.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/hierarchy/org.ts` line 1
**Description:** Phantom agent id in code: brand
**Snippet:** `brand`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/orchestrator/master.ts:28 | 2026-03-25 05:36 UTC
**Category:** stub | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/orchestrator/master.ts` line 28
**Description:** Hardcoded object literal return (mock/stub)
**Snippet:** `return { shard, status: 'coordinated', timestamp: new Date().toISOString() };`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/warroom/starting5.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/warroom/starting5.ts` line 1
**Description:** Phantom agent id in code: alex
**Snippet:** `alex`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/projects/the-agentos-project/core/warroom/starting5.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/projects/the-agentos-project/core/warroom/starting5.ts` line 1
**Description:** Phantom agent id in code: jordan
**Snippet:** `jordan`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.js:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.js` line 1
**Description:** Phantom agent id in code: brand
**Snippet:** `brand`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.js:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.js` line 1
**Description:** Phantom agent id in code: nexus
**Snippet:** `nexus`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.js:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.js` line 1
**Description:** Phantom agent id in code: vault
**Snippet:** `vault`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.js:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.js` line 1
**Description:** Phantom agent id in code: alex
**Snippet:** `alex`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.js:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.js` line 1
**Description:** Phantom agent id in code: jordan
**Snippet:** `jordan`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.js:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.js` line 1
**Description:** Phantom agent id in code: architect
**Snippet:** `architect`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.js:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.js` line 1
**Description:** Phantom agent id in code: riley
**Snippet:** `riley`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.js:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.js` line 1
**Description:** Phantom agent id in code: blueprint
**Snippet:** `blueprint`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.js:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.js` line 1
**Description:** Phantom agent id in code: trace
**Snippet:** `trace`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.ts` line 1
**Description:** Phantom agent id in code: alex
**Snippet:** `alex`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.ts` line 1
**Description:** Phantom agent id in code: jordan
**Snippet:** `jordan`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/shared/agent-os/core/hierarchy/agentOSApi.ts` line 1
**Description:** Phantom agent id in code: riley
**Snippet:** `riley`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/shared/agent-os/core/hierarchy/org.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/shared/agent-os/core/hierarchy/org.ts` line 1
**Description:** Phantom agent id in code: brand
**Snippet:** `brand`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/shared/agent-os/core/hierarchy/org.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/shared/agent-os/core/hierarchy/org.ts` line 1
**Description:** Phantom agent id in code: nexus
**Snippet:** `nexus`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/shared/agent-os/core/hierarchy/org.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/shared/agent-os/core/hierarchy/org.ts` line 1
**Description:** Phantom agent id in code: vault
**Snippet:** `vault`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/shared/agent-os/core/hierarchy/org.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/shared/agent-os/core/hierarchy/org.ts` line 1
**Description:** Phantom agent id in code: alex
**Snippet:** `alex`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/shared/agent-os/core/hierarchy/org.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/shared/agent-os/core/hierarchy/org.ts` line 1
**Description:** Phantom agent id in code: jordan
**Snippet:** `jordan`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/shared/agent-os/core/hierarchy/org.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/shared/agent-os/core/hierarchy/org.ts` line 1
**Description:** Phantom agent id in code: architect
**Snippet:** `architect`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/shared/agent-os/core/hierarchy/org.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/shared/agent-os/core/hierarchy/org.ts` line 1
**Description:** Phantom agent id in code: riley
**Snippet:** `riley`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/shared/agent-os/core/hierarchy/org.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/shared/agent-os/core/hierarchy/org.ts` line 1
**Description:** Phantom agent id in code: blueprint
**Snippet:** `blueprint`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.


## [P1] STUB FINDER CCR | Bxthre3/shared/agent-os/core/hierarchy/org.ts:1 | 2026-03-25 05:36 UTC
**Category:** phantom_agent | **Severity:** high
**File:** `Bxthre3/shared/agent-os/core/hierarchy/org.ts` line 1
**Description:** Phantom agent id in code: trace
**Snippet:** `trace`
**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.

## 🟡 P2 | zoe | 2026-03-25 16:10 UTC

Evening sprint EV-2026-03-25 complete. 2 department reports in sprints/EV-2026-03-25/. Deep work on escalated items: service status unchanged, dependency mapping complete. Unblockers documented for tomorrow's ON sprint. Please provide evening briefing summary.
