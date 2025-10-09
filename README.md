# LibreriaMERN
Pagina de gestion de una libreria
Librería (CRUD + Préstamos) – Node.js + Express + MongoDB

Sistema básico de gestión de inventario para una librería con:

CRUD de libros (título, descripción, autor, fecha, tema, stock).

Búsqueda por título/autor/descripción y fecha.

Préstamos y devoluciones con ajuste de stock.

Autenticación con JWT.

Frontend simple con HTML + Tailwind (CDN) y JS que consume la API.

🧰 Requisitos

Node.js 18+

MongoDB (local o Atlas)

(Opcional) Postman/Insomnia para probar la API

📦 Instalación

Clona el repo o descarga el código

git clone https://github.com/ceshez/LibreriaMERN.git
cd LibreriaMERN


Instala dependencias

npm install


Crea archivo .env en la raíz:

PORT=3000
DB_HOST=mongodb://localhost:27017/libreria   # o tu cadena de Atlas
JWT_SECRET=supersecreto


Si usas MongoDB Atlas, reemplaza DB_HOST por tu connection string.

▶️ Ejecutar en local
Opción A: nodemon (recomendada en desarrollo)
npm run dev

Opción B: node
node index.js


Si todo está bien, verás:

Servidor escuchando en http://localhost:3000
✅ Conectado a MongoDB

🗂️ Estructura del proyecto (resumen)
.
├─ index.js                 # Servidor Express
├─ .env                     # Variables de entorno
├─ modelos/                 # Esquemas Mongoose
│  ├─ usuarioEsquema.js
│  ├─ productoEsquema.js
│  ├─ movimientoEsquema.js
│  └─ prestamoEsquema.js
├─ controladores/           # Lógica de negocio
│  ├─ authControlador.js
│  ├─ productosControlador.js
│  └─ prestamosControlador.js
├─ routing/                 # Rutas Express
│  ├─ rutasAuth.js
│  ├─ rutasProducto.js
│  └─ rutasPrestamo.js
├─ seguridad/
│  └─ auth.js               # verificarToken (JWT)
└─ public/                  # Frontend (HTML + JS)
   ├─ pages/
   │  ├─ login.html
   │  ├─ register.html
   │  ├─ products.html
   │  ├─ product-form.html
   │  └─ shelves.html
   └─ js/
      ├─ auth.js
      ├─ products.js
      ├─ shelves.js
      └─ header.js

🔐 Autenticación (JWT)

Registro POST /api/auth/register
Body:

{ "nombre":"Carlos", "correo":"carlos@test.com", "password":"123456" }


Login POST /api/auth/login → devuelve { token }

Guarda el token en localStorage (el frontend ya lo hace) o úsalo en Postman:

Authorization: Bearer <token>

📚 Endpoints principales
Productos

GET /api/products
Query soportadas: q (texto), autor, tema, desde, hasta, page, limit, sort
Ejemplo:

/api/products?q=historia&tema=Historia&page=1&limit=20&sort=titulo


GET /api/products/:id

POST /api/products

{ "titulo":"Historia CR", "descripcion":"...", "autor":"Autor A", "fecha":"2015-05-21", "tema":"Historia", "stockTotal": 4 }


PUT /api/products/:id

DELETE /api/products/:id

POST /api/products/:id/ajustar

{ "cantidad": 3, "nota": "Ingreso por donación" }


Todos requieren JWT (header Authorization).

Préstamos

POST /api/loans

{ "productoId": "<ID del libro>", "dias": 7 }


GET /api/loans/my

POST /api/loans/:id/return

🖥️ Frontend (páginas)

Registro: http://localhost:3000/pages/register.html

Login: http://localhost:3000/pages/login.html

Inventario (tabla): http://localhost:3000/pages/products.html

Nuevo libro: http://localhost:3000/pages/product-form.html

Estantería (grid): http://localhost:3000/pages/shelves.html

El header aparece en todas las páginas; si no tienes sesión te redirige a Login (según JS).

🧪 Prueba rápida (sin Postman)

Abre http://localhost:3000/pages/register.html y crea un usuario.

Ve a http://localhost:3000/pages/login.html, inicia sesión (guardará el token).

Crea un libro en product-form.html.

Revisa el libro en products.html y en Estantería shelves.html.

🛠️ Seed (opcional)

Crea un script scripts/seed.js para insertar libros de prueba y ejecútalo con:

node scripts/seed.js

🧯 Problemas comunes

Error: Cannot find module 'cors'
Instala: npm i cors y añade en index.js:

const cors = require('cors');
app.use(cors());


Error: Cannot find module 'jsonwebtoken'
npm i jsonwebtoken

ECONNREFUSED o no conecta a Mongo
Verifica DB_HOST en .env. Si usas Atlas, habilita tu IP y credenciales.

CORS en el navegador
Asegúrate de tener app.use(cors()) en index.js.

Página en blanco
Abre Consola (F12) y revisa errores de JS. Confirma rutas correctas /api/... y que tengas token en localStorage.

📄 Licencia

MIT

👤 Autor

Proyecto escolar de gestión de inventario de librería (CRUD + préstamos) – adaptado a tu base con JWT y Express.
