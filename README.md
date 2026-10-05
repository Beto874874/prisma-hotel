# Documentación Técnica — Proyecto Prisma Hotel

## Stack Tecnológico

| Capa             | Tecnología |
|------------------|------------|
| Frontend         | React + Vite + Material UI |
| Backend          | Express (Node.js)          |
| Base de datos    | PostgreSQL                 |
| Autenticación    | JWT + bcryptjs             |

Este stack se conoce como **PERN** (PostgreSQL, Express, React, Node.js).

---

## 1. Autenticación y Seguridad

### 1.1 ¿Por qué necesitamos autenticación?

HTTP es un protocolo **sin memoria**. Cada petición que hace el frontend al backend es completamente independiente — el servidor no recuerda quién hizo la petición anterior. Esto genera un problema: ¿cómo sabe el servidor quién está logueado y qué permisos tiene?

La solución es el **JWT (JSON Web Token)**.

### 1.2 bcryptjs — Encriptación de contraseñas

Nunca se guarda una contraseña en texto plano en la base de datos. Si alguien accede a la BD, vería las contraseñas directamente.

**bcryptjs** convierte la contraseña en un hash irreversible:

```
"1234" → "$2b$10$0cEF2ftM3GMptY/j2SN9O.06lH9T8HeceDClZys6E/BoZhw2aqsXm"
```

- `bcrypt.hash(contraseña, 10)` — encripta. El `10` son las "rondas" de encriptación (más alto = más seguro pero más lento).
- `bcrypt.compare(contraseña, hash)` — compara la contraseña ingresada con el hash guardado. Devuelve `true` o `false`. No hay forma de "desencriptar" bcrypt.

### 1.3 JWT — JSON Web Token

#### ¿Qué es?

Es como una **manilla de evento**. Cuando el usuario hace login, el servidor le da una manilla (token). En cada petición siguiente, el usuario presenta esa manilla en lugar de volver a ingresar sus credenciales.

#### Analogía completa

```
1. Usuario llega al concierto → muestra cédula (correo + contraseña)
2. Portero verifica y da una manilla (genera el token)
3. Para entrar a zona VIP → muestra la manilla (manda el token)
4. La manilla vence a las 8 horas (expiresIn: '8h')
```

#### ¿Cómo se ve un token?

```
eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiY29ycmVvIjoianVhbkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIn0.xyz123
```

Son tres partes separadas por puntos:

```
HEADER . PAYLOAD . FIRMA
```

- **Header** — algoritmo de firma usado (HS256)
- **Payload** — los datos: id, correo, rol, cuándo vence
- **Firma** — generada con el JWT_SECRET, garantiza que nadie modificó el token

#### ¿Cómo funciona el secreto?

El `JWT_SECRET` es una palabra clave que solo el servidor conoce. Al generar el token, los datos se "mezclan matemáticamente" con ese secreto para crear la firma. Si alguien modifica el token (por ejemplo para cambiar su rol de "cliente" a "admin"), la firma ya no coincide y el servidor lo rechaza.

```javascript
// Generar token
const token = jwt.sign(
  { id: usuario.id, correo: usuario.correo, rol },
  process.env.JWT_SECRET,
  { expiresIn: '8h' }
)

// Verificar token
const decoded = jwt.verify(token, process.env.JWT_SECRET)
```

### 1.4 Manejo de Roles

El sistema tiene dos roles: `cliente` y `admin`.

**¿Cómo se asigna el rol?**

Al hacer login, el backend busca el correo primero en la tabla `cliente`, luego en `administrador`. Según en cuál tabla lo encuentre, asigna el rol correspondiente en el JWT.

**¿Cómo se protegen las rutas?**

Con dos middlewares encadenados:

```javascript
router.get('/dashboard', verificarToken, soloAdmin, getDashboard)
//                          ↑                ↑
//                    ¿Token válido?    ¿Es admin?
```

1. `verificarToken` — lee el token del header, lo verifica con el secreto y guarda los datos en `req.usuario`
2. `soloAdmin` / `soloCliente` — lee `req.usuario.rol` y decide si deja pasar o no

**Diferencia entre 401 y 403:**
- `401 Unauthorized` — "No sé quién eres" (token inválido o ausente)
- `403 Forbidden` — "Sé quién eres pero no tienes permiso" (rol incorrecto)

### 1.5 localStorage — Persistencia de sesión

El token JWT vive en memoria (useState). Si el usuario recarga la página, React se reinicia y pierde el token → el usuario queda deslogueado.

Para evitarlo, guardamos el token en `localStorage`, que persiste aunque se recargue:

```javascript
// Al hacer login
localStorage.setItem('token', token)
localStorage.setItem('rol', rol)

// Al iniciar la app
const [token, setToken] = useState(localStorage.getItem('token') || null)

// Al cerrar sesión
localStorage.removeItem('token')
localStorage.removeItem('rol')
```

---

## 2. Arquitectura del Backend

### 2.1 Estructura de capas

```
Petición HTTP
      ↓
   Router (routes/)          → ¿A qué función va esta petición?
      ↓
  Middleware (middlewares/)  → ¿Tiene token? ¿Tiene el rol correcto?
      ↓
  Controlador (controllers/) → Lógica de negocio, toma decisiones
      ↓
   Modelo (models/)          → Habla con PostgreSQL
      ↓
  PostgreSQL
```

### 2.2 Pool de conexiones (pg)

En lugar de abrir y cerrar una conexión por cada consulta (lento), el `Pool` mantiene varias conexiones abiertas y las presta cuando se necesitan:

```javascript
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

// Usar el pool
const resultado = await pool.query('SELECT * FROM cliente WHERE correo = $1', [correo])
```

Los `$1, $2...` son **placeholders** que evitan SQL Injection. En lugar de concatenar strings directamente en el SQL, los valores se pasan separados y pg los inserta de forma segura.

### 2.3 Variables de entorno (.env)

Las credenciales nunca van escritas en el código. Van en `.env`:

```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=micontraseña
JWT_SECRET=prisma_hotel_secret_2024
PORT=5000
```

Esto protege la información sensible y facilita cambiar configuraciones sin tocar el código.

### 2.4 Multer — Subida de imágenes

Las imágenes no se pueden mandar como JSON. Necesitan ir como `multipart/form-data`. **Multer** es el middleware que procesa ese tipo de petición:

```javascript
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/sedes'),
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`)
})
```

- Guarda el archivo en la carpeta `uploads/`
- Le asigna un nombre único basado en el timestamp para evitar duplicados
- El backend sirve esos archivos estáticamente: `app.use('/uploads', express.static('uploads'))`

### 2.5 Métodos HTTP

| Método | Uso                                   |
|--------|---------------------------------------|
| GET    | Obtener datos                         |
| POST   | Crear un nuevo recurso                |
| PUT    | Actualizar un recurso completo        |
| PATCH  | Actualizar solo una parte del recurso |
| DELETE | Eliminar un recurso                   |

**PATCH vs PUT:** `PUT` reemplaza todo el objeto, `PATCH` solo modifica los campos indicados. Usamos `PATCH` para cambiar el estado de una habitación o el estado de pago de una reserva.

---

## 3. Arquitectura del Frontend

### 3.1 React + Vite

**Vite** es la herramienta de construcción — más rápida que Create React App. **React** es la librería de interfaz de usuario.

#### ¿Cómo funciona React?

React convierte componentes JSX en elementos del DOM. Cuando el estado cambia, React re-renderiza solo los componentes afectados (no recarga la página).

```jsx
// Un componente es simplemente una función que devuelve JSX
const MiComponente = () => {
  const [contador, setContador] = useState(0)
  
  return <button onClick={() => setContador(contador + 1)}>{contador}</button>
}
```

### 3.2 Context API — Estado global

El problema: varios componentes necesitan saber quién está logueado (token, rol). Pasar esa información de componente en componente sería un caos.

**Context** crea un "estado global" accesible desde cualquier componente:

```javascript
// Crear el contexto
const AuthContext = createContext()

// Proveedor que envuelve toda la app
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [rol, setRol] = useState(localStorage.getItem('rol') || null)
  // ...
}

// Hook para consumirlo fácilmente
export const useAuth = () => useContext(AuthContext)

// Usar en cualquier componente
const { token, rol, login, logout } = useAuth()
```

### 3.3 React Router DOM — Navegación

Permite tener múltiples "páginas" en React sin recargar el navegador:

```jsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/home" element={<HomePage />} />
  <Route path="/admin" element={<AdminPage />} />
</Routes>
```

**Rutas protegidas:** El componente `RutaProtegida` verifica si hay token y si el rol es el correcto antes de mostrar la página. Si no, redirige al login:

```jsx
const RutaProtegida = ({ children, rolRequerido }) => {
  const { token, rol } = useAuth()
  if (!token) return <Navigate to="/login" />
  if (rolRequerido && rol !== rolRequerido) return <Navigate to="/login" />
  return children
}
```

### 3.4 Axios — Peticiones HTTP

Axios es una librería para hacer peticiones HTTP desde el frontend. Es más cómodo que `fetch`:

```javascript
// Con fetch
const respuesta = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  body: JSON.stringify(datos)
})
const data = await respuesta.json()

// Con axios (equivalente, más limpio)
const respuesta = await axios.post(url, datos, {
  headers: { Authorization: `Bearer ${token}` }
})
const data = respuesta.data
```

Axios agrega automáticamente el `Content-Type: application/json`.

### 3.5 Material UI (MUI v9)

Librería de componentes pre-diseñados. En lugar de crear botones, cards e inputs desde cero, MUI los provee listos:

```jsx
<Button variant="contained" startIcon={<Add />}>Nueva sede</Button>
<Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>...</Card>
<TextField label="Correo" type="email" fullWidth />
```

**Tema global:** Define colores y tipografías una sola vez y se aplican a toda la app:

```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#2890BD' },
    secondary: { main: '#D1F3FF' }
  },
  typography: {
    fontFamily: 'Raleway, sans-serif',
    h1: { fontFamily: 'Lato, sans-serif' }
  }
})
```

**Grid v9:** En MUI v9 el sistema de grid cambió su sintaxis:

```jsx
// MUI v9 (nueva sintaxis)
<Grid container spacing={4}>
  <Grid size={{ xs: 12, md: 4 }}>...</Grid>
</Grid>

// MUI v8 y anteriores (sintaxis vieja — NO usar)
<Grid container spacing={4}>
  <Grid item xs={12} md={4}>...</Grid>
</Grid>
```

---

## 4. Librerías adicionales

### 4.1 Swiper — Carruseles

Librería para carruseles de imágenes profesionales con autoplay y paginación:

```jsx
<Swiper
  modules={[Autoplay, Pagination]}
  autoplay={{ delay: 3000 }}
  pagination={{ clickable: true }}
  loop={true}
>
  {imagenes.map((img, index) => (
    <SwiperSlide key={index}>
      <img src={img} />
    </SwiperSlide>
  ))}
</Swiper>
```

### 4.2 React Leaflet — Mapas

Integración de OpenStreetMap (gratuito, sin API key) para mostrar la ubicación de cada sede:

```jsx
<MapContainer center={[10.3910, -75.4794]} zoom={13}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  <Marker position={coords}>
    <Popup>Prisma Mar Cartagena</Popup>
  </Marker>
</MapContainer>
```

### 4.3 React Day Picker — Calendario

Calendario interactivo para seleccionar rangos de fechas. Permite bloquear días pasados y fechas ya reservadas:

```jsx
<DayPicker
  mode="range"
  onSelect={handleSelect}
  locale={es}  // español (date-fns)
  disabled={[
    { before: new Date() },  // bloquea fechas pasadas
    ...diasOcupados           // bloquea fechas reservadas
  ]}
/>
```

### 4.4 Yet Another React Lightbox

Permite ver las imágenes de habitaciones en tamaño completo al hacer click:

```jsx
<Lightbox
  open={lightboxAbierto}
  close={() => setLightboxAbierto(false)}
  slides={imagenes.map(img => ({ src: img }))}
/>
```

---

## 5. Base de Datos

### 5.1 Modelo Relacional

```
cliente ──────── reserva ──────── habitacion ──────── sede
                                       │                │
                              imagen_habitacion    imagen_sede
                              
administrador ──── admin_sede ──── sede
```

### 5.2 Consultas con JOIN

Para traer información de varias tablas en una sola consulta:

```sql
SELECT r.*, 
  c.nombre AS nombre_cliente,
  h.numero AS numero_habitacion,
  s.nombre AS nombre_sede
FROM reserva r
JOIN cliente c ON r.id_cliente = c.id_cliente
JOIN habitacion h ON r.id_habitacion = h.id_habitacion
JOIN sede s ON h.id_sede = s.id_sede
```

### 5.3 array_agg — Agrupar imágenes

Como una sede tiene múltiples imágenes, usamos `array_agg` para traerlas todas en una sola fila:

```sql
SELECT s.*, array_agg(i.ruta_imagen_sede) as imagenes
FROM sede s
LEFT JOIN imagen_sede i ON s.id_sede = i.id_sede
GROUP BY s.id_sede
```

Resultado:
```json
{
  "nombre": "Prisma Mar Cartagena",
  "imagenes": ["img/sedes/sede_cartagena1.jpg", "img/sedes/sede_cartagena2.jpg"]
}
```

### 5.4 Validación de disponibilidad

Para evitar reservas duplicadas en las mismas fechas:

```sql
SELECT * FROM reserva
WHERE id_habitacion = $1
AND estado = 'Activa'
AND (
  (fecha_inicio <= $2 AND fecha_fin >= $2) OR
  (fecha_inicio <= $3 AND fecha_fin >= $3) OR
  (fecha_inicio >= $2 AND fecha_fin <= $3)
)
```

Esto cubre todos los casos de solapamiento de fechas.

---

## 6. Flujos principales

### 6.1 Flujo de Login

```
1. Usuario manda correo + contraseña
2. Backend busca en tabla cliente
3. Si no está, busca en tabla administrador
4. Compara contraseña con bcrypt.compare()
5. Si es válida, genera JWT con id, correo y rol
6. Devuelve token al frontend
7. Frontend guarda token en localStorage y Context
8. React Router redirige según el rol
```

### 6.2 Flujo de Reserva

```
1. Cliente selecciona sede → habitación
2. Calendario muestra fechas bloqueadas (ya reservadas)
3. Cliente selecciona rango de fechas disponibles
4. Frontend calcula noches y precio total
5. Cliente confirma → backend verifica disponibilidad nuevamente
6. Si está disponible, crea la reserva con estado_pago: "Pendiente"
7. Redirige a "Mis Reservas"
8. Cliente ve botón "Completar pago"
9. Redirige a página de pago con formulario de tarjeta
10. Al confirmar, actualiza estado_pago: "Pagado"
```

### 6.3 Flujo de imágenes

```
Imágenes antiguas (manual):
  → Guardadas en frontend/public/img/
  → Ruta en BD: "img/sedes/sede_cartagena1.jpg"
  → Se sirven desde: http://localhost:5173/img/...

Imágenes nuevas (admin):
  → Subidas via Multer
  → Guardadas en backend/uploads/
  → Ruta en BD: "uploads/sedes/1234567890.jpg"
  → Se sirven desde: http://localhost:5000/uploads/...

getImageUrl() detecta cuál es cuál y usa la URL correcta.
```

---

## 7. Seguridad implementada

| Medida               | Descripción                                          |
|----------------------|------------------------------------------------------|
| bcrypt               | Contraseñas encriptadas en la BD                     |
| JWT                  | Autenticación sin estado con expiración              |
| Roles                | Rutas protegidas por rol en backend y frontend       |
| Placeholders SQL     | Prevención de SQL Injection                          |
| .env                 | Credenciales fuera del código                        |
| Multer fileFilter    | Solo se aceptan imágenes (jpg, png, webp)            |
| Validación de fechas | No se permiten reservas en fechas pasadas o solapadas|

---

## 8. Dependencias del proyecto

### Backend
```
express          → Servidor HTTP
pg               → Conexión a PostgreSQL
bcryptjs         → Encriptación de contraseñas
jsonwebtoken     → Generación y verificación de JWT
dotenv           → Variables de entorno
cors             → Permitir peticiones del frontend
multer           → Subida de archivos
nodemon          → Reinicio automático en desarrollo
```

### Frontend
```
react            → Librería de interfaz de usuario
react-router-dom → Navegación entre páginas
axios            → Peticiones HTTP al backend
@mui/material    → Componentes de interfaz
@mui/icons-material → Íconos
swiper           → Carruseles de imágenes
react-leaflet    → Mapas con OpenStreetMap
leaflet          → Base de react-leaflet
react-day-picker → Calendario interactivo
date-fns         → Utilidades de fechas (locale español)
yet-another-react-lightbox → Visor de imágenes en pantalla completa
```
