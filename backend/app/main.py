from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy import text
from app.core.config import settings
from app.core.database import engine
from app.middleware.logging import RequestLoggingMiddleware
from app.api.v1.endpoints import auth, wellness, patients, moh
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Tables are managed by Supabase migrations — skip create_all
    # Just verify the DB connection is alive
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        logging.getLogger(__name__).info("Database connection OK")
    except Exception as e:
        logging.getLogger(__name__).warning(f"Database connection warning: {e}")
    yield
    await engine.dispose()


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(RequestLoggingMiddleware)

    prefix = settings.API_V1_PREFIX
    app.include_router(auth.router, prefix=prefix)
    app.include_router(wellness.router, prefix=prefix)
    app.include_router(patients.router, prefix=prefix)
    app.include_router(moh.router, prefix=prefix)

    @app.get("/health", tags=["Health"])
    async def health_check():
        return {"status": "healthy", "version": settings.APP_VERSION}

    return app


app = create_app()
