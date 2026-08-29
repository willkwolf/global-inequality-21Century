# 04. Motor de Detección y Clasificación de Drift

## 1. El Drift Conceptual como Señal Positiva

En sistemas de software tradicionales:
$$\text{DRIFT} \longrightarrow \text{DETECT} \longrightarrow \text{ALERT} \longrightarrow \text{CORRECT}$$

En nuestro sistema pedagógico:
$$\text{DRIFT} \longrightarrow \text{DETECT} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{ADAPT} \longrightarrow \text{PRESERVE ABSTRACTION}$$

El drift no es un error que deba ocultarse; es **evidencia empírica de cómo ha evolucionado el fenómeno socioeconómico subyacente**.

---

## 2. Los Cinco Ejes de Clasificación de Drift

| Tipo de Drift | Definición | Ejemplo de Evento | Acción del Sistema |
|---|---|---|---|
| **1. DATA DRIFT** | Cambio en valores numéricos, distribución, promedios o máximos. | La mediana sube de $8,910 a $11,200 USD o la cúspide alcanza $950B. | Recalibrar dinámicamente la escala física y los valores monetarios. |
| **2. SEMANTIC DRIFT** | Cambio en la nomenclatura, significado o tipología de entidades. | Cambio de definición de "Riqueza neta" a "Patrimonio neto ajustado (PPP)", o la cúspide pasa de un individuo a un fondo soberano. | Adaptar títulos, subtítulos y terminología bilingüe (ES/EN) preservando el tono objetivo. |
| **3. METHODOLOGICAL DRIFT** | Cambio en la forma o metodología de medición por parte de la fuente. | Salto de `methodology_version: "2.0.0"` a `"3.0-PPP"`, o cambio de moneda base. | Registrar ruptura metodológica en el ledger y documentar la transición en la ficha técnica. |
| **4. DOMAIN DRIFT** | Cambio estructural profundo del fenómeno socioeconómico. | Ratio de desigualdad supera $10^{12}$ o colapso de clases medias. | Emitir `ARCHITECTURAL_WARNING` y adaptar el rango de compresión visual. |
| **5. CONCEPTUAL DRIFT** | Cambio que cuestiona o desafía la validez de la metáfora de altura física. | Mediana nula o negativa (deuda global masiva generalizada) o datos no positivos. | Emitir `ADAPTATION_FAILED`, bloquear la publicación y exigir revisión humana. |

---

## 3. Matriz de Estados Epistemológicos

El motor de drift (`DriftEngine`) evalúa el estado epistemológico resultante:

1. **`VALID_ABSTRACTION`**: Los datos son compatibles con la metáfora actual. Adaptación directa.
2. **`NEEDS_ADAPTATION`**: Se detectó Data Drift o Semantic Drift. El agente recalibra y adapta el copy.
3. **`ARCHITECTURAL_WARNING`**: Los datos tensionan la escala (ej. ratio extremo). Se adapta con aviso formal documentado en OpenWiki.
4. **`ABSTRACTION_FAILURE`**: Los datos invalidan matemáticamente o conceptualmente la altura física (ej. mediana negativa). Se bloquea la publicación con `ADAPTATION_FAILED`.
