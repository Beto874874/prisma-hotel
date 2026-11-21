# Prisma Hotel

Aplicación web full-stack (stack **PERN**) para gestionar sedes, habitaciones y reservas de una cadena hotelera en Colombia. Proyecto académico de Ingeniería de Software III — Universidad Libre, Pereira.

- **Clientes**: ven las sedes y habitaciones, consultan el detalle, reservan con calendario (fechas ocupadas bloqueadas), pagan y cancelan sus reservas.
- **Administradores**: gestionan sedes, habitaciones (con subida de imágenes), reservas y estado de pago.

---

## Tabla de contenido

1. [Tecnologías](#tecnologías)
2. [Estructura del repositorio](#estructura-del-repositorio)
3. [Requisitos previos](#requisitos-previos)
4. [Instalación paso a paso](#instalación-paso-a-paso)
5. [Usuarios de prueba](#usuarios-de-prueba)
6. [Base de datos y relaciones](#base-de-datos-y-relaciones)
7. [Arquitectura del backend](#arquitectura-del-backend)
8. [Autenticación y roles](#autenticación-y-roles)
9. [Librerías utilizadas](#librerías-utilizadas)
10. [Flujos principales](#flujos-principales)
11. [Pruebas](#pruebas)
12. [Problemas comunes](#problemas-comunes)

---

## Tecnologías

| Capa          | Tecnología                          |
| ------------- | ----------------------------------- |
| Frontend      | React + Vite + Material UI (MUI v9) |
| Backend       | Node.js + Express 5                 |
| Base de datos | PostgreSQL                          |
| Autenticación | JWT + bcryptjs                      |

---

## Estructura del repositorio

```
prisma-hotel/
├── BACKEND_PRISMA/
│   ├── controllers/      # Lógica de negocio
│   ├── models/           # Consultas SQL (pg)
│   ├── routes/           # Definición de endpoints
│   ├── middlewares/      # verificarToken, soloAdmin, soloCliente
│   ├── database/         # conexion.js (Pool de pg)
│   ├── utils/            # calculos.js (noches, totales)
│   ├── tests/            # Pruebas unitarias (Jest)
│   ├── uploads/          # Imágenes subidas por el admin (se crea al usar la app)
│   ├── Dockerfile
│   └── index.js          # Punto de entrada del servidor
├── FRONTEND_PRISMA/
│   └── src/
│       ├── pages/        # Páginas (Home, Login, detalle, reservas, admin...)
│       ├── components/   # Navbar, Footer, RutaProtegida, CalendarioReserva...
│       ├── services/     # Llamadas a la API con axios
│       ├── context/      # AuthContext (sesión global)
│       └── theme.js      # Tema de Material UI
├── e2e/                  # Pruebas end-to-end (Playwright)
├── database.sql          # Script completo de la base de datos
├── docker-compose.yml    # Orquesta base de datos, backend y frontend
└── README.md
```

---

## Inicio rápido con Docker (recomendado)

Es la forma más fácil: no necesitas instalar Node ni PostgreSQL, solo Docker Desktop y Git.

1. Instala [Docker Desktop](https://www.docker.com/products/docker-desktop/) y ábrelo (debe quedar corriendo).
2. Clona el repositorio:
   ```bash
   git clone https://github.com/Beto874874/prisma-hotel.git
   cd prisma-hotel
   ```
3. Levanta todo:
   ```bash
   docker compose up --build
   ```
   La primera vez tarda unos minutos porque descarga las imágenes e instala las dependencias.
4. Abre **http://localhost:5173** y entra con `admin@gmail.com` o `cliente@gmail.com` (contraseña `1234`).

Comandos útiles:

| Comando                          | Qué hace                                                                            |
| -------------------------------- | ----------------------------------------------------------------------------------- |
| `docker compose up`              | Arranca todo (las veces siguientes)                                                 |
| `docker compose down`            | Apaga los contenedores (los datos se conservan)                                     |
| `docker compose down -v`         | Apaga y borra la base de datos; al volver a arrancar se recrea desde `database.sql` |
| `docker compose logs -f backend` | Ver los logs del backend                                                            |

Servicios: base de datos PostgreSQL (puerto 5432 interno), backend en http://localhost:5000 y frontend en http://localhost:5173.

Si prefieres no usar Docker, sigue la instalación manual de abajo.

---

## Requisitos previos (instalación manual)

| Herramienta        | Versión recomendada         | Verificar con    |
| ------------------ | --------------------------- | ---------------- |
| Node.js            | 18 o superior (incluye npm) | `node -v`        |
| PostgreSQL         | 14 o superior               | `psql --version` |
| Git                | cualquiera reciente         | `git --version`  |
| pgAdmin (opcional) | cualquiera                  | —                |

---

## Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/Beto874874/prisma-hotel.git
cd prisma-hotel
```

### 2. Crear la base de datos

**Opción A — pgAdmin**

1. Clic derecho en _Databases_ → _Create_ → _Database…_ → nombre: `prisma_hotel` → _Save_.
2. Clic derecho sobre `prisma_hotel` → _Query Tool_.
3. Abre el archivo `database.sql` (icono de carpeta) y ejecútalo con el botón de Play (F5).

**Opción B — terminal**

```bash
psql -U postgres -c "CREATE DATABASE prisma_hotel;"
psql -U postgres -d prisma_hotel -f database.sql
```

El script crea todas las tablas y carga los datos iniciales: 3 sedes, 9 habitaciones, sus imágenes, un administrador y un cliente de prueba. Es un solo archivo y se puede ejecutar varias veces: borra y recrea las tablas cada vez.

### 3. Configurar y arrancar el backend

```bash
cd BACKEND_PRISMA
npm install
```

Crea un archivo llamado `.env` dentro de `BACKEND_PRISMA/` (no se sube a GitHub):

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=tu_contraseña_de_postgres
DB_NAME=prisma_hotel
JWT_SECRET=prisma_hotel_secret_2024
PORT=5000
```

Arranca el servidor:

```bash
npm run dev      # con nodemon (reinicia al guardar)
# o bien
node index.js
```

Debe quedar escuchando en **http://localhost:5000**.

### 4. Arrancar el frontend

Abre **otra terminal**:

```bash
cd FRONTEND_PRISMA
npm install
npm run dev
```

Abre **http://localhost:5173** en el navegador.

> Importante: backend (5000) y frontend (5173) deben estar corriendo al mismo tiempo, y PostgreSQL encendido.

---

## Usuarios de prueba

El script `database.sql` ya crea los dos usuarios, por lo que no hace falta registrar nada para empezar a probar:

| Rol           | Correo            | Contraseña |
| ------------- | ----------------- | ---------- |
| Administrador | admin@gmail.com   | 1234       |
| Cliente       | cliente@gmail.com | 1234       |

> Las contraseñas se guardan siempre como hash bcrypt. Si insertas un usuario a mano con la contraseña en texto plano, el login falla porque el backend usa `bcrypt.compare`. Los demás clientes se pueden crear desde la pantalla de registro de la app.

---

## Base de datos y relaciones

### Diagrama

```
cliente ───< reserva >─── habitacion >─── sede
                              │             │
                    imagen_habitacion   imagen_sede

administrador ───< admin_sede >─── sede
```

`───<` significa "uno a muchos".

### Tablas

| Tabla               | Descripción                         | Campos clave                                                                                                                          |
| ------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `cliente`           | Huéspedes registrados               | `id_cliente` (PK), `correo` (UNIQUE), `documento` (UNIQUE), `contraseña` (hash)                                                       |
| `administrador`     | Personal administrativo             | `id_administrador` (PK), `correo`, `documento` (UNIQUE), `contraseña` (hash)                                                          |
| `sede`              | Hoteles de la cadena                | `id_sede` (PK), nombre, ciudad, dirección, teléfono                                                                                   |
| `imagen_sede`       | Fotos de cada sede                  | `id_sede` (FK → sede), ruta                                                                                                           |
| `habitacion`        | Habitaciones de una sede            | `id_habitacion` (PK), `id_sede` (FK), número, tipo, precio por noche, capacidad de personas, estado                                   |
| `imagen_habitacion` | Fotos de cada habitación            | `id_habitacion` (FK → habitacion), ruta                                                                                               |
| `reserva`           | Reservas hechas por clientes        | `id_reserva` (PK), `id_cliente` (FK), `id_habitacion` (FK), fechas, noches, precio total, estado, `estado_pago`, cantidad de personas |
| `admin_sede`        | Qué administrador gestiona qué sede | `id_admin` (FK), `id_sede` (FK)                                                                                                       |

### Cómo funcionan las relaciones

- **Sede → Habitaciones (1:N):** una sede tiene muchas habitaciones; cada habitación pertenece a una sola sede.
- **Sede → Imágenes (1:N)** y **Habitación → Imágenes (1:N):** varias fotos por sede/habitación. Las rutas se traen agrupadas con `array_agg`.
- **Cliente → Reservas (1:N):** un cliente puede hacer muchas reservas.
- **Habitación → Reservas (1:N):** una habitación puede tener muchas reservas, pero **no solapadas** en fechas (el backend lo valida).
- **Administrador ↔ Sede (N:M):** un administrador puede gestionar varias sedes y una sede puede tener varios administradores. Se resuelve con la tabla intermedia `admin_sede`.

### Integridad referencial

Las llaves foráneas están activas, por lo que el orden de borrado importa: primero `reserva` y `admin_sede`, después `cliente` y `administrador`.

### Consultas relevantes

**JOIN para listar reservas con datos completos:**

```sql
SELECT r.*, c.nombre AS nombre_cliente, h.numero AS numero_habitacion, s.nombre AS nombre_sede
FROM reserva r
JOIN cliente c    ON r.id_cliente = c.id_cliente
JOIN habitacion h ON r.id_habitacion = h.id_habitacion
JOIN sede s       ON h.id_sede = s.id_sede;
```

**Agrupar imágenes en una sola fila:**

```sql
SELECT s.*, array_agg(i.ruta_imagen_sede) AS imagenes
FROM sede s
LEFT JOIN imagen_sede i ON s.id_sede = i.id_sede
GROUP BY s.id_sede;
```

**Validar disponibilidad (evitar solapamientos):**

```sql
SELECT * FROM reserva
WHERE id_habitacion = $1 AND estado = 'Activa'
AND ((fecha_inicio <= $2 AND fecha_fin >= $2)
  OR (fecha_inicio <= $3 AND fecha_fin >= $3)
  OR (fecha_inicio >= $2 AND fecha_fin <= $3));
```

---

## Arquitectura del backend

```
Petición HTTP
   ↓
Router (routes/)           ¿A qué función va?
   ↓
Middleware (middlewares/)  ¿Hay token? ¿El rol es correcto?
   ↓
Controlador (controllers/) Lógica de negocio
   ↓
Modelo (models/)           Consultas SQL
   ↓
PostgreSQL
```

- **Pool de conexiones (`pg`):** mantiene conexiones abiertas y las reutiliza, en lugar de abrir una por consulta.
- **Placeholders (`$1, $2…`):** los valores se pasan separados del SQL, lo que previene SQL Injection.
- **Variables de entorno (`.env`):** credenciales y secretos fuera del código.
- **Multer:** procesa `multipart/form-data` y guarda las imágenes en `uploads/`; el servidor las expone en `/uploads`.

### Métodos HTTP usados

| Método | Uso                                                          |
| ------ | ------------------------------------------------------------ |
| GET    | Consultar datos                                              |
| POST   | Crear (login, registro, reservas, sedes)                     |
| PUT    | Reemplazar un recurso completo                               |
| PATCH  | Cambiar solo un campo (estado de habitación, estado de pago) |
| DELETE | Eliminar                                                     |

---

## Autenticación y roles

- **bcryptjs:** las contraseñas se guardan como hash irreversible (`bcrypt.hash(pass, 10)`) y se verifican con `bcrypt.compare`.
- **JWT:** al iniciar sesión el servidor entrega un token firmado con `JWT_SECRET` que contiene `id`, `correo` y `rol`, y expira a las **8 horas**. El frontend lo envía en el header `Authorization: Bearer <token>`.
- **Login único:** un solo endpoint (`POST /api/auth/login`) busca el correo primero en `cliente` y luego en `administrador`; el rol sale de la tabla donde se encontró.
- **Middlewares:**
  - `verificarToken` → valida el token y llena `req.usuario` (401 si falla).
  - `soloAdmin` / `soloCliente` → validan el rol (403 si no coincide).
- **Frontend:** `AuthContext` guarda token y rol (también en `localStorage` para sobrevivir a recargas) y `RutaProtegida` redirige al login si no hay sesión o el rol no corresponde.

---

## Librerías utilizadas

### Backend (`BACKEND_PRISMA`)

| Librería       | Para qué se usa                                |
| -------------- | ---------------------------------------------- |
| `express`      | Servidor HTTP y enrutamiento                   |
| `pg`           | Cliente de PostgreSQL (Pool)                   |
| `bcryptjs`     | Hash y verificación de contraseñas             |
| `jsonwebtoken` | Crear y verificar tokens JWT                   |
| `dotenv`       | Cargar variables desde `.env`                  |
| `cors`         | Permitir peticiones del frontend (otro puerto) |
| `multer`       | Subida de imágenes                             |
| `nodemon`      | Reinicio automático en desarrollo              |
| `jest`         | Pruebas unitarias                              |

### Frontend (`FRONTEND_PRISMA`)

| Librería                     | Para qué se usa                                                 |
| ---------------------------- | --------------------------------------------------------------- |
| `react`                      | Interfaz de usuario basada en componentes                       |
| `vite`                       | Entorno de desarrollo y empaquetado rápido                      |
| `react-router-dom`           | Navegación entre páginas sin recargar                           |
| `axios`                      | Peticiones HTTP al backend                                      |
| `@mui/material`              | Componentes de interfaz (botones, cards, diálogos, formularios) |
| `@mui/icons-material`        | Íconos                                                          |
| `swiper`                     | Carruseles de imágenes con autoplay                             |
| `react-leaflet` + `leaflet`  | Mapas con OpenStreetMap (sin API key)                           |
| `react-day-picker`           | Calendario para elegir rango de fechas                          |
| `date-fns`                   | Manejo de fechas y locale en español                            |
| `yet-another-react-lightbox` | Visor de imágenes a pantalla completa                           |

### Pruebas

| Herramienta   | Tipo de prueba                           |
| ------------- | ---------------------------------------- |
| Jest          | Unitarias (backend)                      |
| Postman       | Integración (API)                        |
| Playwright    | End-to-end en Chromium, Firefox y WebKit |
| Apache JMeter | Rendimiento y carga                      |
| pgAdmin       | Integridad de datos                      |

---

## Flujos principales

### Login

1. El usuario envía correo y contraseña.
2. El backend busca en `cliente` y, si no está, en `administrador`.
3. Compara con `bcrypt.compare`.
4. Si es válido, genera el JWT con id, correo y rol.
5. El frontend lo guarda (Context + localStorage) y redirige según el rol.

### Reserva

1. El cliente elige sede → habitación (desde el listado o el detalle).
2. El calendario bloquea fechas pasadas y fechas ya reservadas.
3. El frontend calcula noches y total, y valida que la cantidad de personas no supere la capacidad.
4. El backend vuelve a verificar disponibilidad y crea la reserva con `estado_pago = 'Pendiente'`.
5. El cliente la ve en **Mis reservas**, completa el pago y pasa a `Pagado`.

### Imágenes

- **Imágenes iniciales:** están en `FRONTEND_PRISMA/public/img/` y la BD guarda `img/sedes/...`; se sirven desde el frontend (`:5173`).
- **Imágenes subidas por el admin:** se guardan en `BACKEND_PRISMA/uploads/` y la BD guarda `uploads/...`; se sirven desde el backend (`:5000`).
- La función `getImageUrl()` detecta el prefijo `uploads/` y elige la URL correcta.

---

## Pruebas

```bash
# Unitarias (backend)
cd BACKEND_PRISMA
npm test

# End-to-end (desde la raíz, con backend y frontend corriendo)
npx playwright test
```

> Los tests E2E usan credenciales de prueba. Asegúrate de que los correos y contraseñas en `e2e/*.spec.js` coincidan con los usuarios de `database.sql`: `cliente@gmail.com / 1234` y `admin@gmail.com / 1234`.

---

## Problemas comunes

| Síntoma                                                                   | Causa y solución                                                                              |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Login responde **500**                                                    | La columna debe llamarse exactamente `contraseña`. Recrea la BD con el `database.sql` actual. |
| Login dice "correo o contraseña incorrectos" con usuario recién insertado | La contraseña no está en hash bcrypt. Inserta el hash, no texto plano.                        |
| `password authentication failed`                                          | La clave en `DB_PASSWORD` del `.env` no coincide con la de PostgreSQL.                        |
| `ECONNREFUSED` al arrancar el backend                                     | PostgreSQL apagado o `DB_HOST`/puerto incorrectos.                                            |
| El frontend carga pero no muestra sedes                                   | El backend no está corriendo en el puerto 5000.                                               |
| Imágenes subidas no se ven                                                | Revisa que exista `BACKEND_PRISMA/uploads/` y que el backend esté activo.                     |
| `node_modules` o `.env` aparecen en Git                                   | El archivo debe llamarse `.gitignore` (no `.gitnore`).                                        |

---
