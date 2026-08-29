/**
 * src/canonical-model.js
 * 
 * CANONICAL DATA MODEL FACTORY & CONVERTER
 * Ensambla los datos normalizados de diferentes adaptadores primarios en una estructura canónica única.
 */

import crypto from 'crypto';

export class CanonicalDataModel {
  /**
   * Crea un dataset canónico a partir de fragmentos normalizados (ej. UBS + Forbes).
   * @param {Object} params
   * @param {string} params.methodology_version
   * @param {string} [params.semantic_concept]
   * @param {Array<Object>} params.adapter_fragments
   * @returns {Object} Canonical Data Object
   */
  static build({ methodology_version = "2.0.0", semantic_concept, adapter_fragments }) {
    if (!Array.isArray(adapter_fragments) || adapter_fragments.length === 0) {
      throw new Error("Se requiere al menos un fragmento de adaptador para construir el modelo canónico.");
    }

    const raw_sources = [];
    let global_metrics = {
      total_adult_population: 5360000000,
      total_billionaires_count: 2891,
      currency_basis: "USD_nominal",
      wealth_median_usd: 8910,
      wealth_mean_usd: 87400,
      top_holder: {
        name: "Elon Musk",
        type: "person",
        estimated_net_worth_usd: 737500000000
      }
    };

    let all_distributions = [];

    for (const fragment of adapter_fragments) {
      raw_sources.push({
        source_id: fragment.source_id,
        name: fragment.name,
        url: fragment.url,
        report_date: fragment.report_date,
        payload_hash: fragment.payload_hash
      });

      if (fragment.metrics) {
        global_metrics = { ...global_metrics, ...fragment.metrics };
      }

      if (fragment.strata_distribution && Array.isArray(fragment.strata_distribution)) {
        all_distributions.push(...fragment.strata_distribution);
      }
    }

    // Ordenar distribuciones de menor a mayor percentil
    all_distributions.sort((a, b) => a.percentile_range.from - b.percentile_range.from);

    const serializedContent = JSON.stringify({ raw_sources, global_metrics, all_distributions });
    const dataset_id = "canonical_" + crypto.createHash('sha256').update(serializedContent).digest('hex').substring(0, 16);

    return {
      schema_version: "2.0.0",
      dataset_id,
      retrieved_at: new Date().toISOString(),
      methodology_version,
      semantic_concept: semantic_concept || "Patrimonio neto global por adulto",
      raw_sources,
      global_metrics,
      distributions: all_distributions
    };
  }

  /**
   * Valida la estructura básica del modelo canónico
   */
  static validate(canonicalData) {
    if (!canonicalData || canonicalData.schema_version !== "2.0.0") {
      throw new Error("Versión o estructura de esquema canónico inválida");
    }
    if (!canonicalData.global_metrics?.total_adult_population || canonicalData.global_metrics.total_adult_population <= 0) {
      throw new Error("Población adulta total inválida en modelo canónico");
    }
    if (!Array.isArray(canonicalData.distributions) || canonicalData.distributions.length === 0) {
      throw new Error("No hay distribuciones percentiles en el modelo canónico");
    }
    return true;
  }
}
