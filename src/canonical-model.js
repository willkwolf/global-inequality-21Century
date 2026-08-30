/**
 * src/canonical-model.js
 * 
 * CANONICAL DATA MODEL FACTORY & CONVERTER
 * Ensambla los datos normalizados de diferentes adaptadores primarios en una estructura canónica única,
 * restringiendo la unidad de análisis exclusivamente a PERSONAS NATURALES ADULTAS y enriqueciendo
 * el catálogo de limitaciones metodológicas y epistemológicas.
 */

import crypto from 'crypto';
import { EntityFilter } from './domain/domain-definition.js';

export class CanonicalDataModel {
  /**
   * Crea un dataset canónico a partir de fragmentos normalizados (ej. UBS + Forbes).
   * @param {Object} params
   * @param {string} params.methodology_version
   * @param {string} [params.semantic_concept]
   * @param {Array<Object>} [params.limitations]
   * @param {Array<Object>} params.adapter_fragments
   * @returns {Object} Canonical Data Object
   */
  static build({ methodology_version = "2.1.0", semantic_concept, limitations, adapter_fragments }) {
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
        type: "natural_person",
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
        // Validar filtro de entidad en la métrica global si existe top_holder
        if (fragment.metrics.top_holder) {
          const entityCheck = EntityFilter.classifyEntity(fragment.metrics.top_holder);
          if (!entityCheck.is_natural_person) {
            throw new Error(`[EntityFilter Error] La entidad '${fragment.metrics.top_holder.name}' no es una Persona Natural: ${entityCheck.reason}`);
          }
          fragment.metrics.top_holder.type = "natural_person";
        }
        global_metrics = { ...global_metrics, ...fragment.metrics };
      }

      if (fragment.strata_distribution && Array.isArray(fragment.strata_distribution)) {
        for (const dist of fragment.strata_distribution) {
          if (dist.entity_reference) {
            const entCheck = EntityFilter.classifyEntity(dist.entity_reference);
            if (!entCheck.is_natural_person) {
              throw new Error(`[EntityFilter Error] Estrato '${dist.stratum_key}' contiene entidad no admisible: ${entCheck.reason}`);
            }
            dist.entity_reference.type = "natural_person";
          }
        }
        all_distributions.push(...fragment.strata_distribution);
      }
    }

    // Ordenar distribuciones de menor a mayor percentil
    all_distributions.sort((a, b) => a.percentile_range.from - b.percentile_range.from);

    const defaultLimitations = limitations || [
      {
        code: "VALUATION_BASIS",
        es: "Patrimonio neto personal = activos reales y financieros privados menos deudas individuales.",
        en: "Personal net worth = individual real and financial assets minus private liabilities."
      },
      {
        code: "INDIVIDUAL_SCOPE",
        es: "Unidad de análisis exclusiva: Personas naturales adultas (>=20 años). Excluye corporaciones y estados.",
        en: "Exclusive analysis unit: Adult natural persons (>=20 years). Excludes corporations and sovereign entities."
      },
      {
        code: "VOLATILITY_AND_ILLIQUIDITY",
        es: "La cúspide (Elon Musk) refleja valoración de participaciones empresariales (Tesla, SpaceX) no monetizables de inmediato en efectivo.",
        en: "The apex (Elon Musk) reflects corporate equity valuations (Tesla, SpaceX) not immediately liquid in cash."
      },
      {
        code: "CURRENCY_AND_PPP",
        es: "Medición en USD nominales como denominador estándar común; el poder adquisitivo real (PPP) varía geográficamente.",
        en: "Measured in nominal USD as a common standard; real purchasing power (PPP) varies geographically."
      },
      {
        code: "STEP_EQUIVALENCE",
        es: "La escala fija 1 escalón (15 cm) ≈ $8,000 USD, aproximando la mediana empírica UBS ($8,910 USD ≈ 16.7 cm).",
        en: "The scale anchors 1 step (15 cm) ≈ $8,000 USD, approximating the empirical UBS median ($8,910 USD ≈ 16.7 cm)."
      },
      {
        code: "OFFSHORE_AND_INFORMAL",
        es: "Las estadísticas globales enfrentan limitaciones para registrar riqueza en paraísos fiscales y activos informales.",
        en: "Global statistics face limitations tracking wealth in offshore havens and informal assets."
      },
      {
        code: "STOCK_VS_FLOW",
        es: "El patrimonio neto mide riqueza acumulada (stock), no ingresos anuales de flujo corriente.",
        en: "Net worth measures accumulated wealth (stock), not annual flow income."
      },
      {
        code: "LINEAR_SCALE",
        es: "La escala vertical es estrictamente lineal (Lie Factor = 1.0) sin compresión logarítmica artificial.",
        en: "The vertical scale is strictly linear (Lie Factor = 1.0) without artificial logarithmic compression."
      }
    ];

    const serializedContent = JSON.stringify({ raw_sources, global_metrics, all_distributions });
    const dataset_id = "canonical_" + crypto.createHash('sha256').update(serializedContent).digest('hex').substring(0, 16);

    return {
      schema_version: "2.1.0",
      dataset_id,
      analysis_unit: "natural_person",
      retrieved_at: new Date().toISOString(),
      methodology_version,
      semantic_concept: semantic_concept || "Patrimonio neto personal por adulto (Net Worth per Adult)",
      limitations: defaultLimitations,
      raw_sources,
      global_metrics,
      distributions: all_distributions
    };
  }

  /**
   * Valida la estructura básica del modelo canónico
   */
  static validate(canonicalData) {
    if (!canonicalData || (canonicalData.schema_version !== "2.0.0" && canonicalData.schema_version !== "2.1.0")) {
      throw new Error("Versión o estructura de esquema canónico inválida");
    }
    if (canonicalData.analysis_unit && canonicalData.analysis_unit !== "natural_person" && canonicalData.analysis_unit !== "individual_adult") {
      throw new Error(`Unidad de análisis '${canonicalData.analysis_unit}' inválida. Solo se admite 'natural_person'.`);
    }
    if (!canonicalData.global_metrics?.total_adult_population || canonicalData.global_metrics.total_adult_population <= 0) {
      throw new Error("Población adulta total inválida en modelo canónico");
    }
    if (canonicalData.global_metrics?.top_holder) {
      const check = EntityFilter.classifyEntity(canonicalData.global_metrics.top_holder);
      if (!check.is_natural_person) {
        throw new Error(`Cúspide contiene entidad no válida: ${check.reason}`);
      }
    }
    if (!Array.isArray(canonicalData.distributions) || canonicalData.distributions.length === 0) {
      throw new Error("No hay distribuciones percentiles en el modelo canónico");
    }
    return true;
  }
}
