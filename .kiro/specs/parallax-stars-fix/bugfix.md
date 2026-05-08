# Bugfix Requirements Document

## Introduction

El efecto parallax de las estrellas (`#stars`) rompe la coherencia narrativa del scrollytelling en `Escala-visual-de-riqueza-mundial.html`. La narrativa visual lleva al usuario desde el espacio exterior (s1, 15 731 km) hasta el suelo (s8, 3.3 cm), pero el fondo de estrellas permanece visible y en movimiento durante toda la experiencia, incluyendo secciones que representan la atmósfera baja, la superficie terrestre y el contenido estático posterior al scrollytelling. Esto hace que el elemento ambiental se perciba como un artefacto visual en lugar de reforzar la narrativa.

El bug tiene tres manifestaciones concretas:
1. Las estrellas son visibles en secciones que narrativamente están en la tropósfera o en el suelo (s3–s8).
2. El parallax `translateY` sigue activo mientras el usuario lee `#metodologia` y el footer.
3. La intensidad del efecto (factor `0.18` sobre `scrollY`) es demasiado perceptible.

---

## Bug Analysis

### Current Behavior (Defect)

1.1 CUANDO el usuario hace scroll hasta las secciones s3 (edificio, 70.8 m), s4 (escalera, 18.75 m), s5 (casa, 5.5 m), s6 (silla de bar, 68 cm), s7 (escalón, 17 cm) o s8 (roca, 3.3 cm) ENTONCES el sistema muestra el fondo de estrellas con opacidad completa, contradiciendo la narrativa que ya se encuentra en la atmósfera baja o en el suelo.

1.2 CUANDO el usuario hace scroll hasta la sección `#metodologia` o el `footer` ENTONCES el sistema continúa aplicando `translateY` al elemento `#stars` en cada evento de scroll, moviendo el fondo estelar detrás del contenido estático.

1.3 CUANDO el usuario observa el fondo de estrellas durante el scrollytelling ENTONCES el sistema aplica un desplazamiento parallax con factor `0.18 × scrollY` que resulta en un movimiento demasiado pronunciado y perceptible como artefacto visual.

---

### Expected Behavior (Correct)

2.1 CUANDO el usuario hace scroll hasta las secciones s3–s8 ENTONCES el sistema SHALL reducir progresivamente la opacidad de `#stars` hasta cero, de modo que las estrellas desaparezcan gradualmente a medida que la narrativa desciende de la estratosfera a la superficie terrestre.

2.2 CUANDO el usuario hace scroll hasta `#metodologia` o el `footer` ENTONCES el sistema SHALL mantener `#stars` con opacidad cero y sin aplicar ninguna transformación `translateY`, evitando cualquier movimiento del fondo estelar en esas secciones.

2.3 CUANDO el usuario observa el fondo de estrellas en las secciones s1 y s2 ENTONCES el sistema SHALL aplicar un factor de parallax reducido (≤ `0.08 × scrollY`) que produzca un movimiento sutil y ambiental, no un desplazamiento notorio.

---

### Unchanged Behavior (Regression Prevention)

3.1 CUANDO el usuario está en la sección s1 (Elon Musk, espacio exterior) ENTONCES el sistema SHALL CONTINUE TO mostrar el fondo de estrellas con opacidad plena y el efecto de parpadeo (`twinkle`) activo.

3.2 CUANDO el usuario está en la sección s2 (billonarios, estratosfera alta) ENTONCES el sistema SHALL CONTINUE TO mostrar el fondo de estrellas, aunque con opacidad reducida respecto a s1, reflejando la transición hacia la atmósfera.

3.3 CUANDO `prefers-reduced-motion: reduce` está activo ENTONCES el sistema SHALL CONTINUE TO omitir todas las animaciones y transformaciones de `#stars`, sin cambios respecto al comportamiento actual.

3.4 CUANDO el usuario hace scroll hacia atrás desde secciones inferiores hacia s1 o s2 ENTONCES el sistema SHALL CONTINUE TO restaurar la visibilidad de las estrellas de forma coherente con la posición de scroll.

3.5 CUANDO el usuario cambia el idioma mediante el botón de toggle ENTONCES el sistema SHALL CONTINUE TO mantener el estado visual de `#stars` sin reiniciar ni alterar la opacidad o posición actuales.

3.6 CUANDO el usuario redimensiona la ventana ENTONCES el sistema SHALL CONTINUE TO recalcular correctamente la opacidad y posición de `#stars` en función del nuevo tamaño de viewport.

---

## Bug Condition

**Bug Condition Function:**

```pascal
FUNCTION isBugCondition(scrollState)
  INPUT: scrollState = { scrollY, totalScrollHeight, viewportHeight }
  OUTPUT: boolean

  // El bug se activa cuando el scroll ha superado el umbral de s2
  // (es decir, el usuario ya pasó la estratosfera y está en s3 o más abajo)
  // O cuando el usuario está en el contenido estático post-scrollytelling
  sectionIndex ← FLOOR(scrollState.scrollY / scrollState.viewportHeight)
  RETURN sectionIndex >= 2   // s3 en adelante (índice base 0: s1=0, s2=1, s3=2…)
END FUNCTION
```

**Property: Fix Checking**

```pascal
// Para todas las posiciones de scroll que activan el bug:
FOR ALL scrollState WHERE isBugCondition(scrollState) DO
  opacity ← getStarsOpacity'(scrollState)
  parallaxFactor ← getParallaxFactor'(scrollState)
  ASSERT opacity = 0
  ASSERT parallaxFactor = 0
END FOR
```

**Property: Preservation Checking**

```pascal
// Para posiciones de scroll que NO activan el bug (s1 y s2):
FOR ALL scrollState WHERE NOT isBugCondition(scrollState) DO
  ASSERT getStarsOpacity'(scrollState) > 0
  ASSERT getStarsOpacity(scrollState) ≈ getStarsOpacity'(scrollState)  // transición suave
  ASSERT getParallaxFactor'(scrollState) ≤ 0.08
END FOR
```
