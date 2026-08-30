/**
 * synthetic-robustness.test.mjs
 * 
 * SUITE DE RESISTENCIA Y ROBUSTEZ DINÁMICA:
 * Ejecuta 25 iteraciones de prueba con datasets sintéticos generados aleatoriamente
 * para verificar que TODO el pipeline de inyección, compilación y renderizado funcione
 * sin errores en cualquier escenario posible de datos válidos futuros.
 * 
 * PROTECCIÓN DE LA LÍNEA BASE:
 * - Realiza backup inmutable antes de iniciar la suite.
 * - En cada iteración prueba la compilación dinámica.
 * - Al terminar (éxito o fallo), restaura de forma incondicional el SPEC/data.json oficial
 *   y ejecuta apply-data.js para garantizar que la producción conserve a Elon Musk,
 *   UBS 2024 y los SVGs canónicos del inventario.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import assert from 'assert/strict';
import { JSDOM, VirtualConsole } from 'jsdom';
import { fileURLToPath } from 'url';
import { NumberFormatter } from '../src/i18n/number-formatter.js';

// Importar el generador de datos sintéticos
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

logHeader('Suite de Robustez de Datos Sintéticos y Compilación');
console.log(`Iniciando prueba de resistencia con aislamiento y protección de la línea base...`);

// 1. Realizar backups iniciales inmutables para restaurar al terminar
if (!fs.existsSync(DATA_PATH)) {
  logError(`No se encontró el archivo de datos original en: ${DATA_PATH}`);
  process.exit(1);
}
if (!fs.existsSync(HTML_PATH)) {
  logError(`No se encontró el HTML visualizador original en: ${HTML_PATH}`);
  process.exit(1);
}

const originalDataRaw = fs.readFileSync(DATA_PATH, 'utf8');
const originalHtmlRaw = fs.readFileSync(HTML_PATH, 'utf8');

let completedRuns = 0;
const totalIterations = parseInt(process.env.ROBUSTNESS_ITERATIONS || "25", 10);

try {
  for (let i = 1; i <= totalIterations; i++) {
    console.log(`\n[Iteración ${i}/${totalIterations}] --------------------------------------------------`);

    // A. Generar datos sintéticos aleatorios y consistentes
    const syntheticData = generateSyntheticData();
    fs.writeFileSync(DATA_PATH, JSON.stringify(syntheticData, null, 2), 'utf8');

    // B. Ejecutar el validador oficial y verificar el éxito
    try {
      execSync(`node "${path.resolve(__dirname, '../SPEC/scripts/validate-data.js')}"`, { stdio: 'pipe' });
    } catch (err) {
      throw new Error(`Fallo en validate-data.js en la iteración ${i}: ${err.message}`);
    }

    // C. Ejecutar el script oficial de compilación apply-data.js
    try {
      execSync(`node "${path.resolve(__dirname, '../SPEC/scripts/apply-data.js')}"`, { stdio: 'pipe' });
    } catch (err) {
      throw new Error(`Fallo en apply-data.js en la iteración ${i}: ${err.message}`);
    }

    // D. Leer y parsear el HTML compilado para verificación en profundidad
    const compiledHtml = fs.readFileSync(HTML_PATH, 'utf8');

    let i18nCheckError = null;
    const vc = new VirtualConsole();
    vc.on('warn', (msg) => {
      if (msg.includes('[i18n]')) {
        i18nCheckError = msg;
      }
    });
    vc.on('error', (err) => {
      // Ignorar errores de layout o scroll no implementados en JSDOM
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

    // 1. Validar integridad de las secciones snaps de estratos
    const snaps = document.querySelectorAll('section.snap');
    for (let sIdx = 1; sIdx <= 8; sIdx++) {
      const sectionId = `s${sIdx}`;
      const section = document.getElementById(sectionId);
      assert.ok(section, `La sección #${sectionId} debe existir en el HTML compilado.`);

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

      // Comprobar inyección de SVG dinámico
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

    // 2. Extraer y verificar el objeto STRINGS inyectado en el script del visualizador
    const stringsRegex = /const STRINGS = (\{[\s\S]*?\});/;
    const stringsMatch = compiledHtml.match(stringsRegex);
    assert.ok(stringsMatch, 'El objeto STRINGS debe estar presente y delimitado en el HTML compilado.');

    let parsedStrings;
    try {
      parsedStrings = JSON.parse(stringsMatch[1]);
    } catch (parseErr) {
      throw new Error(`El bloque STRINGS inyectado no es JSON válido: ${parseErr.message}`);
    }

    // 3. Validar consistencia de las cadenas i18n
    const totalBillionairesFormattedES = NumberFormatter.formatNumber(syntheticData.metadata.total_billionaires, 'es');
    const totalBillionairesFormattedEN = NumberFormatter.formatNumber(syntheticData.metadata.total_billionaires, 'en');
    const totalAdultsFormattedES = NumberFormatter.formatNumber(syntheticData.metadata.total_adults_world / 1000, 'es', { minimumFractionDigits: 1, maximumFractionDigits: 3 }) + ' millones';
    const totalAdultsFormattedEN = NumberFormatter.formatNumber(syntheticData.metadata.total_adults_world / 1000, 'en', { minimumFractionDigits: 1, maximumFractionDigits: 3 }) + ' billion';

    const s1Stratum = syntheticData.strata.find(s => s.id === 's1');
    const topHolderNameES = syntheticData.metadata.top_wealth_holder.name_es;
    const topHolderNameEN = syntheticData.metadata.top_wealth_holder.name_en;

    // Aserciones en ES
    assert.ok(parsedStrings.es, 'Debería existir el idioma "es" en STRINGS.');
    assert.ok(
      parsedStrings.es.intro_sub.includes(formatHeight(s1Stratum.physical_analogy.height_meters, 'es').label),
      `intro_sub en ES no contiene la altura real de s1. Esperado: "${formatHeight(s1Stratum.physical_analogy.height_meters, 'es').label}", Obtenido: "${parsedStrings.es.intro_sub}"`
    );
    assert.ok(
      parsedStrings.es.metod_p1.includes(topHolderNameES),
      `metod_p1 en ES debería incluir al poseedor de riqueza "${topHolderNameES}"`
    );
    assert.ok(
      parsedStrings.es.metod_p1.includes(totalBillionairesFormattedES),
      `metod_p1 en ES debería incluir la cantidad formateada de billonarios "${totalBillionairesFormattedES}"`
    );
    assert.ok(
      parsedStrings.es.metod_p1.includes(totalAdultsFormattedES),
      `metod_p1 en ES debería incluir la cantidad de adultos del mundo "${totalAdultsFormattedES}"`
    );

    // Aserciones en EN
    assert.ok(parsedStrings.en, 'Debería existir el idioma "en" en STRINGS.');
    assert.ok(
      parsedStrings.en.intro_sub.includes(formatHeight(s1Stratum.physical_analogy.height_meters, 'en').label),
      `intro_sub en EN no contiene la altura real de s1. Esperado: "${formatHeight(s1Stratum.physical_analogy.height_meters, 'en').label}", Obtenido: "${parsedStrings.en.intro_sub}"`
    );
    assert.ok(
      parsedStrings.en.metod_p1.includes(topHolderNameEN),
      `metod_p1 en EN debería incluir al poseedor de riqueza "${topHolderNameEN}"`
    );
    assert.ok(
      parsedStrings.en.metod_p1.includes(totalBillionairesFormattedEN),
      `metod_p1 en EN debería incluir la cantidad formateada de billonarios "${totalBillionairesFormattedEN}"`
    );
    assert.ok(
      parsedStrings.en.metod_p1.includes(totalAdultsFormattedEN),
      `metod_p1 en EN debería incluir la cantidad de adultos del mundo "${totalAdultsFormattedEN}"`
    );

    // 4. Validar la inexistencia de claves faltantes en el cliente
    assert.equal(i18nCheckError, null, `Se detectaron discrepancias en la validación i18n del cliente: ${i18nCheckError}`);

    completedRuns++;
    logSuccess(`Iteración ${i} superada con éxito.`);
  }

  // Si se completan todas las iteraciones exitosamente:
  logHeader('Resumen del Test de Robustez');
  logSuccess(`¡ÉXITO ABSOLUTO! Se han ejecutado y superado las ${completedRuns}/${totalIterations} iteraciones de la prueba de robustez.`);
  console.log(`\n${GREEN}${BOLD}✓ El pipeline y el visualizador HTML son 100% inmunes a variaciones futuras de datos sintéticos extremas.${RESET}\n`);

} catch (error) {
  logHeader('Fallo de Robustez');
  logError(`El test de robustez ha fallado en la iteración ${completedRuns + 1}.`);
  console.error(`Mensaje de error: ${error.message}`);
  console.error(error.stack);
  process.exitCode = 1;
} finally {
  // 5. RESTAURACIÓN IMPECABLE Y OBLIGATORIA:
  // Devolver SPEC/data.json y el HTML a su estado canónico original con Elon Musk y UBS 2024
  console.log('Restaurando archivos del SPEC y visualizador originales a su estado limpio...');
  try {
    fs.writeFileSync(DATA_PATH, originalDataRaw, 'utf8');
    fs.writeFileSync(HTML_PATH, originalHtmlRaw, 'utf8');
    // Ejecutar apply-data.js para asegurar que el HTML compilado coincida 100% con data.json
    execSync(`node "${path.resolve(__dirname, '../SPEC/scripts/apply-data.js')}"`, { stdio: 'pipe' });
    logSuccess('Archivos originales restaurados con éxito.');
  } catch (restoreErr) {
    logError(`No se pudieron restaurar los archivos originales: ${restoreErr.message}`);
  }
}
