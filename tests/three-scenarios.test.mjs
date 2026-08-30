/**
 * tests/three-scenarios.test.mjs
 * 
 * SUITE DE PRUEBAS DE LOS TRES ESCENARIOS (THREE-SCENARIO TEST SUITE)
 * 
 * Valida que la abstracción pedagógica sobrevive y se comporta correctamente ante:
 * - ESCENARIO 1: Data Drift Probable (evolución cuantitativa normal en Personas Naturales).
 * - ESCENARIO 2: Methodology & Semantic Drift (definición PPP, 6 estratos dinámicos, Personas Naturales).
 * - ESCENARIO 3: Chaotic / Adversarial Drift (valores negativos / intento de entidades jurídicas).
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert/strict';
import { JSDOM } from 'jsdom';
import { fileURLToPath } from 'url';

import { CanonicalDataModel } from '../src/canonical-model.js';
import { DriftEngine } from '../src/drift/drift-engine.js';
import { AiAdaptationAgent } from '../src/agent/ai-adapter.js';
import { HtmlCompiler } from '../src/renderer/html-compiler.js';
import { OpenWikiManager } from '../src/openwiki/openwiki-manager.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HTML_PATH = path.resolve(__dirname, '../Escala-visual-de-riqueza-mundial.html');

// Colores ANSI
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const BOLD = '\x1b[1m';

function logSuccess(msg) { console.log(`${GREEN}✓ ${msg}${RESET}`); }
function logWarning(msg) { console.log(`${YELLOW}⚠ ${msg}${RESET}`); }
function logError(msg) { console.error(`${RED}${BOLD}✗ ERROR: ${msg}${RESET}`); }
function logHeader(msg) { console.log(`\n${BOLD}${BLUE}=== ${msg} ===${RESET}`); }

console.log(`${BOLD}========================================================================${RESET}`);
console.log(`${BOLD}     EJECUCIÓN DE LA SUITE DE TRES ESCENARIOS (THREE-SCENARIO TEST)    ${RESET}`);
console.log(`${BOLD}========================================================================${RESET}`);

const rawTemplateHtml = fs.readFileSync(HTML_PATH, 'utf8');
const agent = new AiAdaptationAgent();

// Baseline canónico inicial
const baselineCanonical = CanonicalDataModel.build({
  methodology_version: "2.1.0",
  adapter_fragments: [
    {
      source_id: "ubs_2024",
      name: "UBS Global Wealth Report 2024",
      url: "https://ubs.com",
      report_date: "2024-12-31",
      payload_hash: "a1b2c3d4",
      metrics: {
        total_adult_population: 5360000000,
        wealth_median_usd: 8910,
        wealth_mean_usd: 87400
      },
      strata_distribution: [
        { stratum_key: "base", pedagogical_role: "BASE", percentile_range: { from: 0, to: 40.7 }, population_percentage: 40.7, net_worth_usd: { threshold_min: 0, threshold_max: 10000, average: 1748 } },
        { stratum_key: "median", pedagogical_role: "ESCALA", percentile_range: { from: 40.7, to: 50.0 }, population_percentage: 9.3, net_worth_usd: { threshold_min: 8654, threshold_max: 9167, average: 8910 } },
        { stratum_key: "majority", pedagogical_role: "CONTRASTE", percentile_range: { from: 50.0, to: 82.0 }, population_percentage: 41.3, net_worth_usd: { threshold_min: 10000, threshold_max: 100000, average: 36000 } },
        { stratum_key: "upper_middle", pedagogical_role: "CONTRASTE", percentile_range: { from: 82.0, to: 98.4 }, population_percentage: 16.4, net_worth_usd: { threshold_min: 100000, threshold_max: 1000000, average: 293000 } },
        { stratum_key: "threshold_1m", pedagogical_role: "CONTEXTO", percentile_range: { from: 98.4, to: 98.4001 }, population_percentage: 1.6, net_worth_usd: { threshold_min: 1000000, threshold_max: 1000000, average: 1000000 } },
        { stratum_key: "millionaires", pedagogical_role: "CONTEXTO", percentile_range: { from: 98.4, to: 99.9997 }, population_percentage: 1.6, net_worth_usd: { threshold_min: 1000000, threshold_max: 50000000, average: 3700000 } }
      ]
    },
    {
      source_id: "forbes_2026",
      name: "Forbes Billionaires",
      url: "https://forbes.com",
      report_date: "2026-05-01",
      payload_hash: "e5f6g7h8",
      metrics: {
        total_billionaires_count: 2891,
        top_holder: { name: "Elon Musk", type: "natural_person", estimated_net_worth_usd: 737500000000 }
      },
      strata_distribution: [
        { stratum_key: "billionaires", pedagogical_role: "EXTREMO", percentile_range: { from: 99.9997, to: 99.99999 }, population_percentage: 0.00003, net_worth_usd: { threshold_min: 1000000000, threshold_max: null, average: 1000000000 } },
        { stratum_key: "top_cusp", pedagogical_role: "EXTREMO", percentile_range: { from: 99.999999, to: 100 }, population_percentage: 0.0000001, net_worth_usd: { threshold_min: 636000000000, threshold_max: 839000000000, average: 737500000000 } }
      ]
    }
  ]
});

let testsPassed = 0;

async function runSuite() {
  // ------------------------------------------------------------------------------------------------
  // ESCENARIO 1: DATA DRIFT PROBABLE
  // ------------------------------------------------------------------------------------------------
  logHeader('TEST 1: Escenario 1 — Data Drift Probable');
  console.log('Simulando evolución natural: mediana sube a $11,200 USD, cúspide alcanza $940B USD con 3,100 billonarios...');

  const incomingScenario1 = CanonicalDataModel.build({
    methodology_version: "2.1.0",
    adapter_fragments: [
      {
        source_id: "ubs_2027",
        name: "UBS Global Wealth Report 2027",
        url: "https://ubs.com",
        report_date: "2027-06-30",
        payload_hash: "hash_s1_ubs",
        metrics: {
          total_adult_population: 5500000000,
          wealth_median_usd: 11200,
          wealth_mean_usd: 96000
        },
        strata_distribution: [
          { stratum_key: "base", pedagogical_role: "BASE", percentile_range: { from: 0, to: 38.5 }, population_percentage: 38.5, net_worth_usd: { threshold_min: 0, threshold_max: 12000, average: 2150 } },
          { stratum_key: "median", pedagogical_role: "ESCALA", percentile_range: { from: 38.5, to: 50.0 }, population_percentage: 11.5, net_worth_usd: { threshold_min: 10800, threshold_max: 11600, average: 11200 } },
          { stratum_key: "majority", pedagogical_role: "CONTRASTE", percentile_range: { from: 50.0, to: 80.0 }, population_percentage: 42.0, net_worth_usd: { threshold_min: 12000, threshold_max: 120000, average: 44000 } },
          { stratum_key: "upper_middle", pedagogical_role: "CONTRASTE", percentile_range: { from: 80.0, to: 98.0 }, population_percentage: 18.0, net_worth_usd: { threshold_min: 120000, threshold_max: 1000000, average: 340000 } },
          { stratum_key: "threshold_1m", pedagogical_role: "CONTEXTO", percentile_range: { from: 98.0, to: 98.0001 }, population_percentage: 2.0, net_worth_usd: { threshold_min: 1000000, threshold_max: 1000000, average: 1000000 } },
          { stratum_key: "millionaires", pedagogical_role: "CONTEXTO", percentile_range: { from: 98.0, to: 99.9997 }, population_percentage: 2.0, net_worth_usd: { threshold_min: 1000000, threshold_max: 60000000, average: 4200000 } }
        ]
      },
      {
        source_id: "forbes_2027",
        name: "Forbes Real-Time Billionaires 2027",
        url: "https://forbes.com",
        report_date: "2027-07-01",
        payload_hash: "hash_s1_forbes",
        metrics: {
          total_billionaires_count: 3100,
          top_holder: { name: "Bernard Arnault & Family", type: "natural_person", estimated_net_worth_usd: 940000000000 }
        },
        strata_distribution: [
          { stratum_key: "billionaires", pedagogical_role: "EXTREMO", percentile_range: { from: 99.9997, to: 99.99999 }, population_percentage: 0.00003, net_worth_usd: { threshold_min: 1000000000, threshold_max: null, average: 1200000000 } },
          { stratum_key: "top_cusp", pedagogical_role: "EXTREMO", percentile_range: { from: 99.999999, to: 100 }, population_percentage: 0.0000001, net_worth_usd: { threshold_min: 880000000000, threshold_max: 1000000000000, average: 940000000000 } }
        ]
      }
    ]
  });

  const result1 = await agent.process({
    baselineData: baselineCanonical,
    incomingData: incomingScenario1
  });

  assert.equal(result1.success, true, "El agente debe adaptar exitosamente el Escenario 1");
  assert.equal(result1.status, "ADAPTATION_SUCCESSFUL");
  assert.equal(result1.driftReport.drift_summary.has_data_drift, true, "Debe detectar Data Drift");
  assert.equal(result1.abstractionDoc.layers.length, 8, "Debe generar las 8 capas");
  
  // Compilar HTML y verificar con JSDOM
  const compiledHtml1 = HtmlCompiler.compile(rawTemplateHtml, result1.abstractionDoc, result1.storyModel);
  const dom1 = new JSDOM(compiledHtml1);
  const doc1 = dom1.window.document;

  const s1Headline = doc1.querySelector('#s1 .headline');
  assert.ok(s1Headline, "Debe existir #s1 en el HTML compilado");
  assert.match(s1Headline.textContent, /Bernard Arnault/i, "El titular debe adaptarse al nuevo poseedor de riqueza");

  const s1Num = doc1.querySelector('#s1 .num');
  assert.ok(s1Num.textContent.includes('km'), "La altura física debe estar expresada en kilómetros");

  logSuccess('Escenario 1 validado: Escala recalculada, storytelling adaptado y HTML compilado sin romper la abstracción.');
  testsPassed++;

  // ------------------------------------------------------------------------------------------------
  // ESCENARIO 2: METHODOLOGY & SEMANTIC DRIFT (NUEVA DEFINICIÓN PPP, 6 ESTRATOS DE PERSONAS NATURALES)
  // ------------------------------------------------------------------------------------------------
  logHeader('TEST 2: Escenario 2 — Data/Methodology/Semantic Drift');
  console.log('Simulando cambio metodológico y semántico: "Patrimonio neto ajustado (PPP)", 6 estratos y Persona Natural en la cúspide...');

  const incomingScenario2 = CanonicalDataModel.build({
    methodology_version: "3.0-PPP-Adjusted",
    semantic_concept: "Patrimonio neto personal ajustado por poder adquisitivo (PPP)",
    adapter_fragments: [
      {
        source_id: "wid_academic_2028",
        name: "World Inequality Database 2028 (PPP Edition)",
        url: "https://wid.world",
        report_date: "2028-01-15",
        payload_hash: "hash_s2_wid",
        metrics: {
          total_adult_population: 5600000000,
          wealth_median_usd: 14500,
          wealth_mean_usd: 110000,
          currency_basis: "USD_PPP_2028",
          top_holder: {
            name: "Larry Ellison",
            type: "natural_person",
            estimated_net_worth_usd: 1250000000000
          }
        },
        strata_distribution: [
          { stratum_key: "base_ppp", pedagogical_role: "BASE", percentile_range: { from: 0, to: 45.0 }, population_percentage: 45.0, net_worth_usd: { threshold_min: 0, threshold_max: 15000, average: 3200 } },
          { stratum_key: "median_ppp", pedagogical_role: "ESCALA", percentile_range: { from: 45.0, to: 55.0 }, population_percentage: 10.0, net_worth_usd: { threshold_min: 13500, threshold_max: 15500, average: 14500 } },
          { stratum_key: "middle_ppp", pedagogical_role: "CONTRASTE", percentile_range: { from: 55.0, to: 95.0 }, population_percentage: 40.0, net_worth_usd: { threshold_min: 15500, threshold_max: 450000, average: 180000 } },
          { stratum_key: "high_net_ppp", pedagogical_role: "CONTEXTO", percentile_range: { from: 95.0, to: 99.9 }, population_percentage: 4.9, net_worth_usd: { threshold_min: 450000, threshold_max: 10000000, average: 2500000 } },
          { stratum_key: "billionaires_tier", pedagogical_role: "EXTREMO", percentile_range: { from: 99.9, to: 99.9999 }, population_percentage: 0.0999, net_worth_usd: { threshold_min: 1000000000, threshold_max: null, average: 1500000000 } },
          { stratum_key: "apex_individual", pedagogical_role: "EXTREMO", percentile_range: { from: 99.99999, to: 100 }, population_percentage: 0.00001, net_worth_usd: { threshold_min: 1100000000000, threshold_max: 1400000000000, average: 1250000000000 } }
        ]
      }
    ]
  });

  const result2 = await agent.process({
    baselineData: baselineCanonical,
    incomingData: incomingScenario2
  });

  assert.equal(result2.success, true, "El agente debe adaptar exitosamente el Escenario 2");
  assert.equal(result2.driftReport.drift_summary.has_methodological_drift, true, "Debe detectar Methodological Drift");
  assert.equal(result2.driftReport.drift_summary.has_semantic_drift, true, "Debe detectar Semantic Drift");
  assert.equal(result2.abstractionDoc.layers.length, 6, "Debe soportar exactamente 6 estratos");

  const compiledHtml2 = HtmlCompiler.compile(rawTemplateHtml, result2.abstractionDoc, result2.storyModel);
  const dom2 = new JSDOM(compiledHtml2);
  const doc2 = dom2.window.document;

  const renderedSections = doc2.querySelectorAll('main > section.snap');
  // s0 (splash) + 6 estratos = 7 secciones snap en total
  assert.equal(renderedSections.length, 7, "Debe renderizar s0 + 6 estratos = 7 secciones");

  const dotButtons = doc2.querySelectorAll('#a11y-dot-nav button.a11y-dot');
  assert.equal(dotButtons.length, 7, "La barra de navegación lateral debe contener exactamente 7 puntos");

  const s1Apex = doc2.querySelector('#s1 .headline');
  assert.match(s1Apex.textContent, /Larry Ellison/i, "El headline debe reflejar a la persona natural en la cúspide");

  logSuccess('Escenario 2 validado: Metodología y semántica adaptadas, 6 estratos de personas naturales generados dinámicamente.');
  testsPassed++;

  // ------------------------------------------------------------------------------------------------
  // ESCENARIO 3: CHAOTIC / ADVERSARIAL DRIFT (VALORES NEGATIVOS Y QUIEBRE EPISTEMOLÓGICO)
  // ------------------------------------------------------------------------------------------------
  logHeader('TEST 3: Escenario 3 — Chaotic / Adversarial Drift');
  console.log('Simulando datos adversariales/corruptos: Mediana negativa de -$8,500 USD (deuda total)...');

  const incomingScenario3 = {
    schema_version: "2.1.0",
    analysis_unit: "natural_person",
    dataset_id: "chaotic_payload_3",
    retrieved_at: new Date().toISOString(),
    methodology_version: "chaotic-v99",
    raw_sources: [{ source_id: "corrupt", name: "Corrupted Feed", url: "http://bad.data", payload_hash: "badhash" }],
    global_metrics: {
      total_adult_population: 5000000000,
      wealth_median_usd: -8500, // Mediana negativa: rompe el anclaje físico de altura
      top_holder: { name: "Void Person", type: "natural_person", estimated_net_worth_usd: -50000 }
    },
    distributions: [
      { stratum_key: "bad_s1", pedagogical_role: "BASE", percentile_range: { from: 0, to: 100 }, population_percentage: 100, net_worth_usd: { threshold_min: -8500, threshold_max: -8500, average: -8500 } }
    ]
  };

  const result3 = await agent.process({
    baselineData: baselineCanonical,
    incomingData: incomingScenario3
  });

  assert.equal(result3.success, false, "El sistema NO debe publicar ante quiebre epistemológico");
  assert.equal(result3.status, "ADAPTATION_FAILED");
  assert.equal(result3.requires_human_review, true, "Debe exigir revisión humana");
  assert.ok(result3.reason.includes("Mediana de riqueza") || result3.reason.includes("abstracción"), "Debe explicar el motivo de la detención");

  // Registrar advertencia en OpenWiki
  OpenWikiManager.recordWarning({
    title: "Mediana Negativa detectada en Escenario 3",
    description: result3.reason,
    recommendation: "Conservar la publicación previa y abrir investigación metodológica con expertos.",
    triggerEvent: "Test de Robustez Adversarial Escenario 3",
    requiresHumanReview: true
  });

  logSuccess('Escenario 3 validado: El sistema detuvo la publicación ante quiebre de la abstracción y emitió ADAPTATION_FAILED.');
  testsPassed++;

  console.log(`\n${GREEN}${BOLD}========================================================================${RESET}`);
  console.log(`${GREEN}${BOLD}     ✓ ¡SUITE SUPERADA! 3/3 ESCENARIOS EJECUTADOS CON ÉXITO IMPECABLE  ${RESET}`);
  console.log(`${GREEN}${BOLD}========================================================================${RESET}\n`);
}

runSuite().catch(err => {
  logError(`Fallo crítico en Three-Scenario Test Suite: ${err.message}\n${err.stack}`);
  process.exit(1);
});
