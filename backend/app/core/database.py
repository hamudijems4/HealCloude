from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from supabase import create_client, Client
from .config import settings
import logging

logger = logging.getLogger(__name__)

# ── Supabase clients ──────────────────────────────────────────────────────────
supabase_anon: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
supabase_admin: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

# ── PostgreSQL (Supabase Postgres via asyncpg) ────────────────────────────────
engine = create_async_engine(settings.POSTGRES_URL, echo=settings.DEBUG, pool_pre_ping=True)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


# ── MongoDB (optional — FHIR unstructured resources) ─────────────────────────
# Lazy-initialized so startup doesn't crash if MongoDB is unavailable
try:
    from motor.motor_asyncio import AsyncIOMotorClient
    _mongo_client: "AsyncIOMotorClient | None" = None
    _mongo_available = True
except ImportError:
    _mongo_available = False
    _mongo_client = None


def get_mongo_client():
    global _mongo_client
    if not _mongo_available:
        raise RuntimeError("motor not installed")
    if _mongo_client is None:
        from motor.motor_asyncio import AsyncIOMotorClient
        _mongo_client = AsyncIOMotorClient(settings.MONGO_URL, serverSelectionTimeoutMS=3000)
    return _mongo_client


def get_fhir_db():
    return get_mongo_client()[settings.MONGO_DB]
