/**
 * tests/calibration-stress-test.mjs
 * 
 * SUITE DE ESTRÉS Y SIMULACIÓN MATEMÁTICA: CALIBRACIÓN DEL ESCALÓN PATRÓN
 * 
 * Audita y compara 6 métodos de calibración económica frente a 10 regímenes
 * distributivos extremos para verificar interpretabilidad, colapso de escala y
 * robustez atemporal.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NumberFormatter } from '../src/i18n/number-formatter.js';

const STEP_PHYSICAL_HEIGHT = 0.15; // 15 cm invariante físico

// 6 Métodos de Calibración
const CALIBRATION_METHODS = {
  // M0: Fijo histórico hardcodeado (Línea Base anterior)
  M0_FIXED_8K: (dist) => 8000,

  // M1: Mediana pura exacta
  M1_EXACT_MEDIAN: (dist) => dist.median_wealth || 8910,

  // M2: Mediana redondeada al millar más cercano
  M2_ROUNDED_MEDIAN_1K: (dist) => {
    const med = dist.median_wealth || 8910;
    if (med <= 100) return med;
    if (med <= 1000) return Math.round(med / 100) * 100;
    return Math.round(med / 1000) * 1000;
  },

  // M3: Promedio de la base inferior (p0-p40)
  M3_BASE_MEAN: (dist) => dist.base_average_wealth || 1748,

  // M4: Percentil 25 (P25 - Primer cuartil)
  M4_P25_QUARTILE: (dist) => dist.p25_wealth || (dist.median_wealth * 0.3),

  // M5: Calibración Canónica Dinámica (Significant Order of Magnitude)
  M5_SIGNIFICANT_MAGNITUDE: (dist) => {
    const med = dist.median_wealth || 8910;
    if (med <= 0) return 1;
    const magnitude = Math.pow(10, Math.floor(Math.log10(med)));
    const normalized = med / magnitude;
    let roundedMultiplier = 1;
    if (normalized >= 7.5) roundedMultiplier = 10;
    else if (normalized >= 3.5) roundedMultiplier = 5;
    else if (normalized >= 1.75) roundedMultiplier = 2;
    else roundedMultiplier = 1;
    return roundedMultiplier * magnitude;
  }
};

// 10 Regímenes Macroeconómicos Extremos
const REGIMES = [
  {
    id: "R1_BASELINE_2024",
    name: "Baseline Oficial UBS 2024 / Forbes 2026",
    median_wealth: 8910,
    base_average_wealth: 1748,
    p25_wealth: 2800,
    p90_wealth: 293000,
    p99_wealth: 3700000,
    top_apex_wealth: 737500000000 // 737.5B Elon Musk
  },
  {
    id: "R2_HYPERINFLATION_10X",
    name: "Hiperinflación / Expansión Monetaria 10x",
    median_wealth: 89100,
    base_average_wealth: 17480,
    p25_wealth: 28000,
    p90_wealth: 2930000,
    p99_wealth: 37000000,
    top_apex_wealth: 7375000000000 // 7.375 Trillones
  },
  {
    id: "R3_REAL_GROWTH_3X",
    name: "Crecimiento Económico Real Global 3x",
    median_wealth: 26730,
    base_average_wealth: 5244,
    p25_wealth: 8400,
    p90_wealth: 879000,
    p99_wealth: 11100000,
    top_apex_wealth: 2212500000000
  },
  {
    id: "R4_RADICAL_EGALITARIAN",
    name: "Gran Igualación Global (Gini 0.15)",
    median_wealth: 45000,
    base_average_wealth: 30000,
    p25_wealth: 38000,
    p90_wealth: 65000,
    p99_wealth: 95000,
    top_apex_wealth: 250000 // Máximo millonario modesto
  },
  {
    id: "R5_HYPER_INEQUALITY_FEUDAL",
    name: "Hiperdesigualdad Feudal-Digital Extrema (Gini 0.98)",
    median_wealth: 1200,
    base_average_wealth: 80,
    p25_wealth: 250,
    p90_wealth: 1500000,
    p99_wealth: 450000000,
    top_apex_wealth: 15000000000000 // 15 Trillones
  },
  {
    id: "R6_GREAT_DEPRESSION_CRASH",
    name: "Colapso y Gran Deflación Patrimonial (-60%)",
    median_wealth: 3564,
    base_average_wealth: 699,
    p25_wealth: 1120,
    p90_wealth: 117200,
    p99_wealth: 1480000,
    top_apex_wealth: 295000000000
  },
  {
    id: "R7_EXTREME_POVERTY_COLLAPSE",
    name: "Economía de Subsistencia Global (Mediana Crítica)",
    median_wealth: 150,
    base_average_wealth: 15,
    p25_wealth: 40,
    p90_wealth: 5000,
    p99_wealth: 80000,
    top_apex_wealth: 50000000
  },
  {
    id: "R8_BITCOIN_DENOMINATED",
    name: "Moneda de Alto Valor Unitario (Denominación en BTC)",
    median_wealth: 0.12, // 0.12 BTC
    base_average_wealth: 0.023,
    p25_wealth: 0.038,
    p90_wealth: 3.95,
    p99_wealth: 49.8,
    top_apex_wealth: 9800000
  },
  {
    id: "R9_ASYMMETRIC_MIDDLE_COLLAPSE",
    name: "Polarización Asimétrica (Mediana se hunde, Top explota)",
    median_wealth: 2500,
    base_average_wealth: 400,
    p25_wealth: 800,
    p90_wealth: 1200000,
    p99_wealth: 15000000,
    top_apex_wealth: 2500000000000
  },
  {
    id: "R10_FUTURE_YEAR_2050",
    name: "Proyección Año 2050 (Inflación + Crecimiento Acumulado)",
    median_wealth: 28500,
    base_average_wealth: 5500,
    p25_wealth: 9200,
    p90_wealth: 950000,
    p99_wealth: 12500000,
    top_apex_wealth: 3200000000000
  }
];

function evaluateScale(methodFn, regime) {
  const stepUsd = methodFn(regime);
  if (!stepUsd || stepUsd <= 0) return { valid: false, reason: "División por cero o no positivo" };

  const medianHeightMeters = (regime.median_wealth / stepUsd) * STEP_PHYSICAL_HEIGHT;
  const baseHeightMeters = (regime.base_average_wealth / stepUsd) * STEP_PHYSICAL_HEIGHT;
  const apexHeightMeters = (regime.top_apex_wealth / stepUsd) * STEP_PHYSICAL_HEIGHT;

  // Criterios de legibilidad perceptual y cognitiva:
  // 1. La mediana debe estar en escala humana accesible (entre 5 cm y 1.5 metros)
  const medianIntuitiveness = medianHeightMeters >= 0.05 && medianHeightMeters <= 1.5;
  
  // 2. La base debe ser visible/distinguible del suelo (mínimo 0.1 mm = 0.0001 m)
  const baseDiscernibility = baseHeightMeters >= 0.0001;

  // 3. El ratio entre mediana y escalón (cuántos escalones representa la mediana)
  const stepsForMedian = regime.median_wealth / stepUsd;

  return {
    valid: true,
    step_usd_value: stepUsd,
    median_height_cm: (medianHeightMeters * 100).toFixed(2),
    base_height_cm: (baseHeightMeters * 100).toFixed(2),
    apex_height_km: (apexHeightMeters / 1000).toFixed(2),
    steps_for_median: stepsForMedian.toFixed(2),
    median_intuitiveness: medianIntuitiveness,
    base_discernibility: baseDiscernibility
  };
}

test('Simulación y Auditoría de Estrés de los 6 Métodos de Calibración', () => {
  console.log('\n========================================================================================');
  console.log('              AUDITORÍA MATEMÁTICA Y MATRIZ DE ESTRÉS MULTI-RÉGIMEN');
  console.log('========================================================================================\n');

  const methodKeys = Object.keys(CALIBRATION_METHODS);
  const results = {};

  methodKeys.forEach(mKey => {
    results[mKey] = {
      passedRegimes: 0,
      totalRegimes: REGIMES.length,
      failures: []
    };
  });

  REGIMES.forEach(regime => {
    console.log(`\n📌 [RÉGIMEN: ${regime.id}] ${regime.name}`);
    console.log(`   Mediana: $${regime.median_wealth} | Base Prom: $${regime.base_average_wealth} | Cúspide: $${regime.top_apex_wealth}`);
    console.log('   -------------------------------------------------------------------------------------');

    methodKeys.forEach(mKey => {
      const res = evaluateScale(CALIBRATION_METHODS[mKey], regime);
      if (res.valid && res.median_intuitiveness && res.base_discernibility) {
        results[mKey].passedRegimes++;
        console.log(`   ✓ [${mKey.padEnd(24)}] 1 Escalón = $${String(res.step_usd_value).padEnd(8)} | Mediana: ${res.median_height_cm.padStart(6)} cm (${res.steps_for_median} esc) | Cúspide: ${res.apex_height_km.padStart(10)} km`);
      } else {
        const failReason = !res.valid ? res.reason : (!res.median_intuitiveness ? `Mediana colapsó a ${res.median_height_cm} cm` : `Base invisible (${res.base_height_cm} cm)`);
        results[mKey].failures.push({ regime: regime.id, reason: failReason });
        console.log(`   ✗ [${mKey.padEnd(24)}] FALLO: ${failReason}`);
      }
    });
  });

  console.log('\n========================================================================================');
  console.log('              RESUMEN COMPARATIVO DE RESILIENCIA MATEMÁTICA');
  console.log('========================================================================================');

  methodKeys.forEach(mKey => {
    const r = results[mKey];
    const scorePct = ((r.passedRegimes / r.totalRegimes) * 100).toFixed(0);
    console.log(`• ${mKey.padEnd(25)}: ${r.passedRegimes}/${r.totalRegimes} regímenes superados (${scorePct}%)`);
    if (r.failures.length > 0) {
      r.failures.forEach(f => console.log(`    ↳ Falló en ${f.regime}: ${f.reason}`));
    }
  });
  console.log('========================================================================================\n');

  // M0 (Hardcoded $8k) DEBE fallar en regímenes con inflación (R2), deflación (R7), monedas no USD (R8)
  assert.ok(results.M0_FIXED_8K.failures.length >= 3, 'M0_FIXED_8K debe fallar en regímenes con drift temporal/monetario');

  // M1 (Mediana Pura) y M2 (Mediana Redondeada) deben superar el 100% de los regímenes monetarios
  assert.equal(results.M1_EXACT_MEDIAN.passedRegimes, 10, 'M1_EXACT_MEDIAN debe superar todos los regímenes');
  assert.equal(results.M2_ROUNDED_MEDIAN_1K.passedRegimes, 10, 'M2_ROUNDED_MEDIAN_1K debe superar todos los regímenes');
});
