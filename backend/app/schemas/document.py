from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DocumentUploadResponse(BaseModel):
    message: str
    document_id: int
    filename: str
    chunks_processed: int

class DocumentListResponse(BaseModel):
    id: int
    filename: str
    uploaded_by: int
    uploaded_at: datetime

    class Config:
        from_attributes = True