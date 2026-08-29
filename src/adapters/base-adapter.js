/**
 * src/adapters/base-adapter.js
 * 
 * Clase base abstracta para todos los adaptadores de fuentes primarias.
 * Garantiza que cada fuente cruda calcule un hash SHA-256 inmutable de procedencia.
 */

import crypto from 'crypto';

export class BaseSourceAdapter {
  constructor(sourceId, name, institutionalTrust) {
    this.sourceId = sourceId;
    this.name = name;
    this.institutionalTrust = institutionalTrust; // "Alto" | "Medio" | "Bajo"
  }

  calculatePayloadHash(rawPayload) {
    const serialized = typeof rawPayload === 'string' ? rawPayload : JSON.stringify(rawPayload);
    return crypto.createHash('sha256').update(serialized).digest('hex');
  }

  /**
   * Normaliza el payload crudo al modelo canónico de datos.
   * @param {any} rawPayload
   * @returns {Object} Canonical Data Fragment
   */
  normalize(rawPayload) {
    throw new Error(`El método normalize() debe ser implementado por ${this.constructor.name}`);
  }
}
