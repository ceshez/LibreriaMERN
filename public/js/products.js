const API_PRODUCTS = '/api/products';

function authHeaders() {
  const t = localStorage.getItem('token');
  return t ? { 'Authorization': `Bearer ${t}`, 'Content-Type':'application/json' } : { 'Content-Type':'application/json' };
}
function fmtDate(d) {
  if (!d) return '-';
  const dt = new Date(d);
  return isNaN(dt) ? '-' : dt.toLocaleDateString();
}
async function getJSON(url) {
  const res = await fetch(url, { headers: authHeaders() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Error');
  return data;
}
async function sendJSON(url, method, body) {
  const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Error');
  return data;
}

/* ========== LISTA (products.html) ========== */
const rows = document.getElementById('rows');
const logoutBtn = document.getElementById('logoutBtn');

if (rows) {
  if (!localStorage.getItem('token')) location.href = '/pages/login.html';

  async function load() {
    try {
      const { items } = await getJSON(`${API_PRODUCTS}?limit=100&sort=titulo`);
      rows.innerHTML = items.map(b => `
        <tr class="border-b">
          <td class="p-3 font-medium">${b.titulo}</td>
          <td class="p-3">${b.autor || '-'}</td>
          <td class="p-3">${fmtDate(b.fecha)}</td>
          <td class="p-3">${b.tema}</td>
          <td class="p-3">${b.stockDisponible}/${b.stockTotal}</td>
        </tr>
      `).join('');
    } catch (e) {
      alert('Necesitas iniciar sesión');
      location.href = '/pages/login.html';
    }
  }
  load();

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      location.href = '/pages/login.html';
    });
  }
}

/* ========== FORM (product-form.html) ========== */
const bookForm = document.getElementById('bookForm');
if (bookForm) {
  if (!localStorage.getItem('token')) location.href = '/pages/login.html';

  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  async function loadForEdit() {
    if (!id) return;
    try {
      const b = await getJSON(`${API_PRODUCTS}/${id}`);
      const map = {
        titulo: b.titulo,
        autor: b.autor,
        descripcion: b.descripcion,
        fecha: b.fecha ? new Date(b.fecha).toISOString().slice(0,10) : '',
        tema: b.tema,
        stockTotal: b.stockTotal
      };
      Object.entries(map).forEach(([k,v]) => {
        const el = bookForm.querySelector(`[name="${k}"]`);
        if (el) el.value = v ?? '';
      });
      document.title = `Editar: ${b.titulo}`;
    } catch {
      alert('No se pudo cargar el libro');
    }
  }

  bookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(bookForm);
    const payload = Object.fromEntries(fd.entries());
    payload.stockTotal = Number(payload.stockTotal || 0);
    if (payload.fecha) payload.fecha = new Date(payload.fecha).toISOString();

    try {
      if (id) {
        await sendJSON(`${API_PRODUCTS}/${id}`, 'PUT', payload);
      } else {
        await sendJSON(API_PRODUCTS, 'POST', payload);
      }
      location.href = '/pages/products.html';
    } catch (err) {
      alert(err.message);
    }
  });

  loadForEdit();
}
