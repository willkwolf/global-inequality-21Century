# Contrato de Actualización, Conservación y Auto-Mantenimiento de Datos (CT-UPD-001)

## Código Normativo: CT-UPD-001 | Versión: 2.1.0 | Estado: [VIGENTE]
### Wealth Data Protocol (WDP) — Persona Natural Exclusiva & Vibium Verified

**Propósito:** Definir las reglas ontológicas, metodológicas y técnicas que gobiernan cómo el sistema obtiene, valida, versiona, conserva y publica datos de riqueza global, de forma que la serie siga siendo comparable, auditable y pedagógicamente inteligible en un horizonte de 50–60+ años, incluso ante fallos, cambios de metodología o desaparición de fuentes individuales.

---

## 1. Principios Rectores Inmutables

1. **Unidad de Análisis Inmutable — Persona Natural Exclusiva:** La abstracción representa exclusivamente a personas naturales adultas ($\ge 20$ años). Se prohíbe taxativamente comparar o mezclar individuos con empresas, personas jurídicas, fundaciones, fondos soberanos (*Sovereign Wealth Funds*) o estados.
2. **Concepto Operativo de Riqueza:** Patrimonio neto personal individual (activos financieros + inmobiliarios personales - pasivos y deudas individuales).
3. **Nunca sobrescribir, siempre versionar:** Ningún dato crudo se borra o reemplaza; se archiva con marca de tiempo y hash criptográfico SHA-256.
4. **El dato crudo es sagrado; el dato procesado es desechable:** Los cálculos derivados (percentiles combinados, equivalencias métricas, alturas) se regeneran desde cero en cualquier momento a partir del crudo.
5. **Redundancia de fuente y filtro ontológico:** Toda fuente pasa por `EntityFilter` antes de ser admitida en el modelo canónico.
6. **Transparencia epistemológica de limitaciones:** Toda publicación expone de forma visible y estructurada el catálogo completo de limitaciones (PPP vs. Nominal, liquidez de la cúspide, subregistro offshore).
7. **Verificación dual con Vibium:** Ningún despliegue se publica sin superar la suite de verificación automatizada en Mobile First (390px) y Desktop (1920px).

---

## 2. Registro de Fuentes Primarias y Filtro Ontológico

| Fuente | Tipo | Cobertura | Frecuencia | Nivel de Confianza (60 años) | Filtro Ontológico | Riesgo Principal | Fuente Sustituta |
|---|---|---|---|---|---|---|---|
| **UBS Global Wealth Report** | Banco / Estudio | 56 mercados, ~92% riqueza global | Anual | **Medio-Alto** | Aislar percentiles de adultos naturales | Discontinuación o cambio de cálculo | WID.world / Encuestas Fed/BCE |
| **Forbes Real-Time** | Medio financiero | Cúspide de milmillonarios | Tiempo real | **Medio** | Rechaza corporaciones y fondos soberanos | Volatilidad bursátil | Bloomberg Billionaires Index |
| **WID.world** | Consorcio académico | Deciles y percentiles detallados | Continua | **Alto** | Filtrar tablas de *adult individuals* | Dependencia financiera académica | Snapshots locales e IPFS |

---

## 3. Catálogo Canónico de Limitaciones (Metadata Disclosure)

Todo dataset compilado debe incluir explícitamente las siguientes 8 limitaciones en su bloque `limitations`:
1. `VALUATION_BASIS`: Patrimonio neto = activos reales y financieros privados menos pasivos.
2. `INDIVIDUAL_SCOPE`: Exclusividad ontológica de personas naturales adultas.
3. `VOLATILITY_AND_ILLIQUIDITY`: La cúspide refleja valoración de participaciones corporativas no líquidas de inmediato.
4. `CURRENCY_AND_PPP`: Denominador común en USD nominales; el poder adquisitivo real (PPP) varía por región.
5. `STEP_EQUIVALENCE`: Escala fijada en $1\text{ escalón (15 cm)} \approx \$8.000\text{ USD}$, aproximando la mediana empírica ($16,7\text{ cm}$).
6. `OFFSHORE_AND_INFORMAL`: Subregistro en paraísos fiscales y activos informales.
7. `STOCK_VS_FLOW`: Mide riqueza acumulada (stock), no flujo de ingresos anuales.
8. `LINEAR_SCALE`: Escala vertical estrictamente lineal (Lie Factor = 1.0) sin compresión logarítmica.

---

## 4. Pipeline de Publicación y Despliegue en GitHub Pages

1. **Compilación Determinista:** `node OpenWiki/scripts/apply-data.js` genera `Escala-visual-de-riqueza-mundial.html` inyectando datos canónicos y diccionarios i18n.
2. **Verificación Vibium:** Ejecución de pruebas de regresión visual y funcional en Mobile y Desktop.
3. **Pipeline CI/CD:** GitHub Actions compila y despliega en producción únicamente tras superar el 100% de los tests.
