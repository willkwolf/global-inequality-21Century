# Implementation Plan

- [x] 1. Escribir prueba exploratoria del bug condition (ANTES del fix)
  - **Property 1: Bug Condition** - Stars Visible Below Stratosphere
  - **CRÍTICO**: Esta prueba DEBE FALLAR en el código sin fix — el fallo confirma que el bug existe
  - **NO intentar corregir la prueba ni el código cuando falle**
  - **NOTA**: Esta prueba codifica el comportamiento esperado — validará el fix cuando pase tras la implementación
  - **OBJETIVO**: Obtener contraejemplos que demuestren que el bug existe
  - **Enfoque PBT acotado**: Para bugs deterministas, acotar la propiedad a los casos concretos de fallo para garantizar reproducibilidad
  - Simular llamadas a `updateScroll()` con un DOM mínimo (stub de `#stars`, `#progress`, `.snap` × 8) en un entorno de prueba (jsdom o similar)
  - Probar que para `scrollY = 2 * vh` (s3, `sectionIndex = 2`): `starsEl.style.opacity` NO es `"0"` en código sin fix (fallo esperado)
  - Probar que para `scrollY = 5 * vh` (s6, `sectionIndex = 5`): `starsEl.style.opacity` NO es `"0"` en código sin fix (fallo esperado)
  - Probar que para `scrollY = 9 * vh` (post-snap, metodología): `starsEl.style.transform` contiene un `translateY` no nulo en código sin fix (fallo esperado)
  - Probar que el factor de parallax extraído del `transform` en s1 (`scrollY = 0.5 * vh`) es `0.18`, no ≤ `0.08` (fallo esperado)
  - Ejecutar la prueba en código SIN fix
  - **RESULTADO ESPERADO**: La prueba FALLA (esto es correcto — prueba que el bug existe)
  - Documentar los contraejemplos encontrados (p. ej. `starsEl.style.opacity` vacío en s3, factor `0.18` en s1)
  - Marcar la tarea como completa cuando la prueba esté escrita, ejecutada y el fallo documentado
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Escribir pruebas de preservation (ANTES del fix)
  - **Property 2: Preservation** - Stars Visible and Subtle in Space Sections
  - **IMPORTANTE**: Seguir la metodología observation-first
  - Observar el comportamiento en código SIN fix para entradas no-buggy (`sectionIndex < 2`, es decir `scrollY < 2 * vh`)
  - Observar: en `scrollY = 0` (s1), `starsEl.style.opacity` está vacío o en su valor inicial (las estrellas son visibles)
  - Observar: en `scrollY = 0.5 * vh` (s1), el transform contiene `translateY(${0.5 * vh * 0.18}px)` — las estrellas se mueven
  - Escribir prueba PBT: para todo `scrollY` en `[0, vh)` (s1), la opacidad resultante tras el fix debe ser `"1"` y el factor de parallax `0.05`
  - Escribir prueba PBT: para todo `scrollY` en `[vh, 2*vh)` (s2), la opacidad resultante tras el fix debe ser `> 0` y `≤ 1`, y el factor de parallax `0.05`
  - Verificar que estas pruebas PASAN en código SIN fix (confirman el comportamiento base a preservar)
  - **RESULTADO ESPERADO**: Las pruebas PASAN en código sin fix (confirma la línea base de comportamiento)
  - Marcar la tarea como completa cuando las pruebas estén escritas, ejecutadas y pasando en código sin fix
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 3. Fix: reemplazar lógica de parallax en `updateScroll()`

  - [x] 3.1 Implementar el fix en `Escala-visual-de-riqueza-mundial.html`
    - Localizar la línea `if (!reduced) starsEl.style.transform = \`translateY(${scrollY * 0.18}px)\`;` dentro de `updateScroll()` (aprox. línea 340)
    - Reemplazarla por el bloque de ~12 líneas del diseño:
      1. Calcular `sectionIndex = Math.floor(scrollY / vh)` y `snapScrollMax = (snaps.length - 1) * vh`
      2. Calcular `starsOpacity`: `1` si `sectionIndex === 0`; interpolación `Math.max(0, 1 - (scrollY - vh) / vh)` si `sectionIndex === 1`; `0` en cualquier otro caso
      3. Asignar `starsEl.style.opacity = starsOpacity`
      4. Aplicar `starsEl.style.transform = \`translateY(${scrollY * 0.05}px)\`` solo si `scrollY <= snapScrollMax`
    - _Bug_Condition: `isBugCondition(s)` donde `FLOOR(s.scrollY / s.vh) >= 2` o `s.scrollY > snapScrollMax`_
    - _Expected_Behavior: `starsEl.style.opacity === "0"` y sin nuevo `translateY` para todo estado que satisfaga `isBugCondition`_
    - _Preservation: opacidad `> 0` y factor de parallax `≤ 0.08` para `sectionIndex < 2`_
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2_

  - [x] 3.2 Verificar que la prueba exploratoria del bug condition ahora pasa
    - **Property 1: Expected Behavior** - Stars Hidden Below Stratosphere
    - **IMPORTANTE**: Re-ejecutar la MISMA prueba de la tarea 1 — NO escribir una nueva prueba
    - La prueba de la tarea 1 codifica el comportamiento esperado
    - Cuando esta prueba pasa, confirma que el comportamiento esperado se cumple
    - Ejecutar la prueba exploratoria del bug condition del paso 1
    - **RESULTADO ESPERADO**: La prueba PASA (confirma que el bug está corregido)
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.3 Verificar que las pruebas de preservation siguen pasando
    - **Property 2: Preservation** - Non-Buggy Inputs Unchanged
    - **IMPORTANTE**: Re-ejecutar las MISMAS pruebas de la tarea 2 — NO escribir nuevas pruebas
    - Ejecutar las pruebas de preservation del paso 2
    - **RESULTADO ESPERADO**: Las pruebas PASAN (confirma que no hay regresiones)
    - Confirmar que todas las pruebas siguen pasando tras el fix (sin regresiones)

- [x] 4. Checkpoint — Asegurarse de que todas las pruebas pasan
  - Ejecutar la suite completa de pruebas (exploratoria + preservation)
  - Verificar manualmente en el navegador: scroll de s1 a s8, las estrellas desaparecen gradualmente y no son visibles en s3+
  - Verificar scroll hacia atrás desde s8 a s1: las estrellas reaparecen correctamente
  - Verificar scroll hasta `#metodologia`: el fondo estelar no se mueve
  - Verificar que `prefers-reduced-motion` sigue omitiendo todo el bloque (el `if (!reduced)` no cambia)
  - Asegurarse de que todas las pruebas pasan; consultar al usuario si surgen dudas.
