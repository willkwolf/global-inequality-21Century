# Invariantes Temporales, Año Dinámico e Internacionalización Numérica

## 1. El Invariante del Año Dinámico (`target_year`)

Muchos artefactos interactivos envejecen prematuramente porque contienen años hardcodeados en el código o en los textos (ej. *"En este año 2024..."* o *"Datos a 2025"*). Al llegar el año 2026 o 2027, el lector percibe que el sitio está abandonado.

El sistema implementa el **invariante de año dinámico**:

$$\text{target\_year} = \text{new Date().getFullYear()}$$

### Reglas de Aplicación:
1. **Fecha de la Fuente (`source_date`):** Refleja la fecha histórica inmutable de corte del reporte (ej. `2024-12-31`).
2. **Fecha de Presentación (`target_year`):** Refleja el año del lector en tiempo de ejecución.
3. **Badges Temporales:** Se muestra claramente la distinción:
   - *"Datos base: 2024 (UBS)"*
   - *"Contexto de lectura: 2026"*

---

## 2. Internacionalización Numérica: `CURRENCY ≠ LOCALE`

Un error frecuente en proyectos bilingües es asumir que la moneda determina el formato de puntuación (ej. creer que el dólar estadounidense siempre se escribe con coma para miles y punto para decimales).

En estándares internacionales (CLDR / Unicode):
- **Moneda (`currency`):** Es la unidad económica (USD).
- **Configuración Regional (`locale`):** Es la convención lingüística del lector (`es` o `en`).

### Matriz de Transformación Centralizada (`NumberFormatter`)

| Magnitud Numérica | Modo Nominal (ES) | Modo Nominal (EN) | Modo Valor Presente (ES) | Modo Valor Presente (EN) |
|---|---|---|---|---|
| Mediana ($8.910) | `$8.910 USD` | `$8,910 USD` | `$9.391 USD*` | `$9,391 USD*` |
| Umbral 1% ($1M) | `$1.000.000 USD` | `$1,000,000 USD` | `$1.054.000 USD*` | `$1,054,000 USD*` |
| Cúspide ($737.5B) | `$737.500M USD` | `$737.5B USD` | `$777.325M USD*` | `$777.325B USD*` |
| Altura Cúspide ($13.828\text{ km}$) | `13.828 km` | `13,828 km` | `13.828 km` | `13,828 km` |

Todos los formateos pasan por el módulo único `src/i18n/number-formatter.js`, prohibiendo el uso de expresiones regulares manuales o concatenaciones caseras.
