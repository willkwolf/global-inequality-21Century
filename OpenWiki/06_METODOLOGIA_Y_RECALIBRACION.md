# 06. Metodología y Recalibración Dinámica

## 1. La Fórmula Lineal de Escalado Físico

La visualización convierte magnitudes monetarias en altura física mediante una equivalencia lineal directa:

$$\text{Altura (m)} = \left( \frac{\text{Patrimonio Neto (USD)}}{\text{Valor Base Escalón (USD)}} \right) \times 0.15\,\text{m}$$

### El Escalón Patrón:
- **1 escalón estándar de escalera doméstica mide 15 cm ($0.15\text{ m}$).**
- **El valor base del escalón se calibra dinámicamente con la mediana mundial de riqueza:**
  $$\text{Valor Base Escalón} \approx \text{Mediana Mundial de Riqueza}$$
- En el baseline (2024–2026), la mediana mundial de riqueza ronda los **$8,910 USD**, lo que fija el escalón estándar en **$8,000 USD $\approx$ 15–17 cm**.
- Si en futuras iteraciones la mediana cambia a $12,000 USD o $2,000 USD (por cambio de moneda base), el sistema recalibra `step_usd_value` de forma que 1 escalón cotidiano continúe representando la línea que divide al 50% de la humanidad.

---

## 2. Asignación Dinámica de Analogías Físicas y Espaciales

El sistema selecciona dinámicamente referencias del mundo real según la altura calculada:

| Rango de Altura | Analogía Visual / Física | Entorno Espacial | Icono SVG Dinámico |
|---|---|---|---|
| **$\ge 100\text{ km}$** | Satélite en Órbita Terrestre (MEO/LEO) | Espacio profundo / Órbita | Satélite orbital con vector |
| **$10\text{ km} - 100\text{ km}$** | Cohete cruzando la estratosfera | Estratosfera | Cohete propulsor |
| **$30\text{ m} - 1\text{ km}$** | Edificio moderno de 20 a 50 pisos | Paisaje urbano superior | Rascacielos con pisos |
| **$10\text{ m} - 30\text{ m}$** | Escalera larga de 100+ peldaños | Estructura vertical | Escalera de tramos |
| **$2\text{ m} - 10\text{ m}$** | Casa residencial de dos pisos | Escala doméstica | Fachada de casa con techo |
| **$40\text{ cm} - 2\text{ m}$** | Silla alta de barra / Taburete | Altura de torso humano | Silla alta de bar |
| **$8\text{ cm} - 40\text{ cm}$** | Un solo escalón de escalera | Altura de pie/tobillo | Peldaño de escalera |
| **$< 8\text{ cm}$** | Una roca pequeña / guijarro en el suelo | Nivel del suelo | Roca/guijarro mineral |

---

## 3. Dinámica de $N$ Estratos

El sistema no está restringido a 8 estratos fijos. Dependiendo de la granularidad de la fuente (UBS, WID deciles, etc.), el sistema puede compilar desde $N=3$ estratos (mínimo pedagógico) hasta $N=12$ estratos (máximo cognitivo para scrollytelling sin fatiga visual), conservando siempre la secuencia Base $\to$ Escala $\to$ Contraste $\to$ Contexto $\to$ Extremo.
