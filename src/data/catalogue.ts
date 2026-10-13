// Catalogue structure shared by the index (server) and the sheet view (client).

export type ChapterKey = 'parts' | 'combination' | 'adaptation' | 'time' | 'misc';

export interface Chapter {
  key: ChapterKey;
  num: string;     // shown on the divider tab
  prefix: string;  // catalogue-number prefix, e.g. "C" → C-01
  title: string;
  lead: string;
}

// Order here is the order of the drawers in the index.
export const CHAPTERS: Chapter[] = [
  { key: 'parts', num: '01', prefix: 'P', title: 'Parts', lead: 'Learning the vocabulary: parts, and the logic inside them.' },
  { key: 'combination', num: '02', prefix: 'C', title: 'Combination', lead: 'Simple prototypes, combined to fit a function and a site.' },
  { key: 'adaptation', num: '03', prefix: 'A', title: 'Adaptation', lead: 'Assemblies that keep changing after they are built.' },
  { key: 'time', num: '04', prefix: 'T', title: 'Time', lead: 'Architecture that changes over centuries, then becomes something else.' },
  { key: 'misc', num: '—', prefix: 'M', title: 'Misc.', lead: 'Other works.' },
];

// Unit glyphs: one line drawing of each project's module, keyed by project slug.
// Drawn on a 48×48 grid; stroke and fill come from the <svg> wrapper (see glyphSvg).
// Shapes with fill="var(--paper)" sit in front of and hide the lines behind them.
const P = 'fill="var(--paper)"';
const D = 'stroke-dasharray="2 2"';
const WAVE = (y: number) => `M2 ${y} q3 -2.5 6 0 t6 0 t6 0 t6 0 t6 0 t6 0 t6 0 t6 0`;

export const GLYPHS: Record<string, string> = {
  // Two bricks combined into one object.
  'lego-perspective': `
    <rect x="6" y="26" width="24" height="12"/>
    <rect x="9" y="22" width="5" height="4"/>
    <rect x="18" y="14" width="24" height="12" ${P}/>
    <rect x="21" y="10" width="5" height="4"/><rect x="34" y="10" width="5" height="4"/>`,
  // A collection of boxes separated by courtyard voids.
  'house-m-analysis': `
    <rect x="4" y="4" width="40" height="40" ${D}/>
    <rect x="8" y="8" width="14" height="14"/><rect x="28" y="8" width="12" height="9"/>
    <rect x="28" y="23" width="12" height="17"/><rect x="8" y="28" width="14" height="12"/>`,
  // A letter built from faceted geometry.
  'alphabets': `
    <path d="M8 40 L24 8 L40 40 H32 L28 31 H20 L16 40 Z"/>
    <path d="M22 25 L24 19 L26 25 Z"/>
    <path d="M24 8 V19 M20 31 L22 25 M28 31 L26 25"/>`,
  // Two L-shaped prototypes interlocking.
  'context-interpret': `
    <path d="M8 8 H16 V34 H32 V40 H8 Z"/>
    <path d="M18 8 H40 V40 H34 V14 H18 Z"/>`,
  // One frame language at three scales.
  'inside-the-frame': `
    <rect x="6" y="10" width="22" height="30"/><rect x="9" y="13" width="16" height="24"/>
    <rect x="18" y="6" width="24" height="18" ${P}/><rect x="21" y="9" width="18" height="12"/>
    <rect x="30" y="28" width="12" height="14" ${P}/><rect x="33" y="31" width="6" height="11"/>`,
  // Two C-shapes joined by the extended sidewalk.
  'extended-circulation': `
    <path d="M2 24 H46" ${D}/>
    <path d="M20 8 H6 V40 H20 V32 H14 V16 H20 Z" ${P}/>
    <path d="M28 8 H42 V40 H28 V32 H34 V16 H28 Z" ${P}/>`,
  // House-shaped modules around a void; one turns.
  'rotated-art-houses': `
    <path d="M2 42 H46"/>
    <path d="M4 42 V24 L11 16 L18 24 V42"/>
    <path d="M30 42 V24 L37 16 L44 24 V42"/>
    <path d="M18 40 V25 L24 18 L30 25 V40 Z" transform="rotate(-14 24 30)" ${P}/>`,
  // The gallery rotated 20° over the library, in plan.
  'library-of-modern-art': `
    <rect x="10" y="14" width="22" height="28"/>
    <rect x="12" y="8" width="26" height="16" transform="rotate(20 25 16)" ${P} ${D}/>`,
  // A capsule hung from the cliff on cantilevers.
  'tiny-house': `
    <path d="M10 4 V44 M10 8 L6 12 M10 16 L6 20 M10 24 L6 28 M10 32 L6 36 M10 40 L6 44"/>
    <path d="M10 10 H40 M10 30 L38 12"/>
    <rect x="18" y="14" width="20" height="20" rx="4" ${P}/>
    <path d="M22 34 V46 M27 34 V46 M22 38 H27 M22 42 H27"/>`,
  // A roof that opens to the weather, over shaped water.
  'artificial-ground': `
    <path d="${WAVE(44)}"/>
    <rect x="10" y="24" width="28" height="14"/>
    <path d="M8 22 H18 M20 21 L30 14 M32 22 H40"/>
    <path d="M30 22 A8 8 0 0 0 28 15" ${D}/>`,
  // Operable louvers tuned to the sun.
  'alternate-skin': `
    <circle cx="6" cy="6" r="3"/><path d="M9 9 L16 16" ${D}/>
    <rect x="14" y="8" width="28" height="34"/>
    <path d="M16 15 L40 12 M16 21 L40 18 M16 27 L40 24 M16 33 L40 30 M16 39 L40 36"/>`,
  // Two module types; one carries an inner garden.
  'traditional-community': `
    <rect x="6" y="6" width="10" height="10"/><rect x="19" y="6" width="10" height="10"/><rect x="32" y="6" width="10" height="10"/>
    <rect x="6" y="19" width="10" height="10"/><rect x="19" y="19" width="10" height="10" ${D}/><rect x="32" y="19" width="10" height="10"/>
    <rect x="6" y="32" width="10" height="10"/><rect x="19" y="32" width="10" height="10"/><rect x="32" y="32" width="10" height="10"/>
    <rect x="22" y="9" width="4" height="4"/><rect x="9" y="22" width="4" height="4"/>
    <rect x="35" y="22" width="4" height="4"/><rect x="22" y="35" width="4" height="4"/>`,
  // Two archive walls with the public corridor between them.
  'democratic-forum': `
    <path d="M2 24 H46" ${D}/>
    <rect x="12" y="6" width="6" height="36" ${P}/><rect x="30" y="6" width="6" height="36" ${P}/>
    <path d="M12 12 H18 M12 18 H18 M12 30 H18 M12 36 H18 M30 12 H36 M30 18 H36 M30 30 H36 M30 36 H36"/>`,
  // A house coming apart as the water rises.
  'weathering-with': `
    <path d="M8 40 V24 L20 14"/>
    <path d="M20 14 L32 24 V40" ${D}/>
    <circle cx="36" cy="28" r="0.8"/><circle cx="40" cy="24" r="0.8"/><circle cx="41" cy="33" r="0.8"/>
    <path d="${WAVE(32)}"/>
    <path d="M2 40 H46"/>`,
  // Two volumes set into the slope.
  'house-of-water-garden': `
    <path d="M2 18 L46 46"/>
    <rect x="8" y="12" width="14" height="14" ${P}/>
    <rect x="26" y="24" width="14" height="14" ${P}/>`,
  // Courtyards that frame nature between buildings.
  'envelopes-of-nature': `
    <rect x="4" y="10" width="14" height="28"/><rect x="30" y="10" width="14" height="28"/>
    <rect x="18" y="14" width="12" height="20" ${D}/>
    <circle cx="24" cy="22" r="4"/><path d="M24 26 V32"/>`,
  // A closed wall, with a signal that still gets out.
  'abbey-of-wall': `
    <rect x="6" y="12" width="28" height="28"/><rect x="9" y="15" width="22" height="22"/>
    <circle cx="20" cy="26" r="1.2"/>
    <path d="M34 8 A8 8 0 0 1 42 16 M36 3 A13 13 0 0 1 47 14"/>`,
  // Meeting the river on, above and under the water.
  'pier-53-water-park': `
    <path d="M24 8 H44 M28 8 V16 M40 8 V16"/>
    <path d="M4 16 H44"/>
    <path d="M10 16 V44 M22 16 V44 M34 16 V44"/>
    <path d="${WAVE(22)}"/>
    <path d="M4 34 H44" ${D}/>`,
};

export function glyphSvg(slug: string, size = 44): string {
  const inner = GLYPHS[slug] ?? '<rect x="8" y="8" width="32" height="32"/>';
  return `<svg class="unit-glyph" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${inner}</svg>`;
}

// Catalogue number from chapter + position within it, e.g. ('combination', 1) → "C-02".
export function catalogueNo(chapter: ChapterKey, indexInChapter: number): string {
  const ch = CHAPTERS.find(c => c.key === chapter)!;
  return `${ch.prefix}-${String(indexInChapter + 1).padStart(2, '0')}`;
}
