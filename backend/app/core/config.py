# app/core/config.py
import os
from dotenv import load_dotenv
from typing import Optional

# Load environment variables from .env file
load_dotenv()

class Settings:
    """
    Application settings and configuration.
    All settings can be overridden via environment variables.
    """
    
    # ============ SECURITY SETTINGS ============
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-change-me-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440))
    REFRESH_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_MINUTES", 10080))  # 7 days
    
    # ============ DATABASE SETTINGS ============
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "mysql+pymysql://root:password@localhost:3306/task_management"
    )
    DATABASE_POOL_SIZE: int = int(os.getenv("DATABASE_POOL_SIZE", 10))
    DATABASE_MAX_OVERFLOW: int = int(os.getenv("DATABASE_MAX_OVERFLOW", 20))
    DATABASE_POOL_TIMEOUT: int = int(os.getenv("DATABASE_POOL_TIMEOUT", 30))
    DATABASE_ECHO: bool = os.getenv("DATABASE_ECHO", "False").lower() == "true"
    
    # ============ AI/ML SETTINGS ============
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
    EMBEDDING_DIMENSION: int = 384  # all-MiniLM-L6-v2 embedding dimension
    FAISS_INDEX_PATH: str = os.getenv("FAISS_INDEX_PATH", "faiss_index.bin")
    METADATA_PATH: str = os.getenv("METADATA_PATH", "metadata.pkl")
    CHUNK_SIZE: int = int(os.getenv("CHUNK_SIZE", 500))  # Words per chunk
    CHUNK_OVERLAP: int = int(os.getenv("CHUNK_OVERLAP", 100))  # Overlap between chunks
    TOP_K_RESULTS: int = int(os.getenv("TOP_K_RESULTS", 5))  # Default number of search results
    
    # ============ FILE UPLOAD SETTINGS ============
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", 10485760))  # 10MB in bytes
    ALLOWED_EXTENSIONS: list = os.getenv("ALLOWED_EXTENSIONS", ".txt,.pdf").split(",")
    
    # ============ SERVER SETTINGS ============
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", 8000))
    API_DEBUG: bool = os.getenv("API_DEBUG", "True").lower() == "true"
    API_PREFIX: str = "/api/v1"
    
    # ============ CORS SETTINGS ============
    CORS_ORIGINS: list = os.getenv(
        "CORS_ORIGINS", 
        "http://localhost:3000,http://127.0.0.1:3000"
    ).split(",")
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: list = ["*"]
    CORS_ALLOW_HEADERS: list = ["*"]
    
    # ============ LOGGING SETTINGS ============
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FILE: str = os.getenv("LOG_FILE", "app.log")
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # ============ RATE LIMITING ============
    RATE_LIMIT_ENABLED: bool = os.getenv("RATE_LIMIT_ENABLED", "True").lower() == "true"
    RATE_LIMIT_REQUESTS: int = int(os.getenv("RATE_LIMIT_REQUESTS", 100))
    RATE_LIMIT_PERIOD: int = int(os.getenv("RATE_LIMIT_PERIOD", 60))  # seconds
    
    # ============ EMAIL SETTINGS (Optional) ============
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", 587))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", "noreply@taskmanagement.com")
    
    # ============ REDIS SETTINGS (Optional) ============
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    REDIS_ENABLED: bool = os.getenv("REDIS_ENABLED", "False").lower() == "true"
    
    # ============ DEVELOPMENT SETTINGS ============
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")  # development, staging, production
    
    @property
    def IS_PRODUCTION(self) -> bool:
        return self.ENVIRONMENT == "production"
    
    @property
    def IS_DEVELOPMENT(self) -> bool:
        return self.ENVIRONMENT == "development"
    
    @property
    def IS_STAGING(self) -> bool:
        return self.ENVIRONMENT == "staging"
    
    def get_allowed_extensions_list(self) -> list:
        """Return list of allowed file extensions"""
        return [ext.strip() for ext in self.ALLOWED_EXTENSIONS if ext.strip()]
    
    def get_cors_origins_list(self) -> list:
        """Return list of allowed CORS origins"""
        return [origin.strip() for origin in self.CORS_ORIGINS if origin.strip()]
    
    def get_database_url(self) -> str:
        """Get database URL with proper driver"""
        if self.DATABASE_URL.startswith("mysql://"):
            # Ensure we're using pymysql driver
            self.DATABASE_URL = self.DATABASE_URL.replace("mysql://", "mysql+pymysql://")
        return self.DATABASE_URL
    
    def validate_settings(self) -> None:
        """Validate critical settings are set properly"""
        if self.IS_PRODUCTION:
            # In production, ensure SECRET_KEY is not the default
            if self.SECRET_KEY == "super-secret-key-change-me-in-production":
                raise ValueError("SECRET_KEY must be changed in production!")
            
            # Ensure database URL uses production database
            if "localhost" in self.DATABASE_URL and "production" in self.ENVIRONMENT:
                import warnings
                warnings.warn("Using localhost database in production is not recommended!")
    
    class Config:
        """Pydantic config"""
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"

# Create a single instance of settings
settings = Settings()

# Create upload directory if it doesn't exist
if not os.path.exists(settings.UPLOAD_DIR):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

# Validate settings on import
settings.validate_settings()

# Print startup information (only in development)
if settings.IS_DEVELOPMENT:
    print("\n" + "="*60)
    print("TASK MANAGEMENT SYSTEM - CONFIGURATION")
    print("="*60)
    print(f"Environment: {settings.ENVIRONMENT}")
    print(f"API URL: http://{settings.API_HOST}:{settings.API_PORT}")
    print(f"Database: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else settings.DATABASE_URL}")
    print(f"Upload Directory: {settings.UPLOAD_DIR}")
    print(f"Embedding Model: {settings.EMBEDDING_MODEL}")
    print(f"Debug Mode: {settings.API_DEBUG}")
    print("="*60 + "\n")