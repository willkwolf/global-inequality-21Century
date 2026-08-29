/**
 * src/contracts/story-model.js
 * 
 * STORY MODEL:
 * Representación intermedia lista para ser consumida por el compilador/renderizador HTML
 * y la suite de pruebas. Provee diccionarios i18n, definiciones de nodos DOM y metadatos.
 */

export class StoryModel {
  constructor(abstractionDoc) {
    this.doc = abstractionDoc;
  }

  generateStringsDictionary() {
    const es = {
      skip_text: "Saltar al contenido principal",
      intro_h1: this.doc.title_es,
      intro_sub: this.doc.subtitle_es,
      metod_title: "Ficha técnica",
      metod_lead: "Convertimos magnitud económica en altura física. Así de literal es la desigualdad.",
      metod_sum1: "Fuentes",
      metod_p1: this.doc.provenance.summary_es,
      metod_sum2: "Metodología",
      metod_p2: `Para conocer en detalle la metodología de cálculo, la fórmula de escala utilizada y participar en la discusión técnica del modelo, consulta el <a href="https://github.com/willkwolf/global-inequality-21Century#metodolog%C3%ADa-de-visualizaci%C3%B3n--visualization-methodology" target="_blank" rel="noopener" style="color:#60a5fa;text-decoration:underline;">repositorio del proyecto en GitHub</a>.`,
      metod_sum3: "Limitaciones",
      metod_li1: "Patrimonio ≠ ingreso ni efectivo disponible. Incluye vivienda, pensiones, deudas.",
      metod_li2: "Las fortunas de billonarios fluctúan diariamente.",
      metod_li3: "La escala es logarítmica: de centímetros a kilómetros en una sola pantalla.",
      metod_li4: "Esta visualización expone estructura sistémica, no juzga mérito individual.",
      footer_author: "© 2026 William Camilo Artunduaga Viana ·",
      footer_license: "CC BY 4.0",
      lang_btn: "EN",
      lang_aria: "Switch to English",
      data_date: this.doc.provenance.date_label_es || "UBS · dic 2024",
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
      metod_lead: "We convert economic magnitude into physical height. That is how literal inequality is.",
      metod_sum1: "Sources",
      metod_p1: this.doc.provenance.summary_en,
      metod_sum2: "Methodology",
      metod_p2: `For a detailed breakdown of the calculation methodology, the scaling formula used, and to join the technical discussion of the model, visit the <a href="https://github.com/willkwolf/global-inequality-21Century#metodolog%C3%ADa-de-visualizaci%C3%B3n--visualization-methodology" target="_blank" rel="noopener" style="color:#60a5fa;text-decoration:underline;">project repository on GitHub</a>.`,
      metod_sum3: "Limitations",
      metod_li1: "Net worth ≠ income or liquid cash. Includes housing, pensions, debts.",
      metod_li2: "Billionaire fortunes fluctuate daily.",
      metod_li3: "The scale is logarithmic: from centimeters to kilometers on one screen.",
      metod_li4: "This visualization exposes systemic structure; it does not judge individual merit.",
      footer_author: "© 2026 William Camilo Artunduaga Viana ·",
      footer_license: "CC BY 4.0",
      lang_btn: "ES",
      lang_aria: "Cambiar a español",
      data_date: this.doc.provenance.date_label_en || "UBS · Dec 2024",
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

    // Inyectar limitaciones adicionales
    if (this.doc.provenance.additional_limitations && Array.isArray(this.doc.provenance.additional_limitations)) {
      this.doc.provenance.additional_limitations.forEach((lim, idx) => {
        es[`metod_li_add_${idx}`] = lim.es;
        en[`metod_li_add_${idx}`] = lim.en;
      });
    }

    // Inyectar traducciones dinámicas de cada capa
    this.doc.layers.forEach((layer) => {
      const id = layer.layer_id;
      es[`${id}_headline`] = layer.narrative.headline_es;
      es[`${id}_caption`]  = layer.narrative.caption_es;
      es[`${id}_aria`]     = layer.narrative.aria_es;
      es[`${id}_nav`]      = layer.physical_reference.name_es;

      en[`${id}_headline`] = layer.narrative.headline_en;
      en[`${id}_caption`]  = layer.narrative.caption_en;
      en[`${id}_aria`]     = layer.narrative.aria_en;
      en[`${id}_nav`]      = layer.physical_reference.name_en;
    });

    // Inyectar fuentes
    if (this.doc.provenance.sources && Array.isArray(this.doc.provenance.sources)) {
      this.doc.provenance.sources.forEach((src, idx) => {
        es[`metod_source_${idx}`] = src.name_es || src.name;
        en[`metod_source_${idx}`] = src.name_en || src.name;
      });
    }

    return { es, en };
  }
}
