/**
 * generate-synthetic-data.js
 *
 * PROPÓSITO:
 * Generar datos sintéticos aleatorios pero matemáticamente consistentes y lingüísticamente válidos
 * para simular encuestas de riqueza globales futuras (ej. años 2028, 2030, 2032).
 * Sirve para la suite de pruebas de robustez (100 ejecuciones aleatorias) para certificar
 * que el compilador y el visualizador nunca se rompen bajo cambios de datos.
 *
 * REGLAS DE CONSISTENCIA:
 * 1. 1 escalón = $8,000 USD = 15 cm (constantes de escala fijas).
 * 2. Alturas estrictamente descendentes (s1 > s2 > s3 ... > s8).
 * 3. Consistencia de la Mediana s7: Patrimonio entre $8,600 y $9,200 USD para mantener el escalón de ~17cm.
 * 4. Fórmulas de altura aplicadas de forma exacta: Altura = (Patrimonio / step_usd) * step_height.
 * 5. Generación de SVGs válidos e inyectables con parámetros variables.
 * 6. Diccionario de traducciones bilingües completo y estructurado en ES y EN.
 */

import fs from 'fs';
import path from 'path';

// Nombres y entidades sintéticas futuras
const WEALTH_HOLDERS = [
  { name_es: 'Fundación Global de IA', name_en: 'Global AI Foundation', type: 'organization' },
  { name_es: 'Bernard Arnault & familia', name_en: 'Bernard Arnault & family', type: 'person' },
  { name_es: 'Consorcio Solar Planetario', name_en: 'Planetary Solar Consortium', type: 'organization' },
  { name_es: 'Jeff Bezos', name_en: 'Jeff Bezos', type: 'person' },
  { name_es: 'Alianza Tecnológica del Pacífico', name_en: 'Pacific Tech Alliance', type: 'organization' },
  { name_es: 'Zhong Shanshan', name_en: 'Zhong Shanshan', type: 'person' },
  { name_es: 'Sindicato de Fusión de Energía', name_en: 'Energy Fusion Syndicate', type: 'organization' }
];

// Helper para obtener un número entero aleatorio en un rango
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper para dar formato de millones / miles de millones
function formatMillions(val) {
  return Math.round(val / 1000000);
}

export function generateSyntheticData() {
  const step_usd_value = 8000;
  const step_physical_height_meters = 0.15;

  // 1. Definir metadatos aleatorios del futuro
  const surveyYear = randomInt(2028, 2038);
  const ubsReportDate = `${surveyYear - 1}-12-31`;
  const forbesBillionairesDate = `${surveyYear}-05-01`;

  const totalAdults = randomInt(5400, 6200); // 5.4B a 6.2B adultos
  const totalBillionaires = randomInt(2900, 3900); // 2900 a 3900 billonarios

  const topHolder = WEALTH_HOLDERS[randomInt(0, WEALTH_HOLDERS.length - 1)];

  // 2. Generar cifras de riqueza coherentes y descendentes
  // s1: Top Riqueza ($650B - $1.4T)
  const s1_min = randomInt(650, 750) * 1000000000;
  const s1_max = randomInt(900, 1400) * 1000000000;
  const s1_avg = Math.round((s1_min + s1_max) / 2);

  // s2: Billonarios ($1B base)
  const s2_min = 1000000000;
  const s2_max = null;
  const s2_avg = null;

  // s3: Millonarios Promedio ($2.5M - $4.8M)
  const s3_min = 1000000;
  const s3_max = 1000000000;
  const s3_avg = randomInt(25, 48) * 100000;

  // s4: Umbral Millonario ($1M fijo)
  const s4_min = 1000000;
  const s4_max = 1000000;
  const s4_avg = 1000000;

  // s5: Clase Media Alta ($180k - $360k)
  const s5_min = 100000;
  const s5_max = 1000000;
  const s5_avg = randomInt(18, 36) * 10000;

  // s6: Mayoría promedio ($22k - $49k)
  const s6_min = 10000;
  const s6_max = 100000;
  const s6_avg = randomInt(22, 49) * 1000;

  // s7: Mediana global (anclada entre $8,600 y $9,200 USD para mantener el escalón de ~17cm)
  const s7_min = randomInt(8600, 8800);
  const s7_max = randomInt(9000, 9200);
  const s7_avg = Math.round((s7_min + s7_max) / 2);

  // s8: Base mundial ($1k - $2.8k)
  const s8_min = 0;
  const s8_max = s7_min;
  const s8_avg = randomInt(10, 28) * 100;

  // 3. Helper de alturas exactas basadas en la fórmula de escala
  function calculateHeight(value) {
    return (value / step_usd_value) * step_physical_height_meters;
  }

  const s1_height = calculateHeight(s1_avg);
  const s2_height = calculateHeight(s2_min); // s2 usa el mínimo ($1B) para el anclaje visual
  const s3_height = calculateHeight(s3_avg);
  const s4_height = calculateHeight(s4_avg);
  const s5_height = calculateHeight(s5_avg);
  const s6_height = calculateHeight(s6_avg);
  const s7_height = calculateHeight(s7_avg);
  const s8_height = calculateHeight(s8_avg);

  // Helper para formatear alturas para textos bilingües
  function formatHeightLabel(meters) {
    if (meters >= 1000) {
      const km = Math.round(meters / 10) / 100;
      return { es: `${km.toLocaleString('es-ES')} km`, en: `${km.toLocaleString('en-US')} km` };
    } else if (meters >= 1) {
      const m = Math.round(meters * 10) / 10;
      return { es: `${m.toLocaleString('es-ES')} metros`, en: `${m.toLocaleString('en-US')} meters` };
    } else {
      const cm = Math.round(meters * 1000) / 10;
      return { es: `${cm.toLocaleString('es-ES')} centímetros`, en: `${cm.toLocaleString('en-US')} centimeters` };
    }
  }

  // Helper de formato monetario para captions
  function formatMoneyB(value) {
    const b = value / 1000000000;
    return b % 1 === 0 ? b.toString() : b.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  }

  // Generar iconos SVG sintéticos variables para verificar parsing robusto
  function makeRandomIcon(id) {
    const rx = randomInt(15, 35);
    const ry = randomInt(15, 35);
    const strokeWidth = randomInt(3, 5);
    return `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" id="svg-${id}">
  <!-- Círculo dinámico de robustez sintética -->
  <circle cx="60" cy="60" r="${rx}" opacity=".5" stroke-dasharray="3 5" />
  <ellipse cx="60" cy="60" rx="${rx}" ry="${ry}" fill="currentColor" opacity=".22" />
  <path d="M20 100 h80 M60 20 v80" stroke-linecap="round" />
</svg>`;
  }

  // 4. Estructurar estratos y traducciones
  const strata = [
    {
      id: 's1',
      '@type': 'StatisticalPopulation',
      net_worth_range_usd: { min: s1_min, max: s1_max, average: s1_avg },
      population_ratio: {
        percentage: 0.0000001,
        ratio_phrase: { es: 'Menos de 1 de cada 10 millones', en: 'Fewer than 1 in 10 million' }
      },
      physical_analogy: {
        name_es: `Satélite en órbita sintética ${surveyYear}`,
        name_en: `Satellite in synthetic orbit ${surveyYear}`,
        height_meters: s1_height
      },
      translations: {
        es: {
          headline: `${topHolder.name_es} vive en órbita`,
          caption: `Menos de 1 de cada 10 millones · USD $${formatMoneyB(s1_min)}B–$${formatMoneyB(s1_max)}B`,
          aria: `${topHolder.name_es} en órbita: ${formatHeightLabel(s1_height).es}`
        },
        en: {
          headline: `${topHolder.name_en} lives in orbit`,
          caption: `Fewer than 1 in 10 million · USD $${formatMoneyB(s1_min)}B–$${formatMoneyB(s1_max)}B`,
          aria: `${topHolder.name_en} in orbit: ${formatHeightLabel(s1_height).en}`
        }
      },
      svg_icon: makeRandomIcon('s1')
    },
    {
      id: 's2',
      '@type': 'StatisticalPopulation',
      net_worth_range_usd: { min: s2_min, max: s2_max, average: s2_avg },
      population_ratio: {
        percentage: 0.0000003,
        ratio_phrase: { es: '3 de cada 10 millones', en: '3 in 10 million' }
      },
      physical_analogy: {
        name_es: 'Cohete en la estratosfera',
        name_en: 'Rocket in the stratosphere',
        height_meters: s2_height
      },
      translations: {
        es: {
          headline: `Un billonario toca la estratosfera (${surveyYear})`,
          caption: '3 de cada 10 millones · Más de USD $1,000 millones',
          aria: `Billonarios: ${formatHeightLabel(s2_height).es}`
        },
        en: {
          headline: `A billionaire touches the stratosphere (${surveyYear})`,
          caption: '3 in 10 million · More than USD $1,000 million',
          aria: `Billionaires: ${formatHeightLabel(s2_height).en}`
        }
      },
      svg_icon: makeRandomIcon('s2')
    },
    {
      id: 's3',
      '@type': 'StatisticalPopulation',
      net_worth_range_usd: { min: s3_min, max: s3_max, average: s3_avg },
      population_ratio: {
        percentage: 2.0,
        ratio_phrase: { es: '98 de cada 100 viven más abajo', en: '98 in 100 live below' }
      },
      physical_analogy: {
        name_es: 'Edificio de 20 pisos',
        name_en: '20-story building',
        height_meters: s3_height
      },
      translations: {
        es: {
          headline: 'Los millonarios: un edificio de 20 pisos',
          caption: `98 de cada 100 viven más abajo · Más de USD $1M (prom. $${(s3_avg / 1000000).toFixed(1)}M)`,
          aria: `Millonarios: ${formatHeightLabel(s3_height).es}`
        },
        en: {
          headline: 'Millionaires: a 20-story building',
          caption: `98 in 100 live below · More than USD $1M (avg. $${(s3_avg / 1000000).toFixed(1)}M)`,
          aria: `Millionaires: ${formatHeightLabel(s3_height).en}`
        }
      },
      svg_icon: makeRandomIcon('s3')
    },
    {
      id: 's4',
      '@type': 'StatisticalPopulation',
      net_worth_range_usd: { min: s4_min, max: s4_max, average: s4_avg },
      population_ratio: {
        percentage: 1.6,
        ratio_phrase: { es: 'Solo el 1.6% del mundo', en: 'Only 1.6% of the world' }
      },
      physical_analogy: {
        name_es: 'Escalera de 125 escalones',
        name_en: 'Staircase of 125 steps',
        height_meters: s4_height
      },
      translations: {
        es: {
          headline: 'Para ser millonario: 125 escalones',
          caption: 'Solo el 1.6% del mundo · Umbral USD $1M',
          aria: `Umbral millonario: ${formatHeightLabel(s4_height).es}`
        },
        en: {
          headline: 'To become a millionaire: 125 steps',
          caption: 'Only 1.6% of the world · Threshold USD $1M',
          aria: `Millionaire threshold: ${formatHeightLabel(s4_height).en}`
        }
      },
      svg_icon: makeRandomIcon('s4')
    },
    {
      id: 's5',
      '@type': 'StatisticalPopulation',
      net_worth_range_usd: { min: s5_min, max: s5_max, average: s5_avg },
      population_ratio: {
        percentage: 16.4,
        ratio_phrase: { es: '82 de cada 100 viven más abajo', en: '82 in 100 live below' }
      },
      physical_analogy: {
        name_es: 'Casa residencial de dos pisos',
        name_en: 'Two-story residential house',
        height_meters: s5_height
      },
      translations: {
        es: {
          headline: `16.4%: a la altura de dos pisos (${surveyYear})`,
          caption: `82 de cada 100 viven más abajo · USD $${Math.round(s5_avg / 1000)}k promedio`,
          aria: `Clase media alta: ${formatHeightLabel(s5_height).es}`
        },
        en: {
          headline: `16.4%: at two-story height (${surveyYear})`,
          caption: `82 in 100 live below · USD $${Math.round(s5_avg / 1000)}k average`,
          aria: `Upper middle class: ${formatHeightLabel(s5_height).en}`
        }
      },
      svg_icon: makeRandomIcon('s5')
    },
    {
      id: 's6',
      '@type': 'StatisticalPopulation',
      net_worth_range_usd: { min: s6_min, max: s6_max, average: s6_avg },
      population_ratio: {
        percentage: 41.3,
        ratio_phrase: { es: '41 de cada 100 viven aquí o más abajo', en: '41 in 100 live here or below' }
      },
      physical_analogy: {
        name_es: 'Silla alta de bar',
        name_en: 'Bar stool',
        height_meters: s6_height
      },
      translations: {
        es: {
          headline: 'La mayoría no llega a la silla de bar',
          caption: `41 de cada 100 viven aquí o más abajo · USD $${Math.round(s6_avg / 1000)}k promedio`,
          aria: `La mayoría: ${formatHeightLabel(s6_height).es}`
        },
        en: {
          headline: "The majority don't reach the bar stool",
          caption: `41 in 100 live here or below · USD $${Math.round(s6_avg / 1000)}k average`,
          aria: `The majority: ${formatHeightLabel(s6_height).en}`
        }
      },
      svg_icon: makeRandomIcon('s6')
    },
    {
      id: 's7',
      '@type': 'StatisticalPopulation',
      net_worth_range_usd: { min: s7_min, max: s7_max, average: s7_avg },
      population_ratio: {
        percentage: 50.0,
        ratio_phrase: { es: '50 de cada 100 no superan este escalón', en: '50 in 100 do not surpass this step' }
      },
      physical_analogy: {
        name_es: 'Un solo escalón de escalera',
        name_en: 'A single stair step',
        height_meters: s7_height
      },
      translations: {
        es: {
          headline: `La mitad del planeta: un solo escalón (${surveyYear})`,
          caption: `50 de cada 100 no superan este escalón · Mediana USD $${s7_min.toLocaleString('en-US')}–$${s7_max.toLocaleString('en-US')}`,
          aria: `Mediana mundial: ${formatHeightLabel(s7_height).es}`
        },
        en: {
          headline: `Half the planet: one single step (${surveyYear})`,
          caption: `50 in 100 do not surpass this step · Median USD $${s7_min.toLocaleString('en-US')}–$${s7_max.toLocaleString('en-US')}`,
          aria: `World median: ${formatHeightLabel(s7_height).en}`
        }
      },
      svg_icon: makeRandomIcon('s7')
    },
    {
      id: 's8',
      '@type': 'StatisticalPopulation',
      net_worth_range_usd: { min: s8_min, max: s8_max, average: s8_avg },
      population_ratio: {
        percentage: 40.7,
        ratio_phrase: { es: '41 de cada 100 viven aquí o menos', en: '41 in 100 live here or below' }
      },
      physical_analogy: {
        name_es: 'Una roca pequeña',
        name_en: 'A small pebble',
        height_meters: s8_height
      },
      translations: {
        es: {
          headline: 'La base del mundo: una roca en el suelo',
          caption: `41 de cada 100 viven aquí o menos · USD $${s8_avg.toLocaleString('en-US')} promedio`,
          aria: `Base: ${formatHeightLabel(s8_height).es}`
        },
        en: {
          headline: 'The world base: a pebble on the ground',
          caption: `41 in 100 live here or below · USD $${s8_avg.toLocaleString('en-US')} average`,
          aria: `Base: ${formatHeightLabel(s8_height).en}`
        }
      },
      svg_icon: makeRandomIcon('s8')
    }
  ];

  // 5. Devolver el JSON formateado listo para inyectarse
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    metadata: {
      title: `Desigualdad Global de Riqueza - Siglo XXI (Sintético ${surveyYear})`,
      description: 'Datos sintéticos autogenerados para pruebas extremas de robustez.',
      author: 'Antigravity AI Synthesizer',
      license: 'CC BY 4.0',
      total_adults_world: totalAdults,
      total_billionaires: totalBillionaires,
      last_updated_sources: {
        ubs_report_date: ubsReportDate,
        forbes_billionaires_date: forbesBillionairesDate
      },
      top_wealth_holder: topHolder
    },
    formula_constants: {
      step_usd_value,
      step_physical_height_meters
    },
    strata
  };
}

// Permitir ejecución directa del script
if (process.argv[1] && process.argv[1].endsWith('generate-synthetic-data.js')) {
  const data = generateSyntheticData();
  fs.writeFileSync('SPEC/data.json', JSON.stringify(data, null, 2), 'utf8');
  console.log('Successfully generated and saved a random synthetic data.json!');
}
