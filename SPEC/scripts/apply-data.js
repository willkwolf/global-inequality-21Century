/**
 * apply-data.js
 *
 * PROPÓSITO:
 * Leer `SPEC/data.json`, generar las traducciones y métricas correspondientes,
 * y reescribir de forma quirúrgica `Escala-visual-de-riqueza-mundial.html`
 * sin alterar la estructura CSS, interactividad ni la portabilidad offline.
 *
 * PROCEDIMIENTO:
 * 1. Cargar `SPEC/data.json`.
 * 2. Generar dinámicamente el objeto `STRINGS` de traducción (incluyendo los textos de ficha
 *    técnica que dependen de los metadatos de población y constantes de fórmula).
 * 3. Reemplazar quirúrgicamente el bloque `STRINGS` delimitado por `// STRINGS_START` y `// STRINGS_END`.
 * 4. Para cada uno de los 8 estratos, actualizar los atributos `<section>` (`data-alt`, `data-label`, `aria-label`)
 *    y el `<div class="num">` visual a partir del patrimonio y fórmula del SPEC.
 * 5. Escribir los cambios al archivo HTML.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colores para consola
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const BLUE = '\x1b[34m';
const BOLD = '\x1b[1m';

function logSuccess(msg) { console.log(`${GREEN}✓ ${msg}${RESET}`); }
function logError(msg) { console.error(`${RED}${BOLD}✗ ERROR: ${msg}${RESET}`); }
function logHeader(msg) { console.log(`\n${BOLD}${BLUE}=== ${msg} ===${RESET}`); }

// Rutas de archivos
const DATA_PATH = path.resolve(__dirname, '../data.json');
const HTML_PATH = path.resolve(__dirname, '../../Escala-visual-de-riqueza-mundial.html');

logHeader('Iniciando Compilación e Inyección de Datos');

try {
  // 1. Leer archivos
  if (!fs.existsSync(DATA_PATH)) {
    throw new Error(`No se encontró data.json en: ${DATA_PATH}`);
  }
  if (!fs.existsSync(HTML_PATH)) {
    throw new Error(`No se encontró el HTML principal en: ${HTML_PATH}`);
  }

  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  let html = fs.readFileSync(HTML_PATH, 'utf8');

  const { total_billionaires, total_adults_world, last_updated_sources, top_wealth_holder } = data.metadata;
  const { step_usd_value, step_physical_height_meters } = data.formula_constants;

  // Encontrar s1 (Musk/Top) y s7 (Mediana) para formatear ficha técnica
  const s1 = data.strata.find(s => s.id === 's1');
  const s4 = data.strata.find(s => s.id === 's4');
  const s7 = data.strata.find(s => s.id === 's7');

  const formattedAdultsES = (total_adults_world / 1000).toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 3 }) + ' millones';
  const formattedAdultsEN = (total_adults_world / 1000).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 3 }) + ' billion';

  const formattedBillionairesES = total_billionaires.toLocaleString('es-ES');
  const formattedBillionairesEN = total_billionaires.toLocaleString('en-US');

  // Helper para dar formato a alturas
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

  // Helper para dar formato a miles de millones (Billions)
  function formatBillion(value) {
    if (value === null) return 'N/A';
    const billions = value / 1000000000;
    return billions % 1 === 0 ? billions.toString() : billions.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  }

  // Helper para parsear la fecha de Forbes
  function formatForbesDate(dateStr, lang) {
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

  // Mappers para palabras de tipo de entidad
  const typeWordsES = {
    person: 'billonarios',
    organization: 'organizaciones',
    other: 'entidades'
  };
  const typeWordsEN = {
    person: 'billionaires',
    organization: 'organizations',
    other: 'entities'
  };
  const typeWordES = typeWordsES[top_wealth_holder.type] || 'billonarios';
  const typeWordEN = typeWordsEN[top_wealth_holder.type] || 'billionaires';

  const rangeStr = `$${formatBillion(s1.net_worth_range_usd.min)}B–$${formatBillion(s1.net_worth_range_usd.max)}B`;
  const nameES = top_wealth_holder.name_es;
  const nameEN = top_wealth_holder.name_en;

  // 2. Construir STRINGS
  const stringsObj = {
    es: {
      skip_text:      'Saltar al contenido principal',
      intro_h1:       '¿A qué altura vives?',
      intro_sub:      `La distancia real entre ricos y pobres es de ${formatHeight(s1.physical_analogy.height_meters).label}`,
      metod_title:    'Ficha técnica',
      metod_lead:     'Convertimos patrimonio neto en altura física. Así de literal es la desigualdad.',
      metod_sum1:     'Fuentes',
      metod_p1:       `UBS Global Wealth Report 2024 (adultos, datos al 31 dic 2024). Forbes Real-Time Billionaires, ${formatForbesDate(last_updated_sources.forbes_billionaires_date, 'es')}: ${nameES} (${rangeStr}) y ${formattedBillionairesES} ${typeWordES} confirmados. Población adulta mundial: ${formattedAdultsES}.`,
      metod_sum2:     'Metodología',
      metod_p2:       `Para conocer en detalle la metodología de cálculo, la fórmula de escala utilizada y participar en la discusión técnica del modelo, consulta el <a href="https://github.com/willkwolf/global-inequality-21Century#metodolog%C3%ADa-de-visualizaci%C3%B3n--visualization-methodology" target="_blank" rel="noopener" style="color:#60a5fa;text-decoration:underline;">repositorio del proyecto en GitHub</a>.`,
      metod_sum3:     'Limitaciones',
      metod_li1:      'Patrimonio ≠ ingreso ni efectivo disponible. Incluye vivienda, pensiones, deudas.',
      metod_li2:      'Las fortunas de billonarios fluctúan diariamente.',
      metod_li3:      'La escala es logarítmica: de centímetros a kilómetros en una sola pantalla.',
      metod_li4:      'Esta visualización expone estructura sistémica, no juzga mérito individual.',
      footer_author:  '© 2026 William Camilo Artunduaga Viana ·',
      footer_license: 'CC BY 4.0',
      lang_btn:       'EN',
      lang_aria:      'Switch to English',
      data_date:      'UBS · dic 2024',
      scroll_cue:     'Desliza para comenzar',
      a11y_toolbar_label: 'Panel de accesibilidad',
      a11y_btn_aria:      'Opciones de accesibilidad',
      a11y_text_size:     'Tamaño',
      a11y_size_normal:   'A',
      a11y_size_large:    'A+',
      a11y_size_xl:       'A++',
      a11y_visuals:       'Ajustes',
      a11y_contrast:      'Contraste',
      a11y_dyslexia:      'Lectura'
    },
    en: {
      skip_text:      'Skip to main content',
      intro_h1:       'How high do you stand?',
      intro_sub:      `The real distance between rich and poor is ${formatHeight(s1.physical_analogy.height_meters).label}`,
      metod_title:    'Technical notes',
      metod_lead:     'We convert net worth into physical height. That is how literal inequality is.',
      metod_sum1:     'Sources',
      metod_p1:       `UBS Global Wealth Report 2024 (adults, data as of 31 Dec 2024). Forbes Real-Time Billionaires, ${formatForbesDate(last_updated_sources.forbes_billionaires_date, 'en')}: ${nameEN} (${rangeStr}) and ${formattedBillionairesEN} confirmed ${typeWordEN}. Global adult population: ${formattedAdultsEN}.`,
      metod_sum2:     'Methodology',
      metod_p2:       `For a detailed breakdown of the calculation methodology, the scaling formula used, and to join the technical discussion of the model, visit the <a href="https://github.com/willkwolf/global-inequality-21Century#metodolog%C3%ADa-de-visualizaci%C3%B3n--visualization-methodology" target="_blank" rel="noopener" style="color:#60a5fa;text-decoration:underline;">project repository on GitHub</a>.`,
      metod_sum3:     'Limitations',
      metod_li1:      'Net worth ≠ income or liquid cash. Includes housing, pensions, debts.',
      metod_li2:      'Billionaire fortunes fluctuate daily.',
      metod_li3:      'The scale is logarithmic: from centimeters to kilometers on one screen.',
      metod_li4:      'This visualization exposes systemic structure; it does not judge individual merit.',
      footer_author:  '© 2026 William Camilo Artunduaga Viana ·',
      footer_license: 'CC BY 4.0',
      lang_btn:       'ES',
      lang_aria:      'Cambiar a español',
      data_date:      'UBS · Dec 2024',
      scroll_cue:     'Scroll to begin',
      a11y_toolbar_label: 'Accessibility panel',
      a11y_btn_aria:      'Accessibility options',
      a11y_text_size:     'Size',
      a11y_size_normal:   'A',
      a11y_size_large:    'A+',
      a11y_size_xl:       'A++',
      a11y_visuals:       'Settings',
      a11y_contrast:      'Contrast',
      a11y_dyslexia:      'Dyslexic'
    }
  };

  // Agregar traducciones para limitaciones adicionales si están presentes en data.json
  if (data.metadata.additional_limitations) {
    data.metadata.additional_limitations.forEach((lim, idx) => {
      stringsObj.es[`metod_li_add_${idx}`] = lim.es;
      stringsObj.en[`metod_li_add_${idx}`] = lim.en;
    });
  }

  // Agregar traducciones para fuentes si están presentes en data.json
  if (data.metadata.sources) {
    data.metadata.sources.forEach((src, idx) => {
      stringsObj.es[`metod_source_${idx}`] = src.name_es;
      stringsObj.en[`metod_source_${idx}`] = src.name_en;
    });
  }

  // Agregar traducciones específicas de los estratos (s1_headline, s1_caption, s1_aria, etc.)
  data.strata.forEach(s => {
    stringsObj.es[`${s.id}_headline`] = s.translations.es.headline;
    stringsObj.es[`${s.id}_caption`]  = s.translations.es.caption;
    stringsObj.es[`${s.id}_aria`]     = s.translations.es.aria;

    stringsObj.en[`${s.id}_headline`] = s.translations.en.headline;
    stringsObj.en[`${s.id}_caption`]  = s.translations.en.caption;
    stringsObj.en[`${s.id}_aria`]     = s.translations.en.aria;
  });

  // 3. Serializar y reemplazar bloque STRINGS en HTML
  const startMarker = '// STRINGS_START';
  const endMarker = '// STRINGS_END';

  const startIndex = html.indexOf(startMarker);
  const endIndex = html.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error('No se encontraron los comentarios delimitadores // STRINGS_START o // STRINGS_END en el HTML');
  }

  // Generar el código Javascript formateado estéticamente para STRINGS
  const stringsCode = `const STRINGS = ${JSON.stringify(stringsObj, null, 2)};`;
  
  html = html.substring(0, startIndex + startMarker.length) + 
         '\n' + stringsCode + '\n' + 
         html.substring(endIndex);

  logSuccess('Diccionario de traducción bilingüe (STRINGS) generado e inyectado con éxito.');

  // 4. Modificar atributos en los elementos <section> de cada estrato
  data.strata.forEach(s => {
    const fHeight = formatHeight(s.physical_analogy.height_meters);
    
    // Buscar la sección correspondiente usando expresión regular
    const sectionRegex = new RegExp(`(<section[^>]*id="${s.id}"[^>]*>)([\\s\\S]*?)(</section>)`, 'i');
    const match = html.match(sectionRegex);
    
    if (!match) {
      throw new Error(`No se pudo encontrar la sección con id="${s.id}" en el HTML`);
    }

    let openTag = match[1];
    let content = match[2];
    const closeTag = match[3];

    // Modificar atributos en la etiqueta de apertura
    // 1. data-alt
    if (openTag.includes('data-alt=')) {
      openTag = openTag.replace(/data-alt="[^"]*"/, `data-alt="${s.physical_analogy.height_meters}"`);
    } else {
      openTag = openTag.replace('<section', `<section data-alt="${s.physical_analogy.height_meters}"`);
    }

    // 2. data-label
    if (openTag.includes('data-label=')) {
      openTag = openTag.replace(/data-label="[^"]*"/, `data-label="${fHeight.label}"`);
    } else {
      openTag = openTag.replace('<section', `<section data-label="${fHeight.label}"`);
    }

    // 3. aria-label (ES como fallback inicial/SEO)
    if (openTag.includes('aria-label=')) {
      openTag = openTag.replace(/aria-label="[^"]*"/, `aria-label="${s.translations.es.aria}"`);
    } else {
      openTag = openTag.replace('<section', `<section aria-label="${s.translations.es.aria}"`);
    }

    // Modificar <div class="num" ...>...</div> en el contenido
    const numDivRegex = /<div class="num"[^>]*>[\s\S]*?<\/div>/;
    const newNumDiv = `<div class="num" aria-hidden="true">${fHeight.num}<span>${fHeight.unit}</span></div>`;
    
    if (content.match(numDivRegex)) {
      content = content.replace(numDivRegex, newNumDiv);
    } else {
      throw new Error(`No se encontró <div class="num"> dentro de la sección id="${s.id}"`);
    }

    // Modificar <div class="icon" ...>...</div> en el contenido si hay un svg_icon dinámico
    if (s.svg_icon) {
      const iconDivRegex = /(<div class="icon"[^>]*>)([\s\S]*?)(<\/div>)/i;
      const iconMatch = content.match(iconDivRegex);
      if (iconMatch) {
        const openIconTag = iconMatch[1];
        const closeIconTag = iconMatch[3];
        const updatedIconDiv = `${openIconTag}\n        ${s.svg_icon.trim()}\n      ${closeIconTag}`;
        content = content.replace(iconDivRegex, updatedIconDiv);
      } else {
        throw new Error(`No se encontró <div class="icon"> dentro de la sección id="${s.id}" para inyectar el SVG dinámico`);
      }
    }

    // Reensamblar la sección y reemplazar en el HTML general
    const updatedSection = openTag + content + closeTag;
    html = html.replace(sectionRegex, () => updatedSection);
    
    logSuccess(`Estrato [${s.id}] actualizado: data-alt="${s.physical_analogy.height_meters}", data-label="${fHeight.label}", num="${fHeight.num}${fHeight.unit}"${s.svg_icon ? ' (Icono SVG dinámico inyectado)' : ''}`);
  });

  // 4b. Reemplazar la lista de limitaciones en el HTML
  let limitationsHtml = `\n        <li data-i18n="metod_li1">${stringsObj.es.metod_li1}</li>` +
                        `\n        <li data-i18n="metod_li2">${stringsObj.es.metod_li2}</li>` +
                        `\n        <li data-i18n="metod_li3">${stringsObj.es.metod_li3}</li>` +
                        `\n        <li data-i18n="metod_li4">${stringsObj.es.metod_li4}</li>`;
  if (data.metadata.additional_limitations && data.metadata.additional_limitations.length > 0) {
    data.metadata.additional_limitations.forEach((lim, idx) => {
      limitationsHtml += `\n        <li data-i18n="metod_li_add_${idx}">${lim.es}</li>`;
    });
  }
  limitationsHtml += '\n      ';

  const limitationsRegex = /(<ul id="limitations-list"[^>]*>)([\s\S]*?)(<\/ul>)/i;
  if (html.match(limitationsRegex)) {
    html = html.replace(limitationsRegex, `$1${limitationsHtml}$3`);
    logSuccess('Lista de limitaciones híbridas inyectada en el HTML.');
  } else {
    console.log('⚠ No se encontró el contenedor <ul id="limitations-list"> en el HTML.');
  }

  // 4c. Reemplazar la lista de fuentes en el HTML
  let sourcesHtml = '';
  if (data.metadata.sources && data.metadata.sources.length > 0) {
    data.metadata.sources.forEach((src, idx) => {
      sourcesHtml += `\n          <li style="margin:.4rem 0;"><a href="${src.url}" target="_blank" rel="noopener" style="color:#60a5fa;text-decoration:underline;" data-i18n="metod_source_${idx}">${src.name_es}</a></li>`;
    });
  }
  sourcesHtml += '\n        ';

  const sourcesRegex = /(<ul id="sources-list"[^>]*>)([\s\S]*?)(<\/ul>)/i;
  if (html.match(sourcesRegex)) {
    html = html.replace(sourcesRegex, `$1${sourcesHtml}$3`);
    logSuccess('Lista de fuentes dinámicas inyectada en el HTML.');
  } else {
    console.log('⚠ No se encontró el contenedor <ul id="sources-list"> en el HTML.');
  }

  // 5. Guardar archivo compilado
  fs.writeFileSync(HTML_PATH, html, 'utf8');
  console.log(`\n${GREEN}${BOLD}✓ ¡ÉXITO! HTML compilado e inyectado correctamente en:${RESET}\n  ${HTML_PATH}\n`);
  
  process.exit(0);
} catch (error) {
  logError(`Fallo al compilar e inyectar datos: ${error.message}`);
  process.exit(1);
}
