/**
 * src/agent/gemini-client.js
 * 
 * CLIENTE SEGURO DE IA GEMINI CON MOTOR DETERMINISTA DE RESPALDO (FALLBACK)
 * 
 * REGLAS DE SEGURIDAD:
 * - Clave leída estrictamente desde process.env.GEMINI_API_KEY.
 * - NUNCA se expone en código, logs, commits, artefactos ni HTML generado.
 * - Opera bajo permisos mínimos.
 * - Si no hay clave API o falla la red, el cliente activa de forma transparente
 *   el motor determinista pedagógico para asegurar resiliencia total y ejecución offline de tests.
 */

export class GeminiAdapterClient {
  constructor(apiKey = process.env.GEMINI_API_KEY) {
    this.apiKey = apiKey || null;
    this.modelName = "gemini-1.5-pro";
  }

  hasApiKey() {
    return !!(this.apiKey && typeof this.apiKey === 'string' && this.apiKey.trim().length > 10);
  }

  /**
   * Invoca a Gemini para adaptar semánticamente la narrativa, títulos y copy bilingüe
   * a partir del reporte de drift y los estratos recalibrados.
   */
  async adaptStorytelling({ driftReport, recalibratedLayers, globalMetrics, semanticConcept }) {
    // Si tenemos clave y entorno adecuado, intentar llamada real a Gemini API
    if (this.hasApiKey()) {
      try {
        const prompt = this.buildPrompt({ driftReport, recalibratedLayers, globalMetrics, semanticConcept });
        const response = await this.callGeminiApi(prompt);
        if (response && response.layers && Array.isArray(response.layers)) {
          return {
            success: true,
            source: "GEMINI_AI_API",
            adapted_story: response
          };
        }
      } catch (err) {
        console.warn(`[GeminiAdapterClient] Advertencia al contactar API Gemini: ${err.message}. Activando motor determinista.`);
      }
    }

    // Motor de respaldo determinista seguro (cero alucinación, estrictamente subordinado a la evidencia)
    return {
      success: true,
      source: "DETERMINISTIC_PEDAGOGICAL_ENGINE",
      adapted_story: this.generateDeterministicStory({ recalibratedLayers, globalMetrics, semanticConcept })
    };
  }

  buildPrompt({ driftReport, recalibratedLayers, globalMetrics, semanticConcept }) {
    return {
      system_instruction: "Eres un agente pedagógico experto en visualización de datos de desigualdad económica. Tu misión es adaptar el storytelling bilingüe (ES/EN) a la abstracción existente ('¿A qué altura vives?'). NUNCA inventes datos ni alteres las magnitudes físicas o económicas.",
      input_data: {
        concept: semanticConcept,
        metrics: globalMetrics,
        drift: driftReport,
        layers: recalibratedLayers
      }
    };
  }

  async callGeminiApi(payload) {
    // Llamada HTTPS estándar a la API de Gemini (Google AI Studio / Vertex)
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: JSON.stringify(payload) }]
        }],
        generationConfig: {
          temperature: 0.0,
          responseMimeType: "application/json"
        }
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
   * Motor pedagógico determinista sin alucinaciones
   */
  generateDeterministicStory({ recalibratedLayers, globalMetrics, semanticConcept }) {
    const topLayer = recalibratedLayers[0];
    const topHeightLabel = topLayer?.formatted_height_label || "15,731 km";
    const topHolderName = globalMetrics?.top_holder?.name || "Cúspide";
    const isOrganization = globalMetrics?.top_holder?.type === 'organization' || globalMetrics?.top_holder?.type === 'fund';

    const title_es = "¿A qué altura vives?";
    const title_en = "How high do you stand?";
    const subtitle_es = `La distancia real entre la base y la cúspide es de ${topHeightLabel}`;
    const subtitle_en = `The real distance between base and apex is ${topHeightLabel}`;

    const adaptedLayers = recalibratedLayers.map((layer) => {
      const hLabel = layer.formatted_height_label;
      const refEs = layer.physical_reference.name_es;
      const refEn = layer.physical_reference.name_en;
      const pct = layer.population_share_percentage;
      const wealthVal = layer.raw_magnitude;

      let headline_es, headline_en, caption_es, caption_en, aria_es, aria_en;

      if (layer.pedagogical_role === "EXTREMO") {
        if (layer.layer_id === "s1") {
          headline_es = isOrganization 
            ? `${topHolderName} opera en órbita espacial` 
            : `${topHolderName} vive en órbita`;
          headline_en = isOrganization
            ? `${topHolderName} operates in space orbit`
            : `${topHolderName} lives in orbit`;
          caption_es = `Menos de 1 de cada 10 millones · USD $${this.formatBillion(wealthVal)}B`;
          caption_en = `Fewer than 1 in 10 million · USD $${this.formatBillion(wealthVal)}B`;
          aria_es = `${topHolderName} en órbita: ${hLabel}`;
          aria_en = `${topHolderName} in orbit: ${hLabel}`;
        } else {
          headline_es = "Un billonario toca la estratosfera";
          headline_en = "A billionaire touches the stratosphere";
          caption_es = "3 de cada 10 millones · Más de USD $1,000 millones";
          caption_en = "3 in 10 million · More than USD $1,000 million";
          aria_es = `Billonarios: ${hLabel}`;
          aria_en = `Billionaires: ${hLabel}`;
        }
      } else if (layer.pedagogical_role === "CONTEXTO") {
        if (wealthVal >= 2000000) {
          headline_es = `Los millonarios: ${refEs.toLowerCase()}`;
          headline_en = `Millionaires: ${refEn.toLowerCase()}`;
          caption_es = `98 de cada 100 viven más abajo · Promedio USD $${(wealthVal/1e6).toFixed(1)}M`;
          caption_en = `98 in 100 live below · Average USD $${(wealthVal/1e6).toFixed(1)}M`;
          aria_es = `Millonarios: ${hLabel}`;
          aria_en = `Millionaires: ${hLabel}`;
        } else {
          headline_es = `Para ser millonario: ${refEs.toLowerCase()}`;
          headline_en = `To become a millionaire: ${refEn.toLowerCase()}`;
          caption_es = `Solo el ${(pct || 1.6).toFixed(1)}% del mundo · Umbral USD $1M`;
          caption_en = `Only ${(pct || 1.6).toFixed(1)}% of the world · Threshold USD $1M`;
          aria_es = `Umbral millonario: ${hLabel}`;
          aria_en = `Millionaire threshold: ${hLabel}`;
        }
      } else if (layer.pedagogical_role === "CONTRASTE") {
        if (wealthVal >= 100000) {
          headline_es = `${pct.toFixed(1)}%: a la altura de ${refEs.toLowerCase()}`;
          headline_en = `${pct.toFixed(1)}%: at the height of ${refEn.toLowerCase()}`;
          caption_es = `82 de cada 100 viven más abajo · USD $${Math.round(wealthVal/1000)}k promedio`;
          caption_en = `82 in 100 live below · USD $${Math.round(wealthVal/1000)}k average`;
          aria_es = `Clase media alta: ${hLabel}`;
          aria_en = `Upper middle class: ${hLabel}`;
        } else {
          headline_es = `${pct.toFixed(1)}% no llega a la ${refEs.toLowerCase()}`;
          headline_en = `${pct.toFixed(1)}% don't reach the ${refEn.toLowerCase()}`;
          caption_es = `41 de cada 100 viven aquí o más abajo · USD $${Math.round(wealthVal/1000)}k promedio`;
          caption_en = `41 in 100 live here or below · USD $${Math.round(wealthVal/1000)}k average`;
          aria_es = `La mayoría: ${hLabel}`;
          aria_en = `The majority: ${hLabel}`;
        }
      } else if (layer.pedagogical_role === "ESCALA") {
        headline_es = "La mitad del planeta: un solo escalón";
        headline_en = "Half the planet: one single step";
        caption_es = `50 de cada 100 no superan este escalón · Mediana USD $${Math.round(wealthVal).toLocaleString('en-US')}`;
        caption_en = `50 in 100 do not surpass this step · Median USD $${Math.round(wealthVal).toLocaleString('en-US')}`;
        aria_es = `Mediana mundial: ${hLabel}`;
        aria_en = `World median: ${hLabel}`;
      } else {
        // BASE
        headline_es = `${pct.toFixed(1)}% del mundo: ${refEs.toLowerCase()}`;
        headline_en = `${pct.toFixed(1)}% of the world: ${refEn.toLowerCase()}`;
        caption_es = `${Math.round(pct)} de cada 100 viven aquí o menos · USD $${Math.round(wealthVal).toLocaleString('en-US')} promedio`;
        caption_en = `${Math.round(pct)} in 100 live here or below · USD $${Math.round(wealthVal).toLocaleString('en-US')} average`;
        aria_es = `Base: ${hLabel}`;
        aria_en = `Base: ${hLabel}`;
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
      semantic_concept_es: semanticConcept || "Patrimonio neto global",
      semantic_concept_en: "Global net worth",
      layers: adaptedLayers
    };
  }

  formatBillion(val) {
    if (!val) return "0";
    const b = val / 1e9;
    return b >= 10 ? Math.round(b).toString() : b.toFixed(1);
  }
}
