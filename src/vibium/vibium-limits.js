/**
 * src/vibium/vibium-limits.js
 * 
 * EVALUADOR DE LÍMITES FÍSICOS, VISUALES Y EPISTEMOLÓGICOS DE LA ABSTRACCIÓN
 * 
 * Regla de Oro:
 * Si cualquiera de los tres límites se supera:
 * NO FORCE THE ABSTRACTION -> Generar ABSTRACTION_LIMIT_REACHED.
 */

export class VibiumLimitsEvaluator {
  /**
   * Límites de la metáfora física vertical
   */
  static LIMITS = {
    PHYSICAL: {
      MIN_SUBTERRANEAN_METERS: -12000, // -12 km (Pozo Superprofundo de Kola / Límite de la corteza)
      MAX_ALTITUDE_METERS: 384400000   // 384,400 km (Órbita Lunar)
    },
    VISUAL: {
      MIN_DISTINGUISHABLE_HEIGHT_METERS: 0.001, // 1 mm (grano de arena fino)
      MAX_RECOMMENDED_SECTIONS: 15,
      MIN_RECOMMENDED_SECTIONS: 3
    },
    EPISTEMIC: {
      MIN_POPULATION_SAMPLE: 1000,
      MAX_DEBT_RATIO_ALLOWED: 10 // La deuda global no puede superar 10x el valor de activos sin que la escalera colapse
    }
  };

  /**
   * Evalúa si un conjunto de datos o alturas calculadas respeta los límites
   * @param {Object} params
   * @param {number} params.medianWealth
   * @param {number} params.maxWealth
   * @param {number} params.minWealth
   * @param {Array<Object>} params.strata
   * @returns {Object} { status, limit_reached, reason, details, recommendation }
   */
  static evaluate({ medianWealth, maxWealth, minWealth, strata = [] }) {
    // 1. Evaluación de Límites Epistemológicos (EPISTEMIC LIMIT)
    if (minWealth !== undefined && maxWealth !== undefined) {
      const wealthRange = Math.abs(maxWealth - minWealth);
      const denominator = medianWealth && medianWealth > 0 ? medianWealth : 1;
      if (wealthRange / denominator < 0.001 || maxWealth === minWealth) {
        return {
          status: "ABSTRACTION_LIMIT_REACHED",
          limit_type: "EPISTEMIC_LIMIT",
          reason: "Distribución casi uniforme (varianza nula o insignificante). La escala vertical pierde su función pedagógica de contraste.",
          details: { minWealth, maxWealth, relativeRange: wealthRange / denominator },
          recommendation: "Reemplazar temporalmente con una visualización de homogeneidad absoluta."
        };
      }
    }

    if (medianWealth !== undefined && medianWealth < 0) {
      // Valor negativo en la mediana
      const debtMagnitude = Math.abs(medianWealth);
      if (debtMagnitude > 1000000) {
        // Deuda masiva absurda
        return {
          status: "ABSTRACTION_LIMIT_REACHED",
          limit_type: "EPISTEMIC_LIMIT",
          reason: `Mediana global con deuda destructiva (-$${debtMagnitude} USD). La metáfora física sobre el suelo es epistemológicamente insostenible.`,
          details: { medianWealth },
          recommendation: "Activar modo de crisis ontológica o bifurcar hacia visualización de balances de deuda soberana."
        };
      } else {
        // Deuda moderada: puede tolerar representación subterránea coherente
        return {
          status: "SUBTERRANEAN_ADAPTATION",
          limit_type: "PHYSICAL_LIMIT",
          reason: "Mediana negativa moderada detectada. Se habilita la representación de capas subterráneas en la corteza terrestre.",
          details: { medianWealth },
          recommendation: "Representar estratos bajo el nivel del suelo (sótanos, minas, corteza) con indicación visual de deuda."
        };
      }
    }

    // 2. Evaluación de Límites Físicos (PHYSICAL LIMIT)
    if (strata && strata.length > 0) {
      for (const s of strata) {
        const h = s.physical_height_meters || s.height_meters || 0;
        if (h > VibiumLimitsEvaluator.LIMITS.PHYSICAL.MAX_ALTITUDE_METERS) {
          return {
            status: "ABSTRACTION_LIMIT_REACHED",
            limit_type: "PHYSICAL_LIMIT",
            reason: `Altura física calculada (${(h/1000).toLocaleString('en-US')} km) excede la distancia a la Luna. La metáfora física pierde anclaje comprensible.`,
            details: { stratum_id: s.id || s.layer_id, height_meters: h },
            recommendation: "Aplicar compresión logarítmica astronómica o advertir el límite del modelo."
          };
        }
        if (h < VibiumLimitsEvaluator.LIMITS.PHYSICAL.MIN_SUBTERRANEAN_METERS) {
          return {
            status: "ABSTRACTION_LIMIT_REACHED",
            limit_type: "PHYSICAL_LIMIT",
            reason: `Profundidad negativa (${h} m) supera la corteza terrestre habitable (-12 km).`,
            details: { stratum_id: s.id || s.layer_id, height_meters: h },
            recommendation: "Bloquear publicación y requerir revisión humana."
          };
        }
      }
    }

    // 3. Evaluación de Límites Visuales (VISUAL LIMIT)
    if (strata && strata.length > 0) {
      if (strata.length > VibiumLimitsEvaluator.LIMITS.VISUAL.MAX_RECOMMENDED_SECTIONS) {
        return {
          status: "ABSTRACTION_LIMIT_REACHED",
          limit_type: "VISUAL_LIMIT",
          reason: `Cantidad excesiva de estratos (${strata.length} > ${VibiumLimitsEvaluator.LIMITS.VISUAL.MAX_RECOMMENDED_SECTIONS}). Produce fatiga cognitiva en scrollytelling.`,
          details: { count: strata.length },
          recommendation: "Reagrupar percentiles contiguos para reducir a <= 12 estratos."
        };
      }
    }

    return {
      status: "WITHIN_LIMITS",
      limit_type: null,
      reason: "Todos los parámetros respetan los límites físicos, visuales y epistemológicos.",
      details: {},
      recommendation: "Proceder con la verificación visual y publicación."
    };
  }
}
