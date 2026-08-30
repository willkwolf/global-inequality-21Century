/**
 * src/i18n/inflation-adjuster.js
 * 
 * MÓDULO DE NORMALIZACIÓN INFLACIONARIA DINÁMICA (CPI-U)
 * 
 * PROPÓSITO:
 * Permite convertir datos nominales históricos de riqueza (ej. corte UBS 2024)
 * a su valor presente equivalente en el año de ejecución (ej. 2026) mediante
 * el índice acumulado de inflación de EE.UU. (CPI-U / Consumer Price Index).
 * 
 * INVARIANTES:
 * 1. El dato nominal de origen es inmutable (Factor = 1.0 en modo nominal).
 * 2. En modo valor presente, el multiplicador ajusta proporcionalmente todas las
 *    magnitudes monetarias y alturas físicas.
 * 3. En modo valor presente, se añade el asterisco dinámico USD*.
 */

import { NumberFormatter } from './number-formatter.js';

// Tasas históricas y proyectadas de inflación anual de EE.UU. (CPI-U)
const ANNUAL_INFLATION_RATES = {
  2025: 0.028, // 2.8%
  2026: 0.025, // 2.5%
  2027: 0.024, // 2.4%
  2028: 0.023, // 2.3%
  DEFAULT: 0.025 // 2.5% anual para años posteriores
};

export class InflationAdjuster {
  /**
   * Calcula el factor de inflación acumulado entre el año de origen y el año objetivo.
   * @param {number} sourceYear Año de origen (ej. 2024)
   * @param {number} targetYear Año objetivo (ej. 2026)
   * @returns {number} Factor multiplicador (ej. 1.0537 para 2024 -> 2026)
   */
  static getInflationFactor(sourceYear = 2024, targetYear = null) {
    const target = targetYear || NumberFormatter.getCurrentYear();
    if (sourceYear >= target) return 1.0;

    let factor = 1.0;
    for (let year = sourceYear + 1; year <= target; year++) {
      const rate = ANNUAL_INFLATION_RATES[year] || ANNUAL_INFLATION_RATES.DEFAULT;
      factor *= (1 + rate);
    }
    // Redondear a 4 decimales para estabilidad matemática (ej. 1.0537)
    return Math.round(factor * 10000) / 10000;
  }

  /**
   * Ajusta un monto monetario nominal al valor presente.
   * @param {number} nominalValue Valor nominal en USD
   * @param {number} sourceYear Año de origen
   * @param {number} targetYear Año objetivo
   * @returns {number} Valor ajustado por inflación
   */
  static adjustValue(nominalValue, sourceYear = 2024, targetYear = null) {
    if (typeof nominalValue !== 'number' || isNaN(nominalValue)) return nominalValue;
    const factor = this.getInflationFactor(sourceYear, targetYear);
    return Math.round(nominalValue * factor);
  }

  /**
   * Genera el modelo completo de datos para ambos modos (Nominal y Valor Presente).
   * @param {Object} rawData Dataset canónico de SPEC/data.json
   * @param {number} targetYear Año objetivo de normalización
   * @returns {Object} { nominal, present_value, factor, target_year, source_year }
   */
  static buildDualModel(rawData, targetYear = null) {
    const target = targetYear || NumberFormatter.getCurrentYear();
    const sourceYear = rawData.metadata?.last_updated_sources?.ubs_report_date
      ? parseInt(rawData.metadata.last_updated_sources.ubs_report_date.split('-')[0], 10)
      : 2024;

    const factor = this.getInflationFactor(sourceYear, target);
    const step_usd = rawData.formula_constants?.step_usd_value || 8000;
    const step_height = rawData.formula_constants?.step_physical_height_meters || 0.15;

    function buildStrata(isPV) {
      const currentFactor = isPV ? factor : 1.0;
      const currencyPrefix = isPV ? "USD*" : "USD";
      const badgeSuffixEs = isPV ? `* Valor presente (${target})` : "Nominal";
      const badgeSuffixEn = isPV ? `* Present value (${target})` : "Nominal";

      const strata = rawData.strata.map((s, idx) => {
        const minNominal = s.net_worth_range_usd?.min;
        const maxNominal = s.net_worth_range_usd?.max;
        const avgNominal = s.net_worth_range_usd?.average;

        const minAdjusted = minNominal !== null ? Math.round(minNominal * currentFactor) : null;
        const maxAdjusted = maxNominal !== null ? Math.round(maxNominal * currentFactor) : null;
        const avgAdjusted = avgNominal !== null ? Math.round(avgNominal * currentFactor) : null;

        // Cálculo de altura física
        const representativeValue = avgAdjusted !== null 
          ? avgAdjusted 
          : (minAdjusted !== null ? minAdjusted : 0);
        
        const heightMeters = (representativeValue / step_usd) * step_height;
        const fHeightEs = NumberFormatter.formatHeight(heightMeters, 'es');
        const fHeightEn = NumberFormatter.formatHeight(heightMeters, 'en');

        return {
          id: s.id,
          pedagogical_role: s.pedagogical_role,
          height_meters: heightMeters,
          formatted_height_es: fHeightEs,
          formatted_height_en: fHeightEn,
          net_worth_usd: {
            min: minAdjusted,
            max: maxAdjusted,
            average: avgAdjusted
          },
          currency_prefix: currencyPrefix,
          badge_es: `UBS · dic ${sourceYear} · ${badgeSuffixEs}`,
          badge_en: `UBS · Dec ${sourceYear} · ${badgeSuffixEn}`
        };
      });

      return {
        is_present_value: isPV,
        currency_prefix: currencyPrefix,
        factor: currentFactor,
        strata
      };
    }

    return {
      source_year: sourceYear,
      target_year: target,
      inflation_factor: factor,
      inflation_percentage_label: `+${((factor - 1) * 100).toFixed(1)}%`,
      nominal: buildStrata(false),
      present_value: buildStrata(true)
    };
  }
}
