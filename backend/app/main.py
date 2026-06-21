# app/main.py
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from sqlalchemy.orm import Session
from sqlalchemy import text
import uvicorn
import os
import sys
import io
import logging
from datetime import datetime
from typing import Optional

# Force UTF-8 encoding for console output (Windows fix)
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Import application modules
from app.core.config import settings
from app.db.session import engine, get_db
from app.db.base import Base
from app.api.routes import auth, tasks, documents, search, analytics

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format=settings.LOG_FORMAT,
    handlers=[
        logging.FileHandler(settings.LOG_FILE),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# ============ CREATE DATABASE TABLES ============
def create_tables():
    """Create all database tables if they don't exist"""
    try:
        logger.info("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("[OK] Database tables created/verified successfully")
    except Exception as e:
        logger.error(f"[ERROR] Error creating database tables: {e}")
        raise

create_tables()

# ============ INITIALIZE FASTAPI APP ============
app = FastAPI(
    title="AI-Powered Task & Knowledge Management System",
    description="""
    ## Welcome to the Task Management System API
    
    This system provides:
    - 📝 **Task Management** - Create, assign, and track tasks
    - 📄 **Document Management** - Upload and manage knowledge base documents
    - 🔍 **Semantic Search** - AI-powered search using embeddings
    - 📊 **Analytics Dashboard** - Track task completion and user activity
    - 🔐 **Authentication & RBAC** - Secure JWT-based authentication with role-based access
    
    ### Quick Links
    * [Swagger UI](#) - Interactive API documentation
    * [ReDoc](#) - Alternative API documentation
    """,
    version="1.0.0",
    docs_url=None,  # Disable default docs
    redoc_url=None,  # Disable default redoc
    openapi_url="/api/v1/openapi.json",
    contact={
        "name": "Task Management System",
        "email": "support@taskmanagement.com",
    },
    license_info={
        "name": "MIT",
    }
)

# ============ CORS MIDDLEWARE ============
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins_list(),
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
    expose_headers=["X-Total-Count", "X-Search-Results"],
)

# ============ CUSTOM EXCEPTION HANDLERS ============
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors with detailed messages"""
    errors = []
    for error in exc.errors():
        field = " -> ".join(str(loc) for loc in error.get("loc", []))
        msg = error.get("msg", "Invalid value")
        errors.append(f"{field}: {msg}")
    
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation error",
            "errors": errors,
            "timestamp": datetime.utcnow().isoformat()
        }
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions with consistent format"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "status_code": exc.status_code,
            "timestamp": datetime.utcnow().isoformat()
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all unhandled exceptions"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An unexpected error occurred",
            "error_type": exc.__class__.__name__,
            "timestamp": datetime.utcnow().isoformat()
        }
    )

# ============ ROUTE REGISTRATION ============
# Register API routes
app.include_router(
    auth.router,
    prefix=settings.API_PREFIX,
    tags=["Authentication"]
)
app.include_router(
    tasks.router,
    prefix=settings.API_PREFIX,
    tags=["Tasks"]
)
app.include_router(
    documents.router,
    prefix=settings.API_PREFIX,
    tags=["Documents"]
)
app.include_router(
    search.router,
    prefix=settings.API_PREFIX,
    tags=["Search"]
)
app.include_router(
    analytics.router,
    prefix=settings.API_PREFIX,
    tags=["Analytics"]
)

# ============ STATIC FILES (Optional) ============
# Uncomment if you want to serve static files
# app.mount("/static", StaticFiles(directory="static"), name="static")

# ============ CUSTOM DOCUMENTATION ENDPOINTS ============
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    """Custom Swagger UI documentation"""
    return get_swagger_ui_html(
        openapi_url=f"{settings.API_PREFIX}/openapi.json",
        title="Task Management System API Documentation",
        swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
        swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css",
        swagger_favicon_url="https://fastapi.tiangolo.com/img/favicon.png",
    )

@app.get("/redoc", include_in_schema=False)
async def custom_redoc_html():
    """Custom ReDoc documentation"""
    return get_redoc_html(
        openapi_url=f"{settings.API_PREFIX}/openapi.json",
        title="Task Management System API Documentation",
        redoc_js_url="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js",
    )

# ============ ROOT AND HEALTH ENDPOINTS ============
@app.get("/", include_in_schema=False)
async def root():
    """Root endpoint with system information"""
    return {
        "message": "[START] Task Management System API",
        "version": app.version,
        "environment": settings.ENVIRONMENT,
        "endpoints": {
            "api": settings.API_PREFIX,
            "docs": "/docs",
            "redoc": "/redoc",
            "health": "/health"
        },
        "status": "operational"
    }

@app.get("/health", include_in_schema=False)
async def health_check(db: Session = Depends(get_db)):
    """
    Health check endpoint for monitoring.
    Checks database connectivity and system status.
    """
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": settings.ENVIRONMENT,
        "version": app.version
    }
    
    # Check database
    try:
        db.execute(text("SELECT 1"))  # FIXED: wrapped with text()
        health_status["database"] = "connected"
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        health_status["database"] = "disconnected"
        health_status["status"] = "unhealthy"
    
    # Check file system
    try:
        upload_dir = settings.UPLOAD_DIR
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir, exist_ok=True)
        health_status["storage"] = "accessible"
    except Exception as e:
        logger.error(f"Storage health check failed: {e}")
        health_status["storage"] = "inaccessible"
        health_status["status"] = "unhealthy"
    
    # Check embedding model
    try:
        from app.core.embedding import embedding_manager
        if embedding_manager.model:
            health_status["embedding_model"] = "loaded"
        else:
            health_status["embedding_model"] = "not_loaded"
            health_status["status"] = "degraded"
    except Exception as e:
        logger.error(f"Embedding model health check failed: {e}")
        health_status["embedding_model"] = "error"
        health_status["status"] = "degraded"
    
    return health_status

# ============ STARTUP AND SHUTDOWN EVENTS ============
@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info("=" * 60)
    logger.info("[START] STARTING TASK MANAGEMENT SYSTEM")
    logger.info("=" * 60)
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Version: {app.version}")
    logger.info(f"API Prefix: {settings.API_PREFIX}")
    logger.info(f"Docs URL: /docs")
    logger.info(f"Health Check: /health")
    
    # Create upload directory if not exists
    if not os.path.exists(settings.UPLOAD_DIR):
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        logger.info(f"[OK] Created upload directory: {settings.UPLOAD_DIR}")
    
    # Log database connection
    logger.info(f"[OK] Database: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else 'configured'}")
    
    # Log embedding model
    try:
        from app.core.embedding import embedding_manager
        logger.info(f"[OK] Embedding model: {settings.EMBEDDING_MODEL}")
        logger.info(f"[OK] FAISS index: {len(embedding_manager.metadata)} chunks loaded")
    except Exception as e:
        logger.warning(f"[WARNING] Embedding model not initialized: {e}")
    
    # Log CORS origins
    logger.info(f"[OK] CORS origins: {settings.get_cors_origins_list()}")
    
    # Production safety checks
    if settings.IS_PRODUCTION:
        if settings.SECRET_KEY == "super-secret-key-change-me-in-production":
            logger.error("[ERROR] SECRET_KEY must be changed in production!")
            raise RuntimeError("SECRET_KEY must be changed in production!")
        
        if "localhost" in settings.DATABASE_URL:
            logger.warning("[WARNING] Using localhost database in production - this is not recommended!")
    
    logger.info("=" * 60)
    logger.info("[OK] APPLICATION STARTUP COMPLETE")
    logger.info("=" * 60)

@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    logger.info("=" * 60)
    logger.info("[STOP] SHUTTING DOWN TASK MANAGEMENT SYSTEM")
    logger.info("=" * 60)
    
    # Save FAISS index
    try:
        from app.core.embedding import embedding_manager
        embedding_manager.save_index()
        logger.info("[OK] FAISS index saved")
    except Exception as e:
        logger.error(f"[ERROR] Error saving FAISS index: {e}")
    
    logger.info("=" * 60)

# ============ MIDDLEWARE FOR REQUEST LOGGING ============
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests"""
    # Start timer
    start_time = datetime.utcnow()
    
    # Process request
    try:
        response = await call_next(request)
    except Exception as e:
        logger.error(f"Request failed: {e}")
        raise
    
    # Calculate duration
    duration = (datetime.utcnow() - start_time).total_seconds()
    
    # Log request
    logger.info(
        f"{request.method} {request.url.path} -> {response.status_code} ({duration:.2f}s)"
    )
    
    # Add custom headers
    response.headers["X-Response-Time"] = f"{duration:.2f}s"
    response.headers["X-API-Version"] = app.version
    
    return response

# ============ MIDDLEWARE FOR RATE LIMITING (Optional) ============
# Uncomment if you want rate limiting
"""
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
"""

# ============ CONDITIONAL DEBUG ROUTES ============
if settings.IS_DEVELOPMENT:
    @app.get("/debug/status", include_in_schema=False)
    async def debug_status():
        """Debug endpoint for development (only in development mode)"""
        return {
            "environment": settings.ENVIRONMENT,
            "debug_mode": settings.API_DEBUG,
            "database_url": settings.DATABASE_URL.replace(
                settings.DATABASE_URL.split("@")[0].split("://")[1].split(":")[0],
                "***"  # Hide password
            ) if "@" in settings.DATABASE_URL else settings.DATABASE_URL,
            "upload_dir": settings.UPLOAD_DIR,
            "embedding_model": settings.EMBEDDING_MODEL,
            "allowed_extensions": settings.get_allowed_extensions_list(),
            "cors_origins": settings.get_cors_origins_list(),
            "faiss_index_path": settings.FAISS_INDEX_PATH,
            "faiss_index_exists": os.path.exists(settings.FAISS_INDEX_PATH),
            "metadata_exists": os.path.exists(settings.METADATA_PATH),
        }

# ============ MAIN EXECUTION ============
if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.API_DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
        workers=1  # Use multiple workers for production
    )