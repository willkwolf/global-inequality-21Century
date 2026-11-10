# Inventario Canónico de Activos SVG e Iconografía

## 1. El Principio de Inmutabilidad de la Iconografía

Los iconos de estratos no son ilustraciones decorativas; son **signos semióticos normalizados** que anclan una altura matemática inabarcable en un objeto del mundo físico perceptible.

Siguiendo el contrato de `src/assets/icon-inventory.js`:
1. Si un estrato o recálculo dinámico utiliza una analogía conocida, **debe reutilizar el icono del inventario canónico** en lugar de generar formas genéricas.
2. Cada icono está diseñado con un `viewBox="0 0 120 120"`, trazos escalables de $3.5\text{ px}$ a $4\text{ px}$ con `stroke="currentColor"` y soporte nativo para modo oscuro y claro.

---

## 2. Inventario de Iconos por Rango de Altura

| Estrato | Identificador | Nombre Canónico | Rango de Altura | Objeto Físico Analógico |
|---|---|---|---|---|
| **$s_1$** | `svg-s1` | `satellite_orbit` | $\ge 100.000\text{ m}$ (Espacio orbital) | Satélite con paneles solares en órbita terrestre. |
| **$s_2$** | `svg-s2` | `rocket_stratosphere` | $10.000\text{ m} - 100.000\text{ m}$ (Estratosfera) | Cohete espacial en ascenso con estela de propulsión. |
| **$s_3$** | `svg-s3` | `skyscraper_building` | $30\text{ m} - 1.000\text{ m}$ (Gran escala urbana) | Rascacielos corporativo moderno con ventanas. |
| **$s_4$** | `svg-s4` | `stepladder_house` | $10\text{ m} - 30\text{ m}$ (Escala arquitectónica) | Casa de dos plantas con silueta de escalera. |
| **$s_5$** | `svg-s5` | `streetlight_giraffe` | $2\text{ m} - 10\text{ m}$ (Escala urbana intermedia) | Farola de alumbrado público / escala de jirafa. |
| **$s_6$** | `svg-s6` | `chair_desk` | $0,3\text{ m} - 2\text{ m}$ (Escala mobiliaria) | Silla de oficina / altura de rodilla o mesa. |
| **$s_7$** | `svg-s7` | `stair_step` | $0,1\text{ m} - 0,3\text{ m}$ (Escala de marcha) | **Escalón patrón de escalera ($15\text{ cm}$)**. |
| **$s_8$** | `svg-s8` | `rock_ground` | $< 0,1\text{ m}$ (Escala del suelo) | Guijarro / caja de fósforos apoyada en el suelo. |

---

## 3. Directrices de Renderizado y Accesibilidad

* **Monocromía Adaptativa:** Los iconos usan `stroke="currentColor"` y rellenos con opacidad parcial (`opacity=".2" - ".4"`), heredando el color del texto de la sección.
* **Ocultamiento Asistido:** En el DOM, los SVGs llevan `aria-hidden="true"` para evitar lecturas redundantes por sintetizadores de voz, ya que el significado es comunicado simultáneamente por los titulares y los captions accesibles.
