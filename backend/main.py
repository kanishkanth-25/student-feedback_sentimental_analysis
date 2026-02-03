from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
from models import Base, FeedbackModel, FeedbackCreate, FeedbackResponse, AdminLogin
from sentiment import analyze_sentiment
import os
import datetime

app = FastAPI(title="Student Feedback API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In real world, restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./feedback.db")
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)
Base.metadata.create_all(bind=engine)

def get_db():
    db = Session(bind=engine)
    try:
        yield db
    finally:
        db.close()

@app.post("/feedback", response_model=FeedbackResponse)
def submit_feedback(feedback: FeedbackCreate, db: Session = Depends(get_db)):
    # Perform sentiment analysis
    analysis = analyze_sentiment(feedback.text)
    
    db_feedback = FeedbackModel(
        student_id=feedback.student_id,
        category=feedback.category,
        location=feedback.location or "Main Block",
        text=feedback.text,
        sentiment_label=analysis["label"],
        sentiment_score=analysis["score"],
        aspects=analysis.get("aspects", ""),
        status="PENDING"
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

@app.patch("/feedback/{feedback_id}/resolve")
def resolve_feedback(feedback_id: int, resolution: dict, db: Session = Depends(get_db)):
    db_feedback = db.query(FeedbackModel).filter(FeedbackModel.id == feedback_id).first()
    if not db_feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    
    db_feedback.status = "RESOLVED"
    db_feedback.resolution_note = resolution.get("note", "Resolved by Admin")
    db_feedback.created_at = datetime.datetime.utcnow() # Update timestamp to move to top of history if needed
    db.commit()
    return {"status": "success"}

@app.post("/upload-feedback")
async def upload_feedback(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Supported formats: CSV, XLSX
    contents = await file.read()
    filename = file.filename.lower()
    
    try:
        if filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        elif filename.endswith('.xlsx') or filename.endswith('.xls'):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Invalid file format. Please upload CSV or Excel.")
            
        required_cols = {'category', 'text', 'student_id'}
        if not required_cols.issubset(df.columns.str.lower()):
            raise HTTPException(status_code=400, detail=f"Missing required columns: {required_cols}")
            
        # Normalize columns
        df.columns = df.columns.str.lower()
        
        feedback_objects = []
        for _, row in df.iterrows():
            analysis = analyze_sentiment(str(row['text']))
            obj = FeedbackModel(
                student_id=str(row['student_id']),
                category=str(row['category']),
                location=str(row.get('location', 'Main Block')),
                text=str(row['text']),
                sentiment_label=analysis["label"],
                sentiment_score=analysis["score"],
                aspects=analysis.get("aspects", ""),
                status="PENDING"
            )
            feedback_objects.append(obj)
            
        db.bulk_save_objects(feedback_objects)
        db.commit()
        
        return {"status": "success", "count": len(feedback_objects)}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/login")
def login(admin: AdminLogin):
    # Simple hardcoded login as requested
    if admin.username == "admin" and admin.password == "password123":
        return {"status": "success", "token": "fake-admin-token"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/dashboard-data")
def get_dashboard_data(db: Session = Depends(get_db)):
    try:
        feedbacks = db.query(FeedbackModel).order_by(FeedbackModel.created_at.desc()).all()
        
        stats = {
            "total": len(feedbacks),
            "unique_students": len(set(getattr(f, 'student_id', 'Unknown') or 'Unknown' for f in feedbacks)),
            "resolved_count": len([f for f in feedbacks if f.status == "RESOLVED"]),
            "sentiment_counts": {"POSITIVE": 0, "NEGATIVE": 0, "NEUTRAL": 0},
            "category_distribution": {},
            "location_stats": {},
            "temporal_trends": {},
            "ai_summary": "",
            "recent_feed": []
        }
        
        for f in feedbacks:
            label = (getattr(f, 'sentiment_label', 'NEUTRAL') or 'NEUTRAL').upper()
            category = getattr(f, 'category', 'General') or 'General'
            location = getattr(f, 'location', 'Main Block') or 'Main Block'
            date_str = f.created_at.strftime("%Y-%m-%d")
            
            stats["sentiment_counts"][label] = stats["sentiment_counts"].get(label, 0) + 1
            stats["category_distribution"][category] = stats["category_distribution"].get(category, 0) + 1
            stats["location_stats"][location] = stats["location_stats"].get(location, 0) + 1
            
            # Temporal trends logic
            if date_str not in stats["temporal_trends"]:
                stats["temporal_trends"][date_str] = {"POSITIVE": 0, "NEGATIVE": 0, "NEUTRAL": 0}
            stats["temporal_trends"][date_str][label] += 1
            
            if len(stats["recent_feed"]) < 15:
                stats["recent_feed"].append({
                    "id": f.id,
                    "student_id": f.student_id,
                    "category": f.category,
                    "location": location,
                    "text": f.text,
                    "status": f.status,
                    "sentiment_label": f.sentiment_label,
                    "sentiment_score": round(f.sentiment_score, 2),
                    "created_at": f.created_at.isoformat()
                })

        # Simple AI Summary Synthesis
        neg_feedbacks = [f.text for f in feedbacks if f.sentiment_label == "NEGATIVE"]
        if neg_feedbacks:
            stats["ai_summary"] = f"Critical focus areas: {', '.join(set(f.category for f in feedbacks if f.sentiment_label == 'NEGATIVE'))}. Recurring themes detected: {neg_feedbacks[0][:50]}..."
        else:
            stats["ai_summary"] = "Sentiment trajectory is optimal. No critical architectural issues detected across segments."
            
        return stats
    except Exception as e:
        print(f"CRITICAL ERROR: {e}")
        return {
            "total": 0, "unique_students": 0, "resolved_count": 0,
            "sentiment_counts": {"POSITIVE": 0, "NEGATIVE": 0, "NEUTRAL": 0},
            "category_distribution": {}, "location_stats": {}, "temporal_trends": {},
            "ai_summary": "System diagnostic failed.", "recent_feed": []
        }
