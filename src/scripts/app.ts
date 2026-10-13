import { CHAPTERS, glyphSvg, type ChapterKey } from '../data/catalogue';

interface ResolvedImg {
  src: string;
  filename: string;
  position: string;
  fit: 'cover' | 'contain';
  caption: string;
}

interface ProjectData {
  id: string;
  slug: string;
  code: string;
  title: string;
  tags: string[];
  year: string;
  studio: string;
  instructor: string;
  partner: string;
  location: string;
  processCols: number;
  order: number;
  chapter: ChapterKey;
  unit: string;
  concept: string;
  context: string;
  awards: string[];
  resolvedImages: {
    hero: ResolvedImg;
    process: ResolvedImg[];
    final: ResolvedImg[];
  };
  body: string;
}

declare global {
  interface Window {
    __PROJECTS__: ProjectData[];
  }
}

// Already in catalogue order (drawer by drawer).
const projects = window.__PROJECTS__;
const overview = document.getElementById('overview')!;
const projectView = document.getElementById('project-view')!;
const projectContent = document.getElementById('project-content')!;

let currentPhase: 'overview' | 'pulling' | 'project' | 'returning' = 'overview';
let currentIndex = -1;
let lastOriginY = 0;

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderDescription(body: string): string {
  const paragraphs = body.trim().split(/\n\s*\n/);
  return paragraphs
    .map(p => {
      const escaped = escapeHtml(p.trim());
      const bolded = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      return `<p class="pv-description">${bolded}</p>`;
    })
    .join('');
}

function renderImage(img: ResolvedImg, aspect: string | null): string {
  const safeUrl = escapeHtml(img.src);
  const safeLabel = escapeHtml(img.filename);
  const safePos = escapeHtml(img.position);
  const safeFit = escapeHtml(img.fit);
  const fallback = `this.parentElement.classList.add('pv-placeholder-fallback');this.outerHTML='<span class=\\'pv-placeholder-label\\'>${safeLabel.replace(/'/g, "&#39;")}</span>';`;
  const containerStyle = aspect ? `aspect-ratio:${aspect};` : '';
  const imgStyle = aspect
    ? `object-fit:${safeFit};object-position:${safePos};`
    : '';
  return `<div class="pv-placeholder${aspect ? '' : ' pv-placeholder-natural'}" style="${containerStyle}">
    <img src="${safeUrl}" alt="${safeLabel}" loading="lazy"
         style="${imgStyle}"
         onerror="${fallback}" />
  </div>`;
}

function cell(label: string, value: string, cls = ''): string {
  return `<div class="tb-cell ${cls}"><span class="tb-label">${escapeHtml(label)}</span><span class="tb-value">${value}</span></div>`;
}

function stepLink(project: ProjectData | null, dir: -1 | 1): string {
  if (!project) return '<span></span>';
  const label = dir < 0
    ? `← ${escapeHtml(project.code)}&nbsp; ${escapeHtml(project.title)}`
    : `${escapeHtml(project.title)} &nbsp;${escapeHtml(project.code)} →`;
  return `<a class="pv-step" href="#${escapeHtml(project.slug)}" data-step="${dir}">${label}</a>`;
}

function renderProjectView(project: ProjectData, index: number): string {
  const prevProject = index > 0 ? projects[index - 1] : null;
  const nextProject = index < projects.length - 1 ? projects[index + 1] : null;
  const chapter = CHAPTERS.find(c => c.key === project.chapter)!;

  const metaCells = [
    cell('Year', escapeHtml(project.year)),
    cell('Studio', escapeHtml(project.studio)),
  ];
  if (project.instructor !== '—') metaCells.push(cell('Instructor', escapeHtml(project.instructor)));
  if (project.partner !== '—') metaCells.push(cell('Partner', escapeHtml(project.partner)));
  if (project.location !== '—') metaCells.push(cell('Location', escapeHtml(project.location)));
  if (project.awards.length > 0) {
    metaCells.push(cell('Awards', project.awards.map(a => `<span class="tb-line">${escapeHtml(a)}</span>`).join(''), 'tb-wide'));
  }

  const process = project.resolvedImages.process;
  const cols = project.processCols || process.length;

  return `
    <div class="pv-container" id="pv-scroll">
      <div class="pv-nav" id="pv-nav">
        <button class="pv-back" id="pv-back">← Back to Index</button>
        <span class="pv-nav-file">${chapter.num !== '—' ? escapeHtml(chapter.num) + ' ' : ''}${escapeHtml(chapter.title)} &nbsp;/&nbsp; <b>${escapeHtml(project.code)}</b></span>
      </div>

      <article class="pv-sheet">
        <!-- Title block -->
        <header class="pv-titleblock">
          <div class="tb-head">
            <div class="tb-code">
              <span class="tb-label">File</span>
              <span class="tb-code-num">${escapeHtml(project.code)}</span>
            </div>
            <div class="tb-glyph">${glyphSvg(project.slug, 64)}</div>
            <div class="tb-title">
              <span class="tb-label">Project</span>
              <h1 class="pv-title">${escapeHtml(project.title)}</h1>
            </div>
          </div>
          <div class="tb-row tb-urc">
            ${cell('Unit', escapeHtml(project.unit))}
            ${cell('Concept', escapeHtml(project.concept))}
            ${cell('Context', escapeHtml(project.context))}
          </div>
          <div class="tb-row tb-meta">
            ${metaCells.join('')}
          </div>
        </header>

        <!-- Hero -->
        <div class="pv-section">
          ${renderImage(project.resolvedImages.hero, project.resolvedImages.hero.fit === 'contain' ? null : '16/10')}
        </div>

        <!-- Description -->
        <div class="pv-section pv-text">${renderDescription(project.body || '')}</div>

        <!-- Process -->
        ${process.length > 0 ? `
        <div class="pv-section">
          <div class="pv-divider"><span>Process</span></div>
          <div class="pv-process-grid" style="grid-template-columns:repeat(${cols},minmax(0,1fr));">
            ${process.map(item => `
              <figure>
                ${renderImage(item, cols === 1 || item.fit === 'contain' ? null : '4/3')}
                ${item.caption ? `<figcaption class="pv-caption">${escapeHtml(item.caption)}</figcaption>` : ''}
              </figure>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Final -->
        <div class="pv-section">
          <div class="pv-divider"><span>Drawings</span></div>
          ${project.resolvedImages.final.map((f, i) => `
            <figure${i > 0 ? ' class="pv-final-next"' : ''}>
              ${renderImage(f, f.fit === 'contain' || f.position === 'natural' ? null : '21/9')}
              ${f.caption ? `<figcaption class="pv-caption">${escapeHtml(f.caption)}</figcaption>` : ''}
            </figure>
          `).join('')}
        </div>

        <!-- Next / previous file -->
        <nav class="pv-project-nav">
          ${stepLink(prevProject, -1)}
          ${stepLink(nextProject, 1)}
        </nav>
      </article>
    </div>
  `;
}

function animateOpen(originY: number, callback: () => void) {
  currentPhase = 'pulling';
  overview.classList.add('dimmed');
  projectView.classList.add('active');
  projectView.setAttribute('aria-hidden', 'false');

  const duration = 400;
  let start: number | null = null;

  function step(ts: number) {
    if (!start) start = ts;
    const elapsed = ts - start;
    const p = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - p, 4); // ease-out quart

    const translateY = (1 - eased) * Math.max(originY, 50);
    const opacity = p < 0.12 ? p / 0.12 : 1;
    const shadow = `0 -2px ${8 + eased * 20}px rgba(0,0,0,${eased * 0.07})`;

    projectView.style.transform = `translateY(${translateY}px)`;
    projectView.style.opacity = String(opacity);
    projectView.style.boxShadow = shadow;

    if (p < 1) {
      requestAnimationFrame(step);
    } else {
      currentPhase = 'project';
      callback();
    }
  }
  requestAnimationFrame(step);
}

function animateClose(originY: number, callback: () => void) {
  currentPhase = 'returning';
  const duration = 350;
  let start: number | null = null;

  function step(ts: number) {
    if (!start) start = ts;
    const elapsed = ts - start;
    const p = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic (inverted for closing)
    const progress = 1 - eased;

    const translateY = (1 - progress) * Math.max(originY, 50);
    const opacity = progress < 0.12 ? progress / 0.12 : 1;
    const shadow = `0 -2px ${8 + progress * 20}px rgba(0,0,0,${progress * 0.07})`;

    projectView.style.transform = `translateY(${translateY}px)`;
    projectView.style.opacity = String(opacity);
    projectView.style.boxShadow = shadow;

    if (p < 1) {
      requestAnimationFrame(step);
    } else {
      currentPhase = 'overview';
      currentIndex = -1;
      overview.classList.remove('dimmed');
      projectView.classList.remove('active');
      projectView.setAttribute('aria-hidden', 'true');
      projectView.style.transform = '';
      projectView.style.opacity = '0';
      projectContent.innerHTML = '';
      callback();
    }
  }
  requestAnimationFrame(step);
}

// Sticky nav border once the sheet scrolls
function setupScrollListener() {
  const scrollEl = document.getElementById('pv-scroll');
  const navEl = document.getElementById('pv-nav');
  if (!scrollEl || !navEl) return;

  scrollEl.addEventListener('scroll', () => {
    navEl.classList.toggle('scrolled', scrollEl.scrollTop > 10);
  });
}

function bindSheet() {
  setupScrollListener();
  document.getElementById('pv-back')?.addEventListener('click', () => closeProject());
  projectContent.querySelectorAll<HTMLAnchorElement>('.pv-step').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showProject(currentIndex + Number(link.dataset.step));
    });
  });
}

function rowOrigin(index: number): number {
  const row = overview.querySelector<HTMLElement>(`.project-row[data-index="${index}"]`);
  return row ? row.getBoundingClientRect().top : 0;
}

// URL: "#<slug>" while a sheet is out, bare path on the index, so each file can be linked to directly.
function setUrl(index: number, mode: 'push' | 'replace') {
  const url = index >= 0 ? `#${projects[index].slug}` : location.pathname + location.search;
  if (mode === 'push') history.pushState(null, '', url);
  else history.replaceState(null, '', url);
}

function openProject(index: number, opts: { updateUrl: boolean }) {
  if (currentPhase !== 'overview' || !projects[index]) return;
  currentIndex = index;
  lastOriginY = rowOrigin(index);
  projectContent.innerHTML = renderProjectView(projects[index], index);
  if (opts.updateUrl) setUrl(index, 'push');
  animateOpen(lastOriginY, bindSheet);
}

// Swap the sheet in place (prev / next) without going back to the index.
function showProject(index: number, opts: { updateUrl: boolean } = { updateUrl: true }) {
  if (currentPhase !== 'project' || !projects[index]) return;
  currentIndex = index;
  lastOriginY = rowOrigin(index);
  projectContent.innerHTML = renderProjectView(projects[index], index);
  if (opts.updateUrl) setUrl(index, 'replace');
  bindSheet();
}

function closeProject(opts: { updateUrl: boolean } = { updateUrl: true }) {
  if (currentPhase !== 'project') return;
  if (opts.updateUrl) setUrl(-1, 'push');
  animateClose(lastOriginY, () => {});
}

function indexFromHash(): number {
  const slug = decodeURIComponent(location.hash.slice(1));
  return slug ? projects.findIndex(p => p.slug === slug) : -1;
}

// Click handler for file rows
overview.querySelectorAll<HTMLElement>('.project-row').forEach(row => {
  row.addEventListener('click', e => {
    e.preventDefault();
    openProject(parseInt(row.dataset.index!, 10), { updateUrl: true });
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeProject();
});

// Browser back / forward
window.addEventListener('popstate', () => {
  const index = indexFromHash();
  if (index < 0) closeProject({ updateUrl: false });
  else if (currentPhase === 'overview') openProject(index, { updateUrl: false });
  else showProject(index, { updateUrl: false });
});

// A shared link opens straight to its sheet.
const initial = indexFromHash();
if (initial >= 0) openProject(initial, { updateUrl: false });
