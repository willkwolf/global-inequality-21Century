# 02. Contrato de Abstracción

## 1. Desacoplamiento Total entre Datos y Presentación

El componente visual y el motor de renderizado HTML **no conocen** proveedores externos ni instancias particulares:
- No conocen *Forbes*.
- No conocen *Bloomberg*.
- No conocen a *Elon Musk* ni a ninguna persona específica.
- No conocen URLs estáticas de terceros.
- No asumen un número fijo de 8 estratos.

El motor visual únicamente conoce **conceptos abstractos normalizados**:
- `metric`: La magnitud económica medida (ej. "net_worth").
- `population`: Número total de individuos representados.
- `percentile` / `rank`: Posición en la distribución (ej. p50, top 0.01%).
- `threshold`: Umbrales mínimos y máximos de la capa.
- `scale`: Factor de conversión física (metros por unidad monetaria).
- `unit`: Unidades de medida (`USD`, `km`, `m`, `cm`).
- `reference`: Objeto físico analógico asignado según altura calculada.
- `label`: Textos y etiquetas bilingües descriptivas.
- `narrative`: Título, subtítulo, captions y anuncios accesibles (ARIA).

---

## 2. Flujo de Transformación Conceptual

```
RAW SOURCES (UBS, WID, Forbes, World Bank)
    ↓
SOURCE ADAPTERS (Cálculo de hash SHA-256 de procedencia)
    ↓
CANONICAL DATA MODEL (Normalización agnóstica a proveedores)
    ↓
DRIFT ENGINE (Detección de Data, Semantic, Methodological, Domain, Conceptual Drift)
    ↓
AI ADAPTATION AGENT (Gemini 1.5 Pro / Motor Determinista de Respaldo)
    ↓
ABSTRACTION CONTRACT (Documento formal tipado)
    ↓
STORY MODEL (Estructuras de presentación y diccionarios i18n)
    ↓
HTML COMPILER & RENDERER (Inyección limpia y generación de secciones snap y nav dots)
    ↓
TESTS & VALIDATION GATES (Unit, 3 Scenarios, PBT)
    ↓
GITHUB PAGES & OPENWIKI GOVERNANCE LEDGER
```

---

## 3. Especificación Formal del Documento de Abstracción

```typescript
interface AbstractionDocument {
  contract_version: "2.0.0";
  title_es: string;
  title_en: string;
  subtitle_es: string;
  subtitle_en: string;
  semantic_concept_es: string;
  semantic_concept_en: string;
  scale_formula: {
    unit_value_usd: number;        // ej. 8000 USD
    step_height_meters: number;    // ej. 0.15 m
  };
  max_height_meters: number;       // Altura máxima alcanzada en la cúspide
  layers: Array<{
    layer_id: string;              // "s1", "s2", ..., "sN"
    pedagogical_role: "BASE" | "ESCALA" | "CONTRASTE" | "CONTEXTO" | "EXTREMO";
    raw_magnitude: number;
    magnitude_unit: "USD";
    physical_height_meters: number;
    formatted_height_label: string; // "15,731 km", "17 cm"
    population_share_percentage: number;
    physical_reference: {
      name_es: string;
      name_en: string;
      svg_icon: string;
    };
    narrative: {
      headline_es: string;
      headline_en: string;
      caption_es: string;
      caption_en: string;
      aria_es: string;
      aria_en: string;
    };
  }>;
  provenance: {
    dataset_id: string;
    sources: Array<SourceMetadata>;
    summary_es: string;
    summary_en: string;
    date_label_es: string;
    date_label_en: string;
  };
}
```
