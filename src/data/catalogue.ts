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
// Straight lines only, a few strokes each, drawn on a 48×48 grid; stroke and fill come
// from the <svg> wrapper (see glyphSvg). Shapes with fill="var(--paper)" hide what is behind them.
const P = 'fill="var(--paper)"';
const D = 'stroke-dasharray="1.5 2.5"';

export const GLYPHS: Record<string, string> = {
  // Two bricks, one on the other.
  'lego-perspective': `
    <rect x="8" y="25" width="22" height="10"/>
    <rect x="18" y="17" width="22" height="10" ${P}/>
    <path d="M23 17 V14 H28 V17"/>`,
  // Boxes held apart by voids.
  'house-m-analysis': `
    <rect x="8" y="10" width="12" height="28"/>
    <rect x="24" y="10" width="16" height="12"/>
    <rect x="24" y="26" width="16" height="12"/>`,
  // A letter reduced to its geometry.
  'alphabets': `
    <path d="M12 40 L24 8 L36 40"/>
    <path d="M17 28 H31"/>`,
  // Two L-shapes, interlocked.
  'context-interpret': `
    <path d="M10 12 V38 H28"/>
    <path d="M20 10 H38 V30"/>`,
  // One frame at three scales.
  'inside-the-frame': `
    <rect x="8" y="12" width="20" height="26"/>
    <rect x="20" y="8" width="20" height="16" ${P}/>
    <rect x="30" y="28" width="10" height="12" ${P}/>`,
  // Two C-shapes on one path.
  'extended-circulation': `
    <path d="M4 24 H44" ${D}/>
    <path d="M20 10 H10 V38 H20"/>
    <path d="M28 10 H38 V38 H28"/>`,
  // House-shaped modules; the middle one turns.
  'rotated-art-houses': `
    <path d="M5 38 V24 L11 18 L17 24 V38 Z"/>
    <path d="M31 38 V24 L37 18 L43 24 V38 Z"/>
    <path d="M18 38 V24 L24 18 L30 24 V38 Z" transform="rotate(-14 24 30)" ${P}/>`,
  // The gallery turned over the library, in plan.
  'library-of-modern-art': `
    <rect x="10" y="16" width="20" height="24"/>
    <rect x="14" y="10" width="24" height="14" transform="rotate(20 26 17)" ${P}/>`,
  // A box hung off the cliff.
  'tiny-house': `
    <path d="M10 6 V42"/>
    <path d="M10 12 H38"/>
    <rect x="20" y="17" width="16" height="16"/>`,
  // A roof plate lifting over the water line.
  'artificial-ground': `
    <rect x="12" y="26" width="24" height="12"/>
    <path d="M10 24 H22 M24 24 L34 17"/>
    <path d="M4 42 H44" ${D}/>`,
  // A frame of tilted louvers.
  'alternate-skin': `
    <rect x="12" y="8" width="24" height="32"/>
    <path d="M15 17 L33 14 M15 25 L33 22 M15 33 L33 30"/>`,
  // Two module types; one holds a garden.
  'traditional-community': `
    <rect x="8" y="8" width="14" height="14"/><rect x="26" y="8" width="14" height="14"/>
    <rect x="8" y="26" width="14" height="14"/><rect x="26" y="26" width="14" height="14"/>
    <rect x="30" y="12" width="6" height="6"/><rect x="12" y="30" width="6" height="6"/>`,
  // Two walls, a public path between.
  'democratic-forum': `
    <path d="M4 24 H44" ${D}/>
    <rect x="14" y="8" width="5" height="32" ${P}/>
    <rect x="29" y="8" width="5" height="32" ${P}/>`,
  // A house letting go as the water rises.
  'weathering-with': `
    <path d="M10 38 V26 L20 18"/>
    <path d="M20 18 L30 26 V38" ${D}/>
    <path d="M34 21 L37 19 M37 28 H40"/>
    <path d="M4 32 H44"/>`,
  // Two volumes set into a slope.
  'house-of-water-garden': `
    <path d="M4 18 L44 44"/>
    <rect x="9" y="12" width="12" height="12" ${P}/>
    <rect x="25" y="23" width="12" height="12" ${P}/>`,
  // A courtyard held between buildings.
  'envelopes-of-nature': `
    <rect x="6" y="12" width="12" height="24"/>
    <rect x="30" y="12" width="12" height="24"/>
    <rect x="18" y="16" width="12" height="16" ${D}/>`,
  // A closed wall, a signal getting out.
  'abbey-of-wall': `
    <rect x="10" y="14" width="24" height="24"/>
    <rect x="19" y="23" width="6" height="6"/>
    <path d="M36 12 L39 9 M39 15 L43 11"/>`,
  // A pier between deck and water.
  'pier-53-water-park': `
    <path d="M6 16 H42 M26 9 H40 M30 9 V16 M36 9 V16"/>
    <path d="M14 16 V38 M28 16 V38"/>
    <path d="M4 26 H44" ${D}/>`,
};

export function glyphSvg(slug: string, size = 44): string {
  const inner = GLYPHS[slug] ?? '<rect x="8" y="8" width="32" height="32"/>';
  return `<svg class="unit-glyph" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${inner}</svg>`;
}

// Catalogue number from chapter + position within it, e.g. ('combination', 1) → "C-02".
export function catalogueNo(chapter: ChapterKey, indexInChapter: number): string {
  const ch = CHAPTERS.find(c => c.key === chapter)!;
  return `${ch.prefix}-${String(indexInChapter + 1).padStart(2, '0')}`;
}
