/**
 * src/telemetry/telemetry-logger.js
 * 
 * OBSERVABILIDAD DEL AGENTE Y AUDITORÍA DE EJECUCIÓN
 * 
 * Registra cada ciclo de ejecución para reconstruir:
 * INPUT → DECISION → TRANSFORMATION → OUTPUT.
 * 
 * NUNCA registra secretos, credenciales ni información privada.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGS_DIR = path.resolve(__dirname, '../../OpenWiki/logs');

export class TelemetryLogger {
  static recordExecution({
    datasetId,
    sources,
    driftReport,
    abstractionDoc,
    telemetry,
    publicationStatus,
    reason
  }) {
    if (!fs.existsSync(LOGS_DIR)) {
      fs.mkdirSync(LOGS_DIR, { recursive: true });
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      agent_engine: telemetry?.story_engine || "AI_ADAPTATION_ENGINE",
      dataset_id: datasetId || "unknown",
      sources: (sources || []).map(s => ({
        source_id: s.source_id,
        name: s.name,
        payload_hash: s.payload_hash
      })),
      drift_analysis: {
        detected_drifts: driftReport?.detected_drifts || [],
        epistemological_status: driftReport?.epistemological_status || "UNKNOWN",
        confidence: driftReport?.confidence ?? 1.0
      },
      transformations: {
        step_usd_value: abstractionDoc?.scale_formula?.unit_value_usd,
        step_height_meters: abstractionDoc?.scale_formula?.step_height_meters,
        max_height_meters: abstractionDoc?.max_height_meters,
        strata_count: abstractionDoc?.layers?.length || 0
      },
      execution_time_ms: telemetry?.execution_time_ms || 0,
      warnings: telemetry?.warnings || [],
      publication_status: publicationStatus,
      decision_reason: reason || (publicationStatus === "PUBLISHED" ? "Validación y guardrails superados con éxito." : "Detención por guardrail o fallo de adaptación.")
    };

    // Escribir log individual de la ejecución
    const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
    const logFilePath = path.join(LOGS_DIR, `execution_${dateStr}.json`);
    fs.writeFileSync(logFilePath, JSON.stringify(logEntry, null, 2), 'utf8');

    return logEntry;
  }
}
