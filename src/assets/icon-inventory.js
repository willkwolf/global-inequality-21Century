/**
 * src/assets/icon-inventory.js
 * 
 * INVENTARIO CANÓNICO DE ASSETS VISUALES E ICONOS SVG
 * 
 * GUARDRAIL DE CONSISTENCIA VISUAL:
 * 1. Los iconos espaciales y de objetos físicos (Satélite, Cohete, Rascacielos, Escalera,
 *    Casa, Silla de Bar, Escalón, Roca/Guijarro) son activos canónicos inmutables.
 * 2. Si un estrato o recalibración utiliza una analogía conocida, DEBE reutilizar el icono
 *    del inventario en lugar de inventar uno nuevo o generar formas genéricas.
 * 3. Solo se crean nuevos SVGs cuando se introduzca una categoría pedagógica enteramente nueva
 *    aprobada por revisión humana.
 */

export const ICON_INVENTORY = {
  satellite_orbit: {
    id: "svg-s1",
    name_es: "Satélite en órbita terrestre media",
    name_en: "Satellite in medium Earth orbit",
    height_range: ">= 100,000 m (Espacio / Órbita)",
    svg: `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" id="svg-s1">
  <circle cx="60" cy="60" r="28" opacity=".4" stroke-dasharray="4 4" />
  <ellipse cx="60" cy="60" rx="46" ry="16" transform="rotate(-25 60 60)" stroke-width="3" opacity=".65" />
  <circle cx="60" cy="60" r="14" fill="currentColor" opacity=".85" />
  <circle cx="96" cy="44" r="4.5" fill="currentColor" />
  <path d="M92 40 l8 8 M92 48 l8 -8" stroke-width="2.5" stroke-linecap="round" />
</svg>`
  },

  rocket_stratosphere: {
    id: "svg-s2",
    name_es: "Cohete en la estratosfera",
    name_en: "Rocket in the stratosphere",
    height_range: "10,000 m - 100,000 m (Estratosfera)",
    svg: `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" id="svg-s2">
  <path d="M60 16 c-12 18 -18 36 -18 56 h36 c0 -20 -6 -38 -18 -56 z" fill="currentColor" opacity=".2" />
  <path d="M60 16 c-12 18 -18 36 -18 56 h36 c0 -20 -6 -38 -18 -56 z" stroke-width="3.5" />
  <circle cx="60" cy="42" r="5" fill="currentColor" />
  <path d="M42 62 l-12 16 v8 h8 l8 -8" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M78 62 l12 16 v8 h-8 l-8 -8" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M52 76 c0 14 8 26 8 26 c0 0 8 -12 8 -26" stroke-dasharray="3 3" opacity=".6" />
</svg>`
  },

  skyscraper_building: {
    id: "svg-s3",
    name_es: "Edificio moderno / Rascacielos",
    name_en: "Skyscraper / Modern building",
    height_range: "30 m - 1,000 m (Gran escala urbana)",
    svg: `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" id="svg-s3">
  <rect x="36" y="20" width="48" height="84" rx="4" stroke-width="3.5" />
  <line x1="48" y1="32" x2="54" y2="32" stroke-width="3" stroke-linecap="round" />
  <line x1="66" y1="32" x2="72" y2="32" stroke-width="3" stroke-linecap="round" />
  <line x1="48" y1="46" x2="54" y2="46" stroke-width="3" stroke-linecap="round" />
  <line x1="66" y1="46" x2="72" y2="46" stroke-width="3" stroke-linecap="round" />
  <line x1="48" y1="60" x2="54" y2="60" stroke-width="3" stroke-linecap="round" />
  <line x1="66" y1="60" x2="72" y2="60" stroke-width="3" stroke-linecap="round" />
  <line x1="48" y1="74" x2="54" y2="74" stroke-width="3" stroke-linecap="round" />
  <line x1="66" y1="74" x2="72" y2="74" stroke-width="3" stroke-linecap="round" />
  <rect x="52" y="88" width="16" height="16" fill="currentColor" opacity=".35" />
</svg>`
  },

  staircase_ladder: {
    id: "svg-s4",
    name_es: "Escalera de 125 escalones",
    name_en: "Staircase of 125 steps",
    height_range: "10 m - 30 m (Escala arquitectónica media)",
    svg: `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" id="svg-s4">
  <line x1="42" y1="18" x2="42" y2="102" stroke-width="3.5" stroke-linecap="round" />
  <line x1="78" y1="18" x2="78" y2="102" stroke-width="3.5" stroke-linecap="round" />
  <line x1="42" y1="30" x2="78" y2="30" stroke-width="3" stroke-linecap="round" />
  <line x1="42" y1="44" x2="78" y2="44" stroke-width="3" stroke-linecap="round" />
  <line x1="42" y1="58" x2="78" y2="58" stroke-width="3" stroke-linecap="round" />
  <line x1="42" y1="72" x2="78" y2="72" stroke-width="3" stroke-linecap="round" />
  <line x1="42" y1="86" x2="78" y2="86" stroke-width="3" stroke-linecap="round" />
</svg>`
  },

  house_twostory: {
    id: "svg-s5",
    name_es: "Casa de dos pisos",
    name_en: "Two-story residential house",
    height_range: "2 m - 10 m (Altura doméstica)",
    svg: `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" id="svg-s5">
  <path d="M28 62 l32 -28 l32 28" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
  <rect x="34" y="62" width="52" height="42" stroke-width="3" />
  <line x1="34" y1="82" x2="86" y2="82" stroke-width="2.5" opacity=".6" />
  <rect x="42" y="68" width="10" height="10" fill="currentColor" opacity=".3" />
  <rect x="68" y="68" width="10" height="10" fill="currentColor" opacity=".3" />
  <rect x="54" y="88" width="12" height="16" fill="currentColor" opacity=".4" />
</svg>`
  },

  bar_stool: {
    id: "svg-s6",
    name_es: "Silla alta de bar",
    name_en: "Bar stool",
    height_range: "0.4 m - 2 m (Altura cotidiana corporal)",
    svg: `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" id="svg-s6">
  <ellipse cx="60" cy="34" rx="22" ry="6" fill="currentColor" opacity=".3" />
  <ellipse cx="60" cy="34" rx="22" ry="6" stroke-width="3.5" />
  <line x1="46" y1="38" x2="36" y2="100" stroke-width="3" stroke-linecap="round" />
  <line x1="74" y1="38" x2="84" y2="100" stroke-width="3" stroke-linecap="round" />
  <line x1="60" y1="38" x2="60" y2="100" stroke-width="3" stroke-linecap="round" />
  <ellipse cx="60" cy="74" rx="16" ry="4" stroke-width="2.5" opacity=".7" />
</svg>`
  },

  stair_step: {
    id: "svg-s7",
    name_es: "Un solo escalón de escalera",
    name_en: "A single stair step",
    height_range: "0.08 m - 0.4 m (El escalón patrón ~15 cm)",
    svg: `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" id="svg-s7">
  <path d="M24 96 h36 v-36 h36 v-36" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
  <polygon points="24,96 60,96 60,60 96,60 96,24 24,24" fill="currentColor" opacity=".15" />
  <line x1="60" y1="60" x2="24" y2="60" stroke-dasharray="3 3" opacity=".4" stroke-width="2" />
  <line x1="96" y1="96" x2="60" y2="96" stroke-dasharray="3 3" opacity=".4" stroke-width="2" />
</svg>`
  },

  pebble_rock: {
    id: "svg-s8",
    name_es: "Una roca pequeña / guijarro en el suelo",
    name_en: "A small pebble on the ground",
    height_range: "< 0.08 m (El suelo / base de la distribución)",
    svg: `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" id="svg-s8">
  <path d="M22 88 c8 -18 24 -28 44 -26 c18 2 30 14 34 26 c2 6 -2 12 -8 12 h-62 c-6 0 -10 -6 -8 -12 z" fill="currentColor" opacity=".35" />
  <path d="M22 88 c8 -18 24 -28 44 -26 c18 2 30 14 34 26 c2 6 -2 12 -8 12 h-62 c-6 0 -10 -6 -8 -12 z" stroke-width="3.5" stroke-linejoin="round" />
  <path d="M38 78 c6 -4 14 -6 22 -4" stroke-width="2.5" stroke-linecap="round" opacity=".6" />
  <line x1="14" y1="100" x2="106" y2="100" stroke-width="3" stroke-linecap="round" opacity=".5" />
</svg>`
  }
};

/**
 * Obtiene el icono del inventario según la altura física en metros o tipo de analogía.
 */
export function getInventoryIcon(heightMeters) {
  if (heightMeters >= 100000) return ICON_INVENTORY.satellite_orbit;
  if (heightMeters >= 10000) return ICON_INVENTORY.rocket_stratosphere;
  if (heightMeters >= 30) return ICON_INVENTORY.skyscraper_building;
  if (heightMeters >= 10) return ICON_INVENTORY.staircase_ladder;
  if (heightMeters >= 2) return ICON_INVENTORY.house_twostory;
  if (heightMeters >= 0.4) return ICON_INVENTORY.bar_stool;
  if (heightMeters >= 0.08) return ICON_INVENTORY.stair_step;
  return ICON_INVENTORY.pebble_rock;
}
