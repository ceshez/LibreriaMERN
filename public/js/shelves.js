// shelves.js — pinta todos los libros en un grid que se llena de izq→der, arr→abajo
const API = '/api/products';
const grid = document.getElementById('shelfGrid');
const qInput = document.getElementById('q');
const themeSel = document.getElementById('theme');
const applyBtn = document.getElementById('apply');
const clearBtn = document.getElementById('clear');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const pageInfo = document.getElementById('pageInfo');

let state = { page: 1, limit: 24, sort: 'titulo', q:'', theme:'' };

function headers() {
  const t = localStorage.getItem('token');
  return t ? { 'Authorization': `Bearer ${t}` } : {};
}
function fmt(d) { return d ? new Date(d).toLocaleDateString() : '-'; }

function card(b) {
  const themeColor = {
    Historia:'from-amber-200 to-amber-300',
    Ciencia:'from-green-200 to-emerald-300',
    Novela:'from-sky-200 to-blue-300',
    Infantil:'from-pink-200 to-rose-300'
  }[b.tema] || 'from-amber-200 to-amber-300';

  return `
    <div class="bg-white rounded-lg shadow hover:shadow-md transition p-3 flex flex-col">
      <div class="h-28 bg-gradient-to-b ${themeColor} rounded mb-2"></div>
      <div class="text-sm font-semibold line-clamp-2">${b.titulo}</div>
      <div class="text-xs text-gray-600">${b.autor || ''}</div>
      <div class="mt-auto flex items-center justify-between text-[11px] text-gray-500">
        <span>${b.tema}</span>
        <span>${b.stockDisponible}/${b.stockTotal}</span>
      </div>
    </div>
  `;
}

function params() {
  const s = new URLSearchParams();
  if (state.q) s.set('q', state.q);
  if (state.theme) s.set('tema', state.theme);
  s.set('page', state.page);
  s.set('limit', state.limit);
  s.set('sort', state.sort);
  return s.toString();
}

async function load() {
  try {
    const res = await fetch(`${API}?${params()}`, { headers: headers() });
    if (!res.ok) {
      // si no hay login, no bloqueamos: muestra vacio y link a login
      grid.innerHTML = `<a href="/pages/login.html" class="text-sm underline">Inicia sesión para ver los libros</a>`;
      pageInfo.textContent = '';
      return;
    }
    const data = await res.json();
    grid.innerHTML = data.items.map(card).join('');
    pageInfo.textContent = `Página ${data.page} de ${data.pages}`;
    prevBtn.disabled = data.page <= 1;
    nextBtn.disabled = data.page >= data.pages;
  } catch (e) {
    grid.innerHTML = `<div class="text-sm text-red-600">Error cargando estantería</div>`;
  }
}

applyBtn?.addEventListener('click', () => {
  state.q = qInput.value.trim();
  state.theme = themeSel.value;
  state.page = 1;
  load();
});
clearBtn?.addEventListener('click', () => {
  qInput.value = ''; themeSel.value = ''; state.q=''; state.theme=''; state.page=1; load();
});
prevBtn?.addEventListener('click', () => { if (state.page>1) { state.page--; load(); }});
nextBtn?.addEventListener('click', () => { state.page++; load(); });

// carga inicial
load();
