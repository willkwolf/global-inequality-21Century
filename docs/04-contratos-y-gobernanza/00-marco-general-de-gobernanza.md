# Marco General de Gobernanza y Matriz de Autoridad

## 1. Declaración de Principios de Autoridad

El repositorio y el sitio web constituyen una entidad académica integrada. Ninguna modificación técnica puede vulnerar un contrato conceptual, ni ninguna interpretación subjetiva puede alterar los datos observados.

```mermaid
graph TD
    A["Custodio Conceptual (Humano)"] -->|Autoridad Exclusiva| B["Tesis, Hipótesis, Definiciones Axiales,<br>Resolución de Drift Conceptual"]
    C["Custodio de Arquitectura (Humano)"] -->|Autoridad Exclusiva| D["Arquitectura del Sistema, Protocolos de Release,<br>Aprobación de E-ADRs Críticos"]
    E["Agente de IA (Antigravity / Gemini)"] -->|Autonomía Nivel 1 (Media / Baja)| F["Correcciones Técnicas, Accesibilidad,<br>Formateo Numérico, Recalibración Paramétrica"]
    E -.->|Prohibición Nivel 2 (Alta / Crítica)| B
```

---

## 2. Taxonomía Normativa de las Reglas

Toda regla establecida en estos contratos se clasifica bajo uno de los tres estados formales:
* **`[VIGENTE]`:** Regla de aplicación obligatoria respaldada por suites de prueba automatizadas. Su incumplimiento bloquea la integración (`exit code != 0`).
* **`[PROPUESTA]`:** Modificación técnica o metodológica sujeta a evaluación de impacto.
* **`[PENDIENTE]`:** Decisión estratégica que requiere consenso del Custodio Conceptual o evidencia empírica adicional.

---

## 3. Matriz de Autonomía de Remediación (POL-ED-001, Sección 5.2)

1. **Nivel 1 (Remediación Autónoma):** El agente tiene autorización expresa para resolver fallos de sintaxis Markdown, enlaces rotos, etiquetas de accesibilidad, formateo con `Intl.NumberFormat`, ratios de contraste y corrección de micro-copy descriptivo siempre que no altere el significado de fondo.
2. **Nivel 2 (Puerta de Aprobación Humana):** Cualquier alteración de axiomas, inclusión de nuevas teorías, variación de la unidad de análisis o modificación ante *Drift Conceptual* exige la emisión de una propuesta formal y la firma manuscrita/digital del Custodio Conceptual.
