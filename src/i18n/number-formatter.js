/**
 * src/i18n/number-formatter.js
 * 
 * MÓDULO CENTRAL DE INTERNACIONALIZACIÓN Y FORMATEO NUMÉRICO
 * 
 * INVARIANTES GLOBALES:
 * 1. NUMERIC VALUE (cálculo de alta precisión) ≠ DISPLAY VALUE (redondeo estético + locale).
 * 2. CURRENCY (USD) ≠ LOCALE (es / en): La moneda no cambia el formato regional; el locale define separadores.
 * 3. AÑO OBJETIVO DINÁMICO: target_year = new Date().getFullYear().
 * 
 * Convenciones:
 * - ES (es-419 / es-ES): Miles '.', Decimales ',' (ej. '1.748', '1.748,50', '13.828,13 km', '15.731 km').
 * - EN (en-US): Miles ',', Decimales '.' (ej. '1,748', '1,748.50', '13,828.13 km', '15,731 km').
 */

export class NumberFormatter {
  /**
   * Obtiene el año objetivo de ejecución dinámicamente del runtime.
   * CERO años hardcodeados.
   * @returns {number} Año actual (ej. 2026, 2027)
   */
  static getCurrentYear() {
    return new Date().getFullYear();
  }

  /**
   * Obtiene el contexto temporal para la normalización.
   * @param {string|number} sourceDate Fecha original de la fuente (ej. "2024-12-31" o 2024)
   * @returns {Object} { source_date, current_date, target_year }
   */
  static getTemporalContext(sourceDate = "2024-12-31") {
    const now = new Date();
    return {
      source_date: String(sourceDate),
      current_date: now.toISOString().split('T')[0],
      target_year: now.getFullYear()
    };
  }

  /**
   * Normaliza el locale a estándar soportado ('es' o 'en').
   * @param {string} locale
   * @returns {string} 'es' o 'en'
   */
  static normalizeLocale(locale = 'es') {
    if (!locale) return 'es';
    const clean = String(locale).toLowerCase();
    if (clean.startsWith('en')) return 'en';
    return 'es';
  }

  /**
   * Formatea un número según las reglas estrictas del locale y opciones de redondeo.
   * @param {number} value Valor numérico de entrada
   * @param {string} [locale='es'] 'es' o 'en'
   * @param {Object} [options={}] Opciones de formato
   * @param {number} [options.minimumFractionDigits=0]
   * @param {number} [options.maximumFractionDigits=2]
   * @param {boolean} [options.useGrouping=true]
   * @returns {string} Número formateado
   */
  static formatNumber(value, locale = 'es', options = {}) {
    if (value === null || value === undefined || isNaN(value)) return '0';
    
    const normLocale = this.normalizeLocale(locale);
    const locTag = normLocale === 'en' ? 'en-US' : 'es-ES';

    const minDec = options.minimumFractionDigits !== undefined ? options.minimumFractionDigits : 0;
    const maxDec = options.maximumFractionDigits !== undefined ? options.maximumFractionDigits : 2;
    const useGrouping = options.useGrouping !== undefined ? options.useGrouping : true;

    const formatter = new Intl.NumberFormat(locTag, {
      minimumFractionDigits: minDec,
      maximumFractionDigits: maxDec,
      useGrouping
    });

    return formatter.format(value);
  }

  /**
   * Formatea valores monetarios respetando el principio CURRENCY ≠ LOCALE.
   * @param {number} value Cantidad numérica
   * @param {string} [currency='USD'] Código de moneda
   * @param {string} [locale='es'] 'es' o 'en'
   * @param {Object} [options={}] Opciones adicionales
   * @returns {string} Cadena monetaria localizada (ej. 'USD $1.748' en ES, 'USD $1,748' en EN)
   */
  static formatCurrency(value, currency = 'USD', locale = 'es', options = {}) {
    if (value === null || value === undefined || isNaN(value)) return `${currency} $0`;
    
    const normLocale = this.normalizeLocale(locale);
    const numStr = this.formatNumber(value, normLocale, options);
    
    return `${currency} $${numStr}`;
  }

  /**
   * Redondeo estético y abreviación de grandes magnitudes (Miles, Millones, Billones/Miles de Millones).
   * @param {number} value Valor numérico
   * @param {string} [locale='es'] 'es' o 'en'
   * @returns {string} Magnitud abreviada
   */
  static formatMagnitude(value, locale = 'es') {
    if (value === null || value === undefined || isNaN(value)) return '0';
    
    const normLocale = this.normalizeLocale(locale);
    const absVal = Math.abs(value);

    // Billones ($1,000,000,000,000+) / Trillones en escala corta
    if (absVal >= 1e12) {
      const trillions = value / 1e12;
      const dec = trillions % 1 === 0 ? 0 : 2;
      const formatted = this.formatNumber(trillions, normLocale, { minimumFractionDigits: 0, maximumFractionDigits: dec });
      return normLocale === 'es' ? `${formatted} billones` : `${formatted} trillion`;
    }

    // Miles de millones ($1,000,000,000+) / Billones en escala corta
    if (absVal >= 1e9) {
      const billions = value / 1e9;
      const dec = billions % 1 === 0 ? 0 : (billions >= 100 ? 1 : 2);
      const formatted = this.formatNumber(billions, normLocale, { minimumFractionDigits: 0, maximumFractionDigits: dec });
      return `${formatted}B`;
    }

    // Millones ($1,000,000+)
    if (absVal >= 1e6) {
      const millions = value / 1e6;
      const dec = millions % 1 === 0 ? 0 : (millions >= 100 ? 0 : 1);
      const formatted = this.formatNumber(millions, normLocale, { minimumFractionDigits: 0, maximumFractionDigits: dec });
      return `${formatted}M`;
    }

    // Miles ($10,000+)
    if (absVal >= 10000) {
      const thousands = Math.round(value / 1000);
      const formatted = this.formatNumber(thousands, normLocale, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      return `${formatted}k`;
    }

    // Valores estándar
    return this.formatNumber(Math.round(value), normLocale);
  }

  /**
   * Formateo estético y localizado para alturas físicas (km, m, cm).
   * @param {number} meters Altura en metros
   * @param {string} [locale='es'] 'es' o 'en'
   * @returns {Object} { value_formatted, unit, full_label, verbal_label }
   */
  static formatHeight(meters, locale = 'es') {
    if (meters === null || meters === undefined || isNaN(meters)) {
      return {
        value_formatted: '0',
        unit: 'm',
        full_label: '0 m',
        verbal_label: locale === 'es' ? '0 metros' : '0 meters'
      };
    }

    const normLocale = this.normalizeLocale(locale);

    // Kilómetros (>= 1000m)
    if (meters >= 1000) {
      const km = meters / 1000;
      const dec = km % 1 === 0 ? 0 : 2;
      const kmStr = this.formatNumber(km, normLocale, { minimumFractionDigits: dec, maximumFractionDigits: dec });
      return {
        value_formatted: kmStr,
        unit: 'km',
        full_label: `${kmStr} km`,
        verbal_label: `${kmStr} km`
      };
    }

    // Metros (>= 1m)
    if (meters >= 1) {
      const dec = meters >= 100 ? (meters % 1 === 0 ? 0 : 1) : (meters % 1 === 0 ? 0 : 2);
      const mRounded = Math.round(meters * 100) / 100;
      const mStr = this.formatNumber(mRounded, normLocale, { minimumFractionDigits: 0, maximumFractionDigits: dec });
      const verbal = normLocale === 'es' ? `${mStr} metros` : `${mStr} meters`;
      return {
        value_formatted: mStr,
        unit: 'm',
        full_label: `${mStr} m`,
        verbal_label: verbal
      };
    }

    // Centímetros (< 1m)
    const cm = Math.round(meters * 1000) / 10;
    const dec = cm % 1 === 0 ? 0 : 1;
    const cmStr = this.formatNumber(cm, normLocale, { minimumFractionDigits: dec, maximumFractionDigits: dec });
    const verbal = normLocale === 'es' ? `${cmStr} centímetros` : `${cmStr} centimeters`;
    return {
      value_formatted: cmStr,
      unit: 'cm',
      full_label: `${cmStr} cm`,
      verbal_label: verbal
    };
  }

  /**
   * Formateo de porcentajes y ratios poblacionales.
   * @param {number} percentage Porcentaje (ej. 40.7, 0.00003)
   * @param {string} [locale='es'] 'es' o 'en'
   * @returns {string} Cadena porcentual formateada
   */
  static formatPercentage(percentage, locale = 'es') {
    if (percentage === null || percentage === undefined || isNaN(percentage)) return '0%';
    const normLocale = this.normalizeLocale(locale);
    
    if (percentage < 0.0001) {
      return normLocale === 'es' ? '< 0,0001%' : '< 0.0001%';
    }
    if (percentage < 0.01) {
      const formatted = this.formatNumber(percentage, normLocale, { minimumFractionDigits: 4, maximumFractionDigits: 5 });
      return `${formatted}%`;
    }
    
    const formatted = this.formatNumber(percentage, normLocale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    return `${formatted}%`;
  }
}
