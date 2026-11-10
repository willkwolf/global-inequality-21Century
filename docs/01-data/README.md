# Dominio I: Datos, Fuentes y Procedencia

## Propósito y Alcance del Dominio
Este dominio gobierna todas las fuentes empíricas primarias, modelos canónicos, registros de procedencia, esquemas y transformaciones de datos estructurados del proyecto **¿A qué altura vives?** (*How High Do You Stand?*).

Garantiza la trazabilidad matemática y la integridad metodológica entre las observaciones estadísticas del mundo real y el modelo de estratos alimentado al compilador visual.

---

## Estructura Documental del Dominio

| Documento | Enfoque Canónico | Responsabilidad |
|---|---|---|
| [`01-fuentes-primarias-y-procedencia.md`](./01-fuentes-primarias-y-procedencia.md) | Fuentes empíricas oficiales | Documentación de UBS Global Wealth Report 2024, Forbes Real-Time Billionaires y BLS CPI-U. |
| [`02-modelo-canonico-y-esquema.md`](./02-modelo-canonico-y-esquema.md) | Contrato de datos | Estructura JSON canónica, invariantes de esquema, separación entre valor matemático y presentación (`Intl.NumberFormat`). |
| [`03-normalizacion-inflacionaria-y-valor-presente.md`](./03-normalizacion-inflacionaria-y-valor-presente.md) | Normalización temporal | Metodología de ajuste por inflación CPI-U (+5.4%), conmutador de Valor Presente (`USD*`) y preservación de anclajes. |
| [`04-diccionario-de-datos-y-variables.md`](./04-diccionario-de-datos-y-variables.md) | Diccionario de variables | Taxonomía de campos, tipos primitivos, rangos válidos y unidades de medida físicas y monetarias. |

---

## Principio de Inviolabilidad de la Procedencia
1. Ningún estrato ni dato estadístico puede ser introducido en producción sin un registro explícito de procedencia, fecha de corte y fuente oficial contrastable.
2. La unidad de análisis queda restringida de forma inmutable a **personas naturales adultas**. Se prohíbe la inserción de patrimonios soberanos, corporaciones o personas jurídicas.
3. Las transformaciones de moneda y escala deben ser deterministas y reproducibles mediante `npm run validate-spec`.
