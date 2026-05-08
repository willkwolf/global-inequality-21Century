# Parallax Stars Fix — Diseño Técnico

## Overview

El bug afecta exclusivamente a la función `updateScroll()` del script inline de `Escala-visual-de-riqueza-mundial.html`. Esa función se ejecuta en cada evento `scroll` y `resize`, y es la única responsable de actualizar la posición y visibilidad de `#stars`.

El fix consiste en tres cambios mínimos dentro de esa función:

1. **Reducir el factor de parallax** de `0.18` a `0.05`.
2. **Detener el `translateY`** cuando `scrollY` supera el rango de las secciones snap (8 × `vh`).
3. **Calcular la opacidad de `#stars`** en función del índice de sección: plena en s1, reducida en s2, cero desde s3 en adelante.

No se modifica ningún otro archivo ni ninguna otra función. El cambio es quirúrgico y reversible.

---

## Glossary

- **Bug_Condition (C)**: La condición que activa el bug — `sectionIndex >= 2`, es decir, el usuario está en s3 o más abajo (o en el contenido estático post-scrollytelling).
- **Property (P)**: El comportamiento correcto cuando C es verdadero — `#stars` tiene `opacity: 0` y no recibe ningún `translateY`.
- **Preservation**: El comportamiento que no debe cambiar — las estrellas visibles y con parallax en s1/s2, la animación `twinkle`, el toggle de idioma, el modo `prefers-reduced-motion`, y el redimensionado de ventana.
- **`updateScroll()`**: La función en el script inline de `Escala-visual-de-riqueza-mundial.html` (línea ~340) que se ejecuta en cada `scroll` y `resize`. Es el único punto de cambio.
- **`sectionIndex`**: `Math.floor(scrollY / vh)` — índice base 0 de la sección snap actualmente visible. s1 = 0, s2 = 1, s3 = 2, …, s8 = 7.
- **`snapScrollMax`**: `(snaps.length - 1) * vh` — el valor máximo de `scrollY` dentro del área de secciones snap. Más allá de este valor el usuario está en `#metodologia` o `footer`.
- **`starsEl`**: La referencia a `document.getElementById('stars')` ya existente en el script.

---

## Bug Details

### Bug Condition

El bug se activa cuando `sectionIndex >= 2` (s3–s8) o cuando `scrollY > snapScrollMax` (contenido estático). En ambos casos, el código actual aplica `translateY` sin restricción y no modifica la opacidad de `#stars`.

**Especificación formal:**

```
FUNCTION isBugCondition(scrollState)
  INPUT: scrollState = { scrollY, vh, snapsLength }
  OUTPUT: boolean

  sectionIndex  ← FLOOR(scrollState.scrollY / scrollState.vh)
  snapScrollMax ← (scrollState.snapsLength - 1) * scrollState.vh

  RETURN sectionIndex >= 2
         OR scrollState.scrollY > snapScrollMax
END FUNCTION
```

### Ejemplos concretos

| Situación | `scrollY` (aprox.) | `sectionIndex` | Comportamiento actual (bug) | Comportamiento esperado (fix) |
|---|---|---|---|---|
| Usuario en s3 (edificio) | `2 × vh` | 2 | `#stars` visible, `translateY(2vh × 0.18)` | `opacity: 0`, sin `translateY` |
| Usuario en s6 (silla de bar) | `5 × vh` | 5 | `#stars` visible, `translateY(5vh × 0.18)` | `opacity: 0`, sin `translateY` |
| Usuario en `#metodologia` | `> 7 × vh` | ≥ 8 | `#stars` se mueve con el scroll | `opacity: 0`, sin `translateY` |
| Usuario en s1 (espacio) | `0` | 0 | `#stars` visible, `translateY(0)` ✓ | Sin cambio (preservado) |
| Usuario en s2 (estratosfera) | `1 × vh` | 1 | `#stars` visible, `translateY(vh × 0.18)` ✓ | `opacity` reducida, `translateY` con factor ≤ 0.08 |

---

## Expected Behavior

### Preservation Requirements

**Comportamientos que no deben cambiar:**

- Las estrellas son visibles con opacidad plena cuando el usuario está en s1 (sectionIndex = 0).
- Las estrellas son visibles con opacidad reducida cuando el usuario está en s2 (sectionIndex = 1), reflejando la transición a la atmósfera.
- La animación CSS `twinkle` de las estrellas individuales no se toca (es CSS puro, no JS).
- Cuando `prefers-reduced-motion: reduce` está activo, la rama `if (!reduced)` ya omite todo el bloque de transformación — este comportamiento se preserva sin cambios.
- Al hacer scroll hacia atrás desde s3+ hacia s1/s2, la opacidad se restaura correctamente porque el cálculo es función directa de `scrollY`.
- El toggle de idioma no afecta ni es afectado por `updateScroll()`.
- Al redimensionar la ventana, `updateScroll()` se re-ejecuta con el nuevo `vh`, recalculando opacidad y posición correctamente.

**Alcance del fix:**
Solo se modifica el bloque `if (!reduced)` dentro de `updateScroll()`. Ningún otro código del archivo cambia.

---

## Hypothesized Root Cause

El código actual en `updateScroll()` es:

```javascript
if (!reduced) starsEl.style.transform = `translateY(${scrollY * 0.18}px)`;
```

Hay tres problemas independientes en esta única línea:

1. **Factor de parallax excesivo (0.18)**: Con un viewport de 800 px, al llegar a s8 (`scrollY ≈ 5600 px`) el desplazamiento es `5600 × 0.18 = 1008 px`. Eso mueve el fondo estelar más de una pantalla completa, haciéndolo perceptible como artefacto en lugar de efecto ambiental.

2. **Sin límite de `scrollY`**: La función no distingue si el usuario está dentro del área snap o en el contenido estático. El `translateY` se aplica indefinidamente mientras el usuario lee `#metodologia` y el footer.

3. **Sin control de opacidad**: La función nunca modifica `starsEl.style.opacity`. Las estrellas permanecen al 100% de opacidad en todas las secciones, incluyendo s3–s8 donde narrativamente ya no hay cielo visible.

No hay ningún problema de event listeners, selectores DOM ni timing — la causa es exclusivamente la lógica de la línea citada.

---

## Correctness Properties

Property 1: Bug Condition — Stars Hidden Below Stratosphere

_For any_ `scrollState` where `isBugCondition(scrollState)` returns true (sectionIndex ≥ 2 or scrollY > snapScrollMax), the fixed `updateScroll()` function SHALL set `starsEl.style.opacity` to `"0"` and SHALL NOT apply any `translateY` transform to `starsEl`.

**Validates: Requirements 2.1, 2.2**

Property 2: Preservation — Stars Visible and Subtle in Space Sections

_For any_ `scrollState` where `isBugCondition(scrollState)` returns false (sectionIndex < 2), the fixed `updateScroll()` function SHALL set `starsEl.style.opacity` to a value greater than `0`, SHALL apply a `translateY` transform with factor ≤ `0.08`, and SHALL produce a result consistent with the original function's intent of showing stars with parallax.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

---

## Fix Implementation

### Archivo

`Escala-visual-de-riqueza-mundial.html` — bloque `<script>` inline, función `updateScroll()`.

### Cambio único

Reemplazar la línea:

```javascript
if (!reduced) starsEl.style.transform = `translateY(${scrollY * 0.18}px)`;
```

Por el siguiente bloque:

```javascript
if (!reduced) {
  // 1. Calcular índice de sección (base 0: s1=0, s2=1, s3=2 … s8=7)
  const sectionIndex  = Math.floor(scrollY / vh);
  const snapScrollMax = (snaps.length - 1) * vh;

  // 2. Opacidad: plena en s1, reducida en s2, cero desde s3 en adelante
  let starsOpacity;
  if (sectionIndex === 0) {
    starsOpacity = 1;
  } else if (sectionIndex === 1) {
    // Transición suave dentro de s2: de 1 a 0 según el progreso dentro de la sección
    const progressInS2 = (scrollY - vh) / vh;          // 0 al entrar en s2, 1 al salir
    starsOpacity = Math.max(0, 1 - progressInS2);
  } else {
    starsOpacity = 0;
  }
  starsEl.style.opacity = starsOpacity;

  // 3. Parallax: solo dentro del área snap y con factor reducido
  if (scrollY <= snapScrollMax) {
    starsEl.style.transform = `translateY(${scrollY * 0.05}px)`;
  }
  // Si scrollY > snapScrollMax, no se aplica ningún translateY adicional
  // (el transform queda en el último valor calculado dentro del área snap)
}
```

### Detalle de cada cambio

| # | Cambio | Motivo |
|---|---|---|
| 1 | Factor `0.18` → `0.05` | Cumple el requisito 2.3 (≤ 0.08). A 5600 px de scroll el desplazamiento es 280 px, sutil y ambiental. |
| 2 | `starsOpacity = 1` cuando `sectionIndex === 0` | Preserva el comportamiento actual en s1 (requisito 3.1). |
| 3 | `starsOpacity` interpolado en s2 | Transición suave hacia cero al salir de la estratosfera (requisito 3.2). |
| 4 | `starsOpacity = 0` cuando `sectionIndex >= 2` | Cumple el requisito 2.1. |
| 5 | `translateY` solo si `scrollY <= snapScrollMax` | Cumple el requisito 2.2: sin movimiento en `#metodologia` ni footer. |

### Pseudocódigo de la función corregida

```
FUNCTION getStarsOpacity'(scrollState)
  sectionIndex ← FLOOR(scrollState.scrollY / scrollState.vh)
  IF sectionIndex = 0 THEN RETURN 1
  IF sectionIndex = 1 THEN
    progressInS2 ← (scrollState.scrollY - scrollState.vh) / scrollState.vh
    RETURN MAX(0, 1 - progressInS2)
  ELSE RETURN 0
END FUNCTION

FUNCTION getParallaxFactor'(scrollState)
  snapScrollMax ← (scrollState.snapsLength - 1) * scrollState.vh
  IF scrollState.scrollY <= snapScrollMax THEN RETURN 0.05
  ELSE RETURN 0   // sin translateY adicional
END FUNCTION
```

---

## Testing Strategy

### Validation Approach

La estrategia sigue dos fases: primero ejecutar las pruebas sobre el código **sin corregir** para confirmar el root cause, luego ejecutarlas sobre el código **corregido** para verificar fix y preservation.

---

### Exploratory Bug Condition Checking

**Goal**: Demostrar el bug en el código actual antes de aplicar el fix. Confirmar o refutar el root cause.

**Test Plan**: Simular llamadas a `updateScroll()` con distintos valores de `scrollY` y verificar el estado resultante de `starsEl.style.opacity` y `starsEl.style.transform`.

**Test Cases**:

1. **s3 visible (sectionIndex = 2)**: `scrollY = 2 * vh` → en código sin fix, `starsEl.style.opacity` no es `"0"` (falla esperada).
2. **s8 visible (sectionIndex = 7)**: `scrollY = 7 * vh` → en código sin fix, `starsEl.style.opacity` no es `"0"` (falla esperada).
3. **Post-snap (metodología)**: `scrollY = 9 * vh` → en código sin fix, `starsEl.style.transform` contiene un `translateY` no nulo (falla esperada).
4. **Factor de parallax en s1**: `scrollY = 0.5 * vh` → en código sin fix, el factor extraído del transform es `0.18`, no ≤ `0.08` (falla esperada).

**Expected Counterexamples**:
- `starsEl.style.opacity` permanece vacío o en su valor inicial en todas las secciones.
- El factor de parallax extraído del `transform` es `0.18` en lugar de ≤ `0.08`.

---

### Fix Checking

**Goal**: Verificar que para todas las posiciones donde `isBugCondition` es verdadero, el código corregido produce el comportamiento esperado.

**Pseudocode:**

```
FOR ALL scrollState WHERE isBugCondition(scrollState) DO
  result ← updateScroll_fixed(scrollState)
  ASSERT starsEl.style.opacity = "0"
  ASSERT starsEl.style.transform no contiene translateY > 0 nuevo
END FOR
```

**Test Cases**:

1. `scrollY = 2 * vh` (s3) → `opacity === "0"`.
2. `scrollY = 5 * vh` (s6) → `opacity === "0"`.
3. `scrollY = 7 * vh` (s8) → `opacity === "0"`.
4. `scrollY = 9 * vh` (metodología) → `opacity === "0"`, sin nuevo `translateY`.

---

### Preservation Checking

**Goal**: Verificar que para posiciones donde `isBugCondition` es falso (s1 y s2), el código corregido mantiene las estrellas visibles y el parallax activo con factor reducido.

**Pseudocode:**

```
FOR ALL scrollState WHERE NOT isBugCondition(scrollState) DO
  ASSERT getStarsOpacity'(scrollState) > 0
  ASSERT getParallaxFactor'(scrollState) <= 0.08
  ASSERT getParallaxFactor'(scrollState) > 0
END FOR
```

**Testing Approach**: Property-based testing es adecuado aquí porque el dominio de `scrollY` en s1 y s2 es continuo (`[0, 2*vh)`). Generar valores aleatorios en ese rango garantiza cobertura de edge cases (inicio de s2, final de s2, etc.).

**Test Cases**:

1. **s1 plena**: `scrollY = 0` → `opacity === "1"`, factor = `0.05`.
2. **s1 mitad**: `scrollY = 0.5 * vh` → `opacity === "1"`, factor = `0.05`.
3. **s2 inicio**: `scrollY = vh` → `opacity` cercana a `1` (inicio de transición).
4. **s2 mitad**: `scrollY = 1.5 * vh` → `opacity ≈ 0.5`.
5. **s2 final**: `scrollY = 1.99 * vh` → `opacity` cercana a `0` pero > `0`.
6. **Scroll hacia atrás**: Simular `scrollY` descendiendo de `3 * vh` a `0.5 * vh` → `opacity` vuelve a `1`.
7. **Resize**: Cambiar `vh` y re-ejecutar → los índices se recalculan correctamente.

---

### Unit Tests

- Verificar `starsEl.style.opacity === "0"` para cada sectionIndex de 2 a 7.
- Verificar `starsEl.style.opacity === "1"` cuando `scrollY = 0`.
- Verificar que el factor de parallax extraído del `transform` es `0.05` en s1.
- Verificar que no se aplica `translateY` cuando `scrollY > snapScrollMax`.
- Verificar que `prefers-reduced-motion` sigue omitiendo todo el bloque (el `if (!reduced)` no cambia).

### Property-Based Tests

- Generar `scrollY` aleatorio en `[0, vh)` (s1) → `opacity` siempre `1`, factor siempre `0.05`.
- Generar `scrollY` aleatorio en `[vh, 2*vh)` (s2) → `opacity` siempre en `(0, 1]`, factor siempre `0.05`.
- Generar `scrollY` aleatorio en `[2*vh, 8*vh]` (s3–s8) → `opacity` siempre `0`.
- Generar `scrollY` aleatorio en `(8*vh, ∞)` (post-snap) → `opacity` siempre `0`, sin nuevo `translateY`.
- Generar `vh` aleatorio (simulando resize) → los umbrales se recalculan proporcionalmente.

### Integration Tests

- Scroll completo de s1 a s8 en el navegador: verificar que las estrellas desaparecen gradualmente y no son visibles en s3+.
- Scroll hacia atrás desde s8 a s1: verificar que las estrellas reaparecen correctamente.
- Scroll hasta `#metodologia`: verificar que el fondo estelar no se mueve.
- Toggle de idioma en s5: verificar que la opacidad de `#stars` no cambia.
- Resize de ventana en s4: verificar que la opacidad sigue siendo `0` tras el resize.
