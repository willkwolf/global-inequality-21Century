# 16. Contratos Pedagógicos por Sección, Gramática Visual y Principios Tufte

## 1. Contrato Pedagógico de Cada Sección (DOM Section)

Cada estrato visual obedece a un contrato cognitivo y visual inmutable que ancla una analogía física cotidiana con una magnitud de riqueza individual real:

| Sección | Rol Pedagógico | Propósito Cognitivo | Titular Típico (ES) | Caption Dinámico Derivado | Analogía Visual |
|---|---|---|---|---|---|
| **s0** | `SPLASH_INTRO` | Anclaje inicial y bienvenida móvil. | *¿A qué altura vives?* | *La distancia real entre la base y la cúspide es de [Altura]* | Universo estrellado |
| **s1** | `EXTREMO` | Cúspide individual extrema (Top 1). | *[Nombre Persona Natural] vive en órbita* | *Menos de 1 de cada 10 millones · USD $[Valor]B · Altura: [Altura]* | Satélite en órbita |
| **s2** | `EXTREMO` | Grupo de billonarios globales. | *Un billonario toca la estratosfera* | *[Ratio Población] · Más de USD $1,000M · Altura: [Altura]* | Cohete espacial |
| **s3** | `CONTEXTO` | Millonarios promedio globales (Top 1-2%). | *Los millonarios: rascacielos urbano* | *[Ratio Población] viven más abajo · Promedio USD $[Valor]M* | Rascacielos |
| **s4** | `CONTEXTO` | Umbral de entrada al 1% más rico. | *Para ser millonario: escalera doméstica* | *Solo el [X]% de adultos · Umbral USD $1M* | Escalera |
| **s5** | `CONTRASTE` | Clase media alta global. | *[X]%: a la altura de farola urbana* | *[Ratio Población] viven más abajo · USD $[Valor]k promedio* | Farola de calle |
| **s6** | `CONTRASTE` | Mayoría global (percentil medio-bajo). | *La mayoría no llega a la mesa* | *[Ratio Población] viven aquí o más abajo · USD $[Valor]k promedio* | Mesa |
| **s7** | `ESCALA` | Mediana exacta mundial (Percentil 50%). | *La mitad del planeta: un solo escalón* | *50 de cada 100 no superan este escalón · Mediana USD $[Valor]* | Escalón (15 cm) |
| **s8** | `BASE` | Base más vulnerable del planeta. | *La base del mundo: un guijarro en el suelo* | *[X] de cada 100 viven aquí o menos · USD $[Valor] promedio* | Guijarro en suelo |

---

## 2. Dinamismo Total del Copy y Metadatos de Procedencia

### Regla Fundamental: Cero Cadenas Estáticas Desalineadas
Ningún valor numérico, altura, fecha ni nombre de titular puede quedar congelado como texto estático:
1. `caption_es` / `caption_en`: Calculados determinísticamente en tiempo de compilación según las magnitudes reales del dataset activo.
2. `data_date`: Generado como `${SOURCE} · ${DATA_PERIOD} · v${METHODOLOGY_VERSION}` (ej. `UBS · dic 2024 · v2.1`).
3. `limitations`: Arreglo estructurado de advertencias epistemológicas inyectado como elementos semánticos `<li>`.

---

## 3. Integración de Principios de Edward Tufte

1. **Maximización del Data-Ink Ratio:** Cada píxel y elemento gráfico en pantalla comunica altura física o contraste poblacional. Se eliminan adornos decorativos no funcionales.
2. **Pequeños Múltiplos y Consistencia:** Todas las secciones comparten la misma jerarquía: Altura numérica destacada $\to$ Titular pedagógico $\to$ Caption descriptivo $\to$ Icono SVG monocromático $\to$ Etiqueta de fuente.
3. **Integridad Gráfica y Lie Factor = 1.0:** La altura en metros mantiene una relación estrictamente lineal con los dólares representados según la fórmula:
   $$\text{Altura (m)} = \frac{\text{Patrimonio (USD)}}{8000} \times 0.15$$
4. **Densidad de Información sin Sobrecarga:** El panel de accesibilidad y la ficha técnica proporcionan el contexto cuantitativo detallado sin ensuciar la experiencia principal de scroll.

---

## 4. Responsive UI/UX y Touch Targets

- **Mobile First (390x844 / 360x780):**
  - Tipografía fluida con `clamp()`.
  - Zero horizontal scroll (`overflow-x: hidden`).
  - Touch targets de botones y controles de accesibilidad $\ge 44 \times 44\text{ px}$.
  - Cero solapamiento entre la navegación lateral por puntos y los contenedores de texto.
- **Desktop (1920x1080 / 1440x900):**
  - Alineación de rejilla equilibrada.
  - Navegación lateral por altitud interactiva con tooltips flotantes accesibles.
  - Soporte completo de teclado (`Tab`, `Enter`, `Space`, `ArrowUp`, `ArrowDown`).
