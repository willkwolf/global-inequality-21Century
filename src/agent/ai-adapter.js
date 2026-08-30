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

    // 5. Ensamblar metadatos dinámicos de procedencia y fecha
    const primarySource = incomingData.raw_sources?.[0]?.name || "UBS Global Wealth Report";
    const reportDate = incomingData.raw_sources?.[0]?.report_date || "2024";
    const methVersion = incomingData.methodology_version || "2.1.0";
    
    // data_date dinámico: SOURCE · PERIOD · METHODOLOGY
    const dateLabelEs = `${primarySource.split(' ')[0]} · ${reportDate} · v${methVersion}`;
    const dateLabelEn = `${primarySource.split(' ')[0]} · ${reportDate} · v${methVersion}`;

    const topPerson = incomingData.global_metrics?.top_holder?.name || "Cúspide individual";
    const totalAdultsB = (incomingData.global_metrics?.total_adult_population / 1e9).toFixed(2);
    const billionairesCount = incomingData.global_metrics?.total_billionaires_count || 2891;

    const summary_es = `${primarySource} (adultos, datos a ${reportDate}). Forbes Billionaires: ${topPerson} y ${billionairesCount} billonarios confirmados. Población adulta mundial: ${totalAdultsB} billones.`;
    const summary_en = `${primarySource} (adults, data as of ${reportDate}). Forbes Billionaires: ${topPerson} and ${billionairesCount} confirmed billionaires. World adult population: ${totalAdultsB} billion.`;

    const limitations = incomingData.limitations || [
      {
        code: "VALUATION_BASIS",
        es: "Patrimonio neto personal = activos reales y financieros privados menos deudas individuales.",
        en: "Personal net worth = individual real and financial assets minus private liabilities."
      },
      {
        code: "INDIVIDUAL_SCOPE",
        es: "Unidad de análisis exclusiva: Personas naturales adultas (>=20 años). Excluye corporaciones y estados.",
        en: "Exclusive analysis unit: Adult natural persons (>=20 years). Excludes corporations and sovereign entities."
      },
      {
        code: "VOLATILITY_AND_ILLIQUIDITY",
        es: "La cúspide (Elon Musk) refleja valoración de participaciones empresariales (Tesla, SpaceX) no monetizables de inmediato en efectivo.",
        en: "The apex (Elon Musk) reflects corporate equity valuations (Tesla, SpaceX) not immediately liquid in cash."
      },
      {
        code: "CURRENCY_AND_PPP",
        es: "Medición en USD nominales como denominador estándar común; el poder adquisitivo real (PPP) varía geográficamente.",
        en: "Measured in nominal USD as a common standard; real purchasing power (PPP) varies geographically."
      },
      {
        code: "STEP_EQUIVALENCE",
        es: "La escala fija 1 escalón (15 cm) ≈ $8,000 USD, aproximando la mediana empírica UBS ($8,910 USD ≈ 16.7 cm).",
        en: "The scale anchors 1 step (15 cm) ≈ $8,000 USD, approximating the empirical UBS median ($8,910 USD ≈ 16.7 cm)."
      },
      {
        code: "OFFSHORE_AND_INFORMAL",
        es: "Las estadísticas globales enfrentan limitaciones para registrar riqueza en paraísos fiscales y activos informales.",
        en: "Global statistics face limitations tracking wealth in offshore havens and informal assets."
      },
      {
        code: "STOCK_VS_FLOW",
        es: "El patrimonio neto mide riqueza acumulada (stock), no ingresos anuales de flujo corriente.",
        en: "Net worth measures accumulated wealth (stock), not annual flow income."
      },
      {
        code: "LINEAR_SCALE",
        es: "La escala vertical es estrictamente lineal (Lie Factor = 1.0) sin compresión logarítmica artificial.",
        en: "The vertical scale is strictly linear (Lie Factor = 1.0) without artificial logarithmic compression."
      }
    ];

    const abstractionDoc = {
      contract_version: "2.0.0",
      analysis_unit: "natural_person",
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
        methodology_version: methVersion,
        sources: incomingData.raw_sources,
        summary_es,
        summary_en,
        date_label_es: dateLabelEs,
        date_label_en: dateLabelEn,
        limitations: limitations
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
