# OteroAuth

**EN**: Auth Service (Flask) â€” JWT access/refresh  
**ES**: Servicio de Auth (Flask) â€” JWT access/refresh

## Live demo / Demo online
- **Web**: https://<vercel-project>.vercel.app
- **API docs**: https://<render-service>.onrender.com/docs
- **API health**: https://<render-service>.onrender.com/api/v1/health

## Stack
- Flask
- PostgreSQL
- Docker
- JWT

## Local setup (Docker)

    cp .env.example .env
    docker compose up --build

## Credentials (demo)

**EN**: Default demo admin is seeded from ADMIN_EMAIL / ADMIN_PASSWORD.
**ES**: El admin demo se crea desde ADMIN_EMAIL / ADMIN_PASSWORD.

## Deploy

**EN**:
- Backend: Render (Blueprint via render.yaml)
- Frontend: Vercel (Root Directory: web)
- Set VITE_API_BASE_URL to your Render URL.

**ES**:
- Backend: Render (Blueprint con render.yaml)
- Frontend: Vercel (Root Directory: web)
- Setear VITE_API_BASE_URL con la URL de Render.
