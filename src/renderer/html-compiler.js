/**
 * src/renderer/html-compiler.js
 * 
 * COMPILADOR Y RENDERIZADOR DINÁMICO DE HTML
 */

export class HtmlCompiler {
  /**
   * Compila el HTML completo a partir de la plantilla y el Story Model
   * @param {string} rawHtml - Contenido original del archivo HTML
   * @param {Object} abstractionDoc - Documento del contrato de abstracción
   * @param {Object} storyModel - Instancia de StoryModel
   * @returns {string} HTML final compilado
   */
  static compile(rawHtml, abstractionDoc, storyModel) {
    let html = rawHtml;
    const strings = storyModel.generateStringsDictionary();
    const layers = abstractionDoc.layers;

    // 1. Reemplazar bloque STRINGS delimitado
    const startMarker = '// STRINGS_START';
    const endMarker = '// STRINGS_END';
    const startIndex = html.indexOf(startMarker);
    const endIndex = html.indexOf(endMarker);

    if (startIndex === -1 || endIndex === -1) {
      throw new Error('No se encontraron los delimitadores // STRINGS_START o // STRINGS_END en el HTML');
    }

    const stringsCode = `const STRINGS = ${JSON.stringify(strings, null, 2)};`;
    html = html.substring(0, startIndex + startMarker.length) +
           '\n' + stringsCode + '\n' +
           html.substring(endIndex);

    // 2. Compilar dinámicamente los botones de navegación por altitud (<nav id="a11y-dot-nav">)
    const dotNavRegex = /(<nav id="a11y-dot-nav"[^>]*>)([\s\S]*?)(<\/nav>)/i;
    let dotNavItems = `\n  <button class="a11y-dot active" data-target="s0" aria-label="${strings.es.s0_aria}" data-i18n-aria="s0_aria" aria-current="step" data-nav-name="${strings.es.s0_nav}" data-i18n-nav="s0_nav">\n    <span class="a11y-tooltip" data-i18n="s0_nav">${strings.es.s0_nav}</span>\n  </button>`;
    
    layers.forEach((layer) => {
      const id = layer.layer_id;
      const aria = strings.es[`${id}_aria`];
      const navName = strings.es[`${id}_nav`];
      dotNavItems += `\n  <button class="a11y-dot" data-target="${id}" aria-label="${aria}" data-i18n-aria="${id}_aria" data-nav-name="${navName}" data-i18n-nav="${id}_nav">\n    <span class="a11y-tooltip" data-i18n="${id}_nav">${navName}</span>\n  </button>`;
    });
    dotNavItems += '\n';

    if (html.match(dotNavRegex)) {
      html = html.replace(dotNavRegex, (m, p1, p2, p3) => `${p1}${dotNavItems}${p3}`);
    }

    // 3. Compilar dinámicamente las secciones de estratos (<section id="s1"> ... <section id="sN">)
    const mainRegex = /(<main id="main-content"[^>]*>)([\s\S]*?)(<\/main>)/i;
    const mainMatch = html.match(mainRegex);
    if (!mainMatch) {
      throw new Error('No se encontró el contenedor <main id="main-content"> en el HTML');
    }

    let strataSectionsHtml = `\n  <!-- 0 · Mobile splash -->\n  <section class="snap" id="s0" aria-label="Introducción" data-i18n-aria="s0_aria">\n    <h1 data-i18n="intro_h1">${strings.es.intro_h1}</h1>\n    <p data-i18n="intro_sub">${strings.es.intro_sub}</p>\n    <div class="scroll-cue" aria-hidden="true">\n      <span data-i18n="scroll_cue">${strings.es.scroll_cue}</span>\n      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">\n        <path d="M12 5v14M5 12l7 7 7-7"/>\n      </svg>\n    </div>\n  </section>\n`;

    layers.forEach((layer, idx) => {
      const id = layer.layer_id;
      const isFirst = idx === 0;
      const fNum = layer.formatted_height_num;
      const fUnit = layer.formatted_height_unit;
      const fLabel = layer.formatted_height_label;
      const aria = strings.es[`${id}_aria`];
      const headline = strings.es[`${id}_headline`];
      const caption = strings.es[`${id}_caption`];
      const svgIcon = layer.physical_reference.svg_icon;
      const dataDate = strings.es.data_date;

      strataSectionsHtml += `\n  <!-- ${idx + 1} · ${layer.physical_reference.name_es} -->\n`;
      strataSectionsHtml += `  <section class="snap ${id}${isFirst ? ' active' : ''}" id="${id}" data-alt="${layer.physical_height_meters}" data-label="${fLabel}" aria-label="${aria}">\n`;
      
      if (isFirst) {
        strataSectionsHtml += `    <div class="intro">\n      <h1 data-i18n="intro_h1">${strings.es.intro_h1}</h1>\n      <p data-i18n="intro_sub">${strings.es.intro_sub}</p>\n    </div>\n`;
      }

      strataSectionsHtml += `    <div class="grid">\n`;
      strataSectionsHtml += `      <div class="num" aria-hidden="true">${fNum}<span>${fUnit}</span></div>\n`;
      strataSectionsHtml += `      <h2 class="headline" data-i18n="${id}_headline">${headline}</h2>\n`;
      strataSectionsHtml += `      <p class="caption" data-i18n="${id}_caption">${caption}</p>\n`;
      strataSectionsHtml += `      <div class="icon" aria-hidden="true">\n        ${svgIcon.trim()}\n      </div>\n`;
      strataSectionsHtml += `    </div>\n`;
      strataSectionsHtml += `    <span class="data-date" data-i18n="data_date">${dataDate}</span>\n`;
      strataSectionsHtml += `  </section>\n`;
    });

    html = html.replace(mainRegex, (m, p1, p2, p3) => `${p1}${strataSectionsHtml}\n${p3}`);

    // 4. Actualizar dinámicamente las fuentes en la ficha técnica
    const sourcesRegex = /(<ul id="sources-list"[^>]*>)([\s\S]*?)(<\/ul>)/i;
    if (abstractionDoc.provenance.sources && html.match(sourcesRegex)) {
      let srcHtml = '';
      abstractionDoc.provenance.sources.forEach((src, idx) => {
        const name = src.name_es || src.name;
        srcHtml += `\n          <li style="margin:.4rem 0;"><a href="${src.url}" target="_blank" rel="noopener" style="color:#60a5fa;text-decoration:underline;" data-i18n="metod_source_${idx}">${name}</a></li>`;
      });
      srcHtml += '\n        ';
      html = html.replace(sourcesRegex, (m, p1, p2, p3) => `${p1}${srcHtml}${p3}`);
    }

    return html;
  }
}
