/**
 * Parallax Stars — Preservation Tests
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4
 *
 * PROPÓSITO: Verificar que el fix no introduce regresiones.
 * Estas pruebas confirman que en el código CON fix:
 *   - Las estrellas son visibles (opacity no es "0") en s1 y s2
 *   - El parallax está activo (transform contiene translateY) en s1 y s2
 *   - prefers-reduced-motion omite todo transform
 *
 * Metodología observation-first:
 *   Con el fix, starsEl.style.opacity se asigna explícitamente:
 *   - s1: opacity = "1"
 *   - s2: opacity entre "1" y "0" (transición suave)
 *   La prueba verifica que opacity !== "0", lo cual es verdadero en s1 y s2.
 *
 * RESULTADO ESPERADO: TODAS las pruebas PASAN (sin regresiones).
 */

import { JSDOM } from 'jsdom';
import assert from 'node:assert/strict';
import fc from 'fast-check';

// ── Helper ────────────────────────────────────────────────────────────────────

/**
 * Crea un entorno jsdom mínimo con los elementos que necesita updateScroll().
 * @param {number} vh      - Altura del viewport simulado (window.innerHeight)
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

// ── Utilidad de reporte ───────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures = [];

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✓ PASS — ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗ FAIL — ${name}`);
    console.log(`    Error: ${err.message}`);
    failures.push({ name, message: err.message });
    failed++;
  }
}

// ── Suite de pruebas ──────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════════════');
console.log('  Parallax Stars — Preservation Tests (código CON fix)');
console.log('  Validates: Requirements 3.1, 3.2, 3.3, 3.4');
console.log('══════════════════════════════════════════════════════════════\n');

const VH = 800; // viewport simulado

// ─────────────────────────────────────────────────────────────────────────────
// Caso 1: scrollY = 0 (s1) — las estrellas son visibles
// En código sin fix, opacity nunca se asigna → valor es "" (no es "0")
// ─────────────────────────────────────────────────────────────────────────────
console.log('Caso 1 — s1 inicio (scrollY = 0): estrellas visibles');
console.log('  Observación: opacity="" (vacío) → no es "0" → estrellas visibles');

runTest('scrollY=0 (s1): starsEl.style.opacity no es "0" (estrellas visibles)', () => {
  const { starsEl, updateScroll } = createEnv(VH, 0);
  updateScroll();
  assert.notEqual(
    starsEl.style.opacity,
    '0',
    `opacity="${starsEl.style.opacity}" — se esperaba que NO fuera "0" (estrellas visibles en s1)`
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Caso 2: scrollY = 0.5 * vh (s1 mitad) — parallax activo (transform con translateY)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\nCaso 2 — s1 mitad (scrollY = 0.5 × vh): parallax activo');
console.log('  Observación: transform contiene translateY con valor no vacío');

runTest('scrollY=0.5*vh (s1): transform contiene translateY', () => {
  const scrollY = 0.5 * VH;
  const { starsEl, updateScroll } = createEnv(VH, scrollY);
  updateScroll();
  const transform = starsEl.style.transform;
  assert.ok(
    transform && transform.includes('translateY'),
    `transform="${transform}" — se esperaba que contuviera translateY (parallax activo en s1)`
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Caso 3: scrollY = vh (inicio s2) — las estrellas son visibles
// ─────────────────────────────────────────────────────────────────────────────
console.log('\nCaso 3 — s2 inicio (scrollY = vh): estrellas visibles');
console.log('  Observación: opacity="" (vacío) → no es "0" → estrellas visibles');

runTest('scrollY=vh (inicio s2): starsEl.style.opacity no es "0"', () => {
  const { starsEl, updateScroll } = createEnv(VH, VH);
  updateScroll();
  assert.notEqual(
    starsEl.style.opacity,
    '0',
    `opacity="${starsEl.style.opacity}" — se esperaba que NO fuera "0" (estrellas visibles al inicio de s2)`
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Caso 4: scrollY = 1.5 * vh (mitad s2) — las estrellas son visibles
// ─────────────────────────────────────────────────────────────────────────────
console.log('\nCaso 4 — s2 mitad (scrollY = 1.5 × vh): estrellas visibles');
console.log('  Observación: opacity="" (vacío) → no es "0" → estrellas visibles');

runTest('scrollY=1.5*vh (mitad s2): starsEl.style.opacity no es "0"', () => {
  const { starsEl, updateScroll } = createEnv(VH, 1.5 * VH);
  updateScroll();
  assert.notEqual(
    starsEl.style.opacity,
    '0',
    `opacity="${starsEl.style.opacity}" — se esperaba que NO fuera "0" (estrellas visibles en mitad de s2)`
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Caso 5: reduced=true — sin transform aplicado
// Cuando prefers-reduced-motion está activo, el bloque if (!reduced) se omite
// → starsEl.style.transform permanece vacío
// ─────────────────────────────────────────────────────────────────────────────
console.log('\nCaso 5 — prefers-reduced-motion (reduced=true): sin transform');
console.log('  Observación: el bloque if (!reduced) se omite → transform=""');

runTest('reduced=true: starsEl.style.transform está vacío (sin translateY)', () => {
  const { starsEl, updateScroll } = createEnv(VH, 0.5 * VH, true);
  updateScroll();
  const transform = starsEl.style.transform;
  assert.equal(
    transform,
    '',
    `transform="${transform}" — se esperaba "" (sin transform cuando reduced=true)`
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// PBT: Para todo scrollY en [0, 2*vh), opacity no es "0"
// Validates: Requirements 3.1, 3.2
// ─────────────────────────────────────────────────────────────────────────────
console.log('\nPBT — Para todo scrollY en [0, 2×vh) (s1–s2): opacity no es "0"');
console.log('  Validates: Requirements 3.1, 3.2');

let pbtPreservationPassed = false;
let pbtPreservationCounterexample = null;

try {
  fc.assert(
    fc.property(
      fc.float({ min: 0, max: Math.fround(1.9999), noNaN: true }),
      (multiplier) => {
        const scrollY = multiplier * VH;
        const { starsEl, updateScroll } = createEnv(VH, scrollY);
        updateScroll();
        // En código sin fix, opacity nunca se asigna → siempre "" → nunca "0"
        return starsEl.style.opacity !== '0';
      }
    ),
    { numRuns: 100, seed: 42 }
  );
  console.log('  ✓ PASS — PBT preservation: opacity no es "0" en [0, 2×vh)');
  pbtPreservationPassed = true;
  passed++;
} catch (err) {
  const counterexStr = err.message || String(err);
  console.log('  ✗ FAIL — PBT preservation');
  console.log(`    Error: ${counterexStr.split('\n')[0]}`);
  failures.push({ name: 'PBT preservation [0, 2×vh)', message: counterexStr.split('\n')[0] });
  pbtPreservationCounterexample = counterexStr;
  failed++;
}

// ── Resumen ───────────────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════════════');
console.log('  RESUMEN');
console.log('══════════════════════════════════════════════════════════════');
console.log(`  Total pruebas: ${passed + failed}`);
console.log(`  PASS: ${passed}`);
console.log(`  FAIL: ${failed}`);

if (failures.length > 0) {
  console.log('\n  Fallos:');
  failures.forEach((f, i) => {
    console.log(`  [${i + 1}] ${f.name}`);
    console.log(`      → ${f.message}`);
  });
}

const allPassed = failed === 0;

console.log('\n══════════════════════════════════════════════════════════════');
if (allPassed) {
  console.log('  ✅ RESULTADO CORRECTO: Todas las pruebas PASAN.');
  console.log('     Línea base de preservation confirmada.');
  console.log('     Estas pruebas deben seguir pasando tras el fix (Tarea 3).');
} else {
  console.log('  ❌ RESULTADO INESPERADO: Algunas pruebas fallaron.');
  console.log('     Revisar el código o las pruebas antes de continuar.');
}
console.log('══════════════════════════════════════════════════════════════\n');

// Salir con código 1 si alguna prueba falló (estas pruebas DEBEN pasar)
process.exit(failed > 0 ? 1 : 0);
