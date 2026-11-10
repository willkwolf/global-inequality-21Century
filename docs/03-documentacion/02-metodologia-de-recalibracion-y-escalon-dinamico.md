# Metodología de Recalibración Dinámica y el Escalón Patrón

## 1. El Reto de la Evolución Económica Global

Si en un reporte futuro de riqueza la mediana global se duplica (ej. de $8.910 USD a $17.820 USD) debido al crecimiento económico o la inflación:
- Un sistema estático mantendría la regla fija de "$8.000 = 15 cm", lo que provocaría que la persona con riqueza mediana alcanzara una altura de 30 cm (dos escalones), destruyendo el valor pedagógico del anclaje mediano.
- El módulo `ScaleRecalibrator` (`src/agent/scale-recalibrator.js`) resuelve este problema mediante recalibración paramétrica automática.

---

## 2. Ecuaciones del Algoritmo de Recalibración

```mermaid
graph TD
    A["Nueva Mediana Global (W_50)"] --> B["Verificación de Guardrails: W_50 > 0?"]
    B -->|Sí| C["Cálculo del Nuevo Escalón Patrón:<br>W_ref = RoundToSensibleUnit(W_50)"]
    B -->|No (W_50 ≤ 0)| D["Freno de Emergencia:<br>ABSTRACTION_LIMIT_REACHED"]
    C --> E["Recálculo Homotético de Alturas para cada Estrato s_i:<br>H_i = (W_i / W_ref) × 0.15 m"]
    E --> F["Actualización de Comparaciones Humanas en Micro-Copy"]
```

### 2.1. Redondeo a Magnitud Sensible
Para preservar la facilidad de cálculo mental en el usuario, el valor económico del escalón ($W_{\text{ref}}$) no se fija como un número con decimales caóticos (ej. $\$8.912,43$), sino que se redondea al millar más cercano:

$$W_{\text{ref}} = \operatorname{round}\left(\frac{W_{50}}{1000}\right) \times 1000$$

Si $W_{50} = \$8.910 \implies W_{\text{ref}} = \$9.000\text{ USD}$ (o $\$8.000\text{ USD}$ en línea base pedagógica).

### 2.2. Proyección de la Cúspide
La altura de la cúspide ($H_{\text{top}}$) se recalcula directamente a partir del nuevo patrimonio del individuo más rico del planeta ($W_{\text{top}}$):

$$H_{\text{top}} = \frac{W_{\text{top}}}{W_{\text{ref}}} \times 0,15\text{ m}$$

Con $W_{\text{top}} = \$737.500\text{M}$ y $W_{\text{ref}} = \$8.000$:
$$H_{\text{top}} = \frac{737.500.000.000}{8.000} \times 0,15 = 13.828.125\text{ m} \approx 13.828\text{ km}$$

---

## 3. Pruebas de Estrés Macroeconómico

La metodología fue sometida a una suite de estrés extremo (`tests/calibration-stress-test.mjs`) a través de 10 regímenes macroeconómicos radicales:
1. **Hiperinflación Global:** Mediana sube a $100.000 USD $\to$ El escalón se calibra a $100.000 USD; alturas relativas se preservan.
2. **Deflación Severa:** Mediana cae a $1.000 USD $\to$ El escalón se calibra a $1.000 USD; el orden se preserva.
3. **Sociedad Ultra-Igualitaria (Gini $\approx 0.1$):** Cúspide baja a $50.000 USD $\to$ Altura máxima cae a escala terrenal ($0.75\text{ m}$); el sistema emite aviso de colapso de metáfora espacial.
4. **Feudalismo Digital:** Cúspide en $5 billones USD $\to$ Altura sube a $93.000\text{ km}$; se preserva el isomorfismo.
5. **Mediana Negativa:** Deuda masiva $\to$ Activación de guardrail y detención de publicación.
