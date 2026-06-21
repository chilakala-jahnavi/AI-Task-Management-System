# app/services/analytics_service.py
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.task import Task
from app.models.activity_log import ActivityLog
from app.models.user import User

class AnalyticsService:
    @staticmethod
    def get_dashboard_stats(db: Session):
        total_tasks = db.query(Task).count()
        completed_tasks = db.query(Task).filter(Task.status == "completed").count()
        pending_tasks = db.query(Task).filter(Task.status == "pending").count()
        in_progress_tasks = db.query(Task).filter(Task.status == "in_progress").count()
        
        completion_rate = 0
        if total_tasks > 0:
            completion_rate = (completed_tasks / total_tasks) * 100
        
        search_logs = db.query(
            ActivityLog.details,
            func.count(ActivityLog.id).label("count")
        ).filter(
            ActivityLog.action == "search"
        ).group_by(
            ActivityLog.details
        ).order_by(
            func.count(ActivityLog.id).desc()
        ).limit(5).all()
        
        most_searched = []
        for log in search_logs:
            query_text = log[0].replace("Searched: '", "").replace("'", "")
            most_searched.append({"query": query_text, "count": log[1]})
        
        total_users = db.query(User).count()
        admin_users = db.query(User).filter(User.role == "admin").count()
        regular_users = total_users - admin_users
        
        recent_activities = db.query(ActivityLog).order_by(
            ActivityLog.created_at.desc()
        ).limit(10).all()
        
        return {
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "pending_tasks": pending_tasks,
            "in_progress_tasks": in_progress_tasks,
            "completion_rate": f"{completion_rate:.1f}%",
            "most_searched_queries": most_searched,
            "user_stats": {"total": total_users, "admins": admin_users, "regular_users": regular_users},
            "recent_activities": [{"action": act.action, "details": act.details, "created_at": act.created_at.strftime("%Y-%m-%d %H:%M:%S")} for act in recent_activities]
        }
