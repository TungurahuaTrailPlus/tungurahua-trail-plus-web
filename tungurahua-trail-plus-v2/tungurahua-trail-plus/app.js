const content = window.SITE_CONTENT;
const active = document.querySelector('#active-races');

content.activeRaces.forEach((race) => {
  const card = document.createElement('article');
  card.className = `race-card ${race.theme}`;
  card.innerHTML = `
    <div class="race-visual"><span class="race-badge">${race.badge}</span><div class="race-number">T+</div></div>
    <div class="race-body">
      <div class="race-meta"><span>${race.place}</span><span>${race.date}</span></div>
      <h3>${race.title.replace(/\n/g, '<br>')}</h3>
      <p class="race-distance">${race.distances}</p>
      <p class="race-description">${race.description}</p>
      <div class="race-actions">
        <a class="btn btn-primary" href="${race.registrationUrl}">Inscríbete</a>
        <a class="btn btn-card" href="${race.infoUrl}">Información</a>
      </div>
    </div>`;
  active.appendChild(card);
});

const stages = document.querySelector('#championship-stages');
content.championshipStages.forEach(stage => {
  const item = document.createElement('article');
  item.className = 'stage';
  item.innerHTML = `<span class="stage-number">${stage.number}</span><div><small>${stage.city} · ${stage.date}</small><h3>${stage.name}</h3></div><b>${stage.status}</b>`;
  stages.appendChild(item);
});

document.querySelectorAll('[data-edit-link]').forEach(el => {
  const key = el.dataset.editLink;
  if (content.links[key]) el.href = content.links[key];
});

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
