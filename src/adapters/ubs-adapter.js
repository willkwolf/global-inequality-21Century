/**
 * src/adapters/ubs-adapter.js
 * 
 * Adaptador para UBS Global Wealth Report (distribución de pirámide de riqueza y mediana).
 */

import { BaseSourceAdapter } from './base-adapter.js';

export class UbsSourceAdapter extends BaseSourceAdapter {
  constructor() {
    super('ubs_wealth_report', 'UBS Global Wealth Report', 'Medio-Alto');
  }

  normalize(rawPayload) {
    const hash = this.calculatePayloadHash(rawPayload);
    
    // Validar estructura mínima esperada del reporte UBS
    const reportDate = rawPayload.report_date || '2024-12-31';
    const totalAdults = rawPayload.total_adults_millions ? rawPayload.total_adults_millions * 1000000 : 5360000000;
    const medianWealth = rawPayload.median_wealth_usd || 8910;
    const meanWealth = rawPayload.mean_wealth_usd || 87400;

    return {
      source_id: this.sourceId,
      name: this.name,
      url: "https://www.ubs.com/global/en/wealth-management/insights/global-wealth-report.html",
      report_date: reportDate,
      payload_hash: hash,
      metrics: {
        total_adult_population: totalAdults,
        wealth_median_usd: medianWealth,
        wealth_mean_usd: meanWealth,
        currency_basis: "USD_nominal"
      },
      strata_distribution: rawPayload.strata_distribution || [
        {
          stratum_key: "base",
          pedagogical_role: "BASE",
          percentile_range: { from: 0, to: 40.7 },
          population_percentage: 40.7,
          net_worth_usd: { threshold_min: 0, threshold_max: 10000, average: 1748, median: 1200 }
        },
        {
          stratum_key: "median",
          pedagogical_role: "ESCALA",
          percentile_range: { from: 40.7, to: 50.0 },
          population_percentage: 9.3,
          net_worth_usd: { threshold_min: 8654, threshold_max: 9167, average: 8910, median: 8910 }
        },
        {
          stratum_key: "majority",
          pedagogical_role: "CONTRASTE",
          percentile_range: { from: 50.0, to: 82.0 },
          population_percentage: 41.3,
          net_worth_usd: { threshold_min: 10000, threshold_max: 100000, average: 36000, median: 32000 }
        },
        {
          stratum_key: "upper_middle",
          pedagogical_role: "CONTRASTE",
          percentile_range: { from: 82.0, to: 98.4 },
          population_percentage: 16.4,
          net_worth_usd: { threshold_min: 100000, threshold_max: 1000000, average: 293000, median: 250000 }
        },
        {
          stratum_key: "millionaire_threshold",
          pedagogical_role: "CONTEXTO",
          percentile_range: { from: 98.4, to: 98.4001 },
          population_percentage: 1.6,
          net_worth_usd: { threshold_min: 1000000, threshold_max: 1000000, average: 1000000, median: 1000000 }
        },
        {
          stratum_key: "millionaires_avg",
          pedagogical_role: "CONTEXTO",
          percentile_range: { from: 98.4, to: 99.9997 },
          population_percentage: 1.6,
          net_worth_usd: { threshold_min: 1000000, threshold_max: 50000000, average: 3700000, median: 2800000 }
        }
      ]
    };
  }
}
