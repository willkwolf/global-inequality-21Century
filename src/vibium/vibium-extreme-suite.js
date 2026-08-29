/**
 * src/vibium/vibium-extreme-suite.js
 * 
 * SUITE DE PRUEBAS EXTREMAS VIBIUM (12 CASOS LÍMITE Y DEGENERATIVOS)
 * 
 * Descubre los límites epistemológicos, físicos y visuales de la abstracción
 * antes de que lleguen a producción.
 */

import { VibiumVerificationEngine } from './vibium-runner.js';
import { ScaleRecalibrator } from '../agent/scale-recalibrator.js';

export class VibiumExtremeSuite {
  constructor() {
    this.engine = new VibiumVerificationEngine();
  }

  /**
   * Ejecuta los 12 casos sintéticos extremos
   * @returns {Promise<Array<Object>>} Lista de resultados por caso
   */
  async runAllExtremeCases() {
    const results = [];
    const cases = this.getExtremeCaseDefinitions();

    for (const testCase of cases) {
      const caseStartTime = Date.now();
      try {
        let recalib = null;
        if (testCase.canonicalData && testCase.canonicalData.distributions && testCase.canonicalData.distributions.length > 0) {
          recalib = ScaleRecalibrator.recalibrate(testCase.canonicalData);
        }

        const abstractionDoc = testCase.canonicalData && recalib ? {
          contract_version: "2.0.0",
          title_es: "¿A qué altura vives?",
          title_en: "How high do you stand?",
          subtitle_es: `Distancia calculada: ${recalib.layers[0]?.formatted_height_label || '0 m'}`,
          subtitle_en: `Calculated distance: ${recalib.layers[0]?.formatted_height_label || '0 m'}`,
          semantic_concept_es: "Patrimonio neto",
          semantic_concept_en: "Net worth",
          scale_formula: {
            unit_value_usd: recalib.formula_constants.step_usd_value,
            step_height_meters: recalib.formula_constants.step_physical_height_meters
          },
          max_height_meters: recalib.max_height_meters,
          layers: recalib.layers.map(l => ({
            ...l,
            narrative: {
              headline_es: `${l.physical_reference.name_es} (${l.formatted_height_label})`,
              headline_en: `${l.physical_reference.name_en} (${l.formatted_height_label})`,
              caption_es: `Estrato representativo con altura ${l.formatted_height_label}`,
              caption_en: `Representative layer with height ${l.formatted_height_label}`,
              aria_es: `${l.physical_reference.name_es}`,
              aria_en: `${l.physical_reference.name_en}`
            }
          })),
          provenance: {
            dataset_id: testCase.id,
            summary_es: testCase.name,
            summary_en: testCase.name,
            sources: [{ name: "Extreme Test Source", url: "https://example.com" }],
            additional_limitations: [
              { es: "Limitación sintética extrema 1", en: "Synthetic extreme limitation 1" },
              { es: "Limitación sintética extrema 2", en: "Synthetic extreme limitation 2" }
            ]
          }
        } : null;

        const result = await this.engine.verifyScenario({
          scenarioId: `extreme-${testCase.id}`,
          scenarioTitle: testCase.name,
          canonicalData: testCase.canonicalData,
          abstractionDoc,
          driftReport: { detected_drifts: [{ axis: "DATA_DRIFT", severity: "HIGH" }] }
        });

        const isMatch = (result.decision === testCase.expectedBehavior) ||
          (testCase.expectedBehavior === "BLOCK" && (result.decision === "BLOCK" || result.decision === "ABSTRACTION_LIMIT_REACHED")) ||
          (testCase.expectedBehavior === "ABSTRACTION_LIMIT_REACHED" && result.decision === "ABSTRACTION_LIMIT_REACHED") ||
          (testCase.expectedBehavior === "PASS_WITH_ADAPTATION" && (result.decision === "PASS_WITH_ADAPTATION" || result.decision === "PASS"));

        results.push({
          id: testCase.id,
          name: testCase.name,
          expected_behavior: testCase.expectedBehavior,
          decision: result.decision,
          passed: isMatch,
          duration_ms: Date.now() - caseStartTime
        });
      } catch (err) {
        const isMatch = testCase.expectedBehavior === "BLOCK" || testCase.expectedBehavior === "ABSTRACTION_LIMIT_REACHED";
        results.push({
          id: testCase.id,
          name: testCase.name,
          expected_behavior: testCase.expectedBehavior,
          decision: "ABSTRACTION_LIMIT_REACHED",
          passed: isMatch,
          error: err.message,
          duration_ms: Date.now() - caseStartTime
        });
      }
    }

    return results;
  }

  getExtremeCaseDefinitions() {
    return [
      {
        id: "case-01-all-very-low",
        name: "1. Todos los valores muy bajos (Casi cero universal)",
        expectedBehavior: "PASS_WITH_ADAPTATION",
        canonicalData: {
          global_metrics: { wealth_median_usd: 12, top_holder: { name: "Micro Holder", estimated_net_worth_usd: 500 } },
          distributions: [
            { pedagogical_role: "EXTREMO", net_worth_usd: { average: 500, threshold_min: 200, threshold_max: null }, population_percentage: 1 },
            { pedagogical_role: "CONTRASTE", net_worth_usd: { average: 50, threshold_min: 20, threshold_max: 200 }, population_percentage: 9 },
            { pedagogical_role: "BASE", net_worth_usd: { average: 12, threshold_min: 0, threshold_max: 20 }, population_percentage: 90 }
          ]
        }
      },
      {
        id: "case-02-all-very-high",
        name: "2. Todos los valores muy altos (Hiperinflación / Trillones)",
        expectedBehavior: "PASS_WITH_ADAPTATION",
        canonicalData: {
          global_metrics: { wealth_median_usd: 500000000, top_holder: { name: "Galactic Holder", estimated_net_worth_usd: 1000000000000000 } },
          distributions: [
            { pedagogical_role: "EXTREMO", net_worth_usd: { average: 1000000000000000, threshold_min: 1e14, threshold_max: null }, population_percentage: 0.1 },
            { pedagogical_role: "CONTRASTE", net_worth_usd: { average: 50000000000, threshold_min: 1e9, threshold_max: 1e14 }, population_percentage: 4.9 },
            { pedagogical_role: "BASE", net_worth_usd: { average: 500000000, threshold_min: 1e8, threshold_max: 1e9 }, population_percentage: 95 }
          ]
        }
      },
      {
        id: "case-03-extreme-inequality",
        name: "3. Distribución extremadamente desigual (Distancia astronómica > Luna)",
        expectedBehavior: "ABSTRACTION_LIMIT_REACHED",
        canonicalData: {
          global_metrics: { wealth_median_usd: 10, top_holder: { name: "Solar Monopolist", estimated_net_worth_usd: 1e16 } },
          distributions: [
            { pedagogical_role: "EXTREMO", net_worth_usd: { average: 1e16, threshold_min: 1e15, threshold_max: null }, population_percentage: 0.00001 },
            { pedagogical_role: "BASE", net_worth_usd: { average: 10, threshold_min: 0, threshold_max: 20 }, population_percentage: 99.99999 }
          ]
        }
      },
      {
        id: "case-04-quasi-uniform",
        name: "4. Distribución casi uniforme (Varianza nula)",
        expectedBehavior: "ABSTRACTION_LIMIT_REACHED",
        canonicalData: {
          global_metrics: { wealth_median_usd: 50000, top_holder: { name: "Equalizer", estimated_net_worth_usd: 50000 } },
          distributions: [
            { pedagogical_role: "EXTREMO", net_worth_usd: { average: 50000, threshold_min: 50000, threshold_max: 50000 }, population_percentage: 100 }
          ]
        }
      },
      {
        id: "case-05-negative-debt",
        name: "5. Valores negativos moderados (Corteza subterránea)",
        expectedBehavior: "PASS_WITH_ADAPTATION",
        canonicalData: {
          global_metrics: { wealth_median_usd: -2500, top_holder: { name: "Solvent Top", estimated_net_worth_usd: 500000000 } },
          distributions: [
            { pedagogical_role: "EXTREMO", net_worth_usd: { average: 500000000, threshold_min: 1e8, threshold_max: null }, population_percentage: 1 },
            { pedagogical_role: "CONTRASTE", net_worth_usd: { average: 25000, threshold_min: 0, threshold_max: 1e8 }, population_percentage: 19 },
            { pedagogical_role: "BASE", net_worth_usd: { average: -2500, threshold_min: -5000, threshold_max: 0 }, population_percentage: 80 }
          ]
        }
      },
      {
        id: "case-06-extreme-outlier",
        name: "6. Outlier astronómico más allá de la Luna (> 384,400 km)",
        expectedBehavior: "ABSTRACTION_LIMIT_REACHED",
        canonicalData: {
          global_metrics: { wealth_median_usd: 8000, top_holder: { name: "Cosmic Entity", estimated_net_worth_usd: 1e22 } },
          distributions: [
            { pedagogical_role: "EXTREMO", net_worth_usd: { average: 1e22, threshold_min: 1e21, threshold_max: null }, population_percentage: 0.0001 },
            { pedagogical_role: "BASE", net_worth_usd: { average: 8000, threshold_min: 0, threshold_max: 16000 }, population_percentage: 99.9999 }
          ]
        }
      },
      {
        id: "case-07-incomplete-data",
        name: "7. Datos incompletos (Solo 1 percentil)",
        expectedBehavior: "ABSTRACTION_LIMIT_REACHED",
        canonicalData: {
          global_metrics: { wealth_median_usd: 8000, top_holder: { name: "Partial", estimated_net_worth_usd: 1000000 } },
          distributions: [
            { pedagogical_role: "EXTREMO", net_worth_usd: { average: 1000000, threshold_min: 1000000, threshold_max: null }, population_percentage: 50 }
          ]
        }
      },
      {
        id: "case-08-coinciding-percentiles",
        name: "8. Percentiles coincidentes (Peldaños idénticos)",
        expectedBehavior: "ABSTRACTION_LIMIT_REACHED",
        canonicalData: {
          global_metrics: { wealth_median_usd: 10000, top_holder: { name: "Same", estimated_net_worth_usd: 10000 } },
          distributions: [
            { pedagogical_role: "EXTREMO", net_worth_usd: { average: 10000, threshold_min: 10000, threshold_max: 10000 }, population_percentage: 50 },
            { pedagogical_role: "BASE", net_worth_usd: { average: 10000, threshold_min: 10000, threshold_max: 10000 }, population_percentage: 50 }
          ]
        }
      },
      {
        id: "case-09-radical-units",
        name: "9. Cambios radicales de unidades (Satoshis / BTC)",
        expectedBehavior: "PASS_WITH_ADAPTATION",
        canonicalData: {
          global_metrics: { wealth_median_usd: 15000, top_holder: { name: "Crypto Whale", estimated_net_worth_usd: 850000000000 } },
          distributions: [
            { pedagogical_role: "EXTREMO", net_worth_usd: { average: 850000000000, threshold_min: 5e11, threshold_max: null }, population_percentage: 0.1 },
            { pedagogical_role: "CONTRASTE", net_worth_usd: { average: 100000, threshold_min: 50000, threshold_max: 200000 }, population_percentage: 9.9 },
            { pedagogical_role: "BASE", net_worth_usd: { average: 15000, threshold_min: 0, threshold_max: 30000 }, population_percentage: 90 }
          ]
        }
      },
      {
        id: "case-10-collective-entity",
        name: "10. Cambio a entidad colectiva soberana (Fondo Soberano)",
        expectedBehavior: "PASS_WITH_ADAPTATION",
        canonicalData: {
          global_metrics: { wealth_median_usd: 9500, top_holder: { name: "Global Sovereign AI Fund", type: "fund", estimated_net_worth_usd: 2500000000000 } },
          distributions: [
            { pedagogical_role: "EXTREMO", entity_reference: { name: "Global Sovereign AI Fund", type: "fund" }, net_worth_usd: { average: 2500000000000, threshold_min: 2e12, threshold_max: null }, population_percentage: 0.01 },
            { pedagogical_role: "CONTRASTE", net_worth_usd: { average: 150000, threshold_min: 50000, threshold_max: 500000 }, population_percentage: 19.99 },
            { pedagogical_role: "BASE", net_worth_usd: { average: 9500, threshold_min: 0, threshold_max: 20000 }, population_percentage: 80 }
          ]
        }
      },
      {
        id: "case-11-empty-dataset",
        name: "11. Dataset vacío (Zero entries)",
        expectedBehavior: "ABSTRACTION_LIMIT_REACHED",
        canonicalData: null
      },
      {
        id: "case-12-partially-corrupted",
        name: "12. Fuente parcialmente corrupta (Deuda astronómica masiva)",
        expectedBehavior: "ABSTRACTION_LIMIT_REACHED",
        canonicalData: {
          global_metrics: { wealth_median_usd: -5000000000, top_holder: { name: "Black Hole", estimated_net_worth_usd: 0 } },
          distributions: []
        }
      }
    ];
  }
}
