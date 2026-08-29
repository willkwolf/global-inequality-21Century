# 09. Telemetría y Observabilidad

## 1. El Ciclo Completo de Observabilidad

Cada ejecución del sistema produce telemetría estructurada suficiente para auditar y reconstruir de forma determinista:

$$\text{INPUT} \longrightarrow \text{DECISION} \longrightarrow \text{TRANSFORMATION} \longrightarrow \text{OUTPUT}$$

---

## 2. Esquema de Registro de Telemetría

Cada ejecución genera un artefacto JSON en `OpenWiki/logs/` con el siguiente esquema:

```json
{
  "timestamp": "2026-08-29T15:30:00.000Z",
  "agent_engine": "GEMINI_AI_API | DETERMINISTIC_PEDAGOGICAL_ENGINE",
  "dataset_id": "canonical_a1b2c3d4",
  "sources": [
    {
      "source_id": "ubs_wealth_report",
      "name": "UBS Global Wealth Report 2024",
      "payload_hash": "e3b0c44298fc..."
    }
  ],
  "drift_analysis": {
    "detected_drifts": [
      {
        "type": "DATA_DRIFT",
        "severity": "MEDIUM",
        "message": "Variación en mediana de riqueza: $8910 → $11200 USD (+25.7%)"
      }
    ],
    "epistemological_status": "VALID_ABSTRACTION",
    "confidence": 0.95
  },
  "transformations": {
    "step_usd_value": 11000,
    "step_height_meters": 0.15,
    "max_height_meters": 12818181.8,
    "strata_count": 8
  },
  "execution_time_ms": 234,
  "warnings": [],
  "publication_status": "PUBLISHED",
  "decision_reason": "Validación y guardrails superados con éxito."
}
```

---

## 3. Principio de No-Fuga de Información

- **Cero Secretos:** Las claves API, tokens o variables confidenciales son excluidas antes de la serialización del log.
- **Trazabilidad Criptográfica:** El estado de los datos se rastrea mediante hashes SHA-256 inmutables de los payloads.
