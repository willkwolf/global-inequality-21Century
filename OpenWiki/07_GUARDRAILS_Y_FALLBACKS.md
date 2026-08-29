# 07. Guardrails y Protocolo de Fallback Humano

## 1. El Principio Ético-Epistemológico

> **AUTOMATIZAR LA ADAPTACIÓN $\neq$ AUTOMATIZAR LA VERDAD.**
> 
> El agente puede adaptar la representación matemática y visual.
> Pero la evidencia empírica determina si la representación sigue siendo pedagógica y epistemológicamente válida.

Si los datos desafían la lógica del fenómeno, **el sistema prefiere detener una publicación** antes que publicar una visualización estéticamente atractiva pero conceptualmente falsa o engañosa.

---

## 2. Guardrails Previos a la Adaptación (Pre-Checks)

El sistema detiene el flujo y emite `ADAPTATION_FAILED` si:
1. **Mediana no positiva ($\text{Mediana} \le 0$):** Si la mediana es negativa (deuda masiva generalizada), la metáfora de altura sobre el suelo colapsa.
2. **Cúspide inválida ($\text{Apex} \le 0$ o NaN):** La cúspide no puede anclarse en el espacio superior.
3. **Población inválida ($\text{Población} \le 0$):** Imposibilita calcular proporciones relativas ("3 de cada 10 millones").
4. **Estratos insuficientes ($N < 3$):** No permite construir una progresión narrativa con contraste.
5. **Ruptura criptográfica de procedencia:** Hash de origen no coincide con el payload crudo descargado.

---

## 3. Guardrails Posteriores a la Adaptación (Post-Checks)

Una vez generada la propuesta de adaptación, se verifica:
1. **Monotonicidad Estricta:** $\text{Altura}(s_1) > \text{Altura}(s_2) > \dots > \text{Altura}(s_N)$.
2. **Límite Cognitivo de Estratos:** $3 \le N \le 15$.
3. **Integridad de Textos:** Cero cadenas corruptas (`undefined`, `NaN`, `[object Object]`).
4. **Bilingüismo Total:** 100% de paridad léxica entre ES y EN.

---

## 4. Protocolo de Fallback y Revisión Humana

Cuando se dispara `ADAPTATION_FAILED`:
1. **Bloqueo Inmediato:** El pipeline CI/CD cancela la etapa de despliegue a GitHub Pages.
2. **Generación de Reporte:** Se emite un informe estructurado detallando:
   - Qué cambió en los datos de entrada.
   - Por qué desafía la abstracción de altura física.
   - Qué información falta o qué transformación no pudo completarse.
3. **Registro en OpenWiki:** Se crea un asiento en `OpenWiki/11_ARCHITECTURAL_WARNINGS.md`.
4. **Notificación:** Se solicita intervención humana formal para decidir si se introduce una nueva abstracción o se ajusta la metodología.
