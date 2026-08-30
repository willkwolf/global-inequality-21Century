/**
 * tests/unit/drift-engine.test.mjs
 */

import assert from 'assert/strict';
import { DriftEngine } from '../../src/drift/drift-engine.js';

console.log('--- Corriendo Unit Tests: Drift Engine ---');

const baseline = {
  dataset_id: "base_001",
  methodology_version: "2.1.0",
  semantic_concept: "Patrimonio neto",
  global_metrics: {
    wealth_median_usd: 8910,
    top_holder: { name: "Elon Musk", type: "natural_person", estimated_net_worth_usd: 737500000000 }
  }
};

// 1. Test Data Drift
const dataDriftIncoming = {
  dataset_id: "drift_data_002",
  methodology_version: "2.1.0",
  semantic_concept: "Patrimonio neto",
  global_metrics: {
    wealth_median_usd: 12500, // > 5% change
    top_holder: { name: "Elon Musk", type: "natural_person", estimated_net_worth_usd: 850000000000 }
  }
};

const reportData = DriftEngine.analyze(baseline, dataDriftIncoming);
assert.equal(reportData.drift_summary.has_data_drift, true);
assert.equal(reportData.drift_summary.has_semantic_drift, false);

// 2. Test Semantic & Methodological Drift (Natural Person)
const semanticDriftIncoming = {
  dataset_id: "drift_sem_003",
  methodology_version: "3.0.0",
  semantic_concept: "Patrimonio neto ajustado (PPP)",
  global_metrics: {
    wealth_median_usd: 8910,
    top_holder: { name: "Larry Ellison", type: "natural_person", estimated_net_worth_usd: 737500000000 }
  }
};

const reportSemantic = DriftEngine.analyze(baseline, semanticDriftIncoming);
assert.equal(reportSemantic.drift_summary.has_methodological_drift, true);
assert.equal(reportSemantic.drift_summary.has_semantic_drift, true);

// 3. Test Conceptual Drift (Non-natural person rejection)
const nonPersonIncoming = {
  dataset_id: "drift_fund_004",
  methodology_version: "2.1.0",
  semantic_concept: "Patrimonio neto",
  global_metrics: {
    wealth_median_usd: 8910,
    top_holder: { name: "Kingdom Sovereign Wealth Fund", type: "fund", estimated_net_worth_usd: 1e12 }
  }
};

const reportNonPerson = DriftEngine.analyze(baseline, nonPersonIncoming);
assert.equal(reportNonPerson.drift_summary.has_conceptual_drift, true);
assert.equal(reportNonPerson.epistemological_status, "ABSTRACTION_FAILURE");

// 4. Test Conceptual Drift (Negative wealth)
const conceptualDriftIncoming = {
  dataset_id: "drift_concept_005",
  methodology_version: "2.1.0",
  semantic_concept: "Patrimonio neto",
  global_metrics: {
    wealth_median_usd: -500,
    top_holder: { name: "Negative Person", type: "natural_person", estimated_net_worth_usd: -1000 }
  }
};

const reportConcept = DriftEngine.analyze(baseline, conceptualDriftIncoming);
assert.equal(reportConcept.drift_summary.has_conceptual_drift, true);
assert.equal(reportConcept.epistemological_status, "ABSTRACTION_FAILURE");

console.log('✓ Unit Tests: Drift Engine superados.');
