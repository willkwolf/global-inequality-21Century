/**
 * tests/vibium-verification.test.mjs
 * 
 * SUITE DE VERIFICACIÓN VIBIUM (SCENARIOS 1, 2, 3 + EXTREME TESTS)
 * Validada en doble resolución: MOBILE (390x844) y DESKTOP (1920x1080).
 */

import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { VibiumVerificationEngine } from '../src/vibium/vibium-runner.js';
import { VibiumExtremeSuite } from '../src/vibium/vibium-extreme-suite.js';
import { ScaleRecalibrator } from '../src/agent/scale-recalibrator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const BLUE = '\x1b[34m';
const BOLD = '\x1b[1m';

function logSuccess(msg) { console.log(`${GREEN}✓ ${msg}${RESET}`); }
function logError(msg) { console.error(`${RED}${BOLD}✗ ERROR: ${msg}${RESET}`); }
function logHeader(msg) { console.log(`\n${BOLD}${BLUE}========================================================================\n     ${msg}\n========================================================================${RESET}\n`); }

async function runVibiumSuite() {
  logHeader('EJECUCIÓN DE LA SUITE DE VERIFICACIÓN VIBIUM AGENTIC');

  const engine = new VibiumVerificationEngine({ port: 8088 });
  const extremeSuite = new VibiumExtremeSuite();

  // -------------------------------------------------------------
  // ESCENARIO 1: Normal / Probable Drift (Persona Natural)
  // -------------------------------------------------------------
  console.log(`${BOLD}=== VIBIUM: Escenario 1 (Data Drift Probable) ===${RESET}`);
  const s1Canonical = {
    analysis_unit: "natural_person",
    metadata: {
      dataset_id: "vibium_scenario_1",
      methodology_version: "2.1-Standard",
      currency: "USD_Nominal",
      sampling_year: 2027
    },
    provenance: { sources: [{ name: "UBS 2027", url: "https://ubs.com" }, { name: "Forbes 2027", url: "https://forbes.com" }] },
    global_metrics: {
      total_adult_population: 5400000000,
      wealth_median_usd: 11200,
      wealth_mean_usd: 91000,
      top_holder: { name: "Bernard Arnault & Family", estimated_net_worth_usd: 940000000000, type: "natural_person" },
      total_billionaires_count: 3100
    },
    distributions: [
      { pedagogical_role: "EXTREMO", percentile_range: { min: 99.9999, max: 100 }, population_percentage: 0.0001, net_worth_usd: { average: 940000000000, threshold_min: 1000000000, threshold_max: null }, entity_reference: { name: "Bernard Arnault & Family", type: "natural_person" } },
      { pedagogical_role: "CONTRASTE", percentile_range: { min: 99.9, max: 99.9999 }, population_percentage: 0.0999, net_worth_usd: { average: 1000000000, threshold_min: 50000000, threshold_max: 1000000000 } },
      { pedagogical_role: "CONTRASTE", percentile_range: { min: 99.0, max: 99.9 }, population_percentage: 0.9, net_worth_usd: { average: 4500000, threshold_min: 2000000, threshold_max: 50000000 } },
      { pedagogical_role: "CONTRASTE", percentile_range: { min: 90.0, max: 99.0 }, population_percentage: 9.0, net_worth_usd: { average: 1200000, threshold_min: 500000, threshold_max: 2000000 } },
      { pedagogical_role: "CONTRASTE", percentile_range: { min: 70.0, max: 90.0 }, population_percentage: 20.0, net_worth_usd: { average: 320000, threshold_min: 100000, threshold_max: 500000 } },
      { pedagogical_role: "CONTRASTE", percentile_range: { min: 50.0, max: 70.0 }, population_percentage: 20.0, net_worth_usd: { average: 42000, threshold_min: 11200, threshold_max: 100000 } },
      { pedagogical_role: "BASE", percentile_range: { min: 30.0, max: 50.0 }, population_percentage: 20.0, net_worth_usd: { average: 11200, threshold_min: 3000, threshold_max: 11200 } },
      { pedagogical_role: "BASE", percentile_range: { min: 0.0, max: 30.0 }, population_percentage: 30.0, net_worth_usd: { average: 2100, threshold_min: 0, threshold_max: 3000 } }
    ]
  };

  const s1Recalib = ScaleRecalibrator.recalibrate(s1Canonical);
  const s1Abstraction = {
    contract_version: "2.0.0",
    analysis_unit: "natural_person",
    title_es: "¿A qué altura vives?",
    title_en: "How high do you stand?",
    subtitle_es: `La distancia real entre la base y la cúspide es de ${s1Recalib.layers[0].formatted_height_label}`,
    subtitle_en: `The real distance between base and apex is ${s1Recalib.layers[0].formatted_height_label}`,
    semantic_concept_es: "Patrimonio neto personal por adulto (Net Worth per Adult)",
    semantic_concept_en: "Personal net worth per adult",
    scale_formula: {
      unit_value_usd: s1Recalib.formula_constants.step_usd_value,
      step_height_meters: s1Recalib.formula_constants.step_physical_height_meters
    },
    max_height_meters: s1Recalib.max_height_meters,
    layers: s1Recalib.layers.map(l => ({
      ...l,
      narrative: {
        headline_es: `${l.physical_reference.name_es} (${l.formatted_height_label})`,
        headline_en: `${l.physical_reference.name_en} (${l.formatted_height_label})`,
        caption_es: `Menos de 1 de cada 10 millones · USD $${Math.round(l.raw_magnitude / 1e9)}B · Altura: ${l.formatted_height_label}`,
        caption_en: `Fewer than 1 in 10 million · USD $${Math.round(l.raw_magnitude / 1e9)}B · Altitude: ${l.formatted_height_label}`,
        aria_es: `${l.physical_reference.name_es}: ${l.formatted_height_label}`,
        aria_en: `${l.physical_reference.name_en}: ${l.formatted_height_label}`
      }
    })),
    provenance: {
      dataset_id: "s1_dataset",
      summary_es: "UBS Global Wealth Report 2027 y Forbes Real-Time Billionaires.",
      summary_en: "UBS Global Wealth Report 2027 and Forbes Real-Time Billionaires.",
      sources: [{ name: "UBS 2027", url: "https://ubs.com" }],
      date_label_es: "UBS · dic 2027 · v2.1",
      date_label_en: "UBS · Dec 2027 · v2.1",
      limitations: [
        { code: "VALUATION", es: "Patrimonio neto individual = activos reales y financieros personales menos deudas.", en: "Individual net worth = personal real and financial assets minus liabilities." },
        { code: "INDIVIDUAL_SCOPE", es: "Unidad de análisis exclusiva: Personas naturales adultas.", en: "Exclusive analysis unit: Adult natural persons." },
        { code: "VOLATILITY", es: "Las fortunas en la cúspide fluctúan diariamente.", en: "Fortunes at the apex fluctuate daily." },
        { code: "LOGARITHMIC", es: "Escala proporcional desde centímetros a kilómetros.", en: "Proportional scale from centimeters to kilometers." }
      ]
    }
  };

  const s1Result = await engine.verifyScenario({
    scenarioId: "scenario-1",
    scenarioTitle: "Escenario 1: Normal / Probable Drift",
    canonicalData: s1Canonical,
    abstractionDoc: s1Abstraction,
    driftReport: { detected_drifts: [{ axis: "DATA_DRIFT", severity: "MEDIUM" }] }
  });

  assert.equal(s1Result.passed, true, "Escenario 1 debe pasar la verificación de Vibium.");
  assert.ok(fs.existsSync(s1Result.evidenceZip), "Debe existir artifacts/vibium/scenario-1/final-recording.zip");
  logSuccess(`Escenario 1 superado (Decisión: ${s1Result.decision}). Grabación guardada en: ${s1Result.evidenceZip}`);

  // -------------------------------------------------------------
  // ESCENARIO 2: Significant Data & Methodological Drift (PPP / 6 estratos)
  // -------------------------------------------------------------
  console.log(`\n${BOLD}=== VIBIUM: Escenario 2 (Methodological & Semantic Drift) ===${RESET}`);
  const s2Canonical = {
    analysis_unit: "natural_person",
    metadata: {
      dataset_id: "vibium_scenario_2",
      methodology_version: "3.0-PPP-Adjusted",
      currency: "USD_PPP_2028",
      sampling_year: 2028
    },
    provenance: { sources: [{ name: "WID.world 2028 PPP", url: "https://wid.world" }] },
    global_metrics: {
      total_adult_population: 5600000000,
      wealth_median_usd: 15400,
      wealth_mean_usd: 110000,
      top_holder: { name: "Larry Ellison", estimated_net_worth_usd: 1800000000000, type: "natural_person" },
      total_billionaires_count: 3200
    },
    distributions: [
      { pedagogical_role: "EXTREMO", percentile_range: { min: 99.99, max: 100 }, population_percentage: 0.01, net_worth_usd: { average: 1800000000000, threshold_min: 10000000000, threshold_max: null }, entity_reference: { name: "Larry Ellison", type: "natural_person" } },
      { pedagogical_role: "CONTRASTE", percentile_range: { min: 99.0, max: 99.99 }, population_percentage: 0.99, net_worth_usd: { average: 25000000, threshold_min: 5000000, threshold_max: 10000000000 } },
      { pedagogical_role: "CONTRASTE", percentile_range: { min: 90.0, max: 99.0 }, population_percentage: 9.0, net_worth_usd: { average: 2100000, threshold_min: 800000, threshold_max: 5000000 } },
      { pedagogical_role: "CONTRASTE", percentile_range: { min: 50.0, max: 90.0 }, population_percentage: 40.0, net_worth_usd: { average: 350000, threshold_min: 15400, threshold_max: 800000 } },
      { pedagogical_role: "BASE", percentile_range: { min: 20.0, max: 50.0 }, population_percentage: 30.0, net_worth_usd: { average: 15400, threshold_min: 4000, threshold_max: 15400 } },
      { pedagogical_role: "BASE", percentile_range: { min: 0.0, max: 20.0 }, population_percentage: 20.0, net_worth_usd: { average: 2500, threshold_min: 0, threshold_max: 4000 } }
    ]
  };

  const s2Recalib = ScaleRecalibrator.recalibrate(s2Canonical);
  const s2Abstraction = {
    contract_version: "2.0.0",
    analysis_unit: "natural_person",
    title_es: "¿A qué altura vives?",
    title_en: "How high do you stand?",
    subtitle_es: `La distancia real entre la base y la cúspide es de ${s2Recalib.layers[0].formatted_height_label}`,
    subtitle_en: `The real distance between base and apex is ${s2Recalib.layers[0].formatted_height_label}`,
    semantic_concept_es: "Patrimonio neto personal ajustado (PPP)",
    semantic_concept_en: "Personal net worth adjusted (PPP)",
    scale_formula: {
      unit_value_usd: s2Recalib.formula_constants.step_usd_value,
      step_height_meters: s2Recalib.formula_constants.step_physical_height_meters
    },
    max_height_meters: s2Recalib.max_height_meters,
    layers: s2Recalib.layers.map(l => ({
      ...l,
      narrative: {
        headline_es: `${l.physical_reference.name_es} (${l.formatted_height_label})`,
        headline_en: `${l.physical_reference.name_en} (${l.formatted_height_label})`,
        caption_es: `Estrato representativo con altura ${l.formatted_height_label} · USD $${l.raw_magnitude}`,
        caption_en: `Representative layer with height ${l.formatted_height_label} · USD $${l.raw_magnitude}`,
        aria_es: `${l.physical_reference.name_es}: ${l.formatted_height_label}`,
        aria_en: `${l.physical_reference.name_en}: ${l.formatted_height_label}`
      }
    })),
    provenance: {
      dataset_id: "s2_dataset",
      summary_es: "WID.world 2028 PPP Edition (Personas Naturales).",
      summary_en: "WID.world 2028 PPP Edition (Natural Persons).",
      sources: [{ name: "WID.world 2028 PPP", url: "https://wid.world" }],
      date_label_es: "WID · ene 2028 · v3.0-PPP",
      date_label_en: "WID · Jan 2028 · v3.0-PPP",
      limitations: [
        { code: "PPP_METHOD", es: "Ajuste por paridad de poder adquisitivo multirregional.", en: "Multi-regional purchasing power parity adjustment." },
        { code: "INDIVIDUAL_SCOPE", es: "Unidad de análisis exclusiva: Personas naturales adultas.", en: "Exclusive analysis unit: Adult natural persons." },
        { code: "VOLATILITY", es: "Fluctuación según mercados financieros globales.", en: "Fluctuation based on global financial markets." },
        { code: "LOGARITHMIC", es: "Escala proporcional desde centímetros a kilómetros.", en: "Proportional scale from centimeters to kilometers." }
      ]
    }
  };

  const s2Result = await engine.verifyScenario({
    scenarioId: "scenario-2",
    scenarioTitle: "Escenario 2: Methodological & Semantic Drift",
    canonicalData: s2Canonical,
    abstractionDoc: s2Abstraction,
    driftReport: { detected_drifts: [{ axis: "METHODOLOGICAL_DRIFT", severity: "HIGH" }, { axis: "SEMANTIC_DRIFT", severity: "MEDIUM" }] }
  });

  assert.equal(s2Result.passed, true, "Escenario 2 debe pasar la verificación de Vibium.");
  assert.ok(fs.existsSync(s2Result.evidenceZip), "Debe existir artifacts/vibium/scenario-2/final-recording.zip");
  logSuccess(`Escenario 2 superado (Decisión: ${s2Result.decision}). Grabación guardada en: ${s2Result.evidenceZip}`);

  // -------------------------------------------------------------
  // ESCENARIO 3: Chaotic / Adversarial Drift (Deuda y Quiebre)
  // -------------------------------------------------------------
  console.log(`\n${BOLD}=== VIBIUM: Escenario 3 (Chaotic / Adversarial Drift) ===${RESET}`);
  const s3Canonical = {
    analysis_unit: "natural_person",
    metadata: {
      dataset_id: "vibium_scenario_3",
      methodology_version: "Corrupted",
      currency: "USD_Nominal",
      sampling_year: 2029
    },
    provenance: { sources: [] },
    global_metrics: {
      total_adult_population: 5000000000,
      wealth_median_usd: -50000000,
      wealth_mean_usd: -20000000,
      top_holder: { name: "Void Entity", estimated_net_worth_usd: 0, type: "natural_person" },
      total_billionaires_count: 0
    },
    distributions: []
  };

  const s3Result = await engine.verifyScenario({
    scenarioId: "scenario-3",
    scenarioTitle: "Escenario 3: Chaotic / Adversarial Drift",
    canonicalData: s3Canonical,
    abstractionDoc: null,
    driftReport: { detected_drifts: [{ axis: "CONCEPTUAL_DRIFT", severity: "CRITICAL" }] }
  });

  assert.equal(s3Result.decision, "ABSTRACTION_LIMIT_REACHED", "Escenario 3 debe declarar ABSTRACTION_LIMIT_REACHED.");
  assert.ok(fs.existsSync(s3Result.evidenceZip), "Debe existir artifacts/vibium/scenario-3/final-recording.zip");
  logSuccess(`Escenario 3 bloqueado correctamente (Decisión: ${s3Result.decision}). Grabación guardada en: ${s3Result.evidenceZip}`);

  // -------------------------------------------------------------
  // PRUEBAS EXTREMAS (12 CASOS SINTÉTICOS)
  // -------------------------------------------------------------
  console.log(`\n${BOLD}=== VIBIUM: Suite de Pruebas Extremas (12 Casos Límite) ===${RESET}`);
  const extremeResults = await extremeSuite.runAllExtremeCases();
  
  let extremePassedCount = 0;
  extremeResults.forEach((r) => {
    if (r.passed) {
      extremePassedCount++;
      logSuccess(`Caso Extremo "${r.name}": Decisión "${r.decision}" conforme a lo esperado.`);
    } else {
      logError(`Caso Extremo "${r.name}": Decisión "${r.decision}" inesperada.`);
    }
  });

  assert.equal(extremePassedCount, 12, "Todos los 12 casos extremos deben cumplir el comportamiento esperado.");

  logHeader('✓ ¡SUITE VIBIUM SUPERADA CON ÉXITO IMPECABLE! (3/3 Escenarios + 12/12 Extremos)');
  process.exit(0);
}

runVibiumSuite().catch((err) => {
  logError(`Fallo crítico en suite Vibium: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});
