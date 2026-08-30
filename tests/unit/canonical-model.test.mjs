/**
 * tests/unit/canonical-model.test.mjs
 */

import assert from 'assert/strict';
import { CanonicalDataModel } from '../../src/canonical-model.js';
import { UbsSourceAdapter } from '../../src/adapters/ubs-adapter.js';
import { ForbesSourceAdapter } from '../../src/adapters/forbes-adapter.js';
import { EntityFilter } from '../../src/domain/domain-definition.js';

console.log('--- Corriendo Unit Tests: Canonical Data Model & EntityFilter ---');

// 1. Validar EntityFilter
const personCheck = EntityFilter.classifyEntity({ name: "Elon Musk", type: "natural_person" });
assert.equal(personCheck.is_natural_person, true, "Persona natural debe ser aceptada");

const fundCheck = EntityFilter.classifyEntity({ name: "Global Sovereign AI Wealth Fund", type: "fund" });
assert.equal(fundCheck.is_natural_person, false, "Fondo soberano debe ser rechazado");

const corpCheck = EntityFilter.classifyEntity({ name: "MegaCorp Inc.", type: "organization" });
assert.equal(corpCheck.is_natural_person, false, "Corporación debe ser rechazada");

// 2. Construcción del modelo canónico
const ubs = new UbsSourceAdapter();
const forbes = new ForbesSourceAdapter();

const ubsNorm = ubs.normalize({ report_date: '2024-12-31' });
const forbesNorm = forbes.normalize({ total_billionaires: 2891 });

const canonical = CanonicalDataModel.build({
  methodology_version: "2.1.0",
  adapter_fragments: [ubsNorm, forbesNorm]
});

assert.equal(canonical.schema_version, "2.1.0");
assert.equal(canonical.analysis_unit, "natural_person");
assert.equal(canonical.raw_sources.length, 2);
assert.equal(canonical.distributions.length, 8);
assert.equal(CanonicalDataModel.validate(canonical), true);

// 3. Verificar que una entidad no natural en el canonical model lance error
assert.throws(() => {
  CanonicalDataModel.build({
    methodology_version: "2.1.0",
    adapter_fragments: [
      {
        source_id: "invalid_source",
        name: "Invalid State Source",
        url: "https://state.org",
        metrics: {
          top_holder: { name: "Kingdom of Wealth Sovereign Fund", type: "fund", estimated_net_worth_usd: 1e12 }
        }
      }
    ]
  });
}, /EntityFilter Error/, "Debe lanzar error al intentar inyectar un fondo/estado");

console.log('✓ Unit Tests: Canonical Data Model & EntityFilter superados.');
