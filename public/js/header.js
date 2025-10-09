// header.js — Header reutilizable + logout
(function mountHeader(){
  const container = document.getElementById('appHeader');
  if (!container) return;

  const isLogged = !!localStorage.getItem('token');

  container.innerHTML = `
    <header class="bg-white/90 backdrop-blur fixed top-0 z-50 shadow-sm left-0 w-full ">
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/pages/shelves.html" class="flex items-center gap-2">
          <span class="text-xl font-bold">📚 Librería</span>
        </a>
        <nav class="flex items-center gap-3 text-sm">
          <a class="px-3 py-2 rounded hover:bg-gray-100" href="/pages/shelves.html">Estantería</a>
          <a class="px-3 py-2 rounded hover:bg-gray-100" href="/pages/products.html">Inventario</a>
          <a class="px-3 py-2 rounded hover:bg-gray-100" href="/pages/product-form.html">Nuevo libro</a>
          ${isLogged
            ? `<button id="logoutBtn" class="px-3 py-2 border rounded hover:bg-gray-50">Salir</button>`
            : `<a class="px-3 py-2 rounded bg-blue-600 text-white" href="/pages/login.html">Entrar</a>`}
        </nav>
      </div>
    </header>
  `;

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      location.href = '/pages/login.html';
    });
  }
})();
