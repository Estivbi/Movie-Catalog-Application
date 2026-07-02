# Pendientes

## Backend

- [ ] Crear `backend/.env` con `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `TMDB_API_READ_TOKEN` y `ADMIN_EMAIL` reales.
- [ ] Revisar el endpoint `GET /movies/:tmdbId` para incluir mejor manejo de errores cuando TMDB o Supabase fallen.
- [ ] Añadir `GET /users/me` con el perfil bien resuelto si falta el registro en `profiles`.
- [ ] Preparar los endpoints de admin para posibles filtros o paginación si el volumen crece.

## Frontend

- [ ] Separar la vista de detalle de película en una página propia.
- [ ] Crear las páginas `Movie`, `Profile` y `Admin`.
- [ ] Instalar y configurar shadcn/ui real sobre la base preparada.
- [ ] Añadir componentes funcionales de shadcn/ui para formularios, diálogos, tablas y botones.
- [ ] Sustituir los componentes base por versiones finales de shadcn/ui donde aporte valor.
- [ ] Añadir la experiencia visual final tipo Magic UI en el catálogo, con animaciones más cuidadas.
- [ ] Conectar autenticación visual en el frontend con Supabase Auth.
- [ ] Consumir `GET /users/me` para mostrar perfil, comentarios y ratings.
- [ ] Consumir `GET /admin/comments` y `PATCH /admin/comments/:id` en el panel de admin.

## Producto y cierre

- [ ] Revisar textos finales en español en toda la app.
- [ ] Ajustar responsive mobile-first en todas las pantallas.
- [ ] Añadir estados vacíos y mensajes de error más cuidados.
- [ ] Verificar que `VITE_API_BASE_URL` esté documentado para evitar `Failed to fetch`.
- [ ] Revisar el README final y dejarlo listo para la prueba técnica.
- [ ] Hacer una pasada final de limpieza de código y eliminar lo que no se use.

## Fuera de alcance por ahora

- [ ] Upload de imágenes.
- [ ] Tests automatizados.
- [ ] Rate limiting.
- [ ] Flag/unflag de reviews.