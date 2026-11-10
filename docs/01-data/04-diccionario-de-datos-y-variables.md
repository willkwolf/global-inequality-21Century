# Diccionario Canónico de Datos y Variables

## 1. Alcance y Taxonomía de Variables

Este diccionario documenta de manera exhaustiva todas las variables, identificadores, unidades y restricciones de dominio utilizadas en el ecosistema de datos de **¿A qué altura vives?**.

---

## 2. Variables Globales del Sistema

| Variable | Tipo | Unidad | Restricción / Dominio | Descripción |
|---|---|---|---|---|
| `schema_version` | String (SemVer) | N/A | Regex `^\d+\.\d+\.\d+$` | Versión del contrato de datos canónico. |
| `target_year` | Integer | Años (gregoriano) | $\ge 2024$ (obtenido en runtime) | Año de presentación dinámico en tiempo de ejecución. |
| `currency_basis` | Enum | N/A | `USD_nominal` \| `USD_present_value` | Régimen monetario base de las cifras. |
| `inflation_rate_accumulated` | Float | Porcentaje | $[0.0, 1.0]$ | Tasa acumulada de inflación CPI-U (actualmente `0.054`). |
| `step_height_meters` | Float (Constante) | Metros (m) | Exactamente `0.15` | Altura física del escalón estándar de escalera humana ($15\text{ cm}$). |
| `step_wealth_reference_usd` | Float | Dólares (USD) | $> 0$ (derivado de $W_{50}$) | Patrimonio neto necesario para ascender un escalón patrón. |
| `total_adult_population` | Integer | Individuos | $> 10^9$ | Población adulta global considerada por los censos de riqueza (5.360 millones). |
| `total_billionaires_count` | Integer | Individuos | $> 1000$ | Número total de personas vivas con patrimonio neto $\ge \$1.000\text{ M USD}$. |

---

## 3. Variables por Estrato ($s_1$ a $s_8$)

### Resumen de los 8 Estratos Canónicos de Línea Base (Baseline v0.9)

| ID | Nombre en Español | Nombre en Inglés | Población (%) | Conteo | Riqueza Nominal ($USD) | Altura Física (m) | Rol Pedagógico |
|---|---|---|---|---|---|---|---|
| **$s_1$** | La Cúspide Extrema | The Extreme Peak | $< 0,000001\%$ | 1 persona | $737.500.000.000$ | $13.828.125\text{ m}$ ($13.828\text{ km}$) | Órbita satelital / Espacio profundo |
| **$s_2$** | Los Multimillonarios | The Billionaires | $0,000054\%$ | 2.891 personas | $1.000.000.000$ | $18.750\text{ m}$ ($18,75\text{ km}$) | Estratosfera alta |
| **$s_3$** | El 0.1% Global | The Global 0.1% | $0,1\%$ | 5,36 millones | $3.700.000$ | $69,38\text{ m}$ | Edificio de 23 pisos |
| **$s_4$** | El 1% Global | The Global 1% | $1,0\%$ | 53,6 millones | $1.000.000$ | $18,75\text{ m}$ | Edificio de 6 pisos |
| **$s_5$** | Clase Alta Global | Global Upper Class | $10\%$ | 536 millones | $293.000$ | $5,49\text{ m}$ | Jirafa adulta |
| **$s_6$** | Clase Media Global | Global Middle Class | $25\%$ | 1.340 millones | $36.000$ | $0,68\text{ m}$ ($68\text{ cm}$) | Altura de una silla / rodilla |
| **$s_7$** | La Mediana Global | The Global Median | $50\%$ | 2.680 millones | $8.910$ | $0,17\text{ m}$ ($16,7\text{ cm}$) | Un escalón estándar de escalera |
| **$s_8$** | La Base de la Pirámide | The Pyramid Base | $40,7\%$ | 2.180 millones | $1.748$ | $0,033\text{ m}$ ($3,3\text{ cm}$) | Altura de una caja de fósforos |

---

## 4. Invariantes de Dominio y Rangos Permitidos

1. **Invariante de Altura Cúspide:** Ninguna recalibración dinámica puede colapsar la altura de $s_1$ por debajo de $1.000\text{ km}$ ni proyectarla por encima de $100.000\text{ km}$ sin disparar la alerta `ABSTRACTION_LIMIT_REACHED`.
2. **Invariante de Mediana Positiva:** La mediana de riqueza global ($W_{50}$) debe ser estrictamente positiva ($W_{50} > 0$). Una mediana menor o igual a cero quiebra la metáfora del escalón y bloquea la compilación automática.
3. **Invariante de Ordenación:** $\text{Rank}(s_i) < \text{Rank}(s_{i+1}) \iff \text{Height}(s_i) > \text{Height}(s_{i+1})$.
