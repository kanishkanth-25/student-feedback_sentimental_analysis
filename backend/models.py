from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
import datetime
from typing import List, Optional

# Database Configuration
# Default to SQLite for easy hackathon setup, easily switch to Postgres
DATABASE_URL = "sqlite:///./feedback.db"

# Base class for SQLAlchemy models
Base = declarative_base()

class FeedbackModel(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, index=True)
    category = Column(String, index=True)
    location = Column(String, default="Main Block")  # For Geo-Spatial Analytics
    text = Column(Text)
    sentiment_label = Column(String)
    sentiment_score = Column(Float)
    status = Column(String, default="PENDING")  # PENDING, RESOLVED
    resolution_note = Column(Text, nullable=True)
    aspects = Column(String) 
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# Pydantic Schemas
class FeedbackCreate(BaseModel):
    category: str
    text: str
    student_id: str
    location: Optional[str] = "Main Block"

class FeedbackResponse(FeedbackCreate):
    id: int
    sentiment_label: str
    sentiment_score: float
    status: str
    resolution_note: Optional[str]
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class AdminLogin(BaseModel):
    username: str
    password: str
