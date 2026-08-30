/**
 * tests/unit/pv-toggle-dom.test.mjs
 * 
 * Test funcional en JSDOM para el Toggle Estético de Valor Presente (#pv-toggle).
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HTML_PATH = path.resolve(__dirname, '../../Escala-visual-de-riqueza-mundial.html');

test('DOM #pv-toggle: Conmutación interactiva entre Valor Presente y Nominal', () => {
  const html = fs.readFileSync(HTML_PATH, 'utf8');
  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    beforeParse(window) {
      window.matchMedia = window.matchMedia || function() {
        return {
          matches: false,
          addListener: function() {},
          removeListener: function() {}
        };
      };
      window.IntersectionObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
      };
    }
  });
  const doc = dom.window.document;

  const pvBtn = doc.getElementById('pv-toggle');
  const pvLabel = doc.getElementById('pv-toggle-label');
  const langBtn = doc.getElementById('lang-toggle');

  assert.ok(pvBtn, 'El botón #pv-toggle debe existir en el DOM');
  assert.ok(pvLabel, 'El label #pv-toggle-label debe existir en el DOM');

  // 1. Estado Inicial: Valor Presente (ON)
  assert.equal(pvBtn.classList.contains('active'), true);
  assert.equal(pvBtn.getAttribute('aria-checked'), 'true');
  assert.ok(pvLabel.textContent.includes('USD*'));

  const s1Caption = doc.querySelector('#s1 .caption');
  const s1Date = doc.querySelector('#s1 .data-date');
  const s8Caption = doc.querySelector('#s8 .caption');
  const s8Num = doc.querySelector('#s8 .num');
  const s7Caption = doc.querySelector('#s7 .caption');

  // En PV inicial (ES): s8 tiene $1.842 y 3,5 cm; s7 tiene $9.388
  assert.ok(s8Caption.textContent.includes('$1.842'), 'En PV, s8 caption debe tener $1.842');
  assert.ok(s8Num.textContent.includes('3,5'), 'En PV, s8 num debe tener 3,5 cm');
  assert.ok(s7Caption.textContent.includes('$9.388'), 'En PV, s7 caption debe tener $9.388');

  // 2. Click en #pv-toggle -> Conmutar a Modo Nominal (OFF)
  pvBtn.click();

  assert.equal(pvBtn.classList.contains('active'), false);
  assert.equal(pvBtn.getAttribute('aria-checked'), 'false');
  assert.ok(pvLabel.textContent.includes('USD') && !pvLabel.textContent.includes('USD*'));
  assert.ok(!s1Caption.textContent.includes('USD*'), 'En modo Nominal, el caption no debe incluir USD*');
  assert.ok(s1Date.textContent.includes('Nominal'), 'En modo Nominal, el badge debe indicar Nominal');

  // En Nominal (ES): s8 tiene $1.748 y 3,3 cm; s7 tiene $8.910
  assert.ok(s8Caption.textContent.includes('$1.748'), 'En Nominal, s8 caption debe tener $1.748');
  assert.ok(s8Num.textContent.includes('3,3'), 'En Nominal, s8 num debe tener 3,3 cm');
  assert.ok(s7Caption.textContent.includes('$8.910'), 'En Nominal, s7 caption debe tener $8.910');

  // 3. Click en #pv-toggle de nuevo -> Restaurar Modo Valor Presente (ON)
  pvBtn.click();

  assert.equal(pvBtn.classList.contains('active'), true);
  assert.equal(pvBtn.getAttribute('aria-checked'), 'true');
  assert.ok(s8Caption.textContent.includes('$1.842'));
  assert.ok(s8Num.textContent.includes('3,5'));

  // 4. Conmutar idioma a EN -> Verificar persistencia y traducción
  langBtn.click();
  assert.equal(doc.documentElement.lang, 'en');
  assert.ok(s1Date.textContent.includes('Present value'));
  assert.ok(s8Caption.textContent.includes('$1,842'));
  assert.ok(s8Num.textContent.includes('3.5'));

  // 5. En EN, apagar a Nominal -> Verificar idioma EN en Nominal
  pvBtn.click();
  assert.ok(s1Date.textContent.includes('Nominal'));
  assert.ok(s8Caption.textContent.includes('$1,748'));
  assert.ok(s8Num.textContent.includes('3.3'));
});
