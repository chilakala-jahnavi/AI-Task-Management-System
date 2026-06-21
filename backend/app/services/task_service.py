# app/services/task_service.py
from sqlalchemy.orm import Session
from app.models.task import Task
from app.models.user import User
from app.models.activity_log import ActivityLog
from fastapi import HTTPException
from sqlalchemy.sql import func

class TaskService:
    @staticmethod
    def create_task(db: Session, title: str, description: str, assigned_to: int, assigned_by: int):
        # Verify user exists
        user = db.query(User).filter(User.id == assigned_to).first()
        if not user:
            raise HTTPException(status_code=404, detail="Assigned user not found")
        
        task = Task(
            title=title,
            description=description,
            assigned_to=assigned_to,
            assigned_by=assigned_by
        )
        db.add(task)
        db.commit()
        db.refresh(task)
        
        # Log activity
        log = ActivityLog(
            user_id=assigned_by,
            action="task_update",
            details=f"Created task: {title} for user {assigned_to}"
        )
        db.add(log)
        db.commit()
        
        return task
    
    @staticmethod
    def get_tasks(db: Session, user_id: int, role: str, status: str = None, assigned_to: int = None):
        query = db.query(Task)
        
        # Apply role-based filtering
        if role == "user":
            # Regular users can only see their own tasks
            query = query.filter(Task.assigned_to == user_id)
        elif assigned_to is not None:
            # Admin can filter by assigned user
            query = query.filter(Task.assigned_to == assigned_to)
        
        # Apply status filter if provided
        if status:
            query = query.filter(Task.status == status)
        
        return query.order_by(Task.created_at.desc()).all()
    
    @staticmethod
    def update_task_status(db: Session, task_id: int, user_id: int, new_status: str):
        task = db.query(Task).filter(Task.id == task_id).first()
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        # Check if user is assigned to this task or is admin
        if task.assigned_to != user_id:
            user = db.query(User).filter(User.id == user_id).first()
            if user.role != "admin":
                raise HTTPException(status_code=403, detail="Not authorized to update this task")
        
        # Update status
        old_status = task.status
        task.status = new_status
        db.commit()
        
        # Log activity
        log = ActivityLog(
            user_id=user_id,
            action="task_update",
            details=f"Task {task_id} status changed from {old_status} to {new_status}"
        )
        db.add(log)
        db.commit()
        
        return task