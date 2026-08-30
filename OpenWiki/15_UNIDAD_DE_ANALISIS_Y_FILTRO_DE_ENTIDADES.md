# 15. Unidad de Análisis y Filtro Ontológico de Entidades

## 1. Principio Fundamental: Exclusividad de Personas Naturales

La abstracción conceptual del proyecto responde exclusivamente a la pregunta:
$$\text{"¿Dónde se encuentra este individuo dentro de la distribución global de riqueza?"}$$

Queda **terminantemente prohibida** la comparación de patrimonios de personas naturales con:
- Personas jurídicas, corporaciones, empresas multinacionales.
- Fundaciones, fideicomisos o entidades institucionales.
- Estados soberanos, gobiernos, bancos centrales.
- Fondos de riqueza soberana (*Sovereign Wealth Funds*).
- Agregados macroeconómicos: Producto Interno Bruto (PIB), capitalización bursátil, presupuestos públicos, reservas monetarias.

### Fundamentación Estadística y Epistemológica
$$\text{PERSONA NATURAL} \neq \text{PERSONA JURÍDICA} \neq \text{ESTADO}$$

Mezclar o comparar directamente el patrimonio neto de una persona física con la capitalización bursátil de una empresa o el presupuesto de una nación introduce una **falacia de categoría** y un **quiebre de comparabilidad de escala**:
1. El patrimonio de un individuo financia su estándar de vida privado y consumo intergeneracional.
2. Los activos corporativos e institucionales están sujetos a derechos de acreedores, accionistas difusos y pasivos operativos.
3. Los recursos soberanos estatales pertenecen a la esfera pública colectiva.

---

## 2. Redefinición Operativa de la Riqueza Individual

| Atributo | Definición Operativa en la Abstracción |
|---|---|
| **Concepto Medido** | Patrimonio Neto Personal por Adulto (*Net Worth per Adult*). |
| **Inclusiones** | Activos financieros privados (cuentas corrientes, depósitos, acciones, bonos a título personal), activos inmobiliarios privados (vivienda), derechos de pensión privada acumulada, bienes tangibles personales. |
| **Exclusiones** | Activos corporativos no transferibles a título privado, deuda pública, gasto social estatal, capitalización de mercado de personas jurídicas. |
| **Deducciones** | Pasivos y deudas personales pendientes (hipotecas, créditos de consumo, deudas privadas). |
| **Población de Referencia** | Adultos a nivel mundial ($\approx 5.36 - 5.6$ mil millones de individuos). |
| **Unidad Monetaria** | USD nominales o USD PPP (ajustados por paridad de poder adquisitivo) según la serie metodológica activa. |

---

## 3. Algoritmo del Filtro de Entidades (EntityFilter)

Antes de incorporar cualquier entidad al modelo canónico o a la cúspide de la visualización, el sistema ejecuta:

```
                  [ ENTIDAD ENTRANTE ]
                           ↓
                   ¿Es Persona Natural?
               ┌───────────┴───────────┐
              YES                      NO
               ↓                       ↓
         [ ADMITIR ]        ¿Es Entidad Jurídica,
                             Fondo o Estado?
                         ┌─────────────┴─────────────┐
                        YES                          NO (Incierto)
                         ↓                           ↓
                   [ EXCLUIR ]                  [ WARNING + EXCLUIR ]
                         ↓                           ↓
                 GUARDRAIL BLOCK             GUARDRAIL BLOCK
```

Si una fuente intenta inyectar una entidad clasificada como `fund`, `organization` o `state`, el sistema emite inmediatamente:
$$\text{GUARDRAIL\_BLOCKED\_NON\_NATURAL\_PERSON} \to \text{ABSTRACTION\_LIMIT\_REACHED}$$
y detiene de forma autónoma el pipeline de publicación.
