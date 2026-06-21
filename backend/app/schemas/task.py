from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    assigned_to: int

class TaskUpdate(BaseModel):
    status: str  # pending, in_progress, completed

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    assigned_to: int
    assigned_by: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True