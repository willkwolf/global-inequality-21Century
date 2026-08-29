/**
 * src/contracts/abstraction-contract.js
 * 
 * CONTRATO DE ABSTRACCIÓN:
 * Define la estructura abstracta que desacopla completamente las fuentes de datos concretas
 * (Forbes, UBS, WID, Banco Mundial) de la interfaz de visualización pedagógica.
 * 
 * El componente visual NUNCA debe conocer entidades hardcodeadas, URLs fijas ni proveedores.
 * Solo conoce conceptos abstractos normalizados.
 */

export class AbstractionContract {
  /**
   * @typedef {Object} AbstractionLayer
   * @property {string} layer_id - Identificador único de la capa (ej. "l1", "l2", ...)
   * @property {"BASE"|"ESCALA"|"CONTRASTE"|"CONTEXTO"|"EXTREMO"} pedagogical_role
   * @property {number} raw_magnitude - Magnitud económica numérica
   * @property {string} magnitude_unit - Unidad monetaria ("USD", etc.)
   * @property {number} physical_height_meters - Altura física calculada en metros
   * @property {string} formatted_height_label - Etiqueta formateada ("15,731 km", "17 cm", etc.)
   * @property {number} population_share_percentage - Porcentaje de la población
   * @property {string} population_ratio_phrase_es - Frase legible ("50 de cada 100", etc.)
   * @property {string} population_ratio_phrase_en
   * @property {Object} physical_reference - Referencia analógica física
   * @property {string} physical_reference.name_es
   * @property {string} physical_reference.name_en
   * @property {string} physical_reference.svg_icon
   * @property {Object} narrative - Textos narrativos generados
   * @property {string} narrative.headline_es
   * @property {string} narrative.headline_en
   * @property {string} narrative.caption_es
   * @property {string} narrative.caption_en
   * @property {string} narrative.aria_es
   * @property {string} narrative.aria_en
   */

  /**
   * @typedef {Object} AbstractionDocument
   * @property {string} contract_version - Versión del contrato ("2.0.0")
   * @property {string} title_es - Título principal del fenómeno
   * @property {string} title_en
   * @property {string} subtitle_es - Subtítulo pedagógico
   * @property {string} subtitle_en
   * @property {string} semantic_concept_es - Concepto medido
   * @property {string} semantic_concept_en
   * @property {Object} scale_formula
   * @property {number} scale_formula.unit_value_usd - Valor base por escalón ($8,000 USD)
   * @property {number} scale_formula.step_height_meters - Altura física del escalón (0.15 m)
   * @property {number} max_height_meters - Altura máxima del extremo
   * @property {AbstractionLayer[]} layers - Capas ordenadas de mayor a menor altura
   * @property {Object} provenance - Metadatos de procedencia y trazabilidad
   */

  static validate(contractDoc) {
    if (!contractDoc || typeof contractDoc !== 'object') {
      throw new Error("El documento de contrato de abstracción debe ser un objeto válido.");
    }
    if (contractDoc.contract_version !== "2.0.0") {
      throw new Error(`Versión de contrato no soportada: ${contractDoc.contract_version}`);
    }
    if (!Array.isArray(contractDoc.layers) || contractDoc.layers.length < 3) {
      throw new Error("El contrato debe contener al menos 3 capas narrativas.");
    }

    // Validar orden estrictamente decreciente de alturas
    let lastHeight = Infinity;
    for (let i = 0; i < contractDoc.layers.length; i++) {
      const layer = contractDoc.layers[i];
      if (typeof layer.physical_height_meters !== 'number' || layer.physical_height_meters <= 0) {
        throw new Error(`Capa ${layer.layer_id} tiene una altura física inválida: ${layer.physical_height_meters}`);
      }
      if (layer.physical_height_meters >= lastHeight) {
        throw new Error(`Violación de orden en capa ${layer.layer_id}: altura ${layer.physical_height_meters}m >= anterior ${lastHeight}m`);
      }
      lastHeight = layer.physical_height_meters;

      // Validar presencia bilingüe de narrativa y referencias
      if (!layer.narrative?.headline_es || !layer.narrative?.headline_en) {
        throw new Error(`Capa ${layer.layer_id} carece de headlines bilingües válidos.`);
      }
      if (!layer.physical_reference?.name_es || !layer.physical_reference?.name_en) {
        throw new Error(`Capa ${layer.layer_id} carece de referencias físicas bilingües válidas.`);
      }
    }

    return true;
  }
}
