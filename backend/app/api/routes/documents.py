# backend/app/api/routes/documents.py
from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.document_service import DocumentService
from app.core.security import get_current_user

router = APIRouter(prefix="/documents", tags=["documents"])

@router.post("/upload")
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "admin":
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Only admins can upload documents")
    
    doc = DocumentService.upload_document(
        db=db,
        file=file,
        user_id=int(current_user["sub"])
    )
    return {
        "message": "Document uploaded and processed",
        "document_id": doc.id,
        "filename": doc.filename,
        "chunks_processed": len(doc.content_text) // 500 + 1  # approximation
    }

@router.get("/")
def list_documents(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    from app.models.document import Document
    docs = db.query(Document).all()
    return [{"id": d.id, "filename": d.filename, "uploaded_by": d.uploaded_by, 
             "uploaded_at": d.created_at} for d in docs]