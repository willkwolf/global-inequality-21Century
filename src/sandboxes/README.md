# src/sandboxes — Sandboxes Aislados Challenger (Fases 3 y 4)

## Propósito
Este módulo provee entornos de ejecución aislados en memoria para evaluar candidatos **Challenger** frente al **Champion** de producción:

1. **Aislamiento Total:** Ninguna prueba sintética o simulación adversarial tiene acceso de escritura a los artefactos de producción (`OpenWiki/spec/data.json` o `Escala-visual-de-riqueza-mundial.html`).
2. **Evaluación de Resiliencia:** Ejecución de suites sintéticas de Monte Carlo (25 iteraciones) sobre copias clonadas en RAM mediante `JSDOM` y `VirtualConsole`.
3. **Criterio de Promoción:** Un Challenger sólo es promovido a Champion si supera el 100% de los tests determinísticos y cuenta con aprobación humana según el nivel de riesgo.
