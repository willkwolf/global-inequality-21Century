# Ontología y Unidad de Análisis: Exclusividad de la Persona Natural

## 1. La Pregunta Ontológica: ¿Quién Marcha en el Desfile?

Una tentación recurrente en las comparaciones de riqueza es contrastar personas con instituciones (ej. *"Elon Musk tiene más dinero que el PIB de 50 países"* o *"Apple vale más que toda la riqueza de África"*). 

Desde el punto de vista epistemológico, este cruce constituye una **falacia de falsa equivalencia de categorías** (*category mistake*, Ryle, 1949):

| Atributo | Persona Natural (Humano Adulto) | Persona Jurídica (Empresa / Estado / Fondo) |
|---|---|---|
| **Naturaleza** | Organismo biológico individual finito. | Ficción jurídica contractual o colectiva. |
| **Consumo y Utilidad** | Consume bienes materiales, experimenta dolor, bienestar y finitud. | Mecanismo de asignación de capital; no tiene estómago ni esperanza de vida. |
| **Propiedad y Control** | Ejerce titularidad última de sus derechos patrimoniales. | Propiedad compartida por millones de accionistas, bonistas y pensionados. |
| **Métrica Temporal** | Riqueza acumulada durante una vida (stock). | Flujo de producción anual (PIB) o capitalización bursátil agregada. |

---

## 2. El Principio de Invarianza Ontológica

> [!CAUTION]
> **Prohibición Estricta:** El desfile de Jan Pen es un desfile de seres humanos. Mezclar corporaciones (Microsoft, Saudi Aramco), estados soberanos (Noruega, EE. UU.) o fondos soberanos (NBIM, Temasek) con personas naturales **invalida de inmediato el contrato epistemológico del artefacto**.

Si se permitiera incluir corporaciones en el estrato superior:
1. Se duplicarían activos: la riqueza de la corporación ya está reflejada en las acciones que poseen las personas naturales en sus respectivos estratos.
2. Se destruiría la escala corporal: la metáfora de la altura se basa en comparar cuerpos humanos con el suelo. Una corporación no tiene cuerpo físico.
3. Se induciría al lector al error de atribuir a una entidad jurídica los derechos y deberes morales propios de una persona individual.

---

## 3. Implementación en Código: `EntityFilter`

El módulo `src/domain/domain-definition.js` implementa un guardrail algorítmico obligatorio:

```javascript
export class EntityFilter {
  static validate(entity) {
    if (!entity || typeof entity !== 'object') {
      throw new Error("Entidad inválida: estructura vacía.");
    }
    
    // Lista negra estricta de tipos de entidades
    const BANNED_TYPES = ['corporation', 'state', 'sovereign_fund', 'ngo', 'holding', 'institution'];
    
    if (BANNED_TYPES.includes(entity.type)) {
      throw new Error(`ABSTRACTION_LIMIT_REACHED: Se intentó ingresar una entidad no natural (${entity.type}: ${entity.name}). Violación ontológica.`);
    }
    
    if (entity.type !== 'person') {
      throw new Error(`Entidad rechazada: el tipo '${entity.type}' no satisface el invariante de Persona Natural.`);
    }
    
    return true;
  }
}
```

La suite de pruebas adversariales verifica en cada build (`tests/vibium-verification.test.mjs` y `Caso Extremo 10`) que cualquier inyección sintética de corporaciones sea rechazada con código `ABSTRACTION_LIMIT_REACHED`.
