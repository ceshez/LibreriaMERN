const API = {
  register: '/api/auth/register',
  login: '/api/auth/login',
};

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Error');
  return data;
}

// REGISTRO
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(registerForm);
    const body = Object.fromEntries(fd.entries());
    try {
      await postJSON(API.register, body);
      alert('Cuenta creada, inicia sesión');
      location.href = '/pages/login.html';
    } catch (err) {
      alert(err.message);
    }
  });
}

// LOGIN
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(loginForm);
    const body = Object.fromEntries(fd.entries());
    try {
      const { token } = await postJSON(API.login, body);
      localStorage.setItem('token', token);
      location.href = '/pages/products.html';
    } catch (err) {
      alert(err.message);
    }
  });
}
