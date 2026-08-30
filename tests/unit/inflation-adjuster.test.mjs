/**
 * tests/unit/inflation-adjuster.test.mjs
 * 
 * Tests unitarios para el módulo de ajuste inflacionario dinámico (CPI-U).
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { InflationAdjuster } from '../../src/i18n/inflation-adjuster.js';
import { NumberFormatter } from '../../src/i18n/number-formatter.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const DATA_PATH = path.resolve(__dirname, '../../OpenWiki/spec/data.json');

test('InflationAdjuster.getInflationFactor — Cálculo correcto de factores acumulados', () => {
  // Mismo año -> Factor 1.0
  assert.equal(InflationAdjuster.getInflationFactor(2026, 2026), 1.0);
  assert.equal(InflationAdjuster.getInflationFactor(2027, 2026), 1.0);

  // 2024 -> 2025: (1 + 0.028) = 1.028
  assert.equal(InflationAdjuster.getInflationFactor(2024, 2025), 1.028);

  // 2024 -> 2026: (1 + 0.028) * (1 + 0.025) = 1.028 * 1.025 = 1.0537
  const factor2026 = InflationAdjuster.getInflationFactor(2024, 2026);
  assert.equal(factor2026, 1.0537);

  // 2024 -> 2027: 1.0537 * (1 + 0.024) = 1.0789888 -> 1.079
  const factor2027 = InflationAdjuster.getInflationFactor(2024, 2027);
  assert.ok(factor2027 > 1.07 && factor2027 < 1.09);
});

test('InflationAdjuster.adjustValue — Ajuste proporcional de montos', () => {
  const nominal = 1000;
  const adjusted = InflationAdjuster.adjustValue(nominal, 2024, 2026);
  assert.equal(adjusted, 1054); // 1000 * 1.0537 = 1053.7 -> 1054
});

test('InflationAdjuster.buildDualModel — Generación coherente del modelo dual Nominal vs Valor Presente', () => {
  const rawData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const dualModel = InflationAdjuster.buildDualModel(rawData, 2026);

  assert.equal(dualModel.source_year, 2024);
  assert.equal(dualModel.target_year, 2026);
  assert.equal(dualModel.inflation_factor, 1.0537);

  // 1. Modelo Nominal
  assert.equal(dualModel.nominal.is_present_value, false);
  assert.equal(dualModel.nominal.currency_prefix, "USD");
  assert.equal(dualModel.nominal.factor, 1.0);
  assert.ok(dualModel.nominal.strata[0].badge_es.includes("Nominal"));
  assert.ok(dualModel.nominal.strata[0].badge_en.includes("Nominal"));

  // 2. Modelo Valor Presente
  assert.equal(dualModel.present_value.is_present_value, true);
  assert.equal(dualModel.present_value.currency_prefix, "USD*");
  assert.equal(dualModel.present_value.factor, 1.0537);
  assert.ok(dualModel.present_value.strata[0].badge_es.includes("* Valor presente (2026)"));
  assert.ok(dualModel.present_value.strata[0].badge_en.includes("* Present value (2026)"));

  // 3. Verificación de incremento en la mediana s7
  const nominalS7 = dualModel.nominal.strata.find(s => s.id === 's7');
  const pvS7 = dualModel.present_value.strata.find(s => s.id === 's7');

  assert.equal(nominalS7.net_worth_usd.average, 8910);
  assert.equal(pvS7.net_worth_usd.average, Math.round(8910 * 1.0537)); // 9388
  assert.ok(pvS7.height_meters > nominalS7.height_meters);
});
