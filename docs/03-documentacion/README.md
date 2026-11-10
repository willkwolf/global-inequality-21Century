# Dominio III: Documentación Técnica, Metodología y Arquitectura

## Propósito y Alcance del Dominio
Este dominio documenta los componentes de ingeniería, la metodología de recalibración, los motores algorítmicos, el arnés de pruebas y el roadmap evolutivo del sistema **¿A qué altura vives?**.

Provee especificaciones reproducibles para que desarrolladores humanos y agentes autónomos comprendan, mantengan y extiendan el código sin introducir regresiones ni distorsiones conceptuales.

---

## Estructura Documental del Dominio

| Documento | Área Técnica | Contenido Clave |
|---|---|---|
| [`01-arquitectura-tecnica-y-zero-build.md`](./01-arquitectura-tecnica-y-zero-build.md) | Arquitectura de Software | Principio Zero-Build, desacoplamiento del DOM, modularidad en `src/` y pipelines deterministas. |
| [`02-metodologia-de-recalibracion-y-escalon-dinamico.md`](./02-metodologia-de-recalibracion-y-escalon-dinamico.md) | Algoritmos y Matemáticas | Algoritmo de calibración dinámica del escalón ante cambios en la mediana empírica ($W_{50}$). |
| [`03-motor-de-drift-y-clasificacion-de-escenarios.md`](./03-motor-de-drift-y-clasificacion-de-escenarios.md) | Resiliencia y Detección | Detección de Data Drift, Methodological Drift, Semantic Drift y Chaotic Drift (`src/drift/`). |
| [`04-arquitectura-agente-y-automatizacion.md`](./04-arquitectura-agente-y-automatizacion.md) | Automatización e IA | Módulos `ai-adapter.js`, `gemini-client.js`, `scale-recalibrator.js` y salvaguardas operativas. |
| [`05-infraestructura-de-pruebas-y-verificacion.md`](./05-infraestructura-de-pruebas-y-verificacion.md) | Calidad y QA | Suite unitaria, Three Scenarios, Vibium Suite dual (mobile/desktop), Synthetic Robustness (25 iteraciones) y PBT. |
| [`06-invariantes-temporales-e-internacionalizacion.md`](./06-invariantes-temporales-e-internacionalizacion.md) | i18n y Runtime | Invariante de año dinámico (`target_year`), desacoplamiento moneda/locale y formateo centralizado. |
| [`07-roadmap-y-automatizacion-progresiva-dao.md`](./07-roadmap-y-automatizacion-progresiva-dao.md) | Estrategia Evolutiva | Las 7 fases del roadmap: desde Línea Base Certificada (Fase 0) hasta Operación Descentralizada DAO (Fase 7). |
| [`08-historial-y-registro-inmutable-de-cambios.md`](./08-historial-y-registro-inmutable-de-cambios.md) | Auditoría de Cambios | Registro inmutable (*Change Log Ledger*) de versiones, fechas, autores y hashes criptográficos. |
| [`09-registro-de-advertencias-arquitectonicas.md`](./09-registro-de-advertencias-arquitectonicas.md) | Telemetría de Guardrails | Registro de advertencias arquitectónicas disparadas ante estrés o datos anómalos. |
| [`historial/`](./historial/) | Archivo Histórico | Documentación de especificaciones previas preservadas para trazabilidad arqueológica. |
