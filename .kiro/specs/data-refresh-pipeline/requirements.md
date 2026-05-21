# Documento de Requisitos

## Introducción

El **Data Refresh Pipeline** es un sistema de auto-actualización periódica para la visualización scrollytelling *¿A qué altura vives?* (`Escala-visual-de-riqueza-mundial.html`). Cada ~24 meses (a partir de 2026), un workflow de GitHub Actions orquesta un LLM gratuito para extraer datos de fuentes académicas globales, validar invariantes, actualizar el HTML y proponer los cambios mediante un Pull Request para revisión humana antes del merge.

El sistema preserva la abstracción central —altura física = riqueza— y sus invariantes matemáticos, mientras actualiza los datos numéricos, los objetos/iconos de cada panel y los textos descriptivos para reflejar la realidad del momento.

---

## Glosario

- **Pipeline**: El workflow de GitHub Actions que orquesta todo el proceso de actualización.
- **LLM_Selector**: Componente que detecta y selecciona el mejor proveedor de LLM gratuito disponible en el momento de ejecución.
- **LLM_Agent**: El modelo de lenguaje seleccionado que realiza extracción, interpretación y generación de contenido.
- **Data_Extractor**: Componente que obtiene datos de fuentes académicas externas.
- **Invariant_Validator**: Componente que verifica que los invariantes matemáticos y narrativos nunca sean violados.
- **Change_Detector**: Componente que compara datos nuevos con el ciclo anterior y detecta cambios abruptos.
- **HTML_Updater**: Componente que modifica el archivo `Escala-visual-de-riqueza-mundial.html` preservando la estructura y la abstracción.
- **Version_Manager**: Componente que gestiona branches, commits, PRs y rollback.
- **Invariante**: Constante matemática o narrativa que el sistema nunca debe modificar.
- **Escalón**: Unidad base de la visualización: 1 escalón = $8,000 USD = 15 cm.
- **Mediana_Mundial**: El patrimonio neto correspondiente a la mediana global de adultos (~$8,654–$9,167 USD), que siempre equivale a aproximadamente un escalón.
- **Panel**: Cada una de las 8 secciones (`s1`–`s8`) del HTML scrollytelling.
- **Umbral_de_Alerta**: Porcentaje de cambio máximo permitido por panel antes de detener el pipeline y crear un issue.
- **Ciclo_Anterior**: El estado de los datos en la última ejecución exitosa del Pipeline.
- **wealth-data.json**: Archivo JSON con los datos actuales de cada panel.
- **wealth-data.history.json**: Archivo JSON con el historial de todas las actualizaciones.
- **invariants.json**: Archivo JSON con las constantes que nunca cambian.
- **Proveedor_LLM**: Servicio de API que expone un LLM gratuito (Ollama, Groq, GitHub Models, Hugging Face, etc.).
- **Fuente_Primaria**: Fuente académica de datos de riqueza con consenso científico (UBS, WID, World Bank, OECD, Oxfam, Credit Suisse).
- **Fuente_Secundaria**: Fuente de referencia complementaria con menor peso académico (Forbes).
- **diff_report**: Documento generado por el Pipeline que describe todos los cambios propuestos con justificación.

---

## Requisitos

### Requisito 1: Activación del Pipeline

**User Story:** Como mantenedor del proyecto, quiero que el pipeline se ejecute automáticamente cada 24 meses y también de forma manual, para que la visualización se mantenga actualizada sin intervención constante.

#### Criterios de Aceptación

1. THE Pipeline SHALL ejecutarse automáticamente mediante un `schedule: cron` configurado para el primer día del mes cada 24 meses a partir de enero de 2026.
2. THE Pipeline SHALL ejecutarse bajo demanda mediante `workflow_dispatch` con parámetros opcionales de configuración.
3. WHEN el Pipeline es activado manualmente via `workflow_dispatch`, THE Pipeline SHALL aceptar un parámetro opcional `dry_run` (booleano) que ejecuta todas las etapas sin crear branch ni PR.
4. THE Pipeline SHALL completar su ejecución completa dentro de un límite de 5 horas para respetar el timeout de 6 horas de GitHub Actions runners gratuitos.
5. THE Pipeline SHALL ejecutarse en runners `ubuntu-latest` de GitHub Actions sin requerir Docker ni infraestructura de pago.

---

### Requisito 2: Selección Resiliente de Proveedor LLM

**User Story:** Como mantenedor del proyecto, quiero que el sistema seleccione automáticamente el mejor LLM gratuito disponible en el momento de ejecución, para que el pipeline no falle si un proveedor desaparece o cambia sus condiciones en los próximos años.

#### Criterios de Aceptación

1. THE LLM_Selector SHALL intentar conectar con los proveedores en el siguiente orden de prioridad: Ollama.ai API, Groq API, GitHub Models, Hugging Face Inference API, cualquier endpoint OpenAI-compatible gratuito configurado.
2. WHEN un Proveedor_LLM no responde o devuelve error de autenticación, THE LLM_Selector SHALL intentar el siguiente proveedor en la lista de prioridad dentro de 30 segundos.
3. WHEN ningún Proveedor_LLM está disponible, THE Pipeline SHALL detenerse y crear un issue en GitHub con el título `[Pipeline] No LLM provider available` y el detalle de los errores de cada proveedor.
4. THE LLM_Selector SHALL registrar en el log de ejecución el proveedor seleccionado, el modelo específico utilizado y la latencia de conexión.
5. THE LLM_Selector SHALL leer la lista de proveedores y sus credenciales desde GitHub Actions Secrets, de modo que agregar un nuevo proveedor no requiera modificar el código del pipeline.
6. WHERE la variable de entorno `LLM_PROVIDER_OVERRIDE` está definida, THE LLM_Selector SHALL usar exclusivamente ese proveedor sin intentar los demás.

---

### Requisito 3: Extracción de Datos de Fuentes Académicas

**User Story:** Como mantenedor del proyecto, quiero que el sistema extraiga datos de múltiples fuentes académicas con redundancia, para que los datos actualizados reflejen el consenso científico global y no dependan de una sola fuente.

#### Criterios de Aceptación

1. THE Data_Extractor SHALL intentar obtener datos de las siguientes Fuentes_Primarias en cada ciclo: UBS Global Wealth Report, World Inequality Database (WID), World Bank Wealth Distribution, OECD Wealth Distribution, Oxfam Inequality Reports, Credit Suisse Global Wealth Report.
2. THE LLM_Agent SHALL interpretar datos en formatos heterogéneos incluyendo PDF, HTML, JSON y CSV provenientes de las Fuentes_Primarias.
3. WHEN una Fuente_Primaria no está disponible o devuelve datos incompletos, THE Data_Extractor SHALL continuar con las fuentes restantes y registrar la fuente no disponible en el log.
4. THE LLM_Agent SHALL usar Forbes exclusivamente como Fuente_Secundaria de referencia para datos de billonarios, sin darle peso equivalente a las Fuentes_Primarias en el cálculo de consenso.
5. WHEN al menos 2 Fuentes_Primarias están disponibles, THE LLM_Agent SHALL calcular un valor de consenso para cada dato requerido, ponderando las fuentes por su disponibilidad y consistencia mutua.
6. IF solo 1 Fuente_Primaria está disponible, THEN THE Pipeline SHALL detenerse y crear un issue en GitHub con el título `[Pipeline] Insufficient data sources` antes de modificar ningún archivo.
7. THE Data_Extractor SHALL registrar en el log la URL o referencia exacta de cada dato extraído, la fuente de origen y la fecha de publicación del dato.
8. THE LLM_Agent SHALL generar un reporte de consistencia entre fuentes que indique las discrepancias encontradas y el criterio de selección del valor final para cada dato.

---

### Requisito 4: Preservación de Invariantes

**User Story:** Como autor de la visualización, quiero que el sistema garantice que los invariantes matemáticos y narrativos nunca sean modificados, para que la abstracción central de la pieza se preserve a lo largo del tiempo.

#### Criterios de Aceptación

1. THE Invariant_Validator SHALL verificar que la fórmula base `1 escalón = $8,000 USD = 15 cm` permanece sin cambios en `invariants.json` antes y después de cada actualización.
2. THE Invariant_Validator SHALL verificar que el Panel `s7` (escalón de la mediana mundial) siempre tiene una altura calculada entre 15 cm y 20 cm, correspondiente a aproximadamente un escalón de escalera.
3. THE Invariant_Validator SHALL verificar que la altura calculada del Panel `s8` (roca) es siempre estrictamente menor que la altura calculada del Panel `s7` (escalón).
4. THE Invariant_Validator SHALL verificar que la secuencia de alturas de los paneles `s1` a `s8` es estrictamente decreciente (s1 > s2 > s3 > s4 > s5 > s6 > s7 > s8).
5. THE Invariant_Validator SHALL verificar que la narrativa de descenso desde el espacio hasta el suelo se preserva: el Panel `s1` representa el estrato más alto y el Panel `s8` el más bajo.
6. IF el Invariant_Validator detecta una violación de cualquier invariante, THEN THE Pipeline SHALL detenerse inmediatamente sin modificar ningún archivo y crear un issue en GitHub con el título `[Pipeline] Invariant violation` y el detalle de la violación.
7. THE Invariant_Validator SHALL leer los invariantes desde `data/invariants.json` y nunca calcularlos dinámicamente, para que los invariantes sean auditables por humanos.
8. FOR ALL ciclos de actualización, THE Invariant_Validator SHALL producir un resultado idéntico al aplicarse dos veces consecutivas sobre el mismo estado de datos (propiedad de idempotencia de la validación).

---

### Requisito 5: Detección de Cambios Abruptos

**User Story:** Como mantenedor del proyecto, quiero que el sistema detecte automáticamente cuando un dato cambia de forma inusualmente grande respecto al ciclo anterior, para que un humano pueda revisar si el cambio es legítimo antes de publicarlo.

#### Criterios de Aceptación

1. THE Change_Detector SHALL comparar cada valor numérico del nuevo ciclo con el valor correspondiente del Ciclo_Anterior almacenado en `wealth-data.history.json`.
2. WHEN el cambio porcentual de un valor numérico de cualquier panel supera el Umbral_de_Alerta configurado para ese panel, THE Change_Detector SHALL marcar ese panel como `requires_review`.
3. THE Pipeline SHALL leer los Umbrales_de_Alerta desde un archivo de configuración `data/alert-thresholds.json`, con valores por defecto de 30% para paneles `s2`–`s8` y 50% para el panel `s1` (billonarios, más volátil).
4. WHEN al menos un panel está marcado como `requires_review`, THE Pipeline SHALL detenerse antes de modificar el HTML y crear un issue en GitHub con el título `[Pipeline] Abrupt change detected` que liste los paneles afectados, los valores anteriores, los valores nuevos y el porcentaje de cambio.
5. WHEN ningún panel está marcado como `requires_review`, THE Pipeline SHALL continuar con la actualización del HTML sin intervención humana.
6. THE Change_Detector SHALL incluir en el issue de alerta una sección `Justificación del LLM` con la explicación del LLM_Agent sobre la causa probable del cambio detectado.

---

### Requisito 6: Actualización del Contenido de los Paneles

**User Story:** Como autor de la visualización, quiero que el sistema actualice los datos numéricos, los objetos/iconos y los textos de cada panel de forma coherente con los nuevos datos, para que la visualización refleje la realidad actual sin perder su calidad narrativa.

#### Criterios de Aceptación

1. THE HTML_Updater SHALL actualizar los valores numéricos (patrimonio, porcentajes, alturas calculadas) de los 8 paneles en el HTML usando los datos validados de `wealth-data.json`.
2. THE LLM_Agent SHALL evaluar si los objetos/iconos de cada panel siguen siendo culturalmente relevantes y comprensibles para una audiencia global, y proponer un objeto alternativo de altura equivalente cuando el objeto actual haya perdido relevancia.
3. WHEN el LLM_Agent propone un cambio de objeto/icono para un panel, THE LLM_Agent SHALL incluir en el diff_report la justificación cultural, la altura del objeto propuesto y la fuente de referencia de esa altura.
4. THE HTML_Updater SHALL actualizar las captions y textos descriptivos de cada panel para reflejar los nuevos datos numéricos y el nuevo objeto/icono si aplica.
5. THE LLM_Agent SHALL evaluar si el personaje de referencia del Panel `s1` (actualmente Elon Musk) sigue siendo la persona más rica del mundo según las Fuentes_Primarias disponibles, y proponer el reemplazo si corresponde.
6. THE HTML_Updater SHALL preservar toda la estructura HTML, los atributos ARIA, los atributos `data-i18n`, los estilos CSS y el sistema de internacionalización ES/EN sin modificaciones.
7. THE HTML_Updater SHALL actualizar las cadenas de texto en el diccionario `STRINGS` del JavaScript para ambos idiomas (ES y EN) de forma consistente.
8. WHEN el HTML_Updater modifica el HTML, THE HTML_Updater SHALL verificar que el archivo resultante es HTML válido y que el sistema i18n no tiene claves faltantes (la validación `[i18n] All keys validated ✓` debe pasar).

---

### Requisito 7: Estructura de Datos y Versionado

**User Story:** Como mantenedor del proyecto, quiero que los datos estén estructurados en archivos JSON versionados con historial, para que sea posible auditar cambios, hacer rollback y entender la evolución de los datos a lo largo del tiempo.

#### Criterios de Aceptación

1. THE Version_Manager SHALL mantener el archivo `data/wealth-data.json` con los datos del ciclo actual, incluyendo para cada panel: identificador, altura calculada, patrimonio de referencia, porcentaje de población, objeto/icono, textos ES y EN, fuente primaria utilizada y fecha del dato.
2. THE Version_Manager SHALL mantener el archivo `data/wealth-data.history.json` como un array de entradas históricas, donde cada entrada contiene la fecha del ciclo, los datos completos de ese ciclo y el proveedor LLM utilizado.
3. THE Version_Manager SHALL mantener el archivo `data/invariants.json` con las constantes inmutables: la fórmula base, el valor del escalón en USD, la altura del escalón en cm, y la descripción de la invariante narrativa.
4. FOR ALL actualizaciones, THE Version_Manager SHALL agregar la entrada del ciclo anterior a `wealth-data.history.json` antes de sobrescribir `wealth-data.json`, de modo que el historial sea siempre completo.
5. THE Version_Manager SHALL crear un branch con el nombre `data-update/YYYY-MM` (donde YYYY-MM es el año y mes de la ejecución) para cada ciclo de actualización.
6. THE Version_Manager SHALL crear un Pull Request automático desde el branch `data-update/YYYY-MM` hacia `master` con el diff_report como descripción del PR.
7. IF el Pipeline falla en cualquier etapa posterior a la creación del branch, THEN THE Version_Manager SHALL eliminar el branch creado y restaurar el estado de los archivos JSON al estado del Ciclo_Anterior.
8. THE Version_Manager SHALL incluir en el diff_report: la lista de paneles modificados, los valores anteriores y nuevos de cada campo modificado, la justificación del LLM_Agent para cada cambio, las fuentes utilizadas y el proveedor LLM seleccionado.

---

### Requisito 8: Parser y Serialización del HTML

**User Story:** Como desarrollador del pipeline, quiero que el sistema pueda leer y escribir el archivo HTML de forma estructurada y reversible, para que las actualizaciones sean precisas y no introduzcan errores de formato.

#### Criterios de Aceptación

1. THE HTML_Updater SHALL parsear el archivo `Escala-visual-de-riqueza-mundial.html` en una representación estructurada que permita acceder a los datos de cada panel por su identificador (`s1`–`s8`).
2. THE HTML_Updater SHALL serializar la representación estructurada de vuelta a un archivo HTML válido que preserve todos los atributos, estilos, scripts y comentarios del archivo original.
3. FOR ALL archivos HTML válidos de la visualización, parsear y luego serializar SHALL producir un archivo funcionalmente equivalente al original (propiedad de round-trip: `parse → serialize → parse` produce la misma representación estructurada).
4. IF el HTML_Updater no puede parsear el archivo HTML (estructura inesperada o archivo corrupto), THEN THE Pipeline SHALL detenerse y crear un issue en GitHub con el título `[Pipeline] HTML parse error` sin modificar ningún archivo.
5. THE HTML_Updater SHALL actualizar únicamente los nodos del DOM que corresponden a datos variables (valores numéricos en `.num`, textos en `.headline`, `.caption`, entradas en `STRINGS`), sin tocar los nodos de estructura, estilos o scripts.

---

### Requisito 9: Tests del Pipeline

**User Story:** Como desarrollador del pipeline, quiero que el sistema tenga una suite de tests automatizados que cubra los invariantes, el flujo completo con datos sintéticos y la resiliencia ante fallos, para que los cambios al pipeline puedan verificarse sin ejecutar el pipeline real.

#### Criterios de Aceptación

1. THE Pipeline SHALL incluir tests de invariantes que verifiquen que `data/invariants.json` nunca es modificado por ninguna ejecución del pipeline, usando datos sintéticos de entrada.
2. THE Pipeline SHALL incluir tests de round-trip del HTML_Updater que verifiquen que `parse(serialize(parse(html))) == parse(html)` para cualquier HTML válido de la visualización.
3. THE Pipeline SHALL incluir tests del Change_Detector con datos sintéticos que cubran: cambio dentro del umbral (no alerta), cambio exactamente en el umbral (no alerta), cambio por encima del umbral (alerta), y cambio negativo por encima del umbral (alerta).
4. THE Pipeline SHALL incluir tests del LLM_Selector con mocks de APIs que verifiquen: selección del proveedor de mayor prioridad disponible, fallback al siguiente proveedor cuando el primero falla, y detención cuando todos los proveedores fallan.
5. THE Pipeline SHALL incluir tests de resiliencia del Data_Extractor con mocks que simulen: respuesta exitosa en formato JSON, respuesta exitosa en formato CSV, respuesta con error HTTP 503, y respuesta con datos incompletos.
6. THE Pipeline SHALL incluir un test de integración end-to-end con datos sintéticos que ejecute el pipeline completo (sin LLM real ni fuentes reales) y verifique que el HTML resultante es válido y que los invariantes se preservan.
7. WHEN los tests se ejecutan en GitHub Actions, THE Pipeline SHALL completar la suite de tests en menos de 10 minutos usando únicamente runners gratuitos.

---

### Requisito 10: Configuración y Operación

**User Story:** Como mantenedor del proyecto, quiero que el pipeline sea configurable sin modificar código y que genere logs claros, para que sea fácil de operar y diagnosticar problemas en el futuro.

#### Criterios de Aceptación

1. THE Pipeline SHALL leer todos los parámetros operacionales (Umbrales_de_Alerta, lista de proveedores LLM, lista de fuentes de datos, intervalo de ciclo) desde archivos de configuración en el repositorio o desde GitHub Actions Secrets, sin valores hardcodeados en el código del pipeline.
2. THE Pipeline SHALL generar un log estructurado en formato JSON para cada etapa de ejecución, incluyendo: nombre de la etapa, timestamp de inicio y fin, resultado (éxito/fallo), y mensaje descriptivo.
3. WHEN el Pipeline completa una ejecución exitosa, THE Pipeline SHALL publicar un resumen en el log de GitHub Actions que incluya: proveedor LLM utilizado, fuentes de datos consultadas, paneles modificados y enlace al PR creado.
4. WHEN el Pipeline falla en cualquier etapa, THE Pipeline SHALL publicar en el log de GitHub Actions el nombre de la etapa que falló, el error específico y las acciones de remediación sugeridas.
5. THE Pipeline SHALL respetar las restricciones de los runners gratuitos de GitHub Actions: máximo 2 GB de RAM, sin Docker, sin servicios externos de pago, y sin almacenamiento persistente entre ejecuciones.
