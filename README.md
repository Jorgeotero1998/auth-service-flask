# OteroAuth

**EN**: Auth Service (Flask) — JWT access/refresh  
**ES**: Servicio de Auth (Flask) — JWT access/refresh

## Live demo / Demo online
- **Web**: https://auth-service-flask.vercel.app
- **API docs**: https://auth-service-flask-api.onrender.com/docs
- **API health**: https://auth-service-flask-api.onrender.com/api/v1/health

## Stack
- Flask
- PostgreSQL
- Docker
- JWT

## Local setup (Docker)

`ash
cp .env.example .env
docker compose up --build
`

## Credentials (demo)

**EN**: Default demo admin is seeded from ADMIN_EMAIL / ADMIN_PASSWORD.  
**ES**: El admin demo se crea desde ADMIN_EMAIL / ADMIN_PASSWORD.

## Deploy

**EN**:
- Backend: Render (Blueprint via ender.yaml)
- Frontend: Vercel (Root Directory: web)

**ES**:
- Backend: Render (Blueprint con ender.yaml)
- Frontend: Vercel (Root Directory: web)
