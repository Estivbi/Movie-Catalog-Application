# Movie Catalog Application

Aplicación fullstack de catálogo de películas para una aerolínea. 
Los usuarios pueden explorar películas, comentar y puntuar. 
Hay panel de usuario y panel de admin para moderar contenido.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| UI | shadcn/ui + Magic UI |
| Backend | Node.js 20 + Express + TypeScript |
| Auth + DB | Supabase |
| Películas | TMDB API |

---

## Cómo funciona

Las películas no se guardan en base de datos — se traen de TMDB en 
tiempo real. En Supabase solo guardamos lo nuestro: comentarios, 
ratings y perfiles.

```
comments  (id, tmdb_movie_id, user_id, content, is_hidden, created_at)
ratings   (id, tmdb_movie_id, user_id, score 1-5, created_at)
profiles  (id, display_name, avatar_url)
```

El `tmdb_movie_id` es lo que une los datos de TMDB con los nuestros.

---

## Setup

### 1. Supabase

Crea un proyecto gratis en [supabase.com](https://supabase.com) y 
ejecuta este SQL en el editor:

```sql
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url   text,
  created_at   timestamptz default now()
);

create table public.comments (
  id            uuid primary key default gen_random_uuid(),
  tmdb_movie_id text        not null,
  user_id       uuid        not null references auth.users(id) on delete cascade,
  content       text        not null,
  is_hidden     boolean     not null default false,
  created_at    timestamptz not null default now()
);

create table public.ratings (
  id            uuid     primary key default gen_random_uuid(),
  tmdb_movie_id text     not null,
  user_id       uuid     not null references auth.users(id) on delete cascade,
  score         smallint not null check (score >= 1 and score <= 5),
  created_at    timestamptz not null default now(),
  unique (tmdb_movie_id, user_id)
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

Las claves las encuentras en **Project Settings → API**:
- `SUPABASE_URL` → Project URL
- `SUPABASE_SERVICE_ROLE_KEY` → service_role ⚠️ solo en backend
- `VITE_SUPABASE_ANON_KEY` → anon public

Si quieres probar rápido sin confirmar emails: **Authentication → 
Providers → Email → desmarcar "Confirm email"**.

### 2. TMDB

Crea cuenta en [themoviedb.org](https://www.themoviedb.org/signup) → 
Settings → API → Create. Necesitas el **API Read Access Token** 
(el largo que empieza por `eyJ...`), no la API Key corta.

### 3. Variables de entorno

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**backend/.env**
```env
PORT=3001
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
TMDB_API_READ_TOKEN=eyJ...
ADMIN_EMAIL=tu@email.com
```

**frontend/.env**
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_ADMIN_EMAIL=tu@email.com
```

---

## Arrancar

```bash
# Backend
cd backend && npm install && npm run dev
# → http://localhost:3001

# Frontend (otra terminal)
cd frontend && npm install && npm run dev
# → http://localhost:5173
```

Para verificar que el backend está ok: `GET /health` devuelve 
`{ "status": "ok" }`.

El admin es el usuario registrado con el email que pongas en 
`ADMIN_EMAIL`. Cuando entras con ese email aparece el enlace de 
admin en el navbar.

---

## Endpoints

| Método | Ruta | Auth | Qué hace |
|---|---|---|---|
| GET | `/health` | — | Estado del servidor |
| GET | `/movies` | — | Películas populares paginadas |
| GET | `/movies/:id` | — | Detalle + comentarios + rating medio |
| POST | `/comments` | ✅ | Crear comentario |
| PUT | `/comments/:id` | ✅ | Editar el tuyo |
| DELETE | `/comments/:id` | ✅ | Borrar el tuyo |
| POST | `/ratings` | ✅ | Valorar (upsert) |
| GET | `/users/me` | ✅ | Tu perfil y actividad |
| GET | `/admin/comments` | ✅ Admin | Todos los comentarios |
| PATCH | `/admin/comments/:id` | ✅ Admin | Mostrar/ocultar |

---

## Por qué tomé estas decisiones

**TMDB en runtime en lugar de guardar películas**
Guardar en base de datos lo que ya tiene TMDB no tiene sentido — 
datos duplicados y desactualizados. El `tmdb_movie_id` hace de 
puente entre la API y nuestros datos propios.

**Admin por email**
Para un solo administrador no necesito una tabla de roles. Una 
variable de entorno es suficiente, más sencillo y más fácil de 
auditar.

**Supabase**
Me evita gestionar PostgreSQL local y me da auth con JWT integrado. 
Si se quisiera migrar a instancia propia bastaría con cambiar las 
variables de entorno.

---

## Lo que no está (y por qué)

- **Upload de imágenes** — los covers vienen de TMDB
- **Tests** — next step prioritario
- **Rate limiting** — pendiente para producción
- **Flag/unflag de usuarios** — el enunciado lo marcaba como opcional

---

## Nota

He usado Claude Code (Anthropic) como asistente durante el desarrollo. La arquitectura, el stack y las decisiones técnicas son mías.