# backend/app/api/routes/search.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.search_service import SearchService
from app.core.security import get_current_user

router = APIRouter(prefix="/search", tags=["search"])

@router.get("/")
def semantic_search(
    q: str = Query(..., description="Search query"),
    top_k: int = Query(5, description="Number of results"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    results = SearchService.semantic_search(
        db=db,
        query=q,
        user_id=int(current_user["sub"]),
        top_k=top_k
    )
    return {"query": q, "results": results}