/**
 * src/drift/drift-engine.js
 * 
 * MOTOR DE DETECCIÓN Y CLASIFICACIÓN DE DRIFT
 * 
 * En este sistema pedagógico:
 * DRIFT → DETECT → UNDERSTAND → ADAPT → PRESERVE ABSTRACTION.
 * 
 * Distingue 5 ejes de drift:
 * 1. DATA DRIFT: Cambio en valores y distribución.
 * 2. SEMANTIC DRIFT: Cambio en significado, nomenclatura y etiquetas.
 * 3. METHODOLOGICAL DRIFT: Cambio en el método de cálculo / ruptura de serie.
 * 4. DOMAIN DRIFT: Cambio estructural del fenómeno global.
 * 5. CONCEPTUAL DRIFT: Cambio que cuestiona la unidad de análisis o la validez de la metáfora de altura.
 */

import { EntityFilter } from '../domain/domain-definition.js';

export class DriftEngine {
  /**
   * Analiza las diferencias entre dos snapshots canónicos.
   * @param {Object} baselineData - Snapshot canónico anterior
   * @param {Object} incomingData - Snapshot canónico nuevo
   * @returns {Object} Reporte detallado de drift
   */
  static analyze(baselineData, incomingData) {
    const report = {
      timestamp: new Date().toISOString(),
      baseline_dataset_id: baselineData?.dataset_id || "initial_baseline",
      incoming_dataset_id: incomingData?.dataset_id || "unknown",
      detected_drifts: [],
      drift_summary: {
        has_data_drift: false,
        has_semantic_drift: false,
        has_methodological_drift: false,
        has_domain_drift: false,
        has_conceptual_drift: false
      },
      metrics_comparison: {},
      strata_comparison: {},
      epistemological_status: "VALID_ABSTRACTION", // "VALID_ABSTRACTION" | "NEEDS_ADAPTATION" | "ARCHITECTURAL_WARNING" | "ABSTRACTION_FAILURE"
      confidence: 1.0,
      recommended_action: "ADAPT_AND_PROCEED" // "PROCEED" | "ADAPT_AND_PROCEED" | "HUMAN_REVIEW_REQUIRED"
    };

    if (!incomingData) {
      report.epistemological_status = "ABSTRACTION_FAILURE";
      report.recommended_action = "HUMAN_REVIEW_REQUIRED";
      report.detected_drifts.push({
        type: "CONCEPTUAL_DRIFT",
        severity: "CRITICAL",
        message: "No se proporcionaron datos entrantes válidos."
      });
      return report;
    }

    // 0. Validación de Unidad de Análisis (Persona Natural Exclusivamente)
    if (incomingData.global_metrics?.top_holder) {
      const entityClassification = EntityFilter.classifyEntity(incomingData.global_metrics.top_holder);
      if (!entityClassification.is_natural_person) {
        report.drift_summary.has_conceptual_drift = true;
        report.epistemological_status = "ABSTRACTION_FAILURE";
        report.recommended_action = "HUMAN_REVIEW_REQUIRED";
        report.detected_drifts.push({
          type: "CONCEPTUAL_DRIFT",
          severity: "CRITICAL",
          message: `Inconsistencia ontológica: Se intentó introducir una entidad no natural en la cúspide ('${incomingData.global_metrics.top_holder.name}'): ${entityClassification.reason}`
        });
        report.confidence = 0.0;
        return report;
      }
    }

    // 1. Detección de METHODOLOGICAL DRIFT
    if (baselineData?.methodology_version && incomingData.methodology_version !== baselineData.methodology_version) {
      report.drift_summary.has_methodological_drift = true;
      report.detected_drifts.push({
        type: "METHODOLOGICAL_DRIFT",
        severity: "HIGH",
        message: `Cambio de versión metodológica: ${baselineData.methodology_version} → ${incomingData.methodology_version}`
      });
    }

    if (baselineData?.global_metrics?.currency_basis && incomingData.global_metrics?.currency_basis !== baselineData.global_metrics.currency_basis) {
      report.drift_summary.has_methodological_drift = true;
      report.detected_drifts.push({
        type: "METHODOLOGICAL_DRIFT",
        severity: "MEDIUM",
        message: `Cambio en base de divisa: ${baselineData.global_metrics.currency_basis} → ${incomingData.global_metrics.currency_basis}`
      });
    }

    // 2. Detección de SEMANTIC DRIFT
    if (baselineData?.semantic_concept && incomingData.semantic_concept !== baselineData.semantic_concept) {
      report.drift_summary.has_semantic_drift = true;
      report.detected_drifts.push({
        type: "SEMANTIC_DRIFT",
        severity: "MEDIUM",
        message: `Cambio de concepto semántico: "${baselineData.semantic_concept}" → "${incomingData.semantic_concept}"`
      });
    }

    // 3. Detección de DATA DRIFT
    const oldMedian = baselineData?.global_metrics?.wealth_median_usd || 8910;
    const newMedian = incomingData.global_metrics?.wealth_median_usd;
    if (newMedian !== undefined && Math.abs(newMedian - oldMedian) / oldMedian > 0.05) {
      report.drift_summary.has_data_drift = true;
      const pctChange = ((newMedian - oldMedian) / oldMedian * 100).toFixed(1);
      report.detected_drifts.push({
        type: "DATA_DRIFT",
        severity: "MEDIUM",
        message: `Variación en mediana de riqueza: $${oldMedian} → $${newMedian} (${pctChange}%)`
      });
    }

    const oldTop = baselineData?.global_metrics?.top_holder?.estimated_net_worth_usd || 737500000000;
    const newTop = incomingData.global_metrics?.top_holder?.estimated_net_worth_usd;
    if (newTop !== undefined && Math.abs(newTop - oldTop) / oldTop > 0.05) {
      report.drift_summary.has_data_drift = true;
      const pctChange = ((newTop - oldTop) / oldTop * 100).toFixed(1);
      report.detected_drifts.push({
        type: "DATA_DRIFT",
        severity: "MEDIUM",
        message: `Variación en riqueza de la cúspide: $${(oldTop/1e9).toFixed(1)}B → $${(newTop/1e9).toFixed(1)}B (${pctChange}%)`
      });
    }

    // 4. Detección de DOMAIN DRIFT & CONCEPTUAL DRIFT
    // Si la mediana es <= 0 o la cúspide es negativa, la metáfora física de altura colapsa
    if (newMedian !== undefined && newMedian <= 0) {
      report.drift_summary.has_conceptual_drift = true;
      report.epistemological_status = "ARCHITECTURAL_WARNING";
      report.recommended_action = "HUMAN_REVIEW_REQUIRED";
      report.detected_drifts.push({
        type: "CONCEPTUAL_DRIFT",
        severity: "CRITICAL",
        message: "Mediana menor o igual a cero detectada. Una altura física negativa destruye la inteligibilidad de la escalera visual."
      });
    }

    if (newTop !== undefined && (newTop <= 0 || isNaN(newTop))) {
      report.drift_summary.has_conceptual_drift = true;
      report.epistemological_status = "ABSTRACTION_FAILURE";
      report.recommended_action = "HUMAN_REVIEW_REQUIRED";
      report.detected_drifts.push({
        type: "CONCEPTUAL_DRIFT",
        severity: "CRITICAL",
        message: "Patrimonio de cúspide inválido o no positivo. La escala superior no puede anclarse en el espacio."
      });
    }

    // Comprobar ratio de escala extrema
    if (newTop && newMedian) {
      const ratio = newTop / newMedian;
      if (ratio > 1e12) {
        report.drift_summary.has_domain_drift = true;
        report.epistemological_status = "ARCHITECTURAL_WARNING";
        report.detected_drifts.push({
          type: "DOMAIN_DRIFT",
          severity: "HIGH",
          message: `Ratio de desigualdad extremo (${ratio.toExponential(2)}). La escala visual requerirá compresión logarítmica extrema o advertencia pedagógica.`
        });
      }
    }

    // Ajuste de confianza
    if (report.drift_summary.has_conceptual_drift) {
      report.confidence = 0.2;
    } else if (report.drift_summary.has_methodological_drift) {
      report.confidence = 0.85;
    } else if (report.drift_summary.has_semantic_drift || report.drift_summary.has_data_drift) {
      report.confidence = 0.95;
    }

    return report;
  }
}
