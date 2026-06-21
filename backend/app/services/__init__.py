# app/services/__init__.py
from app.services.auth_service import AuthService
from app.services.task_service import TaskService
from app.services.document_service import DocumentService
from app.services.search_service import SearchService
from app.services.analytics_service import AnalyticsService

__all__ = [
    "AuthService",
    "TaskService",
    "DocumentService",
    "SearchService",
    "AnalyticsService"
]