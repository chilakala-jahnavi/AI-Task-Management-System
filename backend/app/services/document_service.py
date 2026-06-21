# app/services/document_service.py
import os
from sqlalchemy.orm import Session
from app.models.document import Document
from app.models.activity_log import ActivityLog
from app.core.embedding import embedding_manager
from fastapi import UploadFile, HTTPException

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class DocumentService:
    @staticmethod
    def upload_document(db: Session, file: UploadFile, user_id: int):
        # Validate file type
        allowed_extensions = ['.txt']
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in allowed_extensions:
            raise HTTPException(status_code=400, detail="Only .txt files are allowed")
        
        # Save file
        safe_filename = f"{user_id}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, safe_filename)
        
        try:
            content = file.file.read()
            with open(file_path, "wb") as f:
                f.write(content)
            
            # Read text content
            with open(file_path, "r", encoding="utf-8") as f:
                text_content = f.read()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
        
        # Create document record
        doc = Document(
            filename=file.filename,
            file_path=file_path,
            file_type=ext,
            file_size=len(content),
            content_text=text_content,
            uploaded_by=user_id
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)
        
        # Process for embeddings (chunk the text)
        try:
            chunks = DocumentService.chunk_text(text_content)
            embedding_manager.add_document_chunks(doc.id, chunks)
            
            doc.is_processed = True
            db.commit()
        except Exception as e:
            print(f"Error processing embeddings: {str(e)}")
            doc.is_processed = False
            db.commit()
        
        # Log activity
        log = ActivityLog(
            user_id=user_id,
            action="document_upload",
            details=f"Uploaded document: {file.filename} (ID: {doc.id})"
        )
        db.add(log)
        db.commit()
        
        return doc
    
    @staticmethod
    def chunk_text(text: str, chunk_size: int = 500, overlap: int = 100) -> list:
        """Simple chunking by words with overlap"""
        if not text.strip():
            return ["Empty document"]
        
        words = text.split()
        chunks = []
        
        if len(words) <= chunk_size:
            return [" ".join(words)]
        
        for i in range(0, len(words), chunk_size - overlap):
            chunk = ' '.join(words[i:i+chunk_size])
            if chunk:
                chunks.append(chunk)
        
        return chunks if chunks else [text[:500]]
    
    @staticmethod
    def get_documents(db: Session, user_id: int, role: str):
        query = db.query(Document)
        if role == "user":
            # Regular users can only see documents they uploaded
            query = query.filter(Document.uploaded_by == user_id)
        return query.order_by(Document.created_at.desc()).all()