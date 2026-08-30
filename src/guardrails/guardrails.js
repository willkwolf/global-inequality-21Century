/**
 * src/guardrails/guardrails.js
 * 
 * SISTEMA DE GUARDRAILS Y SEGURIDAD EPISTEMOLÓGICA
 * 
 * Regla de oro:
 * AUTOMATIZAR LA ADAPTACIÓN ≠ AUTOMATIZAR LA VERDAD.
 * 
 * Si el agente o los datos desafían la validez epistemológica de la visualización,
 * o intentan violar la unidad de análisis de PERSONA NATURAL, el sistema aborta
 * la publicación emitiendo ADAPTATION_FAILED y detiene el pipeline.
 */

import { EntityFilter } from '../domain/domain-definition.js';

export class Guardrails {
  /**
   * Evaluación previa a la adaptación
   */
  static evaluatePreAdaptation(driftReport, canonicalData) {
    const warnings = [];

    if (!canonicalData || !canonicalData.global_metrics) {
      return { can_proceed: false, failure_reason: "Dataset canónico incompleto o nulo.", warnings };
    }

    // 1. Validar unidad de análisis exclusiva: Persona Natural
    if (canonicalData.analysis_unit && canonicalData.analysis_unit !== "natural_person" && canonicalData.analysis_unit !== "individual_adult") {
      return {
        can_proceed: false,
        failure_reason: `GUARDRAIL_BLOCKED_NON_NATURAL_PERSON: Unidad de análisis '${canonicalData.analysis_unit}' prohibida. Solo se admiten personas naturales.`,
        warnings
      };
    }

    if (canonicalData.global_metrics.top_holder) {
      const entityClass = EntityFilter.classifyEntity(canonicalData.global_metrics.top_holder);
      if (!entityClass.is_natural_person) {
        return {
          can_proceed: false,
          failure_reason: `GUARDRAIL_BLOCKED_NON_NATURAL_PERSON: La entidad en la cúspide '${canonicalData.global_metrics.top_holder.name}' fue rechazada: ${entityClass.reason}`,
          warnings
        };
      }
    }

    // Validar entidades en distribuciones
    if (Array.isArray(canonicalData.distributions)) {
      for (const dist of canonicalData.distributions) {
        if (dist.entity_reference) {
          const entityCheck = EntityFilter.classifyEntity(dist.entity_reference);
          if (!entityCheck.is_natural_person) {
            return {
              can_proceed: false,
              failure_reason: `GUARDRAIL_BLOCKED_NON_NATURAL_PERSON: Estrato '${dist.stratum_key}' contiene entidad no admisible: ${entityCheck.reason}`,
              warnings
            };
          }
        }
      }
    }

    const { wealth_median_usd, total_adult_population } = canonicalData.global_metrics;

    if (total_adult_population <= 0) {
      return { can_proceed: false, failure_reason: "Población adulta total no puede ser <= 0.", warnings };
    }

    if (wealth_median_usd <= 0) {
      return {
        can_proceed: false,
        failure_reason: `Mediana de riqueza ($${wealth_median_usd}) es <= 0. La abstracción de altura física requiere un anclaje positivo en el suelo.`,
        warnings
      };
    }

    if (!Array.isArray(canonicalData.distributions) || canonicalData.distributions.length < 3) {
      return {
        can_proceed: false,
        failure_reason: `Número insuficiente de estratos percentiles (${canonicalData.distributions?.length || 0}). Mínimo requerido: 3.`,
        warnings
      };
    }

    if (driftReport && driftReport.epistemological_status === "ABSTRACTION_FAILURE") {
      return {
        can_proceed: false,
        failure_reason: "Fallo crítico detectado en Drift Engine: la abstracción conceptual no es aplicable a este dataset.",
        warnings
      };
    }

    if (driftReport && driftReport.epistemological_status === "ARCHITECTURAL_WARNING") {
      warnings.push({
        code: "EXTREME_DRIFT_WARNING",
        message: "Se detectó un drift extremo en la distribución. La adaptación procede bajo supervisión de guardrails."
      });
    }

    return { can_proceed: true, warnings };
  }

  /**
   * Evaluación posterior a la adaptación
   */
  static evaluatePostAdaptation(abstractionDoc) {
    const warnings = [];

    if (!abstractionDoc || !Array.isArray(abstractionDoc.layers)) {
      return { passed: false, reason: "Documento de abstracción inválido o sin capas.", warnings };
    }

    const count = abstractionDoc.layers.length;
    if (count < 3 || count > 15) {
      return {
        passed: false,
        reason: `La cantidad de estratos (${count}) está fuera de los límites cognitivos pedagógicos (mínimo 3, máximo 15).`,
        warnings
      };
    }

    // Comprobar orden estrictamente decreciente y consistencia semántica
    let prevHeight = Infinity;
    for (let i = 0; i < abstractionDoc.layers.length; i++) {
      const l = abstractionDoc.layers[i];
      if (l.physical_height_meters >= prevHeight) {
        return {
          passed: false,
          reason: `Violación de monotonicidad en estrato ${l.layer_id}: ${l.physical_height_meters}m >= ${prevHeight}m`,
          warnings
        };
      }
      prevHeight = l.physical_height_meters;

      // Verificar que los textos no contengan cadenas corruptas o estáticas obsoletas
      if (!l.narrative.headline_es || l.narrative.headline_es.includes("undefined") || l.narrative.headline_es.includes("NaN")) {
        return {
          passed: false,
          reason: `Texto corrupto en headline_es de estrato ${l.layer_id}`,
          warnings
        };
      }

      if (!l.narrative.caption_es || l.narrative.caption_es.includes("undefined") || l.narrative.caption_es.includes("NaN")) {
        return {
          passed: false,
          reason: `Caption corrupto en caption_es de estrato ${l.layer_id}`,
          warnings
        };
      }
    }

    return { passed: true, warnings };
  }
}
