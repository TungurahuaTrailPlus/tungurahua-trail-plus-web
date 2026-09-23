async function loadJSON(path, fallback) {
  try {
    const r = await fetch(path, { cache: 'no-store' });
    if (!r.ok) throw new Error(path);
    return await r.json();
  } catch (e) {
    console.warn('No se pudo cargar', path, e);
    return fallback;
  }
}

function safeHref(url) { return url && url.trim() ? url : '#'; }
function nl(text='') { return String(text).replace(/\n/g, '<br>'); }
const CMS_BASE = 'https://app.pagescms.org/tungurahuatrailplus/tungurahua-trail-plus-web/main/file/';

function addEditButton(target, label, section) {
  if (!target) return;
  target.classList.add('visual-edit-target');
  const a = document.createElement('a');
  a.className = 'visual-edit-button';
  a.href = CMS_BASE + section;
  a.target = '_blank';
  a.rel = 'noopener';
  a.innerHTML = `✎ <span>${label}</span>`;
  target.appendChild(a);
}

function enableVisualEditMode() {
  const params = new URLSearchParams(location.search);
  if (!params.has('edit')) return;
  document.body.classList.add('edit-mode');
  const bar = document.createElement('div');
  bar.className = 'edit-toolbar';
  bar.innerHTML = `<b>✎ MODO EDICIÓN</b><span>Haz clic en “Editar” sobre cada sección.</span><a href="/">Salir</a>`;
  document.body.appendChild(bar);
  addEditButton(document.querySelector('.hero-inner'), 'Editar portada', 'general');
  addEditButton(document.querySelector('.intro'), 'Editar presentación', 'general');
  addEditButton(document.querySelector('#campeonato'), 'Editar campeonato', 'championship');
  addEditButton(document.querySelector('#galeria'), 'Editar galería', 'gallery');
  addEditButton(document.querySelector('#resultados'), 'Editar resultados', 'general');
  addEditButton(document.querySelector('#auspiciantes'), 'Editar auspiciantes', 'sponsors');
  addEditButton(document.querySelector('#contacto'), 'Editar contacto', 'general');
}

async function init() {
  const [site, halloween, cascades, stagesData, galleryData, sponsorsData] = await Promise.all([
    loadJSON('data/site.json', {}),
    loadJSON('data/races/halloween.json', null),
    loadJSON('data/races/cascades.json', null),
    loadJSON('data/championship.json', []),
    loadJSON('data/gallery.json', []),
    loadJSON('data/sponsors.json', [])
  ]);
  const races = [halloween, cascades].filter(Boolean);

  document.querySelector('[data-site="season"]')?.replaceChildren(document.createTextNode(site.season || 'TEMPORADA 2026'));
  const heroTitle = document.querySelector('[data-site="heroTitle"]'); if (heroTitle) heroTitle.innerHTML = nl(site.heroTitle || 'TUNGURAHUA\nTRAIL PLUS');
  document.querySelector('[data-site="heroDescription"]')?.replaceChildren(document.createTextNode(site.heroDescription || ''));
  document.querySelector('[data-site="introEyebrow"]')?.replaceChildren(document.createTextNode(site.introEyebrow || ''));
  const introTitle = document.querySelector('[data-site="introTitle"]'); if (introTitle) introTitle.innerHTML = nl(site.introTitle || '');
  document.querySelector('[data-site="introText"]')?.replaceChildren(document.createTextNode(site.introText || ''));

  const activeRaces = races.filter(r => r.active !== false);
  const active = document.querySelector('#active-races');
  if (active) {
    active.innerHTML = '';
    activeRaces.forEach((race) => {
      const card = document.createElement('article');
      card.className = `race-card ${race.theme || 'default'}`;
      const visualStyle = race.image ? `style="background-image:linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.55)),url('${race.image}')"` : '';
      const price = race.price ? `<span class="race-price">${race.price}</span>` : '';
      card.innerHTML = `
        <div class="race-visual" ${visualStyle}><span class="race-badge">${race.badge || ''}</span><div class="race-number">T+</div></div>
        <div class="race-body">
          <div class="race-meta"><span>${race.place || ''}</span><span>${race.date || ''}</span></div>
          <h3>${nl(race.title || '')}</h3>
          <p class="race-distance">${race.distances || ''} ${price}</p>
          <p class="race-description">${race.description || ''}</p>
          <div class="race-actions">
            <a class="btn btn-primary" href="${safeHref(race.registrationUrl)}" target="_blank" rel="noopener">Inscríbete</a>
            <a class="btn btn-card" href="${safeHref(race.infoUrl)}">Información</a>
          </div>
        </div>`;
      active.appendChild(card);
      const params = new URLSearchParams(location.search);
      if (params.has('edit')) addEditButton(card, `Editar ${race.title || 'carrera'}`, race.theme === 'halloween' ? 'halloween' : 'cascades');
    });
  }

  const activeCount = document.querySelector('[data-count="active"]'); if (activeCount) activeCount.textContent = String(activeRaces.length).padStart(2,'0');
  const stages = document.querySelector('#championship-stages');
  if (stages) {
    stages.innerHTML = '';
    stagesData.forEach(stage => {
      const item = document.createElement('article');
      item.className = 'stage';
      item.innerHTML = `<span class="stage-number">${stage.number || ''}</span><div><small>${stage.city || ''} · ${stage.date || ''}</small><h3>${stage.name || ''}</h3></div><b>${stage.status || ''}</b>`;
      stages.appendChild(item);
    });
  }
  const stageCount = document.querySelector('[data-count="stages"]'); if (stageCount) stageCount.textContent = String(stagesData.length).padStart(2,'0');

  const gallery = document.querySelector('#gallery-grid');
  if (gallery) {
    gallery.innerHTML = '';
    galleryData.forEach((g, idx) => {
      const card = document.createElement('article');
      card.className = 'gallery-card dynamic-gallery';
      if (g.image) card.style.backgroundImage = `url('${g.image}')`;
      card.innerHTML = `<div class="gallery-shade"></div><span>${String(idx+1).padStart(2,'0')}</span><div><small>${g.city || ''} · ${g.year || ''}</small><h3>${g.title || ''}</h3><a href="${safeHref(g.albumUrl)}">Ver álbum →</a></div>`;
      gallery.appendChild(card);
    });
  }

  const sponsorStrip = document.querySelector('#sponsor-strip');
  if (sponsorStrip) {
    sponsorStrip.innerHTML = sponsorsData.length ? '' : '<span>PRÓXIMAMENTE</span>';
    sponsorsData.forEach(s => {
      const a = document.createElement('a'); a.href = safeHref(s.url); a.target = '_blank'; a.rel = 'noopener'; a.className='sponsor-item';
      a.innerHTML = s.logo ? `<img src="${s.logo}" alt="${s.name || 'Auspiciantes'}">` : `<span>${s.name || 'MARCA'}</span>`;
      sponsorStrip.appendChild(a);
    });
  }

  const resultsLink = document.querySelector('[data-edit-link="results"]'); if (resultsLink) resultsLink.href = safeHref(site.resultsUrl);
  const ig = document.querySelector('[data-edit-link="instagram"]'); if (ig) ig.href = safeHref(site.instagram);
  const wa = document.querySelector('[data-edit-link="whatsapp"]'); if (wa) wa.href = safeHref(site.whatsapp);
  const email = document.querySelector('[data-edit-link="email"]'); if (email) email.href = `mailto:${site.email || ''}`;

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  enableVisualEditMode();
}
init();
