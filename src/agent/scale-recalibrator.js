/**
 * src/agent/scale-recalibrator.js
 * 
 * SISTEMA DE RECALIBRACIÓN DINÁMICA DE ESCALAS Y PERCENTILES
 * Integrado con NumberFormatter para formateo estético y bilingüe de alturas.
 */

import { NumberFormatter } from '../i18n/number-formatter.js';

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
   * Asigna una analogía física espacial coherente según la altura calculada
   */
  static selectPhysicalReference(heightMeters, pedagogicalRole, entityRef) {
    if (heightMeters >= 100000) {
      // > 100 km (Espacio exterior / Órbita)
      const entityName = entityRef?.name || "Cúspide de riqueza";
      return {
        name_es: `Satélite en órbita terrestre media (${entityName})`,
        name_en: `Satellite in medium Earth orbit (${entityName})`,
        svg_icon: `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4">\n  <circle cx="60" cy="60" r="42" stroke-dasharray="5 7" opacity=".6"/>\n  <circle cx="60" cy="22" r="7" fill="currentColor" stroke="none"/>\n  <path d="M60 29 v18 M42 60 h36" stroke-linecap="round"/>\n</svg>`
      };
    } else if (heightMeters >= 10000) {
      // 10 km - 100 km (Estratosfera / Cohete)
      return {
        name_es: "Cohete en la estratosfera",
        name_en: "Rocket in the stratosphere",
        svg_icon: `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4">\n  <ellipse cx="60" cy="42" rx="20" ry="26" fill="currentColor" opacity=".95" stroke="none"/>\n  <path d="M60 68 v26 M50 94 h20" stroke-linecap="round"/>\n</svg>`
      };
    } else if (heightMeters >= 30) {
      // 30 m - 1000 m (Edificio moderno / Rascacielos)
      const floors = Math.max(10, Math.round(heightMeters / 3.5));
      return {
        name_es: `Edificio de ${floors} pisos`,
        name_en: `${floors}-story building`,
        svg_icon: `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4">\n  <rect x="36" y="18" width="48" height="84" fill="currentColor" opacity=".18"/>\n  <path d="M36 18 h48 v84 H36 Z M46 32 h10 M64 32 h10 M46 46 h10 M64 46 h10 M46 60 h10 M64 60 h10 M46 74 h10 M64 74 h10 M46 88 h10 M64 88 h10"/>\n</svg>`
      };
    } else if (heightMeters >= 10) {
      // 10 m - 30 m (Escalera de muchos peldaños)
      const steps = Math.round(heightMeters / 0.15);
      return {
        name_es: `Escalera de ${steps} escalones`,
        name_en: `Staircase of ${steps} steps`,
        svg_icon: `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="square">\n  <path d="M18 96 h18 v-14 h18 v-14 h18 v-14 h18 v-14 h12" fill="none"/>\n  <rect x="18" y="96" width="18" height="7" fill="currentColor" stroke="none"/>\n  <rect x="36" y="82" width="18" height="7" fill="currentColor"/>\n  <rect x="54" y="68" width="18" height="7" fill="currentColor"/>\n  <rect x="72" y="54" width="18" height="7" fill="currentColor"/>\n  <rect x="90" y="40" width="12" height="7" fill="currentColor"/>\n</svg>`
      };
    } else if (heightMeters >= 2) {
      // 2 m - 10 m (Casa de dos pisos)
      return {
        name_es: "Casa residencial de dos pisos",
        name_en: "Two-story residential house",
        svg_icon: `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4">\n  <path d="M28 72 v32 h64 V72 L60 42 Z" fill="currentColor" opacity=".18"/>\n  <path d="M28 72 L60 42 L92 72 M28 104 h64 M28 72 v32 M92 72 v32 M60 72 v32 M46 86 h12 v18 H46z"/>\n</svg>`
      };
    } else if (heightMeters >= 0.4) {
      // 40 cm - 2 m (Silla de bar / Altura de rodilla-cintura)
      return {
        name_es: "Silla alta de bar",
        name_en: "Bar stool",
        svg_icon: `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round">\n  <ellipse cx="60" cy="38" rx="30" ry="9" fill="currentColor" opacity=".85" stroke="none"/>\n  <ellipse cx="60" cy="38" rx="30" ry="9" opacity=".5"/>\n  <path d="M40 32 v-16 M80 32 v-16" stroke-width="3.5"/>\n  <path d="M36 16 h48 M36 24 h48" stroke-width="3"/>\n  <line x1="60" y1="47" x2="60" y2="86" stroke-width="5"/>\n  <path d="M36 92 h48" stroke-width="4"/>\n  <path d="M36 92 L28 106 M84 92 L92 106" stroke-width="3.5"/>\n</svg>`
      };
    } else if (heightMeters >= 0.08) {
      // 8 cm - 40 cm (Un solo escalón)
      return {
        name_es: "Un solo escalón de escalera",
        name_en: "A single stair step",
        svg_icon: `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="5">\n  <rect x="26" y="74" width="68" height="16" rx="3" fill="currentColor" opacity=".92"/>\n  <path d="M22 100 h76" opacity=".5"/>\n</svg>`
      };
    } else {
      // < 8 cm (Una roca pequeña / guijarro en el suelo)
      return {
        name_es: "Una roca pequeña en el suelo",
        name_en: "A small pebble on the ground",
        svg_icon: `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3.5">\n  <path d="M28 82 L38 54 L57 44 L80 48 L96 66 L90 82 Z" fill="currentColor" opacity=".82"/>\n  <path d="M38 54 L52 62 L57 44 M52 62 L80 48" opacity=".42" stroke-linecap="round"/>\n  <path d="M18 88 h84" stroke-linecap="round" opacity=".32"/>\n</svg>`
      };
    }
  }
}
