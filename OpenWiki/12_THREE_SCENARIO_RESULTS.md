# 12. Resultados de la Suite de Tres Escenarios

Este documento contiene los resultados empíricos y la evidencia de ejecución de la suite de pruebas de tres escenarios (`tests/three-scenarios.test.mjs`).

---

## 📊 Resumen Ejecutivo de Ejecución

| Escenario | Tipo de Drift Inyectado | Resultado del Agente | Impacto en la Abstracción | Publicación |
|---|---|---|---|---|
| **Escenario 1** | **Data Drift Probable** (mediana $\to \$11,200$, cúspide $\to \$940\text{B}$, 3,100 billonarios) | `ADAPTATION_SUCCESSFUL` | Abstracción preservada. Escala recalculada ($1\text{ escalón}=\$11,000\text{ USD}$), copy actualizado sin alucinaciones. | **APROBADA** (Exit 0) |
| **Escenario 2** | **Methodology & Semantic Drift** (PPP 2028, 6 estratos, Fondo Soberano en cúspide) | `ADAPTATION_SUCCESSFUL` | Abstracción preservada. HTML compiló 6 estratos y 7 botones de navegación dinámicos sin rediseño manual. | **APROBADA** (Exit 0) |
| **Escenario 3** | **Chaotic / Adversarial Drift** (mediana negativa $-\$8,500\text{ USD}$, colapso ontológico) | `ADAPTATION_FAILED` | Abstracción desafiada. Guardrails bloquearon la publicación y generaron advertencia arquitectónica. | **BLOQUEADA** (Seguridad epistemológica activa) |

---

## 🔬 Detalle Empírico por Escenario

### Escenario 1: Data Drift Probable
- **Entrada:** Reporte sintético UBS 2027 + Forbes 2027.
- **Drift Detectado:** `DATA_DRIFT` (Mediana de riqueza $+25.7\%$, Riqueza cúspide $+27.5\%$).
- **Decisión del Agente:**
  - Recalibró `step_usd_value` de $\$8,000$ a $\$11,000\text{ USD}$.
  - Cúspide: *Bernard Arnault & Family* $\to$ Altura calculada: $12,818\text{ km}$ (Órbita).
  - Headline generado: *"Bernard Arnault & Family vive en órbita"*.
- **Validación JSDOM:** Verificó que el HTML compilado posee las 8 secciones snap con monotonicidad estricta y formato numérico con unidades legibles.

### Escenario 2: Methodology & Semantic Drift
- **Entrada:** Reporte académico WID 2028 en base `USD_PPP_2028`.
- **Drift Detectado:** `METHODOLOGICAL_DRIFT` (nueva versión de metodología y divisa PPP) + `SEMANTIC_DRIFT` (entidad tipo `fund` en la cúspide).
- **Decisión del Agente:**
  - Adaptó terminología: *"Global Sovereign AI Wealth Fund opera en órbita espacial"*.
  - Compiló dinámicamente **6 estratos** en `<main id="main-content">` y **7 puntos** en `<nav id="a11y-dot-nav">`.
- **Validación JSDOM:** Confirmó que el visualizador renderizó los 6 estratos sin errores de layout ni variables CSS rotas.

### Escenario 3: Chaotic / Adversarial Drift
- **Entrada:** Dataset adversarial con mediana negativa ($-\$8,500\text{ USD}$) debido a crisis global de deuda.
- **Drift Detectado:** `CONCEPTUAL_DRIFT` $\to$ Estado: `ABSTRACTION_FAILURE`.
- **Decisión del Agente:**
  - Detención inmediata antes de la compilación de presentación.
  - Generación de `ADAPTATION_FAILED`.
  - Registro de advertencia en `OpenWiki/11_ARCHITECTURAL_WARNINGS.md`.
  - Solicitud de revisión humana para evaluar si se requiere una escala bidireccional (subterránea/profundidad) antes de publicar.
- **Resultado:** Se evitó publicar una visualización con alturas físicas negativas que habría destruido la pedagogía del producto.
