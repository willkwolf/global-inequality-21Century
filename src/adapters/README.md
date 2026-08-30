# src/adapters — Adaptadores de Fuentes Primarias (Fases 5 y 6)

## Propósito
Este módulo contendrá los adaptadores especializados para la ingesta y normalización de fuentes primarias heterogéneas:

1. **`ubs-adapter.js`:** Ingesta y parseo del *UBS Global Wealth Report*.
2. **`forbes-adapter.js`:** Ingesta en tiempo real de *Forbes Real-Time Billionaires*.
3. **`wid-adapter.js`:** Adaptador para *World Inequality Database* (WID).
4. **`worldbank-adapter.js`:** Adaptador para indicadores del Banco Mundial.

Todos los adaptadores transforman datos crudos heterogéneos en el **Modelo Canónico Unificado** (`CanonicalDataModel`), validando la condición ontológica de **Persona Natural**.
