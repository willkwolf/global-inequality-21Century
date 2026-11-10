# Bugfix Requirements Document

## Introduction

El efecto parallax de las estrellas (`#stars`) rompe la coherencia narrativa del scrollytelling en `Escala-visual-de-riqueza-mundial.html`. La narrativa visual lleva al usuario desde el espacio exterior (s1, 15 731 km) hasta el suelo (s8, 3.3 cm), pero el fondo de estrellas permanece visible y en movimiento durante toda la experiencia, incluyendo secciones que representan la atmÃ³sfera baja, la superficie terrestre y el contenido estÃ¡tico posterior al scrollytelling. Esto hace que el elemento ambiental se perciba como un artefacto visual en lugar de reforzar la narrativa.

El bug tiene tres manifestaciones concretas:
1. Las estrellas son visibles en secciones que narrativamente estÃ¡n en la tropÃ³sfera o en el suelo (s3â€“s8).
2. El parallax `translateY` sigue activo mientras el usuario lee `#metodologia` y el footer.
3. La intensidad del efecto (factor `0.18` sobre `scrollY`) es demasiado perceptible.

---

## Bug Analysis

### Current Behavior (Defect)

1.1 CUANDO el usuario hace scroll hasta las secciones s3 (edificio, 70.8 m), s4 (escalera, 18.75 m), s5 (casa, 5.5 m), s6 (silla de bar, 68 cm), s7 (escalÃ³n, 17 cm) o s8 (roca, 3.3 cm) ENTONCES el sistema muestra el fondo de estrellas con opacidad completa, contradiciendo la narrativa que ya se encuentra en la atmÃ³sfera baja o en el suelo.

1.2 CUANDO el usuario hace scroll hasta la secciÃ³n `#metodologia` o el `footer` ENTONCES el sistema continÃºa aplicando `translateY` al elemento `#stars` en cada evento de scroll, moviendo el fondo estelar detrÃ¡s del contenido estÃ¡tico.

1.3 CUANDO el usuario observa el fondo de estrellas durante el scrollytelling ENTONCES el sistema aplica un desplazamiento parallax con factor `0.18 Ã— scrollY` que resulta en un movimiento demasiado pronunciado y perceptible como artefacto visual.

---

### Expected Behavior (Correct)

2.1 CUANDO el usuario hace scroll hasta las secciones s3â€“s8 ENTONCES el sistema SHALL reducir progresivamente la opacidad de `#stars` hasta cero, de modo que las estrellas desaparezcan gradualmente a medida que la narrativa desciende de la estratosfera a la superficie terrestre.

2.2 CUANDO el usuario hace scroll hasta `#metodologia` o el `footer` ENTONCES el sistema SHALL mantener `#stars` con opacidad cero y sin aplicar ninguna transformaciÃ³n `translateY`, evitando cualquier movimiento del fondo estelar en esas secciones.

2.3 CUANDO el usuario observa el fondo de estrellas en las secciones s1 y s2 ENTONCES el sistema SHALL aplicar un factor de parallax reducido (â‰¤ `0.08 Ã— scrollY`) que produzca un movimiento sutil y ambiental, no un desplazamiento notorio.

---

### Unchanged Behavior (Regression Prevention)

3.1 CUANDO el usuario estÃ¡ en la secciÃ³n s1 (Elon Musk, espacio exterior) ENTONCES el sistema SHALL CONTINUE TO mostrar el fondo de estrellas con opacidad plena y el efecto de parpadeo (`twinkle`) activo.

3.2 CUANDO el usuario estÃ¡ en la secciÃ³n s2 (billonarios, estratosfera alta) ENTONCES el sistema SHALL CONTINUE TO mostrar el fondo de estrellas, aunque con opacidad reducida respecto a s1, reflejando la transiciÃ³n hacia la atmÃ³sfera.

3.3 CUANDO `prefers-reduced-motion: reduce` estÃ¡ activo ENTONCES el sistema SHALL CONTINUE TO omitir todas las animaciones y transformaciones de `#stars`, sin cambios respecto al comportamiento actual.

3.4 CUANDO el usuario hace scroll hacia atrÃ¡s desde secciones inferiores hacia s1 o s2 ENTONCES el sistema SHALL CONTINUE TO restaurar la visibilidad de las estrellas de forma coherente con la posiciÃ³n de scroll.

3.5 CUANDO el usuario cambia el idioma mediante el botÃ³n de toggle ENTONCES el sistema SHALL CONTINUE TO mantener el estado visual de `#stars` sin reiniciar ni alterar la opacidad o posiciÃ³n actuales.

3.6 CUANDO el usuario redimensiona la ventana ENTONCES el sistema SHALL CONTINUE TO recalcular correctamente la opacidad y posiciÃ³n de `#stars` en funciÃ³n del nuevo tamaÃ±o de viewport.

---

## Bug Condition

**Bug Condition Function:**

```pascal
FUNCTION isBugCondition(scrollState)
  INPUT: scrollState = { scrollY, totalScrollHeight, viewportHeight }
  OUTPUT: boolean

  // El bug se activa cuando el scroll ha superado el umbral de s2
  // (es decir, el usuario ya pasÃ³ la estratosfera y estÃ¡ en s3 o mÃ¡s abajo)
  // O cuando el usuario estÃ¡ en el contenido estÃ¡tico post-scrollytelling
  sectionIndex â† FLOOR(scrollState.scrollY / scrollState.viewportHeight)
  RETURN sectionIndex >= 2   // s3 en adelante (Ã­ndice base 0: s1=0, s2=1, s3=2â€¦)
END FUNCTION
```

**Property: Fix Checking**

```pascal
// Para todas las posiciones de scroll que activan el bug:
FOR ALL scrollState WHERE isBugCondition(scrollState) DO
  opacity â† getStarsOpacity'(scrollState)
  parallaxFactor â† getParallaxFactor'(scrollState)
  ASSERT opacity = 0
  ASSERT parallaxFactor = 0
END FOR
```

**Property: Preservation Checking**

```pascal
// Para posiciones de scroll que NO activan el bug (s1 y s2):
FOR ALL scrollState WHERE NOT isBugCondition(scrollState) DO
  ASSERT getStarsOpacity'(scrollState) > 0
  ASSERT getStarsOpacity(scrollState) â‰ˆ getStarsOpacity'(scrollState)  // transiciÃ³n suave
  ASSERT getParallaxFactor'(scrollState) â‰¤ 0.08
END FOR
```
# Parallax Stars Fix â€” DiseÃ±o TÃ©cnico

## Overview

El bug afecta exclusivamente a la funciÃ³n `updateScroll()` del script inline de `Escala-visual-de-riqueza-mundial.html`. Esa funciÃ³n se ejecuta en cada evento `scroll` y `resize`, y es la Ãºnica responsable de actualizar la posiciÃ³n y visibilidad de `#stars`.

El fix consiste en tres cambios mÃ­nimos dentro de esa funciÃ³n:

1. **Reducir el factor de parallax** de `0.18` a `0.05`.
2. **Detener el `translateY`** cuando `scrollY` supera el rango de las secciones snap (8 Ã— `vh`).
3. **Calcular la opacidad de `#stars`** en funciÃ³n del Ã­ndice de secciÃ³n: plena en s1, reducida en s2, cero desde s3 en adelante.

No se modifica ningÃºn otro archivo ni ninguna otra funciÃ³n. El cambio es quirÃºrgico y reversible.

---

## Glossary

- **Bug_Condition (C)**: La condiciÃ³n que activa el bug â€” `sectionIndex >= 2`, es decir, el usuario estÃ¡ en s3 o mÃ¡s abajo (o en el contenido estÃ¡tico post-scrollytelling).
- **Property (P)**: El comportamiento correcto cuando C es verdadero â€” `#stars` tiene `opacity: 0` y no recibe ningÃºn `translateY`.
- **Preservation**: El comportamiento que no debe cambiar â€” las estrellas visibles y con parallax en s1/s2, la animaciÃ³n `twinkle`, el toggle de idioma, el modo `prefers-reduced-motion`, y el redimensionado de ventana.
- **`updateScroll()`**: La funciÃ³n en el script inline de `Escala-visual-de-riqueza-mundial.html` (lÃ­nea ~340) que se ejecuta en cada `scroll` y `resize`. Es el Ãºnico punto de cambio.
- **`sectionIndex`**: `Math.floor(scrollY / vh)` â€” Ã­ndice base 0 de la secciÃ³n snap actualmente visible. s1 = 0, s2 = 1, s3 = 2, â€¦, s8 = 7.
- **`snapScrollMax`**: `(snaps.length - 1) * vh` â€” el valor mÃ¡ximo de `scrollY` dentro del Ã¡rea de secciones snap. MÃ¡s allÃ¡ de este valor el usuario estÃ¡ en `#metodologia` o `footer`.
- **`starsEl`**: La referencia a `document.getElementById('stars')` ya existente en el script.

---

## Bug Details

### Bug Condition

El bug se activa cuando `sectionIndex >= 2` (s3â€“s8) o cuando `scrollY > snapScrollMax` (contenido estÃ¡tico). En ambos casos, el cÃ³digo actual aplica `translateY` sin restricciÃ³n y no modifica la opacidad de `#stars`.

**EspecificaciÃ³n formal:**

```
FUNCTION isBugCondition(scrollState)
  INPUT: scrollState = { scrollY, vh, snapsLength }
  OUTPUT: boolean

  sectionIndex  â† FLOOR(scrollState.scrollY / scrollState.vh)
  snapScrollMax â† (scrollState.snapsLength - 1) * scrollState.vh

  RETURN sectionIndex >= 2
         OR scrollState.scrollY > snapScrollMax
END FUNCTION
```

### Ejemplos concretos

| SituaciÃ³n | `scrollY` (aprox.) | `sectionIndex` | Comportamiento actual (bug) | Comportamiento esperado (fix) |
|---|---|---|---|---|
| Usuario en s3 (edificio) | `2 Ã— vh` | 2 | `#stars` visible, `translateY(2vh Ã— 0.18)` | `opacity: 0`, sin `translateY` |
| Usuario en s6 (silla de bar) | `5 Ã— vh` | 5 | `#stars` visible, `translateY(5vh Ã— 0.18)` | `opacity: 0`, sin `translateY` |
| Usuario en `#metodologia` | `> 7 Ã— vh` | â‰¥ 8 | `#stars` se mueve con el scroll | `opacity: 0`, sin `translateY` |
| Usuario en s1 (espacio) | `0` | 0 | `#stars` visible, `translateY(0)` âœ“ | Sin cambio (preservado) |
| Usuario en s2 (estratosfera) | `1 Ã— vh` | 1 | `#stars` visible, `translateY(vh Ã— 0.18)` âœ“ | `opacity` reducida, `translateY` con factor â‰¤ 0.08 |

---

## Expected Behavior

### Preservation Requirements

**Comportamientos que no deben cambiar:**

- Las estrellas son visibles con opacidad plena cuando el usuario estÃ¡ en s1 (sectionIndex = 0).
- Las estrellas son visibles con opacidad reducida cuando el usuario estÃ¡ en s2 (sectionIndex = 1), reflejando la transiciÃ³n a la atmÃ³sfera.
- La animaciÃ³n CSS `twinkle` de las estrellas individuales no se toca (es CSS puro, no JS).
- Cuando `prefers-reduced-motion: reduce` estÃ¡ activo, la rama `if (!reduced)` ya omite todo el bloque de transformaciÃ³n â€” este comportamiento se preserva sin cambios.
- Al hacer scroll hacia atrÃ¡s desde s3+ hacia s1/s2, la opacidad se restaura correctamente porque el cÃ¡lculo es funciÃ³n directa de `scrollY`.
- El toggle de idioma no afecta ni es afectado por `updateScroll()`.
- Al redimensionar la ventana, `updateScroll()` se re-ejecuta con el nuevo `vh`, recalculando opacidad y posiciÃ³n correctamente.

**Alcance del fix:**
Solo se modifica el bloque `if (!reduced)` dentro de `updateScroll()`. NingÃºn otro cÃ³digo del archivo cambia.

---

## Hypothesized Root Cause

El cÃ³digo actual en `updateScroll()` es:

```javascript
if (!reduced) starsEl.style.transform = `translateY(${scrollY * 0.18}px)`;
```

Hay tres problemas independientes en esta Ãºnica lÃ­nea:

1. **Factor de parallax excesivo (0.18)**: Con un viewport de 800 px, al llegar a s8 (`scrollY â‰ˆ 5600 px`) el desplazamiento es `5600 Ã— 0.18 = 1008 px`. Eso mueve el fondo estelar mÃ¡s de una pantalla completa, haciÃ©ndolo perceptible como artefacto en lugar de efecto ambiental.

2. **Sin lÃ­mite de `scrollY`**: La funciÃ³n no distingue si el usuario estÃ¡ dentro del Ã¡rea snap o en el contenido estÃ¡tico. El `translateY` se aplica indefinidamente mientras el usuario lee `#metodologia` y el footer.

3. **Sin control de opacidad**: La funciÃ³n nunca modifica `starsEl.style.opacity`. Las estrellas permanecen al 100% de opacidad en todas las secciones, incluyendo s3â€“s8 donde narrativamente ya no hay cielo visible.

No hay ningÃºn problema de event listeners, selectores DOM ni timing â€” la causa es exclusivamente la lÃ³gica de la lÃ­nea citada.

---

## Correctness Properties

Property 1: Bug Condition â€” Stars Hidden Below Stratosphere

_For any_ `scrollState` where `isBugCondition(scrollState)` returns true (sectionIndex â‰¥ 2 or scrollY > snapScrollMax), the fixed `updateScroll()` function SHALL set `starsEl.style.opacity` to `"0"` and SHALL NOT apply any `translateY` transform to `starsEl`.

**Validates: Requirements 2.1, 2.2**

Property 2: Preservation â€” Stars Visible and Subtle in Space Sections

_For any_ `scrollState` where `isBugCondition(scrollState)` returns false (sectionIndex < 2), the fixed `updateScroll()` function SHALL set `starsEl.style.opacity` to a value greater than `0`, SHALL apply a `translateY` transform with factor â‰¤ `0.08`, and SHALL produce a result consistent with the original function's intent of showing stars with parallax.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

---

## Fix Implementation

### Archivo

`Escala-visual-de-riqueza-mundial.html` â€” bloque `<script>` inline, funciÃ³n `updateScroll()`.

### Cambio Ãºnico

Reemplazar la lÃ­nea:

```javascript
if (!reduced) starsEl.style.transform = `translateY(${scrollY * 0.18}px)`;
```

Por el siguiente bloque:

```javascript
if (!reduced) {
  // 1. Calcular Ã­ndice de secciÃ³n (base 0: s1=0, s2=1, s3=2 â€¦ s8=7)
  const sectionIndex  = Math.floor(scrollY / vh);
  const snapScrollMax = (snaps.length - 1) * vh;

  // 2. Opacidad: plena en s1, reducida en s2, cero desde s3 en adelante
  let starsOpacity;
  if (sectionIndex === 0) {
    starsOpacity = 1;
  } else if (sectionIndex === 1) {
    // TransiciÃ³n suave dentro de s2: de 1 a 0 segÃºn el progreso dentro de la secciÃ³n
    const progressInS2 = (scrollY - vh) / vh;          // 0 al entrar en s2, 1 al salir
    starsOpacity = Math.max(0, 1 - progressInS2);
  } else {
    starsOpacity = 0;
  }
  starsEl.style.opacity = starsOpacity;

  // 3. Parallax: solo dentro del Ã¡rea snap y con factor reducido
  if (scrollY <= snapScrollMax) {
    starsEl.style.transform = `translateY(${scrollY * 0.05}px)`;
  }
  // Si scrollY > snapScrollMax, no se aplica ningÃºn translateY adicional
  // (el transform queda en el Ãºltimo valor calculado dentro del Ã¡rea snap)
}
```

### Detalle de cada cambio

| # | Cambio | Motivo |
|---|---|---|
| 1 | Factor `0.18` â†’ `0.05` | Cumple el requisito 2.3 (â‰¤ 0.08). A 5600 px de scroll el desplazamiento es 280 px, sutil y ambiental. |
| 2 | `starsOpacity = 1` cuando `sectionIndex === 0` | Preserva el comportamiento actual en s1 (requisito 3.1). |
| 3 | `starsOpacity` interpolado en s2 | TransiciÃ³n suave hacia cero al salir de la estratosfera (requisito 3.2). |
| 4 | `starsOpacity = 0` cuando `sectionIndex >= 2` | Cumple el requisito 2.1. |
| 5 | `translateY` solo si `scrollY <= snapScrollMax` | Cumple el requisito 2.2: sin movimiento en `#metodologia` ni footer. |

### PseudocÃ³digo de la funciÃ³n corregida

```
FUNCTION getStarsOpacity'(scrollState)
  sectionIndex â† FLOOR(scrollState.scrollY / scrollState.vh)
  IF sectionIndex = 0 THEN RETURN 1
  IF sectionIndex = 1 THEN
    progressInS2 â† (scrollState.scrollY - scrollState.vh) / scrollState.vh
    RETURN MAX(0, 1 - progressInS2)
  ELSE RETURN 0
END FUNCTION

FUNCTION getParallaxFactor'(scrollState)
  snapScrollMax â† (scrollState.snapsLength - 1) * scrollState.vh
  IF scrollState.scrollY <= snapScrollMax THEN RETURN 0.05
  ELSE RETURN 0   // sin translateY adicional
END FUNCTION
```

---

## Testing Strategy

### Validation Approach

La estrategia sigue dos fases: primero ejecutar las pruebas sobre el cÃ³digo **sin corregir** para confirmar el root cause, luego ejecutarlas sobre el cÃ³digo **corregido** para verificar fix y preservation.

---

### Exploratory Bug Condition Checking

**Goal**: Demostrar el bug en el cÃ³digo actual antes de aplicar el fix. Confirmar o refutar el root cause.

**Test Plan**: Simular llamadas a `updateScroll()` con distintos valores de `scrollY` y verificar el estado resultante de `starsEl.style.opacity` y `starsEl.style.transform`.

**Test Cases**:

1. **s3 visible (sectionIndex = 2)**: `scrollY = 2 * vh` â†’ en cÃ³digo sin fix, `starsEl.style.opacity` no es `"0"` (falla esperada).
2. **s8 visible (sectionIndex = 7)**: `scrollY = 7 * vh` â†’ en cÃ³digo sin fix, `starsEl.style.opacity` no es `"0"` (falla esperada).
3. **Post-snap (metodologÃ­a)**: `scrollY = 9 * vh` â†’ en cÃ³digo sin fix, `starsEl.style.transform` contiene un `translateY` no nulo (falla esperada).
4. **Factor de parallax en s1**: `scrollY = 0.5 * vh` â†’ en cÃ³digo sin fix, el factor extraÃ­do del transform es `0.18`, no â‰¤ `0.08` (falla esperada).

**Expected Counterexamples**:
- `starsEl.style.opacity` permanece vacÃ­o o en su valor inicial en todas las secciones.
- El factor de parallax extraÃ­do del `transform` es `0.18` en lugar de â‰¤ `0.08`.

---

### Fix Checking

**Goal**: Verificar que para todas las posiciones donde `isBugCondition` es verdadero, el cÃ³digo corregido produce el comportamiento esperado.

**Pseudocode:**

```
FOR ALL scrollState WHERE isBugCondition(scrollState) DO
  result â† updateScroll_fixed(scrollState)
  ASSERT starsEl.style.opacity = "0"
  ASSERT starsEl.style.transform no contiene translateY > 0 nuevo
END FOR
```

**Test Cases**:

1. `scrollY = 2 * vh` (s3) â†’ `opacity === "0"`.
2. `scrollY = 5 * vh` (s6) â†’ `opacity === "0"`.
3. `scrollY = 7 * vh` (s8) â†’ `opacity === "0"`.
4. `scrollY = 9 * vh` (metodologÃ­a) â†’ `opacity === "0"`, sin nuevo `translateY`.

---

### Preservation Checking

**Goal**: Verificar que para posiciones donde `isBugCondition` es falso (s1 y s2), el cÃ³digo corregido mantiene las estrellas visibles y el parallax activo con factor reducido.

**Pseudocode:**

```
FOR ALL scrollState WHERE NOT isBugCondition(scrollState) DO
  ASSERT getStarsOpacity'(scrollState) > 0
  ASSERT getParallaxFactor'(scrollState) <= 0.08
  ASSERT getParallaxFactor'(scrollState) > 0
END FOR
```

**Testing Approach**: Property-based testing es adecuado aquÃ­ porque el dominio de `scrollY` en s1 y s2 es continuo (`[0, 2*vh)`). Generar valores aleatorios en ese rango garantiza cobertura de edge cases (inicio de s2, final de s2, etc.).

**Test Cases**:

1. **s1 plena**: `scrollY = 0` â†’ `opacity === "1"`, factor = `0.05`.
2. **s1 mitad**: `scrollY = 0.5 * vh` â†’ `opacity === "1"`, factor = `0.05`.
3. **s2 inicio**: `scrollY = vh` â†’ `opacity` cercana a `1` (inicio de transiciÃ³n).
4. **s2 mitad**: `scrollY = 1.5 * vh` â†’ `opacity â‰ˆ 0.5`.
5. **s2 final**: `scrollY = 1.99 * vh` â†’ `opacity` cercana a `0` pero > `0`.
6. **Scroll hacia atrÃ¡s**: Simular `scrollY` descendiendo de `3 * vh` a `0.5 * vh` â†’ `opacity` vuelve a `1`.
7. **Resize**: Cambiar `vh` y re-ejecutar â†’ los Ã­ndices se recalculan correctamente.

---

### Unit Tests

- Verificar `starsEl.style.opacity === "0"` para cada sectionIndex de 2 a 7.
- Verificar `starsEl.style.opacity === "1"` cuando `scrollY = 0`.
- Verificar que el factor de parallax extraÃ­do del `transform` es `0.05` en s1.
- Verificar que no se aplica `translateY` cuando `scrollY > snapScrollMax`.
- Verificar que `prefers-reduced-motion` sigue omitiendo todo el bloque (el `if (!reduced)` no cambia).

### Property-Based Tests

- Generar `scrollY` aleatorio en `[0, vh)` (s1) â†’ `opacity` siempre `1`, factor siempre `0.05`.
- Generar `scrollY` aleatorio en `[vh, 2*vh)` (s2) â†’ `opacity` siempre en `(0, 1]`, factor siempre `0.05`.
- Generar `scrollY` aleatorio en `[2*vh, 8*vh]` (s3â€“s8) â†’ `opacity` siempre `0`.
- Generar `scrollY` aleatorio en `(8*vh, âˆž)` (post-snap) â†’ `opacity` siempre `0`, sin nuevo `translateY`.
- Generar `vh` aleatorio (simulando resize) â†’ los umbrales se recalculan proporcionalmente.

### Integration Tests

- Scroll completo de s1 a s8 en el navegador: verificar que las estrellas desaparecen gradualmente y no son visibles en s3+.
- Scroll hacia atrÃ¡s desde s8 a s1: verificar que las estrellas reaparecen correctamente.
- Scroll hasta `#metodologia`: verificar que el fondo estelar no se mueve.
- Toggle de idioma en s5: verificar que la opacidad de `#stars` no cambia.
- Resize de ventana en s4: verificar que la opacidad sigue siendo `0` tras el resize.
# Implementation Plan

- [x] 1. Escribir prueba exploratoria del bug condition (ANTES del fix)
  - **Property 1: Bug Condition** - Stars Visible Below Stratosphere
  - **CRÃTICO**: Esta prueba DEBE FALLAR en el cÃ³digo sin fix â€” el fallo confirma que el bug existe
  - **NO intentar corregir la prueba ni el cÃ³digo cuando falle**
  - **NOTA**: Esta prueba codifica el comportamiento esperado â€” validarÃ¡ el fix cuando pase tras la implementaciÃ³n
  - **OBJETIVO**: Obtener contraejemplos que demuestren que el bug existe
  - **Enfoque PBT acotado**: Para bugs deterministas, acotar la propiedad a los casos concretos de fallo para garantizar reproducibilidad
  - Simular llamadas a `updateScroll()` con un DOM mÃ­nimo (stub de `#stars`, `#progress`, `.snap` Ã— 8) en un entorno de prueba (jsdom o similar)
  - Probar que para `scrollY = 2 * vh` (s3, `sectionIndex = 2`): `starsEl.style.opacity` NO es `"0"` en cÃ³digo sin fix (fallo esperado)
  - Probar que para `scrollY = 5 * vh` (s6, `sectionIndex = 5`): `starsEl.style.opacity` NO es `"0"` en cÃ³digo sin fix (fallo esperado)
  - Probar que para `scrollY = 9 * vh` (post-snap, metodologÃ­a): `starsEl.style.transform` contiene un `translateY` no nulo en cÃ³digo sin fix (fallo esperado)
  - Probar que el factor de parallax extraÃ­do del `transform` en s1 (`scrollY = 0.5 * vh`) es `0.18`, no â‰¤ `0.08` (fallo esperado)
  - Ejecutar la prueba en cÃ³digo SIN fix
  - **RESULTADO ESPERADO**: La prueba FALLA (esto es correcto â€” prueba que el bug existe)
  - Documentar los contraejemplos encontrados (p. ej. `starsEl.style.opacity` vacÃ­o en s3, factor `0.18` en s1)
  - Marcar la tarea como completa cuando la prueba estÃ© escrita, ejecutada y el fallo documentado
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Escribir pruebas de preservation (ANTES del fix)
  - **Property 2: Preservation** - Stars Visible and Subtle in Space Sections
  - **IMPORTANTE**: Seguir la metodologÃ­a observation-first
  - Observar el comportamiento en cÃ³digo SIN fix para entradas no-buggy (`sectionIndex < 2`, es decir `scrollY < 2 * vh`)
  - Observar: en `scrollY = 0` (s1), `starsEl.style.opacity` estÃ¡ vacÃ­o o en su valor inicial (las estrellas son visibles)
  - Observar: en `scrollY = 0.5 * vh` (s1), el transform contiene `translateY(${0.5 * vh * 0.18}px)` â€” las estrellas se mueven
  - Escribir prueba PBT: para todo `scrollY` en `[0, vh)` (s1), la opacidad resultante tras el fix debe ser `"1"` y el factor de parallax `0.05`
  - Escribir prueba PBT: para todo `scrollY` en `[vh, 2*vh)` (s2), la opacidad resultante tras el fix debe ser `> 0` y `â‰¤ 1`, y el factor de parallax `0.05`
  - Verificar que estas pruebas PASAN en cÃ³digo SIN fix (confirman el comportamiento base a preservar)
  - **RESULTADO ESPERADO**: Las pruebas PASAN en cÃ³digo sin fix (confirma la lÃ­nea base de comportamiento)
  - Marcar la tarea como completa cuando las pruebas estÃ©n escritas, ejecutadas y pasando en cÃ³digo sin fix
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 3. Fix: reemplazar lÃ³gica de parallax en `updateScroll()`

  - [x] 3.1 Implementar el fix en `Escala-visual-de-riqueza-mundial.html`
    - Localizar la lÃ­nea `if (!reduced) starsEl.style.transform = \`translateY(${scrollY * 0.18}px)\`;` dentro de `updateScroll()` (aprox. lÃ­nea 340)
    - Reemplazarla por el bloque de ~12 lÃ­neas del diseÃ±o:
      1. Calcular `sectionIndex = Math.floor(scrollY / vh)` y `snapScrollMax = (snaps.length - 1) * vh`
      2. Calcular `starsOpacity`: `1` si `sectionIndex === 0`; interpolaciÃ³n `Math.max(0, 1 - (scrollY - vh) / vh)` si `sectionIndex === 1`; `0` en cualquier otro caso
      3. Asignar `starsEl.style.opacity = starsOpacity`
      4. Aplicar `starsEl.style.transform = \`translateY(${scrollY * 0.05}px)\`` solo si `scrollY <= snapScrollMax`
    - _Bug_Condition: `isBugCondition(s)` donde `FLOOR(s.scrollY / s.vh) >= 2` o `s.scrollY > snapScrollMax`_
    - _Expected_Behavior: `starsEl.style.opacity === "0"` y sin nuevo `translateY` para todo estado que satisfaga `isBugCondition`_
    - _Preservation: opacidad `> 0` y factor de parallax `â‰¤ 0.08` para `sectionIndex < 2`_
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2_

  - [x] 3.2 Verificar que la prueba exploratoria del bug condition ahora pasa
    - **Property 1: Expected Behavior** - Stars Hidden Below Stratosphere
    - **IMPORTANTE**: Re-ejecutar la MISMA prueba de la tarea 1 â€” NO escribir una nueva prueba
    - La prueba de la tarea 1 codifica el comportamiento esperado
    - Cuando esta prueba pasa, confirma que el comportamiento esperado se cumple
    - Ejecutar la prueba exploratoria del bug condition del paso 1
    - **RESULTADO ESPERADO**: La prueba PASA (confirma que el bug estÃ¡ corregido)
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.3 Verificar que las pruebas de preservation siguen pasando
    - **Property 2: Preservation** - Non-Buggy Inputs Unchanged
    - **IMPORTANTE**: Re-ejecutar las MISMAS pruebas de la tarea 2 â€” NO escribir nuevas pruebas
    - Ejecutar las pruebas de preservation del paso 2
    - **RESULTADO ESPERADO**: Las pruebas PASAN (confirma que no hay regresiones)
    - Confirmar que todas las pruebas siguen pasando tras el fix (sin regresiones)

- [x] 4. Checkpoint â€” Asegurarse de que todas las pruebas pasan
  - Ejecutar la suite completa de pruebas (exploratoria + preservation)
  - Verificar manualmente en el navegador: scroll de s1 a s8, las estrellas desaparecen gradualmente y no son visibles en s3+
  - Verificar scroll hacia atrÃ¡s desde s8 a s1: las estrellas reaparecen correctamente
  - Verificar scroll hasta `#metodologia`: el fondo estelar no se mueve
  - Verificar que `prefers-reduced-motion` sigue omitiendo todo el bloque (el `if (!reduced)` no cambia)
  - Asegurarse de que todas las pruebas pasan; consultar al usuario si surgen dudas.
