# 01. Dominio y Abstracción Conceptual

## 1. Definición Explícita del Dominio

Este proyecto no es:
- Un scraper o crawler web.
- Un dashboard corporativo genérico.
- Un repositorio estático de datasets.
- Un visualizador genérico con gráficos de barras o tortas.

**Es un sistema de visualización pedagógica basado en una abstracción conceptual fundamental:**

> **CONVERTIR UN FENÓMENO COMPLEJO (DESIGUALDAD ECONÓMICA DE RIQUEZA) EN UNA ESCALA VISUAL FÍSICA Y ESPACIAL COMPRENSIBLE PARA CUALQUIER SER HUMANO.**

La implementación actual materializa esta idea mediante la pregunta:
**"¿A qué altura vives?"**

---

## 2. Las Seis Dimensiones Ontológicas del Proyecto

Para evitar confusiones entre código, datos y conceptos, el sistema define con total rigidez qué constituye cada elemento:

| Dimensión | Definición | Mutabilidad |
|---|---|---|
| **1. ABSTRACCIÓN** | La metáfora espacial: la riqueza convertida en altura física (1 escalón cotidiano $\approx$ mediana global) comunicada mediante scrollytelling progresivo. | **Inmutable** (salvo evidencia de quiebre epistemológico). |
| **2. IMPLEMENTACIÓN** | El código JavaScript (IntersectionObserver, scroll snapping, parallax condicional), CSS responsivo, JSDOM y scripts de Node.js. | **Mutable** (se optimiza y refactoriza según buenas prácticas web). |
| **3. DATOS** | Los valores numéricos crudos y canónicos: mediana, medias, percentiles, número de adultos y billonarios. | **Dinámicos** (cambian periódicamente con cada nuevo informe de UBS, WID, Forbes, etc.). |
| **4. COPY** | Textos, titulares, subtítulos, explicaciones bilingües (ES/EN) y etiquetas de accesibilidad. | **Dinámico** (se adapta semánticamente subordinado a la evidencia sin alucinar). |
| **5. METODOLOGÍA** | Las definiciones operativas: concepto de patrimonio neto, unidad monetaria (USD nominal vs. USD PPP), criterios de muestreo de adultos. | **Evolutivo** (requiere versionado y registro de rupturas de serie). |
| **6. ARTEFACTO VISUAL** | Elementos SVG, iconos, paletas de colores de la atmósfera/espacio, tipografía fluida `clamp()`. | **Adaptativo** (refleja las entidades y magnitudes calculadas). |

---

## 3. Principio de Estabilidad de la Abstracción

### Regla Arquitectónica:
$$\text{DATA DRIFT} \neq \text{ABSTRACTION FAILURE}$$

El sistema está diseñado para tolerar:
- Cambios de magnitudes monetarias (ej. inflación, crecimiento de la cúspide de $700B a $2T USD).
- Cambios de percentiles y distribución poblacional.
- Cambios de entidades en la cúspide (individuos, corporaciones, fondos soberanos, estados).
- Cambios metodológicos (nominal vs. PPP).
- Cambios en la cantidad de estratos (de 8 a 6, 7 o 10 estratos).

Los agentes de IA deben **adaptar los nuevos datos a la abstracción existente**, nunca destruir la abstracción para encajar el dataset.

---

## 4. Progresión Narrativa Pedagógica

Toda representación generada por el sistema debe respetar la secuencia de 5 estadios:

```
[BASE]      ──> Suelo / Anclaje cotidiano tangible (guijarro, centavos).
  ↓
[ESCALA]    ──> Mediana / El escalón patrón accesible (~15 cm).
  ↓
[CONTRASTE] ──> Clase media y mayoría / Casas residenciales y sillas.
  ↓
[CONTEXTO]  ──> Millonarios / Edificios urbanos y rascacielos.
  ↓
[EXTREMO]   ──> Billonarios y Cúspide / Estratosfera y órbita espacial.
```
