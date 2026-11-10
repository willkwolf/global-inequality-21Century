# Contrato de Gobernanza Técnica y Publicación (CT-TECH-001)

## Código Normativo: CT-TECH-001 | Versión: 1.0.0 | Estado: [VIGENTE]

---

## 1. Propósito y Alcance
Este contrato norma la arquitectura de software, el proceso de compilación estática, el pipeline de integración continua (CI/CD), la gestión de ramas en Git, la política de despliegue a producción y la reproducibilidad técnica a largo plazo.

Aplica a la raíz del repositorio, los workflows de `.github/workflows/`, las herramientas en `OpenWiki/scripts/` y el artefacto de despliegue en GitHub Pages.

---

## 2. Principios y Reglas Obligatorias

1. **Principio Zero-Build en Producción [VIGENTE]:** El código desplegado para el usuario final no debe requerir compilación ni empaquetadores (webpack, vite) en tiempo de ejecución. Los navegadores deben interpretar el código directamente.
2. **Principio de Rutas Relativas Universales [VIGENTE]:** Todos los enlaces a scripts, estilos, recursos y documentación deben emplear rutas relativas (`./styles.css`, `../docs/`), prohibiendo el uso de barras absolutas (`/`) que rompan en subrutas de GitHub Pages.
3. **Principio de Puerta Bloqueante en CI/CD [VIGENTE]:** Ningún cambio puede fusionarse a la rama principal (`master` / `main`) ni desplegarse a producción si una sola prueba en `npm test` falla.
4. **Principio de Inmutabilidad del Historial Git [VIGENTE]:** Queda terminantemente prohibido realizar `git push --force` sobre ramas públicas compartidas sin autorización expresa del Custodio de Arquitectura.
5. **Principio de Higiene del Repositorio [VIGENTE]:** Prohibición de rastrear directorios de configuración de agentes externos (`.gitclaude`, `.claude`, `.kiro`) en el control de versiones. Dichos patrones deben permanecer aislados en `.git/info/exclude`.

---

## 3. Responsabilidades y Límites de Actuación

* **Custodio de Arquitectura (Humano):** Administra los permisos de despliegue en GitHub Pages, los secretos de CI/CD y las políticas de ramas.
* **Agente de IA / CI Runner:** Ejecuta pruebas automatizadas, compila plantillas estáticas y valida esquemas. Tiene **prohibido**:
  - Mutar la configuración del pipeline para eludir pruebas fallidas.
  - Publicar en producción sin pasar previamente por el arnés completo de pruebas deterministas.

---

## 4. Criterios Verificables de Cumplimiento

1. Ejecución limpia y determinista de `npm test` con código de salida `0`.
2. Archivo `index.html` redirigiendo correctamente a `Escala-visual-de-riqueza-mundial.html` mediante `<meta http-equiv="refresh">` y `<link rel="canonical">`.
3. Ausencia absoluta de dependencias vulnerables con severidad alta o crítica (`npm audit`).
4. Archivo `_config.yml` configurado para excluir directorios internos de la compilación de Jekyll en GitHub Pages.

---

## 5. Evidencias que Deben Inspeccionarse

* Workflows en `.github/workflows/validate-spec.yml` y `deploy.yml`.
* Configuración de Jekyll en `_config.yml`.
* Scripts en `package.json`.
* Trazas de ejecución de pruebas en consola.

---

## 6. Procedimientos de Validación

```bash
# 1. Validación de tipos y contratos estáticos
npm run validate-spec

# 2. Verificación de pruebas unitarias y DOM
npm run test:unit

# 3. Verificación de escenarios de drift y simulaciones Vibium
npm run test:scenarios
npm run test:vibium

# 4. Verificación de preservación y robustez sintética
npm run test:robustness
```

---

## 7. Gestión de Desviaciones y Excepciones

* Cualquier fallo en el runner de CI cancela de inmediato el job de despliegue.
* Si un cambio técnico es indispensable pero tensiona un contrato existente, debe redactarse una propuesta de excepción técnica en `OpenWiki/11_ARCHITECTURAL_WARNINGS.md`.

---

## 8. Relaciones con Otros Contratos

* **CT-DATA-001 (Datos):** Regula los archivos que el compilador estático inyecta en el HTML.
* **CT-VIS-001 (Visual):** Garantiza que los cambios de código no degraden los estándares WCAG.
* **POL-ED-001 (Policy Editorial):** Rige el Vector 7 (Durabilidad, Modularidad y Prevención de Obsolescencia).

---

## 9. Versionado y Mantenimiento

* **Versión Actual:** 1.0.0
* **Fecha de Entrada en Vigor:** 2026-11-09
* **Frecuencia de Revisión:** Con cada actualización de dependencias de Node.js o GitHub Actions.
