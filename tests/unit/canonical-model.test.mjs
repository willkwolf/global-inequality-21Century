/**
 * tests/unit/canonical-model.test.mjs
 */

import assert from 'assert/strict';
import { CanonicalDataModel } from '../../src/canonical-model.js';
import { UbsSourceAdapter } from '../../src/adapters/ubs-adapter.js';
import { ForbesSourceAdapter } from '../../src/adapters/forbes-adapter.js';

console.log('--- Corriendo Unit Tests: Canonical Data Model ---');

const ubs = new UbsSourceAdapter();
const forbes = new ForbesSourceAdapter();

const ubsNorm = ubs.normalize({ report_date: '2024-12-31' });
const forbesNorm = forbes.normalize({ total_billionaires: 2891 });

const canonical = CanonicalDataModel.build({
  methodology_version: "2.0.0",
  adapter_fragments: [ubsNorm, forbesNorm]
});

assert.equal(canonical.schema_version, "2.0.0");
assert.equal(canonical.raw_sources.length, 2);
assert.equal(canonical.distributions.length, 8);
assert.equal(CanonicalDataModel.validate(canonical), true);

console.log('✓ Unit Tests: Canonical Data Model superados.');
