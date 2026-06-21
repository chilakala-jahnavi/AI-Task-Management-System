# app/services/search_service.py
from sqlalchemy.orm import Session
from app.core.embedding import embedding_manager
from app.models.activity_log import ActivityLog
from app.models.document import Document

class SearchService:
    @staticmethod
    def semantic_search(db: Session, query: str, user_id: int, top_k: int = 5):
        # Log search activity
        log = ActivityLog(
            user_id=user_id,
            action="search",
            details=f"Searched: '{query}'"
        )
        db.add(log)
        db.commit()
        
        # Get search results from vector DB
        results = embedding_manager.search(query, top_k)
        
        # Enrich results with document metadata
        doc_ids = [r["document_id"] for r in results if r["document_id"]]
        if not doc_ids:
            return []
        
        docs = db.query(Document).filter(Document.id.in_(doc_ids)).all()
        doc_map = {doc.id: doc for doc in docs}
        
        enriched_results = []
        for r in results:
            doc = doc_map.get(r["document_id"])
            if doc:
                enriched_results.append({
                    "document_id": r["document_id"],
                    "filename": doc.filename,
                    "content_preview": r["content"][:200] + "..." if len(r["content"]) > 200 else r["content"],
                    "relevance_score": r["relevance_score"]
                })
        
        return enriched_results