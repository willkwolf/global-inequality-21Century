/**
 * src/domain/domain-definition.js
 * 
 * DOMINIO DEL PROYECTO:
 * Sistema de visualización pedagógica basado en una abstracción conceptual fundamental:
 * CONVERTIR UN FENÓMENO COMPLEJO EN UNA ESCALA VISUAL FÍSICA/ESPACIAL COMPRENSIBLE.
 * 
 * PRINCIPIO DE ESTABILIDAD DE LA ABSTRACCIÓN:
 * DATA DRIFT ≠ ABSTRACTION FAILURE.
 * 
 * El sistema distingue 6 dimensiones ontológicas:
 * 1. ABSTRACCIÓN: Metáfora espacial (altura física vs. magnitud económica) mediante scrollytelling.
 * 2. IMPLEMENTACIÓN: Código JS/CSS, DOM, observadores, parallax, compilador.
 * 3. DATOS: Valores empíricos crudos y canónicos de riqueza, población y percentiles.
 * 4. COPY: Textos, titulares, subtítulos, etiquetas y explicaciones bilingües.
 * 5. METODOLOGÍA: Definiciones operativas (patrimonio neto, adulto, PPP, fuentes).
 * 6. ARTEFACTO VISUAL: SVG, paleta de colores, iconos, tipografía, layout responsivo.
 */

export const DOMAIN_DEFINITION = {
  name: "Sistema de Visualización Pedagógica de Desigualdad de Riqueza",
  metaphor: "Escala física vertical (¿A qué altura vives?)",
  baseline_equivalence: {
    usd_amount: 8000,
    physical_height_meters: 0.15, // 15 cm = 1 escalón estándar
    concept: "La mediana mundial de riqueza (~$9,000 USD) equivale aproximadamente a un escalón (~17 cm)."
  },
  pedagogical_stages: [
    { stage: "BASE", role: "Suelo / Anclaje tangible cotidiano", min_pct: 0, max_pct: 50 },
    { stage: "ESCALA", role: "Mediana / Punto medio de referencia poblacional", min_pct: 45, max_pct: 55 },
    { stage: "CONTRASTE", role: "Clase media y mayorías / Diferenciación arquitectónica", min_pct: 55, max_pct: 95 },
    { stage: "CONTEXTO", role: "Millonarios / Infraestructura urbana visible", min_pct: 95, max_pct: 99.9 },
    { stage: "EXTREMO", role: "Billonarios y cúspide / Atmósfera, estratosfera y órbita espacial", min_pct: 99.9, max_pct: 100 }
  ],
  drift_types: {
    DATA_DRIFT: "Cambio numérico en valores, rangos, máximos o distribución.",
    SEMANTIC_DRIFT: "Cambio en la nomenclatura, significado de términos o etiquetas.",
    METHODOLOGICAL_DRIFT: "Cambio en la forma de medición o cálculo (ruptura de serie).",
    DOMAIN_DRIFT: "Cambio estructural del fenómeno social o económico subyacente.",
    CONCEPTUAL_DRIFT: "Cambio que cuestiona o desafía la validez de la metáfora espacial."
  }
};

export function validatePedagogicalProgression(strata) {
  if (!Array.isArray(strata) || strata.length < 3) {
    return { valid: false, reason: "Se requieren al menos 3 estratos para sostener la narrativa pedagógica." };
  }
  // Verificar orden monótono decreciente de alturas
  for (let i = 0; i < strata.length - 1; i++) {
    const current = strata[i].physical_analogy?.height_meters ?? strata[i].height_meters;
    const next = strata[i + 1].physical_analogy?.height_meters ?? strata[i + 1].height_meters;
    if (current <= next) {
      return { 
        valid: false, 
        reason: `Violación de monotonicidad: estrato ${i} (${current}m) no es estrictamente mayor que estrato ${i+1} (${next}m).` 
      };
    }
  }
  return { valid: true };
}
