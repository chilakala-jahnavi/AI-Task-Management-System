# backend/app/api/routes/tasks.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.task_service import TaskService
from app.core.security import get_current_user
from app.schemas.task import TaskCreate, TaskUpdate
from typing import Optional

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/")
def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "admin":
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Only admins can create tasks")
    
    task = TaskService.create_task(
        db=db,
        title=task_data.title,
        description=task_data.description,
        assigned_to=task_data.assigned_to,
        assigned_by=int(current_user["sub"])
    )
    return task

@router.get("/")
def get_tasks(
    status: Optional[str] = Query(None),
    assigned_to: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    tasks = TaskService.get_tasks(
        db=db,
        user_id=int(current_user["sub"]),
        role=current_user["role"],
        status=status,
        assigned_to=assigned_to
    )
    return tasks

@router.patch("/{task_id}")
def update_task(
    task_id: int,
    update_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    task = TaskService.update_task_status(
        db=db,
        task_id=task_id,
        user_id=int(current_user["sub"]),
        new_status=update_data.status
    )
    return task