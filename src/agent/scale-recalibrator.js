/**
 * src/agent/scale-recalibrator.js
 * 
 * SISTEMA DE RECALIBRACIÓN DINÁMICA DE ESCALAS Y PERCENTILES
 * Integrado con NumberFormatter y el Inventario Canónico de Iconos SVG (icon-inventory.js).
 */

import { NumberFormatter } from '../i18n/number-formatter.js';
import { getInventoryIcon } from '../assets/icon-inventory.js';

export class ScaleRecalibrator {
  /**
   * Recalibra la fórmula y calcula las alturas físicas y analogías para las distribuciones canónicas.
   * @param {Object} canonicalData
   * @returns {Object} { formula_constants, layers, max_height_meters }
   */
  static recalibrate(canonicalData) {
    const medianWealth = canonicalData.global_metrics?.wealth_median_usd || 8910;
    
    // Anclar 1 escalón (15 cm = 0.15 m) a aproximadamente la mediana (con redondeo a número amigable)
    let step_usd_value = 8000;
    if (medianWealth > 0) {
      step_usd_value = Math.round(medianWealth / 1000) * 1000;
      if (step_usd_value === 0) step_usd_value = medianWealth;
    }
    const step_physical_height_meters = 0.15;

    const formula_constants = {
      step_usd_value,
      step_physical_height_meters
    };

    const distributions = canonicalData.distributions || [];
    
    // Mapear cada estrato/distribución a su altura física
    const rawLayers = distributions.map((dist, idx) => {
      const wealthVal = dist.net_worth_usd.average !== null 
        ? dist.net_worth_usd.average 
        : (dist.net_worth_usd.threshold_max !== null ? (dist.net_worth_usd.threshold_min + dist.net_worth_usd.threshold_max) / 2 : dist.net_worth_usd.threshold_min);

      const heightMeters = (wealthVal / step_usd_value) * step_physical_height_meters;
      const layerId = `s${idx + 1}`;

      const physicalRef = ScaleRecalibrator.selectPhysicalReference(heightMeters, dist.pedagogical_role, dist.entity_reference);
      const fHeightEs = NumberFormatter.formatHeight(heightMeters, 'es');
      const fHeightEn = NumberFormatter.formatHeight(heightMeters, 'en');

      return {
        layer_id: layerId,
        pedagogical_role: dist.pedagogical_role,
        raw_magnitude: wealthVal,
        magnitude_unit: "USD",
        net_worth_range: dist.net_worth_usd,
        physical_height_meters: heightMeters,
        formatted_height_label: fHeightEs.full_label,
        formatted_height_num: fHeightEs.value_formatted,
        formatted_height_unit: fHeightEs.unit,
        formatted_height_en: fHeightEn,
        population_share_percentage: dist.population_percentage,
        percentile_range: dist.percentile_range,
        physical_reference: physicalRef,
        entity_reference: dist.entity_reference || canonicalData.global_metrics?.top_holder
      };
    });

    // Ordenar de mayor a menor altura (de la cúspide s1 al suelo sN)
    rawLayers.sort((a, b) => b.physical_height_meters - a.physical_height_meters);

    // Reasignar IDs ordenados s1, s2, ..., sN
    const layers = rawLayers.map((layer, idx) => ({
      ...layer,
      layer_id: `s${idx + 1}`
    }));

    const max_height_meters = layers.length > 0 ? layers[0].physical_height_meters : 0;

    return {
      formula_constants,
      layers,
      max_height_meters
    };
  }

  /**
   * Helper para dar formato humano a alturas
   */
  static formatHeight(meters, locale = 'es') {
    const res = NumberFormatter.formatHeight(meters, locale);
    return { num: res.value_formatted, unit: res.unit, label: res.full_label };
  }

  /**
   * Asigna una analogía física espacial y su SVG canónico reutilizándolo del inventario
   */
  static selectPhysicalReference(heightMeters, pedagogicalRole, entityRef) {
    const inventoryItem = getInventoryIcon(heightMeters);
    const entityName = entityRef?.name || entityRef?.name_es || "Cúspide de riqueza";

    if (heightMeters >= 100000) {
      return {
        name_es: `Satélite en órbita terrestre media (${entityName})`,
        name_en: `Satellite in medium Earth orbit (${entityName})`,
        svg_icon: inventoryItem.svg
      };
    }

    return {
      name_es: inventoryItem.name_es,
      name_en: inventoryItem.name_en,
      svg_icon: inventoryItem.svg
    };
  }
}
