/**
 * tests/unit/scale-recalibrator.test.mjs
 */

import assert from 'assert/strict';
import { ScaleRecalibrator } from '../../src/agent/scale-recalibrator.js';

console.log('--- Corriendo Unit Tests: Scale Recalibrator ---');

// Test format height
assert.deepEqual(ScaleRecalibrator.formatHeight(15731000), { num: "15,731", unit: "km", label: "15,731 km" });
assert.deepEqual(ScaleRecalibrator.formatHeight(18750), { num: "18.75", unit: "km", label: "18.75 km" });
assert.deepEqual(ScaleRecalibrator.formatHeight(70.8), { num: "70.8", unit: "m", label: "70.8 m" });
assert.deepEqual(ScaleRecalibrator.formatHeight(0.17), { num: "17", unit: "cm", label: "17 cm" });
assert.deepEqual(ScaleRecalibrator.formatHeight(0.033), { num: "3.3", unit: "cm", label: "3.3 cm" });

// Test physical references
const refOrbit = ScaleRecalibrator.selectPhysicalReference(15000000);
assert.ok(refOrbit.name_es.includes("Satélite"));

const refBuilding = ScaleRecalibrator.selectPhysicalReference(70);
assert.ok(refBuilding.name_es.includes("Edificio"));

const refStep = ScaleRecalibrator.selectPhysicalReference(0.17);
assert.ok(refStep.name_es.includes("escalón"));

console.log('✓ Unit Tests: Scale Recalibrator superados.');
