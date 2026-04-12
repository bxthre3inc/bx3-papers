# Irrig8 — Spanish Voice & Tone Guide v0.1

**Version:** 0.1 (Draft)  
**Language:** es-MX (Mexican Spanish)  
**Audience:** Farmworkers in Colorado / San Luis Valley  
**Status:** Draft — awaiting Brand + Frame sync  
**Last Updated:** 2026-04-10

---

## Guiding Principles

1. **Plain Spanish** — No agricultural jargon, no technical terms. Write at 6th-grade reading level.
2. **Second-person informal (tú)** — Never formal (usted). Farmworker users expect direct, approachable language.
3. **Short sentences** — Max 15 words per sentence. One idea per sentence.
4. **Active voice only** — No passive constructions in Spanish.
5. **Culturally legible iconography** — Avoid hand gestures or icons that vary regionally. Test with MX and South American users before deployment.

---

## Tone Mapping

| Context | English Tone | Spanish Equivalent |
|---------|--------------|--------------------|
| Alert / Warning | Direct, urgent | Directo, urgente — "Alto" not "Precaución" |
| Confirmation | Calm, clear | Tranquilo, claro — "Listo" not "Confirmado" |
| Error | Honest, no blame | Sin culpa — "Algo salió mal" not "Error del usuario" |
| Tutorial | Step-by-step | Paso a paso — numbered steps, no prose |
| Dashboard | Informative, scannable | Escaneable — headers over paragraphs |

---

## Vocabulary Notes

| English | Acceptable Spanish | Avoid |
|---------|-------------------|-------|
| Water | Agua | Riego (too technical) |
| Field | Campo | Parcela (varies by region) |
| Sensor | Sensor | Detector (different meaning) |
| System | Sistema | Plataforma (too abstract for farmworkers) |
| Problem | Problema | Inconsistencia (too clinical) |
| OK / Done | Listo | Confirmado / Procesado |
| Turn on | Encender | Activar (too technical) |
| Turn off | Apagar | Desactivar / Deshabilitar |

---

## UI String Standards

- All buttons: infinitive verb (Encender, Apagar, Ver, Guardar)
- All labels: noun, singular, lowercase
- All alerts: imperative tense (Alto, Cuidado, Revisar)
- No exclamation marks — they read as shouting in Spanish
- No idioms or regional expressions

---

## Cultural Considerations

- **Color:** Red = danger/stop is universal. Green = go/start is universal. Do not use color alone to convey meaning — always pair with icon or text.
- **Date format:** DD/MM/AAAA (day/month/year) — standard in MX and most SA countries
- **Measurement:** Metric first, imperial in parentheses. Example: "2.5 cm (1 pulg)"
- **Icons:** Use internationally recognizable symbols. Avoid US-specific icons (e.g., gas pump, fire hydrant variants)

---

## Out of Scope (v0.1)

- Portuguese (Brazil) — future phase
- Mexican agricultural market expansion — future phase
- South American Spanish variants — future phase
- RTL language support — future phase

---

## Next Steps

- [ ] Await Frame (UI/UX) sync for i18n infrastructure guidance
- [ ] Await Brand sync for marketing copy voice/tone confirmation
- [ ] Phase 2: Sensor UI string localization (dashboard, alerts, tutorials)
- [ ] Phase 3: MX market compliance (COFETEL-equivalent cert requirements)