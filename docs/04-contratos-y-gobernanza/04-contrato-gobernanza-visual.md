# Contrato de Gobernanza Visual y Accesibilidad (CT-VIS-001)

## Código Normativo: CT-VIS-001 | Versión: 1.0.0 | Estado: [VIGENTE]

---

## 1. Propósito y Alcance
Este contrato rige todos los elementos gráficos, paletas cromáticas, diagramas, animaciones, tipografías, iconos SVG y directrices de accesibilidad universal (WCAG 2.1 AA/AAA) del artefacto visual.

Garantiza que ningún componente visual sea meramente decorativo y que la experiencia perceptiva mantenga un **isomorfismo semántico riguroso** con la teoría económica.

---

## 2. Principios y Reglas Obligatorias

1. **Principio de Isomorfismo Semántico-Visual [VIGENTE]:** Cada color, gradiente, forma e icono debe codificar una variable física o conceptual real. Se prohíbe el uso de gráficos superfluos (*chartjunk*, Tufte, 1983).
2. **Principio de Progresión Cromática Parallax [VIGENTE]:** La transición de fondos debe reflejar la física atmosférica del ascenso vertical:
   - Superficie terrestre: Crema cálido (`--bg8: #e2d4b7`) y tierra saturada (`--bg7: #8c7355`).
   - Atmósfera baja y media: Azul horizonte (`--bg6: #4a6070`) y azul atmosférico (`--bg5: #2a4a6b`).
   - Estratosfera y espacio: Azul profundo (`--bg4: #1a365d`), azul oscuro (`--bg3: #0f1e3a`), espacio cercano (`--bg2: #081428`) y negro espacial (`--bg1: #000000`).
3. **Principio de Accesibilidad Universal (WCAG 2.1 Nivel AA Obligatorio) [VIGENTE]:**
   - Contraste mínimo de texto sobre fondo de $4,5:1$ ($7:1$ para AAA).
   - Elementos interactivos con dimensiones mínimas de $44 \times 44\text{ px}$.
   - Navegación completa por teclado con anillos de foco visibles (`:focus-visible`).
   - Soporte estricto de `prefers-reduced-motion` para desactivar traslaciones de parallax.
4. **Principio de Guardrails de Iconos SVG [VIGENTE]:** Cada icono de estrato debe corresponder a su escala física humana (caja de fósforos $\to$ escalón $\to$ silla $\to$ jirafa $\to$ edificio $\to$ rascacielos $\to$ estratosfera $\to$ satélite). Se prohíbe el uso de iconos genéricos o no catalogados en `src/assets/icon-inventory.js`.

---

## 3. Responsabilidades y Límites de Actuación

* **Diseñador Visual / Custodio de Artefacto (Humano):** Define la identidad visual, tipografías corporativas y tokens de diseño.
* **Agente de IA:** Puede corregir contrastes de color, añadir atributos ARIA (`aria-label`, `aria-pressed`, `aria-live`), ajustar tamaños táctiles y reparar SVG malformados (Nivel 1). No puede alterar radicalmente la paleta temática sin autorización.

---

## 4. Criterios Verificables de Cumplimiento

1. Verificación en suites Vibium (`tests/vibium-verification.test.mjs`): $0$ violaciones de contraste WCAG 2.1 AA en resoluciones de $390\text{ px}$ y $1920\text{ px}$.
2. Cero desbordamiento horizontal ($\text{scrollWidth} \equiv \text{clientWidth}$) en todo el recorrido.
3. Preservación del fondo estelar verificada por PBT (`parallax-preservation.test.mjs`).
4. Navegación por dots (`#a11y-dot-nav`) funcional con flechas de teclado y anuncios `aria-live`.

---

## 5. Evidencias que Deben Inspeccionarse

* Hoja de estilos CSS en `Escala-visual-de-riqueza-mundial.html` (`:root` design tokens).
* Inventario de iconos en `src/assets/icon-inventory.js`.
* Reportes de auditoría de accesibilidad generados por Vibium (`artifacts/vibium/*/accessibility-audit.json`).
* Documentación en `docs/06-presentacion/`.

---

## 6. Procedimientos de Validación

1. **Auditoría Automatizada con Vibium:**
   ```bash
   npm run test:vibium
   ```
2. **Inspección de Contraste con Herramientas de Accesibilidad:** Verificación de las relaciones de luminancia entre tokens de texto y fondos de sección.
3. **Prueba de Reducción de Movimiento:** Simulación de `@media (prefers-reduced-motion: reduce)` para constatar la neutralización de animaciones de desplazamiento.

---

## 7. Gestión de Desviaciones y Excepciones

* Ratios de contraste inferiores a 4.5:1: Corregidos inmediatamente mediante ajuste de token CSS (`color` / `background`).
* Inconsistencias en iconos SVG: Reemplazados por el símbolo semántico verificado en el inventario.

---

## 8. Relaciones con Otros Contratos

* **CT-DATA-001 (Datos):** Suministra los valores que determinan la altura de cada sección.
* **CT-EDIT-001 (Editorial):** Define la longitud del texto que debe caber en los contenedores visuales.
* **POL-ED-001 (Policy Editorial):** Rige el Vector 5 (Comunicación Visual e Isomorfismo Semántico).

---

## 9. Versionado y Mantenimiento

* **Versión Actual:** 1.0.0
* **Fecha de Entrada en Vigor:** 2026-11-09
* **Frecuencia de Revisión:** Con cada refactorización de interfaz.
