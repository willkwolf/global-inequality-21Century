# 08. Pipeline CI/CD en GitHub Actions

## 1. Arquitectura del Pipeline Autoactualizable

El pipeline automatizado en GitHub Actions (`.github/workflows/auto-update-pipeline.yml`) implementa 14 etapas secuenciales con compuertas de detención (*Quality Gates*):

```
1. FETCH SOURCE
   └── Descarga payloads crudos de WID, UBS, Forbes, Banco Mundial.
2. VERIFY SOURCE
   └── Comprobación de firmas SHA-256 e inmutabilidad.
3. VALIDATE DATA
   └── Validación estricta contra Canonical Data Schema.
4. DETECT DRIFT
   └── Ejecución del Drift Engine sobre snapshots.
5. CLASSIFY DRIFT
   └── Categorización en los 5 ejes ontológicos.
6. AI ADAPTATION (Gemini)
   └── Adaptación semántica de narrativa y copy con secreto GEMINI_API_KEY.
7. GENERATE SPEC
   └── Recalibración dinámica de escalas y contrato de abstracción.
8. RUN TESTS
   └── Ejecución de pruebas unitarias, Property-Based Tests (PBT) y 3 Escenarios.
9. VISUAL VALIDATION
   └── Análisis del DOM compilado con JSDOM.
10. ACCESSIBILITY TEST
   └── Verificación de contrastes, atributos ARIA y navegación por teclado.
11. CONTENT VALIDATION
   └── Validación de integridad bilingüe (ES/EN) y ausencia de cadenas corruptas.
12. BUILD
   └── Compilación del archivo único portable `Escala-visual-de-riqueza-mundial.html`.
13. PREVIEW & PUBLISH
   └── Despliegue seguro a GitHub Pages.
14. DOCUMENT CHANGE IN OPENWIKI
   └── Registro append-only en el Change Log Ledger y commit de gobernanza.
```

---

## 2. Compuertas de Detención (Quality Gates)

El pipeline cancela automáticamente la publicación si:
- El schema canónico es inválido.
- La fuente es inaccesible o tiene hash corrupto.
- Se produce quiebre epistemológico (`ADAPTATION_FAILED`).
- Falla cualquier prueba de la suite (`exit code != 0`).
- Se detectan valores corruptos (`NaN`, `undefined`) en el HTML renderizado.
- Se vulnera algún principio de accesibilidad o monotonicidad de alturas.
