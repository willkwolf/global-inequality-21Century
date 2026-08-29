/**
 * SPEC/scripts/apply-data.js
 *
 * PROPÓSITO:
 * Leer `SPEC/data.json` (o dataset canónico adaptado), procesar el Story Model
 * y compilar de forma quirúrgica y completamente dinámica `Escala-visual-de-riqueza-mundial.html`.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HtmlCompiler } from '../../src/renderer/html-compiler.js';
import { StoryModel } from '../../src/contracts/story-model.js';
import { ScaleRecalibrator } from '../../src/agent/scale-recalibrator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Colores para consola
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const BLUE = '\x1b[34m';
const BOLD = '\x1b[1m';

function logSuccess(msg) { console.log(`${GREEN}✓ ${msg}${RESET}`); }
function logError(msg) { console.error(`${RED}${BOLD}✗ ERROR: ${msg}${RESET}`); }
function logHeader(msg) { console.log(`\n${BOLD}${BLUE}=== ${msg} ===${RESET}`); }

const DATA_PATH = path.resolve(__dirname, '../data.json');
const HTML_PATH = path.resolve(__dirname, '../../Escala-visual-de-riqueza-mundial.html');

logHeader('Iniciando Compilación e Inyección Dinámica de Datos');

try {
  if (!fs.existsSync(DATA_PATH)) {
    throw new Error(`No se encontró data.json en: ${DATA_PATH}`);
  }
  if (!fs.existsSync(HTML_PATH)) {
    throw new Error(`No se encontró el HTML principal en: ${HTML_PATH}`);
  }

  const rawData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const rawHtml = fs.readFileSync(HTML_PATH, 'utf8');

  // Convertir data.json a formato AbstractionDocument
  const s1 = rawData.strata.find(s => s.id === 's1') || rawData.strata[0];
  const maxMeters = s1.physical_analogy.height_meters;
  const fHeight = ScaleRecalibrator.formatHeight(maxMeters);

  const topHolder = rawData.metadata.top_wealth_holder || { name_es: "Elon Musk", name_en: "Elon Musk", type: "person" };
  const totalAdultsWorld = rawData.metadata.total_adults_world || 5360;
  const totalBillionaires = rawData.metadata.total_billionaires || 2891;
  const lastUpdated = rawData.metadata.last_updated_sources || { forbes_billionaires_date: "2026-05-01", ubs_report_date: "2024-12-31" };

  const formattedAdultsES = (totalAdultsWorld / 1000).toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 3 }) + ' millones';
  const formattedAdultsEN = (totalAdultsWorld / 1000).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 3 }) + ' billion';

  const formattedBillionairesES = totalBillionaires.toLocaleString('es-ES');
  const formattedBillionairesEN = totalBillionaires.toLocaleString('en-US');

  const typeWordsES = { person: 'billonarios', organization: 'organizaciones', fund: 'fondos', other: 'entidades' };
  const typeWordsEN = { person: 'billionaires', organization: 'organizations', fund: 'funds', other: 'entities' };
  const typeWordES = typeWordsES[topHolder.type] || 'billonarios';
  const typeWordEN = typeWordsEN[topHolder.type] || 'billionaires';

  function formatBillion(value) {
    if (value === null || value === undefined) return 'N/A';
    const billions = value / 1000000000;
    return billions % 1 === 0 ? billions.toString() : billions.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  }

  function formatForbesDate(dateStr, lang) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parts[0];
    const monthNum = parseInt(parts[1], 10);
    const monthsES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const monthsEN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    if (lang === 'es') {
      return `${monthsES[monthNum - 1]} de ${year}`;
    } else {
      return `${monthsEN[monthNum - 1]} ${year}`;
    }
  }

  const rangeStr = `$${formatBillion(s1.net_worth_range_usd.min)}B–$${formatBillion(s1.net_worth_range_usd.max)}B`;
  const dateLabelEs = lastUpdated.ubs_report_date ? `UBS · dic ${lastUpdated.ubs_report_date.split('-')[0]}` : "UBS · dic 2024";
  const dateLabelEn = lastUpdated.ubs_report_date ? `UBS · Dec ${lastUpdated.ubs_report_date.split('-')[0]}` : "UBS · Dec 2024";

  const summary_es = `UBS Global Wealth Report 2024 (adultos, datos al 31 dic 2024). Forbes Real-Time Billionaires, ${formatForbesDate(lastUpdated.forbes_billionaires_date, 'es')}: ${topHolder.name_es} (${rangeStr}) y ${formattedBillionairesES} ${typeWordES} confirmados. Población adulta mundial: ${formattedAdultsES}.`;
  const summary_en = `UBS Global Wealth Report 2024 (adultos, data as of 31 Dec 2024). Forbes Real-Time Billionaires, ${formatForbesDate(lastUpdated.forbes_billionaires_date, 'en')}: ${topHolder.name_en} (${rangeStr}) and ${formattedBillionairesEN} confirmed ${typeWordEN}. Global adult population: ${formattedAdultsEN}.`;

  const layers = rawData.strata.map((s, idx) => {
    const height = s.physical_analogy.height_meters;
    const formatted = ScaleRecalibrator.formatHeight(height);
    return {
      layer_id: s.id || `s${idx + 1}`,
      pedagogical_role: s.pedagogical_role || (idx === 0 ? "EXTREMO" : (idx === rawData.strata.length - 1 ? "BASE" : "CONTRASTE")),
      raw_magnitude: s.net_worth_range_usd.average || s.net_worth_range_usd.min || 0,
      magnitude_unit: "USD",
      physical_height_meters: height,
      formatted_height_label: formatted.label,
      formatted_height_num: formatted.num,
      formatted_height_unit: formatted.unit,
      population_share_percentage: s.population_ratio?.percentage ? s.population_ratio.percentage * 100 : 0,
      physical_reference: {
        name_es: s.physical_analogy.name_es,
        name_en: s.physical_analogy.name_en,
        svg_icon: s.svg_icon || `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4"><circle cx="60" cy="60" r="30"/></svg>`
      },
      narrative: {
        headline_es: s.translations.es.headline,
        headline_en: s.translations.en.headline,
        caption_es: s.translations.es.caption,
        caption_en: s.translations.en.caption,
        aria_es: s.translations.es.aria,
        aria_en: s.translations.en.aria
      }
    };
  });

  const abstractionDoc = {
    contract_version: "2.0.0",
    title_es: "¿A qué altura vives?",
    title_en: "How high do you stand?",
    subtitle_es: `La distancia real entre ricos y pobres es de ${fHeight.label}`,
    subtitle_en: `The real distance between rich and poor is ${fHeight.label}`,
    semantic_concept_es: "Patrimonio neto global",
    semantic_concept_en: "Global net worth",
    scale_formula: {
      unit_value_usd: rawData.formula_constants.step_usd_value,
      step_height_meters: rawData.formula_constants.step_physical_height_meters
    },
    max_height_meters: maxMeters,
    layers,
    provenance: {
      dataset_id: "spec_data_v1",
      sources: rawData.metadata.sources || [],
      additional_limitations: rawData.metadata.additional_limitations || [],
      summary_es,
      summary_en,
      date_label_es: dateLabelEs,
      date_label_en: dateLabelEn
    }
  };

  const storyModel = new StoryModel(abstractionDoc);
  const compiledHtml = HtmlCompiler.compile(rawHtml, abstractionDoc, storyModel);

  fs.writeFileSync(HTML_PATH, compiledHtml, 'utf8');

  logSuccess(`HTML compilado dinámicamente con ${layers.length} estratos.`);
  logSuccess(`Escala validada: 1 escalón = $${rawData.formula_constants.step_usd_value} USD (${rawData.formula_constants.step_physical_height_meters} m).`);
  console.log(`\n${GREEN}${BOLD}✓ ¡ÉXITO! Compilación completada en: ${HTML_PATH}${RESET}\n`);

  process.exit(0);
} catch (error) {
  logError(`Fallo al compilar e inyectar datos: ${error.message}`);
  process.exit(1);
}
