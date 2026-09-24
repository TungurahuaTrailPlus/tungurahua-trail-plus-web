const menu=document.querySelector('.menu');const nav=document.querySelector('.topbar nav');menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});document.querySelectorAll('.topbar nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
function initSlider(root){const slides=[...root.querySelectorAll('.slide')];if(slides.length<2)return;let i=slides.findIndex(s=>s.classList.contains('active'));if(i<0)i=0;const dots=root.querySelector('.dots');const buttons=slides.map((_,n)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`Ver imagen ${n+1}`);b.addEventListener('click',()=>show(n));dots?.appendChild(b);return b});function show(n){i=(n+slides.length)%slides.length;slides.forEach((s,k)=>s.classList.toggle('active',k===i));buttons.forEach((b,k)=>b.classList.toggle('active',k===i))}root.querySelector('.prev')?.addEventListener('click',()=>show(i-1));root.querySelector('.next')?.addEventListener('click',()=>show(i+1));show(i);let timer=setInterval(()=>show(i+1),6500);root.addEventListener('mouseenter',()=>clearInterval(timer));root.addEventListener('mouseleave',()=>timer=setInterval(()=>show(i+1),6500))}document.querySelectorAll('[data-slider],.archive-slider').forEach(initSlider);
// Cuando tengas el enlace oficial de la tabla de puntuaciones, reemplaza # abajo.
const pointsUrl='#';const points=document.getElementById('points-link');if(pointsUrl!=='#'){points.href=pointsUrl;points.target='_blank';points.rel='noopener';points.querySelector('b').textContent='Ver clasificación';points.querySelector('i').textContent='↗';points.classList.remove('muted')}else{points?.addEventListener('click',e=>{e.preventDefault();alert('El enlace oficial de los puntajes se agregará próximamente.')})}

async function loadEditableSiteData(){
  try{
    const r=await fetch('data/site.json',{cache:'no-store'}); if(!r.ok) return;
    const d=await r.json();
    const setText=(id,v)=>{const e=document.getElementById(id); if(e&&v)e.textContent=v};
    const setHref=(id,v)=>{const e=document.getElementById(id); if(e&&v)e.href=v};
    const setImg=(id,v)=>{const e=document.getElementById(id); if(e&&v)e.src=v};
    if(d.halloween){
      setText('halloween-date',d.halloween.dateLabel);
      const ht=document.getElementById('halloween-title'); if(ht&&d.halloween.title) ht.innerHTML=d.halloween.title.replace(' ','<br>');
      setText('halloween-description',d.halloween.description);
      setHref('halloween-register',d.halloween.registrationUrl); setHref('nav-register',d.halloween.registrationUrl);
      setImg('halloween-poster',d.halloween.poster); setImg('halloween-categories',d.halloween.categoriesImage);
      const chips=document.getElementById('halloween-chips'); if(chips){chips.innerHTML=''; (d.halloween.distances+' · '+d.halloween.extra).split(' · ').filter(Boolean).forEach(x=>{const s=document.createElement('span');s.textContent=x;chips.appendChild(s)})}
    }
    if(d.cascadas){
      setText('cascadas-date',d.cascadas.dateLabel);
      const ct=document.getElementById('cascadas-title'); if(ct&&d.cascadas.title) ct.innerHTML=d.cascadas.title.replace(' DE LAS ',' DE LAS<br>');
      setText('cascadas-description',d.cascadas.description); setImg('cascadas-poster',d.cascadas.poster);
      const chips=document.getElementById('cascadas-chips'); if(chips){chips.innerHTML=''; (d.cascadas.distances+' · '+d.cascadas.extra).split(' · ').filter(Boolean).forEach(x=>{const s=document.createElement('span');s.textContent=x;chips.appendChild(s)})}
      const cr=document.getElementById('cascadas-register'); if(cr){if(d.cascadas.registrationUrl){cr.href=d.cascadas.registrationUrl;cr.classList.remove('disabled');cr.removeAttribute('aria-disabled');cr.textContent='Inscribirme ahora ↗';cr.target='_blank';cr.rel='noopener'}else{cr.href='#';cr.classList.add('disabled');cr.setAttribute('aria-disabled','true');cr.textContent='Inscripciones próximamente';cr.onclick=e=>e.preventDefault()}}
    }
    if(d.links){
      setHref('cascadas-whatsapp',d.links.whatsapp); setHref('contact-whatsapp',d.links.whatsapp);
      const em=document.getElementById('contact-email'); if(em&&d.links.email){em.href='mailto:'+d.links.email; const b=em.querySelector('b'); if(b)b.textContent=d.links.email}
      setHref('contact-instagram',d.links.instagram); setHref('results-link',d.links.results);
      const points=document.getElementById('points-link'); if(points&&d.links.points){points.href=d.links.points;points.target='_blank';points.rel='noopener';points.classList.remove('muted');points.querySelector('b').textContent='Ver clasificación';points.querySelector('i').textContent='↗'}
      setHref('regulations-link',d.links.regulations);
    }
    if(Array.isArray(d.sponsors)){
      const grid=document.getElementById('sponsor-grid'); if(grid){grid.innerHTML=''; d.sponsors.forEach(sp=>{const a=document.createElement(sp.url?'a':'div'); a.className='sponsor-slot'; if(sp.url){a.href=sp.url;a.target='_blank';a.rel='noopener'} if(sp.image){const im=document.createElement('img');im.src=sp.image;im.alt=sp.name||'Auspiciante';a.appendChild(im)}else{a.innerHTML='LOGO<br><small>'+(sp.name||'AUSPICIANTE')+'</small>'} grid.appendChild(a)})}
    }
  }catch(e){console.warn('No se pudo cargar data/site.json',e)}
}
loadEditableSiteData();
