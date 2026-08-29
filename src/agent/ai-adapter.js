/**
 * src/agent/ai-adapter.js
 * 
 * AGENTE DE ADAPTACIÓN SEMÁNTICA Y PEDAGÓGICA (ORQUESTADOR)
 * 
 * Realiza la transformación controlada:
 * SOURCE → UNDERSTAND → VALIDATE → MAP → ADAPT → GENERATE → TEST.
 */

import { DriftEngine } from '../drift/drift-engine.js';
import { ScaleRecalibrator } from './scale-recalibrator.js';
import { GeminiAdapterClient } from './gemini-client.js';
import { AbstractionContract } from '../contracts/abstraction-contract.js';
import { StoryModel } from '../contracts/story-model.js';
import { Guardrails } from '../guardrails/guardrails.js';

export class AiAdaptationAgent {
  constructor(geminiClient = new GeminiAdapterClient()) {
    this.gemini = geminiClient;
  }

  /**
   * Adapta el nuevo dataset canónico a la abstracción existente.
   * @param {Object} params
   * @param {Object} params.baselineData - Dataset canónico previo
   * @param {Object} params.incomingData - Dataset canónico nuevo
   * @returns {Promise<Object>} { success, abstractionDoc, storyModel, driftReport, telemetry, warning }
   */
  async process({ baselineData, incomingData }) {
    const startTime = Date.now();

    // 1. Detección y clasificación de drift
    const driftReport = DriftEngine.analyze(baselineData, incomingData);

    // 2. Guardrails iniciales: Verificar si el drift colapsa la abstracción epistemológicamente
    const preCheck = Guardrails.evaluatePreAdaptation(driftReport, incomingData);
    if (!preCheck.can_proceed) {
      return {
        success: false,
        status: "ADAPTATION_FAILED",
        reason: preCheck.failure_reason,
        driftReport,
        requires_human_review: true,
        execution_time_ms: Date.now() - startTime
      };
    }

    // 3. Recalibración dinámica de escalas, alturas y analogías físicas
    const recalibration = ScaleRecalibrator.recalibrate(incomingData);

    // 4. Adaptación semántica y generación de narrativa bilingüe (Gemini / Motor determinista)
    const storyAdaptationResult = await this.gemini.adaptStorytelling({
      driftReport,
      recalibratedLayers: recalibration.layers,
      globalMetrics: incomingData.global_metrics,
      semanticConcept: incomingData.semantic_concept
    });

    const adaptedStory = storyAdaptationResult.adapted_story;

    // 5. Ensamblar documento del Contrato de Abstracción
    const dateLabelEs = incomingData.raw_sources?.[0]?.report_date ? `UBS · ${incomingData.raw_sources[0].report_date.split('-')[0]}` : "UBS · dic 2024";
    const dateLabelEn = incomingData.raw_sources?.[0]?.report_date ? `UBS · ${incomingData.raw_sources[0].report_date.split('-')[0]}` : "UBS · Dec 2024";

    const topPerson = incomingData.global_metrics?.top_holder?.name || "Cúspide";
    const totalAdultsM = (incomingData.global_metrics?.total_adult_population / 1e6).toFixed(0);
    const billionairesCount = incomingData.global_metrics?.total_billionaires_count || 2891;

    const summary_es = `${incomingData.raw_sources?.[0]?.name || "UBS Report"}. Forbes Billionaires: ${topPerson} y ${billionairesCount} billonarios confirmados. Población adulta mundial: ${(totalAdultsM / 1000).toFixed(2)} billones.`;
    const summary_en = `${incomingData.raw_sources?.[0]?.name || "UBS Report"}. Forbes Billionaires: ${topPerson} and ${billionairesCount} confirmed billionaires. World adult population: ${(totalAdultsM / 1000).toFixed(2)} billion.`;

    const abstractionDoc = {
      contract_version: "2.0.0",
      title_es: adaptedStory.title_es,
      title_en: adaptedStory.title_en,
      subtitle_es: adaptedStory.subtitle_es,
      subtitle_en: adaptedStory.subtitle_en,
      semantic_concept_es: adaptedStory.semantic_concept_es,
      semantic_concept_en: adaptedStory.semantic_concept_en,
      scale_formula: {
        unit_value_usd: recalibration.formula_constants.step_usd_value,
        step_height_meters: recalibration.formula_constants.step_physical_height_meters
      },
      max_height_meters: recalibration.max_height_meters,
      layers: adaptedStory.layers,
      provenance: {
        dataset_id: incomingData.dataset_id,
        retrieved_at: incomingData.retrieved_at,
        methodology_version: incomingData.methodology_version,
        sources: incomingData.raw_sources,
        summary_es,
        summary_en,
        date_label_es: dateLabelEs,
        date_label_en: dateLabelEn
      }
    };

    // 6. Validar documento de abstracción
    AbstractionContract.validate(abstractionDoc);

    // 7. Guardrails posteriores: Validar legibilidad, contraste y distancias físicas
    const postCheck = Guardrails.evaluatePostAdaptation(abstractionDoc);
    if (!postCheck.passed) {
      return {
        success: false,
        status: "ADAPTATION_FAILED",
        reason: postCheck.reason,
        driftReport,
        requires_human_review: true,
        execution_time_ms: Date.now() - startTime
      };
    }

    // 8. Construir StoryModel
    const storyModel = new StoryModel(abstractionDoc);

    const telemetry = {
      timestamp: new Date().toISOString(),
      execution_time_ms: Date.now() - startTime,
      dataset_id: incomingData.dataset_id,
      story_engine: storyAdaptationResult.source,
      drifts_detected_count: driftReport.detected_drifts.length,
      layers_count: abstractionDoc.layers.length,
      max_height_meters: abstractionDoc.max_height_meters,
      step_usd_value: abstractionDoc.scale_formula.unit_value_usd,
      confidence: driftReport.confidence,
      has_warnings: preCheck.warnings.length > 0 || postCheck.warnings.length > 0,
      warnings: [...preCheck.warnings, ...postCheck.warnings]
    };

    return {
      success: true,
      status: "ADAPTATION_SUCCESSFUL",
      abstractionDoc,
      storyModel,
      driftReport,
      telemetry,
      warnings: telemetry.warnings
    };
  }
}
