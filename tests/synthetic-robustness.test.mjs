/**
 * synthetic-robustness.test.mjs
 *
 * PROPÓSITO:
 * Suite de pruebas de robustez automatizada (100 iteraciones con datos aleatorios).
 * Garantiza que ante cualquier cambio de datos, encuestas futuras, multimillonarios u organizaciones
 * en la cima de la pirámide de la riqueza, la metodología, el validador, el compilador y el DOM
 * del visualizador HTML se mantengan completamente robustos, estables y sin errores visuales o lógicos.
 *
 * FLUJO DE CADA ITERACIÓN:
 * 1. Genera un dataset sintético aleatorio pero metodológica y matemáticamente consistente.
 * 2. Escribe los datos generados a `SPEC/data.json`.
 * 3. Ejecuta el validador oficial `node SPEC/scripts/validate-data.js` comprobando su éxito (código de salida 0).
 * 4. Ejecuta el compilador oficial `node SPEC/scripts/apply-data.js` comprobando su éxito (código de salida 0).
 * 5. Carga y analiza el HTML compilado usando JSDOM para validar de forma quirúrgica:
 *    - Presencia de las 8 secciones de estratos (`#s1` a `#s8`) sin duplicados ni grids corruptas.
 *    - Atributos `data-alt`, `data-label` y `aria-label` en cada sección.
 *    - Contenido de `<div class="num">` con formato numérico y de unidad perfectos.
 *    - Inyección quirúrgica exitosa del SVG dinámico (`svg_icon`) correspondiente a cada estrato.
 *    - Extracción y parseo del bloque de traducción Javascript `STRINGS`.
 *    - Comprobación i18n de titulares, subtítulos, fichas técnicas dinámicas y traducciones de estrato en ES y EN.
 * 6. En caso de cualquier fallo, interrumpe el bucle, detalla la discrepancia y restaura los backups inmediatamente.
 * 7. Al finalizar la suite completa, limpia el entorno restaurando los archivos originales de forma impecable.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import assert from 'assert/strict';
import { JSDOM } from 'jsdom';
import { fileURLToPath } from 'url';

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

// Helper para dar formato a alturas (idéntico al de apply-data.js para comparación exacta)
function formatHeight(meters) {
  if (meters >= 1000) {
    const km = meters / 1000;
    const numStr = km % 1 === 0 ? km.toLocaleString('en-US') : km.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return { num: numStr, unit: 'km', label: `${numStr} km` };
  } else if (meters >= 1) {
    const numStr = meters % 1 === 0 ? meters.toString() : meters.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
    return { num: numStr, unit: 'm', label: `${numStr} m` };
  } else {
    const cm = Math.round(meters * 1000) / 10;
    const numStr = cm.toString();
    return { num: numStr, unit: 'cm', label: `${numStr} cm` };
  }
}

logHeader('Suite de Robustez de Datos Sintéticos y Compilación');
console.log(`Iniciando prueba de resistencia de 100 iteraciones aleatorias...`);

// 1. Realizar backups iniciales para restaurar al terminar
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
const totalIterations = 100;

try {
  for (let i = 1; i <= totalIterations; i++) {
    console.log(`\n[Iteración ${i}/${totalIterations}] --------------------------------------------------`);

    // A. Generar datos sintéticos aleatorios y consistentes
    const syntheticData = generateSyntheticData();
    fs.writeFileSync(DATA_PATH, JSON.stringify(syntheticData, null, 2), 'utf8');

    // B. Ejecutar el validador oficial y verificar el éxito
    try {
      execSync('node SPEC/scripts/validate-data.js', { stdio: 'pipe' });
    } catch (err) {
      throw new Error(`La validación del SPEC falló en la iteración ${i}. Detalles:\n${err.stderr ? err.stderr.toString() : err.message}`);
    }

    // C. Ejecutar el compilador e inyector oficial y verificar el éxito
    try {
      execSync('node SPEC/scripts/apply-data.js', { stdio: 'pipe' });
    } catch (err) {
      throw new Error(`La compilación del HTML falló en la iteración ${i}. Detalles:\n${err.stderr ? err.stderr.toString() : err.message}`);
    }

    // D. Leer el HTML generado y procesar aserciones quirúrgicas
    const compiledHtml = fs.readFileSync(HTML_PATH, 'utf8');
    const dom = new JSDOM(compiledHtml, {
      runScripts: "dangerously",
      beforeParse(window) {
        // Stub standard matchMedia
        window.matchMedia = window.matchMedia || (() => ({
          matches: false,
          media: '',
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false
        }));
        // Stub IntersectionObserver
        window.IntersectionObserver = class {
          constructor() {}
          observe() {}
          unobserve() {}
          disconnect() {}
        };
        // Stub localStorage
        let store = {};
        const localStorageMock = {
          getItem: (key) => store[key] || null,
          setItem: (key, value) => { store[key] = value.toString(); },
          removeItem: (key) => { delete store[key]; },
          clear: () => { store = {}; }
        };
        Object.defineProperty(window, 'localStorage', {
          value: localStorageMock,
          writable: true
        });
      }
    });
    const { document } = dom.window;


    // 1. Validar integridad de las secciones snaps de estratos
    const snaps = document.querySelectorAll('section.snap');
    // Debería haber exactamente 9 secciones snaps (s1 a s8 + metodología/ficha técnica s9)
    // El visualizador tiene: s1, s2, s3, s4, s5, s6, s7, s8 como secciones de estratos.
    // Comprobemos la presencia de cada ID s1 a s8
    for (let sIdx = 1; sIdx <= 8; sIdx++) {
      const sectionId = `s${sIdx}`;
      const section = document.getElementById(sectionId);
      assert.ok(section, `La sección #${sectionId} debe existir en el HTML compilado.`);

      const stratum = syntheticData.strata.find(s => s.id === sectionId);
      assert.ok(stratum, `El estrato ${sectionId} debe existir en el JSON sintético.`);

      const fHeight = formatHeight(stratum.physical_analogy.height_meters);

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
        `El SVG inyectado en #${sectionId} debe tener el id "svg-${sectionId}"`
      );
    }

    // 2. Extraer y parsear el diccionario de traducción STRINGS
    const stringsRegex = /\/\/ STRINGS_START\s*const STRINGS = (\{[\s\S]*?\});\s*\/\/ STRINGS_END/;
    const stringsMatch = compiledHtml.match(stringsRegex);
    assert.ok(stringsMatch, 'Debería encontrarse el bloque de comentarios delimitadores del diccionario STRINGS en el script HTML.');

    let parsedStrings;
    try {
      parsedStrings = JSON.parse(stringsMatch[1]);
    } catch (err) {
      throw new Error(`El bloque de traducción STRINGS inyectado en el HTML no es un JSON válido: ${err.message}`);
    }

    // Validar concordancia de las traducciones i18n
    const totalBillionairesFormattedES = syntheticData.metadata.total_billionaires.toLocaleString('es-ES');
    const totalBillionairesFormattedEN = syntheticData.metadata.total_billionaires.toLocaleString('en-US');
    const totalAdultsFormattedES = (syntheticData.metadata.total_adults_world / 1000).toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 3 }) + ' millones';
    const totalAdultsFormattedEN = (syntheticData.metadata.total_adults_world / 1000).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 3 }) + ' billion';

    const s1Stratum = syntheticData.strata.find(s => s.id === 's1');
    const topHolderNameES = syntheticData.metadata.top_wealth_holder.name_es;
    const topHolderNameEN = syntheticData.metadata.top_wealth_holder.name_en;

    // Aserciones en ES
    assert.ok(parsedStrings.es, 'Debería existir el idioma "es" en STRINGS.');
    assert.ok(
      parsedStrings.es.intro_sub.includes(formatHeight(s1Stratum.physical_analogy.height_meters).label),
      `intro_sub en ES no contiene la altura real de s1. Esperado: "${formatHeight(s1Stratum.physical_analogy.height_meters).label}", Obtenido: "${parsedStrings.es.intro_sub}"`
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
      parsedStrings.en.intro_sub.includes(formatHeight(s1Stratum.physical_analogy.height_meters).label),
      `intro_sub en EN no contiene la altura real de s1. Esperado: "${formatHeight(s1Stratum.physical_analogy.height_meters).label}", Obtenido: "${parsedStrings.en.intro_sub}"`
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

    // Aserciones específicas de cada estrato inyectado en STRINGS
    syntheticData.strata.forEach(s => {
      assert.equal(parsedStrings.es[`${s.id}_headline`], s.translations.es.headline);
      assert.equal(parsedStrings.es[`${s.id}_caption`], s.translations.es.caption);
      assert.equal(parsedStrings.es[`${s.id}_aria`], s.translations.es.aria);

      assert.equal(parsedStrings.en[`${s.id}_headline`], s.translations.en.headline);
      assert.equal(parsedStrings.en[`${s.id}_caption`], s.translations.en.caption);
      assert.equal(parsedStrings.en[`${s.id}_aria`], s.translations.en.aria);
    });

    // 3. Comprobar que no haya secciones con IDs duplicados o grids corruptas
    const idSet = new Set();
    document.querySelectorAll('[id]').forEach(el => {
      const id = el.id;
      assert.ok(!idSet.has(id), `Se detectó un ID duplicado en el DOM: "${id}"`);
      idSet.add(id);
    });

    // Verificar que no se hayan inyectado etiquetas <section> o <div> rotas dentro de párrafos
    const captionParagraphs = document.querySelectorAll('p.caption');
    captionParagraphs.forEach(p => {
      assert.equal(p.querySelectorAll('section').length, 0, `¡ERROR CRÍTICO! Se inyectaron etiquetas <section> dentro de un <p class="caption">. Layout corrupto.`);
      assert.equal(p.querySelectorAll('div').length, 0, `¡ERROR CRÍTICO! Se inyectaron etiquetas <div> dentro de un <p class="caption">. Layout corrupto.`);
    });

    // 4. Verificar Suite de Accesibilidad (A11y Panel)
    const a11yToolbar = document.getElementById('a11y-toolbar');
    assert.ok(a11yToolbar, 'El panel de accesibilidad #a11y-toolbar debe existir.');
    
    const a11yToggle = document.getElementById('a11y-toggle');
    assert.ok(a11yToggle, 'El botón de alternancia #a11y-toggle debe existir.');
    
    const a11yMenu = document.getElementById('a11y-menu');
    assert.ok(a11yMenu, 'El menú de opciones #a11y-menu debe existir.');

    const btnHighContrast = document.getElementById('btn-high-contrast');
    assert.ok(btnHighContrast, 'El botón #btn-high-contrast debe existir.');
    
    const btnDyslexic = document.getElementById('btn-dyslexic');
    assert.ok(btnDyslexic, 'El botón #btn-dyslexic debe existir.');

    const sizeButtons = a11yMenu.querySelectorAll('button[data-scale]');
    assert.equal(sizeButtons.length, 3, 'Deben existir exactamente 3 botones de escala de texto.');

    // Aserción funcional 1: Comprobar escala por defecto (A = 1)
    const scale1_Btn = Array.from(sizeButtons).find(btn => btn.getAttribute('data-scale') === '1');
    const scale1_2_Btn = Array.from(sizeButtons).find(btn => btn.getAttribute('data-scale') === '1.2');
    const scale1_4_Btn = Array.from(sizeButtons).find(btn => btn.getAttribute('data-scale') === '1.4');

    assert.ok(scale1_Btn, 'Debe existir el botón de escala 1.0 (A)');
    assert.ok(scale1_2_Btn, 'Debe existir el botón de escala 1.2 (A+)');
    assert.ok(scale1_4_Btn, 'Debe existir el botón de escala 1.4 (A++)');

    // Estado inicial: escala 1 activa por defecto
    assert.equal(scale1_Btn.classList.contains('a11y-active'), true, 'El botón A (escala 1) debe tener la clase active.');
    assert.equal(scale1_2_Btn.classList.contains('a11y-active'), false, 'El botón A+ (escala 1.2) no debe tener la clase active inicialmente.');

    // Clic en A+ (1.2)
    scale1_2_Btn.click();
    assert.equal(dom.window.document.documentElement.style.getPropertyValue('--a11y-font-scale'), '1.2', 'El valor de --a11y-font-scale en el html debe ser 1.2 tras clic en A+.');
    assert.equal(scale1_2_Btn.classList.contains('a11y-active'), true, 'El botón A+ debe tener la clase active.');
    assert.equal(scale1_Btn.classList.contains('a11y-active'), false, 'El botón A ya no debe tener la clase active.');

    // Clic en A++ (1.4)
    scale1_4_Btn.click();
    assert.equal(dom.window.document.documentElement.style.getPropertyValue('--a11y-font-scale'), '1.4', 'El valor de --a11y-font-scale en el html debe ser 1.4 tras clic en A++.');
    assert.equal(scale1_4_Btn.classList.contains('a11y-active'), true, 'El botón A++ debe tener la clase active.');

    // Aserción funcional 2: Alternar modo dislexia (Lectura)
    assert.equal(dom.window.document.body.classList.contains('a11y-dyslexic'), false, 'El body no debe tener el modo dislexia por defecto.');
    
    btnDyslexic.click();
    assert.equal(dom.window.document.body.classList.contains('a11y-dyslexic'), true, 'El body debe activar la clase a11y-dyslexic tras hacer clic.');
    assert.equal(btnDyslexic.classList.contains('a11y-active'), true, 'El botón de dislexia debe tener la clase active.');

    // Intercambiar escala mientras modo dislexia está activo
    scale1_2_Btn.click();
    assert.equal(dom.window.document.documentElement.style.getPropertyValue('--a11y-font-scale'), '1.2', 'El valor de --a11y-font-scale debe poder cambiarse a 1.2 bajo modo dislexia.');
    assert.equal(dom.window.document.body.classList.contains('a11y-dyslexic'), true, 'La dislexia debe seguir activa tras cambiar la escala.');

    // Desactivar modo dislexia
    btnDyslexic.click();
    assert.equal(dom.window.document.body.classList.contains('a11y-dyslexic'), false, 'El modo dislexia debe desactivarse tras clic secundario.');

    // Aserción funcional 3: Alternar contraste
    assert.equal(dom.window.document.body.classList.contains('a11y-high-contrast'), false, 'El body no debe tener el modo alto contraste por defecto.');
    
    btnHighContrast.click();
    assert.equal(dom.window.document.body.classList.contains('a11y-high-contrast'), true, 'El body debe activar la clase a11y-high-contrast tras hacer clic.');

    btnHighContrast.click();
    assert.equal(dom.window.document.body.classList.contains('a11y-high-contrast'), false, 'El modo alto contraste debe desactivarse.');

    // Volver a escala 1 para dejar el DOM limpio en la iteración
    scale1_Btn.click();


    // 5. Verificar Ficha Técnica Dinámica y Híbrida
    const sourcesList = document.getElementById('sources-list');
    assert.ok(sourcesList, 'El contenedor #sources-list debe existir.');
    const sourcesItems = sourcesList.querySelectorAll('li');
    assert.equal(
      sourcesItems.length,
      syntheticData.metadata.sources ? syntheticData.metadata.sources.length : 0,
      `El número de fuentes renderizadas (${sourcesItems.length}) no coincide con el SPEC (${syntheticData.metadata.sources ? syntheticData.metadata.sources.length : 0}).`
    );

    const limitationsList = document.getElementById('limitations-list');
    assert.ok(limitationsList, 'El contenedor #limitations-list debe existir.');
    const limitationsItems = limitationsList.querySelectorAll('li');
    const expectedLimitationsCount = 4 + (syntheticData.metadata.additional_limitations ? syntheticData.metadata.additional_limitations.length : 0);
    assert.equal(
      limitationsItems.length,
      expectedLimitationsCount,
      `El número de limitaciones renderizadas (${limitationsItems.length}) no coincide con el esperado (${expectedLimitationsCount}).`
    );

    // 6. Verificar la ausencia absoluta del footer redundante
    const footerTextElement = document.querySelector('[data-i18n="footer_text"]');
    assert.ok(!footerTextElement, '¡ERROR CRÍTICO! Se encontró una firma de footer redundante ("footer_text") en el DOM.');
    
    assert.ok(!parsedStrings.es.footer_text, 'El diccionario "es" no debe contener "footer_text".');
    assert.ok(!parsedStrings.en.footer_text, 'El diccionario "en" no debe contener "footer_text".');

    // Verificar las claves dinámicas en el diccionario STRINGS
    if (syntheticData.metadata.sources) {
      syntheticData.metadata.sources.forEach((src, idx) => {
        assert.equal(parsedStrings.es[`metod_source_${idx}`], src.name_es);
        assert.equal(parsedStrings.en[`metod_source_${idx}`], src.name_en);
      });
    }

    if (syntheticData.metadata.additional_limitations) {
      syntheticData.metadata.additional_limitations.forEach((lim, idx) => {
        assert.equal(parsedStrings.es[`metod_li_add_${idx}`], lim.es);
        assert.equal(parsedStrings.en[`metod_li_add_${idx}`], lim.en);
      });
    }

    completedRuns++;
    logSuccess(`Iteración ${i} superada con éxito.`);
  }

  logHeader('Resumen del Test de Robustez');
  logSuccess(`¡ÉXITO ABSOLUTO! Se han ejecutado y superado las ${completedRuns}/${totalIterations} iteraciones de la prueba de robustez.`);
  console.log(`\n${GREEN}${BOLD}✓ El pipeline y el visualizador HTML son 100% inmunes a variaciones futuras de datos sintéticos extremas.${RESET}\n`);

} catch (error) {
  logHeader('Fallo de Robustez');
  logError(`El test de robustez ha fallado en la iteración ${completedRuns + 1}.`);
  console.error(`${RED}Mensaje de error:${RESET} ${error.message}`);
  console.error(error.stack);
  
  // Salir con código 1 para fallar en el workflow
  process.exit(1);

} finally {
  // Siempre restaurar el estado original en la salida
  console.log('Restaurando archivos del SPEC y visualizador originales a su estado limpio...');
  try {
    fs.writeFileSync(DATA_PATH, originalDataRaw, 'utf8');
    fs.writeFileSync(HTML_PATH, originalHtmlRaw, 'utf8');
    logSuccess('Archivos originales restaurados con éxito.');
  } catch (restoreError) {
    logError(`No se pudieron restaurar los backups originales: ${restoreError.message}`);
  }
}
