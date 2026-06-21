# app/schemas/analytics.py
from pydantic import BaseModel
from typing import List, Optional

class MostSearchedQuery(BaseModel):
    query: str
    count: int

class UserStats(BaseModel):
    total: int
    admins: int
    regular_users: int

class RecentActivity(BaseModel):
    action: str
    details: str
    created_at: str

class AnalyticsResponse(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    in_progress_tasks: int
    completion_rate: str
    most_searched_queries: List[MostSearchedQuery]
    user_stats: UserStats
    recent_activities: List[RecentActivity]