/**
 * src/agent/gemini-client.js
 * 
 * CLIENTE SEGURO GEMINI Y MOTOR PEDAGÓGICO DETERMINISTA
 * Integra el NumberFormatter para dar formato bilingüe matemáticamente consistente y estético.
 */

import { NumberFormatter } from '../i18n/number-formatter.js';

export class GeminiAdapterClient {
  constructor(apiKey = process.env.GEMINI_API_KEY) {
    this.apiKey = apiKey;
    this.model = "gemini-1.5-pro";
  }

  /**
   * Genera narrativa pedagógica bilingüe a partir de datos recalibrados.
   * Si no hay API key o la llamada falla, recurre de forma determinista al motor local.
   */
  async adaptStorytelling({ driftReport, recalibratedLayers, globalMetrics, semanticConcept }) {
    if (!this.apiKey) {
      return {
        source: "deterministic_local_engine",
        adapted_story: this.generateDeterministicStory({ recalibratedLayers, globalMetrics, semanticConcept })
      };
    }

    try {
      const result = await this.callGeminiApi({ driftReport, recalibratedLayers, globalMetrics, semanticConcept });
      return {
        source: "gemini_1.5_pro",
        adapted_story: result
      };
    } catch (err) {
      console.warn(`[GeminiClient] Fallback a motor determinista por error en API: ${err.message}`);
      return {
        source: "deterministic_fallback_engine",
        adapted_story: this.generateDeterministicStory({ recalibratedLayers, globalMetrics, semanticConcept })
      };
    }
  }

  async callGeminiApi(payload) {
    const prompt = `Eres el Agente Pedagógico del proyecto "Escala Visual de Desigualdad de Riqueza Global".
Tu tarea es adaptar los titulares, captions y labels de accesibilidad para cada estrato de la pirámide de riqueza de forma matemáticamente consistente y sin alucinaciones.

INVARIANTES ESTRICTOS:
1. La unidad de análisis es EXCLUSIVAMENTE PERSONAS NATURALES ADULTAS.
2. No compares con empresas ni gobiernos.
3. Devuelve un JSON estrictamente válido con los campos: title_es, title_en, subtitle_es, subtitle_en, semantic_concept_es, semantic_concept_en, y un array 'layers' con los campos headline_es, headline_en, caption_es, caption_en, aria_es, aria_en para cada estrato.

Datos:
${JSON.stringify(payload, null, 2)}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) throw new Error("Respuesta vacía de Gemini");
    return JSON.parse(candidateText);
  }

  /**
   * Motor pedagógico determinista sin alucinaciones con NumberFormatter
   */
  generateDeterministicStory({ recalibratedLayers, globalMetrics, semanticConcept }) {
    const topLayer = recalibratedLayers[0];
    const topHeightEs = topLayer?.physical_height_meters ? NumberFormatter.formatHeight(topLayer.physical_height_meters, 'es').full_label : "13.828,13 km";
    const topHeightEn = topLayer?.physical_height_meters ? NumberFormatter.formatHeight(topLayer.physical_height_meters, 'en').full_label : "13,828.13 km";
    const topHolderName = globalMetrics?.top_holder?.name || "Cúspide individual";

    const title_es = "¿A qué altura vives?";
    const title_en = "How high do you stand?";
    const subtitle_es = `La distancia real entre la base y la cúspide es de ${topHeightEs}`;
    const subtitle_en = `The real distance between base and apex is ${topHeightEn}`;

    const adaptedLayers = recalibratedLayers.map((layer, index) => {
      const hEs = NumberFormatter.formatHeight(layer.physical_height_meters, 'es');
      const hEn = NumberFormatter.formatHeight(layer.physical_height_meters, 'en');
      const refEs = layer.physical_reference.name_es;
      const refEn = layer.physical_reference.name_en;
      const pct = layer.population_share_percentage;
      const wealthVal = layer.raw_magnitude;

      let headline_es, headline_en, caption_es, caption_en, aria_es, aria_en;

      if (layer.pedagogical_role === "EXTREMO") {
        if (layer.layer_id === "s1" || index === 0) {
          const magEs = NumberFormatter.formatMagnitude(wealthVal, 'es');
          const magEn = NumberFormatter.formatMagnitude(wealthVal, 'en');
          headline_es = `${topHolderName} vive en órbita`;
          headline_en = `${topHolderName} stands in orbit`;
          caption_es = `Menos de 1 de cada 10 millones · USD* $${magEs} · Altura: ${hEs.full_label}`;
          caption_en = `Fewer than 1 in 10 million · USD* $${magEn} · Altitude: ${hEn.full_label}`;
          aria_es = `${topHolderName} en órbita: ${hEs.verbal_label}`;
          aria_en = `${topHolderName} in orbit: ${hEn.verbal_label}`;
        } else {
          headline_es = "Un billonario toca la estratosfera";
          headline_en = "A billionaire touches the stratosphere";
          caption_es = `3 de cada 10 millones · Más de USD* $1.000 millones · Altura: ${hEs.full_label}`;
          caption_en = `3 in 10 million · More than USD* $1,000 million · Altitude: ${hEn.full_label}`;
          aria_es = `Billonarios: ${hEs.verbal_label}`;
          aria_en = `Billionaires: ${hEn.verbal_label}`;
        }
      } else if (layer.pedagogical_role === "CONTEXTO") {
        if (wealthVal >= 2000000) {
          const magEs = NumberFormatter.formatMagnitude(wealthVal, 'es');
          const magEn = NumberFormatter.formatMagnitude(wealthVal, 'en');
          headline_es = `Los millonarios: ${refEs.toLowerCase()}`;
          headline_en = `Millionaires: ${refEn.toLowerCase()}`;
          caption_es = `98 de cada 100 viven más abajo · Promedio USD* $${magEs}`;
          caption_en = `98 in 100 live below · Average USD* $${magEn}`;
          aria_es = `Millonarios: ${hEs.verbal_label}`;
          aria_en = `Millionaires: ${hEn.verbal_label}`;
        } else {
          headline_es = `Para ser millonario: ${refEs.toLowerCase()}`;
          headline_en = `To become a millionaire: ${refEn.toLowerCase()}`;
          const pctEs = NumberFormatter.formatPercentage(pct || 1.6, 'es');
          const pctEn = NumberFormatter.formatPercentage(pct || 1.6, 'en');
          caption_es = `Solo el ${pctEs} de adultos · Umbral USD* $1M`;
          caption_en = `Only ${pctEn} of adults · Threshold USD* $1M`;
          aria_es = `Umbral millonario: ${hEs.verbal_label}`;
          aria_en = `Millionaire threshold: ${hEn.verbal_label}`;
        }
      } else if (layer.pedagogical_role === "CONTRASTE") {
        if (wealthVal >= 100000) {
          const pctEs = NumberFormatter.formatPercentage(pct, 'es');
          const pctEn = NumberFormatter.formatPercentage(pct, 'en');
          const magEs = NumberFormatter.formatMagnitude(wealthVal, 'es');
          const magEn = NumberFormatter.formatMagnitude(wealthVal, 'en');
          headline_es = `${pctEs}: a la altura de ${refEs.toLowerCase()}`;
          headline_en = `${pctEn}: at the height of ${refEn.toLowerCase()}`;
          caption_es = `82 de cada 100 viven más abajo · USD* $${magEs} promedio`;
          caption_en = `82 in 100 live below · USD* $${magEn} average`;
          aria_es = `Clase media alta: ${hEs.verbal_label}`;
          aria_en = `Upper middle class: ${hEn.verbal_label}`;
        } else {
          const magEs = NumberFormatter.formatMagnitude(wealthVal, 'es');
          const magEn = NumberFormatter.formatMagnitude(wealthVal, 'en');
          headline_es = `La mayoría no llega a la ${refEs.toLowerCase()}`;
          headline_en = `The majority doesn't reach the ${refEn.toLowerCase()}`;
          caption_es = `41 de cada 100 viven aquí o más abajo · USD* $${magEs} promedio`;
          caption_en = `41 in 100 live here or below · USD* $${magEn} average`;
          aria_es = `La mayoría: ${hEs.verbal_label}`;
          aria_en = `The majority: ${hEn.verbal_label}`;
        }
      } else if (layer.pedagogical_role === "ESCALA") {
        const currEs = NumberFormatter.formatCurrency(Math.round(wealthVal), 'USD*', 'es');
        const currEn = NumberFormatter.formatCurrency(Math.round(wealthVal), 'USD*', 'en');
        headline_es = "La mitad del planeta: un solo escalón";
        headline_en = "Half the planet: one single step";
        caption_es = `50 de cada 100 no superan este escalón · Mediana ${currEs}`;
        caption_en = `50 in 100 do not surpass this step · Median ${currEn}`;
        aria_es = `Mediana mundial: ${hEs.verbal_label}`;
        aria_en = `World median: ${hEn.verbal_label}`;
      } else {
        // BASE
        const currEs = NumberFormatter.formatCurrency(Math.round(wealthVal), 'USD*', 'es');
        const currEn = NumberFormatter.formatCurrency(Math.round(wealthVal), 'USD*', 'en');
        headline_es = `La base del mundo: ${refEs.toLowerCase()}`;
        headline_en = `The world base: ${refEn.toLowerCase()}`;
        caption_es = `${Math.round(pct)} de cada 100 viven aquí o menos · ${currEs} promedio`;
        caption_en = `${Math.round(pct)} in 100 live here or below · ${currEn} average`;
        aria_es = `Base: ${hEs.verbal_label}`;
        aria_en = `Base: ${hEn.verbal_label}`;
      }

      return {
        ...layer,
        narrative: {
          headline_es,
          headline_en,
          caption_es,
          caption_en,
          aria_es,
          aria_en
        }
      };
    });

    return {
      title_es,
      title_en,
      subtitle_es,
      subtitle_en,
      semantic_concept_es: semanticConcept || "Patrimonio neto personal por adulto (Net Worth per Adult)",
      semantic_concept_en: "Personal net worth per adult",
      layers: adaptedLayers
    };
  }
}
