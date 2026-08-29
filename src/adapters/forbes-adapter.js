/**
 * src/adapters/forbes-adapter.js
 * 
 * Adaptador para Forbes Real-Time Billionaires (extremo superior y recuento de multimillonarios).
 */

import { BaseSourceAdapter } from './base-adapter.js';

export class ForbesSourceAdapter extends BaseSourceAdapter {
  constructor() {
    super('forbes_billionaires', 'Forbes Real-Time Billionaires', 'Bajo-Medio');
  }

  normalize(rawPayload) {
    const hash = this.calculatePayloadHash(rawPayload);
    const date = rawPayload.snapshot_date || new Date().toISOString().split('T')[0];
    const totalBillionaires = rawPayload.total_billionaires || 2891;
    const topPerson = rawPayload.top_holder || {
      name: "Elon Musk",
      type: "person",
      estimated_net_worth_usd: 737500000000,
      range_min: 636000000000,
      range_max: 839000000000
    };

    return {
      source_id: this.sourceId,
      name: this.name,
      url: "https://www.forbes.com/real-time-billionaires/",
      report_date: date,
      payload_hash: hash,
      metrics: {
        total_billionaires_count: totalBillionaires,
        top_holder: topPerson
      },
      strata_distribution: [
        {
          stratum_key: "billionaires_general",
          pedagogical_role: "EXTREMO",
          percentile_range: { from: 99.9997, to: 99.99999 },
          population_percentage: 0.00003,
          net_worth_usd: {
            threshold_min: 1000000000,
            threshold_max: null,
            average: 4500000000,
            median: 2500000000
          }
        },
        {
          stratum_key: "top_cusp",
          pedagogical_role: "EXTREMO",
          percentile_range: { from: 99.999999, to: 100 },
          population_percentage: 0.0000001,
          net_worth_usd: {
            threshold_min: topPerson.range_min || topPerson.estimated_net_worth_usd * 0.85,
            threshold_max: topPerson.range_max || topPerson.estimated_net_worth_usd * 1.15,
            average: topPerson.estimated_net_worth_usd,
            median: topPerson.estimated_net_worth_usd
          },
          entity_reference: {
            name: topPerson.name,
            type: topPerson.type
          }
        }
      ]
    };
  }
}
