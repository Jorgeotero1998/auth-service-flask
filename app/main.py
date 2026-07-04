from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from prometheus_client import CONTENT_TYPE_LATEST, generate_latest
from starlette.requests import Request
from starlette.responses import Response

from app.api.v1.router import api_router_v1
from app.core.config import settings
from app.core.logging import configure_logging, get_logger
from app.db.seed import ensure_admin_user
from app.db.session import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
    log = get_logger(__name__)
    log.info("app_starting", app_name=settings.app_name, env=settings.env)

    # lightweight DB connectivity check
    try:
        async with engine.connect() as conn:
            await conn.exec_driver_sql("SELECT 1")
    except Exception as e:  # noqa: BLE001
        log.error("db_connectivity_failed", error=str(e))
        raise

    try:
        await ensure_admin_user()
    except Exception as e:  # noqa: BLE001
        log.error("admin_seed_failed", error=str(e))

    yield

    log.info("app_stopping")


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    default_response_class=ORJSONResponse,
    lifespan=lifespan,
)

if settings.cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router_v1, prefix="/api/v1")


@app.get("/metrics", include_in_schema=False)
async def metrics():
    data = generate_latest()
    return Response(content=data, media_type=CONTENT_TYPE_LATEST)


@app.get("/", include_in_schema=False)
async def root():
    return {"name": settings.app_name, "status": "ok"}


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    log = get_logger("unhandled")
    log.error("unhandled_exception", path=request.url.path, error=str(exc))
    return ORJSONResponse(status_code=500, content={"detail": "Internal Server Error"})

