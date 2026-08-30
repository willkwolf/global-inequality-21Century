# Contrato de Actualización, Conservación y Auto-Mantenimiento de Datos
## Wealth Data Protocol (WDP) — v2.1 (Persona Natural Exclusiva & Vibium Verified)

**Propósito:** definir las reglas ontológicas, metodológicas y técnicas que gobiernan cómo un sistema autónomo obtiene, valida, versiona, conserva y publica datos de riqueza global, de forma que la serie siga siendo comparable, auditable y pedagógicamente inteligible en un horizonte de 50–60+ años, incluso ante fallos, cambios de metodología o desaparición de fuentes individuales.

Este documento es un **contrato de diseño y gobernanza**, no software. Sirve como especificación formal que cualquier agente de IA, script o mantenedor humano debe seguir al operar el sistema.

---

## 1. Principios rectores (no negociables)

1. **Unidad de Análisis Inmutable — Persona Natural Exclusiva:** La abstracción representa exclusivamente a personas naturales adultas ($\ge 20$ años). Se prohíbe taxativamente comparar o mezclar individuos con empresas, personas jurídicas, fundaciones, fondos soberanos (*Sovereign Wealth Funds*) o estados.
2. **Concepto Operativo de Riqueza:** Patrimonio neto personal individual (activos financieros + inmobiliarios personales - pasivos y deudas personales).
3. **Nunca sobrescribir, siempre versionar.** Ningún dato crudo se borra o reemplaza; se archiva con marca de tiempo y hash criptográfico SHA-256.
4. **El dato crudo es sagrado; el dato procesado es desechable.** Los cálculos derivados (percentiles combinados, equivalencias métricas, alturas) se regeneran desde cero en cualquier momento a partir del crudo. El crudo nunca se regenera — se conserva tal como llegó.
5. **Redundancia de fuente y filtro ontológico.** Toda fuente pasa por `EntityFilter` antes de ser admitida en el modelo canónico.
6. **Transparencia epistemológica de limitaciones.** Toda publicación expone de forma visible y estructurada el catálogo completo de limitaciones (PPP vs Nominal, liquidez de la cúspide, subregistro offshore).
7. **Verificación dual con Vibium.** Ningún despliegue se publica sin superar la suite de verificación automatizada en Mobile First (390px) y Desktop (1920px).

---

## 2. Registro de fuentes primarias y Filtro Ontológico

| Fuente | Tipo | Cobertura | Frecuencia esperada | Nivel de confianza institucional (60 años) | Filtro Ontológico Requerido | Riesgo principal | Fuente sustituta |
|---|---|---|---|---|---|---|---|
| **UBS Global Wealth Report** | Banco / Estudio global | 56 mercados, ~92% riqueza global, pirámide de riqueza | Anual (junio/dic) | **Medio-Alto** | Requiere aislar solo percentiles de personas naturales adultas | Cambio de metodología o discontinuación | WID.world / Encuestas de Bancos Centrales (Fed/ECB) |
| **Forbes Real-Time Billionaires** | Medio financiero | Individuos en la cima global | Continua (tiempo real) + anual | **Medio** | `EntityFilter` estricto: rechaza corporaciones y fondos soberanos | Volatilidad bursátil concentrada en acciones de empresas | Bloomberg Billionaires Index |
| **WID.world** (World Inequality Database) | Consorcio académico | Deciles y percentiles detallados | Continua (API) | **Alto** | Filtrar tablas de *adult individuals* (no *national income totals*) | Dependencia de financiamiento académico | Snapshots locales e IPFS |

**Regla de contrato:** ninguna fuente puede ser la única entrada para una métrica reportada al usuario final. Toda cifra publicada debe indicar su fuente primaria, fecha de corte y versión metodológica.

---

## 3. Esquema Canónico de Datos y Contrato de Metadatos

Todo dato ingerido se normaliza a este esquema antes de entrar al almacén:

```json
{
  "schema_version": "2.1.0",
  "dataset_id": "canonical_sha256_hash",
  "analysis_unit": "natural_person",
  "retrieved_at": "2026-08-30T00:00:00Z",
  "methodology_version": "2.1.0",
  "semantic_concept": "Patrimonio neto personal por adulto (Net Worth per Adult)",
  "global_metrics": {
    "total_adult_population": 5360000000,
    "total_billionaires_count": 2891,
    "currency_basis": "USD_nominal",
    "wealth_median_usd": 8910,
    "wealth_mean_usd": 87400,
    "top_holder": {
      "name": "Elon Musk",
      "type": "natural_person",
      "estimated_net_worth_usd": 737500000000
    }
  },
  "limitations": [
    { "code": "VALUATION_BASIS", "es": "Patrimonio neto personal = activos reales y financieros privados menos deudas individuales.", "en": "Personal net worth = individual real and financial assets minus private liabilities." },
    { "code": "INDIVIDUAL_SCOPE", "es": "Unidad de análisis exclusiva: Personas naturales adultas. Excluye corporaciones y estados.", "en": "Exclusive analysis unit: Adult natural persons. Excludes corporations and sovereign entities." },
    { "code": "VOLATILITY_AND_ILLIQUIDITY", "es": "La cúspide (Elon Musk) refleja valoración de participaciones empresariales no monetizables de inmediato en efectivo.", "en": "The apex reflects corporate equity valuations not immediately liquid in cash." },
    { "code": "CURRENCY_AND_PPP", "es": "Medición en USD nominales como denominador estándar común; el poder adquisitivo real (PPP) varía geográficamente.", "en": "Measured in nominal USD as a common standard; real purchasing power (PPP) varies geographically." },
    { "code": "STEP_EQUIVALENCE", "es": "La escala fija 1 escalón (15 cm) ≈ $8,000 USD, aproximando la mediana empírica UBS ($8,910 USD ≈ 16.7 cm).", "en": "The scale anchors 1 step (15 cm) ≈ $8,000 USD, approximating the empirical UBS median." },
    { "code": "OFFSHORE_AND_INFORMAL", "es": "Las estadísticas globales presentan subestimaciones en paraísos fiscales y activos informales.", "en": "Global statistics face limitations tracking wealth in offshore havens and informal assets." },
    { "code": "STOCK_VS_FLOW", "es": "El patrimonio neto mide riqueza acumulada (stock), no ingresos anuales de flujo corriente.", "en": "Net worth measures accumulated wealth (stock), not annual flow income." },
    { "code": "LINEAR_SCALE", "es": "La escala vertical es estrictamente lineal (Lie Factor = 1.0) sin compresión logarítmica artificial.", "en": "The vertical scale is strictly linear (Lie Factor = 1.0) without artificial logarithmic compression." }
  ],
  "distributions": [ /* Estratos ordenados de menor a mayor percentil */ ]
}
```

---

## 4. Protocolo de Gobernanza ante Drift y Guardrails Epistemológicos

| Tipo de Drift | Definición | Nivel de Riesgo | Acción del Agente |
|---|---|---|---|
| **Data Drift** | Variación cuantitativa en mediana o cúspide dentro de límites físicos | Bajo-Medio | Recalibrar valor del escalón y alturas (`ADAPTATION_SUCCESSFUL`) |
| **Semantic Drift** | Cambio en nomenclaturas o unidades monetarias (EUR, PPP) | Medio | Adaptar storytelling bilingüe conservando la metáfora espacial |
| **Methodological Drift** | Variación en granularidad o número de estratos ($N=3 \dots 12$) | Medio | Compilar dinámicamente secciones HTML respetando la gramática visual |
| **Conceptual Drift** | Intento de introducir corporaciones, fondos soberanos o estados | Crítico | **`GUARDRAIL_BLOCKED_NON_NATURAL_PERSON` $\to$ Detener publicación** |
| **Domain Drift** | Datos ajenos a riqueza personal (ej. emisiones de CO2 o PIB nacional) | Crítico | **`ABSTRACTION_FAILURE` $\to$ Requerir revisión humana** |

---

## 5. Publicación y Despliegue en GitHub Pages

1. **Compilación Determinista:** `node OpenWiki/scripts/apply-data.js` genera `Escala-visual-de-riqueza-mundial.html` inyectando microdatos y diccionarios i18n.
2. **Verificación Vibium:** Se ejecutan los tests de regresión visual y funcional en Mobile y Desktop.
3. **Pipeline CI/CD:** GitHub Actions compila y despliega los archivos estáticos en `https://willkwolf.github.io/global-inequality-21Century/`.
