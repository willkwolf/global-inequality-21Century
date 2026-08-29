# 05. Arquitectura del Agente de IA (Gemini)

## 1. Misión y Responsabilidad del Agente

El agente de IA no tiene libertad irrestricta para "inventar o rediseñar lo que quiera". Su función está estrictamente delimitada:

$$\text{SOURCE} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{VALIDATE} \longrightarrow \text{MAP} \longrightarrow \text{ADAPT} \longrightarrow \text{GENERATE} \longrightarrow \text{TEST}$$

### Qué PUEDE modificar dinámicamente:
- Parámetros de escala y factores de conversión física.
- Altura en metros/kilómetros/centímetros de cada estrato.
- Umbrales y límites de los percentiles.
- Copy bilingüe (titulares, subtítulos, captions, fichas técnicas, ARIA).
- Analogías y referencias físicas (satélite, cohete, edificio, escalera, casa, silla, escalón, roca).
- Cantidad de estratos (de $N=3$ a $N=12$).
- Identificadores de entidades (personas, fondos, organizaciones).

### Qué DEBE preservar incondicionalmente:
- La esencia de la abstracción (altura física como metáfora de desigualdad).
- La progresión pedagógica: Base $\to$ Escala $\to$ Contraste $\to$ Contexto $\to$ Extremo.
- La separación estricta entre datos y presentación.
- Cero alucinaciones: todo número debe derivar directamente del dataset canónico.
- Accesibilidad universal (WCAG 2.1 AAA: soporte de lectores de pantalla, alto contraste, fuente disléxica).
- Trazabilidad y gobernanza en OpenWiki.

---

## 2. Configuración Segura de Credenciales y Principio de Privilegios Mínimos

### Reglas de Seguridad de la API Key de Gemini:
1. **Configuración Exclusiva en GitHub Actions Secrets**: La clave se almacena bajo el secreto `GEMINI_API_KEY`.
2. **Cero Exposición**: Prohibida su inclusión en código fuente, commits, logs de consola, artefactos, respuestas JSON de cara al cliente, HTML o GitHub Pages.
3. **Lectura por Variable de Entorno**: El cliente Node.js lee exclusivamente `process.env.GEMINI_API_KEY`.
4. **Motor Determinista de Respaldo**: Si no hay clave configurada o falla la red externa, el agente conmuta de forma transparente al motor determinista integrado, garantizando que los tests locales y el pipeline CI/CD nunca fallen por falta de red.

---

## 3. Estructura de Prompts e Inferencia Estructurada

El agente opera con `temperature = 0.0` y modo `responseMimeType: "application/json"` para garantizar determinismo, consistencia gramatical bilingüe y adherencia estricta al esquema del contrato de abstracción.
