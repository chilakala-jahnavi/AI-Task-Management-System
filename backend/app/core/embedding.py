# backend/app/core/embedding.py
from sentence_transformers import SentenceTransformer
import numpy as np
import faiss
import pickle
import os
from app.core.config import settings

class EmbeddingManager:
    def __init__(self):
        self.model = SentenceTransformer(settings.EMBEDDING_MODEL)
        self.index = None
        self.metadata = []  # Stores (doc_id, chunk_text)
        self.load_index()
    
    def load_index(self):
        if os.path.exists(settings.FAISS_INDEX_PATH):
            self.index = faiss.read_index(settings.FAISS_INDEX_PATH)
            with open("metadata.pkl", "rb") as f:
                self.metadata = pickle.load(f)
        else:
            self.index = faiss.IndexFlatL2(384)  # 384 is the embedding dimension for all-MiniLM-L6-v2
            self.metadata = []
    
    def save_index(self):
        faiss.write_index(self.index, settings.FAISS_INDEX_PATH)
        with open("metadata.pkl", "wb") as f:
            pickle.dump(self.metadata, f)
    
    def embed_text(self, text: str) -> np.ndarray:
        embedding = self.model.encode(text)
        return embedding.reshape(1, -1)
    
    def add_document_chunks(self, doc_id: int, chunks: list):
        embeddings = self.model.encode(chunks)
        self.index.add(embeddings)
        
        for chunk in chunks:
            self.metadata.append((doc_id, chunk))
        
        self.save_index()
    
    def search(self, query: str, top_k: int = 5) -> list:
        query_embedding = self.embed_text(query)
        distances, indices = self.index.search(query_embedding, top_k)
        
        results = []
        for idx in indices[0]:
            if idx < len(self.metadata):
                doc_id, chunk = self.metadata[idx]
                results.append({
                    "document_id": doc_id,
                    "content": chunk,
                    "relevance_score": float(distances[0][list(indices[0]).index(idx)])
                })
        
        return results

embedding_manager = EmbeddingManager()