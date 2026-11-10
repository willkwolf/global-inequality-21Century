# Registro de Advertencias Arquitectónicas (Architectural Warnings)

Este registro documenta todas las alertas donde la evidencia de datos empíricos o sintéticos tensionó, desafió o invalidó la abstracción visual pedagógica de altura física.

---

## 1. Principio de Registro de Alertas

Cuando un conjunto de datos viola los límites ontológicos o geométricos del modelo, el sistema ejecuta un frenado de emergencia (`ABSTRACTION_LIMIT_REACHED`), cancela la compilación de producción y asienta una entrada en este libro de advertencias.

---

## 2. Inventario de Advertencias Arquitectónicas Canónicas

### ⚠ Advertencia 001: Riqueza Neta Mediana Negativa en Simulación Caótica
- **Fecha de Detección:** 2026-08-29
- **Evento Disparador:** Suite de Pruebas de Tres Escenarios — Escenario 3 (Chaotic Drift).
- **Descripción:** Se inyectó un dataset con mediana de riqueza de $-\$8.500\text{ USD}$ (deuda neta global). La fórmula de altura física $\text{Altura} = (\text{Patrimonio} / \text{Escalón}) \times 0.15\text{ m}$ produciría una altura negativa ($-15.9\text{ cm}$), lo cual es incompatible con una escalera vertical convencional sobre el suelo terrestre y distorsiona el scrollytelling pedagógico.
- **Acción Tomada por el Agente:** Emisión de `ADAPTATION_FAILED`, cancelación del despliegue a GitHub Pages y generación de este reporte.
- **Recomendación para Mantenedores Humanos:** Si la economía global experimentara una situación real donde la mediana fuera negativa, no forzar la escalera actual; diseñar una extensión arquitectónica formal que represente "niveles subterráneos / profundidad de deuda" antes de reanudar publicaciones.
- **Requiere Revisión Humana:** **SÍ (Publicación bloqueada).**

---

### ⚠ Advertencia 002: Ratio de Desigualdad Superior a $10^{12}$
- **Fecha de Detección:** 2026-08-29 (Configuración preventiva de guardrails).
- **Evento Disparador:** Umbral de Domain Drift en `DriftEngine`.
- **Descripción:** Si la cúspide alcanza magnitudes que sitúen la altura más allá de la órbita de la Luna (> 384,400 km), la inteligibilidad de la escala requiere compresión visual explícita o advertencias astronómicas de contexto.
- **Acción Tomada:** El sistema adapta la escala pero adjunta una nota técnica en la ficha metodológica.
- **Requiere Revisión Humana:** **NO (Informativo, adaptación automática permitida).**

---

### ⚠ Advertencia 003: Detección Recurrente en Pruebas de Regresión Adversarial
- **Evento Disparador:** Test de Robustez Adversarial Escenario 3 (Múltiples corridas de CI).
- **Descripción:** Confirmación continua de que cuando la mediana de riqueza es $\le 0$, el arnés de guardrails bloquea la publicación de forma determinista y predecible.
- **Estado:** Mitigado y certificado mediante pruebas unitarias y Vibium.
