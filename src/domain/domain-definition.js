/**
 * src/domain/domain-definition.js
 * 
 * DOMINIO CONCEPTUAL Y CONTRATO PEDAGÓGICO DE LA ABSTRACCIÓN
 * 
 * Unidad de análisis inmutable:
 * EXCLUSIVAMENTE PERSONAS NATURALES (ADULTOS).
 * Se prohíbe la inclusión o comparación con personas jurídicas, estados,
 * organizaciones, fundaciones o fondos soberanos.
 */

export const DOMAIN_DEFINITION = {
  domain_name: "Visualización Pedagógica de la Desigualdad Global de Riqueza",
  epistemological_mission: "Traducir magnitudes abstractas de desigualdad económica entre personas naturales en distancias físicas perceptibles.",
  analysis_unit: {
    type: "PERSONA_NATURAL",
    definition: "Individuo adulto (>= 20 años). Quedan expresamente excluidas entidades jurídicas, empresas, fundaciones, corporaciones, fondos soberanos y estados soberanos.",
    inclusions: [
      "Patrimonio financiero individual (cuentas, acciones a título personal)",
      "Patrimonio no financiero individual (inmuebles privados, terrenos)",
      "Derechos de pensión privada acumulados",
      "Activos tangibles personales"
    ],
    exclusions: [
      "Patrimonio o activos corporativos no pertenecientes a título individual",
      "Capitalización bursátil de personas jurídicas",
      "Fondos de riqueza soberana y activos estatales",
      "Producto Interno Bruto (PIB) o presupuesto público",
      "Deuda pública"
    ],
    currency_basis: "USD nominal o USD PPP según especificación de serie temporal",
    valuation_rule: "Valor neto de mercado deducidas las deudas y pasivos personales"
  },
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
    CONCEPTUAL_DRIFT: "Cambio que cuestiona o desafía la validez de la unidad de análisis o de la metáfora espacial."
  }
};

/**
 * Filtro ontológico y clasificador de entidades
 * ENTITY -> CLASSIFY -> NATURAL PERSON? -> YES -> INCLUDE; NO -> EXCLUDE; UNKNOWN -> WARNING/EXCLUDE
 */
export class EntityFilter {
  static KNOWN_NON_PERSON_PATTERNS = [
    /\bfund\b/i, /\bsovereign\b/i, /\bholding(s)?\b/i, /\bcorp(\.|\b)/i, /\binc(\.|\b)/i, /\bltd(\.|\b)/i, /\bllc\b/i, /\bs\.?a\.?\b/i,
    /\bgobierno\b/i, /\bgovernment\b/i, /\bstate\b/i, /\bestado\b/i, /\bbanco central\b/i, /\bcentral bank\b/i,
    /\bfoundation\b/i, /\bfundaci[oó]n\b/i, /\borganization\b/i, /\borganizaci[oó]n\b/i, /\btrust\b/i, /\bgroup\b/i,
    /\bpib\b/i, /\bgdp\b/i, /\bkingdom\b/i, /\breino\b/i, /\brep[uú]blica\b/i, /\brepublic\b/i
  ];

  /**
   * Clasifica una entidad y determina si es una Persona Natural admisible.
   * @param {Object|string} entity
   * @returns {Object} { is_natural_person: boolean, classification: string, action: string, reason: string }
   */
  static classifyEntity(entity) {
    if (!entity) {
      return {
        is_natural_person: false,
        classification: "UNKNOWN",
        action: "EXCLUDE",
        reason: "Entidad nula o no definida."
      };
    }

    const name = typeof entity === 'string' ? entity : (entity.name || entity.name_es || entity.name_en || "");
    const declaredType = typeof entity === 'object' ? (entity.type || "") : "";

    // 1. Si el tipo explícito es no-persona
    if (declaredType && declaredType !== 'person' && declaredType !== 'natural_person' && declaredType !== 'individual') {
      return {
        is_natural_person: false,
        classification: "LEGAL_ENTITY_OR_INSTITUTION",
        action: "EXCLUDE",
        reason: `Tipo de entidad declarado '${declaredType}' no es una Persona Natural.`
      };
    }

    // 2. Comprobar patrones de personas jurídicas/estados en el nombre con límites de palabra
    for (const pattern of EntityFilter.KNOWN_NON_PERSON_PATTERNS) {
      if (pattern.test(name)) {
        return {
          is_natural_person: false,
          classification: "LEGAL_ENTITY_OR_INSTITUTION",
          action: "EXCLUDE",
          reason: `El nombre '${name}' coincide con una entidad jurídica, fondo o institución.`
        };
      }
    }

    // 3. Confirmada Persona Natural
    return {
      is_natural_person: true,
      classification: "NATURAL_PERSON",
      action: "INCLUDE",
      reason: "Entidad verificada como Persona Natural individual."
    };
  }
}
