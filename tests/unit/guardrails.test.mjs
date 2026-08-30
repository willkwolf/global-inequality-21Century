/**
 * tests/unit/guardrails.test.mjs
 */

import assert from 'assert/strict';
import { Guardrails } from '../../src/guardrails/guardrails.js';

console.log('--- Corriendo Unit Tests: Guardrails ---');

// 1. Pre-adaptation rejection of negative wealth
const preNegative = Guardrails.evaluatePreAdaptation(
  { epistemological_status: "ARCHITECTURAL_WARNING" },
  { global_metrics: { wealth_median_usd: -100, total_adult_population: 5000000000 }, distributions: [{}, {}, {}] }
);
assert.equal(preNegative.can_proceed, false);

// 2. Pre-adaptation rejection of non-natural persons
const preNonNatural = Guardrails.evaluatePreAdaptation(
  { epistemological_status: "VALID_ABSTRACTION" },
  {
    analysis_unit: "natural_person",
    global_metrics: {
      wealth_median_usd: 8000,
      total_adult_population: 5000000000,
      top_holder: { name: "Sovereign Fund of Norway", type: "fund", estimated_net_worth_usd: 1e12 }
    },
    distributions: [{}, {}, {}]
  }
);
assert.equal(preNonNatural.can_proceed, false);
assert.match(preNonNatural.failure_reason, /GUARDRAIL_BLOCKED_NON_NATURAL_PERSON/);

// 3. Pre-adaptation rejection of insufficient strata
const preFewStrata = Guardrails.evaluatePreAdaptation(
  { epistemological_status: "VALID_ABSTRACTION" },
  { global_metrics: { wealth_median_usd: 8000, total_adult_population: 5000000000 }, distributions: [{}] }
);
assert.equal(preFewStrata.can_proceed, false);

// 4. Post-adaptation rejection of non-monotonic heights
const postNonMonotonic = Guardrails.evaluatePostAdaptation({
  layers: [
    { layer_id: "s1", physical_height_meters: 100, narrative: { headline_es: "A", caption_es: "Cap A" } },
    { layer_id: "s2", physical_height_meters: 150, narrative: { headline_es: "B", caption_es: "Cap B" } }, // Broken order
    { layer_id: "s3", physical_height_meters: 10, narrative: { headline_es: "C", caption_es: "Cap C" } }
  ]
});
assert.equal(postNonMonotonic.passed, false);

// 5. Post-adaptation rejection of corrupt captions
const postCorruptCaption = Guardrails.evaluatePostAdaptation({
  layers: [
    { layer_id: "s1", physical_height_meters: 100, narrative: { headline_es: "A", caption_es: "undefined NaN" } },
    { layer_id: "s2", physical_height_meters: 50, narrative: { headline_es: "B", caption_es: "Cap B" } },
    { layer_id: "s3", physical_height_meters: 10, narrative: { headline_es: "C", caption_es: "Cap C" } }
  ]
});
assert.equal(postCorruptCaption.passed, false);

console.log('✓ Unit Tests: Guardrails superados.');
