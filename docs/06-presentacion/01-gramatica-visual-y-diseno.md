# Gramática Visual, Tokens de Diseño y Principios de Tufte

## 1. El Parallax Journey: La Paleta Atmosférica

El viaje visual desciende desde el vacío cósmico del espacio profundo hasta la textura granular del suelo terrestre. Cada gradiente de fondo está codificado mediante variables CSS nativas (`:root` design tokens):

```css
:root {
  /* Parallax journey: space → near space → stratosphere → atmosphere → horizon → earth → ground */
  --bg1: #000000;   /* s1: Espacio profundo / órbita satelital (13.828 km) */
  --bg2: #081428;   /* s2: Espacio cercano / termosfera (18,75 km) */
  --bg3: #0f1e3a;   /* s3: Estratosfera alta / mesosfera (69 m) */
  --bg4: #1a365d;   /* s4: Atmósfera superior / troposfera alta (18,75 m) */
  --bg5: #2a4a6b;   /* s5: Atmósfera media / farolas urbanas (5,5 m) */
  --bg6: #4a6070;   /* s6: Horizonte y crepúsculo / altura de rodilla (68 cm) */
  --bg7: #8c7355;   /* s7: Tierra saturada / escalón de escalera (16,7 cm) */
  --bg8: #e2d4b7;   /* s8: Superficie cálida / caja de fósforos en el suelo (3,3 cm) */
  
  --text: #ffffff;
  --text-dark: #14100a;
  --max: 1200px;
  --font-display: 'Fraunces', 'Georgia', serif;
  --font-body: 'DM Sans', system-ui, -apple-system, sans-serif;
}
```

---

## 2. Tipografía y Jerarquía Cognitiva

El diseño emplea un emparejamiento tipográfico bimodal:
1. **Titulares de Magnitud (`--font-display`):** `Fraunces` (serif óptico variable). Proporciona autoridad académica, calidez humana y elegancia editorial en números grandes y encabezados.
2. **Cuerpo y Datos Técnicos (`--font-body`):** `DM Sans` / `Lexend`. Diseñadas para máxima legibilidad en pantallas digitales, contraste optimizado y fluidez de lectura.

### Escala Fluida Adaptativa:
```css
body {
  font-size: calc(clamp(18px, 4.2vw, 20px) * var(--a11y-font-scale, 1));
}
@media (min-width: 1200px) {
  body {
    font-size: calc(22px * var(--a11y-font-scale, 1));
    line-height: 1.6;
  }
}
```

---

## 3. Integración de los Principios de Edward Tufte

1. **Maximización del Data-Ink Ratio:** Cada trazo visual codifica elevación o proporción poblacional; se eliminan bordes decorativos o sombras superfluas.
2. **Pequeños Múltiplos y Estructura Predecible:** Cada estrato $s_i$ repite una estructura geométrica uniforme:
   $$\text{Altura Numérica} \longrightarrow \text{Titular Pedagógico} \longrightarrow \text{Caption Descriptivo} \longrightarrow \text{Icono SVG} \longrightarrow \text{Badge de Procedencia}$$
3. **Integridad Gráfica y Lie Factor = 1.0:** La altura en metros mantiene una proporción estrictamente lineal con los dólares representados:
   $$H(W) = \frac{W}{\$8.000} \times 0,15\text{ m}$$
