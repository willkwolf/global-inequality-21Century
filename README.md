# ¿A qué altura vives? / How High Do You Stand?

**La distancia real entre ricos y pobres es de 15.731 kilómetros.**  
*The real distance between rich and poor is 15,731 kilometers.*

> A bilingual (ES/EN) scrollytelling visualization of global wealth inequality.  
> Live demo → [willkwolf.github.io/global-inequality-21Century](https://willkwolf.github.io/global-inequality-21Century)

---

## Descripción del proyecto / Project Description

Esta pieza es un scrollytelling de pantalla completa que convierte el patrimonio neto en altura física. La premisa es simple y brutal: si cada escalón de 15 cm equivale a $8,000 USD de riqueza, ¿a qué altura te encuentras tú?

El recorrido va desde el suelo —donde el 40.7 % de la humanidad ocupa apenas 3.3 cm— hasta la órbita baja de la Tierra, donde Elon Musk alcanza los 15.731 km. En el camino se atraviesan ocho capas visuales que representan distintos estratos de riqueza global, cada una con su propio color, icono y dato estadístico.

---

*This is a full-screen scrollytelling piece that converts net worth into physical height. The premise is simple and stark: if each 15 cm step equals $8,000 USD in wealth, how high do you stand?*

*The journey goes from the ground — where 40.7% of humanity occupies just 3.3 cm — all the way to low Earth orbit, where Elon Musk reaches 15,731 km. Along the way, eight visual layers represent different global wealth strata, each with its own color, icon, and statistical data point.*

---

## Metodología de visualización / Visualization Methodology

### La fórmula / The Formula

```
Altura (m) = (Patrimonio neto en USD ÷ 8,000) × 0.15
Height (m) = (Net worth in USD ÷ 8,000) × 0.15
```

**1 escalón = $8,000 USD = 15 cm**

Esta escala hace que la mediana mundial de riqueza ($8,654–$9,167 USD) corresponda a aproximadamente un escalón de escalera — una imagen cotidiana y comprensible para cualquier persona en el mundo.

*This scale makes the global median wealth ($8,654–$9,167 USD) correspond to roughly one stair step — an everyday image comprehensible to anyone in the world.*

### Los ocho estratos / The Eight Strata

| Sección | Altura | Grupo | Patrimonio promedio |
|---------|--------|-------|---------------------|
| 1 | 15,731 km | Elon Musk (referencia) | $636B–$839B |
| 2 | 18.75 km | Billonarios (>$1B) | >$1,000M |
| 3 | 70.8 m | Millonarios (promedio) | ~$3.7M |
| 4 | 18.75 m | Umbral millonario | $1M |
| 5 | 5.5 m | Clase media alta (16.4%) | ~$293k |
| 6 | 68 cm | Mayoría global (41.3%) | ~$36k |
| 7 | 17 cm | Mediana mundial (50%) | $8,654–$9,167 |
| 8 | 3.3 cm | Base (40.7%) | ~$1,748 |

### Paleta de colores / Color Palette

El viaje visual sigue una progresión cromática que refuerza el descenso desde el espacio hasta la tierra:

- **Negro profundo** (#000000) → espacio exterior (Elon Musk)
- **Azul noche** (#081428 → #0f1e3a) → estratosfera (billonarios)
- **Azul marino** (#1a365d → #2f476b) → atmósfera superior (millonarios)
- **Gris pizarra** (#64748b) → horizonte (clase media)
- **Tierra cálida** (#a68b63 → #e7dcc3) → superficie terrestre (mayoría)

*The visual journey follows a chromatic progression reinforcing the descent from space to earth.*

---

## Fuentes / Sources

- **UBS Global Wealth Report 2024** — Datos de patrimonio neto por adulto, distribución global, medianas y promedios por decil. Datos al 31 de diciembre de 2024.
- **Forbes Real-Time Billionaires** (mayo 2026) — Fortuna de Elon Musk ($636B–$839B) y recuento de 2,891 billonarios confirmados.
- **Población adulta mundial** — 5,360 millones de adultos (base de cálculo de percentiles).

---

## Discusión / Discussion

### ¿Por qué altura y no otra metáfora?

La metáfora de la altura fue popularizada por el economista Jan Pen en su "Desfile de enanos y gigantes" (1971). Este proyecto la actualiza con datos de 2024 y la convierte en una experiencia interactiva. La altura es intuitiva: todos sabemos lo que mide un escalón, una casa, un edificio. Nadie tiene intuición sobre lo que significa "15,731 km de riqueza".

*The height metaphor was popularized by economist Jan Pen in his "Parade of Dwarfs and Giants" (1971). This project updates it with 2024 data and turns it into an interactive experience.*

### Lo que la visualización muestra — y lo que no

La escala es **logarítmica en la práctica**: pasamos de centímetros a kilómetros en ocho pantallas. Esto es necesario para que la desigualdad sea visible, pero también significa que la distancia visual entre estratos no es proporcional a la distancia real.

**Patrimonio ≠ ingreso.** El patrimonio neto incluye vivienda, pensiones, activos financieros y deudas. Una persona con casa propia en un país de ingresos medios puede tener un patrimonio positivo significativo sin tener liquidez.

**Las fortunas de los billonarios fluctúan diariamente.** Las cifras de Elon Musk son una instantánea de mayo 2026 y pueden variar en decenas de miles de millones en días.

**Esta visualización expone estructura sistémica, no juzga mérito individual.**

*This visualization exposes systemic structure; it does not judge individual merit.*

### Implicaciones

La brecha de 15.731 km entre la persona más rica y la mediana mundial no es solo un número llamativo. Es evidencia de que los sistemas de acumulación de riqueza operan en escalas radicalmente distintas para distintos grupos de la población. La mitad de la humanidad adulta no supera un escalón de escalera. El 1.6% más rico supera un edificio de 20 pisos.

---

## Características técnicas / Technical Features

- **Un solo archivo HTML** — sin dependencias de build, sin frameworks, sin bundler
- **Scroll snapping** — navegación por secciones con `scroll-snap-type: y mandatory`
- **Bilingüe ES/EN** — sistema i18n propio con validación de integridad en consola
- **Parallax de estrellas** — capa de fondo con `translateY` proporcional al scroll
- **Accesibilidad** — skip link, roles ARIA, `aria-label` por sección, `focus-visible`, soporte `prefers-reduced-motion`
- **Responsivo** — diseño adaptado a móviles modernos (360px+), tablets y escritorio
- **Sin cookies, sin tracking, sin analytics**

---

## Uso y reutilización / Usage and Reuse

Este proyecto está publicado bajo licencia **Creative Commons Attribution 4.0 International (CC BY 4.0)**.

Puedes copiar, adaptar y redistribuir este trabajo — incluso con fines comerciales — siempre que des crédito apropiado al autor original.

*This project is published under the **Creative Commons Attribution 4.0 International (CC BY 4.0)** license. You may copy, adapt, and redistribute this work — even for commercial purposes — as long as you give appropriate credit to the original author.*

**Cita sugerida / Suggested citation:**

> Artunduaga Viana, William Camilo (2026). *¿A qué altura vives? La distancia real entre ricos y pobres es de 15.731 kilómetros*. Visualización interactiva. CC BY 4.0. https://github.com/willkwolf/global-inequality-21Century

[![CC BY 4.0](https://licensebuttons.net/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

---

## Autoría / Authorship

**William Camilo Artunduaga Viana**, 2026  
Colombia

---

## Despliegue en GitHub Pages / GitHub Pages Deployment

El archivo principal es `Escala-visual-de-riqueza-mundial.html`. Para publicarlo en GitHub Pages:

1. Ve a **Settings → Pages** en el repositorio
2. En *Source*, selecciona la rama `main` y la carpeta `/ (root)`
3. Guarda. GitHub Pages publicará el sitio en `https://willkwolf.github.io/global-inequality-21Century/`
4. Para que `index.html` apunte al archivo correcto, puedes renombrarlo a `index.html` o agregar un `index.html` que redirija:

```html
<!DOCTYPE html>
<meta http-equiv="refresh" content="0; url=Escala-visual-de-riqueza-mundial.html">
```

---

## Estructura del repositorio / Repository Structure

```
global-inequality-21Century/
├── Escala-visual-de-riqueza-mundial.html   # Visualización principal
├── README.md                               # Este archivo
└── index.html                              # (opcional) Redirección para GitHub Pages
```

---

*Datos: UBS Global Wealth Report 2024 · Forbes mayo 2026*
