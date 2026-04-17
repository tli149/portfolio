interface ResolvedImg {
  src: string;
  filename: string;
  position: string;
  fit: 'cover' | 'contain';
  caption: string;
}

interface ResolvedProcessImg extends ResolvedImg {
  caption: string;
}

interface ProjectData {
  id: string;
  slug: string;
  title: string;
  tags: string[];
  year: string;
  studio: string;
  instructor: string;
  partner: string;
  location: string;
  processCols: number;
  order: number;
  awards: string[];
  resolvedImages: {
    hero: ResolvedImg;
    process: ResolvedProcessImg[];
    final: ResolvedImg[];
  };
  body: string;
}

declare global {
  interface Window {
    __PROJECTS__: ProjectData[];
  }
}

const LINE_HEIGHT = 26;
const PAD_LEFT = 64;

const projects = window.__PROJECTS__;
const overview = document.getElementById('overview')!;
const projectView = document.getElementById('project-view')!;
const projectContent = document.getElementById('project-content')!;

let currentPhase: 'overview' | 'pulling' | 'project' | 'returning' = 'overview';

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
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

function renderProjectView(project: ProjectData, index: number): string {
  const prevProject = index > 0 ? projects[index - 1] : null;
  const nextProject = index < projects.length - 1 ? projects[index + 1] : null;

  const metaRows: [string, string][] = [
    ['Year', project.year],
    ['Studio', project.studio],
    ['Instructor', project.instructor],
  ];
  if (project.partner !== '—') metaRows.push(['Partner', project.partner]);
  if (project.location !== '—') metaRows.push(['Location', project.location]);

  const awardsHtml = project.awards.length > 0
    ? `<div class="pv-meta-item"><span class="pv-meta-label">Awards</span>${project.awards.map(a => `<div style="margin-top:2px">${escapeHtml(a)}</div>`).join('')}</div>`
    : '';

  const cols = project.processCols || project.resolvedImages.process.length;

  return `
    <div class="pv-container" id="pv-scroll">
      <!-- Ruled lines background + ring holes -->
      <div class="pv-ruled" id="pv-ruled">
        <svg width="100%" height="100%" style="display:block;">
          <defs>
            <pattern id="ruledProj" width="100%" height="${LINE_HEIGHT}" patternUnits="userSpaceOnUse">
              <line x1="0" y1="${LINE_HEIGHT - 0.5}" x2="100%" y2="${LINE_HEIGHT - 0.5}" stroke="#ebebeb" stroke-width="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ruledProj)" />
          <line x1="${PAD_LEFT - 10}" y1="0" x2="${PAD_LEFT - 10}" y2="100%" stroke="#e2e2e2" stroke-width="0.5" />
          ${Array.from({ length: 50 }, (_, i) => {
            const cy = LINE_HEIGHT * 2 * (i + 1);
            return `<circle cx="${PAD_LEFT - 26}" cy="${cy}" r="6" fill="none" stroke="#d0d0d0" stroke-width="1" />`;
          }).join('\n          ')}
        </svg>
      </div>

      <div class="pv-content">
        <!-- Sticky nav -->
        <div class="pv-nav" id="pv-nav">
          <button class="pv-back" id="pv-back">← Back to Index</button>
          <div class="pv-nav-tags">
            ${project.tags.map(t => `<span class="pv-tag">${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>

        <!-- Title -->
        <div class="pv-title-wrap">
          <h1 class="pv-title">${escapeHtml(project.title)}</h1>
        </div>

        <!-- Hero -->
        <div class="pv-section">
          ${renderImage(project.resolvedImages.hero, '16/10')}
        </div>

        <!-- Meta + Description -->
        <div class="pv-meta-desc">
          <div class="pv-meta">
            ${metaRows.map(([label, val]) => `
              <div class="pv-meta-item">
                <span class="pv-meta-label">${escapeHtml(label)}</span><br/>${escapeHtml(val)}
              </div>
            `).join('')}
            ${awardsHtml}
          </div>
          <p class="pv-description">${escapeHtml(project.body || '')}</p>
        </div>

        <!-- Process -->
        ${project.resolvedImages.process.length > 0 ? `
        <div class="pv-section" id="pv-process">
          <div class="pv-divider"></div>
          <div class="pv-process-grid" style="grid-template-columns:repeat(${cols},1fr);">
            ${project.resolvedImages.process.map(item => `
              <div>
                ${renderImage(item, cols === 1 ? null : '4/3')}
                ${item.caption ? `<p class="pv-caption">${escapeHtml(item.caption)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
        ` : '<div id="pv-process"></div>'}

        <!-- Final -->
        <div class="pv-section">
          <div class="pv-divider"></div>
          ${project.resolvedImages.final.map((f, i) => `
            <div${i > 0 ? ' style="margin-top:1.2rem;"' : ''}>
              ${renderImage(f, f.fit === 'contain' || f.position === 'natural' ? null : '21/9')}
              ${f.caption ? `<p class="pv-caption">${escapeHtml(f.caption)}</p>` : ''}
            </div>
          `).join('')}
        </div>

        <!-- Project nav -->
        <div class="pv-project-nav">
          <span class="pv-nav-link">${prevProject ? '← ' + escapeHtml(prevProject.title) : ''}</span>
          <span class="pv-nav-link">${nextProject ? escapeHtml(nextProject.title) + ' →' : ''}</span>
        </div>
      </div>
    </div>
  `;
}

function animateOpen(originY: number, callback: () => void) {
  currentPhase = 'pulling';
  overview.classList.add('dimmed');
  projectView.classList.add('active');

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
      overview.classList.remove('dimmed');
      projectView.classList.remove('active');
      projectView.style.transform = '';
      projectView.style.opacity = '0';
      projectContent.innerHTML = '';
      callback();
    }
  }
  requestAnimationFrame(step);
}

// Measure ruled lines height (stop at process section)
function updateRuledHeight() {
  const processEl = document.getElementById('pv-process');
  const ruledEl = document.getElementById('pv-ruled');
  if (processEl && ruledEl) {
    ruledEl.style.height = processEl.offsetTop + 'px';
  }
}

// Sticky nav scroll effect
function setupScrollListener() {
  const scrollEl = document.getElementById('pv-scroll');
  const navEl = document.getElementById('pv-nav');
  if (!scrollEl || !navEl) return;

  scrollEl.addEventListener('scroll', () => {
    if (scrollEl.scrollTop > 10) {
      navEl.classList.add('scrolled');
    } else {
      navEl.classList.remove('scrolled');
    }
  });
}

let lastOriginY = 0;

// Click handler for project rows
document.querySelectorAll<HTMLElement>('.project-row').forEach((row) => {
  row.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPhase !== 'overview') return;

    const projectId = row.dataset.projectId!;
    const index = parseInt(row.dataset.index!, 10);
    const project = projects[index];
    if (!project) return;

    lastOriginY = row.getBoundingClientRect().top;
    projectContent.innerHTML = renderProjectView(project, index);

    animateOpen(lastOriginY, () => {
      updateRuledHeight();
      setupScrollListener();

      // Back button
      document.getElementById('pv-back')?.addEventListener('click', () => {
        if (currentPhase !== 'project') return;
        animateClose(lastOriginY, () => {});
      });
    });
  });
});
