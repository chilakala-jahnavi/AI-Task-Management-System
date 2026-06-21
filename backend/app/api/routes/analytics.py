# app/api/routes/analytics.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.analytics_service import AnalyticsService
from app.core.security import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard")
def get_analytics(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Only admins can see full analytics
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can view analytics")
    
    try:
        stats = AnalyticsService.get_dashboard_stats(db)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching analytics: {str(e)}")