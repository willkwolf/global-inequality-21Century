/**
 * tests/unit/guardrails.test.mjs
 */

import assert from 'assert/strict';
import { Guardrails } from '../../src/guardrails/guardrails.js';

console.log('--- Corriendo Unit Tests: Guardrails ---');

// Pre-adaptation rejection of negative wealth
const preNegative = Guardrails.evaluatePreAdaptation(
  { epistemological_status: "ARCHITECTURAL_WARNING" },
  { global_metrics: { wealth_median_usd: -100, total_adult_population: 5000000000 }, distributions: [{}, {}, {}] }
);
assert.equal(preNegative.can_proceed, false);

// Pre-adaptation rejection of insufficient strata
const preFewStrata = Guardrails.evaluatePreAdaptation(
  { epistemological_status: "VALID_ABSTRACTION" },
  { global_metrics: { wealth_median_usd: 8000, total_adult_population: 5000000000 }, distributions: [{}] }
);
assert.equal(preFewStrata.can_proceed, false);

// Post-adaptation rejection of non-monotonic heights
const postNonMonotonic = Guardrails.evaluatePostAdaptation({
  layers: [
    { layer_id: "s1", physical_height_meters: 100, narrative: { headline_es: "A" } },
    { layer_id: "s2", physical_height_meters: 150, narrative: { headline_es: "B" } }, // Broken order
    { layer_id: "s3", physical_height_meters: 10, narrative: { headline_es: "C" } }
  ]
});
assert.equal(postNonMonotonic.passed, false);

console.log('✓ Unit Tests: Guardrails superados.');
