/**
 * src/contracts/story-model.js
 * 
 * STORY MODEL:
 * Representación intermedia lista para ser consumida por el compilador/renderizador HTML
 * y la suite de pruebas. Provee diccionarios i18n, definiciones de nodos DOM y metadatos.
 * Integrado con NumberFormatter para año actual dinámico y formateo bilingüe estricto.
 */

import { NumberFormatter } from '../i18n/number-formatter.js';

export class StoryModel {
  constructor(abstractionDoc) {
    this.doc = abstractionDoc;
  }

  generateStringsDictionary() {
    const prov = this.doc.provenance || {};
    const currentYear = NumberFormatter.getCurrentYear();
    const dateLabelEs = prov.date_label_es || `UBS · dic 2024 · * Valor presente`;
    const dateLabelEn = prov.date_label_en || `UBS · Dec 2024 · * Present value`;

    const es = {
      skip_text: "Saltar al contenido principal",
      intro_h1: this.doc.title_es,
      intro_sub: this.doc.subtitle_es,
      metod_title: "Ficha técnica",
      metod_lead: "Convertimos magnitud económica de personas naturales en altura física. Así de literal es la desigualdad.",
      metod_sum1: "Fuentes",
      metod_p1: prov.summary_es || "UBS Global Wealth Report y Forbes Real-Time Billionaires.",
      metod_sum2: "Metodología",
      metod_p2: `Para conocer en detalle la metodología de cálculo, la fórmula de escala utilizada y participar en la discusión técnica del modelo, consulta el <a href="https://github.com/willkwolf/global-inequality-21Century#metodolog%C3%ADa-de-visualizaci%C3%B3n--visualization-methodology" target="_blank" rel="noopener" style="color:#60a5fa;text-decoration:underline;">repositorio del proyecto en GitHub</a>.`,
      metod_sum3: "Limitaciones",
      metod_li1: "Patrimonio neto individual = activos reales y financieros personales menos deudas privadas.",
      metod_li2: "Unidad de análisis exclusiva: Personas naturales adultas. Se excluyen personas jurídicas, estados y fondos.",
      metod_li3: "Las fortunas en la cúspide fluctúan diariamente según las valoraciones de mercado.",
      metod_li4: "La escala física es proporcional: desde centímetros en el suelo hasta miles de kilómetros en órbita.",
      footer_author: `© ${currentYear} William Camilo Artunduaga Viana ·`,
      footer_license: "CC BY 4.0",
      lang_btn: "EN",
      lang_aria: "Switch to English",
      data_date: dateLabelEs,
      scroll_cue: "Desliza para comenzar",
      a11y_toolbar_label: "Panel de accesibilidad",
      a11y_btn_aria: "Opciones de accesibilidad",
      a11y_text_size: "Tamaño",
      a11y_size_normal: "A",
      a11y_size_large: "A+",
      a11y_size_xl: "A++",
      a11y_visuals: "Ajustes",
      a11y_contrast: "Contraste",
      a11y_dyslexia: "Lectura",
      a11y_nav_label: "Navegación de secciones por altitud",
      a11y_announcement_prefix: "Sección actual: ",
      s0_aria: `Introducción: ${this.doc.title_es}. ${this.doc.subtitle_es}`,
      s0_nav: "Inicio",
      metodEcosystemTag: "Ruta del Pensamiento Crítico · Paso 5",
      metodEcosystemTitle: "Diferencias globales, realidades locales: Coeficiente de Palma",
      metodEcosystemText: "Estas diferencias globales se concretan con particular dureza en la realidad de América Latina. Exploremos en detalle la distribución en un contexto nacional específico.",
      metodEcosystemBtn: "Analizar el caso de la Desigualdad de Palma en Colombia ➔",
      stepPathTitle: "Ruta del Pensamiento Crítico",
      stepPathSub: "Una red de visualizaciones interactivas para explorar la economía y la sociedad",
      stepTitle1: "Comprender",
      stepProject1: "Mapa de Escuelas",
      stepStatusExplore: "Explorar ➔",
      stepTitle2: "Mezclar",
      stepProject2: "El Bar de Cocteles",
      stepTitle3: "Contrastar",
      stepProject3: "Filosofía de la Libertad",
      stepTitle4: "Escalar",
      stepProject4: "Brecha de Riqueza Global",
      stepStatusHere: "Estás aquí",
      stepTitle5: "Aterrizar",
      stepProject5: "Desigualdad en Colombia"
    };

    const en = {
      skip_text: "Skip to main content",
      intro_h1: this.doc.title_en,
      intro_sub: this.doc.subtitle_en,
      metod_title: "Technical notes",
      metod_lead: "We convert individual net worth into physical height. That is how literal inequality is.",
      metod_sum1: "Sources",
      metod_p1: prov.summary_en || "UBS Global Wealth Report and Forbes Real-Time Billionaires.",
      metod_sum2: "Methodology",
      metod_p2: `For a detailed breakdown of the calculation methodology, the scaling formula used, and to join the technical discussion of the model, visit the <a href="https://github.com/willkwolf/global-inequality-21Century#metodolog%C3%ADa-de-visualizaci%C3%B3n--visualization-methodology" target="_blank" rel="noopener" style="color:#60a5fa;text-decoration:underline;">project repository on GitHub</a>.`,
      metod_sum3: "Limitations",
      metod_li1: "Individual net worth = personal real and financial assets minus liabilities.",
      metod_li2: "Exclusive analysis unit: Adult natural persons. Excludes corporations, states, and funds.",
      metod_li3: "Apex individual fortunes fluctuate daily based on market valuations.",
      metod_li4: "The physical scale is proportional: from centimeters on the ground to thousands of kilometers in orbit.",
      footer_author: `© ${currentYear} William Camilo Artunduaga Viana ·`,
      footer_license: "CC BY 4.0",
      lang_btn: "ES",
      lang_aria: "Cambiar a español",
      data_date: dateLabelEn,
      scroll_cue: "Scroll to begin",
      a11y_toolbar_label: "Accessibility panel",
      a11y_btn_aria: "Accessibility options",
      a11y_text_size: "Size",
      a11y_size_normal: "A",
      a11y_size_large: "A+",
      a11y_size_xl: "A++",
      a11y_visuals: "Settings",
      a11y_contrast: "Contrast",
      a11y_dyslexia: "Dyslexic",
      a11y_nav_label: "Section navigation by altitude",
      a11y_announcement_prefix: "Current section: ",
      s0_aria: `Introduction: ${this.doc.title_en}. ${this.doc.subtitle_en}`,
      s0_nav: "Home",
      metodEcosystemTag: "Critical Thinking Path · Step 5",
      metodEcosystemTitle: "Global differences, local realities: The Palma Ratio",
      metodEcosystemText: "These global differences manifest with particular harshness in the reality of Latin America. Let's explore the distribution in detail within a specific national context.",
      metodEcosystemBtn: "Analyze the case of Palma Inequality in Colombia ➔",
      stepPathTitle: "Critical Thinking Path",
      stepPathSub: "A network of interactive visualizations to explore economics and society",
      stepTitle1: "Understand",
      stepProject1: "Schools Map",
      stepStatusExplore: "Explore ➔",
      stepTitle2: "Mix",
      stepProject2: "The Cocktail Bar",
      stepTitle3: "Contrast",
      stepProject3: "Philosophy of Liberty",
      stepTitle4: "Scale",
      stepProject4: "Global Wealth Gap",
      stepStatusHere: "You are here",
      stepTitle5: "Land",
      stepProject5: "Inequality in Colombia"
    };

    // Inyectar limitaciones estructuradas dinámicas
    if (prov.limitations && Array.isArray(prov.limitations)) {
      prov.limitations.forEach((lim, idx) => {
        if (idx < 4) {
          es[`metod_li${idx + 1}`] = lim.es;
          en[`metod_li${idx + 1}`] = lim.en;
        } else {
          es[`metod_li_add_${idx - 4}`] = lim.es;
          en[`metod_li_add_${idx - 4}`] = lim.en;
        }
      });
    }

    // Inyectar traducciones dinámicas y formateo numérico localizado de cada capa
    this.doc.layers.forEach((layer) => {
      const id = layer.layer_id;
      const hEs = NumberFormatter.formatHeight(layer.physical_height_meters, 'es');
      const hEn = NumberFormatter.formatHeight(layer.physical_height_meters, 'en');

      es[`${id}_headline`] = layer.narrative.headline_es;
      es[`${id}_caption`]  = layer.narrative.caption_es;
      es[`${id}_aria`]     = layer.narrative.aria_es;
      es[`${id}_nav`]      = layer.physical_reference.name_es;
      es[`${id}_num`]      = hEs.value_formatted;
      es[`${id}_unit`]     = hEs.unit;
      es[`${id}_label`]    = hEs.full_label;

      en[`${id}_headline`] = layer.narrative.headline_en;
      en[`${id}_caption`]  = layer.narrative.caption_en;
      en[`${id}_aria`]     = layer.narrative.aria_en;
      en[`${id}_nav`]      = layer.physical_reference.name_en;
      en[`${id}_num`]      = hEn.value_formatted;
      en[`${id}_unit`]     = hEn.unit;
      en[`${id}_label`]    = hEn.full_label;
    });

    // Inyectar fuentes
    if (prov.sources && Array.isArray(prov.sources)) {
      prov.sources.forEach((src, idx) => {
        es[`metod_source_${idx}`] = src.name_es || src.name;
        en[`metod_source_${idx}`] = src.name_en || src.name;
      });
    }

    return { es, en };
  }
}
