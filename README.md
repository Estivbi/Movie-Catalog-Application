# Movie Catalog Application

Aplicación fullstack para catálogo de películas orientada a una aerolínea.

El frontend consume películas desde TMDB en runtime y la base propia solo guarda comentarios, ratings y perfiles en Supabase.

## Stack

- Frontend: React 18 + TypeScript + Vite + Tailwind CSS + react-paginate
- UI: shadcn/ui como base conceptual + efectos visuales tipo Magic UI en el catálogo
- Backend: Node.js 20 + Express + TypeScript
- Auth y base de datos: Supabase Auth + PostgreSQL
- API externa: TMDB
- Deploy: Vercel para frontend y Render para backend

## Estructura

- `backend/`: API Express, auth, integración con Supabase y cliente TMDB
- `frontend/`: interfaz React, consumo del backend y navegación del catálogo

## Variables de entorno

### Backend

Crear `backend/.env` con valores reales. Si prefieres, copia antes desde [backend/.env.example](backend/.env.example):

```bash
PORT=3001
ADMIN_EMAIL=admin@example.com
TMDB_API_READ_TOKEN=your_tmdb_read_token
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Frontend

Crear `frontend/.env` con valores reales. Si prefieres, copia antes desde [frontend/.env.example](frontend/.env.example):

```bash
VITE_API_BASE_URL=http://localhost:3001
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Arranque local

Levantar primero el backend y después el frontend.

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

El backend queda en `http://localhost:3001`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend queda en `http://localhost:5173`.

## Flujo recomendado

1. Arranca el backend.
2. Comprueba `http://localhost:3001/health`.
3. Arranca el frontend.
4. Abre `http://localhost:5173`.

Si el frontend muestra `Failed to fetch`, casi siempre significa una de estas dos cosas:

- el backend no está corriendo
- `VITE_API_BASE_URL` no apunta al puerto correcto

## Endpoints principales

- `GET /movies` — catálogo popular de TMDB con paginación
- `GET /movies/:tmdbId` — detalle, comentarios visibles y rating medio
- `POST /comments` — crear comentario propio
- `PUT /comments/:id` — editar comentario propio
- `DELETE /comments/:id` — borrar comentario propio
- `POST /ratings` — crear o actualizar rating propio
- `GET /users/me` — perfil y actividad propia
- `GET /admin/comments` — moderación de comentarios
- `PATCH /admin/comments/:id` — alternar visibilidad

## Decisiones de arquitectura

- No se guardan películas en Supabase: se consultan en runtime desde TMDB.
- `tmdb_movie_id` es la clave de unión entre TMDB y los datos propios.
- El backend valida el JWT de Supabase antes de permitir acciones autenticadas.
- El admin se determina por `ADMIN_EMAIL` para mantener la prueba técnica simple y explícita.

## Qué queda fuera por ahora

- Upload de imágenes, porque el cover viene de TMDB
- Tests automatizados
- Rate limiting
- Flag/unflag de reviews

## Nota de transparencia

Parte de la implementación fue asistida con Claude Code. Las decisiones de arquitectura, stack y estructura siguen siendo propias del proyecto.
# Movie-Catalog-Application