# 13. Marco de Verificación Vibium (Vibium Verification Framework)

Vibium constituye la **capa transversal de verificación visual, funcional y agentic** del sistema de desigualdad global.

```
DATA
 ↓
ABSTRACTION CONTRACT
 ↓
APPLICATION MODEL
 ↓
BUILD (HTML COMPILER)
 ↓
LOCAL SERVER (http://127.0.0.1:8088)
 ↓
VIBIUM VERIFICATION ENGINE
 ↓
VISUAL / FUNCTIONAL / ACCESSIBILITY / COGNITIVE VALIDATION
 ↓
DECISION ENGINE (PASS / PASS_WITH_ADAPTATION / WARNING / BLOCK / ABSTRACTION_LIMIT_REACHED)
 ↓
DETERMINISTIC RECORDING (artifacts/vibium/scenario-N/final-recording.zip)
 ↓
PUBLISH TO GITHUB PAGES
```

---

## 1. Principio de Separación de Autoridad
Vibium **NO** es el dueño de la arquitectura ni de los datos. La autoridad conceptual continúa residiendo en:
$$\text{DATOS} + \text{METODOLOGÍA} + \text{CONTRATO DE ABSTRACCIÓN} + \text{OPENWIKI}$$

Vibium verifica que la **implementación publicada respete esos contratos en el producto real renderizado**.

---

## 2. Instalación y Estandarización
- **Instalación Global:**
  ```bash
  npm install -g vibium
  ```
- **Instalación del Skill:**
  ```bash
  npx skills add https://github.com/VibiumDev/vibium --skill vibe-check
  ```
- **Instalación Local en el Repositorio:**
  ```bash
  npm install --save-dev vibium
  ```
- **Versión Estandarizada:** `vibium@26.8.21` (registrada en `package.json` para reproducibilidad estricta en CI/CD).

---

## 3. Taxonomía de Decisiones Autónomas de Vibium

| Decisión | Criterio | Acción en Pipeline |
|---|---|---|
| `PASS` | El sitio renderizado cumple 100% los contratos sin variaciones de escala ni drift. | Publicación automática permitida. |
| `PASS_WITH_ADAPTATION` | La interfaz cambió (escala, estratos, copy), pero el cambio está justificado por el drift de datos. | Publicación automática + registro en ledger. |
| `WARNING` | Existe un riesgo no bloqueante (ej. ratio elevado de desigualdad) pero la metáfora es sólida. | Publicación + alerta en OpenWiki. |
| `BLOCK` | Fallo de render, elementos superpuestos, incongruencia semántica o alucinación. | **Publicación detenida**. Reintento automático o preservación de evidencia. |
| `ABSTRACTION_LIMIT_REACHED` | El dataset desafía los límites físicos, visuales o epistemológicos (ej. varianza nula o deuda infinita). | **Publicación detenida permanentemente**. Requiere revisión humana. |

---

## 4. Reintentos y Resiliencia Autónoma
Si Vibium detecta un error de maquetación o sincronización recuperable:
$$\text{DETECT} \to \text{CLASSIFY} \to \text{FIX} \to \text{BUILD} \to \text{RETEST}$$
El motor ejecuta un máximo de **2 reintentos**. Si el fallo persiste, emite `BLOCK` y preserva el archivo `final-recording.zip` para auditoría.
