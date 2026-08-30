/**
 * tests/unit/scale-recalibrator.test.mjs
 */

import assert from 'assert/strict';
import { ScaleRecalibrator } from '../../src/agent/scale-recalibrator.js';

console.log('--- Corriendo Unit Tests: Scale Recalibrator ---');

// Test format height en español (ES)
assert.deepEqual(ScaleRecalibrator.formatHeight(15731000, 'es'), { num: "15.731", unit: "km", label: "15.731 km" });
assert.deepEqual(ScaleRecalibrator.formatHeight(18750, 'es'), { num: "18,75", unit: "km", label: "18,75 km" });
assert.deepEqual(ScaleRecalibrator.formatHeight(70.8, 'es'), { num: "70,8", unit: "m", label: "70,8 m" });
assert.deepEqual(ScaleRecalibrator.formatHeight(0.17, 'es'), { num: "17", unit: "cm", label: "17 cm" });
assert.deepEqual(ScaleRecalibrator.formatHeight(0.033, 'es'), { num: "3,3", unit: "cm", label: "3,3 cm" });

// Test format height en inglés (EN)
assert.deepEqual(ScaleRecalibrator.formatHeight(15731000, 'en'), { num: "15,731", unit: "km", label: "15,731 km" });
assert.deepEqual(ScaleRecalibrator.formatHeight(18750, 'en'), { num: "18.75", unit: "km", label: "18.75 km" });
assert.deepEqual(ScaleRecalibrator.formatHeight(70.8, 'en'), { num: "70.8", unit: "m", label: "70.8 m" });
assert.deepEqual(ScaleRecalibrator.formatHeight(0.17, 'en'), { num: "17", unit: "cm", label: "17 cm" });
assert.deepEqual(ScaleRecalibrator.formatHeight(0.033, 'en'), { num: "3.3", unit: "cm", label: "3.3 cm" });

// Test physical references
const refOrbit = ScaleRecalibrator.selectPhysicalReference(15000000);
assert.ok(refOrbit.name_es.includes("Satélite"));

const refBuilding = ScaleRecalibrator.selectPhysicalReference(70);
assert.ok(refBuilding.name_es.includes("Edificio"));

const refStep = ScaleRecalibrator.selectPhysicalReference(0.17);
assert.ok(refStep.name_es.includes("escalón"));

console.log('✓ Unit Tests: Scale Recalibrator superados.');
