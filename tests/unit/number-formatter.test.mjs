/**
 * tests/unit/number-formatter.test.mjs
 * 
 * Tests unitarios obligatorios para el Módulo de Formato Numérico e Internacionalización (i18n).
 */

import assert from 'assert/strict';
import { NumberFormatter } from '../../src/i18n/number-formatter.js';

console.log('--- Corriendo Unit Tests: Number Formatter & i18n ---');

// 1. Test de Separadores Decimales y de Miles: ES vs EN
const num1 = 1748.5;
const formattedEs = NumberFormatter.formatNumber(num1, 'es', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formattedEn = NumberFormatter.formatNumber(num1, 'en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// En español: punto para miles, coma para decimales
assert.match(formattedEs, /^1\.748,50$/);
// En inglés: coma para miles, punto para decimales
assert.match(formattedEn, /^1,748\.50$/);
console.log(`✓ Separadores ES (${formattedEs}) vs EN (${formattedEn}) validados.`);

// 2. Test de Formato Monetario: Currency ≠ Locale
const currEs = NumberFormatter.formatCurrency(1748, 'USD', 'es');
const currEn = NumberFormatter.formatCurrency(1748, 'USD', 'en');
assert.equal(currEs, 'USD $1.748');
assert.equal(currEn, 'USD $1,748');
console.log(`✓ Moneda respetando locale: ES (${currEs}) vs EN (${currEn}).`);

// 3. Test de Abreviación de Magnitudes (k, M, B, Trillones)
const muskVal = 737500000000;
const magMuskEs = NumberFormatter.formatMagnitude(muskVal, 'es');
const magMuskEn = NumberFormatter.formatMagnitude(muskVal, 'en');
assert.equal(magMuskEs, '737,5B');
assert.equal(magMuskEn, '737.5B');

const millVal = 3700000;
assert.equal(NumberFormatter.formatMagnitude(millVal, 'es'), '3,7M');
assert.equal(NumberFormatter.formatMagnitude(millVal, 'en'), '3.7M');

const thouVal = 36000;
assert.equal(NumberFormatter.formatMagnitude(thouVal, 'es'), '36k');
assert.equal(NumberFormatter.formatMagnitude(thouVal, 'en'), '36k');
console.log('✓ Abreviaciones de magnitudes (k, M, B) validadas.');

// 4. Test de Alturas Físicas (km, m, cm)
const hOrbital = 13828125; // metros
const hOrbitalEs = NumberFormatter.formatHeight(hOrbital, 'es');
const hOrbitalEn = NumberFormatter.formatHeight(hOrbital, 'en');
assert.equal(hOrbitalEs.full_label, '13.828,13 km');
assert.equal(hOrbitalEn.full_label, '13,828.13 km');

const hStool = 0.675; // 67.5 cm
const hStoolEs = NumberFormatter.formatHeight(hStool, 'es');
const hStoolEn = NumberFormatter.formatHeight(hStool, 'en');
assert.equal(hStoolEs.full_label, '67,5 cm');
assert.equal(hStoolEn.full_label, '67.5 cm');

const hPebble = 0.032775; // 3.3 cm
const hPebbleEs = NumberFormatter.formatHeight(hPebble, 'es');
const hPebbleEn = NumberFormatter.formatHeight(hPebble, 'en');
assert.equal(hPebbleEs.full_label, '3,3 cm');
assert.equal(hPebbleEn.full_label, '3.3 cm');
console.log('✓ Alturas físicas con separadores localizados validadas.');

// 5. Test de Valores Límite: Cero, Negativos y Falsa Precisión
assert.equal(NumberFormatter.formatNumber(0, 'es'), '0');
assert.equal(NumberFormatter.formatNumber(0, 'en'), '0');

const negVal = -1500.5;
assert.equal(NumberFormatter.formatNumber(negVal, 'es', { minimumFractionDigits: 1 }), '-1.500,5');
assert.equal(NumberFormatter.formatNumber(negVal, 'en', { minimumFractionDigits: 1 }), '-1,500.5');

// 6. Test de Porcentajes
assert.equal(NumberFormatter.formatPercentage(40.7, 'es'), '40,7%');
assert.equal(NumberFormatter.formatPercentage(40.7, 'en'), '40.7%');
assert.equal(NumberFormatter.formatPercentage(0.00003, 'es'), '< 0,0001%');

console.log('✓ Unit Tests: Number Formatter superados con éxito.');
