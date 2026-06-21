from pydantic import BaseModel
from typing import List, Optional

class SearchResult(BaseModel):
    document_id: int
    filename: str
    content_preview: str
    relevance_score: float

class SearchResponse(BaseModel):
    query: str
    results: List[SearchResult]