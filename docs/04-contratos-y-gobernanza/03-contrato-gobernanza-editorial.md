# Contrato de Gobernanza Editorial y Estilo (CT-EDIT-001)

## Código Normativo: CT-EDIT-001 | Versión: 1.0.0 | Estado: [VIGENTE]

---

## 1. Propósito y Alcance
Este contrato norma la estructura narrativa, el estilo textual, la consistencia terminológica, la calidad sintáctica y la integridad de las traducciones bilingües en todos los artefactos de comunicación del proyecto.

Aplica al contenido de `Escala-visual-de-riqueza-mundial.html`, la documentación canónica en `/docs`, el README y los micro-copies del compilador.

---

## 2. Principios y Reglas Obligatorias

1. **Principio de Alta Densidad Semántica [VIGENTE]:** La prosa debe ser precisa, sobria y conceptualmente densa, evitando retórica vacía, clichés periodísticos o verborrea corporativa.
2. **Principio de Paridad Bilingüe Estricta [VIGENTE]:** Todo texto publicado en la interfaz debe coexistir en español neutro e inglés internacional con idéntica profundidad conceptual y rigor métrico.
3. **Principio de Uniformidad Terminológica [VIGENTE]:** Los términos técnicos clave (ej. *Patrimonio Neto*, *Escalón Patrón*, *Percentil*, *Desfile de Pen*, *Valor Presente*) deben utilizarse de manera consistente en toda la documentación.
4. **Principio de Claridad en la Progresión Narrativa [VIGENTE]:** El scrollytelling visual debe seguir una secuencia dramática e intelectual ascendente: desde la experiencia corporal sobre el suelo hasta el vértigo cósmico de la cúspide.
5. **Principio de Atribución y Citas Académicas [VIGENTE]:** Toda cita doctrinaria o cifra histórica debe indicar su autor primario, año y fuente en formato estándar.

---

## 3. Responsabilidades y Límites de Actuación

* **Editor en Jefe / Custodio Editorial (Humano):** Vela por la voz, el tono y la coherencia estilística global.
* **Agente de IA:** Puede corregir errores gramaticales, ortotipográficos, de puntuación, desajustes de traducción y formatos numéricos (Nivel 1 de autonomía). No puede alterar el tono general ni reescribir la narrativa central sin autorización expresa.

---

## 4. Criterios Verificables de Cumplimiento

1. Cero discrepancias o claves faltantes entre los objetos `es` y `en` en el diccionario `STRINGS`.
2. Jerarquía tipográfica ortogonal (H1 $\to$ H2 $\to$ H3 $\to$ H4) sin saltos estructurales injustificados.
3. Concordancia matemática exacta entre los textos explicativos y los números computados por `NumberFormatter`.
4. Ausencia de afirmaciones no respaldadas o citas apócrifas.

---

## 5. Evidencias que Deben Inspeccionarse

* Diccionario bilingüe `STRINGS` en `Escala-visual-de-riqueza-mundial.html`.
* Campos de texto en `OpenWiki/spec/data.json`.
* Documentación y glosario en `docs/01-data/04-diccionario-de-datos-y-variables.md`.
* Textos del README.md en inglés y español.

---

## 6. Procedimientos de Validación

1. **Verificación Automatizada de i18n:** Validación en `OpenWiki/scripts/validate-data.js` de todas las claves requeridas.
2. **Revisión Ortotipográfica:** Comprobación de signos de puntuación, mayúsculas diacríticas y convenciones tipográficas de cada idioma (comillas angulares vs. inglesas).
3. **Inspección Vectorial:** Evaluación periódica bajo el Vector 4 de POL-ED-001 (Calidad Editorial y Progresión Narrativa).

---

## 7. Gestión de Desviaciones y Excepciones

* Inconsistencias menores de redacción o puntuación: Remediadas directamente por el agente bajo Nivel 1.
* Cambios en la denominación de estratos o metáforas centrales: Requieren un E-ADR documentado y firmado.

---

## 8. Relaciones con Otros Contratos

* **CT-DATA-001 (Datos):** Provee los valores y fechas que deben citarse textualmente.
* **CT-VIS-001 (Visual):** Coordina la relación entre la extensión del texto y los contenedores visuales.
* **POL-ED-001 (Policy Editorial):** Rige la auditoría de estilo y calidad de contenido.

---

## 9. Versionado y Mantenimiento

* **Versión Actual:** 1.0.0
* **Fecha de Entrada en Vigor:** 2026-11-09
* **Frecuencia de Revisión:** Semestral.
