from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List


class Settings(BaseSettings):
    # App
    APP_NAME: str = "TenaLink API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"

    # Supabase
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str
    # Supabase JWT secret — found in Dashboard → Settings → API → JWT Secret
    SUPABASE_JWT_SECRET: str

    # Supabase Postgres (use Transaction pooler URL from Dashboard → Settings → Database)
    POSTGRES_URL: str

    # MongoDB (FHIR unstructured resources)
    MONGO_URL: str
    MONGO_DB: str = "tenalink_fhir"

    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # AI
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3"

    # Fayda ID
    FAYDA_API_URL: str = "https://api.fayda.et/v1"
    FAYDA_API_KEY: str = ""

    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]

    # Notifications
    AFRICASTALKING_KEY: str = ""
    AFRICASTALKING_USERNAME: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
