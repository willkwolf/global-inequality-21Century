/**
 * src/adapters/wid-adapter.js
 * 
 * Adaptador para World Inequality Database (WID.world).
 * Alto nivel de confianza académica y trazabilidad de percentiles continuos (p0 a p100).
 */

import { BaseSourceAdapter } from './base-adapter.js';

export class WidSourceAdapter extends BaseSourceAdapter {
  constructor() {
    super('wid_world', 'World Inequality Database (WID.world)', 'Alto');
  }

  normalize(rawPayload) {
    const hash = this.calculatePayloadHash(rawPayload);
    const year = rawPayload.year || 2024;
    
    return {
      source_id: this.sourceId,
      name: this.name,
      url: "https://wid.world/",
      report_date: `${year}-12-31`,
      payload_hash: hash,
      metrics: {
        total_adult_population: rawPayload.population_adults || 5360000000,
        wealth_median_usd: rawPayload.p50_wealth_usd || 8900,
        wealth_mean_usd: rawPayload.mean_wealth_usd || 88000,
        currency_basis: rawPayload.currency || "USD_PPP_2025"
      },
      strata_distribution: rawPayload.percentiles_data || []
    };
  }
}
