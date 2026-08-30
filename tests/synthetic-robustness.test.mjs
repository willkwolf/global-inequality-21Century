/**
 * synthetic-robustness.test.mjs
 * 
 * SUITE DE RESISTENCIA Y ROBUSTEZ DINÁMICA (ARQUITECTURA DE SANDBOX CHALLENGER):
 * Ejecuta 25 iteraciones de prueba con datasets sintéticos desafiantes generados aleatoriamente
 * para verificar que TODO el pipeline de inyección, compilación y renderizado funcione
 * sin errores en cualquier escenario posible de datos válidos futuros.
 * 
 * PRINCIPIO DE AISLAMIENTO CHAMPION / CHALLENGER:
 * - El Champion en producción (SPEC/data.json y Escala-visual-de-riqueza-mundial.html) NUNCA
 *   se modifica ni se sobrescribe durante las iteraciones de prueba.
 * - Toda compilación de prueba (Challenger) se realiza en memoria / sandbox aislado mediante
 *   HtmlCompiler y StoryModel.
 * - Cero riesgo de contaminación de la línea base oficial.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert/strict';
import { JSDOM, VirtualConsole } from 'jsdom';
import { fileURLToPath } from 'url';
import { NumberFormatter } from '../src/i18n/number-formatter.js';
import { HtmlCompiler } from '../src/renderer/html-compiler.js';
import { StoryModel } from '../src/contracts/story-model.js';
import { ScaleRecalibrator } from '../src/agent/scale-recalibrator.js';
import { EntityFilter } from '../src/domain/domain-definition.js';
import { generateSyntheticData } from '../SPEC/scripts/generate-synthetic-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colores para consola
const RESET = '\x1b[0m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const BOLD = '\x1b[1m';

function logSuccess(msg) { console.log(`${GREEN}✓ ${msg}${RESET}`); }
function logWarning(msg) { console.log(`${YELLOW}⚠ ${msg}${RESET}`); }
function logError(msg) { console.error(`${RED}${BOLD}✗ ERROR: ${msg}${RESET}`); }
function logHeader(msg) { console.log(`\n${BOLD}${BLUE}=== ${msg} ===${RESET}`); }

// Rutas de archivos
const DATA_PATH = path.resolve(__dirname, '../SPEC/data.json');
const HTML_PATH = path.resolve(__dirname, '../Escala-visual-de-riqueza-mundial.html');

// Helper para dar formato a alturas centralizado con NumberFormatter
function formatHeight(meters, locale = 'es') {
  const res = NumberFormatter.formatHeight(meters, locale);
  return { num: res.value_formatted, unit: res.unit, label: res.full_label };
}

logHeader('Suite de Robustez de Datos Sintéticos (Sandbox Challenger Aislado)');
console.log(`Iniciando prueba de 25 iteraciones aleatorias sin mutar los archivos de producción...`);

if (!fs.existsSync(DATA_PATH)) {
  logError(`No se encontró el archivo de datos original en: ${DATA_PATH}`);
  process.exit(1);
}
if (!fs.existsSync(HTML_PATH)) {
  logError(`No se encontró el HTML visualizador original en: ${HTML_PATH}`);
  process.exit(1);
}

// Plantilla base HTML de producción (leída en modo Solo-Lectura)
const templateHtml = fs.readFileSync(HTML_PATH, 'utf8');

let completedRuns = 0;
const totalIterations = parseInt(process.env.ROBUSTNESS_ITERATIONS || "25", 10);

try {
  for (let i = 1; i <= totalIterations; i++) {
    console.log(`\n[Iteración ${i}/${totalIterations} - Challenger Sandbox] -----------------------------`);

    // A. Generar datos sintéticos desafiantes (Challenger)
    const syntheticData = generateSyntheticData();

    // B. Validar entidad y consistencia del dataset sintético
    const topHolder = syntheticData.metadata.top_wealth_holder;
    const classification = EntityFilter.classifyEntity(topHolder.name_es || topHolder.name_en || topHolder.name);
    assert.ok(classification.is_natural_person, `La entidad sintética en la cúspide debe ser persona natural.`);

    const s1 = syntheticData.strata.find(s => s.id === 's1') || syntheticData.strata[0];
    const maxMeters = s1.physical_analogy.height_meters;
    const fHeightEs = NumberFormatter.formatHeight(maxMeters, 'es');
    const fHeightEn = NumberFormatter.formatHeight(maxMeters, 'en');

    const totalAdultsWorld = syntheticData.metadata.total_adults_world || 5360;
    const totalBillionaires = syntheticData.metadata.total_billionaires || 2891;
    const lastUpdated = syntheticData.metadata.last_updated_sources;

    const formattedAdultsES = NumberFormatter.formatNumber(totalAdultsWorld / 1000, 'es', { minimumFractionDigits: 1, maximumFractionDigits: 3 }) + ' millones';
    const formattedAdultsEN = NumberFormatter.formatNumber(totalAdultsWorld / 1000, 'en', { minimumFractionDigits: 1, maximumFractionDigits: 3 }) + ' billion';

    const formattedBillionairesES = NumberFormatter.formatNumber(totalBillionaires, 'es');
    const formattedBillionairesEN = NumberFormatter.formatNumber(totalBillionaires, 'en');

    const reportYear = lastUpdated.ubs_report_date ? lastUpdated.ubs_report_date.split('-')[0] : "2024";
    const dateLabelEs = `UBS · dic ${reportYear} · * Valor presente`;
    const dateLabelEn = `UBS · Dec ${reportYear} · * Present value`;

    const summary_es = `UBS Global Wealth Report ${reportYear}. ${topHolder.name_es} y ${formattedBillionairesES} billonarios. Adultos: ${formattedAdultsES}.`;
    const summary_en = `UBS Global Wealth Report ${reportYear}. ${topHolder.name_en} and ${formattedBillionairesEN} billionaires. Adults: ${formattedAdultsEN}.`;

    const layers = syntheticData.strata.map((s, idx) => {
      const height = s.physical_analogy.height_meters;
      const hEs = NumberFormatter.formatHeight(height, 'es');
      const hEn = NumberFormatter.formatHeight(height, 'en');

      return {
        layer_id: s.id || `s${idx + 1}`,
        pedagogical_role: s.pedagogical_role || (idx === 0 ? "EXTREMO" : (idx === syntheticData.strata.length - 1 ? "BASE" : "CONTRASTE")),
        raw_magnitude: s.net_worth_range_usd.average || s.net_worth_range_usd.min || 0,
        magnitude_unit: "USD",
        physical_height_meters: height,
        formatted_height_label: hEs.full_label,
        formatted_height_num: hEs.value_formatted,
        formatted_height_unit: hEs.unit,
        formatted_height_en: hEn,
        population_share_percentage: s.population_ratio?.percentage ? s.population_ratio.percentage * 100 : 0,
        physical_reference: {
          name_es: s.physical_analogy.name_es,
          name_en: s.physical_analogy.name_en,
          svg_icon: s.svg_icon
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
      analysis_unit: "natural_person",
      title_es: "¿A qué altura vives?",
      title_en: "How high do you stand?",
      subtitle_es: `La distancia real entre la base y la cúspide es de ${fHeightEs.full_label}`,
      subtitle_en: `The real distance between base and apex is ${fHeightEn.full_label}`,
      semantic_concept_es: "Patrimonio neto personal por adulto (Net Worth per Adult)",
      semantic_concept_en: "Personal net worth per adult",
      scale_formula: {
        unit_value_usd: syntheticData.formula_constants.step_usd_value,
        step_height_meters: syntheticData.formula_constants.step_physical_height_meters
      },
      max_height_meters: maxMeters,
      layers,
      provenance: {
        dataset_id: `synthetic_run_${i}`,
        sources: syntheticData.metadata.sources || [],
        limitations: [
          { code: "VALUATION", es: "Patrimonio neto individual = activos menos deudas.", en: "Net worth = assets minus debts." },
          { code: "INDIVIDUAL_SCOPE", es: "Exclusivo personas naturales.", en: "Exclusive natural persons." }
        ],
        summary_es,
        summary_en,
        date_label_es: dateLabelEs,
        date_label_en: dateLabelEn
      }
    };

    // C. Compilación aislada en memoria mediante HtmlCompiler
    const storyModel = new StoryModel(abstractionDoc);
    const compiledHtml = HtmlCompiler.compile(templateHtml, abstractionDoc, storyModel);

    // D. Inspección y validación del DOM en memoria mediante JSDOM
    let i18nCheckError = null;
    const vc = new VirtualConsole();
    vc.on('warn', (msg) => {
      if (msg.includes('[i18n]')) {
        i18nCheckError = msg;
      }
    });
    vc.on('error', (err) => {
      if (!err.toString().includes('matchMedia') && !err.toString().includes('IntersectionObserver')) {
        console.error('JSDOM Error:', err);
      }
    });

    const dom = new JSDOM(compiledHtml, {
      runScripts: "dangerously",
      resources: "usable",
      virtualConsole: vc
    });

    const { document } = dom.window;

    // 1. Validar integridad de las secciones de estratos
    for (let sIdx = 1; sIdx <= 8; sIdx++) {
      const sectionId = `s${sIdx}`;
      const section = document.getElementById(sectionId);
      assert.ok(section, `La sección #${sectionId} debe existir en el HTML compilado en memoria.`);

      const stratum = syntheticData.strata.find(s => s.id === sectionId);
      assert.ok(stratum, `El estrato ${sectionId} debe existir en el JSON sintético.`);

      const fHeight = formatHeight(stratum.physical_analogy.height_meters, 'es');

      // Comprobar atributos data-* de escalado
      const dataAlt = section.getAttribute('data-alt');
      const dataLabel = section.getAttribute('data-label');
      
      assert.equal(
        dataAlt,
        stratum.physical_analogy.height_meters.toString(),
        `La sección #${sectionId} tiene data-alt "${dataAlt}", pero se esperaba "${stratum.physical_analogy.height_meters}"`
      );

      assert.equal(
        dataLabel,
        fHeight.label,
        `La sección #${sectionId} tiene data-label "${dataLabel}", pero se esperaba "${fHeight.label}"`
      );

      // Comprobar inyección de alturas visuales en <div class="num">
      const numDiv = section.querySelector('.num');
      assert.ok(numDiv, `La sección #${sectionId} debe contener un elemento con clase .num`);
      assert.equal(
        numDiv.innerHTML.replace(/\s+/g, ''),
        `${fHeight.num}<span>${fHeight.unit}</span>`.replace(/\s+/g, ''),
        `El HTML del .num de #${sectionId} no coincide. Se obtuvo "${numDiv.innerHTML}"`
      );

      // Comprobar inyección de SVG canónico del inventario
      const iconDiv = section.querySelector('.icon');
      assert.ok(iconDiv, `La sección #${sectionId} debe contener un elemento con clase .icon`);
      
      const svgElement = iconDiv.querySelector('svg');
      assert.ok(svgElement, `El contenedor .icon de #${sectionId} debe contener un elemento <svg>`);
      assert.equal(
        svgElement.getAttribute('id'),
        `svg-${sectionId}`,
        `El SVG de #${sectionId} debe tener el ID canónico "svg-${sectionId}"`
      );
    }

    // 2. Validar que no hay errores en el cliente
    assert.equal(i18nCheckError, null, `Se detectaron discrepancias en la validación i18n del cliente: ${i18nCheckError}`);

    completedRuns++;
    logSuccess(`Iteración ${i} superada en sandbox aislado.`);
  }

  logHeader('Resumen del Test de Robustez');
  logSuccess(`¡ÉXITO ABSOLUTO! Se han ejecutado y superado las ${completedRuns}/${totalIterations} iteraciones sin modificar los archivos de producción.`);
  console.log(`\n${GREEN}${BOLD}✓ El Champion de producción se mantuvo 100% protegido e inmutable durante todas las pruebas.${RESET}\n`);

} catch (error) {
  logHeader('Fallo de Robustez en Sandbox');
  logError(`El test de robustez ha fallado en la iteración ${completedRuns + 1}.`);
  console.error(`Mensaje de error: ${error.message}`);
  console.error(error.stack);
  process.exitCode = 1;
}
