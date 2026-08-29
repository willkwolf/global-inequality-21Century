# 03. Modelo Canónico de Datos

## 1. Propósito del Modelo Canónico

El **Modelo Canónico de Datos** (`Canonical Data Model`) unifica datos provenientes de diversas fuentes primarias bajo un formato homogéneo, inmutable y verificable mediante firmas criptográficas SHA-256.

Permite:
1. Ingerir múltiples fuentes de forma independiente (ej. WID para percentiles continuos, UBS para riqueza mediana global, Forbes para multimillonarios individuales).
2. Aislar al sistema de cambios en la estructura interna de APIs o formatos PDF/Excel de cada publicador.
3. Preservar la inmutabilidad histórica: los datos crudos nunca se editan; se archivan con su timestamp y hash de procedencia.

---

## 2. Registro de Fuentes Primarias y Adaptadores

| Adaptador | Fuente Primaria | Tipo de Cobertura | Nivel de Confianza | Rol en el Sistema |
|---|---|---|---|---|
| `UbsSourceAdapter` | UBS Global Wealth Report | 56 mercados, pirámide de riqueza de 4 tramos y mediana global | **Medio-Alto** | Define el anclaje de la mediana ($s_7$) y distribución mayoritaria. |
| `ForbesSourceAdapter` | Forbes Real-Time Billionaires | Individuos en la cúspide global | **Bajo-Medio** | Define el extremo superior ($s_1$) y recuento de billonarios. |
| `WidSourceAdapter` | World Inequality Database (WID) | Cobertura académica de ~100 países, p0 a p100 continuo | **Alto** | Cruce de validación y análisis de percentiles finos. |
| `WorldBankAdapter` | World Bank PIP | Multilateral, percentiles de consumo e ingreso | **Alto** | Fuente de contraste para la base de la pirámide. |

---

## 3. Esquema JSON Canónico

El archivo de esquema formal reside en `src/contracts/canonical-data.schema.json`. Estructura principal:

```json
{
  "schema_version": "2.0.0",
  "dataset_id": "canonical_a1b2c3d4e5f67890",
  "retrieved_at": "2026-08-29T15:00:00.000Z",
  "methodology_version": "2.0.0",
  "semantic_concept": "Patrimonio neto global por adulto",
  "raw_sources": [
    {
      "source_id": "ubs_wealth_report",
      "name": "UBS Global Wealth Report 2024",
      "url": "https://www.ubs.com/global/en/wealth-management/insights/global-wealth-report.html",
      "report_date": "2024-12-31",
      "payload_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }
  ],
  "global_metrics": {
    "total_adult_population": 5360000000,
    "total_billionaires_count": 2891,
    "currency_basis": "USD_nominal",
    "wealth_median_usd": 8910,
    "wealth_mean_usd": 87400,
    "top_holder": {
      "name": "Elon Musk",
      "type": "person",
      "estimated_net_worth_usd": 737500000000
    }
  },
  "distributions": [
    {
      "stratum_key": "base",
      "pedagogical_role": "BASE",
      "percentile_range": { "from": 0, "to": 40.7 },
      "population_percentage": 40.7,
      "net_worth_usd": {
        "threshold_min": 0,
        "threshold_max": 10000,
        "average": 1748,
        "median": 1200
      }
    }
  ]
}
```
