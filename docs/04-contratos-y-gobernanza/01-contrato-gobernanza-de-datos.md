# Contrato de Gobernanza de Datos (CT-DATA-001)

## Código Normativo: CT-DATA-001 | Versión: 1.0.0 | Estado: [VIGENTE]

---

## 1. Propósito y Alcance
Este contrato establece los estándares normativos obligatorios para la recolección, ingestión, estructuración, normalización, validación, actualización y auditoría de todos los datos numéricos y metadatos empíricos utilizados en el artefacto visual y sus modelos derivados.

Aplica a todos los archivos bajo `OpenWiki/spec/`, `docs/01-data/`, `src/adapters/` y cualquier ingestión de datos futuros.

---

## 2. Principios y Reglas Obligatorias

1. **Principio de Procedencia Verificable [VIGENTE]:** Todo dato estadístico debe estar respaldado por un publicador oficial reconocido internacionalmente (UBS, Forbes, WID, Banco Mundial, BLS), con fecha de corte explícita y hash SHA-256 de la carga útil original.
2. **Principio de Inmutabilidad de Fuentes Crudas [VIGENTE]:** Los archivos de ingestión cruda nunca se sobrescriben en caliente; se archivan con sellos de tiempo inmutables.
3. **Principio de Unidad de Análisis Exclusiva [VIGENTE]:** La única unidad de análisis admisible es la **persona natural adulta**. Queda terminantemente prohibido incluir estados soberanos, corporaciones, personas jurídicas o patrimonios agregados.
4. **Principio de Desacoplamiento Numérico-Visual [VIGENTE]:** Los cálculos matemáticos operan sobre números en coma flotante estándar; la presentación textual depende exclusivamente de `Intl.NumberFormat` y la regla `CURRENCY (USD) ≠ LOCALE (es / en)`.
5. **Principio de Monotonía de Estratos [VIGENTE]:** Los estratos deben ordenarse en secuencia descendente estricta sin solapamientos ni peldaños negativos.

---

## 3. Responsabilidades y Límites de Actuación

* **Custodio de Datos (Humano):** Autoriza la incorporación de nuevos proveedores de datos y valida metodologías de empalme histórico.
* **Agente de IA / Motor de Ingestión:** Puede extraer datos de reportes oficiales, calcular medianas y ejecutar conversiones a esquema JSON canónico. Tiene **prohibido** estimar o interpolar cifras ausentes sin aprobación humana.

---

## 4. Criterios Verificables de Cumplimiento

1. `npm run validate-spec` finaliza con código de salida `0` sin advertencias críticas.
2. Cada estrato $s_i$ satisface $\text{NetWorth}(s_i) > \text{NetWorth}(s_{i+1})$.
3. La altura calculada $H(s_i)$ coincide con $(W_i / W_{\text{ref}}) \times 0.15\text{ m}$ con una tolerancia $\epsilon < 10^{-5}$.
4. Los hashes SHA-256 de las fuentes en `data.json` coinciden con los registros en el `Change Log Ledger`.

---

## 5. Evidencias que Deben Inspeccionarse

* Archivo canónico `OpenWiki/spec/data.json`.
* Esquema de validación `OpenWiki/spec/schema.json` y `src/contracts/canonical-data.schema.json`.
* Registros de ejecución de `OpenWiki/scripts/validate-data.js`.
* Reportes de procedencia en `docs/01-data/01-fuentes-primarias-y-procedencia.md`.

---

## 6. Procedimientos de Validación

El procedimiento de validación se ejecuta en tres niveles:
```bash
# Nivel 1: Validación estática de esquema y reglas metodológicas
npm run validate-spec

# Nivel 2: Verificación de modelos unitarios
node tests/unit/canonical-model.test.mjs

# Nivel 3: Verificación de robustez sintética bajo 25 iteraciones
npm run test:robustness
```

---

## 7. Gestión de Desviaciones y Excepciones

* Si una fuente secundaria presenta discrepancias menores con la primaria (< 5%), se registra como *Limitación Aceptable* con nota al pie.
* Si una fuente primaria redefine radicalmente la metodología (ej. pasa de riqueza neta a consumo per cápita), se clasifica como *Methodological Drift* y detiene la compilación hasta su análisis en un E-ADR.

---

## 8. Relaciones con Otros Contratos

* **CT-EPIS-001 (Epistemología):** Define la unidad de análisis y los límites de la abstracción.
* **CT-TECH-001 (Técnica):** Dictamina cómo el compilador estático consume `data.json`.
* **POL-ED-001 (Policy Editorial):** Regula la auditoría del Vector 2 (Integridad Epistemológica).

---

## 9. Versionado y Mantenimiento

* **Versión Actual:** 1.0.0
* **Fecha de Entrada en Vigor:** 2026-11-09
* **Frecuencia de Revisión:** Anual o ante la publicación de nuevos reportes globales de riqueza (UBS/WID).
