# SPEC Metodológico y Auditoría del Proyecto: ¿A qué altura vives?

Este documento contiene la **auditoría metodológica**, la descripción de las **fuentes de datos**, las **analogías de escala y visualización** y el **modelo de arquitectura** del visualizador interactivo de desigualdad global de riqueza. 

El objetivo de este SPEC es actuar como contrato de verdad para que cualquier desarrollador o **agente de IA del futuro** pueda actualizar los datos de riqueza global de forma consistente, sin romper la analogía visual, la experiencia de usuario o la portabilidad técnica de la pieza.

---

## 1. Auditoría del Stack Metodológico

### 1.1 La Fórmula de Escalado Lineal-Visual
La visualización utiliza una equivalencia física lineal para representar el patrimonio neto:

$$\text{Altura (m)} = \left( \frac{\text{Patrimonio Neto en USD}}{8,000} \right) \times 0.15\,\text{m}$$

*   **El Escalón Patrón:** El factor fundamental es que **$8,000 USD equivalen a 15 cm** (la altura promedio estándar de un escalón de escalera).
*   **Propósito Cognitivo:** Esta escala fue elegida porque la mediana mundial de la riqueza por adulto (la línea que divide exactamente a la mitad más rica de la más pobre) oscila en torno a los $9,000 USD, lo cual se traduce en aproximadamente **un escalón de escalera (~17 cm)**. El escalón es un objeto cotidiano universal, lo que crea una conexión cognitiva inmediata para el usuario de cualquier trasfondo.
*   **Crítica del Escalado Continuo vs. Secciones:** Representar la brecha completa en una sola escala lineal continua en una sola pantalla es físicamente imposible para el ojo humano (se necesitaría una pantalla de 15,000 kilómetros de largo). Por ello, el proyecto resuelve esto usando **secciones discretas con scroll snapping**. Cada pantalla representa una "parada" o estrato en una altura logarítmica implícita, pero mantiene dentro de sí la escala lineal para la descripción física del objeto analógico.

### 1.2 Auditoría de Fuentes
El visualizador actual (versión 2026) se nutre de tres fuentes principales de datos que deben actualizarse en conjunto en futuras iteraciones:
1.  **UBS Global Wealth Report 2024 (Datos consolidados al 31 de diciembre de 2024):**
    *   *Uso:* Define la riqueza de la mediana global ($8,654 – $9,167 USD), el promedio de la clase media alta, la mayoría global y la base de la pirámide, así como los porcentajes de adultos en cada estrato.
    *   *Punto de Mantenimiento:* El UBS publica su informe anualmente (generalmente en julio/agosto). Se deben buscar las tablas de distribución percentil global y el "Wealth Table" por adulto.
2.  **Forbes Real-Time Billionaires List (Instantánea de Mayo 2026):**
    *   *Uso:* Se utiliza para establecer el límite superior extremo (en esta instantánea de compilación, Elon Musk con $636B–$839B en patrimonio neto) y el recuento total de billonarios a nivel mundial (2,891 personas).
    *   *Neutralidad del Caso de Referencia:* La inclusión de Elon Musk en el estrato `s1` es una representación puramente objetiva e imparcial de la fuente de datos crudos del Forbes Real-Time en el momento de la compilación. No constituye ninguna postura de opinión personal, política o corporativa (a favor o en contra). La arquitectura del proyecto es 100% genérica: si el patrimonio más alto pasara a pertenecer a otra persona, una organización o una coalición colectiva, el compilador adaptará de forma automática toda la nomenclatura e iconografía visual a partir del SPEC.
    *   *Punto de Mantenimiento:* Forbes actualiza estas cifras en tiempo real. Para el mantenimiento, simplemente se debe actualizar el objeto `metadata.top_wealth_holder` en el SPEC y volver a compilar.
3.  **Población Adulta Mundial (Estimación en 5,360 millones de adultos):**
    *   *Uso:* Actúa como base de cálculo para afirmaciones relativas del tipo "3 de cada 10 millones" o "1 de cada 10 millones".
    *   *Punto de Mantenimiento:* Actualizable mediante bases de datos de la ONU o el mismo informe de UBS (que siempre reporta el total de adultos estimado para su muestra).

---

## 2. Analogías Visuales y Distribución en 8 Capas

La visualización estructura la brecha en 8 secciones de Snap de pantalla completa. A continuación se audita y detalla la analogía física asignada a cada una:

| Estrato | ID | Altura Física | patrimonio Promedio / Umbral | Población Representada | Analogía Visual / Icono SVG |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Cúspide** | `s1` | **15,731 km** | $636B – $839B | < 1 de cada 10 millones | Satélite en Órbita Terrestre Media (MEO) |
| **2. Estratosfera** | `s2` | **18.75 km** | > $1,000M (Billonarios) | 3 de cada 10 millones | Cohete cruzando la estratosfera |
| **3. Millonarios (Prom.)** | `s3` | **70.8 m** | ~$3.7M promedio | 2% superior del mundo | Edificio moderno de 20 pisos (3.5m por piso) |
| **4. Umbral Millonario** | `s4` | **18.75 m** | $1,000,000 USD | 1.6% superior del mundo | Escalera larga de 125 escalones físicos |
| **5. Clase Media Alta** | `s5` | **5.5 m** | ~$293,000 USD | 16.4% de la población | Casa residencial de dos pisos |
| **6. Mayoría Global** | `s6` | **68 cm** | ~$36,000 USD | 41.3% de la población | Silla alta de barra / bar |
| **7. Mediana Mundial** | `s7` | **17 cm** | $8,654 – $9,167 USD | 50% de la población | Un solo escalón de escalera convencional |
| **8. Base** | `s8` | **3.3 cm** | ~$1,748 USD | 40.7% de la población | Una roca pequeña / guijarro sobre la tierra |

---

## 3. Aplicación de los 10 Principios Arquitectónicos en el Proyecto

1.  **Diseña el alcance desde casos de uso reales:** La interfaz no se abstrae en métricas incomprensibles como índices Gini puros. Muestra casos tangibles: "¿A qué altura de una casa te encuentras con tus ahorros?".
2.  **Diseño internacional desde el inicio:** El visualizador está completamente internacionalizado y soporta traducción ES/EN mediante el objeto estructurado `STRINGS` y un autovalidador en consola que detecta claves faltantes. La maquetación CSS con variables de fuente responsivas (`clamp()`) evita que el texto se solape o desborde en pantallas de diferentes tamaños debido a variaciones en la longitud de las palabras traducidas.
3.  **Haz que lo simple sea trivial y lo complejo posible:** Para el usuario promedio, es una página web estática con scroll fluido y parallax. Para el análisis avanzado, toda la información está tipada y estructurada semánticamente en `OpenWiki/spec/data.json` y respaldada por scripts de validación con tests de propiedad rápida (PBT) con la librería `fast-check`.
4.  **Evita dependencias rígidas:** El sitio web interactivo corre en **un solo archivo HTML** sin necesidad de bundlers, Webpack, React o Tailwind. Puede abrirse directamente en cualquier navegador moderno sin servidor de desarrollo y es 100% portable.
5.  **Respeta la naturaleza distribuida de la web:** El archivo es extremadamente ligero (<40 KB) y no realiza peticiones HTTP externas en tiempo de ejecución (ni fuentes remotas pesadas, ni trackers, ni analytics). Esto garantiza que cargue al instante incluso en redes móviles deficientes o sin conexión.
6.  **Estructura de datos JSON-LD y Linked Open Data:** Los datos de riqueza global están estructurados en un formato JSON-LD semánticamente enriquecido (visto en `schema.json`), lo que permite que otras computadoras o motores de búsqueda los entiendan en un contexto mundial enlazado.
7.  **Sigue estándares existentes:** Usamos CSS Grid, Flexbox, variables CSS nativas, semántica HTML5 y APIs estándar como `IntersectionObserver` y `scroll-snap-type`.
8.  **Define éxito antes que fallo:** El validador `validate-data.js` define qué es un estado de datos "válido" (alturas estrictamente ascendentes, consistencia bilingüe absoluta y porcentajes de población válidos) antes de permitir que la IA compile el HTML final.
9.  **Separa responsabilidades:** La lógica de datos e i18n está encapsulada en `data.json`, los scripts de compilación operan en el nivel de desarrollo, y el archivo interactivo maneja solo la presentación visual optimizada.
10. **Resuelve cada preocupación en el nivel correcto de abstracción:** La manipulación física de archivos se delega a scripts Node de build; el archivo HTML solo contiene CSS declarativo para el diseño responsivo, y el JS de cliente se reduce estrictamente a manejar la interactividad del scroll.

---

## 4. Guía para el Mantenimiento del Proyecto

Cuando sea necesario actualizar los datos (por ejemplo, con el reporte UBS 2027 o cambios significativos de Forbes):
1.  **NO edites** directamente `Escala-visual-de-riqueza-mundial.html` a mano para actualizar los datos.
2.  Modifica los datos estructurados en `OpenWiki/spec/data.json`.
3.  Ejecuta la validación automática:
    ```bash
    node OpenWiki/scripts/validate-data.js
    ```
4.  Aplica e inyecta los datos al archivo HTML interactivo:
    ```bash
    node OpenWiki/scripts/apply-data.js
    ```
5.  El script actualizará el i18n, los atributos de accesibilidad y los valores de altura física en el HTML de forma limpia y consistente.
