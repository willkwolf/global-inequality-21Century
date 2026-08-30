# src/governance — Gobernanza Operacional y Closed-Loop Tuning (Fases 4 y 7)

## Propósito
Este módulo implementa el protocolo formal de gobernanza para la evolución controlada y autorizada del sistema:

1. **Protocolo Closed-Loop Tuning (Fase 4):**
   $$\text{OBSERVE} \to \text{HYPOTHESIZE} \to \text{MODIFY} \to \text{TEST} \to \text{MEASURE} \to \text{RANK} \to \text{RETAIN / REVERT}$$
2. **Matriz de Autoridad de Riesgos:**
   - 🟢 *Bajo Riesgo (Recalibraciones numéricas ordinarias):* Aprobación determinista por CI.
   - 🟡 *Riesgo Medio (Copy bilingüe, reorganización de percentiles):* Agente + Certificación Vibium.
   - 🔴 *Alto Riesgo / ⛔ Cambio Conceptual:* Bloqueo estricto, requiere revisión y firma humana obligatoria.
3. **Principio Anti-Autoautorización:** Ningún agente puede modificar simultáneamente las reglas de negocio y las pruebas que las certifican.
