/**
 * validate-data.js
 *
 * PROPÓSITO:
 * Validar la integridad metodológica y de traducciones del archivo `SPEC/data.json`.
 * Este validador no tiene dependencias npm externas para asegurar portabilidad total
 * (conforme al Principio 4: Evitar dependencias de tecnologías específicas).
 *
 * COMPROBACIONES:
 * 1. Estructura y campos requeridos en metadatos y fórmulas.
 * 2. Existencia exacta de 8 estratos (s1 a s8) en orden descendente.
 * 3. Consistencia metodológica/matemática:
 *    - La altura de cada sección debe ser estrictamente decreciente (s1 > s2 > s3... > s8).
 *    - La altura física declarada debe derivar de un patrimonio neto coherente con su rango
 *      usando la fórmula de escalado estándar: Altura = (Patrimonio / step_usd) * step_height.
 * 4. Integridad i18n (bilingüismo ES/EN):
 *    - Presencia de titulares y subtítulos bilingües.
 *    - Verificación de consistencia léxica (claves no vacías).
 *
 * RETORNO:
 * - Exits con código 0 si todo está correcto.
 * - Exits con código 1 si encuentra errores, detallándolos con códigos de color ANSI.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colores ANSI para formatear logs en consola
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
const DATA_PATH = path.resolve(__dirname, '../data.json');
const SCHEMA_PATH = path.resolve(__dirname, '../schema.json');

logHeader('Iniciando Validación del SPEC de Datos');

try {
  // 1. Cargar archivos
  if (!fs.existsSync(DATA_PATH)) {
    throw new Error(`No se encontró el archivo de datos en: ${DATA_PATH}`);
  }
  if (!fs.existsSync(SCHEMA_PATH)) {
    logWarning('No se encontró el archivo schema.json para referencia, pero continuaremos con validación interna profunda.');
  }

  const rawData = fs.readFileSync(DATA_PATH, 'utf8');
  const data = JSON.parse(rawData);

  // 2. Validar estructura general
  if (!data.metadata) throw new Error('Falta el bloque "metadata"');
  if (!data.formula_constants) throw new Error('Falta el bloque "formula_constants"');
  if (!data.strata || !Array.isArray(data.strata)) throw new Error('Falta el bloque "strata" o no es un arreglo');

  const { step_usd_value, step_physical_height_meters } = data.formula_constants;
  if (!step_usd_value || typeof step_usd_value !== 'number') {
    throw new Error('formula_constants.step_usd_value debe ser un número positivo');
  }
  if (!step_physical_height_meters || typeof step_physical_height_meters !== 'number') {
    throw new Error('formula_constants.step_physical_height_meters debe ser un número positivo');
  }

  logSuccess('Metadatos y constantes de fórmula iniciales validados.');

  // 3. Validar estratos
  if (data.strata.length !== 8) {
    throw new Error(`Se esperan exactamente 8 estratos en "strata", se encontraron ${data.strata.length}`);
  }

  let lastHeight = Infinity;
  const errors = [];

  data.strata.forEach((stratum, idx) => {
    const expectedId = `s${idx + 1}`;
    logHeader(`Validando estrato ${expectedId} (${stratum.id || 'sin ID'})`);

    // Validar ID ordenado
    if (stratum.id !== expectedId) {
      errors.push(`Orden incorrecto de estrato. Se esperaba "${expectedId}", se obtuvo "${stratum.id}"`);
      return;
    }

    // Validar tipo semántico JSON-LD
    if (stratum['@type'] !== 'StatisticalPopulation') {
      errors.push(`[${expectedId}] @type debe ser "StatisticalPopulation" para principios de Linked Data`);
    }

    // Validar analogía física
    const { physical_analogy } = stratum;
    if (!physical_analogy || typeof physical_analogy !== 'object') {
      errors.push(`[${expectedId}] physical_analogy debe ser un objeto válido`);
      return;
    }
    const { name_es, name_en, height_meters } = physical_analogy;
    if (!name_es || !name_en) {
      errors.push(`[${expectedId}] physical_analogy debe tener name_es y name_en completos`);
    }
    if (typeof height_meters !== 'number' || height_meters <= 0) {
      errors.push(`[${expectedId}] height_meters debe ser un número positivo`);
    }

    // Validar orden decreciente estricto de alturas
    if (height_meters >= lastHeight) {
      errors.push(`[${expectedId}] La altura de este estrato (${height_meters}m) debe ser menor que la del estrato anterior (${lastHeight}m)`);
    }
    lastHeight = height_meters;

    // Validar consistencia matemática de la fórmula
    // expectedWealth = (altura / step_height) * step_usd
    const expectedWealth = (height_meters / step_physical_height_meters) * step_usd_value;
    const { min, max, average } = stratum.net_worth_range_usd;

    let mathValid = false;
    let description = '';

    if (min !== null && max !== null) {
      // Debería caer dentro del rango [min, max]
      mathValid = expectedWealth >= min && expectedWealth <= max;
      description = `esperado entre Rango [${min}, ${max}]`;
    } else if (min !== null) {
      // Debería ser >= min
      mathValid = expectedWealth >= min;
      description = `>= Mínimo [${min}]`;
    } else if (average !== null) {
      // Debería estar cerca del promedio (dentro de una tolerancia del 5% debido a redondeos visuales)
      const tolerance = average * 0.05;
      mathValid = Math.abs(expectedWealth - average) <= tolerance;
      description = `cercano al Promedio [${average}] (dentro del 5%)`;
    } else {
      // Rango indefinido, advertencia
      logWarning(`[${expectedId}] Sin rango definido para validación matemática`);
      mathValid = true;
    }

    if (!mathValid) {
      errors.push(`[${expectedId}] Consistencia matemática rota. La altura física declarada (${height_meters}m) representa un patrimonio neto de $${expectedWealth.toLocaleString('en-US')} USD, el cual no es coherente con el rango ${description}`);
    } else {
      logSuccess(`Consistencia matemática verificada (${height_meters}m representa ~$${Math.round(expectedWealth).toLocaleString('en-US')} USD).`);
    }

    // Validar consistencia de traducciones
    const { translations } = stratum;
    if (!translations || typeof translations !== 'object') {
      errors.push(`[${expectedId}] Falta el bloque translations`);
      return;
    }
    const { es, en } = translations;
    if (!es || !en || !es.headline || !es.caption || !es.aria || !en.headline || !en.caption || !en.aria) {
      errors.push(`[${expectedId}] Translations debe contener headline, caption y aria tanto en 'es' como en 'en'`);
    } else {
      logSuccess('Integridad bilingüe (i18n) de textos y etiquetas validada.');
    }
  });

  // Mostrar resultados finales
  logHeader('Resultado de la Validación');
  if (errors.length > 0) {
    logError(`${errors.length} error(es) crítico(s) encontrado(s):`);
    errors.forEach(err => console.error(`${RED}- ${err}${RESET}`));
    process.exit(1);
  } else {
    logSuccess('El SPEC metodológico de datos es 100% consistente.');
    console.log(`\n${GREEN}${BOLD}✓ ¡ÉXITO! Todos los contratos metodológicos, matemáticos e idiomáticos se cumplen.${RESET}\n`);
    process.exit(0);
  }
} catch (error) {
  logError(`Fallo crítico al ejecutar el validador: ${error.message}`);
  process.exit(1);
}
