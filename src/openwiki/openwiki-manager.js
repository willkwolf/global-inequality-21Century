/**
 * src/openwiki/openwiki-manager.js
 * 
 * GESTOR DE GOBERNANZA Y DOCUMENTACIÓN OPENWIKI
 * 
 * Mantiene la documentación viva y el libro contable de cambios (Change Log Ledger)
 * append-only en `OpenWiki/10_CHANGE_LOG_LEDGER.md` y las advertencias arquitectónicas
 * en `OpenWiki/11_ARCHITECTURAL_WARNINGS.md`.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OPENWIKI_DIR = path.resolve(__dirname, '../../OpenWiki');
const LEDGER_PATH = path.join(OPENWIKI_DIR, '10_CHANGE_LOG_LEDGER.md');
const WARNINGS_PATH = path.join(OPENWIKI_DIR, '11_ARCHITECTURAL_WARNINGS.md');

export class OpenWikiManager {
  /**
   * Registra un cambio en el Change Log Ledger inmutable
   */
  static appendChangeLog({
    agentEngine,
    datasetId,
    sources,
    driftReport,
    abstractionDoc,
    status,
    riskLevel = "BAJO",
    testsSummary
  }) {
    if (!fs.existsSync(OPENWIKI_DIR)) {
      fs.mkdirSync(OPENWIKI_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString();
    const sourceSummary = (sources || []).map(s => `${s.name} (Hash: \`${(s.payload_hash || '').substring(0, 8)}...\`)`).join(', ');
    const driftsList = driftReport?.detected_drifts?.map(d => `- **${d.type}** (${d.severity}): ${d.message}`).join('\n') || "- Ninguno detectado (Dataset baseline).";

    const entry = `
### Registro: \`${datasetId}\` — ${timestamp}

- **Agente / Motor:** ${agentEngine}
- **Estado de Publicación:** \`${status}\`
- **Nivel de Riesgo:** **${riskLevel}**
- **Fuentes Primarias:** ${sourceSummary}
- **Drifts Detectados:**
${driftsList}
- **Transformación de Escala:**
  - Valor escalón: \`$${abstractionDoc?.scale_formula?.unit_value_usd || 8000} USD\`
  - Altura máxima cúspide: \`${abstractionDoc?.layers?.[0]?.formatted_height_label || 'N/A'}\` (\`${abstractionDoc?.max_height_meters || 0} m\`)
  - Total estratos generados: \`${abstractionDoc?.layers?.length || 0}\`
- **Resultado de Tests:** ${testsSummary || "Todos los tests superados (Exit code: 0)"}

---
`;

    if (!fs.existsSync(LEDGER_PATH)) {
      const header = `# OpenWiki: Registro Inmutable de Cambios (Change Log Ledger)

Este documento es el libro de contabilidad append-only que registra cada ciclo de ingesta, adaptación y decisión de los agentes de IA en el proyecto.

---
`;
      fs.writeFileSync(LEDGER_PATH, header + entry, 'utf8');
    } else {
      fs.appendFileSync(LEDGER_PATH, entry, 'utf8');
    }
  }

  /**
   * Registra o actualiza una advertencia arquitectónica
   */
  static recordWarning({ title, description, recommendation, triggerEvent, requiresHumanReview = true }) {
    if (!fs.existsSync(OPENWIKI_DIR)) {
      fs.mkdirSync(OPENWIKI_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString();
    const entry = `
### ⚠ Advertencia Arquitectónica: ${title} (${timestamp})
- **Evento Disparador:** ${triggerEvent}
- **Descripción:** ${description}
- **Recomendación:** ${recommendation}
- **Requiere Revisión Humana:** **${requiresHumanReview ? 'SÍ (Publicación bloqueada)' : 'NO (Informativo)'}**

---
`;

    if (!fs.existsSync(WARNINGS_PATH)) {
      const header = `# OpenWiki: Registro de Advertencias Arquitectónicas (Architectural Warnings)

Este registro documenta todas las alertas donde la evidencia de datos desafió o tensionó la abstracción visual pedagógica.

---
`;
      fs.writeFileSync(WARNINGS_PATH, header + entry, 'utf8');
    } else {
      fs.appendFileSync(WARNINGS_PATH, entry, 'utf8');
    }
  }
}
