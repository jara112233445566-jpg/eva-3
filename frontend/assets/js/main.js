// main.js
// Carga los datos, construye el carousel, el buscador y las cards

let clasesConHabilidades = []; // estructura: [{id_clase, nombre_clase, habilidades: [{...}]}]

async function fetchData() {
  try {
    const res = await fetch('/api/clases-con-habilidades');
    clasesConHabilidades = await res.json();
    renderCarousel(clasesConHabilidades);
    renderAllCards(clasesConHabilidades);
  } catch (err) {
    console.error('Error cargando datos:', err);
    document.getElementById('cardsContainer').innerHTML = '<p class="text-danger">Error cargando datos del servidor.</p>';
  }
}

// ----- RENDER CAROUSEL -----
function renderCarousel(data) {
  const indicators = document.getElementById('carouselIndicators');
  const inner = document.getElementById('carouselInner');
  indicators.innerHTML = '';
  inner.innerHTML = '';

  if (!data || data.length === 0) {
    inner.innerHTML = `<div class="carousel-item active"><div class="d-flex justify-content-center align-items-center" style="height:200px;"><div class="text-center"><h4>No hay clases</h4></div></div></div>`;
    return;
  }

  data.forEach((cls, idx) => {
    // Indicator
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('data-bs-target', '#infoCarousel');
    btn.setAttribute('data-bs-slide-to', String(idx));
    if (idx === 0) btn.classList.add('active');
    indicators.appendChild(btn);

    // Item
    const item = document.createElement('div');
    item.className = 'carousel-item' + (idx === 0 ? ' active' : '');

    const card = document.createElement('div');
    card.className = 'card p-3';

    const body = document.createElement('div');
    body.className = 'card-body text-center';

    const title = document.createElement('h3');
    title.textContent = cls.nombre_clase;

    const list = document.createElement('div');
    list.className = 'mt-3 text-start';

    if (cls.habilidades && cls.habilidades.length) {
      cls.habilidades.forEach(h => {
        const hName = document.createElement('h6');
        hName.className = 'habilidad-name';
        hName.textContent = h.nombre_habilidad;
        const p = document.createElement('p');
        p.style.marginBottom = '12px';
        p.textContent = h.descripcion_habilidad;
        list.appendChild(hName);
        list.appendChild(p);
      });
    } else {
      list.innerHTML = '<p>No hay habilidades para esta clase.</p>';
    }

    body.appendChild(title);
    body.appendChild(list);
    card.appendChild(body);
    item.appendChild(card);
    inner.appendChild(item);
  });
}

// ----- RENDER ALL CARDS -----
function renderAllCards(data) {
  const cont = document.getElementById('cardsContainer');
  cont.innerHTML = '';
  if (!data || data.length === 0) {
    cont.innerHTML = '<p>No hay datos para mostrar.</p>';
    return;
  }

  data.forEach(cls => {
    // Create a column
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4';

    const wrapper = document.createElement('div');
    wrapper.className = 'ability-card';

    const title = document.createElement('div');
    title.className = 'class-title mb-2';
    title.textContent = cls.nombre_clase;

    wrapper.appendChild(title);

    if (cls.habilidades && cls.habilidades.length) {
      cls.habilidades.forEach(h => {
        const hDiv = document.createElement('div');
        hDiv.className = 'mb-3';
        hDiv.innerHTML = `<div class="habilidad-name">${h.nombre_habilidad}</div><div class="text-muted small">${h.descripcion_habilidad}</div>`;
        wrapper.appendChild(hDiv);
      });
    } else {
      wrapper.innerHTML += '<div class="text-muted small">Sin habilidades</div>';
    }

    col.appendChild(wrapper);
    cont.appendChild(col);
  });
}

// ----- BUSCADOR -----
function normalizeText(s = '') {
  return s.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function searchAll(query) {
  const q = normalizeText(query.trim());
  if (!q) return [];

  const results = [];

  clasesConHabilidades.forEach(cls => {
    // check class name
    const classMatch = normalizeText(cls.nombre_clase).includes(q);

    // check habilidades
    const matchedHabilidades = cls.habilidades.filter(h => {
      return normalizeText(h.nombre_habilidad).includes(q) ||
             normalizeText(h.descripcion_habilidad).includes(q);
    });

    if (classMatch || matchedHabilidades.length > 0) {
      results.push({
        id_clase: cls.id_clase,
        nombre_clase: cls.nombre_clase,
        habilidades: matchedHabilidades.length ? matchedHabilidades : cls.habilidades
      });
    }
  });

  return results;
}

function renderSearchResults(results, rawQuery) {
  const container = document.getElementById('searchResults');
  const msg = document.getElementById('searchMessage');
  container.innerHTML = '';
  msg.innerHTML = '';

  if (!rawQuery || rawQuery.trim() === '') {
    msg.innerHTML = '<div class="text-muted mt-2">Ingresa texto y presiona Buscar.</div>';
    return;
  }

  if (!results || results.length === 0) {
    msg.innerHTML = `<div class="no-results mt-2">No hay coincidencias con tu búsqueda: "${rawQuery}"</div>`;
    return;
  }

  // show how many matches
  msg.innerHTML = `<div class="text-success mt-2">Resultados encontrados: ${results.length}</div>`;

  // render each class result
  const row = document.createElement('div');
  row.className = 'row g-3 mt-2';
  results.forEach(cls => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6';

    const card = document.createElement('div');
    card.className = 'card p-3 h-100';

    const body = document.createElement('div');
    body.className = 'card-body';

    const title = document.createElement('h5');
    title.textContent = cls.nombre_clase;

    body.appendChild(title);

    if (cls.habilidades && cls.habilidades.length) {
      cls.habilidades.forEach(h => {
        const hName = document.createElement('div');
        hName.className = 'fw-bold mt-2';
        hName.textContent = h.nombre_habilidad;
        const p = document.createElement('div');
        p.className = 'text-muted small';
        p.textContent = h.descripcion_habilidad;
        body.appendChild(hName);
        body.appendChild(p);
      });
    } else {
      body.innerHTML += '<div class="text-muted small">Sin habilidades coincidentes</div>';
    }

    card.appendChild(body);
    col.appendChild(card);
    row.appendChild(col);
  });

  container.appendChild(row);
}

// ----- EVENTOS BUSCADOR -----
document.addEventListener('DOMContentLoaded', () => {
  fetchData();

  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  const navSearch = document.getElementById('navSearch');
  const navSearchBtn = document.getElementById('navSearchBtn');

  searchBtn.addEventListener('click', () => {
    const q = searchInput.value;
    const res = searchAll(q);
    renderSearchResults(res, q);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchBtn.click();
    }
  });

  // Barra del navbar usa mismo comportamiento
  navSearchBtn.addEventListener('click', () => {
    const q = navSearch.value;
    const res = searchAll(q);
    // scroll to results
    window.scrollTo({ top: document.getElementById('searchResults').offsetTop - 80, behavior: 'smooth' });
    renderSearchResults(res, q);
  });

  navSearch.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      navSearchBtn.click();
    }
  });

  // Contact form (solo demo: muestra alerta y limpia)
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Mensaje enviado (demo).');
    contactForm.reset();
  });
});
