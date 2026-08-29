# Contrato de Actualización, Conservación y Auto-Mantenimiento de Datos
## Wealth Data Protocol (WDP) — v1.0

**Propósito:** definir las reglas que gobiernan cómo un sistema autónomo obtiene, valida, versiona, conserva y publica datos de riqueza global, de forma que la serie siga siendo comparable, auditable y utilizable en un horizonte de 50–60+ años, incluso ante fallos, cambios de metodología o desaparición de fuentes individuales.

Este documento es un **contrato de diseño**, no software. Sirve como especificación que cualquier agente, script o mantenedor humano futuro debe seguir al operar el sistema.

---

## 1. Principios rectores (no negociables)

1. **Nunca sobrescribir, siempre versionar.** Ningún dato crudo se borra o reemplaza; se archiva con marca de tiempo y hash.
2. **El dato crudo es sagrado; el dato procesado es desechable.** Los cálculos derivados (percentiles combinados, PPP ajustado) se pueden regenerar desde cero en cualquier momento a partir del crudo. El crudo nunca se regenera — se conserva tal como llegó.
3. **Redundancia de fuente, redundancia de almacenamiento.** Ninguna métrica depende de una sola fuente ni de un solo lugar de almacenamiento.
4. **Transparencia de metodología por encima de continuidad aparente.** Si una fuente cambia su definición de "riqueza", el sistema debe romper la serie visualmente antes que empalmarla en silencio.
5. **Grado de confianza institucional explícito.** Cada fuente lleva una etiqueta de durabilidad esperada (ver §2), y el sistema debe planear su propia obsolescencia.

---

## 2. Registro de fuentes primarias

| Fuente | Tipo | Cobertura | Frecuencia esperada | Nivel de confianza institucional (60 años) | Riesgo principal | Fuente sustituta si desaparece |
|---|---|---|---|---|---|---|
| **WID.world** (World Inequality Database) | Consorcio académico, código abierto | ~100 países, percentiles/deciles/top 0.01% | Continua (API) + reporte cada 4 años | **Alto** — multi-institucional, financiado públicamente, código en GitHub | Dependencia de financiamiento académico | Réplicas del repo GitHub + snapshots propios |
| **UBS Global Wealth Report** (ex Credit Suisse) | Banco privado | 56 mercados, ~92% riqueza global, pirámide de riqueza | Anual (junio) | **Medio** — ya sobrevivió una fusión (2023) sin romper la serie, pero depende de una entidad con fines de lucro | Cambio de metodología o discontinuación por decisión corporativa | Fed DFA + ECB HFCS + encuestas nacionales agregadas |
| **Forbes Billionaires List** | Medio privado | Individuos, top global | Continua (tiempo real) + anual | **Bajo-Medio** — serie más larga (desde 1987) pero institucionalmente frágil | Cambio de dueño, paywall, discontinuación | Bloomberg Billionaires Index (secundaria) |
| **World Bank PIP** (Poverty and Inequality Platform) | Multilateral | Percentiles bajos/medios, ingreso/consumo | Actualizaciones periódicas (~semestral) | **Alto** — institución multilateral | Débil en el extremo superior de riqueza | WID como cruce |
| **Fed Distributional Financial Accounts** | Banco central | Solo EE. UU., alta granularidad | Trimestral | **Alto** dentro de su alcance | Cobertura geográfica limitada | — (ancla nacional, no global) |
| **ECB Household Finance and Consumption Survey** | Banco central | Eurozona | ~Trienal | **Alto** dentro de su alcance | Cobertura geográfica limitada | — (ancla regional) |

**Regla de contrato:** ninguna fuente puede ser la única entrada para una métrica reportada al usuario final. Toda cifra publicada debe indicar su fuente primaria y, si existe, su fuente de contraste.

---

## 3. Esquema canónico de datos

Todo dato ingerido se normaliza a este esquema antes de entrar al almacén, independientemente de su fuente original:

```
{
  "entity": "world | country_iso3 | individual",
  "metric": "net_worth | income | liquid_assets",
  "percentile_or_rank": "p50 | p80 | top1 | top0.01 | rank_1",
  "value": number,
  "currency_basis": "USD_PPP_2025 | USD_nominal",
  "year": integer,
  "source_id": "wid | ubs | forbes | worldbank_pip | fed_dfa | ecb_hfcs",
  "source_methodology_version": string,
  "retrieved_at": ISO8601,
  "raw_payload_hash": sha256,
  "raw_payload_uri": string
}
```

**Regla de contrato:** un cambio en `source_methodology_version` obliga a crear una nueva serie lógica, no a continuar la anterior. El sistema de visualización debe poder mostrar ambas series superpuestas con una marca visual de discontinuidad metodológica.

---

## 4. Protocolo de actualización automática

| Evento disparador | Acción |
|---|---|
| Nueva publicación detectada en fuente (scraping/API/RSS) | Descargar payload crudo → calcular hash → comparar contra último hash almacenado |
| Hash distinto al anterior | Archivar como nueva versión inmutable (no reemplaza la anterior) |
| Cambio de metodología detectado (palabras clave, cambio de esquema, notas del publicador) | Marcar bandera `methodology_break = true` en esa fuente/año |
| Fuente inaccesible por N intentos consecutivos (configurable, ej. 90 días) | Marcar fuente como `status: unreachable`, activar fuente sustituta de §2, notificar en el log público |
| Ciclo de reconciliación (mensual) | Recalcular todas las series derivadas desde el crudo; nunca editar el crudo |

---

## 5. Conservación e inmutabilidad (el núcleo "tipo DAO")

Para que el archivo sobreviva 60 años sin depender de una sola organización:

1. **Almacenamiento primario:** repositorio Git público (versionado nativo, historial verificable).
2. **Almacenamiento de permanencia:** cada snapshot crudo se sube además a una capa de almacenamiento direccionado por contenido (ej. IPFS/Arweave), donde el hash del contenido es la dirección — esto hace que el dato sea verificable independientemente de quién lo aloje.
3. **Ledger append-only de procedencia:** un registro público, solo-anexión, que asocia cada dato publicado con su hash de origen y timestamp. Esto es lo que da la propiedad "tipo DAO": nadie puede alterar retroactivamente lo que se publicó, y cualquiera puede auditar la cadena de procedencia sin confiar en un operador central.
4. **Multi-mantenedor:** el repositorio no depende de una sola persona/organización con derechos de escritura; se define un umbral mínimo de mantenedores independientes con capacidad de ejecutar el pipeline.

**Cláusula de honestidad:** ningún sistema es literalmente "sin intervención humana" durante 60 años — dominios se renuevan, APIs cambian, estándares web evolucionan. El contrato no promete cero intervención; promete que **la intervención nunca pueda alterar el registro histórico**, solo extenderlo.

---

## 6. Gobernanza de cambios de metodología

- Ningún cambio de definición de "riqueza" se aplica retroactivamente a datos ya publicados.
- Todo cambio de metodología en una fuente activa una revisión documentada (qué cambió, por qué, desde qué fecha) antes de aceptar nuevos datos de esa fuente.
- Se mantiene un archivo `CHANGELOG_METODOLOGICO.md` legible por humanos junto al dato crudo.

---

## 7. Publicación hacia la interfaz (scrollytelling)

- El pipeline expone un **JSON estático versionado** (no una base de datos viva) como contrato de interfaz entre los datos y la capa visual.
- Esto desacopla la interfaz interactiva del pipeline de datos: la interfaz de scrollytelling puede reconstruirse o rediseñarse en el futuro sin tocar la lógica de conservación de datos.
- Cada publicación de la interfaz queda asociada a una versión específica del dataset (`dataset_version`), permitiendo reproducir exactamente lo que el usuario vio en cualquier fecha pasada.

---

## 8. Cláusula de revisión periódica

Cada 5 años (marcado en el propio repositorio como hito automático), el sistema debe generar un reporte de auto-diagnóstico:
- ¿Siguen activas las fuentes registradas?
- ¿Hay fuentes nuevas de mayor calidad que deberían incorporarse?
- ¿La capa de almacenamiento de permanencia sigue siendo accesible?

Este reporte se publica también de forma inmutable — es en sí mismo parte del archivo histórico.

---

## Próximo paso sugerido

Este documento es la capa de gobernanza. El siguiente componente natural es el **prototipo funcional de la interfaz de scrollytelling**, alimentado por un snapshot real de estas fuentes (ej. UBS 2026 + WID 2026), para validar que el esquema canónico de §3 efectivamente sostiene la narrativa visual que buscas.
