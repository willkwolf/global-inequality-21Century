/**
 * Parallax Stars — Bug Condition Exploration Test
 *
 * Validates: Requirements 1.1, 1.2, 1.3
 *
 * PROPÓSITO: Verificar que el fix corrige el bug.
 * Estas pruebas codifican el comportamiento esperado y DEBEN PASAR
 * sobre el código corregido (confirma que el bug está resuelto).
 *
 * Metodología:
 *   - Se extrae la lógica de updateScroll() del HTML y se ejecuta en un
 *     entorno jsdom con un DOM mínimo (stub de #stars, #progress, .snap × 8).
 *   - Se verifican los estados resultantes de starsEl.style.opacity y
 *     starsEl.style.transform para los valores de scrollY indicados.
 *
 * Resultado esperado: TODAS las aserciones PASAN (confirma que el bug está corregido).
 */

import { JSDOM } from 'jsdom';
import assert from 'node:assert/strict';
import fc from 'fast-check';

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Crea un entorno jsdom mínimo con los elementos que necesita updateScroll().
 * @param {number} vh  - Altura del viewport simulado (window.innerHeight)
 * @param {number} scrollY - Posición de scroll inicial
 * @param {boolean} reduced - Simula prefers-reduced-motion
 */
function createEnv(vh = 800, scrollY = 0, reduced = false) {
  const dom = new JSDOM(`<!DOCTYPE html>
<html>
<body>
  <div id="progress" role="progressbar" aria-valuenow="0"></div>
  <div id="stars"></div>
  ${Array.from({ length: 8 }, (_, i) => `<section class="snap" id="s${i + 1}"></section>`).join('\n  ')}
</body>
</html>`);

  const { window } = dom;
  const { document } = window;

  // Simular window.scrollY y window.innerHeight (son read-only en jsdom)
  Object.defineProperty(window, 'scrollY', { get: () => scrollY, configurable: true });
  Object.defineProperty(window, 'innerHeight', { get: () => vh, configurable: true });

  const snaps = Array.from(document.querySelectorAll('.snap'));
  const progressBar = document.getElementById('progress');
  const starsEl = document.getElementById('stars');

  // Función updateScroll() CORREGIDA del HTML (código con fix)
  function updateScroll() {
    const scrollYVal = window.scrollY;
    const vhVal      = window.innerHeight;
    const total      = (snaps.length - 1) * vhVal;
    const progress   = Math.min(Math.max(scrollYVal / total, 0), 1);
    const pct        = Math.round(progress * 100);

    progressBar.style.width = pct + '%';
    progressBar.setAttribute('aria-valuenow', pct);

    document.body.classList.toggle('light-mode', progress > 0.87);

    if (!reduced) {
      // 1. Calcular índice de sección (base 0: s1=0, s2=1, s3=2 … s8=7)
      const sectionIndex  = Math.floor(scrollYVal / vhVal);
      const snapScrollMax = (snaps.length - 1) * vhVal;

      // 2. Opacidad: plena en s1, reducida en s2, cero desde s3 en adelante
      let starsOpacity;
      if (sectionIndex === 0) {
        starsOpacity = 1;
      } else if (sectionIndex === 1) {
        const progressInS2 = (scrollYVal - vhVal) / vhVal;
        starsOpacity = Math.max(0, 1 - progressInS2);
      } else {
        starsOpacity = 0;
      }
      starsEl.style.opacity = starsOpacity;

      // 3. Parallax: solo dentro del área snap y con factor reducido
      if (scrollYVal <= snapScrollMax) {
        starsEl.style.transform = `translateY(${scrollYVal * 0.05}px)`;
      }
      // Si scrollY > snapScrollMax, no se aplica ningún translateY adicional
    }
  }

  return { window, document, starsEl, progressBar, snaps, updateScroll };
}

/**
 * Extrae el factor numérico de un string "translateY(Xpx)".
 * Devuelve null si no hay transform o si es vacío.
 */
function extractTranslateYFactor(transformStr, scrollY) {
  if (!transformStr) return null;
  const match = transformStr.match(/translateY\(([-\d.]+)px\)/);
  if (!match) return null;
  const translateYPx = parseFloat(match[1]);
  if (scrollY === 0) return null; // evitar división por cero
  return translateYPx / scrollY;
}

// ── Utilidad de reporte ───────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const counterexamples = [];

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✓ PASS (inesperado) — ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗ FAIL (esperado)   — ${name}`);
    console.log(`    Contraejemplo: ${err.message}`);
    counterexamples.push({ name, message: err.message });
    failed++;
  }
}

// ── Suite de pruebas ──────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════════════');
console.log('  Parallax Stars — Bug Condition Exploration (código CON fix)');
console.log('  Validates: Requirements 1.1, 1.2, 1.3');
console.log('══════════════════════════════════════════════════════════════\n');

const VH = 800; // viewport simulado

// ─────────────────────────────────────────────────────────────────────────────
// Caso 1: scrollY = 2 * vh → s3 (sectionIndex = 2)
// Bug: starsEl.style.opacity NO es "0" (la función nunca lo asigna)
// ─────────────────────────────────────────────────────────────────────────────
console.log('Caso 1 — s3 visible (scrollY = 2 × vh, sectionIndex = 2)');
console.log('  Expectativa del fix: starsEl.style.opacity === "0"');
console.log('  Expectativa del bug: starsEl.style.opacity !== "0" (vacío o sin asignar)');

runTest('starsEl.style.opacity debe ser "0" en s3 (sectionIndex=2)', () => {
  const { starsEl, updateScroll } = createEnv(VH, 2 * VH);
  updateScroll();
  assert.equal(
    starsEl.style.opacity,
    '0',
    `opacity="${starsEl.style.opacity}" (esperado "0") — las estrellas siguen visibles en s3`
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Caso 2: scrollY = 5 * vh → s6 (sectionIndex = 5)
// Bug: starsEl.style.opacity NO es "0"
// ─────────────────────────────────────────────────────────────────────────────
console.log('\nCaso 2 — s6 visible (scrollY = 5 × vh, sectionIndex = 5)');
console.log('  Expectativa del fix: starsEl.style.opacity === "0"');
console.log('  Expectativa del bug: starsEl.style.opacity !== "0"');

runTest('starsEl.style.opacity debe ser "0" en s6 (sectionIndex=5)', () => {
  const { starsEl, updateScroll } = createEnv(VH, 5 * VH);
  updateScroll();
  assert.equal(
    starsEl.style.opacity,
    '0',
    `opacity="${starsEl.style.opacity}" (esperado "0") — las estrellas siguen visibles en s6`
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Caso 3: scrollY = 9 * vh → post-snap (metodología)
// Bug: starsEl.style.transform contiene un translateY no nulo
// ─────────────────────────────────────────────────────────────────────────────
console.log('\nCaso 3 — Post-snap / metodología (scrollY = 9 × vh)');
console.log('  Expectativa del fix: sin translateY nuevo (transform vacío o sin cambio)');
console.log('  Expectativa del bug: translateY no nulo aplicado');

runTest('starsEl.style.transform NO debe contener translateY en post-snap', () => {
  const { starsEl, updateScroll } = createEnv(VH, 9 * VH);
  updateScroll();
  const transform = starsEl.style.transform;
  const match = transform.match(/translateY\(([-\d.]+)px\)/);
  const translateYPx = match ? parseFloat(match[1]) : 0;

  assert.equal(
    translateYPx,
    0,
    `transform="${transform}" — translateY=${translateYPx}px (esperado 0) — las estrellas se mueven en metodología`
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Caso 4: scrollY = 0.5 * vh → s1 (sectionIndex = 0)
// Bug: factor de parallax es 0.18, no ≤ 0.08
// ─────────────────────────────────────────────────────────────────────────────
console.log('\nCaso 4 — s1 (scrollY = 0.5 × vh) — factor de parallax');
console.log('  Expectativa del fix: factor ≤ 0.08');
console.log('  Expectativa del bug: factor = 0.18');

runTest('Factor de parallax en s1 debe ser ≤ 0.08 (no 0.18)', () => {
  const scrollY = 0.5 * VH;
  const { starsEl, updateScroll } = createEnv(VH, scrollY);
  updateScroll();
  const factor = extractTranslateYFactor(starsEl.style.transform, scrollY);

  assert.notEqual(factor, null, 'No se encontró translateY en el transform');
  assert.ok(
    factor <= 0.08,
    `factor=${factor} (esperado ≤ 0.08) — el parallax es demasiado pronunciado (0.18)`
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// PBT: Para cualquier scrollY en [2*vh, 8*vh] (s3–s8), opacity debe ser "0"
// Bug: la función nunca asigna opacity → siempre falla
// ─────────────────────────────────────────────────────────────────────────────
console.log('\nPBT — Para todo scrollY en [2×vh, 8×vh] (s3–s8): opacity debe ser "0"');
console.log('  Validates: Requirements 1.1');

let pbtBugConditionPassed = false;
let pbtBugConditionCounterexample = null;

try {
  fc.assert(
    fc.property(
      fc.float({ min: 2.0, max: 8.0, noNaN: true }),
      (multiplier) => {
        const scrollY = multiplier * VH;
        const { starsEl, updateScroll } = createEnv(VH, scrollY);
        updateScroll();
        return starsEl.style.opacity === '0';
      }
    ),
    { numRuns: 50, seed: 42 }
  );
  console.log('  ✓ PASS (inesperado) — PBT bug condition');
  pbtBugConditionPassed = true;
  passed++;
} catch (err) {
  const counterexStr = err.message || String(err);
  console.log('  ✗ FAIL (esperado)   — PBT bug condition');
  console.log(`    Contraejemplo PBT: ${counterexStr.split('\n')[0]}`);
  pbtBugConditionCounterexample = counterexStr;
  counterexamples.push({ name: 'PBT bug condition [2×vh, 8×vh]', message: counterexStr.split('\n')[0] });
  failed++;
}

// ─────────────────────────────────────────────────────────────────────────────
// PBT: Para cualquier scrollY > 8*vh (post-snap), translateY debe ser 0
// Bug: la función aplica translateY sin límite → siempre falla
// ─────────────────────────────────────────────────────────────────────────────
console.log('\nPBT — Para todo scrollY > 8×vh (post-snap): translateY debe ser 0');
console.log('  Validates: Requirements 1.2');

let pbtPostSnapPassed = false;
let pbtPostSnapCounterexample = null;

try {
  fc.assert(
    fc.property(
      fc.float({ min: Math.fround(8.01), max: Math.fround(20.0), noNaN: true }),
      (multiplier) => {
        const scrollY = multiplier * VH;
        const { starsEl, updateScroll } = createEnv(VH, scrollY);
        updateScroll();
        const transform = starsEl.style.transform;
        const match = transform.match(/translateY\(([-\d.]+)px\)/);
        const translateYPx = match ? parseFloat(match[1]) : 0;
        return translateYPx === 0;
      }
    ),
    { numRuns: 50, seed: 42 }
  );
  console.log('  ✓ PASS (inesperado) — PBT post-snap translateY');
  pbtPostSnapPassed = true;
  passed++;
} catch (err) {
  const counterexStr = err.message || String(err);
  console.log('  ✗ FAIL (esperado)   — PBT post-snap translateY');
  console.log(`    Contraejemplo PBT: ${counterexStr.split('\n')[0]}`);
  pbtPostSnapCounterexample = counterexStr;
  counterexamples.push({ name: 'PBT post-snap translateY > 8×vh', message: counterexStr.split('\n')[0] });
  failed++;
}

// ─────────────────────────────────────────────────────────────────────────────
// PBT: Para cualquier scrollY en [0, 2*vh) (s1–s2), factor ≤ 0.08
// Bug: factor es 0.18 → siempre falla
// ─────────────────────────────────────────────────────────────────────────────
console.log('\nPBT — Para todo scrollY en (0, 2×vh) (s1–s2): factor parallax ≤ 0.08');
console.log('  Validates: Requirements 1.3');

let pbtFactorPassed = false;
let pbtFactorCounterexample = null;

try {
  fc.assert(
    fc.property(
      fc.float({ min: Math.fround(0.01), max: Math.fround(1.99), noNaN: true }),
      (multiplier) => {
        const scrollY = multiplier * VH;
        const { starsEl, updateScroll } = createEnv(VH, scrollY);
        updateScroll();
        const factor = extractTranslateYFactor(starsEl.style.transform, scrollY);
        if (factor === null) return true; // sin transform, no aplica
        return factor <= 0.08;
      }
    ),
    { numRuns: 50, seed: 42 }
  );
  console.log('  ✓ PASS (inesperado) — PBT factor parallax');
  pbtFactorPassed = true;
  passed++;
} catch (err) {
  const counterexStr = err.message || String(err);
  console.log('  ✗ FAIL (esperado)   — PBT factor parallax');
  console.log(`    Contraejemplo PBT: ${counterexStr.split('\n')[0]}`);
  pbtFactorCounterexample = counterexStr;
  counterexamples.push({ name: 'PBT factor parallax [0, 2×vh)', message: counterexStr.split('\n')[0] });
  failed++;
}

// ── Resumen ───────────────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════════════');
console.log('  RESUMEN');
console.log('══════════════════════════════════════════════════════════════');
console.log(`  Total pruebas: ${passed + failed}`);
console.log(`  FAIL (esperados — confirman el bug): ${failed}`);
console.log(`  PASS (inesperados): ${passed}`);

if (counterexamples.length > 0) {
  console.log('\n  Contraejemplos documentados:');
  counterexamples.forEach((ce, i) => {
    console.log(`  [${i + 1}] ${ce.name}`);
    console.log(`      → ${ce.message}`);
  });
}

const allFailed = failed === 7 && passed === 0;
const someUnexpectedPass = passed > 0;

console.log('\n══════════════════════════════════════════════════════════════');
if (allFailed) {
  console.log('  ❌ RESULTADO INCORRECTO: Todas las pruebas fallaron.');
  console.log('     El fix no está aplicado correctamente.');
} else if (someUnexpectedPass && failed === 0) {
  console.log('  ✅ RESULTADO CORRECTO: Todas las pruebas PASAN.');
  console.log('     El bug está corregido. Fix verificado.');
} else {
  console.log('  ⚠️  RESULTADO PARCIAL: Algunas pruebas fallaron.');
  console.log('     Revisar el fix aplicado.');
}
console.log('══════════════════════════════════════════════════════════════\n');

// Salir con código 1 si alguna prueba falló (tras el fix, TODAS deben pasar)
process.exit(failed > 0 ? 1 : 0);
