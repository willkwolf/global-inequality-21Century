/**
 * tests/unit/temporal-normalization.test.mjs
 * 
 * Test de normalización temporal y año objetivo dinámico (AÑO OBJETIVO = AÑO PRESENTE).
 */

import assert from 'assert/strict';
import { NumberFormatter } from '../../src/i18n/number-formatter.js';

console.log('--- Corriendo Unit Tests: Temporal Normalization ---');

// 1. Verificar que target_year se deriva dinámicamente del runtime
const currentYear = new Date().getFullYear();
assert.equal(NumberFormatter.getCurrentYear(), currentYear);
assert(typeof currentYear === 'number');
assert(currentYear >= 2026);

// 2. Verificar contexto temporal
const temporalContext = NumberFormatter.getTemporalContext("2024-12-31");
assert.equal(temporalContext.source_date, "2024-12-31");
assert.equal(temporalContext.target_year, currentYear);
assert.match(temporalContext.current_date, /^\d{4}-\d{2}-\d{2}$/);

console.log(`✓ Contexto temporal verificado: Source (${temporalContext.source_date}) → Target Year (${temporalContext.target_year}) [Runtime dinámico].`);
console.log('✓ Unit Tests: Temporal Normalization superados con éxito.');
